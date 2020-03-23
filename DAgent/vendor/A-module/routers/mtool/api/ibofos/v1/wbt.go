package v1

import (
	"A-module/routers/mtool/model"
)

func WBTTest(xrId string, param model.WBTParam) (model.Response, error) {
	return Requester{xrId, param}.Wbt("WBT")
}

func WBTList(xrId string, param model.WBTParam) (model.Response, error) {
	return Requester{xrId, param}.Wbt("LISTWBT")
}