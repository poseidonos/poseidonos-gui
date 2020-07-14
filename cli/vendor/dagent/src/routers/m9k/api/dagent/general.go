package dagent

import (
	iBoFOS "a-module/src/routers/m9k/api/ibofos"
	"a-module/src/routers/m9k/model"
	"errors"
	"syscall"
	"time"
)

var GitCommit string
var BuildTime string

var LastSuccessTime int64

const MAXAGE int64 = 4 // 4sec

func HeartBeat(xrId string) (model.Response, error) {
	var err error
	var res model.Response
	successTime := updateSuccessTime(xrId)

	if successTime <= 0 {
		err = errors.New("one of iBoF service is dead")
		res.Result.Status.Code = 12010
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

func KillDAgent(xrId string) (model.Response, error) {
	res := model.Response{}
	res.Result.Status.Code = 0
	syscall.Kill(syscall.Getpid(), syscall.SIGINT)
	return res, nil
}

func Version(xrId string) (model.Response, error) {
	buildInfo := model.BuildInfo{GitHash: GitCommit, BuildTime: BuildTime}
	res := model.Response{}
	res.Result.Data = buildInfo

	if GitCommit == "" || BuildTime == "" {
		res.Result.Status.Code = 12020
	} else {
		res.Result.Status.Code = 0
	}
	return res, nil
}
