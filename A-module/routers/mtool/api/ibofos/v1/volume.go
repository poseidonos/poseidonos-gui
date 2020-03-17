package v1

import (
	"A-module/routers/mtool/model"
)

func CreateVolume(rid string, param model.VolumeParam) (model.Response, error) {
	return postVolume(rid, "CREATEVOLUME", param)
}

func UpdateVolume(rid string, param model.VolumeParam) (model.Response, error) {
	return putVolume(rid, "UPDATEVOLUMEQOS", param)
}

func MountVolume(rid string, param model.VolumeParam) (model.Response, error)  {
	return postVolume(rid, "MOUNTVOLUME", param)
}

func UnmountVolume(rid string, param model.VolumeParam) (model.Response, error) {
	return postVolume(rid, "UNMOUNTVOLUME", param)
}

func DeleteVolume(rid string, param model.VolumeParam) (model.Response, error) {
	return deleteVolume(rid, "DELETEVOLUME", param)
}

func ListVolume(rid string, param model.VolumeParam) (model.Response, error) {
	return getVolume(rid, "LISTVOLUME")
}

func getVolume(rid string, command string) (model.Response, error) {
	iBoFRequest := makeRequest("", command)
	return sendIBoF(iBoFRequest)
}

func postVolume(rid string, command string, param model.VolumeParam) (model.Response, error) {
	iBoFRequest := makeRequest(rid, command)
	iBoFRequest.Param = param
	return sendIBoF(iBoFRequest)
}

func putVolume(rid string, command string, param model.VolumeParam) (model.Response, error) {
	iBoFRequest := makeRequest(rid, command)
	iBoFRequest.Param = param
	return sendIBoF(iBoFRequest)
}

func deleteVolume(rid string, command string, param model.VolumeParam) (model.Response, error) {
	iBoFRequest := makeRequest(rid, command)
	iBoFRequest.Param = param
	return sendIBoF(iBoFRequest)
}
