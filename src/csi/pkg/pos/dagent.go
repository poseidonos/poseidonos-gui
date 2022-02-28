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
	"time"
	"sync"
)

type DAgent struct {
	//	Client RemoteClient
}

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

func (dagent *DAgent) CreateVolume(csiReq *csi.CreateVolumeRequest, size int64, config map[string]string, mtx2 *sync.Mutex) (*volume, error) {
	name := csiReq.Name
	fmt.Println("config ",config)
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
                "maxiops": 0
             }
        }`, config["array"], name, alignedSize))
	resp, err := util.CallDAgentWithStatus(config["provisionerIp"], config["provisionerPort"], url, requestBody, "POST", "Create Volume", 0,mtx2)
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

func (dagent *DAgent) DeleteVolume(name string, config map[string]string, mtx2 *sync.Mutex ) error {
	url := fmt.Sprintf("http://%s:%s/api/ibofos/v1/volumes/%s/mount", config["provisionerIp"], config["provisionerPort"], name)
	requestBody := []byte(fmt.Sprintf(`{
            "param": {
                "array": "POSArray"
             }
        }`))
	resp, err := util.CallDAgentWithStatus(config["provisionerIp"], config["provisionerPort"], url, requestBody, "DELETE", "Unmount Volume", 0, mtx2)
	if err != nil {
		klog.Infof("Error in Unmount Volume API: %v", err)
		return err
	}
	defer resp.Body.Close()
	body, _ := ioutil.ReadAll(resp.Body)
	klog.Infof("Unmount Volume API response: %v", string(body))
	time.Sleep(5 * time.Second)
	requestBody = []byte(`{
            "param": {
                "array": "POSArray"
             }
        }`)
	deleteUrl := fmt.Sprintf("http://%s:%s/api/ibofos/v1/volumes/%s", config["provisionerIp"], config["provisionerPort"], name)
	resp, err = util.CallDAgentWithStatus(config["provisionerIp"], config["provisionerPort"], deleteUrl, requestBody, "DELETE", "Delete Volume", 0, mtx2)
	if err != nil {
		klog.Infof("Error in Delete Volume API: %v", err)
		return err
	}
        body, _ = ioutil.ReadAll(resp.Body)
        klog.Infof("Delete Volume API response: %v", string(body))
	return err
}
