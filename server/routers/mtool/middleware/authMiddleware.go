package middleware

import (
	"github.com/gin-gonic/gin"
	"ibofdagent/server/mongodb"
	//"github.com/dgrijalva/jwt-go"
)

func CheckBasicAuth() gin.HandlerFunc {
	var user gin.Accounts
	user = mongodb.ReadAllUserIdPassword()
	return gin.BasicAuth(user)
}

func JWTAuth() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		// ToDo: Implement
		ctx.Next()
	}
}
