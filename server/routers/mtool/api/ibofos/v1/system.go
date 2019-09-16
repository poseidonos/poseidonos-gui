package v1

import (
	"github.com/gin-gonic/gin"
)

func Sysstate(ctx *gin.Context) {
	getSystem(ctx, "SYSSTATE")
}

func ExitSystem(ctx *gin.Context) {
	getSystem(ctx, "EXITSYSTEM")
}

func getSystem(ctx *gin.Context, command string) {
	iBoFRequest := makeRequest(ctx, command)
	sendWithSync(ctx, iBoFRequest)
}
