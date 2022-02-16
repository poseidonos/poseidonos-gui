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

package util

import (
	"fmt"
	"strings"
	"sync"
	//"sync/atomic"
	"bytes"
	"encoding/json"
	"github.com/container-storage-interface/spec/lib/go/csi"
	"github.com/google/uuid"
	"github.com/poseidonos/pos-csi/pkg/model"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
	"io/ioutil"
	"k8s.io/klog"
	"net/http"
	"time"
)

const invalidNSID = 0

type nodeNVMf struct {
	client *rpcClient

	targetType   string // RDMA, TCP
	targetAddr   string
	targetPort   string
	transCreated int32

	lvols map[string]*lvolNVMf
	mtx   sync.Mutex // for concurrent access to lvols map
}

type lvolNVMf struct {
	nsID  int
	nqn   string
	model string
}

func (lvol *lvolNVMf) reset() {
	lvol.nsID = invalidNSID
	lvol.nqn = ""
	lvol.model = ""
}

func newNVMf(client *rpcClient, targetType, targetAddr string) *nodeNVMf {
	return &nodeNVMf{
		client:     client,
		targetType: targetType,
		targetAddr: targetAddr,
		targetPort: cfgNVMfSvcPort,
		lvols:      make(map[string]*lvolNVMf),
	}
}

func (node *nodeNVMf) Info() string {
	return node.client.info()
}

func (node *nodeNVMf) LvStores() ([]LvStore, error) {
	return node.client.lvStores()
}

// VolumeInfo returns a string:string map containing information necessary
// for CSI node(initiator) to connect to this target and identify the disk.
func (node *nodeNVMf) VolumeInfo(lvolID string) (map[string]string, error) {
	node.mtx.Lock()
	lvol, exists := node.lvols[lvolID]
	node.mtx.Unlock()

	if !exists {
		return nil, fmt.Errorf("volume not exists: %s", lvolID)
	}

	return map[string]string{
		"targetType": node.targetType,
		"targetAddr": node.targetAddr,
		"targetPort": node.targetPort,
		"nqn":        lvol.nqn,
		"model":      lvol.model,
	}, nil
}

// CreateVolume creates a logical volume and returns volume ID
func (node *nodeNVMf) CreateVolume(lvsName string, sizeMiB int64) (string, error) {
	lvolID, err := node.client.createVolume(lvsName, sizeMiB)
	if err != nil {
		return "", err
	}

	node.mtx.Lock()
	defer node.mtx.Unlock()

	_, exists := node.lvols[lvolID]
	if exists {
		return "", fmt.Errorf("volume ID already exists: %s", lvolID)
	}
	node.lvols[lvolID] = &lvolNVMf{nsID: invalidNSID}

	klog.V(5).Infof("volume created: %s", lvolID)
	return lvolID, nil
}

func (node *nodeNVMf) CreateSnapshot(lvolName, snapshotName string) (string, error) {
	snapshotID, err := node.client.snapshot(lvolName, snapshotName)
	if err != nil {
		return "", err
	}

	klog.V(5).Infof("snapshot created: %s", snapshotID)
	return snapshotID, nil
}

func (node *nodeNVMf) DeleteVolume(lvolID string) error {
	err := node.client.deleteVolume(lvolID)
	if err != nil {
		return err
	}

	node.mtx.Lock()
	defer node.mtx.Unlock()

	delete(node.lvols, lvolID)

	klog.V(5).Infof("volume deleted: %s", lvolID)
	return nil
}

// PublishVolume exports a volume through NVMf target
func PublishVolume(csiReq *csi.CreateVolumeRequest, conf map[string]string) error {
	var err error
	err = createTransport(conf)
	if err != nil {
		return err
	}
	err = createSubsystem(conf)
	if err != nil {
		return err
	}
	err = subsystemAddListener(conf)
	if err != nil {
		return err
	}
	err = mountVolume(csiReq, conf)
	if err != nil {
		return err
	}
	return nil
}

func mountVolume(csiReq *csi.CreateVolumeRequest, conf map[string]string) error {
	name := csiReq.Name
	requestBody := []byte(fmt.Sprintf(`{
            "param": {
                "array": "%s",
                "subnqn": "%s"
             }
        }`, conf["array"], conf["nqn"]))
	url := fmt.Sprintf("http://%s:%s/api/ibofos/v1/volumes/%s/mount", conf["provisionerIp"], conf["provisionerPort"], name)
	resp, err := CallDAgent(url, requestBody, "POST", "Mount volume")
	body, _ := ioutil.ReadAll(resp.Body)
	dec := json.NewDecoder(bytes.NewBuffer(body))
	dec.UseNumber()
	response := model.Response{}
	if err = dec.Decode(&response); err != nil {
		klog.Info("Error in decoding Mount Volume Response")
		return status.Error(codes.Unavailable, err.Error())
	}
	if response.Result.Status.Code == 0 {
		klog.Infof("Mount Volume API response: %v", string(body))
	} else if response.Result.Status.Code == 2040 {
		klog.Infof("Volume Already Mounted")
	} else {
		return status.Error(codes.Unavailable, response.Result.Status.Description)
	}
	return nil
}

func GetUUIDFromNamespaces(volName string, namespaces []interface{}) (string, error) {
	for _, namespace := range namespaces {
		ns := namespace.(map[string]interface{})
		if ns["bdev_name"].(string) == volName {
			return ns["uuid"].(string), nil
		}
	}
	return "", status.Error(codes.Unavailable, "Volume does not exist in subsystem")
}

func GetUUIDFromSubsystem(id string, conf map[string]string) (string, error) {
	subsystemResponse, err := ListSubsystem(conf)
	if err != nil {
		return "", err
	}
	data := subsystemResponse.Result.Data.(map[string]interface{})
	subList, exists := data["subsystemlist"].([]interface{})
	if exists {
		for _, subsystem := range subList {
			subsystemMap := subsystem.(map[string]interface{})
			if subsystemMap["nqn"] == conf["nqn"] {
				if namespaces, exists := subsystemMap["namespaces"]; exists {
					volName := "bdev_" + id + "_" + conf["array"]
					return GetUUIDFromNamespaces(volName, namespaces.([]interface{}))
				}
			}
		}
	}
	return "", status.Error(codes.Unavailable, "Volume does not exist in subsystem")
}

func GetUUID(name string, conf map[string]string) (string, error) {
	id, err := GetVolumeIdFromName(name, conf)
	if err != nil {
		return "", err
	}
	uuid, err := GetUUIDFromSubsystem(id, conf)
	if err != nil {
		return "", err
	}
	return uuid, nil
}

/*
func UnpublishVolume(lvolID string) error {
	var err error

	node.mtx.Lock()
	lvol, exists := node.lvols[lvolID]
	node.mtx.Unlock()

	if !exists {
		return ErrVolumeDeleted
	}
	if lvol.nqn == "" {
		return ErrVolumeUnpublished
	}

	err = node.subsystemRemoveNs(lvol.nqn, lvol.nsID)
	if err != nil {
		// we should try deleting subsystem even if we fail here
		klog.Errorf("failed to remove namespace(nqn=%s, nsid=%d): %s", lvol.nqn, lvol.nsID, err)
	} else {
		lvol.nsID = invalidNSID
	}

	err = node.deleteSubsystem(lvol.nqn)
	if err != nil {
		return err
	}

	lvol.reset()
	klog.V(5).Infof("volume unpublished: %s", lvolID)
	return nil
}*/

func GetVolumeIdFromName(volumeName string, conf map[string]string) (string, error) {
	url := fmt.Sprintf("http://%s:%s/api/ibofos/v1/volumelist/%s", conf["provisionerIp"], conf["provisionerPort"], conf["array"])
	resp, err := CallDAgent(url, nil, "GET", "List Volumes")
	body, _ := ioutil.ReadAll(resp.Body)
	dec := json.NewDecoder(bytes.NewBuffer(body))
	dec.UseNumber()
	response := model.Response{}
	if err = dec.Decode(&response); err != nil {
		return "", status.Error(codes.Unavailable, err.Error())
	}
	if response.Result.Status.Code == 0 {
		volumes := response.Result.Data.(map[string]interface{})["volumes"].([]interface{})
		for _, volume := range volumes {
			vol := volume.(map[string]interface{})
			if vol["name"].(string) == volumeName {
				return fmt.Sprintf("%s", vol["id"]), nil
			}
		}
	}

	return "", status.Error(codes.Unavailable, response.Result.Status.Description)

}

func ListSubsystem(conf map[string]string) (model.Response, error) {
	url := fmt.Sprintf("http://%s:%s/api/ibofos/v1/subsystem", conf["provisionerIp"], conf["provisionerPort"])
	resp, err := CallDAgent(url, nil, "GET", "List SubSystem")
	body, _ := ioutil.ReadAll(resp.Body)
	dec := json.NewDecoder(bytes.NewBuffer(body))
	dec.UseNumber()
	response := model.Response{}
	if err = dec.Decode(&response); err != nil {
		return response, status.Error(codes.Unavailable, err.Error())
	}
	if response.Result.Status.Code == 0 {
		klog.Info("List SubSystem Success")
	} else {
		return response, status.Error(codes.Unavailable, response.Result.Status.Description)
	}
	return response, nil

}
func createSubsystem(conf map[string]string) error {
	response, err := ListSubsystem(conf)
	if err != nil {
		return err
	}
	klog.Infof("%v", response)
	data := response.Result.Data.(map[string]interface{})
	subList, keyExist1 := data["subsystemlist"].([]interface{})
	if keyExist1 {
		for itr := 0; itr < len(subList); itr++ {
			nqn, keyExist2 := subList[itr].(map[string]interface{})["nqn"]
			if keyExist2 {
				if strings.Compare(nqn.(string), conf["nqn"]) == 0 {
					klog.Infof("Subsystem already exist")
					return nil
				}
			}
		}
	}
	url := fmt.Sprintf("http://%s:%s/api/ibofos/v1/subsystem", conf["provisionerIp"], conf["provisionerPort"])
	requestBody := []byte(fmt.Sprintf(`{"param": {
        "name": "%s",
        "sn": "%s",
        "mn": "%s",
        "max_namespaces": %s,
        "allow_any_host": %s
    }}`, conf["nqn"], conf["serialNumber"], conf["modelNumber"], conf["maxNamespaces"], conf["allowAnyHost"]))
	resp, _ := CallDAgent(url, requestBody, "POST", "Create SubSystem")
	body, _ := ioutil.ReadAll(resp.Body)
	dec := json.NewDecoder(bytes.NewBuffer(body))
	dec.UseNumber()
	response = model.Response{}
	if err = dec.Decode(&response); err != nil {
		return status.Error(codes.Unavailable, err.Error())
	}
	if response.Result.Status.Code == 0 {
		klog.Infof("Create SubSystem API response: %v", string(body))
	} else {
		return status.Error(codes.Unavailable, response.Result.Status.Description)
	}

	return nil
}

func (node *nodeNVMf) subsystemAddNs(nqn, lvolID string) (int, error) {
	type namespace struct {
		BdevName string `json:"bdev_name"`
	}

	params := struct {
		Nqn       string    `json:"nqn"`
		Namespace namespace `json:"namespace"`
	}{
		Nqn: nqn,
		Namespace: namespace{
			BdevName: lvolID,
		},
	}

	var nsID int

	err := node.client.call("nvmf_subsystem_add_ns", &params, &nsID)
	return nsID, err
}

func subsystemAddListener(conf map[string]string) error {
	url := fmt.Sprintf("http://%s:%s/api/ibofos/v1/listener", conf["provisionerIp"], conf["provisionerPort"])
	requestBody := []byte(fmt.Sprintf(`{
            "param": {
                "name": "%s",
                "transport_type": "%s",
                "target_address": "%s",
                "transport_service_id": "%s"
             }
        }`, conf["nqn"], conf["targetType"], conf["targetAddr"], conf["targetPort"]))
	resp, err := CallDAgent(url, requestBody, "POST", "Add Listener")
	body, _ := ioutil.ReadAll(resp.Body)
	dec := json.NewDecoder(bytes.NewBuffer(body))
	dec.UseNumber()
	response := model.Response{}
	if err = dec.Decode(&response); err != nil {
		return status.Error(codes.Unavailable, err.Error())
	}
	if response.Result.Status.Code == 0 {
		klog.Infof("Add listener API response: %v", string(body))
	} else {
		return status.Error(codes.Unavailable, response.Result.Status.Description)
	}
	return nil

}

/*
func subsystemRemoveNs(nqn string, nsID int) error {
	params := struct {
		Nqn  string `json:"nqn"`
		NsID int    `json:"nsid"`
	}{
		Nqn:  nqn,
		NsID: nsID,
	}

	return node.client.call("nvmf_subsystem_remove_ns", &params, nil)
}

func deleteSubsystem(nqn string) error {
	params := struct {
		Nqn string `json:"nqn"`
	}{
		Nqn: nqn,
	}

	return node.client.call("nvmf_delete_subsystem", &params, nil)
}*/

func createTransport(conf map[string]string) error {
	// concurrent requests can happen despite this fast path check
	/*if atomic.LoadInt32(&node.transCreated) != 0 {
	        return nil
	}*/
	url := fmt.Sprintf("http://%s:%s/api/ibofos/v1/transport", conf["provisionerIp"], conf["provisionerPort"])
	requestBody := []byte(fmt.Sprintf(`{
            "param": {
                "transport_type": "%s",
                "buf_cache_size": %s,
                "num_shared_buf": %s
             }
        }`, conf["targetType"], conf["bufCacheSize"], conf["numSharedBuf"]))

	resp, err := CallDAgent(url, requestBody, "POST", "Create Transport")
	body, _ := ioutil.ReadAll(resp.Body)
	dec := json.NewDecoder(bytes.NewBuffer(body))
	dec.UseNumber()
	response := model.Response{}
	if err = dec.Decode(&response); err != nil {
		return status.Error(codes.Unavailable, err.Error())
	}

	if err == nil {
		klog.V(5).Infof("Transport created: %s,%s", conf["targetAddr"], conf["targetType"])
		//atomic.StoreInt32(&node.transCreated, 1)
	} else if strings.Contains(err.Error(), "already exists") {
		err = nil // ignore transport already exists error
		//atomic.StoreInt32(&node.transCreated, 1)
	}

	return err
}

func CallDAgent(url string, requestBody []byte, reqType string, reqName string) (*http.Response, error) {
	req, err := http.NewRequest(reqType, url, bytes.NewBuffer(requestBody))
	id := uuid.New()
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("X-request-Id", id.String())
	req.Header.Set("ts", fmt.Sprintf("%v", time.Now().Unix()))
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		klog.Infof("Error in DAgent %v API: %v", reqName, err)
		return nil, status.Error(codes.Unavailable, err.Error())
	}
	return resp, err
	/*if resp.StatusCode != 200 {
	        return nil, status.Error(codes.Unavailable, "Transport Creation Failed")
	}*/
}
