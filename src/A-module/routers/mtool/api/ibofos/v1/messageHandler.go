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
)
/*
func sendIBoF(ctx *gin.Context, iBoFRequest model.Request) {
	if !atomic.CompareAndSwapUint32(&locker, stateUnlocked, stateLocked) {
		log.Printf("sendIBoF : %+v", iBoFRequest)
		api.MakeBadRequest(ctx, 12000)
		return
	}
	defer atomic.StoreUint32(&locker, stateUnlocked)

	log.Printf("sendIBoF : %+v", iBoFRequest)
	marshaled, _ := json.Marshal(iBoFRequest)
	err := handler.WriteToIBoFSocket(marshaled)

	if err != nil {
		log.Printf("sendIBoF : %v", err)
		api.MakeResponse(ctx, 400, error.Error(err), 19002)
		return
	}

	for {
		temp := handler.GetIBoFResponse()
		log.Printf("Response From iBoF : %s", string(temp))

		response := model.Response{}
		err := json.Unmarshal(temp, &response)

		if response.Rid != "timeout" && iBoFRequest.Rid != response.Rid {
			log.Printf("Previous request's response, Wait again")
			continue
		}

		if err != nil {
			log.Printf("Response Unmarshal Error : %v", err)
			api.MakeResponse(ctx, 400, error.Error(err), 12310)
			return
		} else if response.Result.Status.Code != 0 {
			api.MakeBadRequest(ctx, response.Result.Status.Code)
			return
		} else {
			api.MakeSuccessWithRes(ctx, response)
			//ctx.JSON(http.StatusOK, &response)
			return
		}
	}
}
*/

func sendIBoF(iBoFRequest model.Request) {
	if !atomic.CompareAndSwapUint32(&locker, stateUnlocked, stateLocked) {
		log.Printf("sendIBoFCLI : %+v", iBoFRequest)
		//api.MakeBadRequest(ctx, 12000)
		return
	}
	defer atomic.StoreUint32(&locker, stateUnlocked)

	b, _ := json.MarshalIndent(iBoFRequest.Param, "", "    ")

	log.Printf("sendIBoFCLI : %+v", iBoFRequest)

	fmt.Println("Request to Poseidon OS")
	fmt.Println("    Rid         : ", iBoFRequest.Rid)
	fmt.Println("    Command     : ", iBoFRequest.Command)
	fmt.Println("    Param       : \n", string(b))

	marshaled, _ := json.Marshal(iBoFRequest)
	err := handler.WriteToIBoFSocket(marshaled)

	if err != nil {
		log.Printf("sendIBoFCLI : %v", err)
		//api.MakeResponse(ctx, 400, error.Error(err), 19002)
		return
	}

	for {
		temp := handler.GetIBoFResponse()
		log.Printf("Response From iBoFCLI : %s", string(temp))

		response := model.Response{}
		err := json.Unmarshal(temp, &response)
		
		fmt.Println("Response from Poseidon OS")
		fmt.Println("    Code        : ", response.Result.Status.Code)
		fmt.Println("    Description : ", response.Result.Status.Description)

		if response.Rid != "timeout" && iBoFRequest.Rid != response.Rid {
			log.Printf("Previous CLI request's response, Wait again")
			continue
		}

		if err != nil {
			log.Printf("Response CLI Unmarshal Error : %v", err)
			//api.MakeResponse(ctx, 400, error.Error(err), 12310)
			return
		} else if response.Result.Status.Code != 0 {
			//api.MakeBadRequest(ctx, response.Result.Status.Code)
			return
		} else {
			//api.MakeSuccessWithRes(ctx, response)
			//ctx.JSON(http.StatusOK, &response)
			return
		}
	}
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
