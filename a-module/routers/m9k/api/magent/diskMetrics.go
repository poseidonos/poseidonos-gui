package magent

import (
	"a-module/routers/m9k/model"
	"encoding/json"
	"fmt"
)

type DiskField struct {
	Time           string
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
			res.Result.Status.Description = errEndPoint.Error()
			return res, nil
		}
		if Contains(AggTime, timeInterval) {
			query = fmt.Sprintf(diskAggRPQ, DBName, AggRP, timeInterval)
		} else {
			query = fmt.Sprintf(diskDefaultRPQ, DBName, DefaultRP, timeInterval, TimeGroupsDefault[timeInterval])
		}
	} else {
		query = fmt.Sprintf(diskLastRecordQ, DBName, DefaultRP)
	}

	result, err := ExecuteQuery(query)
	if err != nil {
		res.Result.Status.Description = err.Error()
		return res, nil
	}

	if len(result) == 0 || len(result[0].Series) == 0 {
		res.Result.Status.Description = errData.Error()
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
