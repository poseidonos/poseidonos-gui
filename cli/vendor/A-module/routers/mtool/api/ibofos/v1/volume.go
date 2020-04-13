package v1

import (
	"A-module/routers/mtool/model"
)

func CreateVolume(xrId string, param interface{}) (model.Request, model.Response, error) {
	return Requester{xrId, param}.Post("CREATEVOLUME")
}

func UpdateVolume(xrId string, param interface{}) (model.Request, model.Response, error) {
	return Requester{xrId, param}.Put("UPDATEVOLUMEQOS")
}

func MountVolume(xrId string, param interface{}) (model.Request, model.Response, error) {
	return Requester{xrId, param}.Post("MOUNTVOLUME")
}

func UnmountVolume(xrId string, param interface{}) (model.Request, model.Response, error) {
	return Requester{xrId, param}.Delete("UNMOUNTVOLUME")
}

func DeleteVolume(xrId string, param interface{}) (model.Request, model.Response, error) {
	return Requester{xrId, param}.Delete("DELETEVOLUME")
}

func ListVolume(xrId string, param interface{}) (model.Request, model.Response, error) {
	return Requester{xrId, param}.Get("LISTVOLUME")
}

func UpdateVolumeQoS(xrId string, param interface{}) (model.Request, model.Response, error) {
	return Requester{xrId, param}.Post("UPDATEVOLUMEQOS")
}

func RenameVolume(xrId string, param interface{}) (model.Request, model.Response, error) {
	return Requester{xrId, param}.Post("RENAMEVOLUME")
}

func ResizeVolume(xrId string, param interface{}) (model.Request, model.Response, error) {
	return Requester{xrId, param}.Post("RESIZEVOLUME")
}
