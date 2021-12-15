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
 *     * Neither the name of Samsung Electronics Corporation nor the names of its
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

func TestCollectEthernetError(t *testing.T) {
	ctx, _ := context.WithCancel(context.Background())
	dataChan := make(chan models.ClientPoint, 1)
	magentEthernet = MAgentEthernetTest{}
	CollectEthernetData(ctx, dataChan)
	assert.Empty(t, dataChan)
}
