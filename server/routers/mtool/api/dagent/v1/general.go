package v1

import (
	"github.com/gin-gonic/gin"
	"ibofdagent/server/routers/mtool/model"
	"ibofdagent/server/setting"
	"net/http"
)

func Ping(ctx *gin.Context) {
	response := model.Response{}
	response.Result.Status.Code = 0
	response.Result.Status.Description = "Pong"
	ctx.JSON(http.StatusOK, &response)
}

func StatusCode(ctx *gin.Context) {
	response := model.Response{}
	response.Result.Status.Code = 0
	response.Result.Status.Description = "Success"
	response.Result.Data = setting.StatusList
	ctx.JSON(http.StatusOK, &response)
}
