package v1

import (
	"A-module/log"
	iBoFOSV1 "A-module/routers/mtool/api/ibofos/v1"
	"A-module/routers/mtool/model"
	"A-module/setting"
	"DAgent/src/routers/mtool/api"
	"github.com/gin-gonic/gin"
	"net/http"
	"syscall"
	"time"
)

var LastAliveTime int64

const MAX_AGE int64 = 4 // 4sec

func HeartBeat(xrId string, ctx *gin.Context) {

	var res model.Response

	//need
	//boolean?
	//lasttime, status = lastAliveTime()
	//res.LastAliveTime = Lasttime
	//if status {
	//	res.Result.Status.Description = "alive"
	//	api.Success(ctx, res, 0)
	//} else {
	//	res.Result.Status.Description = "One of iBoF service is dead"
	//	api.BadRequest(ctx, res, 98989)
	//}

	if lastAliveTime(xrId) <= 0 {
		log.Debugf("1 res.LastAliveTime  : %d", res.LastAliveTime)
		log.Debugf("1 LastAliveTime  : %d", LastAliveTime)

		res.LastAliveTime = LastAliveTime
		res.Result.Status.Description = "One of iBoF service is dead"
		api.BadRequest(ctx, res, 98989)
	} else {
		log.Debugf("2 res.LastAliveTime  : %d", res.LastAliveTime)
		log.Debugf("2 LastAliveTime  : %d", LastAliveTime)

		res.LastAliveTime = LastAliveTime
		res.Result.Status.Description = "alive"
		api.Success(ctx, res, 0)
	}
}

func lastAliveTime(xrId string) int64 {
	if LastAliveTime+MAX_AGE < time.Now().UTC().Unix() {
		param := model.DeviceParam{}
		_, res, _ := iBoFOSV1.IBoFOSInfo(xrId, param)
		return res.LastAliveTime
	} else {
		return LastAliveTime
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
