package src

import (
	"context"
	"github.com/shirou/gopsutil/mem"
	"github.com/stretchr/testify/assert"
	"magent/src"
	"testing"
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

var memError error

func TestCollectMemoryData(t *testing.T) {
	ctx, cancel := context.WithCancel(context.Background())
	dataChan := make(chan src.ClientPoint, 10)
	magentMem = magentMemTest{}
	go CollectMemoryData(ctx, dataChan)
	data := <-dataChan
	assert.Equal(t, 5000, data.Fields["used"])
	assert.Equal(t, 1235, data.Fields["free"])
	cancel()
}
