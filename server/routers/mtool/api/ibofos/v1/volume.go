package v1

import (
	"github.com/gin-gonic/gin"
	"github.com/gin-gonic/gin/binding"
)

func CreateVolume(ctx *gin.Context) {
	postVolume(ctx, "CREATEVOLUME")
}

func UpdateVolume(ctx *gin.Context) {
	putVolume(ctx, "UPDATEVOLUME")
}

func MountVolume(ctx *gin.Context) {
	postVolume(ctx, "MOUNTVOLUME")
}

func UnmountVolume(ctx *gin.Context) {
	postVolume(ctx, "UNMOUNTVOLUME")
}

func DeleteVolume(ctx *gin.Context) {
	deleteVolume(ctx, "DELETEVOLUME")
}

func getVolume(ctx *gin.Context, command string) {
	iBoFRequest := makeRequest(ctx, command)
	sendWithSync(ctx, iBoFRequest)
}

func postVolume(ctx *gin.Context, command string) {
	iBoFRequest := makeRequest(ctx, command)
	ctx.ShouldBindBodyWith(&iBoFRequest, binding.JSON)
	sendWithSync(ctx, iBoFRequest)
}

func putVolume(ctx *gin.Context, command string) {
	iBoFRequest := makeRequest(ctx, command)
	ctx.ShouldBindBodyWith(&iBoFRequest, binding.JSON)
	sendWithSync(ctx, iBoFRequest)
}

func deleteVolume(ctx *gin.Context, command string) {
	iBoFRequest := makeRequest(ctx, command)
	ctx.ShouldBindBodyWith(&iBoFRequest, binding.JSON)
	sendWithSync(ctx, iBoFRequest)
}

func ListVolume(ctx *gin.Context) {
	getVolume(ctx, "LISTVOLUME")
}
