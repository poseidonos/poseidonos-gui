package middleware

import (
	"A-module/util"
	"DAgent/src/routers/mtool/api"
	"github.com/gin-gonic/gin"
)

func CheckHeader(ctx *gin.Context) {
	xrid := ctx.GetHeader("X-request-Id")
	ts := ctx.GetHeader("ts")

	if util.IsValidUUID(xrid) == false {
		api.BadRequest(ctx, 10240)
	}

	if ts == "" {
		api.BadRequest(ctx, 10250)
	}

	ctx.Next()
}
