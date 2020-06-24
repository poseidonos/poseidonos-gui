/*
In this code we are using gin framework and influxdb golang client libraries
Gin is a web framework written in Go (Golang). It features a martini-like API with performance that is up to 40 times faster than other frameworks


DESCRIPTION: <File description> *
NAME : diskMetrics.go
@AUTHORS: Jay Sanghavi
@Version : 1.0 *
@REVISION HISTORY
[5/27/2020] [Jay] : Prototyping..........////////////////////

*/

package magent

import (
	"a-module/routers/m9k/model"
	"encoding/json"
	"fmt"
)

type DiskField struct {
	Time      string
	UsageUserBytes json.Number
}

type DiskFields []DiskField

// Getting Disk data based time parameter and retuning JSON resonse
func GetDiskData(param interface{}) (model.Response, error) {
	var res model.Response
	var query string
	fieldsList := make(DiskFields, 0)
	paramStruct := param.(model.MAgentParam)
	if paramStruct.Time != "" {
		timeInterval := param.(model.MAgentParam).Time
		if _, found := TimeGroupsDefault[timeInterval]; !found {
			res.Result.Status.Description = EndPointErrMsg
			return res, nil
		}
		if Contains(AggTime, timeInterval) {
			query = fmt.Sprintf(DiskAggRPQ, AggRP, timeInterval)
		} else {
			query = fmt.Sprintf(DiskDefaultRPQ, DefaultRP, timeInterval, TimeGroupsDefault[timeInterval])
		}
	} else {
		query = fmt.Sprintf(DiskLastRecordQ, DefaultRP)
	}
	result, errMsg := ExecuteQuery(query)
	if errMsg != "" {
		res.Result.Status.Description = errMsg
		return res, nil
	}

	if len(result) == 0 || len(result[0].Series) == 0 {
		res.Result.Status.Description = DataErrMsg
		return res, nil
	}
	for _, values := range result[0].Series[0].Values {
		if values[1] != nil {
			fieldsList = append(fieldsList, DiskField{values[0].(string), values[1].(json.Number)})
		}
	}

	res.Result.Status.Code = 0
	res.Result.Status.Description = "DONE"
	res.Result.Data = fieldsList
	return res, nil
}
