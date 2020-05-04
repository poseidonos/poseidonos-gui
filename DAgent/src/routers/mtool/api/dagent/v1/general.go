package v1

import (
	iBoFOSV1 "A-module/routers/mtool/api/ibofos/v1"
	"A-module/routers/mtool/model"
	"A-module/setting"
	"DAgent/src/routers/mtool/api"
	"github.com/gin-gonic/gin"
	"net/http"
	"syscall"
	"time"
)

var LastSuccessTime int64

const MAX_AGE int64 = 4 // 4sec

func HeartBeat(xrId string, ctx *gin.Context) {

	var res model.Response
	successTime := updatSuccessTime(xrId)
	if successTime <= 0 {
		res.LastSuccessTime = LastSuccessTime
		res.Result.Status.Description = "One of iBoF service is dead"
		api.BadRequest(ctx, res, 98989)
	} else {
		LastSuccessTime = successTime
		res.LastSuccessTime = LastSuccessTime
		res.Result.Status.Description = "alive"
		api.Success(ctx, res, 0)
	}
}

func updatSuccessTime(xrId string) int64 {
	if LastSuccessTime+MAX_AGE < time.Now().UTC().Unix() {
		param := model.DeviceParam{}
		_, res, _ := iBoFOSV1.IBoFOSInfo(xrId, param)
		return res.LastSuccessTime
	} else {
		return LastSuccessTime
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
