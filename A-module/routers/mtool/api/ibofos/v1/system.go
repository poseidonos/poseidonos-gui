package v1

import (
	"A-module/routers/mtool/model"
)

func Heartbeat(xrId string) (model.Response, error) {
	return getSystem(xrId, "HEARTBEAT")
}

func ExitiBoFOS(xrId string) (model.Response, error) {
	return deleteSystem(xrId, "EXITIBOFOS")
}

func IBoFOSInfo(xrId string) (model.Response, error) {
	return getSystem(xrId, "GETIBOFOSINFO")
}

func MountiBoFOS(xrId string) (model.Response, error) {
	return postSystem(xrId, "MOUNTIBOFOS")
}

func UnmountiBoFOS(xrId string) (model.Response, error) {
	return postSystem(xrId, "UNMOUNTIBOFOS")
}

func deleteSystem(xrId string, command string) (model.Response, error) {
	iBoFRequest := makeRequest(xrId, command)
	return sendIBoF(iBoFRequest)
}

func getSystem(xrId string, command string) (model.Response, error)  {
	iBoFRequest := makeRequest(xrId, command)
	return sendIBoF(iBoFRequest)
}

func postSystem(xrId string, command string) (model.Response, error) {
	iBoFRequest := makeRequest(xrId, command)
	return sendIBoF(iBoFRequest)
}
