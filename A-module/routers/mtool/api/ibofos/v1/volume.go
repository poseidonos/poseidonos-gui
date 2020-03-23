package v1

import (
	"A-module/routers/mtool/model"
)

func CreateVolume(xrId string, param model.VolumeParam) (model.Request,int , error) {
	return Requester{xrId, param}.Post("CREATEVOLUME")
}

func UpdateVolume(xrId string, param model.VolumeParam) (model.Request,int , error) {
	return Requester{xrId, param}.Put("UPDATEVOLUMEQOS")
}

func MountVolume(xrId string, param model.VolumeParam) (model.Request,int , error) {
	return Requester{xrId, param}.Post("MOUNTVOLUME")
}

func UnmountVolume(xrId string, param model.VolumeParam) (model.Request,int , error) {
	return Requester{xrId, param}.Delete("UPDATEVOLUMEQOS")
}

func DeleteVolume(xrId string, param model.VolumeParam) (model.Request,int , error) {
	return Requester{xrId, param}.Delete("DELETEVOLUME")
}

func ListVolume(xrId string, param model.VolumeParam) (model.Request,int , error) {
	return Requester{xrId, param}.Get("LISTVOLUME")
}