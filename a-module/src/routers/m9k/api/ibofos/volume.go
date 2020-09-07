package ibofos

import (
	"a-module/src/errors"
	"a-module/src/influxdb"
	"a-module/src/routers/m9k/model"
)

func CreateVolume(xrId string, param interface{}) (model.Request, model.Response, error) {
	var resErr string

	err1 := influxdb.CreateVolume()
	req, res, err2 := Requester{xrId, param, model.VolumeParam{}}.Send("CREATEVOLUME")

	if err1 != nil {
		resErr = "Influx Error : " + err1.Error()
	}

	if err2 != nil {
		resErr += " Send Error : " + err2.Error()
	}

	if len(resErr) == 0 {
		return req, res, nil
	} else {
		return req, res, errors.New(resErr)
	}
}

func UpdateVolume(xrId string, param interface{}) (model.Request, model.Response, error) {
	return Requester{xrId, param, model.VolumeParam{}}.Send("UPDATEVOLUMEQOS")
}

func MountVolume(xrId string, param interface{}) (model.Request, model.Response, error) {
	return Requester{xrId, param, model.VolumeParam{}}.Send("MOUNTVOLUME")
}

func UnmountVolume(xrId string, param interface{}) (model.Request, model.Response, error) {
	return Requester{xrId, param, model.VolumeParam{}}.Send("UNMOUNTVOLUME")
}

func DeleteVolume(xrId string, param interface{}) (model.Request, model.Response, error) {
	var resErr string

	err1 := influxdb.DeleteVolume()
	req, res, err2 := Requester{xrId, param, model.VolumeParam{}}.Send("DELETEVOLUME")

	if err1 != nil {
		resErr = "Influx Error : " + err1.Error()
	}

	if err2 != nil {
		resErr += " Send Error : " + err2.Error()
	}

	if len(resErr) == 0 {
		return req, res, nil
	} else {
		return req, res, errors.New(resErr)
	}
}

func ListVolume(xrId string, param interface{}) (model.Request, model.Response, error) {
	return volumeSender(xrId, param, "LISTVOLUME")
}

func UpdateVolumeQoS(xrId string, param interface{}) (model.Request, model.Response, error) {
	return volumeSender(xrId, param, "UPDATEVOLUMEQOS")
}

func RenameVolume(xrId string, param interface{}) (model.Request, model.Response, error) {
	return volumeSender(xrId, param, "RENAMEVOLUME")
}

func ResizeVolume(xrId string, param interface{}) (model.Request, model.Response, error) {
	return volumeSender(xrId, param, "RESIZEVOLUME")
}

func GetMaxVolumeCount(xrId string, param interface{}) (model.Request, model.Response, error) {
	return volumeSender(xrId, param, "GETMAXVOLUMECOUNT")
}

func GetHostNQN(xrId string, param interface{}) (model.Request, model.Response, error) {
	return volumeSender(xrId, param, "GETHOSTNQN")
}

func volumeSender(xrId string, param interface{}, command string) (model.Request, model.Response, error) {
	return Requester{xrId, param, model.VolumeParam{}}.Send(command)
}
