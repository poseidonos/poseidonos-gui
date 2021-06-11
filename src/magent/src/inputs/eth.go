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
	"context"
	"github.com/safchain/ethtool"
	"github.com/shirou/gopsutil/net"
	"log"
	"magent/src/models"
	"time"
)

type ethernetClient interface {
	InterfacesInfo() ([]net.InterfaceStat, error)
}

// MAgentEthernet struct implemetns ethernetClient Interface. It has a InterfacesInfo method to fetch Interface names
type MAgentEthernet struct{}

// InterfacesInfo calls net.Interfaces() from net package of gopsutil library
func (m MAgentEthernet) InterfacesInfo() ([]net.InterfaceStat, error) {
	return net.Interfaces()
}

var magentEthernet ethernetClient = MAgentEthernet{}

// CollectEthernetData collects the Ethernet Information and writes to the channel passed
func CollectEthernetData(ctx context.Context, dataChan chan models.ClientPoint) {
	defer log.Println("Closing Ethernet Input")
	ethHandle, err := ethtool.NewEthtool()
	Index := 1 //using Index as time becasue data is static
	if err != nil {
		log.Println("error in creating ethernet handler: ", err)
	}
	defer ethHandle.Close()
	JSONList, err := magentEthernet.InterfacesInfo()
	if err != nil {
		log.Println("error getting interfaces info: ", err)

	} else {

		for _, JSONElement := range JSONList {
			EthernetIDriver, err := ethHandle.DriverName(JSONElement.Name)
			if err != nil {
				EthernetIDriver = "N/A"
				//log.Println("error in getting ethernet interface driver name : ", err)
			}
			fields := map[string]interface{}{
				"name":    JSONElement.Name,
				"address": JSONElement.HardwareAddr,
				"driver":  EthernetIDriver,
			}
			tags := map[string]string{"eth": "interface"}
			// we have to query like : "select * from autogen.ethernet"
			newPoint := models.ClientPoint{
				Timestamp:       time.Unix(0, int64(Index)),
				Fields:          fields,
				Tags:            tags,
				Measurement:     "ethernet",
				RetentionPolicy: "autogen",
			}
			dataChan <- newPoint
			Index = Index + 1
		}
	}
}
