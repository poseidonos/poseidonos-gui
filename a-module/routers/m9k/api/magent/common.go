package magent

import (
	"github.com/influxdata/influxdb/client/v2"
)

func ExecuteQuery(query string) ([]client.Result, error) {
	var result []client.Result
	var err error
	dbClient, err := ConnectDB()
	defer dbClient.Close()

	if err != nil {
		err = ConnErrMsg
		return result, err
	}

	queryObject := client.Query{
		Command:  query,
		Database: DBName,
	}

	if response, err := dbClient.Query(queryObject); err == nil {
		if response.Error() != nil {
			err = QueryErrMsg
		}
		result = response.Results

	} else {
		err = QueryErrMsg
	}
	return result, err
}
