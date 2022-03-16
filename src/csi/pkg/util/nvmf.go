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
	"errors"
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

const MAX_RETRY_COUNT = 5

var (
        // json response errors: errors.New("json: tag-string")
        // matches if "tag-string" founded in json error string
        ErrJSONNoSpaceLeft  = errors.New("json: No space left")
        ErrJSONNoSuchDevice = errors.New("json: No such device")

        // internal errors
        ErrVolumeDeleted     = errors.New("volume deleted")
        ErrVolumePublished   = errors.New("volume already published")
        ErrVolumeUnpublished = errors.New("volume not published")
)

// PublishVolume exports a volume through NVMf target
func PublishVolume(csiReq *csi.CreateVolumeRequest, conf map[string]string, mtx2 *sync.Mutex) error {
	var err error
	err = createTransport(conf, mtx2)
	if err != nil {
		return err
	}
	err = createSubsystem(conf, mtx2)
	if err != nil {
		return err
	}
	err = subsystemAddListener(conf, mtx2)
	if err != nil {
		return err
	}
	err = mountVolume(csiReq, conf, mtx2)
	if err != nil {
		return err
	}
	return nil
}

// UnpublishVolume deletes the subsystem to which the volume is attached
func UnpublishVolume(name string, params map[string]string, mtx2 *sync.Mutex) error {
	err := unmountVolume(name, params, mtx2)
	if err != nil {
		return err
	}
	return deleteSubsystem(params, mtx2)
}

func unmountVolume(name string, params map[string]string, mtx2 *sync.Mutex) error {
	url := fmt.Sprintf("http://%s:%s/api/ibofos/v1/volumes/%s/mount", params["provisionerIp"], params["provisionerPort"], name)
        requestBody := []byte(fmt.Sprintf(`{
            "param": {
                "array": "%s"
             }
        }`, params["array"]))
        resp, err := CallDAgentWithStatus(params["provisionerIp"], params["provisionerPort"], url, requestBody, "DELETE", "Unmount Volume", 0, mtx2)
        if err != nil {
                klog.Infof("Error in Unmount Volume API: %v", err)
                return status.Error(codes.Unavailable, err.Error())
        }
	defer resp.Body.Close()
        body, _ := ioutil.ReadAll(resp.Body)
        klog.Infof("Unmount Volume API response: %v", string(body))
	return nil
}

func deleteSubsystem(params map[string]string, mtx2 *sync.Mutex) error {
	requestBody := []byte(fmt.Sprintf(`{
		"param": {
			"name": "%s"
		}
	}`, params["nqn"]))
	url := fmt.Sprintf("http://%s:%s/api/ibofos/v1/subsystem", params["provisionerIP"], params["provisionerPort"])
	resp, err := CallDAgentWithStatus(params["provisionerIp"], params["provisionerPort"], url, requestBody, "DELETE", "Delete Subsystem", 0, mtx2)
	body, _ := ioutil.ReadAll(resp.Body)
        dec := json.NewDecoder(bytes.NewBuffer(body))
        dec.UseNumber()
        response := model.Response{}
        if err = dec.Decode(&response); err != nil {
                klog.Info("Error in decoding Subsystem Delete Response")
                return status.Error(codes.Unavailable, err.Error())
        }
	if response.Result.Status.Code == 0 {
		klog.Infof("Subsystem deleted successfully")
	} else if response.Result.Status.Code == -1 {
                klog.Infof("No Subsystem to be deleted")
        } else {
                return status.Error(codes.Unavailable, response.Result.Status.Description)
        }
        return nil
}

func mountVolume(csiReq *csi.CreateVolumeRequest, conf map[string]string, mtx2 *sync.Mutex) error {
	name := csiReq.Name
	requestBody := []byte(fmt.Sprintf(`{
            "param": {
                "array": "%s",
                "subnqn": "%s"
             }
        }`, conf["array"], conf["nqn"]))
	url := fmt.Sprintf("http://%s:%s/api/ibofos/v1/volumes/%s/mount", conf["provisionerIp"], conf["provisionerPort"], name)
	resp, err := CallDAgentWithStatus(conf["provisionerIp"], conf["provisionerPort"], url, requestBody, "POST", "Mount volume", 0, mtx2)
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

func GetUUIDFromSubsystem(id string, conf map[string]string, mtx2 *sync.Mutex) (string, error) {
	subsystemResponse, err := ListSubsystem(conf, 1, mtx2)
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

func GetUUID(name string, conf map[string]string,mtx2 *sync.Mutex) (string, error) {
	id, err := GetVolumeIdFromName(name, conf, mtx2)
	if err != nil {
		return "", err
	}
	uuid, err := GetUUIDFromSubsystem(id, conf,mtx2)
	if err != nil {
		return "", err
	}
	return uuid, nil
}



func GetVolumeIdFromName(volumeName string, conf map[string]string,mtx2 *sync.Mutex) (string, error) {
	url := fmt.Sprintf("http://%s:%s/api/ibofos/v1/volumelist/%s", conf["provisionerIp"], conf["provisionerPort"], conf["array"])
	resp, err := CallDAgentWithStatus(conf["provisionerIp"], conf["provisionerPort"], url, nil, "GET", "List Volumes", 0,mtx2)
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

func ListSubsystem(conf map[string]string, count int, mtx2 *sync.Mutex) (model.Response, error) {
	url := fmt.Sprintf("http://%s:%s/api/ibofos/v1/subsystem", conf["provisionerIp"], conf["provisionerPort"])
	resp, err := CallDAgentWithStatus(conf["provisionerIp"], conf["provisionerPort"], url, nil, "GET", "List SubSystem", 0, mtx2)
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
		if response.Result.Status.Code == 1030 && count < MAX_RETRY_COUNT {
			time.Sleep(2 * time.Second)
			return ListSubsystem(conf, count + 1, mtx2)
		}
		return response, status.Error(codes.Unavailable, response.Result.Status.Description)
	}
	return response, nil

}
func createSubsystem(conf map[string]string, mtx2 *sync.Mutex) error {
	response, err := ListSubsystem(conf, 1, mtx2)
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
	resp, _ := CallDAgentWithStatus(conf["provisionerIp"], conf["provisionerPort"], url, requestBody, "POST", "Create SubSystem", 0,mtx2)
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



func subsystemAddListener(conf map[string]string, mtx2 *sync.Mutex) error {
	url := fmt.Sprintf("http://%s:%s/api/ibofos/v1/listener", conf["provisionerIp"], conf["provisionerPort"])
	requestBody := []byte(fmt.Sprintf(`{
            "param": {
                "name": "%s",
                "transport_type": "%s",
                "target_address": "%s",
                "transport_service_id": "%s"
             }
        }`, conf["nqn"], conf["targetType"], conf["targetAddr"], conf["targetPort"]))
	resp, err := CallDAgentWithStatus(conf["provisionerIp"], conf["provisionerPort"], url, requestBody, "POST", "Add Listener", 0, mtx2)
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


func createTransport(conf map[string]string, mtx2 *sync.Mutex) error {
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

	resp, err := CallDAgentWithStatus(conf["provisionerIp"], conf["provisionerPort"], url, requestBody, "POST", "Create Transport", 0, mtx2)
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

func CallDAgent(url string, requestBody []byte, reqType string, reqName string, mtx2 *sync.Mutex) (*http.Response, error) {
	req, err := http.NewRequest(reqType, url, bytes.NewBuffer(requestBody))
	id := uuid.New()
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("X-request-Id", id.String())
	req.Header.Set("ts", fmt.Sprintf("%v", time.Now().Unix()))
	client := &http.Client{}
        mtx2.Lock()
	resp, err := client.Do(req)
        mtx2.Unlock()
	if err != nil {
		klog.Infof("Error in DAgent %v API: %v", reqName, err)
		return nil, status.Error(codes.Unavailable, err.Error())
	}
	return resp, err
	/*if resp.StatusCode != 200 {
	        return nil, status.Error(codes.Unavailable, "Transport Creation Failed")
	}*/
}

func CallDAgentWithStatus(ip, port, url string, requestBody []byte, reqType string, reqName string, count int, mtx2 *sync.Mutex) (*http.Response, error) {
	statusURL := fmt.Sprintf("http://%s:%s/api/ibofos/v1/system", ip, port)
	resp, err := CallDAgent(statusURL, nil, "GET", "Status", mtx2)
	body, _ := ioutil.ReadAll(resp.Body)
        dec := json.NewDecoder(bytes.NewBuffer(body))
        dec.UseNumber()
        response := model.Response{}
        if err = dec.Decode(&response); err != nil {
                klog.Info("Error in decoding Status Response")
                return nil, status.Error(codes.Unavailable, err.Error())
        }
        if response.Result.Status.Code == 0 {
                return CallDAgent(url, requestBody, reqType, reqName, mtx2)
        } else if response.Result.Status.Code == 1030 {
		if count >= MAX_RETRY_COUNT {
			return nil, status.Error(codes.Unavailable, "POS is in busy state")
		}
                time.Sleep(2 *time.Second)
		return CallDAgentWithStatus(ip, port, url, requestBody, reqType, reqName, count + 1, mtx2)
        }
        return nil, status.Error(codes.Unavailable, response.Result.Status.Description)

}
