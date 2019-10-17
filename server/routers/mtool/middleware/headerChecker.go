package middleware

import (
	"github.com/gin-gonic/gin"
	"ibofdagent/server/routers/mtool/api"
	"ibofdagent/server/util"
)

func CheckHeader(ctx *gin.Context) {
	xrid := ctx.GetHeader("X-request-Id")
	ts := ctx.GetHeader("ts")

	if util.IsValidUUID(xrid) == false {
		api.MakeBadRequest(ctx, 10240)
	}

	if ts == "" {
		api.MakeBadRequest(ctx, 10250)
	}

	ctx.Next()
}
