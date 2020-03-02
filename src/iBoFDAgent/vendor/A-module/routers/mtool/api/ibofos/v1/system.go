package v1

import (
	"github.com/gin-gonic/gin"
	"github.com/gin-gonic/gin/binding"
)

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

//for CLi without gin-tonic

func HeartbeatCLI() {
	getSystemCLI("HEARTBEAT")
}

func ExitiBoFOSCLI() {
	deleteSystemCLI("EXITIBOFOS")
}

func IBoFOSInfoCLI() {
	getSystemCLI("GETIBOFOSINFO")
}

func MountiBoFOSCLI() {
	postSystemCLI("MOUNTIBOFOS")
}

func UnmountiBoFOSCLI() {
	postSystemCLI("UNMOUNTIBOFOS")

}

func deleteSystemCLI(command string) {
	iBoFRequest := makeRequestCLI(command)
	//ctx.ShouldBindBodyWith(&iBoFRequest, binding.JSON)
	sendIBoFCLI(iBoFRequest)
}

func getSystemCLI(command string) {
	iBoFRequest := makeRequestCLI(command)
	sendIBoFCLI(iBoFRequest)
}

func postSystemCLI(command string) {
	iBoFRequest := makeRequestCLI(command)
	//ctx.ShouldBindBodyWith(&iBoFRequest, binding.JSON)
	sendIBoFCLI(iBoFRequest)
}
