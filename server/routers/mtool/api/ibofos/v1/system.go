package v1

import (
	"github.com/gin-gonic/gin"
	"github.com/gin-gonic/gin/binding"
)

func Heartbeat(ctx *gin.Context) {
	getSystem(ctx, "SYSSTATE")
}

func ExitSystem(ctx *gin.Context) {
	getSystem(ctx, "EXITSYSTEM")
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

func getSystem(ctx *gin.Context, command string) {
	iBoFRequest := makeRequest(ctx, command)
	sendIBoF(ctx, iBoFRequest)
}

func postSystem(ctx *gin.Context, command string) {
	iBoFRequest := makeRequest(ctx, command)
	ctx.ShouldBindBodyWith(&iBoFRequest, binding.JSON)
	sendIBoF(ctx, iBoFRequest)
}
