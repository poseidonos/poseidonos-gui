package v1

import (
	"github.com/gin-gonic/gin"
	"github.com/gin-gonic/gin/binding"
	"ibofdagent/src/routers/mtool/api"
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
