package v1

import (
	"A-module/routers/mtool/model"
)

func Heartbeat() (model.Response, error) {
	return getSystem("HEARTBEAT")
}

func ExitiBoFOS() (model.Response, error) {
	return deleteSystem("EXITIBOFOS")
}

func IBoFOSInfo() (model.Response, error) {
	return getSystem("GETIBOFOSINFO")
}

func MountiBoFOS() (model.Response, error) {
	return postSystem("MOUNTIBOFOS")
}

func UnmountiBoFOS() (model.Response, error) {
	return postSystem("UNMOUNTIBOFOS")
}

func deleteSystem(command string) (model.Response, error) {
	iBoFRequest := makeRequest("", command)
	return sendIBoF(iBoFRequest)
}

func getSystem(command string) (model.Response, error)  {
	iBoFRequest := makeRequest("", command)
	return sendIBoF(iBoFRequest)
}

func postSystem(command string) (model.Response, error) {
	iBoFRequest := makeRequest("", command)
	return sendIBoF(iBoFRequest)
}
