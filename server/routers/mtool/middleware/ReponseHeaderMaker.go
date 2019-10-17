package middleware

import (
	"github.com/gin-gonic/gin"
)

func ReponseHeader() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		xrid := ctx.GetHeader("X-request-Id")
		ctx.Header("Content-Type", "application/json; charset=utf-8")
		ctx.Header("X-request-Id", xrid)
		ctx.Next()
	}
}
