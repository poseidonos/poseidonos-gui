package v1

import (
	"A-module/routers/mtool/model"
)

func Heartbeat(xrId string) (model.Request, model.Response, error) {
	return Requester{xrId, param}.Get("HEARTBEAT")
}

func ExitiBoFOS(xrId string) (model.Request, model.Response, error) {
	return Requester{xrId, param}.Delete("EXITIBOFOS")
}

func IBoFOSInfo(xrId string) (model.Request, model.Response, error) {
	return Requester{xrId, param}.Get("GETIBOFOSINFO")
}

func MountiBoFOS(xrId string) (model.Request, model.Response, error) {
	return Requester{xrId, param}.Post("MOUNTIBOFOS")
}

func UnmountiBoFOS(xrId string) (model.Request, model.Response, error) {
	return Requester{xrId, param}.Delete("UNMOUNTIBOFOS")
}

func StopRebuilding(xrId string) (model.Request, model.Response, error) {
	return Requester{xrId, param}.Put("STOPREBUILDING")
}
