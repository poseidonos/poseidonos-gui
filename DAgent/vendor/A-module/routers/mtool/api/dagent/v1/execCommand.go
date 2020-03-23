package v1

import (
	iBoFOSV1 "A-module/routers/mtool/api/ibofos/v1"
	"A-module/util"
)

func RunIBoF() error {
	if util.IsIBoFRun() == true {
		//return errors.New("exec Run: The iBoFOS already run")
		return iBoFOSV1.ErrRes
	}

	util.RunScript("./run_ibofos.sh", false)

	if util.IsIBoFRun() == false {
		//return errors.New("exec Run: Fail to run iBoFOS")
		return iBoFOSV1.ErrRes
	}

	return nil
}

func ForceKillIbof() error {
	util.ExecCmd("pkill -9 ibofos", false)
	return nil
}
