package cmd

import (
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
