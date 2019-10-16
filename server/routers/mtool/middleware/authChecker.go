package middleware

import (
	"github.com/gin-gonic/gin"
	"ibofdagent/server/mongodb"
	"ibofdagent/server/routers/mtool/api"
	//"github.com/dgrijalva/jwt-go"
)

func CheckBasicAuth() gin.HandlerFunc {
	var user gin.Accounts
	user = mongodb.ReadAllUserIdPassword()
	return gin.BasicAuth(user)
}

func CheckAPIActivate() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		username, _, _ := ctx.Request.BasicAuth()
		user := mongodb.ReadUserCollectionById(username)
		if user.Active == false {
			api.MakeUnauthorized(ctx, 10110)
			return
		}
		ctx.Next()
	}
}

func JWTAuth() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		// ToDo: Implement
		ctx.Next()
	}
}
