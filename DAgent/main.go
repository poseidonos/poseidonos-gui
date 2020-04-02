package main

import (
	_ "A-module/handler"
	"A-module/log"
	"A-module/setting"
	"DAgent/src/routers"
	"github.com/gin-gonic/gin"
	"net/http"
	"time"
)

// ToDo: Use Lorgus => https://github.com/sirupsen/llogrus
// Log level Redefine

func init() {
	setting.LoadConfig()
	gin.SetMode(gin.DebugMode)
	log.SetDebugMode()
}

func main() {
	//go handler.ConnectToIBoFOS()
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
