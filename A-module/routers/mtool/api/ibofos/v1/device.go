package v1

import (
	"A-module/routers/mtool/model"
)

func ScanDevice(xrId string, param model.DeviceParam) (model.Response, error) {
	return getDevice(xrId, "SCANDEVICE")
}

func ListDevice(xrId string, param model.DeviceParam) (model.Response, error) {
	return getDevice(xrId, "LISTDEVICE")
}

func AttachDevice(xrId string, param model.DeviceParam) (model.Response, error) {
	//postDevice(ctx, "ATTACHDEVICE")
	//api.MakeBadRequest(ctx, 40000)
	return model.Response{}, ErrBadReq
}

func AddDevice(xrId string, param model.DeviceParam) (model.Response, error) {
	return postDevice(xrId, "ADDDEVICE", param)
}

func DetachDevice(xrId string, param model.DeviceParam) (model.Response, error) {
	return postDevice(xrId, "DETACHDEVICE", param)
}

func getDevice(xrId string, command string) (model.Response, error) {
	iBoFRequest := makeRequest(xrId, command)
	return sendIBoF(iBoFRequest)
}

func postDevice(xrId string, command string, param model.DeviceParam) (model.Response, error) {
	iBoFRequest := makeRequest(xrId, command)
	iBoFRequest.Param = param
	return sendIBoF(iBoFRequest)
}
