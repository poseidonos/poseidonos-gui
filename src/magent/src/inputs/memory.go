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
	"github.com/shirou/gopsutil/mem"
	"log"
	"magent/src/config"
	"magent/src/models"
	"time"
)

type memClient interface {
	VirtualMemory() (*mem.VirtualMemoryStat, error)
}

// MAgentMem implements memClient interface
type MAgentMem struct{}

// VirtualMemory calls the mem.VirtualMemory function
func (m MAgentMem) VirtualMemory() (*mem.VirtualMemoryStat, error) {
	return mem.VirtualMemory()
}

var magentMem memClient = MAgentMem{}

// CollectMemoryData collects the memory details periodically
//and writes the data to the passed channel
func CollectMemoryData(ctx context.Context, dataChan chan models.ClientPoint) {
	defer log.Println("Closing Memory Input")
	for {
		select {
		case <-ctx.Done():
			return
		default:
		}
		memStat, err := magentMem.VirtualMemory()
		if err != nil {
			log.Println("Error in fetching memory Details: ", err)
		} else {
			fields := map[string]interface{}{
				"total":              int(memStat.Total),
				"available":          int(memStat.Available),
				"used":               int(memStat.Used),
				"free":               int(memStat.Free),
				"cached":             int(memStat.Cached),
				"buffered":           int(memStat.Buffers),
				"active":             int(memStat.Active),
				"inactive":           int(memStat.Inactive),
				"wired":              int(memStat.Wired),
				"slab":               int(memStat.Slab),
				"used_percent":       100 * float64(memStat.Used) / float64(memStat.Total),
				"available_percent":  100 * float64(memStat.Available) / float64(memStat.Total),
				"commit_limit":       int(memStat.CommitLimit),
				"committed_as":       int(memStat.CommittedAS),
				"dirty":              int(memStat.Dirty),
				"high_free":          int(memStat.HighFree),
				"high_total":         int(memStat.HighTotal),
				"huge_page_size":     int(memStat.HugePageSize),
				"huge_pages_free":    int(memStat.HugePagesFree),
				"huge_pages_total":   int(memStat.HugePagesTotal),
				"low_free":           int(memStat.LowFree),
				"low_total":          int(memStat.LowTotal),
				"mapped":             int(memStat.Mapped),
				"page_tables":        int(memStat.PageTables),
				"shared":             int(memStat.Shared),
				"sreclaimable":       int(memStat.SReclaimable),
				"sunreclaim":         int(memStat.SUnreclaim),
				"swap_cached":        int(memStat.SwapCached),
				"swap_free":          int(memStat.SwapFree),
				"swap_total":         int(memStat.SwapTotal),
				"memStatalloc_chunk": int(memStat.VMallocChunk),
				"memStatalloc_total": int(memStat.VMallocTotal),
				"memStatalloc_used":  int(memStat.VMallocUsed),
				"write_back":         int(memStat.Writeback),
				"write_back_tmp":     int(memStat.WritebackTmp),
			}

			newPoint := models.ClientPoint{
				Fields:          fields,
				Measurement:     "mem",
				RetentionPolicy: "default_rp",
			}
			dataChan <- newPoint
		}
		time.Sleep(time.Duration(config.MAgentConfig.Interval) * time.Millisecond)
	}
}
