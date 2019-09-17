package v1

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"ibofdagent/server/routers/mtool/api"
	"ibofdagent/server/util"
	"net/http"
)

func RunIBoF(ctx *gin.Context) {
	defer checkReturnFail(ctx)

	fileName := "./run_ibofos.sh"
	util.GrantExecPermission(fileName)
	if util.IsIBoFRun() == true {
		panic(fmt.Errorf("exec Run: The iBoFOS already run"))
	}
	util.ExecCmd(fileName)

	if util.IsIBoFRun() == false {
		panic(fmt.Errorf("exec Run: Fail to run iBoFOS"))
	}
	returnSuccess(ctx)
}

func returnSuccess(ctx *gin.Context) {
	response := api.Response{}
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
		api.MakeFailResponseWithDescription(ctx, description, 11000)
	}
}
