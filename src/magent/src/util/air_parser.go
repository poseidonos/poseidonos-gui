/*
 *   BSD LICENSE
 *   Copyright (c) 2021 Samsung Electronics Corporation
 *   All rights reserved.
 *
 *   Redistribution and use in source and binary forms, with or without
 *   modification, are permitted provided that the following conditions
 *   are met:
 *
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in
 *       the documentation and/or other materials provided with the
 *       distribution.
 *     * Neither the name of Intel Corporation nor the names of its
 *       contributors may be used to endorse or promote products derived
 *       from this software without specific prior written permission.
 *
 *   THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 *   "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 *   LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 *   A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 *   OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 *   SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 *   LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 *   DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 *   THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 *   (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 *   OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
 
package util

import (
	"bytes"
	"encoding/json"
	"fmt"
	"magent/src/models"
	"strconv"
)

var keyHashMap = map[string][]string{
	"AIR_READ":  {"read_bw", "read_iops"},
	"AIR_WRITE": {"write_bw", "write_iops"},
}

func parseIds(k string) (string, string) {
	if k == "" {
		return "0", "0"
	}
	index, err := strconv.Atoi(k) //string to int
	if err != nil {
		fmt.Println(err)
	}
	var aId = index & 65280 // masking last 16 bits
	var vId = index & 255   // masking first 16 bits
	aId = aId >> 8
	arrId := strconv.Itoa(aId) // int to string
	volId := strconv.Itoa(vId) // int to string
	return arrId, volId
}

func FormatAIRJSON(buf []byte, points *[]models.AIRPoint) error {
	var airData map[string]interface{}
	buf = bytes.TrimSpace(buf)
	buf = bytes.TrimPrefix(buf, []byte("\xef\xbb\xbf"))
	err := json.Unmarshal(buf, &airData)
	if err != nil {
		return err
	}
	//arrayId := "0"
	timestamp := airData["timestamp"]
	node := airData["group"].(map[string]interface{})["M9K"].(map[string]interface{})["node"].(map[string]interface{})
	writeLatency := node["LAT_VOLUME_WRITE"].(map[string]interface{})["objs"].([]interface{})
	readLatency := node["LAT_VOLUME_READ"].(map[string]interface{})["objs"].([]interface{})
	perfData := node["PERF_VOLUME"].(map[string]interface{})["objs"].([]interface{})
        /*writeLatency := node["LAT_ARR_VOL_WRITE"].(map[string]interface{})["objs"].([]interface{})
        readLatency := node["LAT_ARR_VOL_READ"].(map[string]interface{})["objs"].([]interface{})
        perfData := node["PERF_ARR_VOL"].(map[string]interface{})["objs"].([]interface{})*/
	valMap := make(map[string]map[string]interface{})
	parseData(writeLatency, "mean", "write_latency", &valMap, true)
	parseData(readLatency, "mean", "read_latency", &valMap, true)
	parseData(perfData, "", "", &valMap, false)

	for k, v := range valMap {
		airPoint := models.AIRPoint{}
		arrId, volId := parseIds(k)
		airPoint.Tags = map[string]string{
			"vol_id": volId,
			"arr_id": arrId,
		}
		airPoint.Timestamp = timestamp.(float64)
		airPoint.Fields = v
		*points = append(*points, airPoint)
	}
	return err
}

func parseData(data []interface{}, dataKey, mapKey string, valMap *map[string]map[string]interface{}, isLatency bool) {
	for i := 0; i < len(data); i++ {
		d := data[i].(map[string]interface{})
		if isLatency == false {
			filter := d["filter"].(string)
			filterData(d, "bw", keyHashMap[filter][0], valMap)
			filterData(d, "iops", keyHashMap[filter][1], valMap)
		} else {
			filterData(d, dataKey, mapKey, valMap)
		}
	}
}
func filterData(d map[string]interface{}, dataKey, mapKey string, valMap *map[string]map[string]interface{}) {
	if d[dataKey] != nil {
		volId := fmt.Sprintf("%.0f", d["index"])
		if val, ok := (*valMap)[volId]; ok {
			if _, valOK := val[mapKey]; valOK {
				(*valMap)[volId][mapKey] = (val[mapKey].(float64) + d[dataKey].(float64))
			} else {
				(*valMap)[volId][mapKey] = d[dataKey]
			}
		} else {
			(*valMap)[volId] = map[string]interface{}{}
			(*valMap)[volId][mapKey] = d[dataKey]
		}
	}

}
