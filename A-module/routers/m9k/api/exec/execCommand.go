package exec

import (
	"A-module/routers/m9k/model"
	"A-module/util"
)

func ForceKillIbof(xrId string) (model.Response, error) {
	util.ExecCmd("pkill -9 ibofos", false)
	res := model.Response{}
	res.Result.Status.Code = 0
	return res, nil
}
