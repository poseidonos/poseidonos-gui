package ibofos

import (
	"a-module/src/routers/m9k/model"
)

func ReportTest(xrId string, param interface{}) (model.Request, model.Response, error) {
	return Requester{xrId, param}.Post("REPORTTEST")
}

func StartDeviceMonitoring(xrId string, param interface{}) (model.Request, model.Response, error) {
	return Requester{xrId, param}.Post("STARTDEVICEMONITORING")
}

func StopDeviceMonitoring(xrId string, param interface{}) (model.Request, model.Response, error) {
	return Requester{xrId, param}.Post("STOPDEVICEMONITORING")
}

func DeviceMonitoringState(xrId string, param interface{}) (model.Request, model.Response, error) {
	return Requester{xrId, param}.Post("DEVICEMONITORINGSTATE")
}

func StopRebuilding(xrId string, param interface{}) (model.Request, model.Response, error) {
	return Requester{xrId, param}.Put("STOPREBUILDING")
}

func UpdateEventWrr(xrId string, param interface{}) (model.Request, model.Response, error) {
	return Requester{xrId, param}.Post("UPDATEEVENTWRRPOLICY")
}

func ResetEventWrr(xrId string, param interface{}) (model.Request, model.Response, error) {
	return Requester{xrId, param}.Post("RESETEVENTWRRPOLICY")
}
