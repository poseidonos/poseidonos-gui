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
 *     * Neither the name of Samsung Electronics Corporation nor the names of its
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
	"time"
)

// Contains function chcks if a string is present in an array of strings
func Contains(arr []string, element string) bool {
	for _, n := range arr {
		if element == n {
			return true
		}
	}
	return false
}

// CPUField stores the cpu response structure
type CPUField struct {
	Time      json.Number `json:"time"`
	UsageUser json.Number `json:"cpuUsagePercent"`
}

type Time struct {
	StartTime int64 `json:"startTime"`
	EndTime   int64 `json:"endTime"`
}
type Times []Time

// CPUFields is an array of CPUField
type CPUFields []CPUField

// GetCPUData is for getting CPU data based time parameter and retuning JSON resonse
func GetCPUData(param interface{}) (model.Response, error) {
	var res model.Response
	var query string
	fieldsList := make(CPUFields, 0)
	paramStruct := param.(model.MAgentParam)
	timeVal := make(Times, 0)
	currentTime := time.Now().UnixNano()
	timeVal = append(timeVal, Time{currentTime - TimeSecondsMap[paramStruct.Time], currentTime})
	var resultList []interface{}
	if paramStruct.Time != "" {
		timeInterval := param.(model.MAgentParam).Time
		if _, found := TimeGroupsDefault[timeInterval]; !found {
			res.Result.Status, _ = util.GetStatusInfo(errEndPointCode)
			res.Result.Data = make([]string, 0)
			return res, nil
		}
		if Contains(AggTime, timeInterval) {
			query = fmt.Sprintf(cpuAggRPQ, DBName, AggRP, timeInterval)
		} else {
			query = fmt.Sprintf(cpuDefaultRPQ, DBName, DefaultRP, timeInterval, TimeGroupsDefault[timeInterval])
		}
	} else {
		query = fmt.Sprintf(cpuLastRecordQ, DBName, DefaultRP)
	}

	result, err := ExecuteQuery(query)
	if err != nil {
		res.Result.Status, _ = util.GetStatusInfo(errQueryCode)
		res.Result.Data = make([]string, 0)
		return res, nil
	}

	if len(result) == 0 || len(result[0].Series) == 0 {
		res.Result.Status, _ = util.GetStatusInfo(0)
		res.Result.Data = make([]string, 0)
		return res, nil
	}

	for _, values := range result[0].Series[0].Values {
		if values[1] != nil {
			fieldsList = append(fieldsList, CPUField{values[0].(json.Number), values[1].(json.Number)})
		}
	}
	res.Result.Status, _ = util.GetStatusInfo(0)
	resultList = append(resultList, fieldsList)
	resultList = append(resultList, timeVal)
	res.Result.Data = resultList
	return res, nil
}
