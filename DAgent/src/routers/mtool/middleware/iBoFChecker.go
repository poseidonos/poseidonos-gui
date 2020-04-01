package middleware

import (
	"github.com/gin-gonic/gin"
	//"github.com/dgrijalva/jwt-go"
)

func CheckiBoFRun() gin.HandlerFunc {
	return func(ctx *gin.Context) {
	// This middle ware will be removed.
	// The iBofOS running will be checked by A-module thru socket checking
		ctx.Next()
	}
}
