package cmd

import (
	_ "a-module/routers/m9k/model"
	"encoding/json"
	"fmt"
	"github.com/spf13/cobra"
	"github.com/tidwall/gjson"
)

var nagiosCmd = &cobra.Command{
	Use:   "nagios",
	Short: "nagios",
	Long:  `nagios`,
	Args: func(cmd *cobra.Command, args []string) error {
		return nil
	},

	Run: func(cmd *cobra.Command, args []string) {
		PrintVol(cmd, args)
	},
}

func init() {

	rootCmd.AddCommand(nagiosCmd)

}

func PrintVol(cmd *cobra.Command, args []string) {

	command := make([]string, 1)
	command[0] = "list_vol"

	res, _ := Send(cmd, command)

	if res.Result.Data != nil {
		b, _ := json.Marshal(res.Result.Data)
		value := gjson.Get(string(b), "volumes")
		fmt.Println(value.String())
	}
}
