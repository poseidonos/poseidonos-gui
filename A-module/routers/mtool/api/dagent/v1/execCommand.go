package v1

import (
	iBoFOSV1 "A-module/routers/mtool/api/ibofos/v1"
	"A-module/util"
)

func RunIBoF() (int, error) {
	if util.IsIBoFRun() == true {
		return 27756, iBoFOSV1.ErrRes
	}

	util.RunScript("./run_ibofos.sh", false)

	if util.IsIBoFRun() == false {
		return 27757, iBoFOSV1.ErrRes
	}

	return 0, nil
}

func ForceKillIbof() (int, error) {
	util.ExecCmd("pkill -9 ibofos", false)
	return 0, nil
}
