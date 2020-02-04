package v1

import (
	"github.com/gin-gonic/gin"
	"github.com/gin-gonic/gin/binding"
)

func CreateVolume(ctx *gin.Context) {
	postVolume(ctx, "CREATEVOLUME")
}

func UpdateVolume(ctx *gin.Context) {
	putVolume(ctx, "UPDATEVOLUMEQOS")
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

func ListVolume(ctx *gin.Context) {
	getVolume(ctx, "LISTVOLUME")
}

func getVolume(ctx *gin.Context, command string) {
	iBoFRequest := makeRequest(ctx, command)
	sendIBoF(ctx, iBoFRequest)
}

func postVolume(ctx *gin.Context, command string) {
	iBoFRequest := makeRequest(ctx, command)
	ctx.ShouldBindBodyWith(&iBoFRequest, binding.JSON)
	sendIBoF(ctx, iBoFRequest)
}

func putVolume(ctx *gin.Context, command string) {
	iBoFRequest := makeRequest(ctx, command)
	ctx.ShouldBindBodyWith(&iBoFRequest, binding.JSON)
	sendIBoF(ctx, iBoFRequest)
}

func deleteVolume(ctx *gin.Context, command string) {
	iBoFRequest := makeRequest(ctx, command)
	ctx.ShouldBindBodyWith(&iBoFRequest, binding.JSON)
	sendIBoF(ctx, iBoFRequest)
}

func CreateVolumeCLI() {
	postVolumeCLI("CREATEVOLUME")
}

func UpdateVolumeCLI() {
	putVolumeCLI("UPDATEVOLUMEQOS")
}

func MountVolumeCLI() {
	postVolumeCLI("MOUNTVOLUME")
}

func UnmountVolumeCLI() {
	postVolumeCLI("UNMOUNTVOLUME")
}

func DeleteVolumeCLI() {
	deleteVolumeCLI("DELETEVOLUME")
}

func ListVolumeCLI(ctx *gin.Context) {
	getVolumeCLI("LISTVOLUME")
}

func getVolumeCLI(command string) {
	iBoFRequest := makeRequestCLI(command)
	sendIBoFCLI(iBoFRequest)
}

func postVolumeCLI(command string) {
	iBoFRequest := makeRequestCLI(command)
	//ctx.ShouldBindBodyWith(&iBoFRequest, binding.JSON)
	sendIBoFCLI(iBoFRequest)
}

func putVolumeCLI(command string) {
	iBoFRequest := makeRequestCLI(command)
	//ctx.ShouldBindBodyWith(&iBoFRequest, binding.JSON)
	sendIBoFCLI(iBoFRequest)
}

func deleteVolumeCLI(command string) {
	iBoFRequest := makeRequestCLI(command)
	//ctx.ShouldBindBodyWith(&iBoFRequest, binding.JSON)
	sendIBoFCLI(iBoFRequest)
}
