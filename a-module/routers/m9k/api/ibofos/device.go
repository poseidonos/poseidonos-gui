package ibofos

import (
	"a-module/routers/m9k/model"
)

func ScanDevice(xrId string, param interface{}) (model.Request, model.Response, error) {
	return Requester{xrId, param}.Get("SCANDEVICE")
}

func ListDevice(xrId string, param interface{}) (model.Request, model.Response, error) {
	return Requester{xrId, param}.Get("LISTDEVICE")
}

func AddDevice(xrId string, param interface{}) (model.Request, model.Response, error) {
	return Requester{xrId, param}.Post("ADDDEVICE")
}

func RemoveDevice(xrId string, param interface{}) (model.Request, model.Response, error) {
	return Requester{xrId, param}.Post("REMOVEDEVICE")
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

func NvmeAdminCommand(xrId string, param interface{}) (model.Request, model.Response, error) {
	return Requester{xrId, param}.Get("NVMEADMINCOMMAND")
}
