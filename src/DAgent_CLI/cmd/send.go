package cmd

import (
		//"fmt"
		"time"
		//"bytes"
		//"io/ioutil"
		//"net/http"
		"github.com/spf13/cobra"
		"A-module/log"
		"A-module/errors"
		"A-module/handler"
		//"module/routers"
		"A-module/setting"
		iBoFOSV1 "A-module/routers/mtool/api/ibofos/v1"
	   )

var Verbose bool
var Debug bool

var sendCmd = &cobra.Command{
  Use:   "send",
  Short: "Send a command to Poseidon OS",
  Long:  `Send a command to Poseidon OS and get a reply fommated by JSON`,
  Args: func(cmd *cobra.Command, args []string) error {
    if len(args) < 1 {
      //return fmt.Println("Type help or -h to see the list of commands")
      return errors.New("requires a command argument")
    }
    
	return nil
  },
  Run: func(cmd *cobra.Command, args []string) {
    //fmt.Println("Type help or -h to see the list of commands")
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

	time.Sleep(time.Second*3)
	
	iBoFOSV1.HeartbeatCLI()
	
	time.Sleep(time.Second*3)
	iBoFOSV1.IBoFOSInfoCLI()
	time.Sleep(time.Second*3)
	//iBoFOSV1.ExitiBoFOSCLI()
	time.Sleep(time.Second*3)
	
	iBoFOSV1.ListVolumeCLI()

	
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
