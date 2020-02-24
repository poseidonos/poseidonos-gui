package v1

import (
	"github.com/gin-gonic/gin"
	"github.com/gin-gonic/gin/binding"
	"A-module/routers/mtool/model"
)

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

func ListArrayDeviceCLI(param model.ArrayParam) {
	getArrayCLI("LISTARRAYDEVICE")
}

func LoadArrayCLI(param model.ArrayParam) {
	getArrayCLI("LOADARRAY")
}

func CreateArrayCLI(param model.ArrayParam) {
	postArrayCLI("CREATEARRAY", param)
}

func DeleteArrayCLI(param model.ArrayParam) {
	deleteArrayCLI("DELETEARRAY", param)
}

func postArrayCLI(command string, param model.ArrayParam) {
	iBoFRequest := makeRequestCLI(command)
/*
	doc := `{"buffer":[{"deviceName":"uram0"}],"data":[{"deviceName":"intel-unvmens-0"},{"deviceName":"intel-unvmens-1"},{"deviceName":"intel-unvmens-2"}],"fttype":1,"spare":[{"deviceName":"intel-unvmens-3"}]}`

	var data map[string]interface{}
	json.Unmarshal([]byte(doc), &data)
*/
	iBoFRequest.Param = param
	sendIBoFCLI(iBoFRequest)
}

func getArrayCLI(command string) {
	iBoFRequest := makeRequestCLI(command)
	sendIBoFCLI(iBoFRequest)
}

func deleteArrayCLI(command string, param model.ArrayParam) {
	iBoFRequest := makeRequestCLI(command)
	iBoFRequest.Param = param
	sendIBoFCLI(iBoFRequest)
}
