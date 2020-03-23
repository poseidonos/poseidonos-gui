package v1

import (
	"A-module/routers/mtool/model"
)

func Heartbeat(xrId string) (model.Request, model.Response, error) {
	return Requester{xrId, nil}.Get("HEARTBEAT")
}

func ExitiBoFOS(xrId string) (model.Request, model.Response, error) {
	return Requester{xrId, nil}.Delete("EXITIBOFOS")
}

func IBoFOSInfo(xrId string) (model.Request, model.Response, error) {
	return Requester{xrId, nil}.Get("GETIBOFOSINFO")
}

func MountiBoFOS(xrId string) (model.Request, model.Response, error) {
	return Requester{xrId, nil}.Post("MOUNTIBOFOS")
}

func UnmountiBoFOS(xrId string) (model.Request, model.Response, error) {
	return Requester{xrId, nil}.Delete("UNMOUNTIBOFOS")
}

func StopRebuilding(xrId string) (model.Request, model.Response, error) {
	return Requester{xrId, nil}.Put("STOPREBUILDING")
}
