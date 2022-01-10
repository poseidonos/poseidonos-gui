package spdk

import (
	"bytes"
	"encoding/json"
	"errors"
	"fmt"
	"github.com/container-storage-interface/spec/lib/go/csi"
	"github.com/google/uuid"
	"io/ioutil"
	"k8s.io/klog/v2"
	"log"
	"net/http"
	"time"
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
	klog.Info("Create VOlume Started")
	klog.Infof("%v", csiReq.GetCapacityRange().GetRequiredBytes())
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
	log.Println("calling Create Volume")
	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()
	body, _ := ioutil.ReadAll(resp.Body)
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
		return nil, err
	}
	log.Println("Calling Mount Volume")
	resp, err = client.Do(req)
	if err != nil {
		return nil, err
	}
	body, _ = ioutil.ReadAll(resp.Body)
	volUrl := fmt.Sprintf("http://%s:%s/api/ibofos/v1/volumes/nqn/%s", config["provisionerIp"], config["provisionerPort"], name)
	req, err = http.NewRequest("GET", volUrl, nil)
	id = uuid.New()
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("X-request-Id", id.String())
	req.Header.Set("ts", fmt.Sprintf("%v", time.Now().Unix()))
	if err != nil {
		return nil, err
	}
	log.Println("Publishing Volume")
	resp, err = client.Do(req)
	if err != nil {
		return nil, err
	}
	body, _ = ioutil.ReadAll(resp.Body)
	log.Println("Created Volume")
	d := json.NewDecoder(bytes.NewBuffer(body))
	d.UseNumber()
	response := Response{}
	log.Println("Volume Body")
	log.Println(body)

	if err = d.Decode(&response); err != nil {
		log.Fatal(err)
	}

	if err != nil {
		log.Printf("Response Unmarshal Error : %v", err)
		return nil, err
	} else {
		response.LastSuccessTime = time.Now().UTC().Unix()
		// return response.Result.Data.(map[string]interface{}).uuid, nil
		if response.Result.Data == nil {
			return nil, errors.New("Volume Creation Failed")
		}

		log.Print(response.Result.Data)
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

func (dagent *DAgent) DeleteVolume(name string, config map[string]string) (error) {
        klog.Info("Delete VOlume Started")
	url := fmt.Sprintf("http://%s:%s/api/ibofos/v1/volumes/%s/mount", config["provisionerIp"], config["provisionerPort"],name)
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
        log.Println("calling unmount Volume")
        resp, err := client.Do(req)
        if err != nil {
                return  err
        }
        defer resp.Body.Close()
        body, _ := ioutil.ReadAll(resp.Body)
	log.Println("unmount vol body ",body)
        time.Sleep(5*time.Second)
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
                return  err
        }
        log.Println("Calling delete Volume")
        resp, err = client.Do(req)
        if err != nil {
                return  err
        }
        //body, _ = ioutil.ReadAll(resp.Body)

	return err
}
