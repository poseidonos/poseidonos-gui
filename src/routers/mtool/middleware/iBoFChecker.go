package middleware

import (
	"github.com/gin-gonic/gin"
	"ibofdagent/src/routers/mtool/api"
	"ibofdagent/src/util"
	//"github.com/dgrijalva/jwt-go"
)

func CheckiBoFRun() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		if util.IsIBoFRun() == false {
			api.MakeBadRequest(ctx, 12030)
			return
		}
		ctx.Next()
	}
}
