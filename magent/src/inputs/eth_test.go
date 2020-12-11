/*
In this code we are importing testing and testify golang libraries to test and assert the mehod

DESCRIPTION: <File description> *
NAME : eth.go
@AUTHORS: Vishal Shakya
@Version : 1.0 *
@REVISION HISTORY
[5/14/2020] [vishal] : Prototyping..........////////////////////

*/

package inputs

import (
	"context"
	"errors"
	"github.com/shirou/gopsutil/net"
	"github.com/stretchr/testify/assert"
	"magent/src/models"
	"testing"
	"time"
)

// MAgentEthernet struct implemetns ethernetClient Interface. It has a InterfacesInfo method to fetch Interface names
type MAgentEthernetTest struct{}

// InterfacesInfo calls net.Interfaces() from net package of gopsutil library
func (m MAgentEthernetTest) InterfacesInfo() ([]net.InterfaceStat, error) {
        return nil, errors.New("ConnectionError")
}

func TestCollectEthernetData(t *testing.T) {
	ctx, cancel := context.WithCancel(context.Background())
	dataChan := make(chan models.ClientPoint, 1)
	go CollectEthernetData(ctx, dataChan)
	go func() {
		time.Sleep(5 * time.Second)
		cancel()
	}()
	select {
	case <-ctx.Done():
		t.Errorf("At least 1 interface should be present")
	case <-dataChan:
		cancel()
	}
}

func TestCollectEthernetError(t * testing.T) {
	ctx, _ := context.WithCancel(context.Background())
        dataChan := make(chan models.ClientPoint, 1)
	magentEthernet = MAgentEthernetTest{}
	CollectEthernetData(ctx, dataChan)
	assert.Empty(t, dataChan)
}


