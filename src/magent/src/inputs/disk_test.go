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
	"github.com/shirou/gopsutil/disk"
	"github.com/stretchr/testify/assert"
  "github.com/stretchr/testify/require"
	"magent/src/models"
	"testing"
	"time"
)

type magentDiskTest struct{}

func (d magentDiskTest) Partitions(all bool) ([]disk.PartitionStat, error) {
	return partitions, partitionErr
}

func (d magentDiskTest) Usage(path string) (*disk.UsageStat, error) {
	for _, u := range usage {
		if u.Path == path {
			return &u, nil
		}
	}
	return nil, errors.New("Invalid Mount Path")
}

type magentDiskTestErr struct{}

func (d magentDiskTestErr) Partitions(all bool) ([]disk.PartitionStat, error) {
	return nil, errors.New("Fetch Partition Error")
}

func (d magentDiskTestErr) Usage(path string) (*disk.UsageStat, error) {
	return nil, errors.New("Invalid Mount Path")
}

var (
	partitions []disk.PartitionStat = []disk.PartitionStat{
		{
			Device:     "/dev/sda",
			Mountpoint: "/",
			Fstype:     "ext4",
			Opts:       "ro,noatime,nodiratime",
		},
		{
			Device:     "/dev/sdb",
			Mountpoint: "/home",
			Fstype:     "ext4",
			Opts:       "rw,noatime,nodiratime,errors=remount-ro",
		},
		{
			Device:     "/dev/sda",
			Mountpoint: "/err",
			Fstype:     "ext4",
			Opts:       "ro,noatime,nodiratime",
		},
	}
	usage = []disk.UsageStat{
		{
			Path:        "/",
			Fstype:      "ext4",
			Total:       128,
			Free:        23,
			Used:        100,
			InodesTotal: 1234,
			InodesFree:  234,
			InodesUsed:  1000,
		},
		{
			Path:        "/home",
			Fstype:      "ext4",
			Total:       256,
			Free:        46,
			Used:        200,
			InodesTotal: 2468,
			InodesFree:  468,
			InodesUsed:  2000,
		},
	}
	partitionErr error
)

func TestDiskData(t *testing.T) {
	magentDiskReal := MAgentDisk{}
	partitions, _ := magentDiskReal.Partitions(true)
	for _, d := range partitions {
		_, err := magentDisk.Usage(d.Mountpoint)
		require.NoError(t, err)
		//fmt.Println(du)
	}
	//	usage := magentDiskReal.Usage()
}

func TestCollectDiskData(t *testing.T) {
	ctx, cancel := context.WithCancel(context.Background())
	dataChan := make(chan models.ClientPoint, 10)
	magentDisk = magentDiskTest{}
	go CollectDiskData(ctx, dataChan)
	data := <-dataChan
	assert.Equal(t, "/", data.Tags["path"])
	assert.Equal(t, int(128), data.Fields["total"])
	data = <-dataChan
	assert.Equal(t, "/home", data.Tags["path"])
	assert.Equal(t, int(256), data.Fields["total"])
	data = <-dataChan
	assert.NotEqual(t, "/err", data.Tags["Path"])
	cancel()

	//Testing the error scenario
	ctxErr, cancelErr := context.WithCancel(context.Background())
	magentDisk = magentDiskTestErr{}
	dataChanErr := make(chan models.ClientPoint, 10)
	go CollectDiskData(ctxErr, dataChanErr)
	time.Sleep(2 * time.Second)
	assert.Equal(t, len(dataChanErr), 0)
	cancelErr()
}
