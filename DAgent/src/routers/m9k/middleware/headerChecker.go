package middleware

import (
	"github.com/gin-gonic/gin"
)

func CheckHeader(ctx *gin.Context) {
	//xrid := ctx.GetHeader("X-request-Id")
	//ts := ctx.GetHeader("ts")
	//
	//if util.IsValidUUID(xrid) == false {
	//	api.BadRequest(ctx, model.Response{}, 10240)
	//	return
	//}
	//
	//if ts == "" {
	//	api.BadRequest(ctx, model.Response{}, 10250)
	//	return
	//}
}
