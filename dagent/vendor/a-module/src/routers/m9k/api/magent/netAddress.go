package magent

import (
	"a-module/src/routers/m9k/model"
	"fmt"
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
	result, err := ExecuteQuery(fmt.Sprintf(netAddQ, DBName))

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
			fieldsList = append(fieldsList, NetAddsField{values[1].(string), values[2].(string)})
		}
	}

	res.Result.Status.Code = 0
	res.Result.Status.Description = "DONE"
	res.Result.Data = fieldsList

	return res, nil
}
