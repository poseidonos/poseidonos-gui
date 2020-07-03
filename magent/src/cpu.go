package src

import (
	"context"
	"github.com/shirou/gopsutil/cpu"
	"log"
	"magent"
	"time"
)

type cpuClient interface {
	Times(percpu bool) ([]cpu.TimesStat, error)
}

// MAgentCPU struct implemetns cpuClient Interface. It has a TImes method to fetch CPU Times
type MAgentCPU struct{}

// Times method of MAgentCPU will in turn call the TImes method of the imported cpu package
func (m MAgentCPU) Times(percpu bool) ([]cpu.TimesStat, error) {
	return cpu.Times(percpu)
}

var magentCPU cpuClient = MAgentCPU{}

func collectCPUData(ctx context.Context, dataChan chan main.ClientPoint) {
	defer log.Println("Closing CPU Input")
	for {
		select {
		case <-ctx.Done():
			return
		default:
		}
		times, err := cpuTimes(magentCPU, true, true)
		if err != nil {
			log.Printf("error getting CPU info: %s", err)
		}
		lastStats := make(map[string]cpu.TimesStat)

		for _, cts := range times {
			lastStats[cts.CPU] = cts
		}
		time.Sleep(2000 * time.Millisecond)
		times, err = cpuTimes(magentCPU, true, true)
		stats := make(map[string]cpu.TimesStat)
		fields := make(map[string]interface{})
		tags := map[string]string{"cpu": "cpu-total"}
		for _, cts := range times {
			if cts.CPU == "cpu-total" {
				stats[cts.CPU] = cts
				lastCts, _ := lastStats[cts.CPU]
				lastTotal := (lastCts.User + lastCts.System + lastCts.Nice + lastCts.Iowait + lastCts.Irq + lastCts.Softirq + lastCts.Steal + lastCts.Idle)
				total := cts.User + cts.System + cts.Nice + cts.Iowait + cts.Irq + cts.Softirq + cts.Steal + cts.Idle
				totalDelta := total - lastTotal
				if totalDelta <= 0 {
					continue
				}
				//log.Println("CPU User Usage", cts.CPU, 100*(cts.User-lastCts.User-(cts.Guest-lastCts.Guest))/totalDelta)

				// Create a point and add to batch
				fields["usage_user"] = 100 * (cts.User - lastCts.User - (cts.Guest - lastCts.Guest)) / totalDelta
			}
		}
		newPoint := main.ClientPoint{
			Fields:          fields,
			Tags:            tags,
			Measurement:     "cpu",
			RetentionPolicy: "default_rp",
		}
		dataChan <- newPoint
	}
}

func cpuTimes(client cpuClient, perCPU, totalCPU bool) ([]cpu.TimesStat, error) {
	var cpuTimes []cpu.TimesStat
	if perCPU {
		if perCPUTimes, err := client.Times(true); err == nil {
			cpuTimes = append(cpuTimes, perCPUTimes...)
		} else {
			return nil, err
		}
	}
	if totalCPU {
		if totalCPUTimes, err := client.Times(false); err == nil {
			cpuTimes = append(cpuTimes, totalCPUTimes...)
		} else {
			return nil, err
		}
	}
	return cpuTimes, nil
}
