package v1

import (
	"A-module/routers/mtool/model"
)
/*
func ScanDevice(ctx *gin.Context) {
	getDevice(ctx, "SCANDEVICE")
}

func ListDevice(ctx *gin.Context) {
	getDevice(ctx, "LISTDEVICE")
}

func AttachDevice(ctx *gin.Context) {
	//postDevice(ctx, "ATTACHDEVICE")
	api.MakeBadRequest(ctx, 40000)
}

func DetachDevice(ctx *gin.Context) {
	postDevice(ctx, "DETACHDEVICE")
}

func getDevice(ctx *gin.Context, command string) {
	iBoFRequest := makeRequest(ctx, command)
	sendIBoF(ctx, iBoFRequest)
}

func postDevice(ctx *gin.Context, command string) {
	iBoFRequest := makeRequest(ctx, command)
	ctx.ShouldBindBodyWith(&iBoFRequest, binding.JSON)
	sendIBoF(ctx, iBoFRequest)
}
*/
func ScanDevice(param model.DeviceParam) {
	getDevice("SCANDEVICE")
}

func ListDevice(param model.DeviceParam) {
	getDevice("LISTDEVICE")
}

func AttachDevice(param model.DeviceParam) {
	//postDevice(ctx, "ATTACHDEVICE")
	//api.MakeBadRequest(ctx, 40000)
}

func DetachDevice(param model.DeviceParam) {
	postDevice("DETACHDEVICE", param)
}

func getDevice(command string) {
	iBoFRequest := makeRequest("", command)
	sendIBoF(iBoFRequest)
}

func postDevice(command string, param model.DeviceParam) {
	iBoFRequest := makeRequest("", command)
	iBoFRequest.Param = param
	sendIBoF(iBoFRequest)
}
