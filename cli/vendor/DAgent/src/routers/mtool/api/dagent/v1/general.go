package v1

import (
	iBoFOSV1 "A-module/routers/mtool/api/ibofos/v1"
	"A-module/routers/mtool/model"
	"A-module/setting"
	"DAgent/src/routers/mtool/api"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"net/http"
	"syscall"
	"time"
)

var LastAliveTime int64

const MAX_AGE int64 = 4 // 4sec

func HeartBeat(ctx *gin.Context) {
	updateLastAliveTime()

	var res model.Response

	if LastAliveTime <= 0 {
		res.Result.Status.Description = "One of iBoF service is dead"
		api.BadRequest(ctx, res, 98989)
	} else {
		res.LastAliveTime = LastAliveTime
		res.Result.Status.Description = "alive"
		api.Success(ctx, res, 0)
	}
}

func updateLastAliveTime() {
	if LastAliveTime+MAX_AGE < time.Now().UTC().Unix() {
		uuid, _ := uuid.NewUUID()
		xrId := uuid.String()
		param := model.DeviceParam{}
		_, res, _ := iBoFOSV1.IBoFOSInfo(xrId, param)
		LastAliveTime = res.LastAliveTime
	}
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
