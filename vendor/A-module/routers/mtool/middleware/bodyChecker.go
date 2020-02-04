package middleware

import (
	"github.com/gin-gonic/gin"
	"github.com/gin-gonic/gin/binding"
	"A-module/routers/mtool/api"
	"A-module/routers/mtool/model"
	"io"
	"A-module/log"
)

func CheckBody(ctx *gin.Context) {
	body := model.Request{}

	if "GET" != ctx.Request.Method {
		err := ctx.ShouldBindBodyWith(&body, binding.JSON)
		if err != nil && err != io.EOF {
			log.Printf("Request Body Error : %v", err)
			api.MakeBadRequest(ctx, 10310)
			return
		}
	}
	ctx.Next()
}
