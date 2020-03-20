package cmd

import (
//		"fmt"
		"github.com/google/uuid"
		"github.com/spf13/cobra"
		"A-module/errors"
		"A-module/routers/mtool/model"
		iBoFOSV1 "A-module/routers/mtool/api/ibofos/v1"
)

var list bool

var wbtCmd = &cobra.Command{
  Use:   "wbt [argument...]",
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

	return nil
  },

  Run: func(cmd *cobra.Command, args []string) {
	WBT(cmd, args)
  },
}

func init() {

	if Mode == "debug" {
		rootCmd.AddCommand(wbtCmd)
	}

	wbtCmd.PersistentFlags().BoolVarP(&list, "list", "l", false, "list wbt")
}

func WBT(cmd *cobra.Command, args []string) {

	if InitConnect() {

		var xrId string
		uuid, err := uuid.NewUUID()
		if err == nil {
			xrId = uuid.String()
		}
		
		if !list {
			param := model.WBTParam{}
			param.Name = args[0]
			param.Argc = len(args)

			for i, v := range args {
				if i > 0 {
					param.Argv += v + " "
				}
			}

			iBoFOSV1.WBTTest(xrId, param)
		} else {
			iBoFOSV1.WBTList(xrId, model.WBTParam{})
		}

	} else {
		errors.New("Cannot connect to Poseidon OS !!!")
	}
}
