package ibofos

import (
	"a-module/src/routers/m9k/model"
)

func ScanDevice(xrId string, param interface{}) (model.Request, model.Response, error) {
	return Requester{xrId, param}.Get("SCANDEVICE")
}

func ListDevice(xrId string, param interface{}) (model.Request, model.Response, error) {
	return Requester{xrId, param}.Get("LISTDEVICE")
}

func GetSMART(xrId string, param interface{}) (model.Request, model.Response, error) {
	return Requester{xrId, param}.Get("SMART")
}
