package v1

import (
	"A-module/routers/mtool/model"
)

func ScanDevice(xrId string, param interface{}) (model.Request, model.Response, error) {
	return Requester{xrId, param}.Get("SCANDEVICE")
}

func ListDevice(xrId string, param interface{}) (model.Request, model.Response, error) {
	return Requester{xrId, param}.Get("LISTDEVICE")
}

func AttachDevice(xrId string, param interface{}) (model.Request, model.Response, error) {
	return Requester{xrId, param}.Post("ATTACHDEVICE")
}

func DetachDevice(xrId string, param interface{}) (model.Request, model.Response, error) {
	return Requester{xrId, param}.Delete("DETACHDEVICE")
}

func AddDevice(xrId string, param interface{}) (model.Request, model.Response, error) {
	return Requester{xrId, param}.Post("ADDDEVICE")
}

func RemoveDevice(xrId string, param interface{}) (model.Request, model.Response, error) {
	return Requester{xrId, param}.Post("REMOVEDEVICE")
}
