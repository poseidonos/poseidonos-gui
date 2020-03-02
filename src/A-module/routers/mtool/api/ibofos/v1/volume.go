package v1

import (
	"github.com/gin-gonic/gin"
	"github.com/gin-gonic/gin/binding"
	"A-module/routers/mtool/model"
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

func CreateVolumeCLI(param model.VolumeParam) {
	postVolumeCLI("CREATEVOLUME", param)
}

func UpdateVolumeCLI(param model.VolumeParam) {
	putVolumeCLI("UPDATEVOLUMEQOS", param)
}

func MountVolumeCLI(param model.VolumeParam) {
	postVolumeCLI("MOUNTVOLUME", param)
}

func UnmountVolumeCLI(param model.VolumeParam) {
	postVolumeCLI("UNMOUNTVOLUME", param)
}

func DeleteVolumeCLI(param model.VolumeParam) {
	deleteVolumeCLI("DELETEVOLUME", param)
}

func ListVolumeCLI(param model.VolumeParam) {
	getVolumeCLI("LISTVOLUME")
}

func getVolumeCLI(command string) {
	iBoFRequest := makeRequestCLI(command)
	sendIBoFCLI(iBoFRequest)
}

func postVolumeCLI(command string, param model.VolumeParam) {
	iBoFRequest := makeRequestCLI(command)
	iBoFRequest.Param = param
	
	/*
	doc := `{"name": "vol01","size": 4194304}`

	var data map[string]interface{}
	json.Unmarshal([]byte(doc), &data)

	iBoFRequest.Param = data
	*/
	sendIBoFCLI(iBoFRequest)
}

func putVolumeCLI(command string, param model.VolumeParam) {
	iBoFRequest := makeRequestCLI(command)
	iBoFRequest.Param = param
	sendIBoFCLI(iBoFRequest)
}

func deleteVolumeCLI(command string, param model.VolumeParam) {
	iBoFRequest := makeRequestCLI(command)
	iBoFRequest.Param = param
	sendIBoFCLI(iBoFRequest)
}
