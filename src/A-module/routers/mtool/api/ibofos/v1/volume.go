package v1

import (
	"A-module/routers/mtool/model"
)
/*
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
*/

func CreateVolume(param model.VolumeParam) {
	postVolume("CREATEVOLUME", param)
}

func UpdateVolume(param model.VolumeParam) {
	putVolume("UPDATEVOLUMEQOS", param)
}

func MountVolume(param model.VolumeParam) {
	postVolume("MOUNTVOLUME", param)
}

func UnmountVolume(param model.VolumeParam) {
	postVolume("UNMOUNTVOLUME", param)
}

func DeleteVolume(param model.VolumeParam) {
	deleteVolume("DELETEVOLUME", param)
}

func ListVolume(param model.VolumeParam) {
	getVolume("LISTVOLUME")
}

func getVolume(command string) {
	iBoFRequest := makeRequest("", command)
	sendIBoF(iBoFRequest)
}

func postVolume(command string, param model.VolumeParam) {
	iBoFRequest := makeRequest("", command)
	iBoFRequest.Param = param
	sendIBoF(iBoFRequest)
}

func putVolume(command string, param model.VolumeParam) {
	iBoFRequest := makeRequest("", command)
	iBoFRequest.Param = param
	sendIBoF(iBoFRequest)
}

func deleteVolume(command string, param model.VolumeParam) {
	iBoFRequest := makeRequest("", command)
	iBoFRequest.Param = param
	sendIBoF(iBoFRequest)
}
