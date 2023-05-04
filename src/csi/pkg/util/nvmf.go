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

package util

import (
	"bytes"
	"encoding/json"
	"errors"
	"fmt"
	"io/ioutil"
	"net/http"
	"strings"
	"time"

	"github.com/container-storage-interface/spec/lib/go/csi"
	"github.com/google/uuid"
	"github.com/poseidonos/pos-csi/pkg/model"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
	"k8s.io/klog"
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

// UnpublishVolume deletes the subsystem to which the volume is attached
func UnpublishVolume(name string, params map[string]string) error {
	err := unmountVolume(name, params)
	if err != nil {
		return err
	}
	return deleteSubsystem(params)
}

func unmountVolume(name string, params map[string]string) error {
	url := fmt.Sprintf("http://%s:%s/api/ibofos/v1/volumes/%s/mount", params["provisionerIp"], params["provisionerPort"], name)
	requestBody := []byte(fmt.Sprintf(`{
            "param": {
                "array": "%s"
             }
        }`, params["array"]))
	resp, err := CallDAgentWithStatus(params["provisionerIp"], params["provisionerPort"], url, requestBody, "DELETE", "Unmount Volume", 0)
	if err != nil && resp == nil {
		klog.Infof("Error in Unmount Volume API: %v", err)
		return status.Error(codes.Unavailable, err.Error())
	}
	defer resp.Body.Close()
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return status.Error(codes.Unavailable, err.Error())
	}
	klog.Infof("Unmount Volume API response: %v", string(body))
	dec := json.NewDecoder(bytes.NewBuffer(body))
	dec.UseNumber()
	response := model.Response{}
	if err = dec.Decode(&response); err != nil {
		klog.Info("Error in decoding Unmount Volume Response")
		return status.Error(codes.Unavailable, err.Error())
	}
	if response.Result.Status.Code == 0 {
		klog.Info("Volume unmounted successfully")
	} else if response.Result.Status.Code == 1852 {
		klog.Info("Volume is already unmounted")
	} else {
		return status.Error(codes.Unavailable, response.Result.Status.Description)
	}
	return nil
}

func deleteSubsystem(params map[string]string) error {
	requestBody := []byte(fmt.Sprintf(`{
		"param": {
			"subnqn": "%s"
		}
	}`, params["nqn"]))
	url := fmt.Sprintf("http://%s:%s/api/ibofos/v1/subsystem", params["provisionerIP"], params["provisionerPort"])
	resp, err := CallDAgentWithStatus(params["provisionerIp"], params["provisionerPort"], url, requestBody, "DELETE", "Delete Subsystem", 0)
	if err != nil {
		return status.Error(codes.Unavailable, err.Error())
	}
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return status.Error(codes.Unavailable, err.Error())
	}
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

func mountVolume(csiReq *csi.CreateVolumeRequest, conf map[string]string) error {
	name := csiReq.Name
	requestBody := []byte(fmt.Sprintf(`{
            "param": {
                "array": "%s",
                "subnqn": "%s"
             }
        }`, conf["array"], conf["nqn"]))
	url := fmt.Sprintf("http://%s:%s/api/ibofos/v1/volumes/%s/mount", conf["provisionerIp"], conf["provisionerPort"], name)
	resp, err := CallDAgentWithStatus(conf["provisionerIp"], conf["provisionerPort"], url, requestBody, "POST", "Mount volume", 0)
	if err != nil {
		return status.Error(codes.Unavailable, err.Error())
	}
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return status.Error(codes.Unavailable, err.Error())
	}
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
	subsystemResponse, err := ListSubsystem(conf, 1)
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
	id, err := GetVolumeUUIDFromName(name, conf)
	if err != nil {
		return "", err
	}
	return id, nil
}

func GetVolumeUUIDFromName(volumeName string, conf map[string]string) (string, error) {
	klog.Info("Calling Volume ID From Name")

	url := fmt.Sprintf("http://%s:%s/api/ibofos/v1/array/%s/volume/%s", conf["provisionerIp"], conf["provisionerPort"], conf["array"], volumeName)
	resp, err := CallDAgentWithStatus(conf["provisionerIp"], conf["provisionerPort"], url, nil, "GET", "List Volumes", 0)
	if err != nil {
		return "", status.Error(codes.Unavailable, err.Error())
	}
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return "", status.Error(codes.Unavailable, err.Error())
	}
	dec := json.NewDecoder(bytes.NewBuffer(body))
	dec.UseNumber()
	response := model.Response{}
	klog.Info("Got Volume info:")
	if err = dec.Decode(&response); err != nil {
		return "", status.Error(codes.Unavailable, err.Error())
	}
	if response.Result.Status.Code == 0 {
		klog.Info("Returning volume UUID")
		uuid := response.Result.Data.(map[string]interface{})["uuid"].(string)
		return uuid, nil

	}

	return "", status.Error(codes.Unavailable, response.Result.Status.Description)
}

func GetVolumeIdFromName(volumeName string, conf map[string]string) (string, error) {
	url := fmt.Sprintf("http://%s:%s/api/ibofos/v1/volumelist/%s", conf["provisionerIp"], conf["provisionerPort"], conf["array"])
	resp, err := CallDAgentWithStatus(conf["provisionerIp"], conf["provisionerPort"], url, nil, "GET", "List Volumes", 0)
	if err != nil {
		return "", status.Error(codes.Unavailable, err.Error())
	}
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return "", status.Error(codes.Unavailable, err.Error())
	}
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

func ListSubsystem(conf map[string]string, count int) (model.Response, error) {
	response := model.Response{}
	url := fmt.Sprintf("http://%s:%s/api/ibofos/v1/subsystem", conf["provisionerIp"], conf["provisionerPort"])
	resp, err := CallDAgentWithStatus(conf["provisionerIp"], conf["provisionerPort"], url, nil, "GET", "List SubSystem", 0)
	if err != nil {
		return response, status.Error(codes.Unavailable, err.Error())
	}
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return response, status.Error(codes.Unavailable, err.Error())
	}
	dec := json.NewDecoder(bytes.NewBuffer(body))
	dec.UseNumber()
	if err = dec.Decode(&response); err != nil {
		return response, status.Error(codes.Unavailable, err.Error())
	}
	if response.Result.Status.Code == 0 {
		klog.Info("List SubSystem Success")
	} else {
		if response.Result.Status.Code == 1030 && count < MAX_RETRY_COUNT {
			time.Sleep(2 * time.Second)
			return ListSubsystem(conf, count+1)
		}
		return response, status.Error(codes.Unavailable, response.Result.Status.Description)
	}
	return response, nil

}
func createSubsystem(conf map[string]string) error {
	response, err := ListSubsystem(conf, 1)
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
	requestBody := []byte(fmt.Sprintf(`{
	"param": {
            "nqn": "%s",
            "serialNumber": "%s",
            "modelNumber": "%s",
            "maxNamespaces": %s,
            "allowAnyHost": %s
    }
}`, conf["nqn"], conf["serialNumber"], conf["modelNumber"], conf["maxNamespaces"], conf["allowAnyHost"]))
	resp, err := CallDAgentWithStatus(conf["provisionerIp"], conf["provisionerPort"], url, requestBody, "POST", "Create SubSystem", 0)
	if err != nil {
		return status.Error(codes.Unavailable, err.Error())
	}
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return status.Error(codes.Unavailable, err.Error())
	}
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

func subsystemAddListener(conf map[string]string) error {
	url := fmt.Sprintf("http://%s:%s/api/ibofos/v1/listener", conf["provisionerIp"], conf["provisionerPort"])
	requestBody := []byte(fmt.Sprintf(`{
            "param": {
                "subnqn": "%s",
                "transportType": "%s",
                "targetAddress": "%s",
                "transportServiceId": "%s"
             }
        }`, conf["nqn"], conf["targetType"], conf["targetAddr"], conf["targetPort"]))
	resp, err := CallDAgentWithStatus(conf["provisionerIp"], conf["provisionerPort"], url, requestBody, "POST", "Add Listener", 0)
	if err != nil {
		return status.Error(codes.Unavailable, err.Error())
	}
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return status.Error(codes.Unavailable, err.Error())
	}
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

func createTransport(conf map[string]string) error {
	url := fmt.Sprintf("http://%s:%s/api/ibofos/v1/transport", conf["provisionerIp"], conf["provisionerPort"])
	requestBody := []byte(fmt.Sprintf(`{
            "param": {
                "transportType": "%s",
                "bufCacheSize": %s,
                "numSharedBuf": %s
             }
        }`, conf["targetType"], conf["bufCacheSize"], conf["numSharedBuf"]))

	resp, err := CallDAgenTransportCreation(url, requestBody, "POST", "Create Transport")
	if err != nil {
		return status.Error(codes.Unavailable, err.Error())
	}
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return status.Error(codes.Unavailable, err.Error())
	}
	dec := json.NewDecoder(bytes.NewBuffer(body))
	dec.UseNumber()
	response := model.Response{}
	if err = dec.Decode(&response); err != nil {
		return status.Error(codes.Unavailable, err.Error())
	}

	if err == nil {
		klog.V(5).Infof("Transport created: %s,%s", conf["targetAddr"], conf["targetType"])
	} else if strings.Contains(err.Error(), "already exists") {
		err = nil // ignore transport already exists error
	}

	return err
}

func CallDAgenTransportCreation(url string, requestBody []byte, reqType string, reqName string) (*http.Response, error) {
	req, err := http.NewRequest(reqType, url, bytes.NewBuffer(requestBody))
	if err != nil {
		return nil, status.Error(codes.Unavailable, err.Error())
	}
	id := uuid.New()
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("X-request-Id", id.String())
	req.Header.Set("ts", fmt.Sprintf("%v", time.Now().Unix()))
	client := &http.Client{}
	resp, err := client.Do(req)
	klog.Info("Api respose status code ", reqName, " ", resp.StatusCode)
	if err != nil {
		klog.Infof("Error in DAgent %v API: %v", reqName, err)
		return nil, status.Error(codes.Unavailable, err.Error())
	} else if resp.StatusCode != 200 && resp.StatusCode != 400 {
		klog.Infof("Error in DAgent %v API: response code %v", reqName, resp.StatusCode)
		return resp, status.Error(codes.Unavailable, fmt.Sprintf("Server is unable to process %s request", reqName))
	}
	return resp, err
}

func CallDAgent(url string, requestBody []byte, reqType string, reqName string) (*http.Response, error) {
	req, err := http.NewRequest(reqType, url, bytes.NewBuffer(requestBody))
	if err != nil {
		return nil, status.Error(codes.Unavailable, err.Error())
	}
	id := uuid.New()
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("X-request-Id", id.String())
	req.Header.Set("ts", fmt.Sprintf("%v", time.Now().Unix()))
	client := &http.Client{}
	resp, err := client.Do(req)
	klog.Info("Api response ", reqName, " ", resp)
	if resp == nil {
		return resp, status.Error(codes.Unavailable, fmt.Sprintf("DAgent %v API Response is Nil", reqName))
	} else if err != nil {
		klog.Infof("Error in DAgent %v API: %v", reqName, err)
		return nil, status.Error(codes.Unavailable, err.Error())
	} else if resp.StatusCode != 200 {
		klog.Infof("Error in DAgent %v API: response code %v", reqName, resp.StatusCode)
		return resp, status.Error(codes.Unavailable, fmt.Sprintf("Server is unable to process %s request", reqName))
	}
	return resp, err
}

func CallDAgentWithStatus(ip, port, url string, requestBody []byte, reqType string, reqName string, count int) (*http.Response, error) {
	statusURL := fmt.Sprintf("http://%s:%s/api/ibofos/v1/system", ip, port)
	resp, err := CallDAgent(statusURL, nil, "GET", "Status")
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
	if err = dec.Decode(&response); err != nil {
		klog.Info("Error in decoding Status Response")
		return nil, status.Error(codes.Unavailable, err.Error())
	}
	if response.Result.Status.Code == 0 {
		return CallDAgent(url, requestBody, reqType, reqName)
	} else if response.Result.Status.Code == 1030 {
		if count >= MAX_RETRY_COUNT {
			return nil, status.Error(codes.Unavailable, "POS is in busy state")
		}
		time.Sleep(2 * time.Second)
		return CallDAgentWithStatus(ip, port, url, requestBody, reqType, reqName, count+1)
	}
	return nil, status.Error(codes.Unavailable, response.Result.Status.Description)

}
