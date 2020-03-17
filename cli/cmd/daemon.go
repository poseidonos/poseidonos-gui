package cmd

import (
	"A-module/handler"
    "A-module/log"
    "A-module/setting"
    "github.com/gin-gonic/gin"
    "DAgent/src/routers"
    "net/http"
    "time"
//	"fmt"
	"github.com/spf13/cobra"
	"A-module/errors"
)

var daemonCmd = &cobra.Command{
  Use:   "daemon",
  Short: "daemon mode",
  Long:  `run on daemon mode.

Usage : 

run cli on daemon mode.



You can set ip and port number for connent to Poseidon OS using config.yaml or flags.
Default value is as below.

IP   : 127.0.0.1
Port : 18716


	  `,
  Args: func(cmd *cobra.Command, args []string) error {

	if len(args) > 0 {
      return errors.New("no args !!!")
    }

	return nil
  },

  Run: func(cmd *cobra.Command, args []string) {
	Daemon(cmd, args)
  },
}

func init() {

	if Mode == "debug" {
		rootCmd.AddCommand(daemonCmd)
	}
}

func Daemon(cmd *cobra.Command, args []string) {
	Dagent()
}

func Dagent() {

	setting.LoadConfig()
    gin.SetMode(gin.DebugMode)
    log.SetDebugMode()

	go handler.ConnectToIBoFOS()
    startServer()
}

func startServer() {
    routersInit := routers.InitRouter()

    server := &http.Server{
        Addr:           ":" + setting.Config.Server.Dagent.Port,
        Handler:        routersInit,
        ReadTimeout:    30 * time.Second,
        WriteTimeout:   30 * time.Second,
        MaxHeaderBytes: 1 << 20,
    }

    server.ListenAndServe()
}
