package cmd

import (
		"os"
		"time"
		"github.com/spf13/cobra"
		"A-module/log"
		"A-module/handler"
		"A-module/setting"
)

var verbose bool
var debug bool

var ip string
var port string

var rootCmd = &cobra.Command{
	Use:   "cli",
	Short: "IBoF cli is simple client of IBoF.",
	Long: `IBoF cli is simple client of IBoF.

You can set ip and port number of iBoF using config.yaml and use a "command" command with -i flag.
		`,
	Run: func(cmd *cobra.Command, args []string) {
		if len(args) == 0 {
			cmd.Help()
			os.Exit(0)
		}
	},
}

func Execute() {
	if err := rootCmd.Execute(); err != nil {
		os.Exit(1)
	}
}

func init() {

	if Mode == "debug" {
		rootCmd.PersistentFlags().BoolVarP(&verbose, "verbose", "v", false, "verbose output")
		rootCmd.PersistentFlags().BoolVar(&debug, "debug", false, "set a debug mode")
	}
	
	rootCmd.PersistentFlags().StringVar(&ip, "ip", "", "set ip adddress like \"--ip 127.0.0.1\"")
	rootCmd.PersistentFlags().StringVar(&port, "port", "", "set port number like \"--port 18716\"")
}

func InitConnect() bool{

	if verbose == true {
		log.SetVerboseMode()
	} else if debug == true {
		log.SetDebugMode()
	}

	setting.LoadConfig()

	if len(ip) != 0 {
		setting.Config.Server.IBoF.IP = ip
	}

	if len(port) != 0 {
		setting.Config.Server.IBoF.Port = port
	}

	log.Println("ip, port :", setting.Config.Server.IBoF.IP, setting.Config.Server.IBoF.Port)

	go handler.ConnectToIBoFOS()

	time.Sleep(time.Second*1)

	if len(setting.Config.IBoFOSSocketAddr) > 0 {
		return true
	} else {
		return false
	}
}
