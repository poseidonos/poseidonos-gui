package v1

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"ibofdagent/src/routers/mtool/api"
	"ibofdagent/src/routers/mtool/model"
	"ibofdagent/src/util"
	"net/http"
)

func RunFio(ctx *gin.Context) {
	defer checkReturnFail(ctx)
	util.RunScript(ctx, "/root/workspace/ibofos/test/system/nvmf/initiator/fio_full_bench.py", true)
	returnSuccess(ctx)

}

func RunIBoF(ctx *gin.Context) {
	defer checkReturnFail(ctx)

	if util.IsIBoFRun() == true {
		panic(fmt.Errorf("exec Run: The iBoFOS already run"))
	}

	util.RunScript(ctx, "./run_ibofos.sh", false)

	if util.IsIBoFRun() == false {
		panic(fmt.Errorf("exec Run: Fail to run iBoFOS"))
	}
	returnSuccess(ctx)
}

func returnSuccess(ctx *gin.Context) {
	response := model.Response{}
	response.Result.Status.Code = 0
	response.Result.Status.Description = "Success"
	ctx.JSON(http.StatusOK, &response)
}

func ForceKillIbof(ctx *gin.Context) {
	defer checkReturnFail(ctx)

	util.ExecCmd("pkill -9 ibofos", false)
	returnSuccess(ctx)
}

func checkReturnFail(ctx *gin.Context) {
	if r := recover(); r != nil {
		err := r.(error)
		description := err.Error()
		api.MakeFailResponse(ctx, http.StatusBadRequest, description, 11000)
	}
}
