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
