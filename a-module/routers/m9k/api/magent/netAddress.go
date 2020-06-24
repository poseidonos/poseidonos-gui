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
)

type NetAddsField struct {
	Interface string
	Address   string
}

type NetAddsFields []NetAddsField

// Getting network address  and retuning JSON resonse
func GetNetAddress(param interface{}) (model.Response, error) {
	var res model.Response
	fieldsList := make(NetAddsFields, 0)
	result, errMsg := ExecuteQuery(NetAddQ)
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
			fieldsList = append(fieldsList, NetAddsField{values[1].(string), values[2].(string)})
		}
	}

	res.Result.Status.Code = 0
	res.Result.Status.Description = "DONE"
	res.Result.Data = fieldsList

	return res, nil
}
