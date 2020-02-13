package cmd

import (
		"fmt"
		"time"
		//"bytes"
		//"io/ioutil"
		//"net/http"
		"github.com/spf13/cobra"
		"A-module/log"
		"errors"
		//"A-module/errors"
		"A-module/handler"
		"A-module/setting"
		iBoFOSV1 "A-module/routers/mtool/api/ibofos/v1"
	   )

var Verbose bool
var Debug bool
var commands = map[string]func() {
//array
	"listarray" : iBoFOSV1.ListArrayDeviceCLI,
	"loadarray" : iBoFOSV1.LoadArrayCLI,
	"createarray" : iBoFOSV1.CreateArrayCLI,
	"deletearray" : iBoFOSV1.DeleteArrayCLI,
//device
	"scandevice" : iBoFOSV1.ScanDeviceCLI,
	"listdevice" : iBoFOSV1.ListDeviceCLI,
	"attachdevice" : iBoFOSV1.AttachDeviceCLI,
	"detachdevice" : iBoFOSV1.DetachDeviceCLI,
//system
	"heartbeat" : iBoFOSV1.HeartbeatCLI,
	"exitibofos" :iBoFOSV1.ExitiBoFOSCLI,
	"info" :iBoFOSV1.IBoFOSInfoCLI,
	"mountibof" :iBoFOSV1.MountiBoFOSCLI,
	"unmountibof" :iBoFOSV1.UnmountiBoFOSCLI,
//volume
	"create" : iBoFOSV1.CreateVolumeCLI,
	"update" : iBoFOSV1.UpdateVolumeCLI,
	"mountvolume" : iBoFOSV1.MountVolumeCLI,
	"unmountvolume" : iBoFOSV1.UnmountVolumeCLI,
	"delete" : iBoFOSV1.DeleteVolumeCLI,
	"list" : iBoFOSV1.ListVolumeCLI,
}

var commandCmd = &cobra.Command{
  Use:   "command",
  Short: "Command to Poseidon OS",
  Long:  `Command to Poseidon OS and get a reply fommated by JSON`,
  Args: func(cmd *cobra.Command, args []string) error {

	if len(args) != 1 {
      return errors.New("need an one args !!!")
    }

	val, exists := commands[args[0]]
	_ =  val

	if !exists {
		return errors.New("not available command!!!")
	}

	return nil
  },

  Run: func(cmd *cobra.Command, args []string) {
	Send(args[0])
  },
}

func init() {
	rootCmd.AddCommand(commandCmd)
	commandCmd.PersistentFlags().BoolVarP(&Verbose, "verbose", "v", false, "verbose output")
	commandCmd.PersistentFlags().BoolVarP(&Debug, "debug", "d", false, "set a debug mode")
}

func Send(command string) {

	fmt.Println("command you want to send ", command)

	if Verbose == true {
		log.SetVerboseMode()
	} else if Debug == true {
		log.SetDebugMode()
	}

	setting.LoadConfig()

	go handler.ConnectToIBoFOS()

	time.Sleep(time.Second*1)

	commands[command]()

}
