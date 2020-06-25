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
