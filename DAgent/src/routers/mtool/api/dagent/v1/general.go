package v1

import (
	iBoFOSV1 "A-module/routers/mtool/api/ibofos/v1"
	"A-module/routers/mtool/model"
	"A-module/setting"
	"errors"
	"github.com/gin-gonic/gin"
	"net/http"
	"syscall"
	"time"
)

var LastSuccessTime int64

const MAX_AGE int64 = 4 // 4sec

func HeartBeat(xrId string) (model.Response, error) {
	var res model.Response
	successTime := updatSuccessTime(xrId)

	if successTime <= 0 {
		err := errors.New("One of iBoF service is dead")
		res.LastSuccessTime = LastSuccessTime
		res.Result.Status.Code = 98989
		res.Result.Status.Description = err.Error()
		return res, err
	} else {
		LastSuccessTime = successTime
		res.LastSuccessTime = LastSuccessTime
		res.Result.Status.Code = 0
		res.Result.Status.Description = "alive"
		return res, nil
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
	res := model.Response{}
	res.Result.Status.Code = 0
	res.Result.Status.Description = "Success"
	res.Result.Data = setting.StatusList
	ctx.JSON(http.StatusOK, &res)
}

func KillDAgent(xrId string) (model.Response, error) {
	res := model.Response{}
	res.Result.Status.Code = 0
	res.Result.Status.Description = "Success"
	syscall.Kill(syscall.Getpid(), syscall.SIGINT)
	return res, nil
}
