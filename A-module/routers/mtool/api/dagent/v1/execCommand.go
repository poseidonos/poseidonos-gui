package v1

import (
	"A-module/errors"
	"A-module/util"
)

func RunIBoF() error {
	if util.IsIBoFRun() == true {
		return errors.New("exec Run: The iBoFOS already run")
	}

	util.RunScript("./run_ibofos.sh", false)

	if util.IsIBoFRun() == false {
		return errors.New("exec Run: Fail to run iBoFOS")
	}

	return nil
}

func ForceKillIbof() {
	util.ExecCmd("pkill -9 ibofos", false)
}
