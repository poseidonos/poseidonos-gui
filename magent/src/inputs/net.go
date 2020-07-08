/*

DESCRIPTION: This file contains the code related to getting RNIC related data
NAME : net.go
@AUTHORS: Aswin K K
@Version : 1.0 *
@REVISION HISTORY
[5/28/2020] [aswin.kk]: Added code for fetching data stats at the RNIC

*/

package inputs

import (
	"bytes"
	"context"
	"github.com/shirou/gopsutil/net"
	"io"
	"log"
	"os/exec"
	"strings"
	"time"
	"magent/src/models"
	"magent/src/config"
)

// lsPCI executes the lspci command and returns the data in a list
func lsPCI() []string {
	lspci := exec.Command("lspci")
	grep := exec.Command("grep", "Mellanox")
	r, w := io.Pipe()
	lspci.Stdout = w
	grep.Stdin = r
	var b2 bytes.Buffer
	grep.Stdout = &b2
	err := lspci.Start()
	err = grep.Start()
	err = lspci.Wait()
	err = w.Close()
	err = grep.Wait()
	err = r.Close()
	if err != nil {
		log.Println("Error occured in Executing Command", err)
	}
	pcis := strings.Split(b2.String(), "\n")
	pciList := []string{}
	for _, pci := range pcis {
		pciDetails := strings.Split(pci, " ")
		if len(pciDetails) > 1 {
			pciList = append(pciList, pciDetails[0])
		}
	}
	return pciList
}

// lsHW executes the lshw command and return the data in a map
func lsHW(pciList []string) map[string]bool {
	lshw, _ := exec.Command("lshw", "-c", "network", "-businfo").Output()
	hw := strings.Split(string(lshw), "\n")
	portList := map[string]bool{}
	for _, pci := range pciList {
		for _, h := range hw {
			if strings.Contains(h, pci) {
				portList[strings.Fields(h)[1]] = true

			}
		}

	}
	return portList
}

// CollectNetworkData collects the network details and passes it to the channel
func CollectNetworkData(ctx context.Context, dataChan chan models.ClientPoint) {
	pcis := lsPCI()
	portList := lsHW(pcis)
	defer log.Println("Closing Network Output")
	for {
		select {
		case <-ctx.Done():
			return
		default:
		}
		counters, _ := net.IOCounters(true)
		for _, counter := range counters {
			if portList[counter.Name] {
				fields := map[string]interface{}{
					"bytes_sent":   int(counter.BytesSent),
					"bytes_recv":   int(counter.BytesRecv),
					"packets_sent": int(counter.PacketsSent),
					"packets_recv": int(counter.PacketsRecv),
					"err_in":       int(counter.Errin),
					"err_out":      int(counter.Errout),
					"drop_in":      int(counter.Dropin),
					"drop_out":     int(counter.Dropout),
				}
				tags := map[string]string{
					"interface": counter.Name,
				}
				newPoint := models.ClientPoint{
					Fields:          fields,
					Tags:            tags,
					Measurement:     "net",
					RetentionPolicy: "default_rp",
					Timestamp:       time.Now(),
				}
				dataChan <- newPoint

			}
		}
		time.Sleep(time.Duration(config.MAgentConfig.Interval) * time.Millisecond)
	}
}
