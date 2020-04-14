package util

import (
	"A-module/log"
	"fmt"
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

func grantPermission(fileName string) {
	execCmd := exec.Command("sudo", "chmod", "+x", fileName)
	err := execCmd.Run()
	if err != nil {
		panic(fmt.Errorf("grantExecPermission : %v", err))
	}
}

func ExecCmd(cmd string, background bool) error {
	execCmd := exec.Command("sudo", "bash", "-c", cmd)
	output, err := execCmd.CombinedOutput()

	if err != nil {
		return fmt.Errorf("exec Run: %v %s", err, output)
	}

	log.Println(string(output))

	return nil
}

func RunScript(filePath string, background bool) {
	grantPermission(filePath)
	ExecCmd(filePath, background)
}
