/*
 *   BSD LICENSE
 *   Copyright (c) 2021 Samsung Electronics Corporation
 *   All rights reserved.
 *
 *   Redistribution and use in source and binary forms, with or without
 *   modification, are permitted provided that the following conditions
 *   are met:
 *
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in
 *       the documentation and/or other materials provided with the
 *       distribution.
 *     * Neither the name of Intel Corporation nor the names of its
 *       contributors may be used to endorse or promote products derived
 *       from this software without specific prior written permission.
 *
 *   THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 *   "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 *   LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 *   A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 *   OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 *   SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 *   LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 *   DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 *   THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 *   (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 *   OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

package inputs

import (
	"bytes"
	"context"
	"github.com/shirou/gopsutil/net"
	"io"
	"log"
	"magent/src/config"
	"magent/src/models"
	"os/exec"
	"strings"
	"time"
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
