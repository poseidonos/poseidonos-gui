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
	"github.com/shirou/gopsutil/disk"
	"log"
	"magent/src/config"
	"magent/src/models"
	"time"
)

type diskClient interface {
	Partitions(all bool) ([]disk.PartitionStat, error)
	Usage(path string) (*disk.UsageStat, error)
}

//MAgentDisk implements diskClient Interface and has functions for fetching disk Usage
type MAgentDisk struct{}

//Partitions method calls disk.Partitions method
func (d MAgentDisk) Partitions(all bool) ([]disk.PartitionStat, error) {
	return disk.Partitions(all)
}

//Usage method calls disk.Usage
func (d MAgentDisk) Usage(path string) (*disk.UsageStat, error) {
	return disk.Usage(path)
}

var magentDisk diskClient = MAgentDisk{}

//CollectDiskData collects the Disk Information Periodically and writes to the channel passed
func CollectDiskData(ctx context.Context, dataChan chan models.ClientPoint) {
	defer log.Println("Closing Disk Input")
	for {
		select {
		case <-ctx.Done():
			return
		default:
		}
		disks, err := magentDisk.Partitions(true)
		if err != nil {
			log.Println("Error while fetching Disk Partitions: ", err)
		}
		for _, d := range disks {
			du, err := magentDisk.Usage(d.Mountpoint)
			if err != nil {
				log.Println("Error while fetching Disk Usage", err)
				continue
			}
			tags := map[string]string{
				"path":   du.Path,
				"fstype": du.Fstype,
			}
			fields := map[string]interface{}{
				"total":        int(du.Total),
				"free":         int(du.Free),
				"used":         int(du.Used),
				"inodes_total": int(du.InodesTotal),
				"inodes_free":  int(du.InodesFree),
				"inodes_used":  int(du.InodesUsed),
			}

			newPoint := models.ClientPoint{
				Fields:          fields,
				Tags:            tags,
				Measurement:     "disk",
				RetentionPolicy: "default_rp",
			}
			dataChan <- newPoint
		}
		time.Sleep(time.Duration(config.MAgentConfig.Interval) * time.Millisecond)
	}
}
