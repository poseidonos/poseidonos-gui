/*

DESCRIPTION: This file contains the unit tests related to net.go file
NAME : net_test.go
@AUTHORS: Aswin K K
@Version : 1.0 *
@REVISION HISTORY
[5/28/2020] [aswin.kk]: Added code for testing fetched RNIC data
*/

package src

import (
	"context"
	"github.com/stretchr/testify/assert"
	"magent/src"
	"testing"
)

// TestGetNetworkData tests if the data collected is from an RNIC
func TestGetNetworkData(t *testing.T) {
	dataChan := make(chan src.ClientPoint, 10)
	ctx, cancel := context.WithCancel(context.Background())
	go CollectNetworkData(ctx, dataChan)
	val := <-dataChan
	cancel()
	pcis := lsPCI()
	portList := lsHW(pcis)
	assert.Contains(t, portList, val.Tags["interface"])
}
