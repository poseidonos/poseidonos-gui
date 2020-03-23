package middleware

import (
	"A-module/util"
	"DAgent/src/routers/mtool/api"
	"github.com/gin-gonic/gin"
	//"github.com/dgrijalva/jwt-go"
)

func CheckiBoFRun() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		if util.IsIBoFRun() == false {
			api.BadRequest(ctx, 12030)
			return
		}
		ctx.Next()
	}
}
