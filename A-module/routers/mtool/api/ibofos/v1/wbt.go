package v1

import (
	"A-module/routers/mtool/model"
)

func WBTTest(xrId string, param interface{}) (model.Request, model.Response, error) {
	return Requester{xrId, param}.Wbt("WBT")
}

func WBTList(xrId string, param interface{}) (model.Request, model.Response, error) {
	return Requester{xrId, param}.Wbt("LISTWBT")
}
