package v1

import (
	"A-module/routers/mtool/model"
)

func Heartbeat(rid string) (model.Response, error) {
	return getSystem(rid, "HEARTBEAT")
}

func ExitiBoFOS(rid string) (model.Response, error) {
	return deleteSystem(rid, "EXITIBOFOS")
}

func IBoFOSInfo(rid string) (model.Response, error) {
	return getSystem(rid, "GETIBOFOSINFO")
}

func MountiBoFOS(rid string) (model.Response, error) {
	return postSystem(rid, "MOUNTIBOFOS")
}

func UnmountiBoFOS(rid string) (model.Response, error) {
	return postSystem(rid, "UNMOUNTIBOFOS")
}

func deleteSystem(rid string, command string) (model.Response, error) {
	iBoFRequest := makeRequest(rid, command)
	return sendIBoF(iBoFRequest)
}

func getSystem(rid string, command string) (model.Response, error)  {
	iBoFRequest := makeRequest(rid, command)
	return sendIBoF(iBoFRequest)
}

func postSystem(rid string, command string) (model.Response, error) {
	iBoFRequest := makeRequest(rid, command)
	return sendIBoF(iBoFRequest)
}
