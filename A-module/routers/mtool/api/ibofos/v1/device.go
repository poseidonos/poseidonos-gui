package v1

import (
	"A-module/routers/mtool/model"
)

func ScanDevice(xrId string, param model.DeviceParam) (model.Request, int, error) {
	return Requester{xrId, param}.Get("SCANDEVICE")
}

func ListDevice(xrId string, param model.DeviceParam) (model.Request, int, error) {
	return Requester{xrId, param}.Get("LISTDEVICE")
}

func AttachDevice(xrId string, param model.DeviceParam) (model.Request, int, error) {
	return Requester{xrId, param}.Post("ATTACHDEVICE")
}

func DetachDevice(xrId string, param model.DeviceParam) (model.Request, int, error) {
	return Requester{xrId, param}.Delete("DETACHDEVICE")
}
