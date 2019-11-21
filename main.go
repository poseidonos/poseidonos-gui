package main

import (
	"github.com/gin-gonic/gin"
	log "github.com/sirupsen/logrus"
	"ibofdagent/server/handler"
	"ibofdagent/server/routers"
	"ibofdagent/server/setting"
	"net/http"
	"time"
)

// ToDo: Use Lorgus => https://github.com/sirupsen/logrus
// Log level Redefine

func init() {
	setting.LoadConfig()
	gin.SetMode(gin.DebugMode)
}

func main() {
	log.WithFields(log.Fields{
		"animal": "walrus",
	}).Info("A walrus appears")

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
