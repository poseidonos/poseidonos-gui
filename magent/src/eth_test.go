/*
In this code we are importing testing and testify golang libraries to test and assert the mehod

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
	"magent"
	"testing"
	"time"
)

func TestCollectEthernetData(t *testing.T) {
	ctx, cancel := context.WithCancel(context.Background())
	dataChan := make(chan main.ClientPoint, 1)
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
