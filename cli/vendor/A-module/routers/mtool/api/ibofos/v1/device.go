package v1

import (
	"A-module/routers/mtool/model"
)

func ScanDevice(param model.DeviceParam) (model.Response, error) {
	return getDevice("SCANDEVICE")
}

func ListDevice(param model.DeviceParam) (model.Response, error) {
	return getDevice("LISTDEVICE")
}

func AttachDevice(param model.DeviceParam) (model.Response, error) {
	//postDevice(ctx, "ATTACHDEVICE")
	//api.MakeBadRequest(ctx, 40000)
	return model.Response{}, ErrBadReq
}

func AddDevice(param model.DeviceParam) (model.Response, error) {
	return postDevice("ADDDEVICE", param)
}

func DetachDevice(param model.DeviceParam) (model.Response, error) {
	return postDevice("DETACHDEVICE", param)
}

func getDevice(command string) (model.Response, error) {
	iBoFRequest := makeRequest("", command)
	return sendIBoF(iBoFRequest)
}

func postDevice(command string, param model.DeviceParam) (model.Response, error) {
	iBoFRequest := makeRequest("", command)
	iBoFRequest.Param = param
	return sendIBoF(iBoFRequest)
}
