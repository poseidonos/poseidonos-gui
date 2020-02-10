package v1

import (
	"github.com/gin-gonic/gin"
	"A-module/routers/mtool/model"
	"A-module/setting"
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
