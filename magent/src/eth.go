/*
In this code we are importing ethtool and gopsutil golang libraries
gopsutil,ethtool are  providing each Ethernet Interface name, mac address and driver name.
These information is being passed to golang channel(dataChan) which is parameter of CollectEthernetData() and defined in magent.go(ClientPoint)

DESCRIPTION: <File description> *
NAME : eth.go
@AUTHORS: Vishal Shakya
@Version : 1.0 *
@REVISION HISTORY
[5/14/2020] [vishal] : Prototyping..........////////////////////

*/

package src

import (
	"context"
	"github.com/safchain/ethtool"
	"github.com/shirou/gopsutil/net"
	"log"
	"magent"
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
func CollectEthernetData(ctx context.Context, dataChan chan main.ClientPoint) {
	defer log.Println("Closing Ethernet Input")
	ethHandle, err := ethtool.NewEthtool()
	LocalTime := 1589467537002519008 //using static time becasue data is static
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
				log.Println("error in getting ethernet interface driver name : ", err)
			}
			fields := map[string]interface{}{
				"name":    JSONElement.Name,
				"address": JSONElement.HardwareAddr,
				"driver":  EthernetIDriver,
			}
			tags := map[string]string{"eth": "interface"}
			newPoint := main.ClientPoint{
				Timestamp:       time.Unix(0, int64(LocalTime)),
				Fields:          fields,
				Tags:            tags,
				Measurement:     "ethernet",
				RetentionPolicy: "default_rp",
			}
			dataChan <- newPoint
			LocalTime = LocalTime + 1
		}
	}
}
