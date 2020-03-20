package v1

import (
	"fmt"
	"github.com/gin-gonic/gin"
	//"A-module/routers/mtool/api"
	"A-module/util"
	//"net/http"
)

func RunIBoF(ctx *gin.Context) {
	defer checkReturnFail(ctx)

	if util.IsIBoFRun() == true {
		panic(fmt.Errorf("exec Run: The iBoFOS already run"))
	}

	util.RunScript("./run_ibofos.sh", false)

	if util.IsIBoFRun() == false {
		panic(fmt.Errorf("exec Run: Fail to run iBoFOS"))
	}
}

func ForceKillIbof() {
	util.ExecCmd("pkill -9 ibofos", false)
}

func checkReturnFail(ctx *gin.Context) {
	if r := recover(); r != nil {
		//err := r.(error)
		//description := err.Error()
		//api.MakeResponse(ctx, http.StatusBadRequest, description, 11000)
	}
}
