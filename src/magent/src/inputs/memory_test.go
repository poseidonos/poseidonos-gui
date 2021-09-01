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
	"errors"
	"github.com/shirou/gopsutil/mem"
	"github.com/stretchr/testify/assert"
	"magent/src/models"
	"testing"
	"time"
)

type magentMemTest struct{}

func (m magentMemTest) VirtualMemory() (*mem.VirtualMemoryStat, error) {
	return &mem.VirtualMemoryStat{
		Total:          12400,
		Available:      7600,
		Used:           5000,
		Free:           1235,
		Active:         8134,
		Inactive:       1124,
		Slab:           1234,
		Wired:          134,
		Buffers:        771,
		Cached:         4312,
		CommitLimit:    1,
		CommittedAS:    118680,
		Dirty:          4,
		HighFree:       0,
		HighTotal:      0,
		HugePageSize:   4096,
		HugePagesFree:  0,
		HugePagesTotal: 0,
		LowFree:        69936,
		LowTotal:       255908,
		Mapped:         42236,
		PageTables:     1236,
		Shared:         0,
		SReclaimable:   1923022848,
		SUnreclaim:     157728768,
		SwapCached:     0,
		SwapFree:       524280,
		SwapTotal:      524280,
		VMallocChunk:   3872908,
		VMallocTotal:   3874808,
		VMallocUsed:    1416,
		Writeback:      0,
		WritebackTmp:   0,
	}, memError
}

type magentMemTestErr struct{}

func (m magentMemTestErr) VirtualMemory() (*mem.VirtualMemoryStat, error) {
	return nil, errors.New("Unable to fetch Memory details")
}

var memError error

func TestCollectMemoryData(t *testing.T) {
	ctx, cancel := context.WithCancel(context.Background())
	dataChan := make(chan models.ClientPoint, 10)
	magentMem = magentMemTest{}
	go CollectMemoryData(ctx, dataChan)
	data := <-dataChan
	assert.Equal(t, 5000, data.Fields["used"])
	assert.Equal(t, 1235, data.Fields["free"])
	cancel()
	//Testing Error Scenario
	ctxErr, cancelErr := context.WithCancel(context.Background())
	dataChanErr := make(chan models.ClientPoint, 10)
	magentMem = magentMemTestErr{}
	go CollectMemoryData(ctxErr, dataChanErr)
	time.Sleep(time.Second)
	assert.Equal(t, len(dataChanErr), 0)
	cancelErr()
	//Actual Test should return at least 1 value
	ctxAct, cancelAct := context.WithCancel(context.Background())
	dataChanAct := make(chan models.ClientPoint, 10)
	magentMem = MAgentMem{}
	go CollectMemoryData(ctxAct, dataChanAct)
	data = <-dataChanAct
	assert.NotNil(t, data)
	cancelAct()
}
