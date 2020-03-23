package v1

import (
	"encoding/json"
	"errors"
	"A-module/log"
	"A-module/handler"
	"A-module/routers/mtool/model"
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

	log.Printf("sendIBoFCLI : %+v", iBoFRequest)

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
	
	request := model.Request{
		Command: command,
		Rid:     xrId,
	}
	return request
}