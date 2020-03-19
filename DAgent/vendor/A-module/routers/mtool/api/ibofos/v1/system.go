package v1

import (
	"A-module/routers/mtool/model"
)

func Heartbeat(xrId string) (model.Request, model.Response, error) {
	return getSystem(xrId, "HEARTBEAT")
}

func ExitiBoFOS(xrId string) (model.Request, model.Response, error) {
	return deleteSystem(xrId, "EXITIBOFOS")
}

func IBoFOSInfo(xrId string) (model.Request, model.Response, error) {
	return getSystem(xrId, "GETIBOFOSINFO")
}

func MountiBoFOS(xrId string) (model.Request, model.Response, error) {
	return postSystem(xrId, "MOUNTIBOFOS")
}

func UnmountiBoFOS(xrId string) (model.Request, model.Response, error) {
	return postSystem(xrId, "UNMOUNTIBOFOS")
}

func deleteSystem(xrId string, command string) (model.Request, model.Response, error) {
	iBoFRequest := makeRequest(xrId, command)
	res, err := sendIBoF(iBoFRequest)
	return iBoFRequest, res, err
}

func getSystem(xrId string, command string) (model.Request, model.Response, error)  {
	iBoFRequest := makeRequest(xrId, command)
	res, err := sendIBoF(iBoFRequest)
	return iBoFRequest, res, err
}

func postSystem(xrId string, command string) (model.Request, model.Response, error) {
	iBoFRequest := makeRequest(xrId, command)
	res, err := sendIBoF(iBoFRequest)
	return iBoFRequest, res, err
}
