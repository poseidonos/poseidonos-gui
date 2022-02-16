package pos

import (
	"context"
	"sync"

	"github.com/container-storage-interface/spec/lib/go/csi"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
	"k8s.io/klog"

	csicommon "github.com/poseidonos/pos-csi/pkg/csi-common"
	"github.com/poseidonos/pos-csi/pkg/util"
)

const (
	CREATING string = "creating"
	CREATED         = "created"
)

var errVolumeInCreation = status.Error(codes.Internal, "volume in creation")

type controllerServer struct {
	*csicommon.DefaultControllerServer
	volumes map[string]*volume // volume id to volume struct
	//	volumesIdem   map[string]string       // volume name to id, for CreateVolume idempotency
	mtx sync.Mutex // protect volume lock's map
}

type volume struct {
	name      string // CO provided volume name
	csiVolume csi.Volume
	status    string
	mtx       sync.Mutex // per volume lock to serialize DeleteVolume requests
}

func (s *controllerServer) CreateVolume(
	ctx context.Context,
	req *csi.CreateVolumeRequest) (
	*csi.CreateVolumeResponse, error) {
	klog.Info("In Volume Creation")

	s.mtx.Lock()
	klog.Infof("POS Volumes, %v", s.volumes)
	posVolume, exists := s.volumes[req.Name]
	klog.Infof("isExists %v %v", posVolume, exists)
	if !exists {
		posVolume = &volume{}
		posVolume.status = CREATING
		s.volumes[req.Name] = posVolume
	}
	if exists {
		if posVolume.status == CREATING {
			klog.Infof("Volume %s is already getting created", req.Name)
			return nil, status.Error(codes.Aborted, "Volume already under creation")
		}
		if posVolume.status == CREATED {
			klog.Infof("Volume %s with same name is already available", req.Name)
			return &csi.CreateVolumeResponse{Volume: &posVolume.csiVolume}, nil
		}
	}
	s.mtx.Unlock()

	posVolume.mtx.Lock()
	defer posVolume.mtx.Unlock()
	params := req.GetParameters()
	klog.Infof("get parameters ", params)
	// volumeInfo to be updated from Storage Class
	volumeInfo := map[string]string{
		"targetType":      params["transportType"],
		"targetAddr":      params["targetAddress"],
		"targetPort":      params["transportServiceId"],
		"nqn":             params["nqnName"],
		"array":           params["arrayName"],
		"provisionerIp":   params["provisionerIP"],
		"provisionerPort": params["provisionerPort"],
		"serialNumber":    "POS0000000003",
		"modelNumber":     "IBOF_VOLUME_EEEXTENSION",
		"maxNamespaces":   "256",
		"allowAnyHost":    "true",
		"bufCacheSize":    "64",
		"numSharedBuf":    "4096",
	}

	newVolume, err := s.createVolume(req, volumeInfo)
	if err != nil {
		// Should call delete volume
		posVolume.status = ""
		delete(s.volumes, req.Name)
		klog.Infof("Error in Volume Creation", err.Error())
		return nil, status.Error(codes.Internal, err.Error())
	}
	err = util.PublishVolume(req, volumeInfo)
	if err != nil {
		posVolume.status = ""
		return nil, err
	}
	volumeID, err := util.GetUUID(req.Name, volumeInfo)
	if err != nil {
		posVolume.status = ""
		return nil, err
	}
	newVolume.csiVolume.VolumeId = volumeID
	volumeInfo["model"] = volumeID
	if newVolume.csiVolume.VolumeContext == nil {
		newVolume.csiVolume.VolumeContext = volumeInfo
	} else {
		for k, v := range volumeInfo {
			newVolume.csiVolume.VolumeContext[k] = v
		}
	}
	posVolume.csiVolume = newVolume.csiVolume
	posVolume.name = newVolume.name
	posVolume.status = CREATED
	s.volumes[volumeID] = posVolume

	klog.Info("Volume Creation Successfully Completed")
	return &csi.CreateVolumeResponse{Volume: &posVolume.csiVolume}, nil
}

func (s *controllerServer) DeleteVolume(ctx context.Context, req *csi.DeleteVolumeRequest) (*csi.DeleteVolumeResponse, error) {
	volumeID := req.GetVolumeId()
	klog.Info("Deleting Volume: %s", volumeID)

	s.mtx.Lock()
	volume, exists := s.volumes[volumeID]
	s.mtx.Unlock()
	klog.Infof("volume = > ", volume, exists)
	if !exists {
		// already deleted?
		klog.Warningf("volume not exists: %s", volumeID)
		return &csi.DeleteVolumeResponse{}, nil
	}
	params := volume.csiVolume.VolumeContext

	if volume.csiVolume.GetVolumeId() != volumeID {
		return nil, status.Error(codes.Internal, "data corrupt! volume id mismatch!")
	}

	// serialize requests to same volume by holding volume lock
	volume.mtx.Lock()
	defer volume.mtx.Unlock()

	// no harm if volume already unpublished
	/*err := unpublishVolume(volume)
	switch {
	case err == util.ErrVolumeUnpublished:
		// unpublished but not deleted in last request?
		klog.Warningf("volume not published: %s", volumeID)
	case err == util.ErrVolumeDeleted:
		// deleted in previous request?
		klog.Warningf("volume already deleted: %s", volumeID)
	case err != nil:
		return nil, status.Error(codes.Internal, err.Error())
	}*/

	// no harm if volume already deleted

	volumeInfo := map[string]string{
		"targetType":      params["transportType"],
		"targetAddr":      params["targetAddress"],
		"targetPort":      params["transportServiceId"],
		"nqn":             params["nqnName"],
		"array":           params["arrayName"],
		"provisionerIp":   params["provisionerIP"],
		"provisionerPort": params["provisionerPort"],
	}
	err := deleteVolume(volume, volumeInfo)
	if err == util.ErrJSONNoSuchDevice {
		// deleted in previous request?
		klog.Warningf("volume not exists: %s", volumeID)
	} else if err != nil {
		return nil, status.Error(codes.Internal, err.Error())
	}

	// no harm if volumeID already deleted
	s.mtx.Lock()
	delete(s.volumes, volumeID)
	s.mtx.Unlock()

	return &csi.DeleteVolumeResponse{}, nil
}

func (cs *controllerServer) ValidateVolumeCapabilities(ctx context.Context, req *csi.ValidateVolumeCapabilitiesRequest) (*csi.ValidateVolumeCapabilitiesResponse, error) {
	// make sure we support all requested caps
	for _, cap := range req.VolumeCapabilities {
		supported := false
		for _, accessMode := range cs.Driver.GetVolumeCapabilityAccessModes() {
			if cap.GetAccessMode().GetMode() == accessMode.GetMode() {
				supported = true
				break
			}
		}
		if !supported {
			return &csi.ValidateVolumeCapabilitiesResponse{Message: ""}, nil
		}
	}
	return &csi.ValidateVolumeCapabilitiesResponse{
		Confirmed: &csi.ValidateVolumeCapabilitiesResponse_Confirmed{
			VolumeCapabilities: req.VolumeCapabilities,
		},
	}, nil
}

func (cs *controllerServer) CreateSnapshot(ctx context.Context, req *csi.CreateSnapshotRequest) (*csi.CreateSnapshotResponse, error) {
	return nil, status.Error(codes.Unimplemented, "")
}

func (cs *controllerServer) DeleteSnapshot(ctx context.Context, req *csi.DeleteSnapshotRequest) (*csi.DeleteSnapshotResponse, error) {
	return nil, status.Error(codes.Unimplemented, "")
}

func (s *controllerServer) createVolume(req *csi.CreateVolumeRequest, conf map[string]string) (*volume, error) {
	size := req.GetCapacityRange().GetRequiredBytes()
	provisioner := &DAgent{}
	vol, err := provisioner.CreateVolume(req, size, conf)
	return vol, err
}

func deleteVolume(volume *volume, conf map[string]string) error {
	provisioner := &DAgent{}
	err := provisioner.DeleteVolume(volume.name, conf)
	return err
}

func newControllerServer(d *csicommon.CSIDriver) (*controllerServer, error) {
	server := controllerServer{
		DefaultControllerServer: csicommon.NewDefaultControllerServer(d),
		volumes:                 make(map[string]*volume),
	}

	return &server, nil
}
