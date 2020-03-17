package v1

import (
	"A-module/routers/mtool/model"
)

func CreateVolume(xrId string, param model.VolumeParam) (model.Response, error) {
	return postVolume(xrId, "CREATEVOLUME", param)
}

func UpdateVolume(xrId string, param model.VolumeParam) (model.Response, error) {
	return putVolume(xrId, "UPDATEVOLUMEQOS", param)
}

func MountVolume(xrId string, param model.VolumeParam) (model.Response, error)  {
	return postVolume(xrId, "MOUNTVOLUME", param)
}

func UnmountVolume(xrId string, param model.VolumeParam) (model.Response, error) {
	return postVolume(xrId, "UNMOUNTVOLUME", param)
}

func DeleteVolume(xrId string, param model.VolumeParam) (model.Response, error) {
	return deleteVolume(xrId, "DELETEVOLUME", param)
}

func ListVolume(xrId string, param model.VolumeParam) (model.Response, error) {
	return getVolume(xrId, "LISTVOLUME")
}

func getVolume(xrId string, command string) (model.Response, error) {
	iBoFRequest := makeRequest("", command)
	return sendIBoF(iBoFRequest)
}

func postVolume(xrId string, command string, param model.VolumeParam) (model.Response, error) {
	iBoFRequest := makeRequest(xrId, command)
	iBoFRequest.Param = param
	return sendIBoF(iBoFRequest)
}

func putVolume(xrId string, command string, param model.VolumeParam) (model.Response, error) {
	iBoFRequest := makeRequest(xrId, command)
	iBoFRequest.Param = param
	return sendIBoF(iBoFRequest)
}

func deleteVolume(xrId string, command string, param model.VolumeParam) (model.Response, error) {
	iBoFRequest := makeRequest(xrId, command)
	iBoFRequest.Param = param
	return sendIBoF(iBoFRequest)
}
