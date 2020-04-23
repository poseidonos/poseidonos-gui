package middleware

import (
	"A-module/routers/mtool/model"
	"A-module/util"
	"DAgent/src/routers/mtool/api"
	"github.com/gin-gonic/gin"
)

func CheckHeader(ctx *gin.Context) {
	xrid := ctx.GetHeader("X-request-Id")
	ts := ctx.GetHeader("ts")

	if util.IsValidUUID(xrid) == false {
		api.BadRequest(ctx, model.Response{}, 10240)
	}

	if ts == "" {
		api.BadRequest(ctx, model.Response{}, 10250)
	}

	ctx.Next()
}
