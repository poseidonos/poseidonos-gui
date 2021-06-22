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
 
package magent

import (
	"encoding/json"
	"fmt"
	"pnconnector/src/routers/m9k/model"
	"pnconnector/src/util"
	"strconv"
	"strings"
  "time"
)

// GetAIRData fetches AIR data from influx db based on time parameter and returns the values and fields
func GetAIRData(param interface{}, AggRPQ, DefaultRPQ, LastRecordQ, startingTime string, volumeIds string, arrayId string) ([][]interface{}, []string, int) {
	var query string
	paramStruct := param.(model.MAgentParam)
	if paramStruct.Time != "" {
		timeInterval := param.(model.MAgentParam).Time
		if _, found := TimeGroupsDefault[timeInterval]; !found {
			return nil, nil, errEndPointCode
		}
		if Contains(AggTime, timeInterval) {
			if volumeIds== "" {
				query = fmt.Sprintf(AggRPQ, DBName, AggRP, timeInterval, startingTime, arrayId)
			} else {
				query = fmt.Sprintf(AggRPQ, DBName, AggRP, timeInterval, startingTime, volumeIds, arrayId)
			}
		} else {
			if volumeIds == "" {
				query = fmt.Sprintf(DefaultRPQ, DBName, DefaultRP, timeInterval, arrayId, TimeGroupsDefault[timeInterval])
			} else {
				query = fmt.Sprintf(DefaultRPQ, DBName, DefaultRP, timeInterval, startingTime, volumeIds, arrayId, TimeGroupsDefault[timeInterval])
			}
		}

	} else {
		if volumeIds == "" {
			query = fmt.Sprintf(LastRecordQ, DBName, DefaultRP, arrayId)
		} else {
			query = fmt.Sprintf(LastRecordQ, DBName, DefaultRP, volumeIds, arrayId)
		}
	}
	result, err := ExecuteQuery(query)
	if err != nil {
		return nil, nil, errQueryCode
	}

	if len(result) == 0 || len(result[0].Series) == 0 {
		return nil, nil, 0
	}
	return result[0].Series[0].Values, result[0].Series[0].Columns, 0
}

// extractValues contains the parsing logic for extracting array level and volume level data
func extractValues(values [][]interface{}, columns []string, key, metrics, metricOps string, timeInterval string) [][]map[string]interface{} {
	result := []map[string]interface{}{}
  timeMap := []map[string]interface{}{}
  m := map[string]interface{}{}
  currentTime := time.Now().UnixNano()
  m["startTime"] = currentTime - TimeSecondsMap[timeInterval]
  m["endTime"] = currentTime
  timeMap = append(timeMap,m)
  var resultList [][]map[string]interface{}
	for _, val := range values {
		currentValue := make(map[string]interface{})
		currentValue["time"] = val[0]
		if val[1] == nil {
			val[1] = json.Number(strconv.FormatInt(0, 10))
		}
		currentValue[key] = val[1].(json.Number)
		result = append(result, currentValue)
	}
  resultList = append(resultList,result)
  resultList = append(resultList,timeMap)
	return resultList
}

func getVolumeCreationTime(volumeId string) string {
	volQuery := fmt.Sprintf(VolumeQuery, DBName, DefaultRP, volumeId)
	result, err := ExecuteQuery(volQuery)
	if err != nil || len(result) == 0 || len(result[0].Series) == 0 {
		return "0"
	}
	for index, column := range result[0].Series[0].Columns {
		if column == "time" {
			return string(result[0].Series[0].Values[index][0].(json.Number))
		}
	}
	return "0"
}
func parseIds(param interface{}) (string, string) {
  volumeIds := param.(model.MAgentParam).VolumeIds
  arrayIds := param.(model.MAgentParam).ArrayIds
  arrayIds = strings.ReplaceAll(arrayIds, ",", "|")
  arrayIds = "/"+arrayIds+"/"
  if volumeIds != "" {
    volumeIds = strings.ReplaceAll(volumeIds, ",", "|")
    volumeIds = "/"+volumeIds+"/"
  }
  return arrayIds, volumeIds

}
// GetReadBandwidth returns metrics related to Read Bandwidth
func GetReadBandwidth(param interface{}) (model.Response, error) {
	var result model.Response
	var values [][]interface{}
	var columns []string
	var statusCode int
  arrayIds, volumeIds := parseIds(param)
  startingTime := getVolumeCreationTime(volumeIds)
	if volumeIds == "" {
		values, columns, statusCode = GetAIRData(param, ReadBandwidthAggRPQArr, ReadBandwidthDefaultRPQArr, ReadBandwidthLastRecordQArr, startingTime, volumeIds, arrayIds)
	} else {
		values, columns, statusCode = GetAIRData(param, ReadBandwidthAggRPQVol, ReadBandwidthDefaultRPQVol, ReadBandwidthLastRecordQVol, startingTime, volumeIds, arrayIds)
	}
	result.Result.Status, _ = util.GetStatusInfo(statusCode)
	if statusCode != 0 {
		result.Result.Data = make([]string, 0)
		return result, nil
	}
  timeInterval := param.(model.MAgentParam).Time
	res := extractValues(values, columns, "bw", "bw", BWReadField,timeInterval)
  result.Result.Data = res
	return result, nil
}

// GetWriteBandwidth returns the metrics related to Write Bandwidth
func GetWriteBandwidth(param interface{}) (model.Response, error) {
	var result model.Response
	var values [][]interface{}
	var columns []string
	var statusCode int
  arrayIds, volumeIds := parseIds(param)
	startingTime := getVolumeCreationTime(volumeIds)
	if volumeIds == "" {
		values, columns, statusCode = GetAIRData(param, WriteBandwidthAggRPQArr, WriteBandwidthDefaultRPQArr, WriteBandwidthLastRecordQArr, startingTime, volumeIds, arrayIds)
	} else {
		values, columns, statusCode = GetAIRData(param, WriteBandwidthAggRPQVol, WriteBandwidthDefaultRPQVol, WriteBandwidthLastRecordQVol, startingTime, volumeIds, arrayIds)
	}
	result.Result.Status, _ = util.GetStatusInfo(statusCode)
	if statusCode != 0 {
		result.Result.Data = make([]string, 0)
		return result, nil
	}
  timeInterval := param.(model.MAgentParam).Time
	res := extractValues(values, columns, "bw", "bw", BWWriteField, timeInterval)
	result.Result.Data = res
	return result, nil
}

// GetReadIOPS returns the metrics related to Read IOPS
func GetReadIOPS(param interface{}) (model.Response, error) {
	var result model.Response
	var values [][]interface{}
	var columns []string
	var statusCode int
  arrayIds, volumeIds := parseIds(param)
	startingTime := getVolumeCreationTime(volumeIds)
	if volumeIds == "" {
		values, columns, statusCode = GetAIRData(param, ReadIOPSAggRPQArr, ReadIOPSDefaultRPQArr, ReadIOPSLastRecordQArr, startingTime, volumeIds, arrayIds)
	} else {
		values, columns, statusCode = GetAIRData(param, ReadIOPSAggRPQVol, ReadIOPSDefaultRPQVol, ReadIOPSLastRecordQVol, startingTime, volumeIds, arrayIds)
	}
	result.Result.Status, _ = util.GetStatusInfo(statusCode)
	if statusCode != 0 {
		result.Result.Data = make([]string, 0)
		return result, nil
	}
  timeInterval := param.(model.MAgentParam).Time
	res := extractValues(values, columns, "iops", "iops", IOPSReadField,timeInterval)
	result.Result.Data = res
	return result, nil
}

// GetWriteIOPS returns the metrics related to Write IOPS
func GetWriteIOPS(param interface{}) (model.Response, error) {
	var result model.Response
	var values [][]interface{}
	var columns []string
	var statusCode int
  arrayIds, volumeIds := parseIds(param)
	startingTime := getVolumeCreationTime(volumeIds)
	if volumeIds == "" {
		values, columns, statusCode = GetAIRData(param, WriteIOPSAggRPQArr, WriteIOPSDefaultRPQArr, WriteIOPSLastRecordQArr, startingTime, volumeIds, arrayIds)
	} else {
		values, columns, statusCode = GetAIRData(param, WriteIOPSAggRPQVol, WriteIOPSDefaultRPQVol, WriteIOPSLastRecordQVol, startingTime, volumeIds, arrayIds)
	}
	result.Result.Status, _ = util.GetStatusInfo(statusCode)
	if statusCode != 0 {
		result.Result.Data = make([]string, 0)
		result.Result.Status, _ = util.GetStatusInfo(statusCode)
		return result, nil
	}
  timeInterval := param.(model.MAgentParam).Time
	res := extractValues(values, columns, "iops", "iops", IOPSWriteField,timeInterval)
	result.Result.Data = res
	return result, nil
}

// GetLatency collects the latency metrics from influxdb
func GetLatency(param interface{}) (model.Response, error) {
	var result model.Response
	var values [][]interface{}
	var columns []string
	var statusCode int
  arrayIds, volumeIds := parseIds(param)
	startingTime := getVolumeCreationTime(volumeIds)
	if volumeIds == "" {
		values, columns, statusCode = GetAIRData(param, LatencyAggRPQArr, LatencyDefaultRPQArr, LatencyLastRecordQArr, startingTime, volumeIds, arrayIds)
	} else {
		values, columns, statusCode = GetAIRData(param, LatencyAggRPQVol, LatencyDefaultRPQVol, LatencyLastRecordQVol, startingTime, volumeIds, arrayIds)
	}
	result.Result.Status, _ = util.GetStatusInfo(statusCode)
	if statusCode != 0 {
		result.Result.Data = make([]string, 0)
		return result, nil
	}
  timeInterval := param.(model.MAgentParam).Time
	res := extractValues(values, columns, "latency", "latency", LatencyField,timeInterval)
	result.Result.Data = res
	return result, nil
}
