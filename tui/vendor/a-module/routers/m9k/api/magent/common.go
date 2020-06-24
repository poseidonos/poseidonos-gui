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
	"github.com/influxdata/influxdb/client/v2"
)

func ExecuteQuery(query string) ([]client.Result, string) {
	var result []client.Result
	var errMsg = ""
	dbClient, err := ConnectDB()
	defer dbClient.Close()
	if err != nil {
		errMsg = ConnErrMsg
		return result, errMsg
	}
	queryObject := client.Query{
		Command:  query,
		Database: DBName,
	}
	if response, err := dbClient.Query(queryObject); err == nil {
		if response.Error() != nil {
			errMsg = QueryErrMsg
		}
		result = response.Results

	} else {
		errMsg = QueryErrMsg
	}
	return result, errMsg

}
