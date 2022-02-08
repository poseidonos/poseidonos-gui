package spdk

import (
	"bytes"
	"encoding/json"
	"fmt"
	"github.com/container-storage-interface/spec/lib/go/csi"
	"github.com/google/uuid"
	"io/ioutil"
	"k8s.io/klog/v2"
	"net/http"
	"time"
        "google.golang.org/grpc/codes"
        "google.golang.org/grpc/status"
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

func (dagent *DAgent) CreateVolume(csiReq *csi.CreateVolumeRequest, size int64, config map[string]string) (*volume, error) {
	name := csiReq.Name
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
        }`, config["array"], name, csiReq.GetCapacityRange().GetRequiredBytes()))
	req, err := http.NewRequest("POST", url, bytes.NewBuffer(requestBody))
	id := uuid.New()
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("X-request-Id", id.String())
	req.Header.Set("ts", fmt.Sprintf("%v", time.Now().Unix()))
	client := &http.Client{}
	resp, err := client.Do(req)
        if err != nil {
		klog.Infof("Error in DAgent Create Volume API: %v", err)
                return nil, status.Error(codes.Unavailable, err.Error())
        }
	if resp.StatusCode != 200 {
		return nil, status.Error(codes.Unavailable, "volume creation failed")
	}
        defer resp.Body.Close()
	body, _ := ioutil.ReadAll(resp.Body)
	klog.Infof("Create Volume API response: %v", string(body))
        dec := json.NewDecoder(bytes.NewBuffer(body))
        dec.UseNumber()
        response := Response{}
        if err = dec.Decode(&response); err != nil {
                return nil, status.Error(codes.Unavailable, err.Error())
        }
	if response.Result.Status.Code == 2000 || response.Result.Status.Code == 0 {
		klog.Infof("Volume creation success")
	} else {
		return nil, status.Error(codes.Unavailable,response.Result.Status.Description)
	}
	time.Sleep(5 * time.Second)
	requestBody = []byte(fmt.Sprintf(`{
            "param": {
                "array": "%s"
             }
        }`, config["array"]))
	mountUrl := fmt.Sprintf("http://%s:%s/api/ibofos/v1/volumes/%s/mount", config["provisionerIp"], config["provisionerPort"], name)
	req, err = http.NewRequest("POST", mountUrl, bytes.NewBuffer(requestBody))
	req.Header.Set("Content-Type", "application/json")
	id = uuid.New()
	req.Header.Set("X-request-Id", id.String())
	req.Header.Set("ts", fmt.Sprintf("%v", time.Now().Unix()))
	if err != nil {
		return nil, status.Error(codes.Unavailable, err.Error())
	}
	klog.Infof("Calling Mount Volume API: %v", csiReq.Name)
	resp, err = client.Do(req)
        if err != nil {
		klog.Infof("Error in DAgent Mount Volume API: %v", err)
                return nil, status.Error(codes.Unavailable, err.Error())
        }
        if resp.StatusCode != 200 {
                return nil, status.Error(codes.Unavailable, "volume mount failed")
        }
        body, _ = ioutil.ReadAll(resp.Body)
        dec = json.NewDecoder(bytes.NewBuffer(body))
        dec.UseNumber()
        response = Response{}
        if err = dec.Decode(&response); err != nil {
                return nil, status.Error(codes.Unavailable, err.Error())
        }
        if response.Result.Status.Code == 0 {
                klog.Infof("Mount Volume API response: %v", string(body))
	} else {
                return nil, status.Error(codes.Unavailable,response.Result.Status.Description)
        }
	volUrl := fmt.Sprintf("http://%s:%s/api/ibofos/v1/volumes/nqn/%s", config["provisionerIp"], config["provisionerPort"], name)
	req, err = http.NewRequest("GET", volUrl, nil)
	id = uuid.New()
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("X-request-Id", id.String())
	req.Header.Set("ts", fmt.Sprintf("%v", time.Now().Unix()))
	if err != nil {
		return nil, status.Error(codes.Unavailable, err.Error())
	}
	klog.Infof("Calling Volume NQN API: %v", csiReq.Name)
	resp, err = client.Do(req)
        if err != nil {
		klog.Infof("Error in DAgent NQN API: %v", err)
                return nil, status.Error(codes.Unavailable, err.Error())
        }
        if resp.StatusCode != 200 {
                return nil, status.Error(codes.Unavailable, "Could not get NQN information")
        }
	body, _ = ioutil.ReadAll(resp.Body)
	klog.Infof("NQN API response: %v", string(body))
	d := json.NewDecoder(bytes.NewBuffer(body))
	d.UseNumber()
	response = Response{}

	if err = d.Decode(&response); err != nil {
		klog.Infof("Error in decoding response from DAgent: %v", err)
	}

	if err != nil {
		klog.Infof("Response Unmarshal Error : %v", err)
		return nil, status.Error(codes.Unavailable, err.Error())
	} else {
		response.LastSuccessTime = time.Now().UTC().Unix()
		// return response.Result.Data.(map[string]interface{}).uuid, nil
		if response.Result.Data == nil {
			return nil,status.Error(codes.Unavailable,"Could not get NQN information")
		}

		return &volume{
			name: name,
			csiVolume: csi.Volume{
				VolumeId:      response.Result.Data.(map[string]interface{})["uuid"].(string),
				CapacityBytes: size,
				VolumeContext: csiReq.GetParameters(),
				ContentSource: csiReq.GetVolumeContentSource(),
			},
		}, nil
	}

}

func (dagent *DAgent) DeleteVolume(name string, config map[string]string) error {
	url := fmt.Sprintf("http://%s:%s/api/ibofos/v1/volumes/%s/mount", config["provisionerIp"], config["provisionerPort"], name)
	requestBody := []byte(fmt.Sprintf(`{
            "param": {
                "array": "POSArray"
             }
        }`))
	req, err := http.NewRequest("DELETE", url, bytes.NewBuffer(requestBody))
	id := uuid.New()
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("X-request-Id", id.String())
	req.Header.Set("ts", fmt.Sprintf("%v", time.Now().Unix()))
	client := &http.Client{}
	klog.Infof("Calling Unmount Volume API: %v", name)
	resp, err := client.Do(req)
        if err != nil {
		klog.Infof("Error in Unmount Volume API: %v", err)
        }
        if resp.StatusCode != 200 {
                return status.Error(codes.Unavailable, "volume unmount failed")
        }
        defer resp.Body.Close()
	body, _ := ioutil.ReadAll(resp.Body)
	dec := json.NewDecoder(bytes.NewBuffer(body))
        dec.UseNumber()
        response := Response{}
        if err = dec.Decode(&response); err != nil {
                return status.Error(codes.Unavailable, err.Error())
        }
        if response.Result.Status.Code == 0 {
                klog.Infof("Unmount Volume API Response: %v", string(body))
	} else {
                return status.Error(codes.Unavailable,response.Result.Status.Description)
        }

        time.Sleep(3*time.Second)
        requestBody = []byte(`{
            "param": {
                "array": "POSArray"
             }
        }`)
	deleteUrl := fmt.Sprintf("http://%s:%s/api/ibofos/v1/volumes/%s", config["provisionerIp"], config["provisionerPort"],name)
        req, err = http.NewRequest("DELETE", deleteUrl, bytes.NewBuffer(requestBody))
        req.Header.Set("Content-Type", "application/json")
        id = uuid.New()
        req.Header.Set("X-request-Id", id.String())
        req.Header.Set("ts", fmt.Sprintf("%v", time.Now().Unix()))
        if err != nil {
                return  status.Error(codes.Unavailable, err.Error())
        }
        klog.Infof("Calling Delete Volume API: %v", name)
        resp, err = client.Do(req)
        if err != nil {
		klog.Infof("Error in Delete Volume API: %v", err)
                return status.Error(codes.Unavailable, err.Error())
        }
        if resp.StatusCode != 200 {
                return status.Error(codes.Unavailable, "volume delte failed")
        }
        body, _ = ioutil.ReadAll(resp.Body)
        dec = json.NewDecoder(bytes.NewBuffer(body))
        dec.UseNumber()
        response = Response{}
        if err = dec.Decode(&response); err != nil {
                return status.Error(codes.Unavailable, err.Error())
        }
        if response.Result.Status.Code == 0 {
                klog.Infof("Volume delete success")
	}else {
                return status.Error(codes.Unavailable,response.Result.Status.Description)
        }
	return nil
}
