package dagent

import (
	iBoFOS "A-module/routers/m9k/api/ibofos"
	"A-module/routers/m9k/model"
	"A-module/setting"
	"errors"
	"github.com/gin-gonic/gin"
	"net/http"
	"syscall"
	"time"
)

var LastSuccessTime int64

const MAXAGE int64 = 4 // 4sec

func HeartBeat(xrId string) (model.Response, error) {
	var err error
	var res model.Response
	successTime := updateSuccessTime(xrId)

	if successTime <= 0 {
		err = errors.New("one of iBoF service is dead")
		res.Result.Status.Code = 98989
		res.Result.Status.Description = err.Error()
	} else {
		LastSuccessTime = successTime
		res.Result.Status.Code = 0
		res.Result.Status.Description = "alive"
	}

	res.LastSuccessTime = LastSuccessTime
	return res, err
}

func updateSuccessTime(xrId string) int64 {
	if LastSuccessTime+MAXAGE < time.Now().UTC().Unix() {
		param := model.DeviceParam{}
		_, res, _ := iBoFOS.IBoFOSInfo(xrId, param)
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
