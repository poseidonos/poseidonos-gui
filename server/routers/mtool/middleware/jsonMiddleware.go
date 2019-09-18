package middleware

import (
	"github.com/gin-gonic/gin"
	"github.com/gin-gonic/gin/binding"
	"ibofdagent/server/routers/mtool/api"
	"io"
	"log"
)

func CheckBody() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		body := api.Request{}

		if "GET" != ctx.Request.Method {
			err := ctx.ShouldBindBodyWith(&body, binding.JSON)
			if err != nil && err != io.EOF {
				log.Printf("Request Body Error : %v", err)
				api.MakeBadRequest(ctx,  10310)
				return
			}
		}
		ctx.Next()
	}
}
