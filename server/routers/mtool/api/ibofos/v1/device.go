package v1

import (
	"github.com/gin-gonic/gin"
	"github.com/gin-gonic/gin/binding"
)

func ScanDevice(ctx *gin.Context) {
	getDevice(ctx, "SCANDEVICE")
}

func ListDevice(ctx *gin.Context) {
	getDevice(ctx, "LISTDEVICE")
}

func AttachDevice(ctx *gin.Context) {
	postDevice(ctx, "SCANDEVICE")
}

func DetachDevice(ctx *gin.Context) {
	postDevice(ctx, "SCANDEVICE")
}

func getDevice(ctx *gin.Context, command string) {
	iBoFRequest := makeRequest(ctx, command)
	sendWithSync(ctx, iBoFRequest)
}

func postDevice(ctx *gin.Context, command string) {
	iBoFRequest := makeRequest(ctx, command)
	ctx.ShouldBindBodyWith(&iBoFRequest, binding.JSON)
	sendWithSync(ctx, iBoFRequest)
}
