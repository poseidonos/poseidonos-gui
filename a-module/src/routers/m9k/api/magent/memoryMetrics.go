package magent

import (
	"a-module/src/routers/m9k/model"
	"encoding/json"
	"fmt"
)

type MemoryField struct {
	Time      json.Number
	UsageUser json.Number
}

type MemoryFields []MemoryField

// Getting Memory data based time parameter and retuning JSON resonse
func GetMemoryData(param interface{}) (model.Response, error) {
	var res model.Response
	var query string
	fieldsList := make(MemoryFields, 0)
	paramStruct := param.(model.MAgentParam)

	if paramStruct.Time != "" {
		timeInterval := param.(model.MAgentParam).Time
		if _, found := TimeGroupsDefault[timeInterval]; !found {
			res.Result.Status.Description = errEndPoint.Error()
			res.Result.Status.Code = 500
			return res, nil
		}
		if Contains(AggTime, timeInterval) {
			query = fmt.Sprintf(memoryAggRPQ, DBName, AggRP, timeInterval)
		} else {
			query = fmt.Sprintf(memoryDefaultRPQ, DBName, DefaultRP, timeInterval, TimeGroupsDefault[timeInterval])
		}
	} else {
		query = fmt.Sprintf(memoryLastRecordQ, DBName, DefaultRP)
	}

	result, err := ExecuteQuery(query)

	if err != nil {
		res.Result.Status.Description = err.Error()
		return res, nil
	}

	if len(result) == 0 || len(result[0].Series) == 0 {
		res.Result.Status.Description = errData.Error()
		res.Result.Status.Code = 500
		return res, nil
	}
	for _, values := range result[0].Series[0].Values {
		if values[1] != nil {
			fieldsList = append(fieldsList, MemoryField{values[0].(json.Number), values[1].(json.Number)})
		}
	}

	res.Result.Status.Code = 0
	res.Result.Status.Description = "DONE"
	res.Result.Data = fieldsList
	return res, nil
}
