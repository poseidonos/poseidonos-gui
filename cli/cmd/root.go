package cmd

import (
		"os"
		"github.com/spf13/cobra"
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
