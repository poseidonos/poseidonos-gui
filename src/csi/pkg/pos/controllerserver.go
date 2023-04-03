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
	"fmt"
	"github.com/container-storage-interface/spec/lib/go/csi"
	csicommon "github.com/poseidonos/pos-csi/pkg/csi-common"
	"github.com/poseidonos/pos-csi/pkg/util"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
	"k8s.io/klog"
	"net"
	"sort"
	"strconv"
	"sync"
)

const (
	CREATING string = "creating"
	CREATED         = "created"
)

var errVolumeInCreation = status.Error(codes.Internal, "volume in creation")

type controllerServer struct {
	*csicommon.DefaultControllerServer
	volumesById   map[string]*volume // volume id to volume struct
	volumesByName map[string]*volume // volume name to volume struct
	mtx           sync.Mutex         // protect volume lock's map
}

type volume struct {
	name      string // CO provided volume name
	csiVolume csi.Volume
	status    string
	size      int64
	mtx       sync.Mutex // per volume lock to serialize DeleteVolume requests
}

func (s *controllerServer) ListVolumes(ctx context.Context, req *csi.ListVolumesRequest) (*csi.ListVolumesResponse, error) {
	klog.Info("The 'ListVolumes' API function has been successfully populated")
	provisioner := &DAgent{}
	var volKey, startToken string
	var entries []*csi.ListVolumesResponse_Entry
	var volumeRes *csi.ListVolumesResponse
	var startEntry, volumesLength, maxLength int
	abnormal := false
	message := ""
	startToken = req.GetStartingToken()
	maxEntries := int(req.GetMaxEntries())
	if startToken == "" {
		startToken = "0"
	}
	if v := startToken; v != "" {
		i, err := strconv.ParseInt(v, 10, 32)
		if err != nil {
			return nil, status.Errorf(codes.Aborted, "unable to parse StartingToken: %v into uint32", v)
		}
		startEntry = int(i)
	}
	for volKey, _ = range s.volumesById {
		break
	}
	var configParams map[string]string
	volumesMap := make(map[string][]string)
	if len(s.volumesById) == 0 {
		klog.Infof("no volumes exist")
		return &csi.ListVolumesResponse{}, nil
	}

	volume, exists := s.volumesById[volKey]
	if exists {
		configParams = volume.csiVolume.VolumeContext
	}
	response, err := provisioner.ListVolumes(configParams)
	if err != nil {
		abnormal = true
		message = "ListVolumes status not found"
	} else if response.Result.Status.Code != 0 {
		abnormal = true
		message = response.Result.Status.Description
	} else {
		data := response.Result.Data.(map[string]interface{})
		volList, keyExist1 := data["volumes"].([]interface{})
		if keyExist1 {
			for itr := 0; itr < len(volList); itr++ {
				volId := volList[itr].(map[string]interface{})["uuid"].(string)
				volStatus := volList[itr].(map[string]interface{})["status"].(string)
				volName := volList[itr].(map[string]interface{})["name"].(string)
				volumesMap[volId] = append(volumesMap[volId], volName)
				volumesMap[volId] = append(volumesMap[volId], volStatus)
			}
		}
	}
	var volIdList []string
	for csiVolId, _ := range s.volumesById {
		volIdList = append(volIdList, csiVolId)
	}
	sort.Strings(volIdList)
	volumesLength = len(volIdList)
	maxLength = maxEntries
	if maxLength > volumesLength || maxLength <= 0 {
		maxLength = volumesLength
	}
	for index := startEntry; index < volumesLength && index < maxLength; index++ {
		volName := s.volumesById[volIdList[index]].name
		var abnormalLocal bool
		var messageLocal string
		if abnormal == false {
			var volStatus string
			valList, isPresent := volumesMap[volIdList[index]]
			if isPresent {
				volStatus = valList[1]
				if volStatus != "Mounted" {
					abnormalLocal = true
					messageLocal = volName + " volume is not mounted in PoseidonOS"
					klog.Infof(volName + " volume is not mounted in PoseidonOS")
				} else {
					abnormalLocal = false
					messageLocal = ""
				}
			} else {
				abnormalLocal = true
				messageLocal = volName + " volume does not exist in PoseidonOS"
				klog.Infof(volName + " volume does not exist in PoseidonOS")

			}
		} else {
			abnormalLocal = abnormal
			messageLocal = message
		}
		var entry csi.ListVolumesResponse_Entry
		entry.Volume = &csi.Volume{
			VolumeId: volIdList[index],
		}
		entry.Status = &csi.ListVolumesResponse_VolumeStatus{
			VolumeCondition: &csi.VolumeCondition{
				Abnormal: abnormalLocal,
				Message:  fmt.Sprintf(messageLocal),
			},
		}
		entries = append(entries, &entry)
	}

	volumeRes = &csi.ListVolumesResponse{
		Entries: entries,
	}
	klog.Info("ListVolumes gRPC response: ", volumeRes)
	return volumeRes, nil

}

func (s *controllerServer) ControllerGetVolume(ctx context.Context, req *csi.ControllerGetVolumeRequest) (*csi.ControllerGetVolumeResponse, error) {
	klog.Info("The 'ControllerGetVolume' API function has been successfully populated", req.GetVolumeId())
	volId := req.GetVolumeId()
	message := ""
	abnormal := false
	var configParams map[string]string
	volume, exists := s.volumesById[volId]
	if exists {
		configParams = volume.csiVolume.VolumeContext
	}
	provisioner := &DAgent{}
	response, err := provisioner.VolumeInfo(volume.name, configParams)
	if err != nil {
		abnormal = true
		message = volume.name + " volume status not found"
	} else if response.Result.Status.Code != 0 {
		abnormal = true
		message = response.Result.Status.Description
	} else {
		data := response.Result.Data.(map[string]interface{})
		volStatus, keyExist1 := data["status"].(string)
		if keyExist1 && volStatus != "Mounted" {
			abnormal = true
			message = volume.name + " volume is not mounted in PoseidonOS"
		}
	}
	return &csi.ControllerGetVolumeResponse{
		Volume: &csi.Volume{
			VolumeId: req.GetVolumeId(),
		},
		Status: &csi.ControllerGetVolumeResponse_VolumeStatus{
			VolumeCondition: &csi.VolumeCondition{
				Abnormal: abnormal,
				Message:  fmt.Sprintf(message),
			},
		},
	}, nil

}
func (s *controllerServer) CreateVolume(
	ctx context.Context,
	req *csi.CreateVolumeRequest) (
	*csi.CreateVolumeResponse, error) {
	klog.Info("The 'CreateVolume' API function has been successfully populated ", req.GetName())
	s.mtx.Lock()
	defer s.mtx.Unlock()

	if len(req.GetName()) == 0 {
		return nil, status.Error(codes.InvalidArgument, "Name missing in request")
	}
	caps := req.GetVolumeCapabilities()
	if caps == nil {
		return nil, status.Error(codes.InvalidArgument, "Volume Capabilities missing in request")
	}

	klog.Infof("POS Volumes, %v", s.volumesByName)
	posVolume, exists := s.volumesByName[req.Name]
	klog.Infof("isExists %v %v", posVolume, exists)
	if !exists {
		posVolume = &volume{}
		posVolume.status = CREATING
		s.volumesByName[req.Name] = posVolume
	} else {
		if posVolume.status == CREATING {
			klog.Infof("Volume %s is already getting created", req.Name)
			return nil, status.Error(codes.Aborted, "Volume already under creation")
		}
		if posVolume.status == CREATED {
			if posVolume.size != req.GetCapacityRange().GetRequiredBytes() {
				klog.Infof("Volume %s with same name and different size is already available", req.Name)
				return nil, status.Error(codes.AlreadyExists, "Volume with different size exists")
			}
			klog.Infof("Volume %s with same name is already available", req.Name)
			return &csi.CreateVolumeResponse{Volume: &posVolume.csiVolume}, nil
		}
	}

	posVolume.mtx.Lock()
	defer posVolume.mtx.Unlock()
	params := req.GetParameters()
	errMsg := validateParams(params)
	if errMsg != nil {
		posVolume.status = ""
		return nil, errMsg
	}
	// volumeInfo to be updated from Storage Class
	volumeInfo := map[string]string{
		"targetType":      params["transportType"],
		"targetAddr":      params["targetAddress"],
		"targetPort":      params["transportServiceId"],
		"nqn":             fmt.Sprintf("nqn.2019-04.pos:%s", req.Name),
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
		delete(s.volumesByName, req.Name)
		klog.Infof("Error in Volume Creation %v ", err.Error())
		return nil, err
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
	klog.Info("Volume Id of created Volume", volumeID)
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
	posVolume.size = newVolume.size
	posVolume.status = CREATED
	s.volumesById[volumeID] = posVolume

	klog.Info("Volume Creation Successfully Completed")
	return &csi.CreateVolumeResponse{Volume: &posVolume.csiVolume}, nil
}

func validateParams(params map[string]string) error {
	if len(params) == 0 {
		return status.Error(codes.Unavailable, "parameters are not available in storageclass")
	}
	for key := range params {
		if params[key] == "" {
			return status.Error(codes.Unavailable, key+" is not available in storageclass")
		}
	}
	if net.ParseIP(params["targetAddress"]) == nil {
		return status.Error(codes.Unavailable, "Invalid Target IP address in storageclass")
	}
	if net.ParseIP(params["provisionerIP"]) == nil {
		return status.Error(codes.Unavailable, "Invalid provisioner IP address in storageclass")
	}
	return nil
}
func (s *controllerServer) DeleteVolume(ctx context.Context, req *csi.DeleteVolumeRequest) (*csi.DeleteVolumeResponse, error) {
	volumeID := req.GetVolumeId()
	klog.Info("The 'DeleteVolume' API function has been successfully populated ", volumeID)

	if len(volumeID) == 0 {
		return nil, status.Error(codes.InvalidArgument, "Volume ID missing in request")
	}

	s.mtx.Lock()
	volume, exists := s.volumesById[volumeID]
	s.mtx.Unlock()
	klog.Infof("volume = > %v %v", volume, exists)
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
	err := util.UnpublishVolume(volume.name, params)
	if err != nil {
		return nil, status.Error(codes.Internal, err.Error())
	}

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
	err = deleteVolume(volume, volumeInfo)
	if err == util.ErrJSONNoSuchDevice {
		// deleted in previous request?
		klog.Warningf("volume not exists: %s", volumeID)
	} else if err != nil {
		return nil, status.Error(codes.Internal, err.Error())
	}

	// no harm if volumeID already deleted
	s.mtx.Lock()
	delete(s.volumesByName, volume.name)
	delete(s.volumesById, volumeID)
	s.mtx.Unlock()

	return &csi.DeleteVolumeResponse{}, nil
}

func (cs *controllerServer) ValidateVolumeCapabilities(ctx context.Context, req *csi.ValidateVolumeCapabilitiesRequest) (*csi.ValidateVolumeCapabilitiesResponse, error) {

	volumeId := req.GetVolumeId()
	if len(volumeId) == 0 {
		return nil, status.Error(codes.InvalidArgument, "Volume ID not present in Request")
	}
	if len(req.VolumeCapabilities) == 0 {
		return nil, status.Error(codes.InvalidArgument, "Volume Capabilities not present in Request")
	}

	cs.mtx.Lock()
	_, exists := cs.volumesById[volumeId]
	cs.mtx.Unlock()
	if !exists {
		return nil, status.Error(codes.NotFound, "Requested Volume not present")
	}

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
		volumesById:             make(map[string]*volume),
		volumesByName:           make(map[string]*volume),
	}

	return &server, nil
}
