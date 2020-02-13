package cmd

import (
		"os"
		"github.com/spf13/cobra"
	   )

var rootCmd = &cobra.Command{
	Use:   "DAgent_CLI",
	Short: "DAgent CLI is CLI for DAgent.",
	Long: `DAgent CLI is CLI for DAgent.`,
	Run: func(cmd *cobra.Command, args []string) {
			   // Do Stuff Here
		   },
}

func Execute() {
	if err := rootCmd.Execute(); err != nil {
		os.Exit(1)
	}
}

func init() {
	//rootCmd.PersistentFlags().BoolVarP(&Verbose, "verbose", "v", false, "verbose output")
	//rootCmd.PersistentFlags().BoolVarP(&Debug, "debug", "d", false, "set a debug mode")
	//rootCmd.PersistentFlags().BoolVarP(&Send, "send", "s", false, "send a command")
}
