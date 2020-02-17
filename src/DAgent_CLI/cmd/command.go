package cmd

import (
		"fmt"
		"time"
		"github.com/spf13/cobra"
		"A-module/log"
		"A-module/errors"
		"A-module/handler"
		"A-module/setting"
		iBoFOSV1 "A-module/routers/mtool/api/ibofos/v1"
	   )

var Verbose bool
var Debug bool

var IP string
var Port string

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
  Use:   "command [msg]",
  Short: "Command to Poseidon OS",
  Long:  `Command to Poseidon OS and get a reply fommated by JSON.

Available msg list :

[Category] : [msg]
array      : listarray, loadarray, createarray, deletearray
device     : scandevice, listdevice, attachdevice, detachdevice
system     : heartbeat,exitibofos, info, mountibof, unmountibof
volume     : create, update, mountvolume, unmountvolume, delete, list


You can set ip and port number for connent to Poseidon OS using config.yaml or flags.
Default value is as below.

IP   : 127.0.0.1
Port : 18716


	  `,
  Args: func(cmd *cobra.Command, args []string) error {

	if len(args) != 1 {
      return errors.New("need an one msg !!!")
    }

	val, exists := commands[args[0]]
	_ =  val

	if !exists {
		return errors.New("not available msg !!!")
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
	commandCmd.PersistentFlags().StringVarP(&IP, "ip", "i", "", "set ip adddress like \"-i 127.0.0.1\"")
	commandCmd.PersistentFlags().StringVarP(&Port, "port", "p", "", "set port number like \"-p 18716\"")
}

func Send(command string) {

	if Verbose == true {
		log.SetVerboseMode()
	} else if Debug == true {
		log.SetDebugMode()
	}

	setting.LoadConfig()
	
	if len(IP) != 0 {
		setting.Config.Server.IBoF.IP = IP
	}
	
	if len(Port) != 0 {
		setting.Config.Server.IBoF.Port = Port
	}
	
	log.Println("ip, port :", setting.Config.Server.IBoF.IP, setting.Config.Server.IBoF.Port)

	go handler.ConnectToIBoFOS()

	time.Sleep(time.Second*2)
	
	if len(setting.Config.IBoFOSSocketAddr) > 0 {
		commands[command]()
	} else {
		fmt.Println("Cannot connect to Poseidon OS !!!")
	}
}
