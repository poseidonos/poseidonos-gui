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

type NetField struct {
	Time        string
	BytesRecv   json.Number
	BytesSent   json.Number
	DropIn      json.Number
	DropOut     json.Number
	ErrIn       json.Number
	ErrOut      json.Number
	PacketsRecv json.Number
	PacketsSent json.Number
}

type NetFields []NetField

// Getting network data based time parameter and retuning JSON resonse
func GetNetData(xrId string, param interface{}) (model.Response, error) {
	var res model.Response
	var err error
	DBClient, err := ConnectDB()
	defer DBClient.Close()
	var cmd string
	var result []client.Result
	FieldsList := make(NetFields, 0)

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
			cmd = "SELECT mean(\"bytes_recv\") ,mean(\"bytes_sent\"), mean(\"drop_in\"), mean(\"drop_out\"), mean(\"err_in\"), mean(\"err_out\"), mean(\"packets_recv\"), mean(\"packets_sent\")  FROM \"" + DBName + "\".\"" + AggRP + "\".\"net\" WHERE time > now() - " + TimeInterval
		} else {
			cmd = "SELECT mean(\"bytes_recv\") ,mean(\"bytes_sent\"), mean(\"drop_in\"), mean(\"drop_out\"), mean(\"err_in\"), mean(\"err_out\"), mean(\"packets_recv\"), mean(\"packets_sent\")  FROM \"" + DBName + "\".\"" + DefaultRP + "\".\"net\" WHERE time > now() - " + TimeInterval + " GROUP BY time(" + TimeGroupsDefault[TimeInterval] + ")"
		}
	} else {
		cmd = "SELECT mean(\"bytes_recv\") AS \"mean_usage_user1\" ,mean(\"bytes_sent\") AS \"mean_usage_user2\", mean(\"drop_in\")  ,mean(\"drop_out\"),mean(\"err_in\"),mean(\"err_out\"),mean(\"packets_recv\"),mean(\"packets_sent\")  FROM \"" + DBName + "\".\"" + DefaultRP + "\".\"net\" LIMIT 1"
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
			FieldsList = append(FieldsList, NetField{Values[0].(string), Values[1].(json.Number), Values[2].(json.Number), Values[3].(json.Number), Values[4].(json.Number), Values[5].(json.Number), Values[6].(json.Number), Values[7].(json.Number), Values[8].(json.Number)})
		}
	}

	res.Result.Status.Code = 0
	res.Result.Status.Description = "DONE"
	res.Result.Data = FieldsList

	return res, err
}
