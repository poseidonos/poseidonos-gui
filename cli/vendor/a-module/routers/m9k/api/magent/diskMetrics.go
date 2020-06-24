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
	"github.com/influxdata/influxdb/client/v2"
)

type diskField struct {
	Time      string
	UsageUser json.Number
}

type diskFields []diskField

// Collecting Disk data based time parameter and retuning JSON resonse
func GetDiskData(xrId string, param interface{}) (model.Response, error) {
	var res model.Response
	var err error
	DBClient, err := ConnectDB()
	defer DBClient.Close()
	var cmd string
	var result []client.Result
	FieldsList := make(diskFields, 0)

	if err != nil {
		res.Result.Status.Description = ConnErrMsg
		return res, err
	}

	ParamStruct := param.(model.MAgentParam)

	if ParamStruct.Time != "" {
		TimeInterval := param.(model.MAgentParam).Time
		if _, found := TimeGroupsDefault[TimeInterval]; !found {
			res.Result.Status.Description = EndPointErrMsg
			return res, err
		}
		if Contains(AggTime, TimeInterval) {
			cmd = "SELECT \"used\" AS \"mean_used\" FROM \"" + DBName + "\".\"" + AggRP + "\".\"mean_disk\" WHERE time > now() - " + TimeInterval
		} else {
			cmd = "SELECT mean(\"used\") AS \"mean_used\" FROM \"" + DBName + "\".\"" + DefaultRP + "\".\"disk\" WHERE time > now() - " + TimeInterval + " GROUP BY time(" + TimeGroupsDefault[TimeInterval] + ")"
		}
	} else {
		cmd = "SELECT last(\"used\") AS \"mean_used\" FROM \"" + DBName + "\".\"" + DefaultRP + "\".\"disk\" LIMIT 1"
	}

	QueryObject := client.Query{
		Command:  cmd,
		Database: DBName,
	}
	if response, err := DBClient.Query(QueryObject); err == nil {
		if response.Error() != nil {
			res.Result.Status.Description = QueryErrMsg
			return res, err
		}
		result = response.Results

	} else {
		res.Result.Status.Description = QueryErrMsg
		return res, err
	}
	if len(result) == 0 || len(result[0].Series) == 0 {
		res.Result.Status.Description = DataErrMsg
		return res, err
	}
	for _, Values := range result[0].Series[0].Values {
		if Values[1] != nil {
			FieldsList = append(FieldsList, diskField{Values[0].(string), Values[1].(json.Number)})
		}
	}

	res.Result.Status.Code = 0
	res.Result.Status.Description = "DONE"
	res.Result.Data = FieldsList
	return res, err
}
