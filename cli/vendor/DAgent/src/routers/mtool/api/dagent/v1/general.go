package v1

import (
	"A-module/routers/mtool/model"
	"A-module/setting"
	"github.com/gin-gonic/gin"
	"net/http"
	"syscall"
)

func HeartBeat(ctx *gin.Context) {
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

func KillDAgent(ctx *gin.Context) {
	response := model.Response{}
	response.Result.Status.Code = 0
	response.Result.Status.Description = "Success"
	ctx.JSON(http.StatusOK, &response)
	syscall.Kill(syscall.Getpid(), syscall.SIGINT)
}
