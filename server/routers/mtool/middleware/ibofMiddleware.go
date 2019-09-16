package middleware

import (
	"github.com/gin-gonic/gin"
	"ibofdagent/server/routers/mtool/api"
	"ibofdagent/server/util"
	//"github.com/dgrijalva/jwt-go"
)

func CheckiBoFRun() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		if util.IsIBoFRun() == false {
			description := "iBoF does not run, Please run iBoFOS first"
			api.ReturnFail(ctx, description, 12030)
			return
		}
		ctx.Next()
	}
}
