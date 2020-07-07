package cmd

import (
	"a-module/src/log"
	"a-module/src/setting"
	"github.com/spf13/cobra"
	"os"
	"strconv"
	"time"
)

var isVerbose bool
var isDebug bool
var isJson bool
var isQuiet bool

var ip string
var port string

var GitCommit string
var BuildTime string

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

		rootCmd.PersistentFlags().BoolVar(&isVerbose, "verbose", false, "verbose output")
		rootCmd.PersistentFlags().BoolVar(&isDebug, "debug", false, "set a debug mode")
		rootCmd.PersistentFlags().BoolVar(&isJson, "json", false, "print request and response fommated json")
		rootCmd.PersistentFlags().BoolVar(&isQuiet, "quiet", false, "set a quiet mode")
	}

	rootCmd.PersistentFlags().StringVar(&ip, "ip", "", "set ip adddress like \"--ip 127.0.0.1\"")
	rootCmd.PersistentFlags().StringVar(&port, "port", "", "set port number like \"--port 18716\"")
}

func InitConnect() {

	if isVerbose == true {
		log.SetVerboseMode()
	} else if isDebug == true {
		log.SetDebugMode()
	}

	setting.LoadConfig()

	if len(ip) != 0 {
		setting.Config.Server.IBoF.IP = ip
	}

	if len(port) != 0 {
		setting.Config.Server.IBoF.Port = port
	}

	unixIntValue, _ := strconv.ParseInt(BuildTime, 10, 64)

	log.Info("Git commit: "+GitCommit+"  Build Time: ", time.Unix(unixIntValue, 0))

	log.Info("ip, port :", setting.Config.Server.IBoF.IP, setting.Config.Server.IBoF.Port)
}
