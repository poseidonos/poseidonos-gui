package v1

import (
	"github.com/gin-gonic/gin"
	"github.com/gin-gonic/gin/binding"
)

func ListArrayDevice(ctx *gin.Context) {
	getArray(ctx, "LISTARRAYDEVICE")

}

func CreateArray(ctx *gin.Context) {
	postArray(ctx, "CREATEARRAY")

}

func UnmountArray(ctx *gin.Context) {
	getArray(ctx, "UNMOUNTARRAY")

}

func DeleteArray(ctx *gin.Context) {
	deleteArray(ctx, "DELETEARRAY")

}

func StateArray(ctx *gin.Context) {
	getArray(ctx, "ARRAYSTATE")

}

func MountArray(ctx *gin.Context) {
	postArray(ctx, "MOUNTARRAY")
}

func postArray(ctx *gin.Context, command string) {
	iBoFRequest := makeRequest(ctx, command)
	ctx.ShouldBindBodyWith(&iBoFRequest, binding.JSON)
	sendIBoF(ctx, iBoFRequest)
}

func getArray(ctx *gin.Context, command string) {
	iBoFRequest := makeRequest(ctx, command)
	sendIBoF(ctx, iBoFRequest)
}

func deleteArray(ctx *gin.Context, command string) {
	iBoFRequest := makeRequest(ctx, command)
	ctx.ShouldBindBodyWith(&iBoFRequest, binding.JSON)
	sendIBoF(ctx, iBoFRequest)
}
