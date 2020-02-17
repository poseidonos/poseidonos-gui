package cmd

import (
		"fmt"
		"os"
		"github.com/spf13/cobra"
	   )

var rootCmd = &cobra.Command{
	Use:   "DAgent_CLI",
	Short: "DAgent CLI is CLI for DAgent.",
	Long: `DAgent CLI is CLI for DAgent.

You can set ip and port number of iBoF OS using config.yaml and use a "command" command with -i flag.
		`,
	Run: func(cmd *cobra.Command, args []string) {
		if len(args) == 0 {
			fmt.Println("input a command. if you need to get some help, input \"help\".")
		}
	},
}

func Execute() {
	if err := rootCmd.Execute(); err != nil {
		os.Exit(1)
	}
}
