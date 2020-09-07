package ibofos

import (
	"a-module/src/errors"
	"a-module/src/influxdb"
	"a-module/src/routers/m9k/model"
)

func CreateVolume(xrId string, param interface{}) (model.Request, model.Response, error) {
	req, res, err := Requester{xrId, param, model.VolumeParam{}}.Send("CREATEVOLUME")

	if err != nil {
		return req, res, err
	}

	err = influxdb.CreateVolume()

	if err != nil {
		err = errors.New("Request Success, but Influx Error : " + err.Error())
	}
	return req, res, err
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
	req, res, err := Requester{xrId, param, model.VolumeParam{}}.Send("DELETEVOLUME")

	if err != nil {
		return req, res, err
	}

	err = influxdb.CreateVolume()

	if err != nil {
		err = errors.New("Request Success, but Influx Error : " + err.Error())
	}
	return req, res, err
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
