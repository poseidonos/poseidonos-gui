package magent

import (
	"a-module/routers/m9k/model"
)

type NetDriverField struct {
	Interface string
	Driver    string
}

type NetDriverFields []NetDriverField

// Getting network driver names and retuning JSON resonse
func GetNetDriver(param interface{}) (model.Response, error) {
	var res model.Response
	fieldsList := make(NetDriverFields, 0)
	result, err := ExecuteQuery(NetDriverQ)

	if err != nil {
		res.Result.Status.Description = err.Error()
		return res, nil
	}

	if len(result) == 0 || len(result[0].Series) == 0 {
		res.Result.Status.Description = DataErrMsg.Error()
		return res, nil
	}

	for _, values := range result[0].Series[0].Values {
		if values[1] != nil {
			fieldsList = append(fieldsList, NetDriverField{values[1].(string), values[2].(string)})
		}
	}

	res.Result.Status.Code = 0
	res.Result.Status.Description = "DONE"
	res.Result.Data = fieldsList

	return res, nil
}
