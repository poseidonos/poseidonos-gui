package ibofos

import (
	"a-module/src/routers/m9k/model"
)

func SetLogLevel(xrId string, param interface{}) (model.Request, model.Response, error) {
	return Requester{xrId, param}.Put("SETLOGLEVEL")
}

func GetLogLevel(xrId string, param interface{}) (model.Request, model.Response, error) {
	return Requester{xrId, param}.Get("GETLOGLEVEL")
}

func ApplyLogFilter(xrId string, param interface{}) (model.Request, model.Response, error) {
	return Requester{xrId, param}.Put("APPLYLOGFILTER")
}

func LoggerInfo(xrId string, param interface{}) (model.Request, model.Response, error) {
	return Requester{xrId, param}.Get("LOGGERINFO")
}
