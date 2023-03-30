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

package pos

import (
	"context"
	"errors"
	"fmt"
	"github.com/container-storage-interface/spec/lib/go/csi"
	csicommon "github.com/poseidonos/pos-csi/pkg/csi-common"
	"github.com/poseidonos/pos-csi/pkg/util"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
	"k8s.io/klog"
	vol "k8s.io/kubernetes/pkg/volume"
	mount "k8s.io/mount-utils"
	"k8s.io/utils/exec"
	"os"
	"path/filepath"
	"strings"
	"sync"
	"syscall"
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
	klog.Info("The 'NodeStageVolume' API function has been successfully populated ", req.GetStagingTargetPath())
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
	klog.Info("The 'NodeUnstageVolume' API function has been successfully populated ", req.GetStagingTargetPath())
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
	klog.Info("The 'NodePublishVolume' API function has been successfully populated ", req.GetTargetPath())
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
	klog.Info("The 'NodeUnpublishVolume' API function has been successfully populated ", req.GetTargetPath())
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

func IsLikelyNotMountPoint(file string) (bool, error) {
	stat, err := os.Stat(file)
	if err != nil {
		return true, err
	}
	rootStat, err := os.Stat(filepath.Dir(strings.TrimSuffix(file, "/")))
	if err != nil {
		return true, err
	}
	// If the directory has a different device as parent, then it is a mountpoint.
	if stat.Sys().(*syscall.Stat_t).Dev != rootStat.Sys().(*syscall.Stat_t).Dev {
		return false, nil
	}

	return true, nil
}

// IsMountPoint checks if the given path is mountpoint or not.
func IsMountPoint(mounter mount.Interface, p string) (bool, error) {
	notMnt, err := IsLikelyNotMountPoint(p)
	if err != nil {
		return false, err
	}

	return !notMnt, nil
}

// requirePositive returns the value for `x` when it is greater or equal to 0,
// or returns 0 in the acse `x` is negative.
//
// This is used for VolumeUsage entries in the NodeGetVolumeStatsResponse. The
// CSI spec does not allow negative values in the VolumeUsage objects.
func requirePositive(x int64) int64 {
	if x >= 0 {
		return x
	}

	return 0
}

// FilesystemNodeGetVolumeStats can be used for getting the metrics as
// requested by the NodeGetVolumeStats CSI procedure.
// It is shared for FileMode volumes, both the FS and RBD NodeServers call
// this.
func FilesystemNodeGetVolumeStats(
	ctx context.Context,
	mounter mount.Interface,
	targetPath string,
	includeInodes bool, volumeID string) (*csi.NodeGetVolumeStatsResponse, error) {
	isMnt, err := IsMountPoint(mounter, targetPath)
	if err != nil {
		if os.IsNotExist(err) {
			return nil, status.Errorf(codes.InvalidArgument, "targetpath %s does not exist", targetPath)
		}

		return nil, status.Error(codes.Internal, err.Error())
	}
	if !isMnt {
		return nil, status.Errorf(codes.InvalidArgument, "targetpath %s is not mounted", targetPath)
	}

	metricsProvider := vol.NewMetricsStatFS(targetPath)
	volMetrics, volMetErr := metricsProvider.GetMetrics()
	if volMetErr != nil {
		return nil, status.Error(codes.Internal, volMetErr.Error())
	}

	available, ok := (*(volMetrics.Available)).AsInt64()
	if !ok {
		klog.Infof("failed to fetch available bytes for volume %s ", volumeID)
	}
	capacity, ok := (*(volMetrics.Capacity)).AsInt64()
	if !ok {
		klog.Infof("failed to fetch capacity bytes for volume %s ", volumeID)

		return nil, status.Error(codes.Unknown, "failed to fetch capacity bytes for volume "+volumeID)
	}
	used, ok := (*(volMetrics.Used)).AsInt64()
	if !ok {
		klog.Infof("failed to fetch used bytes for volume %s ", volumeID)
	}

	res := &csi.NodeGetVolumeStatsResponse{
		Usage: []*csi.VolumeUsage{
			{
				Available: requirePositive(available),
				Total:     requirePositive(capacity),
				Used:      requirePositive(used),
				Unit:      csi.VolumeUsage_BYTES,
			},
		},
	}

	if includeInodes {
		inodes, ok := (*(volMetrics.Inodes)).AsInt64()
		if !ok {
			klog.Infof("failed to fetch available inodes for volume %s ", volumeID)

			return nil, status.Error(codes.Unknown, "failed to fetch available inodes for volume "+volumeID)
		}
		inodesFree, ok := (*(volMetrics.InodesFree)).AsInt64()
		if !ok {
			klog.Infof("failed to fetch free inodes for volume %s ", volumeID)
		}

		inodesUsed, ok := (*(volMetrics.InodesUsed)).AsInt64()
		if !ok {
			klog.Infof("failed to fetch used inodes for volume %s ", volumeID)
		}

		res.Usage = append(res.Usage, &csi.VolumeUsage{
			Available: requirePositive(inodesFree),
			Total:     requirePositive(inodes),
			Used:      requirePositive(inodesUsed),
			Unit:      csi.VolumeUsage_INODES,
		})
	}

	return res, nil
}

// BlockNodeGetVolumeStats gets the metrics for a `volumeMode: Block` type of
// volume. At the moment, only the size of the block-device can be returned,
func BlockNodeGetVolumeStats(ctx context.Context, targetPath string, volumeID string) (*csi.NodeGetVolumeStatsResponse, error) {
	mp := vol.NewMetricsBlock(targetPath)
	m, err := mp.GetMetrics()
	if err != nil {
		err = fmt.Errorf("failed to get metrics: %w", err)
		klog.Infof(err.Error())

		return nil, status.Error(codes.Internal, err.Error())
	}

	return &csi.NodeGetVolumeStatsResponse{
		Usage: []*csi.VolumeUsage{
			{
				Total: m.Capacity.Value(),
				Unit:  csi.VolumeUsage_BYTES,
			},
		},
	}, nil
}

// IsCorruptedMountError checks if the given error is a result of a corrupted
// mountpoint.
func IsCorruptedMountError(err error) bool {
	return mount.IsCorruptedMnt(err)
}
func (ns *nodeServer) NodeGetVolumeStats(ctx context.Context, req *csi.NodeGetVolumeStatsRequest) (*csi.NodeGetVolumeStatsResponse, error) {
	klog.Info("The 'NodeGetVolumeStats' API function has been successfully populated ")
	volumeID := req.GetVolumeId()
	if len(volumeID) == 0 {
		return nil, status.Error(codes.InvalidArgument, "no volume ID provided")
	}
	targetPath := req.GetVolumePath()
	if len(targetPath) == 0 {
		return nil, status.Error(codes.InvalidArgument, "no volume Path provided")
	}
	stat, err := os.Stat(targetPath)
	if err != nil {
		if IsCorruptedMountError(err) {
			klog.Infof("corrupted volume path detected in %s: %s %s", targetPath, volumeID, err)

			return &csi.NodeGetVolumeStatsResponse{
				VolumeCondition: &csi.VolumeCondition{
					Abnormal: true,
					Message:  fmt.Sprintf("corrupted volume path detected in %s: %s %s", targetPath, volumeID, err),
				},
			}, nil
		}

		return nil, status.Errorf(codes.NotFound, "failed to get stat for targetpath %q: %v", targetPath, err)
	}
	if stat.Mode().IsDir() {
		return FilesystemNodeGetVolumeStats(ctx, ns.Mounter, targetPath, true, volumeID)
	} else if (stat.Mode() & os.ModeDevice) == os.ModeDevice {
		return BlockNodeGetVolumeStats(ctx, targetPath, volumeID)
	}
	return nil, fmt.Errorf("targetpath %q is not a directory or block device", targetPath)
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
			{
				Type: &csi.NodeServiceCapability_Rpc{
					Rpc: &csi.NodeServiceCapability_RPC{
						Type: csi.NodeServiceCapability_RPC_VOLUME_CONDITION,
					},
				},
			},
			{
				Type: &csi.NodeServiceCapability_Rpc{
					Rpc: &csi.NodeServiceCapability_RPC{
						Type: csi.NodeServiceCapability_RPC_GET_VOLUME_STATS,
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
		pathFile, err := os.OpenFile(path, os.O_CREATE|os.O_RDWR, 0o600) // #nosec G304
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
		pathFile, err := os.OpenFile(path, os.O_CREATE|os.O_RDWR, 0o600) // #nosec G304
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
