package agent

import (
	"context"
	"log"
	"os"
	"os/signal"
	"syscall"
	"magent/src/inputs"
	"magent/src/outputs"
	"magent/src/models"
)

func Start() {
	dataChan := make(chan models.ClientPoint, 100)
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
	outputs.WriteToDB(ctx, "http", dataChan)
}

func startInputs(ctx context.Context, dataChan chan models.ClientPoint) {
	defer log.Println("All inputs Closed")
	go inputs.TailFile(ctx, false, "/tmp/air_result.json", "json", "air", "default_rp", dataChan)
	go inputs.TailFile(ctx, false, "/etc/ibofos/report/report.log", "text", "rebuilding_status", "autogen", dataChan)
	go inputs.CollectCPUData(ctx, dataChan)
	go inputs.CollectMemoryData(ctx, dataChan)
	go inputs.CollectDiskData(ctx, dataChan)
	go inputs.CollectEthernetData(ctx, dataChan)
	go inputs.CollectNetworkData(ctx, dataChan)
	<-ctx.Done()
}
