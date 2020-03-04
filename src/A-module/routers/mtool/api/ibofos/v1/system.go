package v1

import (
)
/*
func Heartbeat(ctx *gin.Context) {
	getSystem(ctx, "HEARTBEAT")
}

func ExitiBoFOS(ctx *gin.Context) {
	deleteSystem(ctx, "EXITIBOFOS")
}

func IBoFOSInfo(ctx *gin.Context) {
	getSystem(ctx, "GETIBOFOSINFO")
}

func MountiBoFOS(ctx *gin.Context) {
	postSystem(ctx, "MOUNTIBOFOS")
}

func UnmountiBoFOS(ctx *gin.Context) {
	postSystem(ctx, "UNMOUNTIBOFOS")

}

func deleteSystem(ctx *gin.Context, command string) {
	iBoFRequest := makeRequest(ctx, command)
	ctx.ShouldBindBodyWith(&iBoFRequest, binding.JSON)
	sendIBoF(ctx, iBoFRequest)
}

func getSystem(ctx *gin.Context, command string) {
	iBoFRequest := makeRequest(ctx, command)
	sendIBoF(ctx, iBoFRequest)
}

func postSystem(ctx *gin.Context, command string) {
	iBoFRequest := makeRequest(ctx, command)
	ctx.ShouldBindBodyWith(&iBoFRequest, binding.JSON)
	sendIBoF(ctx, iBoFRequest)
}
*/
func Heartbeat() {
	getSystem("HEARTBEAT")
}

func ExitiBoFOS() {
	deleteSystem("EXITIBOFOS")
}

func IBoFOSInfo() {
	getSystem("GETIBOFOSINFO")
}

func MountiBoFOS() {
	postSystem("MOUNTIBOFOS")
}

func UnmountiBoFOS() {
	postSystem("UNMOUNTIBOFOS")

}

func deleteSystem(command string) {
	iBoFRequest := makeRequest("", command)
	sendIBoF(iBoFRequest)
}

func getSystem(command string) {
	iBoFRequest := makeRequest("", command)
	sendIBoF(iBoFRequest)
}

func postSystem(command string) {
	iBoFRequest := makeRequest("", command)
	sendIBoF(iBoFRequest)
}
