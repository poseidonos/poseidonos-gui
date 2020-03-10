package v1

import (
	"A-module/routers/mtool/model"
)

func CreateVolume(param model.VolumeParam) (model.Response, error) {
	return postVolume("CREATEVOLUME", param)
}

func UpdateVolume(param model.VolumeParam) (model.Response, error) {
	return putVolume("UPDATEVOLUMEQOS", param)
}

func MountVolume(param model.VolumeParam) (model.Response, error)  {
	return postVolume("MOUNTVOLUME", param)
}

func UnmountVolume(param model.VolumeParam) (model.Response, error) {
	return postVolume("UNMOUNTVOLUME", param)
}

func DeleteVolume(param model.VolumeParam) (model.Response, error) {
	return deleteVolume("DELETEVOLUME", param)
}

func ListVolume(param model.VolumeParam) (model.Response, error) {
	return getVolume("LISTVOLUME")
}

func getVolume(command string) (model.Response, error) {
	iBoFRequest := makeRequest("", command)
	return sendIBoF(iBoFRequest)
}

func postVolume(command string, param model.VolumeParam) (model.Response, error) {
	iBoFRequest := makeRequest("", command)
	iBoFRequest.Param = param
	return sendIBoF(iBoFRequest)
}

func putVolume(command string, param model.VolumeParam) (model.Response, error) {
	iBoFRequest := makeRequest("", command)
	iBoFRequest.Param = param
	return sendIBoF(iBoFRequest)
}

func deleteVolume(command string, param model.VolumeParam) (model.Response, error) {
	iBoFRequest := makeRequest("", command)
	iBoFRequest.Param = param
	return sendIBoF(iBoFRequest)
}
