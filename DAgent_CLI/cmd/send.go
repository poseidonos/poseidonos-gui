package cmd

import (
		//"fmt"
		"time"
		//"bytes"
		//"io/ioutil"
		//"net/http"
		"github.com/spf13/cobra"
		"A-module/log"
		"A-module/handler"
		//"module/routers"
		"A-module/setting"
		iBoFOSV1 "A-module/routers/mtool/api/ibofos/v1"
	   )

var Verbose bool
var Debug bool

var sendCmd = &cobra.Command{
  Use:   "send",
  Short: "sss Print the version number of DAgent CLI",
  Long:  `ssss All software has versions. This is DAgent CLI's`,
  Run: func(cmd *cobra.Command, args []string) {
    //fmt.Println("ssssDAgent CLI Version 0.1.")
	Setup()
  },
}

func init() {
	rootCmd.AddCommand(sendCmd)
	
	sendCmd.PersistentFlags().BoolVarP(&Verbose, "verbose", "v", false, "verbose output")
	sendCmd.PersistentFlags().BoolVarP(&Debug, "debug", "d", false, "set a debug mode")
}

func Setup() {

	if Verbose == true {
		log.SetVerboseMode()
	} else if Debug == true {
		log.SetDebugMode()
	}

	setting.LoadConfig()

	go handler.ConnectToIBoFOS()

	time.Sleep(time.Second*1)

	iBoFOSV1.HeartbeatCLI()
	iBoFOSV1.IBoFOSInfoCLI()
	iBoFOSV1.ExitiBoFOSCLI()
	

	
		/*
	
	routersInit := routers.InitRouter()
	server := &http.Server{
		Addr:           ":" + setting.Config.Server.Dagent.Port,
		Handler:        routersInit,
		ReadTimeout:    30 * time.Second,
		WriteTimeout:   30 * time.Second,
		MaxHeaderBytes: 1 << 20,
	}
	log.Warn("before server runs")

	go server.ListenAndServe()
	
	log.Warn("after server runs")

	reqBody := bytes.NewBufferString("Post plain text")
	resp, err := http.Post("http://127.0.0.1:3000/mtool/api/dagent/v1/ibofos", "text/plain", reqBody)
    if err != nil {
        panic(err)
    }

    defer resp.Body.Close()

    respBody, err := ioutil.ReadAll(resp.Body)
    if err == nil {
        str := string(respBody)
        println(str)
    }
*/
	
}
