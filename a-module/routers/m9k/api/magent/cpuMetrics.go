/*
In this code we are using gin framework and influxdb golang client libraries
Gin is a web framework written in Go (Golang). It features a martini-like API with performance that is up to 40 times faster than other frameworks


DESCRIPTION: <File description> *
NAME : main.go
@AUTHORS: Vishal Shakya
@Version : 1.0 *
@REVISION HISTORY
[5/27/2020] [vishal] : Prototyping..........////////////////////

*/

package magent

import (
	"a-module/routers/m9k/model"
	"encoding/json"
)

func Contains(arr []string, element string) bool {
	for _, n := range arr {
		if element == n {
			return true
		}
	}
	return false
}

type Field struct {
	Time      string
	UsageUser json.Number
}

type Fields []Field

// Getting CPU data based time parameter and retuning JSON resonse
func GetCPUData(xrId string, param interface{}) (model.Response, error) {
	var res model.Response
	var err error
	DBClient, err := ConnectDB()
	defer DBClient.Close()
	var cmd string
	var result []client.Result
	FieldsList := make(Fields, 0)

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
			cmd = "SELECT \"usage_user\" AS \"mean_usage_user\" FROM \"" + DBName + "\".\"" + AggRP + "\".\"mean_cpu\" WHERE time > now() - " + TimeInterval
		} else {
			cmd = "SELECT mean(\"usage_user\") AS \"mean_usage_user\" FROM \"" + DBName + "\".\"" + DefaultRP + "\".\"cpu\" WHERE time > now() - " + TimeInterval + " GROUP BY time(" + TimeGroupsDefault[TimeInterval] + ")"
		}

	} else {
		cmd = "SELECT last(\"usage_user\") AS \"mean_usage_user\" FROM \"" + DBName + "\".\"" + DefaultRP + "\".\"cpu\" LIMIT 1"

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
			FieldsList = append(FieldsList, Field{Values[0].(string), Values[1].(json.Number)})
		}

	}
	res.Result.Status.Code = 0
	res.Result.Status.Description = "DONE"
	res.Result.Data = FieldsList
	return res, err
}
