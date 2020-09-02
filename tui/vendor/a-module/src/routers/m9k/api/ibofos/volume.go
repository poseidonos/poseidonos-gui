package ibofos

import (
	"a-module/src/routers/m9k/model"
	"a-module/src/influxdb"
)

func CreateVolume(xrId string, param interface{}) (model.Request, model.Response, error) {
	
	influxdb.CreateVolume()
	
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
	
	influxdb.DeleteVolume()
	
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

func GetMaxVolumeCount(xrId string, param interface{}) (model.Request, model.Response, error) {
	return Requester{xrId, param}.Get("GETMAXVOLUMECOUNT")
}

func GetHostNQN(xrId string, param interface{}) (model.Request, model.Response, error) {
	return Requester{xrId, param}.Get("GETHOSTNQN")
}
