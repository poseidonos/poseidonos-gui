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
)

// LogsField defines the structure in which log data is returned
type LogsField struct {
	Time  json.Number
	Value string
}

// LogsFields is an array of LogsField
type LogsFields []LogsField

// GetRebuildLogs gets the logs from influxdb and returns a JSON response
func GetRebuildLogs(param interface{}) (model.Response, error) {
	var res model.Response
	var resp model.Response
	timeInterval := param.(model.MAgentParam).Time
    if _, found := TimeGroupsDefault[timeInterval]; !found {
		resp.Result.Status, _ = util.GetStatusInfo(errEndPointCode)
        resp.Result.Data = make([]string, 0)
        return resp, nil
    }
	fieldsList := make(LogsFields, 0)
	query := fmt.Sprintf(RebuildingLogQ, DBName, timeInterval)
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
	for _, Values := range result[0].Series[0].Values {
		if Values[1] != nil {
			fieldsList = append(fieldsList, LogsField{Values[0].(json.Number), Values[1].(string)})
		}
	}
	res.Result.Status, _ = util.GetStatusInfo(0)
	res.Result.Data = fieldsList

	return res, nil
}
