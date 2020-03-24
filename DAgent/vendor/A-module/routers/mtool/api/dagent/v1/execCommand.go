package v1

import (
	iBoFOSV1 "A-module/routers/mtool/api/ibofos/v1"
	"A-module/routers/mtool/model"
	"A-module/util"
)

func RunIBoF() (model.Response, error) {
	res := model.Response{}

	if util.IsIBoFRun() == true {
		res.Result.Status.Code = 27756
		return res, iBoFOSV1.ErrRes
	}

	util.RunScript("./run_ibofos.sh", false)

	if util.IsIBoFRun() == false {
		res.Result.Status.Code = 27757
		return res, iBoFOSV1.ErrRes
	}

	res.Result.Status.Code = 0
	return res, nil
}

func ForceKillIbof() (model.Response, error) {
	util.ExecCmd("pkill -9 ibofos", false)
	res := model.Response{}
	res.Result.Status.Code = 0
	return res, nil
}
