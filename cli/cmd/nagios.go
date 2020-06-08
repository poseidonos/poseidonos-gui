package cmd

import (
	_ "a-module/routers/m9k/model"
	"encoding/json"
	"fmt"
	"strconv"
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
	isQuiet = true

	res, _ := Send(cmd, command)

	if res.Result.Data != nil {
		b, _ := json.Marshal(res.Result.Data)

		if string(b) == "null" {
			fmt.Println("CRITICAL: Fail to get the size of volumes")
		} else {
			result := "OK: Success |"
			
			for i :=0 ; i < int(gjson.Get(string(b),"volumes.#").Int()) ; i++ {
				
				value := gjson.Get(string(b), "volumes." + strconv.Itoa(i)).String()
				
				result += "'" + gjson.Get(value, "name").String() + "'=" + gjson.Get(value, "total").String() + "B;" 
			}
			
			fmt.Println(result[:len(result)-1])
		}
	}
}
