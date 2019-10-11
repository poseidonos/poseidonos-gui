package util

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"log"
	"os/exec"
)

func IsIBoFRun() bool {
	execCmd := exec.Command("sudo", "pgrep", "ibofos")
	out, _ := execCmd.Output()

	strOut := string(out)
	log.Printf("The iBoFOS Pid is %s", strOut)
	if strOut == "" {
		return false
	} else {
		return true
	}
}

func GrantPermission(fileName string) {
	execCmd := exec.Command("sudo", "chmod", "+x", fileName)
	err := execCmd.Run()
	if err != nil {
		panic(fmt.Errorf("grantExecPermission : %v", err))
	}
}

func ExecCmd(cmd string) {
	execCmd := exec.Command("sudo", "bash", "-c", cmd)
	err := execCmd.Run()
	if err != nil {
		panic(fmt.Errorf("exec Run: %v", err))
	}
}

func RunScript(ctx *gin.Context, filePath string) {
	GrantPermission(filePath)
	ExecCmd(filePath)
}