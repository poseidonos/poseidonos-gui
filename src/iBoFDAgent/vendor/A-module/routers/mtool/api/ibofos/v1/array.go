package v1

import (
	"github.com/gin-gonic/gin"
	"github.com/gin-gonic/gin/binding"
	"encoding/json"
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

func ListArrayDeviceCLI() {
	getArrayCLI("LISTARRAYDEVICE")

}

func LoadArrayCLI() {
	getArrayCLI("LOADARRAY")
}

func CreateArrayCLI() {
	postArrayCLI("CREATEARRAY")
}

func DeleteArrayCLI() {
	deleteArrayCLI("DELETEARRAY")
}

func postArrayCLI(command string) {
	iBoFRequest := makeRequestCLI(command)

	doc := `{"buffer":[{"deviceName":"uram0"}],"data":[{"deviceName":"intel-unvmens-0"},{"deviceName":"intel-unvmens-1"},{"deviceName":"intel-unvmens-2"}],"fttype":1,"spare":[{"deviceName":"intel-unvmens-3"}]}`

	var data map[string]interface{}
	json.Unmarshal([]byte(doc), &data)

	iBoFRequest.Param = data
	sendIBoFCLI(iBoFRequest)
}

func getArrayCLI(command string) {
	iBoFRequest := makeRequestCLI(command)
	sendIBoFCLI(iBoFRequest)
}

func deleteArrayCLI(command string) {
	iBoFRequest := makeRequestCLI(command)
	doc := `{"buffer":[{"deviceName":"uram0"}],"data":[{"deviceName":"intel-unvmens-0"},{"deviceName":"intel-unvmens-1"},{"deviceName":"intel-unvmens-2"}],"fttype":1,"spare":[{"deviceName":"intel-unvmens-3"}]}`

	var data map[string]interface{}
	json.Unmarshal([]byte(doc), &data)

	iBoFRequest.Param = data
	sendIBoFCLI(iBoFRequest)
}
