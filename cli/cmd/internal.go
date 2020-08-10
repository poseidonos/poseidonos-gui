package cmd

import (
	"a-module/src/errors"
	iBoFOS "a-module/src/routers/m9k/api/ibofos"
	"a-module/src/routers/m9k/model"
	"github.com/spf13/cobra"
)

var InternalCommand = map[string]func(string, interface{}) (model.Request, model.Response, error){
    "start_monitoring": iBoFOS.StartDeviceMonitoring,
    "stop_monitoring":  iBoFOS.StopDeviceMonitoring,
    "monitoring_state": iBoFOS.DeviceMonitoringState,
    "stop_rebuilding":  iBoFOS.StopRebuilding,
}

var internalCmd = &cobra.Command{
	Use:   "internal [msg]",
	Short: "Request for internal msg to Poseidon OS",
	Long: `Request for internal msg to Poseidon OS and get a response fommated by JSON.

Available msg list :

[Category] : [msg]            : [description]                                                    : [example of flag]

internal   : start_monitoring : Start monitoring daemon manually.                                : not needed
           : stop_monitoring  : Stop monitoring daemon manually.                                 : not needed
           : monitoring_state : Get monitoring state.                                            : not needed
           : stop_rebuilding  : Stop rebuilding.                                                 : not needed


If you want to input multiple flag parameter, you have to seperate with ",". 
For example, "-d dev1,dev2,dev3". seperation by space is not allowed.


You can set ip and port number for connect to Poseidon OS using config.yaml or flags.
Default value is as below.

IP   : 127.0.0.1
Port : 18716


	  `,
	Args: func(cmd *cobra.Command, args []string) error {

		if len(args) != 1 {
			return errors.New("need an one msg !!!")
		}

		_, exist := InternalCommand[args[0]]

		if !exist {
			return errors.New("not available msg !!!")
		}

		return nil
	},

	Run: func(cmd *cobra.Command, args []string) {
		Send(cmd, args)
	},
}

func init() {

	rootCmd.AddCommand(internalCmd)
}
