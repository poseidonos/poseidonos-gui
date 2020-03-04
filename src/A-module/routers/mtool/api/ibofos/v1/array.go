package v1

import (
	"A-module/routers/mtool/model"
)

/*
func ListArrayDevice(ctx *gin.Context) {
	getArray(ctx, "LISTARRAYDEVICE")

}

func LoadArray(ctx *gin.Context) {
	getArray(ctx, "LOADARRAY")
}

func CreateArray(ctx *gin.Context) {
	postArray(ctx, "CREATEARRAY")
}

func DeleteArray(ctx *gin.Context) {
	deleteArray(ctx, "DELETEARRAY")
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
*/
func ListArrayDevice(param model.ArrayParam) {
	getArray("LISTARRAYDEVICE")
}

func LoadArray(param model.ArrayParam) {
	getArray("LOADARRAY")
}

func CreateArray(param model.ArrayParam) {
	postArray("CREATEARRAY", param)
}

func DeleteArray(param model.ArrayParam) {
	deleteArray("DELETEARRAY", param)
}

func postArray(command string, param model.ArrayParam) {
	iBoFRequest := makeRequest("", command)
	iBoFRequest.Param = param
	sendIBoF(iBoFRequest)
}

func getArray(command string) {
	iBoFRequest := makeRequest("", command)
	sendIBoF(iBoFRequest)
}

func deleteArray(command string, param model.ArrayParam) {
	iBoFRequest := makeRequest("", command)
	iBoFRequest.Param = param
	sendIBoF(iBoFRequest)
}
