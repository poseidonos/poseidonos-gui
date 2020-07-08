package inputs

import (
	"context"
	"errors"
	"github.com/shirou/gopsutil/disk"
	"github.com/stretchr/testify/assert"
	"testing"
	"time"
	"magent/src/models"
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
