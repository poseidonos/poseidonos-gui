package v1

import (
	"A-module/routers/mtool/model"
)

func Heartbeat(xrId string, param interface{}) (model.Request, model.Response, error) {
	return Requester{xrId, param}.Get("HEARTBEAT")
}

func ExitiBoFOS(xrId string, param interface{}) (model.Request, model.Response, error) {
	return Requester{xrId, param}.Delete("EXITIBOFOS")
}

func IBoFOSInfo(xrId string, param interface{}) (model.Request, model.Response, error) {
	return Requester{xrId, param}.Get("GETIBOFOSINFO")
}

func MountiBoFOS(xrId string, param interface{}) (model.Request, model.Response, error) {
	return Requester{xrId, param}.Post("MOUNTIBOFOS")
}

func UnmountiBoFOS(xrId string, param interface{}) (model.Request, model.Response, error) {
	return Requester{xrId, param}.Delete("UNMOUNTIBOFOS")
}

func StopRebuilding(xrId string, param interface{}) (model.Request, model.Response, error) {
	return Requester{xrId, param}.Put("STOPREBUILDING")
}

func SetLogLevel(xrId string, param interface{}) (model.Request, model.Response, error) {
	return Requester{xrId, param}.Put("SETLOGLEVEL")
}

func ApplyLogFilter(xrId string, param interface{}) (model.Request, model.Response, error) {
	return Requester{xrId, param}.Put("APPLYLOGFILTER")
}

func WBT(xrId string, param interface{}) (model.Request, model.Response, error) {
	return Requester{xrId, param}.Put("WBT")
}

func ListWBT(xrId string, param interface{}) (model.Request, model.Response, error) {
	return Requester{xrId, param}.Get("LISTWBT")
}

func DoGC(xrId string, param interface{}) (model.Request, model.Response, error) {
	return Requester{xrId, param}.Get("DOGC")
}
