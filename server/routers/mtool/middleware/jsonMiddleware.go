package middleware

import (
	"github.com/gin-gonic/gin"
	"github.com/gin-gonic/gin/binding"
	"ibofdagent/server/routers/mtool/api"
	"io"
	"log"
	"net/http"
)

func CheckBody() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		body := api.Request{}
		response := api.Response{}

		if "GET" != ctx.Request.Method {
			err := ctx.ShouldBindBodyWith(&body, binding.JSON)
			if err != nil && err != io.EOF {
				log.Printf("Request Body Error : %v", err)
				response.Result.Status.Code = -98
				response.Result.Status.Description = error.Error(err)
				ctx.AbortWithStatusJSON(http.StatusBadRequest, &response)
				return
			}
		}
		ctx.Next()
	}
}
