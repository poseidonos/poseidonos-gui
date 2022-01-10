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

package spdk

import (
	"context"
	"fmt"
	"log"
	"os/exec"
	"sync"

	"github.com/container-storage-interface/spec/lib/go/csi"
	"github.com/golang/protobuf/ptypes"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
	"k8s.io/klog"

	csicommon "github.com/spdk/spdk-csi/pkg/csi-common"
	"github.com/spdk/spdk-csi/pkg/util"
)

var errVolumeInCreation = status.Error(codes.Internal, "volume in creation")

type Dagent struct {
	Ip   string
	Port string
}

type Subsystem struct {
	Ip   string
	Port string
	Nqn  string
}
type Array struct {
	Name string
}

type PosNode struct {
	Dagent    Dagent
	Subsystem Subsystem
	Array     Array
}

type controllerServer struct {
	*csicommon.DefaultControllerServer

	spdkNodes []util.SpdkNode // all spdk nodes in cluster

	posNode       PosNode
	volumes       map[string]*volume      // volume id to volume struct
	volumesIdem   map[string]string       // volume name to id, for CreateVolume idempotency
	mtx           sync.Mutex              // protect volumes and volumesIdem map
	snapshotsIdem map[string]csi.Snapshot // snapshot id to csi.Snapshot struct
	mtxSnapshot   sync.RWMutex            // protect snapshotsIdem map
}

type volume struct {
	name      string // CO provided volume name
	spdkNode  util.SpdkNode
	csiVolume csi.Volume
	mtx       sync.Mutex // per volume lock to serialize DeleteVolume requests
}

func (s *controllerServer) CreateVolume(
	ctx context.Context,
	req *csi.CreateVolumeRequest) (
	*csi.CreateVolumeResponse, error) {
	klog.Info("In Volume Creation")
	volume, err := func() (*volume, error) {
		const creatingTag = "_CREATING_"
		s.mtx.Lock()
		defer s.mtx.Unlock()

		volumeID, exists := s.volumesIdem[req.Name]
		if exists {
			if volumeID == creatingTag {
				return nil, status.Error(codes.Internal, "Volume in Creation")
			}
			volume := s.volumes[volumeID]
			return volume, nil
		}
		log.Println("Printing Volume Name")
		log.Println(req.Name)
		log.Println(req)
		s.volumesIdem[req.Name] = creatingTag
		return nil, nil
	}()

	if err != nil {
		return nil, err
	}
	if volume != nil {
		return &csi.CreateVolumeResponse{Volume: &volume.csiVolume}, nil
	}

	volumeInfo, err := map[string]string{
		"targetType":      "TCP",
		"targetAddr":      s.posNode.Subsystem.Ip,
		"targetPort":      s.posNode.Subsystem.Port,
		"nqn":             s.posNode.Subsystem.Nqn,
		"array":           s.posNode.Array.Name,
		"provisionerIp":   s.posNode.Dagent.Ip,
		"provisionerPort": s.posNode.Dagent.Port,
	}, nil
	if err != nil {
		//deleteVolume(volume)
		klog.Info("Volume Creation Successfully Completed Err2")
		return nil, status.Error(codes.Internal, err.Error())
	}

	volume, err = s.createVolume(req, volumeInfo)
	if err != nil {
		klog.Infof("Volume Creation Successfully Completed Err %v", err.Error())
		return nil, status.Error(codes.Internal, err.Error())
	}

	//volumeInfo, err := publishVolume(volume)
	/* volumeInfo, err := map[string]string{
	        "targetType": "TCP",
	        "targetAddr": "107.108.83.97",
	        "targetPort": "1158",
	        "nqn": "nqn.2019-04.pos:subsystem1",
	        "model": "POS_VOLUME_EXTENTION",
	}, nil */
	/*
		if err != nil {
			//deleteVolume(volume)
			klog.Info("Volume Creation Successfully Completed Err2")
			return nil, status.Error(codes.Internal, err.Error())
		}
	*/

	volumeID := volume.csiVolume.GetVolumeId()
	volumeInfo["model"] = volumeID
	if volume.csiVolume.VolumeContext == nil {
		volume.csiVolume.VolumeContext = volumeInfo
	} else {
		for k, v := range volumeInfo {
			volume.csiVolume.VolumeContext[k] = v
		}
	}

	s.mtx.Lock()
	s.volumes[volumeID] = volume
	s.volumesIdem[req.Name] = volumeID
	s.mtx.Unlock()

	klog.Info("Volume Creation Successfully Completed")
	cmd := exec.Command("uname", "-a")
	stdout, err := cmd.CombinedOutput()
	if err != nil {
		klog.Errorf("Command uname failed: %s", err)
	}
	klog.Infof("Command uname Succeeded: %s", stdout)
	return &csi.CreateVolumeResponse{Volume: &volume.csiVolume}, nil
}

func (cs *controllerServer) DeleteVolume(ctx context.Context, req *csi.DeleteVolumeRequest) (*csi.DeleteVolumeResponse, error) {
	volumeID := req.GetVolumeId()
	cs.mtx.Lock()
	volume, exists := cs.volumes[volumeID]
	cs.mtx.Unlock()
	if !exists {
		// already deleted?
		klog.Warningf("volume not exists: %s", volumeID)
		return &csi.DeleteVolumeResponse{}, nil
	} else if volume.csiVolume.GetVolumeId() != volumeID {
		return nil, status.Error(codes.Internal, "data corrupt! volume id mismatch!")
	}

	// serialize requests to same volume by holding volume lock
	volume.mtx.Lock()
	defer volume.mtx.Unlock()

	// no harm if volume already unpublished
	err := unpublishVolume(volume)
	switch {
	case err == util.ErrVolumeUnpublished:
		// unpublished but not deleted in last request?
		klog.Warningf("volume not published: %s", volumeID)
	case err == util.ErrVolumeDeleted:
		// deleted in previous request?
		klog.Warningf("volume already deleted: %s", volumeID)
	case err != nil:
		return nil, status.Error(codes.Internal, err.Error())
	}

	// no harm if volume already deleted
	err = deleteVolume(volume)
	if err == util.ErrJSONNoSuchDevice {
		// deleted in previous request?
		klog.Warningf("volume not exists: %s", volumeID)
	} else if err != nil {
		return nil, status.Error(codes.Internal, err.Error())
	}

	// no harm if volumeID already deleted
	cs.mtx.Lock()
	delete(cs.volumes, volumeID)
	delete(cs.volumesIdem, volume.name)
	cs.mtx.Unlock()

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
	lvolID := req.GetSourceVolumeId()
	snapshotName := req.GetName()

	cs.mtx.Lock()
	volume, exists := cs.volumes[lvolID]
	cs.mtx.Unlock()
	if !exists {
		klog.Warningf("volume does not exist: %s", lvolID)
		return &csi.CreateSnapshotResponse{}, status.Error(codes.Internal, "snapshot source volume does not exist")
	}

	cs.mtxSnapshot.RLock()
	if exSnap, ok := cs.snapshotsIdem[snapshotName]; ok {
		cs.mtxSnapshot.RUnlock()
		if exSnap.SourceVolumeId == lvolID {
			return &csi.CreateSnapshotResponse{
				Snapshot: &exSnap,
			}, nil
		}
		return nil, status.Errorf(codes.AlreadyExists, "snapshot with the same name: %s but with different SourceVolumeId already exists", snapshotName)
	}
	cs.mtxSnapshot.RUnlock()

	snapshotID, err := volume.spdkNode.CreateSnapshot(lvolID, snapshotName)
	if err != nil {
		return nil, status.Error(codes.Internal, err.Error())
	}

	creationTime := ptypes.TimestampNow()
	snapshotData := csi.Snapshot{
		SizeBytes:      volume.csiVolume.GetCapacityBytes(),
		SnapshotId:     snapshotID,
		SourceVolumeId: lvolID,
		CreationTime:   creationTime,
		ReadyToUse:     true,
	}

	cs.mtxSnapshot.Lock()
	cs.snapshotsIdem[snapshotID] = snapshotData
	cs.mtxSnapshot.Unlock()

	return &csi.CreateSnapshotResponse{
		Snapshot: &snapshotData,
	}, nil
}

func (cs *controllerServer) DeleteSnapshot(ctx context.Context, req *csi.DeleteSnapshotRequest) (*csi.DeleteSnapshotResponse, error) {
	snapshotID := req.SnapshotId
	cs.mtxSnapshot.RLock()
	exSnap, exists := cs.snapshotsIdem[snapshotID]
	cs.mtxSnapshot.RUnlock()
	if !exists {
		klog.Warningf("snapshot does not exist: %s", snapshotID)
		return &csi.DeleteSnapshotResponse{}, status.Error(codes.Internal, "snapshot does not exist")
	}

	sourceVolumeID := exSnap.SourceVolumeId
	cs.mtx.Lock()
	volume, exists := cs.volumes[sourceVolumeID]
	cs.mtx.Unlock()
	if !exists {
		klog.Warningf("sourceVolume does not exist: %s", sourceVolumeID)
		return &csi.DeleteSnapshotResponse{}, status.Error(codes.Internal, "snapshot source volume does not exist")
	}

	err := volume.spdkNode.DeleteVolume(snapshotID)
	if err != nil {
		return nil, status.Error(codes.Internal, err.Error())
	}

	cs.mtxSnapshot.Lock()
	delete(cs.snapshotsIdem, snapshotID)
	cs.mtxSnapshot.Unlock()

	return &csi.DeleteSnapshotResponse{}, nil
}

func (s *controllerServer) createVolume(req *csi.CreateVolumeRequest, conf map[string]string) (*volume, error) {
	size := req.GetCapacityRange().GetRequiredBytes()
	provisioner := &DAgent{}
	vol, err := provisioner.CreateVolume(req, size, conf)
	return vol, err
}

func publishVolume(volume *volume) (map[string]string, error) {
	err := volume.spdkNode.PublishVolume(volume.csiVolume.GetVolumeId())
	if err != nil {
		return nil, err
	}

	volumeInfo, err := volume.spdkNode.VolumeInfo(volume.csiVolume.GetVolumeId())
	if err != nil {
		unpublishVolume(volume) // nolint:errcheck // we can do little
		return nil, err
	}
	return volumeInfo, nil
}

func deleteVolume(volume *volume) error {
	return volume.spdkNode.DeleteVolume(volume.csiVolume.GetVolumeId())
}

func unpublishVolume(volume *volume) error {
	return volume.spdkNode.UnpublishVolume(volume.csiVolume.GetVolumeId())
}

// simplest volume scheduler: find first node:lvstore with enough free space
func (cs *controllerServer) schedule(sizeMiB int64) (spdkNode util.SpdkNode, lvstore string, err error) {
	for _, spdkNode := range cs.spdkNodes {
		// retrieve lastest lvstore info from spdk node
		lvstores, err := spdkNode.LvStores()
		if err != nil {
			klog.Errorf("failed to get lvstores from node %s: %s", spdkNode.Info(), err.Error())
			continue
		}
		// check if lvstore has enough free space
		for i := range lvstores {
			lvstore := &lvstores[i]
			if lvstore.FreeSizeMiB > sizeMiB {
				return spdkNode, lvstore.Name, nil
			}
		}
		klog.Infof("not enough free space from node %s", spdkNode.Info())
	}

	return nil, "", fmt.Errorf("failed to find node with enough free space")
}

func newControllerServer(d *csicommon.CSIDriver) (*controllerServer, error) {
	server := controllerServer{
		DefaultControllerServer: csicommon.NewDefaultControllerServer(d),
		volumes:                 make(map[string]*volume),
		volumesIdem:             make(map[string]string),
		snapshotsIdem:           make(map[string]csi.Snapshot),
	}

	// get spdk node configs, see deploy/kubernetes/config-map.yaml
	var config struct {
		Nodes []struct {
			Name       string `json:"name"`
			URL        string `json:"rpcURL"`
			TargetType string `json:"targetType"`
			TargetAddr string `json:"targetAddr"`
		} `json:"Nodes"`
		POS struct {
			Dagent struct {
				Ip   string `json:"ip"`
				Port string `json:"port"`
			} `json:"dagent"`
			Subsystem struct {
				Ip   string `json:"ip"`
				Port string `json:"port"`
				Nqn  string `json:"nqn"`
			} `json:"subsystem"`
			Array struct {
				Name string `json:"name"`
			} `json:"array"`
		} `json:"pos"`
	}
	configFile := util.FromEnv("SPDKCSI_CONFIG", "/etc/spdkcsi-config/config.json")
	err := util.ParseJSONFile(configFile, &config)
	if err != nil {
		return nil, err
	}

	// get spdk node secrets, see deploy/kubernetes/secret.yaml
	var secret struct {
		Tokens []struct {
			Name     string `json:"name"`
			UserName string `json:"username"`
			Password string `json:"password"`
		} `json:"rpcTokens"`
	}
	secretFile := util.FromEnv("SPDKCSI_SECRET", "/etc/spdkcsi-secret/secret.json")
	err = util.ParseJSONFile(secretFile, &secret)
	if err != nil {
		return nil, err
	}
	server.posNode = PosNode{
		Dagent: Dagent{
			Ip: config.POS.Dagent.Ip,
			Port: config.POS.Dagent.Port,
		},
		Subsystem: Subsystem{
			Ip: config.POS.Subsystem.Ip,
			Port: config.POS.Subsystem.Port,
			Nqn: config.POS.Subsystem.Nqn,
		},
		Array: Array{
			Name: config.POS.Array.Name,
		},
	}


	// create spdk nodes
	for i := range config.Nodes {
		node := &config.Nodes[i]
		tokenFound := false
		// find secret per node
		for j := range secret.Tokens {
			token := &secret.Tokens[j]
			if token.Name == node.Name {
				tokenFound = true
				spdkNode, err := util.NewSpdkNode(node.URL, token.UserName, token.Password, node.TargetType, node.TargetAddr)
				if err != nil {
					klog.Errorf("failed to create spdk node %s: %s", node.Name, err.Error())
				} else {
					klog.Infof("spdk node created: name=%s, url=%s", node.Name, node.URL)
					server.spdkNodes = append(server.spdkNodes, spdkNode)
				}
				break
			}
		}
		if !tokenFound {
			klog.Errorf("failed to find secret for spdk node %s", node.Name)
		}
	}
	if len(server.spdkNodes) == 0 {
		return nil, fmt.Errorf("no valid spdk node found")
	}

	return &server, nil
}
