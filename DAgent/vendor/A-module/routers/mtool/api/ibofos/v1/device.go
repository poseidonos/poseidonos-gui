package v1

import (
	"A-module/routers/mtool/model"
)

func ScanDevice(rid string, param model.DeviceParam) (model.Response, error) {
	return getDevice(rid, "SCANDEVICE")
}

func ListDevice(rid string, param model.DeviceParam) (model.Response, error) {
	return getDevice(rid, "LISTDEVICE")
}

func AttachDevice(rid string, param model.DeviceParam) (model.Response, error) {
	//postDevice(ctx, "ATTACHDEVICE")
	//api.MakeBadRequest(ctx, 40000)
	return model.Response{}, ErrBadReq
}

func AddDevice(rid string, param model.DeviceParam) (model.Response, error) {
	return postDevice(rid, "ADDDEVICE", param)
}

func DetachDevice(rid string, param model.DeviceParam) (model.Response, error) {
	return postDevice(rid, "DETACHDEVICE", param)
}

func getDevice(rid string, command string) (model.Response, error) {
	iBoFRequest := makeRequest(rid, command)
	return sendIBoF(iBoFRequest)
}

func postDevice(rid string, command string, param model.DeviceParam) (model.Response, error) {
	iBoFRequest := makeRequest(rid, command)
	iBoFRequest.Param = param
	return sendIBoF(iBoFRequest)
}
