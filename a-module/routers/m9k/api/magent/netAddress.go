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
	"github.com/influxdata/influxdb/client/v2"
)

type NetAddsField struct {
	Interface		string
	Address			string
}

type NetAddsFields []NetAddsField

// Getting network address  and retuning JSON resonse
func GetNetAddress(xrId string, param interface{}) (model.Response, error) {
	var res model.Response
	var err error
	DBClient, err := ConnectDB()
	defer DBClient.Close()
	var cmd string
	var result []client.Result
	FieldsList := make(NetAddsFields, 0)

	if err != nil {
		res.Result.Status.Description = ConnErrMsg
		return res, err
	}
	
	cmd = "SELECT \"time\",\"name\" ,\"address\" FROM \"" + DBName + "\".\"autogen\".\"ethernet\""

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
			FieldsList = append(FieldsList, NetAddsField{Values[1].(string), Values[2].(string)})
		}
	}
	res.Result.Status.Code = 0
	res.Result.Status.Description = "DONE"
	res.Result.Data = FieldsList

	return res, err
}
