package cmd

import (
		"fmt"
		"time"
		"github.com/spf13/cobra"
		"A-module/log"
		"A-module/errors"
		"A-module/handler"
		"A-module/setting"
		"A-module/routers/mtool/model"
)

var testname string
var argv []string
var argc int

var wbtCmd = &cobra.Command{
  Use:   "wbt [msg]",
  Short: "WBT for Poseidon OS",
  Long:  `Execute WBT for Poseidon OS.

Usage : 

Input test name and argc and argv.
Multiple args are seperated by ',' not ' '.



You can set ip and port number for connent to Poseidon OS using config.yaml or flags.
Default value is as below.

IP   : 127.0.0.1
Port : 18716


	  `,
  Args: func(cmd *cobra.Command, args []string) error {

	if len(args) != 3 {
      return errors.New("need test name, argc and argv !!!")
    }
	
	return nil
  },

  Run: func(cmd *cobra.Command, args []string) {
	Wbt()
  },
}

func init() {

	rootCmd.AddCommand(wbtCmd)

	wbtCmd.PersistentFlags().StringVarP(&testname,"name", "n", "", "input test name \"-n moon\"")
	wbtCmd.PersistentFlags().StringSliceVarP(&argv, "argv", "v", []string{}, "input argv like \"-v 1,2,3\"")
	wbtCmd.PersistentFlags().IntVarP(&argc, "argc", "c", 0, "input argc like \"-c 5\"")

}

func Wbt() {

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

	time.Sleep(time.Second*1)

	if len(setting.Config.IBoFOSSocketAddr) > 0 {

			param := model.WBTParam{}
			param.Name = testname
			param.Argc = argc

			for _, v := range argv {
				fmt.Println(", ", v)
				//device := model.Device{}
				//device.DeviceName = v
				//param.Buffer = append(param.Buffer, device)

			}
			
			//ArrayCommand[command](param)
	} else {
		fmt.Println("Cannot connect to Poseidon OS !!!")
	}
}
