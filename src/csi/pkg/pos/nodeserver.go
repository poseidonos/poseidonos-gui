/*
Copyright (c) Arm Limited and Contributors.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

package pos

import (
	"context"
	"errors"
	"os"
	"sync"

	"github.com/container-storage-interface/spec/lib/go/csi"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
	"k8s.io/klog"
	mount "k8s.io/mount-utils"
	"k8s.io/utils/exec"

	csicommon "github.com/poseidonos/pos-csi/pkg/csi-common"
	"github.com/poseidonos/pos-csi/pkg/util"
)

type nodeServer struct {
	*csicommon.DefaultNodeServer
	mounter     mount.Interface
	volumes     map[string]*nodeVolume
	unmountLock sync.Mutex
	mtx         sync.Mutex // protect volumes map
}

type nodeVolume struct {
	initiator   util.POSCsiInitiator
	stagingPath string
	tryLock     util.TryLock
}

func newNodeServer(d *csicommon.CSIDriver) *nodeServer {
	return &nodeServer{
		DefaultNodeServer: csicommon.NewDefaultNodeServer(d),
		mounter:           mount.New(""),
		volumes:           make(map[string]*nodeVolume),
	}
}

func (ns *nodeServer) NodeStageVolume(ctx context.Context, req *csi.NodeStageVolumeRequest) (*csi.NodeStageVolumeResponse, error) {

	if req.GetVolumeCapability() == nil {
		return nil, status.Error(codes.InvalidArgument, "Volume Capability not present in Request")
	}
	if len(req.GetVolumeId()) == 0 {
		return nil, status.Error(codes.InvalidArgument, "Volume ID not present in Request")
	}
	if len(req.GetStagingTargetPath()) == 0 {
		return nil, status.Error(codes.InvalidArgument, "Volume Staging Target Path not present in Request")
	}

	volume, err := func() (*nodeVolume, error) {
		volumeID := req.GetVolumeId()
		ns.mtx.Lock()
		defer ns.mtx.Unlock()

		volume, exists := ns.volumes[volumeID]
		if !exists {
			initiator, err := util.NewPOSCsiInitiator(req.GetVolumeContext())
			if err != nil {
				return nil, err
			}
			volume = &nodeVolume{
				initiator:   initiator,
				stagingPath: "",
			}
			ns.volumes[volumeID] = volume
		}
		return volume, nil
	}()
	if err != nil {
		return nil, status.Error(codes.Internal, err.Error())
	}

	if volume.tryLock.Lock() {
		defer volume.tryLock.Unlock()

		if volume.stagingPath != "" {
			klog.Warning("volume already staged")
			return &csi.NodeStageVolumeResponse{}, nil
		}
		devicePath, err := volume.initiator.Connect() // idempotent
		if err != nil {
			return nil, status.Error(codes.Internal, err.Error())
		}
		stagingPath, err := ns.stageVolume(devicePath, req) // idempotent
		if err != nil {
			return nil, status.Error(codes.Internal, err.Error())
		}
		volume.stagingPath = stagingPath
		return &csi.NodeStageVolumeResponse{}, nil
	}
	return nil, status.Error(codes.Aborted, "concurrent request ongoing")
}

func (ns *nodeServer) NodeUnstageVolume(ctx context.Context, req *csi.NodeUnstageVolumeRequest) (*csi.NodeUnstageVolumeResponse, error) {
	volumeID := req.GetVolumeId()
	if len(volumeID) == 0 {
		return nil, status.Error(codes.InvalidArgument, "Volume ID not present in Request")
	}
	if len(req.GetStagingTargetPath()) == 0 {
		return nil, status.Error(codes.InvalidArgument, "Volume Staging Target Path not present in Request")
	}
	ns.mtx.Lock()
	volume, exists := ns.volumes[volumeID]
	ns.mtx.Unlock()
	if !exists {
		klog.Infof("%s volume not present in Node. Trying to delete the Stage mount point", volumeID)
		err := func() error {
			ns.unmountLock.Lock()
			defer ns.unmountLock.Unlock()
			err := ns.deleteMountPoint(req.GetStagingTargetPath() + "/" + volumeID)
			if err != nil {
				return status.Errorf(codes.Internal, "unstage volume %s failed: %s", volumeID, err)
			}
			if err != nil {
				return status.Error(codes.Internal, err.Error())
			}
			return nil
		}()
		if err != nil {
			return nil, err
		}
		return &csi.NodeUnstageVolumeResponse{}, nil
	}

	err := func() error {
		if volume.tryLock.Lock() {
			defer volume.tryLock.Unlock()

			if volume.stagingPath == "" {
				klog.Warning("volume already unstaged")
				return nil
			}
			err := ns.deleteMountPoint(volume.stagingPath) // idempotent
			if err != nil {
				return status.Errorf(codes.Internal, "unstage volume %s failed: %s", volumeID, err)
			}
			err = volume.initiator.Disconnect() // idempotent
			if err != nil {
				return status.Error(codes.Internal, err.Error())
			}
			volume.stagingPath = ""
			return nil
		}
		return status.Error(codes.Aborted, "concurrent request ongoing")
	}()
	if err != nil {
		return nil, err
	}

	ns.mtx.Lock()
	delete(ns.volumes, volumeID)
	ns.mtx.Unlock()
	return &csi.NodeUnstageVolumeResponse{}, nil
}

func (ns *nodeServer) NodePublishVolume(ctx context.Context, req *csi.NodePublishVolumeRequest) (*csi.NodePublishVolumeResponse, error) {
	if req.GetVolumeCapability() == nil {
		return nil, status.Error(codes.InvalidArgument, "Volume Capabilities not present in Request")
	}
	volumeID := req.GetVolumeId()
	if len(volumeID) == 0 {
		return nil, status.Error(codes.InvalidArgument, "Volume ID not present in Request")
	}
	ns.mtx.Lock()
	volume, exists := ns.volumes[volumeID]
	ns.mtx.Unlock()
	if !exists {
		return nil, status.Error(codes.NotFound, volumeID)
	}

	if volume.tryLock.Lock() {
		defer volume.tryLock.Unlock()

		if volume.stagingPath == "" {
			return nil, status.Error(codes.Aborted, "volume unstaged")
		}
		err := ns.publishVolume(volume.stagingPath, req) // idempotent
		if err != nil {
			return nil, status.Error(codes.Internal, err.Error())
		}
		return &csi.NodePublishVolumeResponse{}, nil
	}
	return nil, status.Error(codes.Aborted, "concurrent request ongoing")
}

func (ns *nodeServer) NodeUnpublishVolume(ctx context.Context, req *csi.NodeUnpublishVolumeRequest) (*csi.NodeUnpublishVolumeResponse, error) {

	if len(req.GetTargetPath()) == 0 {
		return nil, status.Error(codes.InvalidArgument, "Volume Staging Target Path not present in Request")
	}

	volumeID := req.GetVolumeId()
	if len(req.GetVolumeId()) == 0 {
		return nil, status.Error(codes.InvalidArgument, "Volume ID not present in Request")
	}
	ns.mtx.Lock()
	volume, exists := ns.volumes[volumeID]
	ns.mtx.Unlock()
	if !exists {
		err := func() error {
			ns.unmountLock.Lock()
			defer ns.unmountLock.Unlock()
			klog.Infof("%s volume not present in Node. Trying to delete the Publish mount point", volumeID)
			err := ns.deleteMountPoint(req.GetTargetPath())
			if err != nil {
				return status.Error(codes.Internal, err.Error())
			}
			return nil
		}()
		if err != nil {
			return nil, err
		}
		return &csi.NodeUnpublishVolumeResponse{}, nil
	}

	if volume.tryLock.Lock() {
		defer volume.tryLock.Unlock()

		err := ns.deleteMountPoint(req.GetTargetPath()) // idempotent
		if err != nil {
			return nil, status.Error(codes.Internal, err.Error())
		}
		return &csi.NodeUnpublishVolumeResponse{}, nil
	}
	return nil, status.Error(codes.Aborted, "concurrent request ongoing")
}

func (ns *nodeServer) NodeGetCapabilities(ctx context.Context, req *csi.NodeGetCapabilitiesRequest) (*csi.NodeGetCapabilitiesResponse, error) {
	return &csi.NodeGetCapabilitiesResponse{
		Capabilities: []*csi.NodeServiceCapability{
			{
				Type: &csi.NodeServiceCapability_Rpc{
					Rpc: &csi.NodeServiceCapability_RPC{
						Type: csi.NodeServiceCapability_RPC_STAGE_UNSTAGE_VOLUME,
					},
				},
			},
		},
	}, nil
}

// must be idempotent
func (ns *nodeServer) stageVolume(devicePath string, req *csi.NodeStageVolumeRequest) (string, error) {
	stagingPath := req.GetStagingTargetPath() + "/" + req.GetVolumeId()
	isBlock := req.GetVolumeCapability().GetBlock() != nil
	mounted, err := ns.createStageMountPoint(stagingPath, isBlock)
	if err != nil {
		return "", err
	}
	if mounted {
		return stagingPath, nil
	}

	fsType := req.GetVolumeCapability().GetMount().GetFsType()
	mntFlags := req.GetVolumeCapability().GetMount().GetMountFlags()

	switch req.VolumeCapability.AccessMode.Mode {
	case csi.VolumeCapability_AccessMode_MULTI_NODE_READER_ONLY:
		mntFlags = append(mntFlags, "ro")
	case csi.VolumeCapability_AccessMode_MULTI_NODE_MULTI_WRITER:
		return "", errors.New("unsupport MULTI_NODE_MULTI_WRITER AccessMode")
	}

	klog.Infof("mount %s to %s, fstype: %s, flags: %v", devicePath, stagingPath, fsType, mntFlags)
	mounter := &mount.SafeFormatAndMount{Interface: ns.mounter, Exec: exec.New()}
	if isBlock {
		mntFlags = append(mntFlags, "bind")
		err = mounter.Mount(devicePath, stagingPath, fsType, mntFlags)
	} else {
		err = mounter.FormatAndMount(devicePath, stagingPath, fsType, mntFlags)
	}
	if err != nil {
		return "", err
	}
	return stagingPath, nil
}

// must be idempotent
func (ns *nodeServer) publishVolume(stagingPath string, req *csi.NodePublishVolumeRequest) error {
	targetPath := req.GetTargetPath()
	if len(targetPath) == 0 {
		return errors.New("TargetPath is not provided")
	}
	isBlock := req.GetVolumeCapability().GetBlock() != nil
	mounted, err := ns.createMountPoint(targetPath, isBlock)
	if err != nil {
		klog.Infof("Error in Publish Volume: %v", err)
		return err
	}
	if mounted {
		return nil
	}

	fsType := req.GetVolumeCapability().GetMount().GetFsType()
	mntFlags := req.GetVolumeCapability().GetMount().GetMountFlags()
	mntFlags = append(mntFlags, "bind")
	klog.Infof("mount %s to %s, fstype: %s, flags: %v", stagingPath, targetPath, fsType, mntFlags)
	return ns.mounter.Mount(stagingPath, targetPath, fsType, mntFlags)
}

// create mount point if not exists, return whether already mounted
func (ns *nodeServer) createStageMountPoint(path string, isBlock bool) (bool, error) {
	if isBlock {
		pathFile, err := os.OpenFile(path, os.O_CREATE|os.O_RDWR, 0o600)
		if err != nil {
			return false, err
		}
		if err = pathFile.Close(); err != nil {
			return false, err
		}
		return false, nil
	}
	err := os.Mkdir(path, 0o750)
	if err != nil {
		if !os.IsExist(err) {
			return false, err
		}
	}
	return false, nil

}

// create mount point if not exists, return whether already mounted
func (ns *nodeServer) createMountPoint(path string, isBlock bool) (bool, error) {
	unmounted, err := mount.IsNotMountPoint(ns.mounter, path)
	if err != nil && !os.IsNotExist(err) {
		klog.Infof("Error except Mount point not exist: %v", err)
		return false, err
	}
	if isBlock {
		pathFile, err := os.OpenFile(path, os.O_CREATE|os.O_RDWR, 0o600)
		if err != nil {
			return false, err
		}
		if err = pathFile.Close(); err != nil {
			return false, err
		}
		return false, nil
	}
	if err = os.MkdirAll(path, 0o750); err != nil {
		return false, err
	}
	if !unmounted {
		klog.Infof("%s already mounted", path)
	}
	return !unmounted, err
}

// unmount and delete mount point, must be idempotent
func (ns *nodeServer) deleteMountPoint(path string) error {
	unmounted, err := mount.IsNotMountPoint(ns.mounter, path)
	if os.IsNotExist(err) {
		klog.Infof("%s already deleted", path)
		return nil
	}
	if err != nil {
		return err
	}
	if !unmounted {
		err = ns.mounter.Unmount(path)
		if err != nil {
			return err
		}
	}
	return os.RemoveAll(path)
}
