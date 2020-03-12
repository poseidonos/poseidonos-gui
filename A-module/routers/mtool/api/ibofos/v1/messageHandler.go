package v1

import (
	"fmt"
	"encoding/json"
	"errors"
	"A-module/log"
	"A-module/handler"
	//"A-module/routers/mtool/api"
	"A-module/routers/mtool/model"
	"github.com/google/uuid"
	"sync/atomic"
)

const (
	stateUnlocked uint32 = iota
	stateLocked
)

var (
	locker    = stateUnlocked
	errLocked = errors.New("Locked out buddy")
	ErrBadReq = errors.New("Bad request")
	ErrSending = errors.New("errSending")
	ErrJson = errors.New("errJson")
	ErrRes = errors.New("errRes")
)

func sendIBoF(iBoFRequest model.Request) (model.Response, error) {

	if !atomic.CompareAndSwapUint32(&locker, stateUnlocked, stateLocked) {
		log.Printf("sendIBoFCLI : %+v", iBoFRequest)
		return model.Response{}, ErrBadReq
	}

	defer atomic.StoreUint32(&locker, stateUnlocked)

	b, _ := json.MarshalIndent(iBoFRequest.Param, "", "    ")

	log.Printf("sendIBoFCLI : %+v", iBoFRequest)

	fmt.Println("\n\nRequest to Poseidon OS")
	fmt.Println("    Rid         : ", iBoFRequest.Rid)
	fmt.Println("    Command     : ", iBoFRequest.Command)
	if string(b) != "null" {
		fmt.Println("    Param       : ", string(b))
	}

	marshaled, _ := json.Marshal(iBoFRequest)
	err := handler.WriteToIBoFSocket(marshaled)

	if err != nil {
		log.Printf("sendIBoFCLI : %v", err)
		return model.Response{}, ErrSending
	}

	for {
		temp := handler.GetIBoFResponse()
		log.Printf("Response From iBoFCLI : %s", string(temp))

		response := model.Response{}
		err := json.Unmarshal(temp, &response)

		fmt.Println("\n\nResponse from Poseidon OS")
		fmt.Println("    Code        : ", response.Result.Status.Code)
		fmt.Println("    Description : ", response.Result.Status.Description)

		b, _ := json.MarshalIndent(response.Result.Data, "", "    ")
		if string(b) != "null" {
			fmt.Println("    Data       : ", string(b))
		}

		fmt.Println("\n")
		
		if response.Rid != "timeout" && iBoFRequest.Rid != response.Rid {
			log.Printf("Previous CLI request's response, Wait again")
			continue
		}

		if err != nil {
			log.Printf("Response CLI Unmarshal Error : %v", err)
			return model.Response{}, ErrJson

		} else if response.Result.Status.Code != 0 {
			return model.Response{}, ErrRes

		} else {
			//ctx.JSON(http.StatusOK, &response)
			return response, nil
		}
	}

	return model.Response{}, nil
}

func makeRequest(xrId string, command string) model.Request {
	//xrId := ctx.GetHeader("X-request-Id")

	if len(xrId) == 0 {

		uuid, err := uuid.NewUUID()
		if err == nil {
			xrId = uuid.String()
		}
	}
	
	request := model.Request{
		Command: command,
		Rid:     xrId,
	}
	return request
}
