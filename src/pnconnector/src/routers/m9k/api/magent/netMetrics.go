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

type NetField struct {
	Time        interface{} `json:"time"`
	BytesRecv   json.Number `json:"bytesRecv"`
	BytesSent   json.Number `json:"bytesSent"`
	DropIn      json.Number `json:"dropIn"`
	DropOut     json.Number `json:"dropOut"`
	ErrIn       json.Number `json:"errIn"`
	ErrOut      json.Number `json:"errIn"`
	PacketsRecv json.Number `json:"packetsRecv"`
	PacketsSent json.Number `json:"packetsSent"`
}

type NetFields []NetField

// Getting network data based time parameter and retuning JSON resonse
func GetNetData(param interface{}) (model.Response, error) {
	var res model.Response
	var query string
	fieldsList := make(NetFields, 0)
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
			query = fmt.Sprintf(netAggRPQ, DBName, AggRP, timeInterval)
		} else {
			query = fmt.Sprintf(netDefaultRPQ, DBName, DefaultRP, timeInterval, TimeGroupsDefault[timeInterval])
		}
	} else {
		query = fmt.Sprintf(netLastRecordQ, DBName, DefaultRP)
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
			if paramStruct.Time != "" {
				fieldsList = append(fieldsList, NetField{values[0].(json.Number), values[1].(json.Number), values[2].(json.Number), values[3].(json.Number), values[4].(json.Number), values[5].(json.Number), values[6].(json.Number), values[7].(json.Number), values[8].(json.Number)})
			} else {
				fieldsList = append(fieldsList, NetField{currentTime, values[1].(json.Number), values[2].(json.Number), values[3].(json.Number), values[4].(json.Number), values[5].(json.Number), values[6].(json.Number), values[7].(json.Number), values[8].(json.Number)})
			}
		}
	}
	res.Result.Status, _ = util.GetStatusInfo(0)
	resultList = append(resultList, fieldsList)
	resultList = append(resultList, timeVal)
	res.Result.Data = resultList
	return res, nil
}
