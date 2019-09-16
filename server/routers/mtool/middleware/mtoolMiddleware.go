package middleware

import (
	"github.com/gin-gonic/gin"
	"ibofdagent/server/routers/mtool/api"
	"ibofdagent/server/util"
	"net/http"
)

func CheckMtoolHeader() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		xrid := ctx.GetHeader("X-request-Id")
		ts := ctx.GetHeader("ts")

		//ToDo: description -> Enum or (Panic and Recovery)
		description := ""
		if util.IsValidUUID(xrid) == false {
			description += "X-request-Id is invalid in header "
		}

		if ts == "" {
			description += "ts is missing in header"
		}

		if description != "" {
			result := api.Result{}
			result.Status.Code = -97
			result.Status.Description = description

			response := api.Response{
				Result: result,
			}
			ctx.AbortWithStatusJSON(http.StatusBadRequest, &response)
			return
		}

		ctx.Header("Content-Type", "application/json; charset=utf-8")
		ctx.Header("X-request-Id", xrid)

		ctx.Next()
	}
}
