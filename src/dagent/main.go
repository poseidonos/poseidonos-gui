package main

import (
	"context"
	"dagent/src/routers"
	"dagent/src/routers/m9k/api/dagent"
	"github.com/gin-gonic/gin"
	"io/ioutil"
	"net/http"
	"os"
	"os/signal"
	"kouros/log"
	"kouros/setting"
	"kouros/utils"
	"time"
)

const TimeOut = 30

func init() {
	log.SetDebugMode()
	setting.LoadConfig()
	utils.LoadEvents()
	gin.SetMode(gin.ReleaseMode)
	//gin.SetMode(gin.DebugMode)
	gin.DefaultWriter = ioutil.Discard
}

func main() {
	showBuildInfo()
	startServer()
}

func showBuildInfo() {
	log.Infof("GitHash : %s / Build Time (UTC) : %s", dagent.GitCommit, dagent.BuildTime)
}

func startServer() {
	routersInit := routers.InitRouter()
	server := &http.Server{
		Addr:           ":" + setting.Config.Server.Dagent.Port,
		Handler:        routersInit,
		ReadTimeout:    TimeOut * time.Second,
		WriteTimeout:   TimeOut * time.Second,
		MaxHeaderBytes: 1 << 20,
	}

	go func() {
		if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("listen: %s\n", err)
		}
	}()

	quit := make(chan os.Signal)
	signal.Notify(quit, os.Interrupt)

	<-quit

	log.Info("Shutdown Server ...")
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)

	defer cancel()

	if err := server.Shutdown(ctx); err != nil {
		log.Fatal("Server Shutdown:", err)

	}

	log.Info("Server exiting")
}
