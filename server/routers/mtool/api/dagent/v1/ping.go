package v1

import (
	"github.com/gin-gonic/gin"
	"ibofdagent/server/routers/mtool/api"
	"net/http"
)

func Ping(ctx *gin.Context) {
	response := api.Response{}
	response.Result.Status.Code = 0
	response.Result.Status.Description = "Pong"
	ctx.JSON(http.StatusOK, &response)
}
