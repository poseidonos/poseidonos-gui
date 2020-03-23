package v1

import (
	"A-module/routers/mtool/model"
)

func ListArrayDevice(xrId string, param model.ArrayParam) (model.Request, int, error) {
	return Requester{xrId, param}.Get("LISTARRAYDEVICE")
}

func LoadArray(xrId string, param model.ArrayParam) (model.Request, int, error) {
	return Requester{xrId, param}.Get("LOADARRAY")
}

func CreateArray(xrId string, param model.ArrayParam) (model.Request, int, error) {
	return Requester{xrId, param}.Post("CREATEARRAY")
}

func DeleteArray(xrId string, param model.ArrayParam) (model.Request, int, error) {
	return Requester{xrId, param}.Delete("DELETEARRAY")
}
