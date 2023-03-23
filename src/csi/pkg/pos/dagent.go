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
	"bytes"
	"encoding/json"
	"fmt"
	"github.com/container-storage-interface/spec/lib/go/csi"
	"github.com/poseidonos/pos-csi/pkg/model"
	"github.com/poseidonos/pos-csi/pkg/util"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
	"io/ioutil"
	"k8s.io/klog/v2"
	"sync"
	"time"
)

type DAgent struct{}

type Response struct {
	Rid             string      `json:"rid"`
	LastSuccessTime int64       `json:"lastSuccessTime"`
	Result          Result      `json:"result"`
	Info            interface{} `json:"info,omitempty"`
}

type Result struct {
	Status Status      `json:"status"`
	Data   interface{} `json:"data,omitempty"`
}

type Status struct {
	Module      string `json:"module"`
	Code        int    `json:"code"`
	Level       string `json:"level,omitempty"`
	Description string `json:"description"`
	Problem     string `json:"problem,omitempty"`
	Solution    string `json:"solution,omitempty"`
}

func (dagent *DAgent) ListVolumes(config map[string]string, mtx2 *sync.Mutex) (model.Response, error) {
	url := fmt.Sprintf("http://%s:%s/api/ibofos/v1/volumelist/%s", config["provisionerIp"], config["provisionerPort"], config["array"])
	resp, err := util.CallDAgent(url, nil, "GET", "ListVolumes", mtx2)
	if err != nil {
		return model.Response{}, status.Error(codes.Unavailable, err.Error())
	}
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return model.Response{}, status.Error(codes.Unavailable, err.Error())
	}
	dec := json.NewDecoder(bytes.NewBuffer(body))
	dec.UseNumber()
	response := model.Response{}
	if err := dec.Decode(&response); err != nil {
		return model.Response{}, status.Error(codes.Unavailable, err.Error())
	}
	if response.Result.Status.Code == 0 {
		klog.Info("ListVolumes Success ")
	} else {
		return model.Response{}, status.Error(codes.Unavailable, response.Result.Status.Description)
	}
	return response, nil
}

func (dagent *DAgent) VolumeInfo(volName string, config map[string]string, mtx2 *sync.Mutex) (model.Response, error) {
	url := fmt.Sprintf("http://%s:%s/api/ibofos/v1/array/%s/volume/%s", config["provisionerIp"], config["provisionerPort"], config["array"], volName)
	
	resp, err := util.CallDAgent(url, nil, "GET", "VolumeInfo", mtx2)
	
	if err != nil {
		return model.Response{}, status.Error(codes.Unavailable, err.Error())
	}
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return model.Response{}, status.Error(codes.Unavailable, err.Error())
	}
	dec := json.NewDecoder(bytes.NewBuffer(body))
	dec.UseNumber()
	response := model.Response{}
	if err := dec.Decode(&response); err != nil {
		return model.Response{}, status.Error(codes.Unavailable, err.Error())
	}
	if response.Result.Status.Code == 0 {
		klog.Info("VolumeInfo Success")
	} else {
		return model.Response{}, status.Error(codes.Unavailable, response.Result.Status.Description)
	}
	klog.Info("return response ", response)
	return response, nil
}

func (dagent *DAgent) CreateVolume(csiReq *csi.CreateVolumeRequest, size int64, config map[string]string, mtx2 *sync.Mutex) (*volume, error) {
	name := csiReq.Name
	alignedSize := size
	if size == 0 {
		alignedSize = 1048576
	}
	klog.Infof("Creating Volume using DAgent: %v", csiReq.Name)
	url := fmt.Sprintf("http://%s:%s/api/ibofos/v1/volumes", config["provisionerIp"], config["provisionerPort"])
	requestBody := []byte(fmt.Sprintf(`{
	    "param": {
                "array": "%s",
                "name": "%s",
                "size": %v,
                "maxbw": 0,
                "maxiops": 0,
                "iswalvol": false
             }
        }`, config["array"], name, alignedSize))
	resp, err := util.CallDAgentWithStatus(config["provisionerIp"], config["provisionerPort"], url, requestBody, "POST", "Create Volume", 0, mtx2)
	if err != nil {
		return nil, status.Error(codes.Unavailable, err.Error())
	}
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return nil, status.Error(codes.Unavailable, err.Error())
	}
	dec := json.NewDecoder(bytes.NewBuffer(body))
	dec.UseNumber()
	response := model.Response{}
	if err := dec.Decode(&response); err != nil {
		return nil, status.Error(codes.Unavailable, err.Error())
	}
	if response.Result.Status.Code == 0 {
		klog.Infof("Create Volume API response: %v", string(body))
	} else if response.Result.Status.Code == 2022 {
		klog.Infof("Volume Already Exist")
	} else {
		return nil, status.Error(codes.Unavailable, response.Result.Status.Description)
	}
	return &volume{
		name: name,
		size: size,
		csiVolume: csi.Volume{
			CapacityBytes: size,
			VolumeContext: csiReq.GetParameters(),
			ContentSource: csiReq.GetVolumeContentSource(),
		},
	}, nil

}

func (dagent *DAgent) DeleteVolume(name string, config map[string]string, mtx2 *sync.Mutex) error {
	time.Sleep(5 * time.Second)
	requestBody := []byte(fmt.Sprintf(`{
            "param": {
                "array": "%s"
             }
        }`, config["array"]))
	deleteUrl := fmt.Sprintf("http://%s:%s/api/ibofos/v1/volumes/%s", config["provisionerIp"], config["provisionerPort"], name)
	resp, err := util.CallDAgentWithStatus(config["provisionerIp"], config["provisionerPort"], deleteUrl, requestBody, "DELETE", "Delete Volume", 0, mtx2)
	if err != nil {
		klog.Infof("Error in Delete Volume API: %v", err)
		return err
	}
	body, _ := ioutil.ReadAll(resp.Body)
	klog.Infof("Delete Volume API response: %v", string(body))
	return err
}
