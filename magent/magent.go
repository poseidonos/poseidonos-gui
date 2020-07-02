package main

import (
	"context"
	"log"
	"os"
	"os/signal"
	"syscall"
	"time"
)

const (
	// MAgentDB specifies the DB in InfluxDB
	MAgentDB = "mtool_db"
	username = ""
	password = ""
)

// Config has the configurable parameters in MAgent
type Config struct {
	Interval int //Time in MilliSeconds
}

// ClientPoint has the fields that should be passed to be written to DB
type ClientPoint struct {
	Fields          map[string]interface{}
	Tags            map[string]string
	Measurement     string
	RetentionPolicy string
	Timestamp       time.Time
}

type tailFields struct {
	test string
}

// MAgentConfig has the Configuration values for M-Agent
var MAgentConfig = Config{
	Interval: 1000,
}

func main() {
	dataChan := make(chan ClientPoint, 100)
	defer close(dataChan)
	ctx, cancel := context.WithCancel(context.Background())

	//The following code is for capturing OS signals and to close the application
	signals := make(chan os.Signal)
	signal.Notify(signals, os.Interrupt, syscall.SIGHUP,
		syscall.SIGTERM, syscall.SIGINT)
	go func() {
		<-signals
		log.Printf("Exit Signal received")
		cancel()
	}()
	go func() {
		startInputs(ctx, dataChan)
	}()
	WriteToDB(ctx, "http", dataChan)
}

func startInputs(ctx context.Context, dataChan chan ClientPoint) {
	defer log.Println("All inputs Closed")
	go tailFile(ctx, false, "/tmp/air_result.json", "json", "air", "default_rp", dataChan)
	go tailFile(ctx, false, "/etc/ibofos/report/report.log", "text", "rebuilding_status", "autogen", dataChan)
	go collectCPUData(ctx, dataChan)
	go CollectMemoryData(ctx, dataChan)
	go CollectDiskData(ctx, dataChan)
	go CollectEthernetData(ctx, dataChan)
	go CollectNetworkData(ctx, dataChan)
	<-ctx.Done()
}
