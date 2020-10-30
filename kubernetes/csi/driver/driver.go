package driver

import (
	_ "fmt"
	_ "github.com/container-storage-interface/spec/lib/go/csi"
	"google.golang.org/grpc"
)



type Driver struct {
    name string
    // publishInfoVolumeName is used to pass the volume name from
    // `ControllerPublishVolume` to `NodeStageVolume or `NodePublishVolume`
    publishInfoVolumeName string

    endpoint          string
    debugAddr         string
    hostID            func() string
    region            string
    doTag             string
    isController      bool
    
    srv     *grpc.Server
}

func NewDriver() (*Driver, error) {

	return nil
}
