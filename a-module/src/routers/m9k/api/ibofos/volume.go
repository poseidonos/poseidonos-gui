package ibofos

import (
	"a-module/src/routers/m9k/model"
	"a-module/src/influxdb"
	"a-module/src/errors"
)

func CreateVolume(xrId string, param interface{}) (model.Request, model.Response, error) {

	var resErr error

	err1 := influxdb.CreateVolume()
	req, res, err2 := Requester{xrId, param}.Post("CREATEVOLUME")

	if err1 != nil  || err2 != nil {
		resErr = errors.New("Influx Error : " + err1.Error() + " Send Error : " + err2.Error())
	}

	return req, res, resErr
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

	var resErr error

	err1 := influxdb.DeleteVolume()
	req, res, err2 := Requester{xrId, param}.Delete("DELETEVOLUME")

	if err1 != nil  || err2 != nil {
		resErr = errors.New("Influx Error : " + err1.Error() + " Send Error : " + err2.Error())
	}

	return req, res, resErr
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
