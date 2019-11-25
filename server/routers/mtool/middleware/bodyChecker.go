package middleware

import (
	"github.com/gin-gonic/gin"
	"github.com/gin-gonic/gin/binding"
	"ibofdagent/server/routers/mtool/api"
	"ibofdagent/server/routers/mtool/model"
	"io"
	log "github.com/sirupsen/logrus"
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
