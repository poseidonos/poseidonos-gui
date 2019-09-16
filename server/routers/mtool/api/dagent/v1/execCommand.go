package v1

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"ibofdagent/server/routers/mtool/api"
	"log"
	"net/http"
	"os/exec"
)

func RunIBoF(ctx *gin.Context) {
	defer returnFail(ctx)

	fileName := "./run_ibofos.sh"
	grantExecPermission(fileName)
	if isIBoFRun() == true {
		panic(fmt.Errorf("exec Run: The iBoFOS already run"))
	}
	execRun(fileName)

	if isIBoFRun() == false {
		panic(fmt.Errorf("exec Run: Fail to run iBoFOS"))
	}
	returnSuccess(ctx)
}

func isIBoFRun() bool {
	execCmd := exec.Command("sudo", "pgrep", "ibofos")
	out, _ := execCmd.Output()
	//if err != nil {
	//	panic(fmt.Errorf("isIBoFRun : %v", err))
	//}
	strOut := string(out)
	log.Printf("The iBoFOS Pid is %s\n", strOut)
	if strOut == "" {
		return false
	} else {
		return true
	}
}

func grantExecPermission(fileName string) {
	execCmd := exec.Command("sudo", "chmod", "+x", fileName)
	err := execCmd.Run()
	if err != nil {
		panic(fmt.Errorf("grantExecPermission : %v", err))
	}
}

func returnSuccess(ctx *gin.Context) {
	response := api.Response{}
	response.Result.Status.Code = 0
	response.Result.Status.Description = "Success"
	ctx.JSON(http.StatusOK, &response)
}

func returnFail(ctx *gin.Context) {
	if r := recover(); r != nil {
		err := r.(error)
		response := api.Response{}
		response.Result.Status.Code = -997

		log.Printf("Error : %f", err.Error())
		response.Result.Status.Description = err.Error()
		ctx.AbortWithStatusJSON(http.StatusBadRequest, &response)
	}
}

func ForceKillIbof(ctx *gin.Context) {
	defer returnFail(ctx)

	execRun("kill -9 $(pgrep ibofos)")
	returnSuccess(ctx)
}

func execRun(cmd string) {
	execCmd := exec.Command("sudo", "bash", "-c", cmd)
	err := execCmd.Run()
	if err != nil {
		panic(fmt.Errorf("exec Run: %v", err))
	}
}
