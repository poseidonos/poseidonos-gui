package middleware

import (
	"A-module/routers/mtool/model"
	"A-module/util"
	"DAgent/src/routers/mtool/api"
	"github.com/gin-gonic/gin"
	//"github.com/dgrijalva/jwt-go"
)

func CheckiBoFRun() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		if util.IsIBoFRun() == false {
			api.BadRequest(ctx, model.Response{}, 12030)
			return
		}
		ctx.Next()
	}
}
