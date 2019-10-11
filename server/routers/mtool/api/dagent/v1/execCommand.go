package v1

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"ibofdagent/server/routers/mtool/api"
	"ibofdagent/server/routers/mtool/model"
	"ibofdagent/server/util"
	"net/http"
)

func RunFio(ctx *gin.Context) {
	defer checkReturnFail(ctx)
	util.RunScript(ctx, "/root/workspace/ibofos/test/system/nvmf/initiator/fio_full_bench.py &")
	returnSuccess(ctx)

}

func RunIBoF(ctx *gin.Context) {
	defer checkReturnFail(ctx)

	if util.IsIBoFRun() == true {
		panic(fmt.Errorf("exec Run: The iBoFOS already run"))
	}

	util.RunScript(ctx, "./run_ibofos.sh")

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

	util.ExecCmd("kill -9 $(pgrep ibofos)")
	returnSuccess(ctx)
}

func checkReturnFail(ctx *gin.Context) {
	if r := recover(); r != nil {
		err := r.(error)
		description := err.Error()
		api.MakeFailResponse(ctx, http.StatusBadRequest, description, 11000)
	}
}
