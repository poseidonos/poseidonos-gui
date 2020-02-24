package v1

import (
	"github.com/gin-gonic/gin"
	"github.com/gin-gonic/gin/binding"
	"A-module/routers/mtool/api"
	"A-module/routers/mtool/model"
)

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

func ScanDeviceCLI(param model.DeviceParam) {
	getDeviceCLI("SCANDEVICE")
}

func ListDeviceCLI(param model.DeviceParam) {
	getDeviceCLI("LISTDEVICE")
}

func AttachDeviceCLI(param model.DeviceParam) {
	//postDevice(ctx, "ATTACHDEVICE")
	//api.MakeBadRequest(ctx, 40000)
}

func DetachDeviceCLI(param model.DeviceParam) {
	postDeviceCLI("DETACHDEVICE", param)
}

func getDeviceCLI(command string) {
	iBoFRequest := makeRequestCLI(command)
	sendIBoFCLI(iBoFRequest)
}

func postDeviceCLI(command string, param model.DeviceParam) {
	iBoFRequest := makeRequestCLI(command)
	iBoFRequest.Param = param
	sendIBoFCLI(iBoFRequest)
}
