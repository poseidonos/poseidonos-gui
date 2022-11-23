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
	 "strings"
	 "github.com/container-storage-interface/spec/lib/go/csi"
	 csicommon "github.com/poseidonos/pos-csi/pkg/csi-common"
	 "github.com/poseidonos/pos-csi/pkg/util"
	 "google.golang.org/grpc/codes"
	 "google.golang.org/grpc/status"
	 "k8s.io/klog"
	 "net"
	 "sync"
 )
 
 const (
	 CREATING string = "creating"
	 CREATED         = "created"
	 MAXIMUM_VOLUMES = 4
 )
 
 var errVolumeInCreation = status.Error(codes.Internal, "volume in creation")
 
 type controllerServer struct {
	 *csicommon.DefaultControllerServer
	 backends map[string]*backend //backend targetAddres to backend struct
	 volumes map[string]*volume // volume id to volume struct
	 mtx     sync.Mutex         // protect volume lock's map
	 mtx2    sync.Mutex         // for synchronizing requests to POS
 }
 
 type backend struct {
	 targetAddr string
	 provisionerIp string
	 volNum int
 }
 
 type volume struct {
	 name      string // CO provided volume name
	 csiVolume csi.Volume
	 status    string
	 size      int64
	 mtx       sync.Mutex // per volume lock to serialize DeleteVolume requests
 }
 
 func (s *controllerServer) CreateVolume(
	 ctx context.Context,
	 req *csi.CreateVolumeRequest) (
	 *csi.CreateVolumeResponse, error) {
	 klog.Info("In Volume Creation")
 
	 s.mtx.Lock()
	 defer s.mtx.Unlock()
 
	 if len(req.GetName()) == 0 {
		 return nil, status.Error(codes.InvalidArgument, "Name missing in request")
	 }
	 caps := req.GetVolumeCapabilities()
	 if caps == nil {
		 return nil, status.Error(codes.InvalidArgument, "Volume Capabilities missing in request")
	 }
 
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
 
	 backend, errMsg := selectBackends(s, params["targetAddress"], params["provisionerIP"])
	 if errMsg != nil {
		 posVolume.status = ""
		 return nil, errMsg
	 }
 
	 backend.volNum = backend.volNum + 1
 
	 // volumeInfo to be updated from Storage Class
	 volumeInfo := map[string]string{
		 "targetType":      params["transportType"],
		 "targetAddr":      backend.targetAddr,
		 "targetPort":      params["transportServiceId"],
		 "nqn":             fmt.Sprintf("nqn.2019-04.pos:%s", req.Name),
		 "array":           params["arrayName"],
		 "provisionerIp":   backend.provisionerIp,
		 "provisionerPort": params["provisionerPort"],
		 "serialNumber":    "POS0000000003",
		 "modelNumber":     "IBOF_VOLUME_EEEXTENSION",
		 "maxNamespaces":   "256",
		 "allowAnyHost":    "true",
		 "bufCacheSize":    "64",
		 "numSharedBuf":    "4096",
	 }
 
	 newVolume, err := s.createVolume(req, volumeInfo, &s.mtx2)
	 if err != nil {
		 // Should call delete volume
		 posVolume.status = ""
		 delete(s.volumes, req.Name)
		 backend.volNum = backend.volNum - 1
		 klog.Infof("Error in Volume Creation %v ", err.Error())
		 return nil, err
	 }
	 err = util.PublishVolume(req, volumeInfo, &s.mtx2)
	 if err != nil {
		 posVolume.status = ""
		 return nil, err
	 }
	 volumeID, err := util.GetUUID(req.Name, volumeInfo, &s.mtx2)
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
	 s.volumes[volumeID] = posVolume
 
	 klog.Info("Volume Creation Successfully Completed")
	 return &csi.CreateVolumeResponse{Volume: &posVolume.csiVolume}, nil
 }
 
 func selectBackends(s *controllerServer, param_targetAddress string, param_provisionerIP string) (*backend, error){
 
	 if len(s.backends) == 0 {
		 targetAddrs := strings.Split(param_targetAddress, ",")
		 provisionerIps := strings.Split(param_provisionerIP, ",")
		 for idx, targetAddr := range targetAddrs {
			 s.backends[targetAddr] = &backend{
				 targetAddr: targetAddr,
				 provisionerIp: provisionerIps[idx],
				 volNum: 0,
			 }
		 }
 
	 } 
 
	 for targetaddr, backend := range s.backends {
		 if backend.volNum < MAXIMUM_VOLUMES {
			 return s.backends[targetaddr], nil
		 }
	 }
 
	 return nil, status.Error(codes.ResourceExhausted , "no space for volume creation") 
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
	 
	 for _, targetAddress := range strings.Split(params["targetAddress"], ",") {
		 if net.ParseIP(targetAddress) == nil {
			 return status.Error(codes.Unavailable, "Invalid Target IP address in storageclass")
		 }
	 }
 
	 for _, provisionerIP := range strings.Split(params["provisionerIP"], ",") {
		 if net.ParseIP(provisionerIP) == nil {
			 return status.Error(codes.Unavailable, "Invalid provisioner IP address in storageclass")
		 }
	 }
 
	 return nil
 }
 func (s *controllerServer) DeleteVolume(ctx context.Context, req *csi.DeleteVolumeRequest) (*csi.DeleteVolumeResponse, error) {
	 volumeID := req.GetVolumeId()
	 klog.Infof("Deleting Volume: %v", volumeID)
 
	 if len(volumeID) == 0 {
		 return nil, status.Error(codes.InvalidArgument, "Volume ID missing in request")
	 }
 
	 s.mtx.Lock()
	 volume, exists := s.volumes[volumeID]
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
 
	 // no harm if volume already deleted
 
	 volumeInfo := map[string]string{
		 "targetType":      params["transportType"],
		 "targetAddr":      params["targetAddr"],
		 "targetPort":      params["transportServiceId"],
		 "nqn":             params["nqn"],
		 "array":           params["arrayName"],
		 "provisionerIp":   params["provisionerIp"],
		 "provisionerPort": params["provisionerPort"],
	 }
 
	 // no harm if volume already unpublished
	 err := util.UnpublishVolume(volume.name, volumeInfo, &s.mtx2)
	 if err != nil {
		 return nil, status.Error(codes.Internal, err.Error())
	 }
	 
	 err = deleteVolume(volume, volumeInfo, &s.mtx2)
	 if err == util.ErrJSONNoSuchDevice {
		 // deleted in previous request?
		 klog.Warningf("volume not exists: %s", volumeID)
	 } else if err != nil {
		 return nil, status.Error(codes.Internal, err.Error())
	 }
 
	 // no harm if volumeID already deleted
	 s.mtx.Lock()
	 delete(s.volumes, volume.name)
	 delete(s.volumes, volumeID)
	 s.backends[params["targetAddr"]].volNum = s.backends[params["targetAddr"]].volNum - 1
 
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
	 _, exists := cs.volumes[volumeId]
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
 
 func (s *controllerServer) createVolume(req *csi.CreateVolumeRequest, conf map[string]string, mtx2 *sync.Mutex) (*volume, error) {
	 size := req.GetCapacityRange().GetRequiredBytes()
	 provisioner := &DAgent{}
	 vol, err := provisioner.CreateVolume(req, size, conf, mtx2)
	 return vol, err
 }
 
 func deleteVolume(volume *volume, conf map[string]string, mtx2 *sync.Mutex) error {
	 provisioner := &DAgent{}
	 err := provisioner.DeleteVolume(volume.name, conf, mtx2)
	 return err
 }
 
 func newControllerServer(d *csicommon.CSIDriver) (*controllerServer, error) {
	 server := controllerServer{
		 DefaultControllerServer: csicommon.NewDefaultControllerServer(d),
		 backends:                make(map[string]*backend),
		 volumes:                 make(map[string]*volume),
	 }
 
	 return &server, nil
 }