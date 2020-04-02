package v1

import (
	"A-module/handler"
	"A-module/log"
	"A-module/routers/mtool/model"
	"encoding/json"
	"errors"
	"sync/atomic"
)

const (
	stateUnlocked uint32 = iota
	stateLocked
)

var (
	locker       = stateUnlocked
	errLocked    = errors.New("Locked out buddy")
	ErrBadReq    = errors.New("Bad request")
	ErrSending   = errors.New("Sending error")
	ErrReceiving = errors.New("Receiving error")
	ErrJson      = errors.New("Json error")
	ErrRes       = errors.New("Response error")
)

type Requester struct {
	xrId  string
	param interface{}
}

func (rq Requester) Wbt(command string) (model.Request, model.Response, error) {
	iBoFRequest := model.Request{
		Command: command,
		Rid:     rq.xrId,
	}
	iBoFRequest.Param = rq.param
	res, err := sendIBoF(iBoFRequest)
	return iBoFRequest, res, err
}

func (rq Requester) Post(command string) (model.Request, model.Response, error) {
	iBoFRequest := model.Request{
		Command: command,
		Rid:     rq.xrId,
	}
	iBoFRequest.Param = rq.param
	res, err := sendIBoF(iBoFRequest)
	return iBoFRequest, res, err
}

func (rq Requester) Put(command string) (model.Request, model.Response, error) {
	iBoFRequest := model.Request{
		Command: command,
		Rid:     rq.xrId,
	}
	iBoFRequest.Param = rq.param
	res, err := sendIBoF(iBoFRequest)
	return iBoFRequest, res, err
}

func (rq Requester) Delete(command string) (model.Request, model.Response, error) {
	iBoFRequest := model.Request{
		Command: command,
		Rid:     rq.xrId,
	}
	iBoFRequest.Param = rq.param
	res, err := sendIBoF(iBoFRequest)
	return iBoFRequest, res, err
}

func (rq Requester) Get(command string) (model.Request, model.Response, error) {
	iBoFRequest := model.Request{
		Command: command,
		Rid:     rq.xrId,
	}
	iBoFRequest.Param = rq.param
	res, err := sendIBoF(iBoFRequest)
	return iBoFRequest, res, err
}

func sendIBoF(iBoFRequest model.Request) (model.Response, error) {

	err := handler.ConnectToIBoFOS()

	if err != nil {
		return model.Response{}, err
	}

	defer handler.DisconnectToIBoFOS()

	if !atomic.CompareAndSwapUint32(&locker, stateUnlocked, stateLocked) {
		log.Printf("sendIBoFCLI : %+v", iBoFRequest)
		return model.Response{}, ErrBadReq
	}

	defer atomic.StoreUint32(&locker, stateUnlocked)

	log.Printf("sendIBoFCLI : %+v", iBoFRequest)

	marshaled, _ := json.Marshal(iBoFRequest)
	err = handler.WriteToIBoFSocket(marshaled)

	if err != nil {
		log.Printf("sendIBoFCLI write error : %v", err)
		return model.Response{}, ErrSending
	}

	for {
		temp, err := handler.ReadFromIBoFSocket()

		if err != nil {
			log.Printf("sendIBoFCLI read error : %v", err)
			return model.Response{}, ErrReceiving
		} else {
			log.Printf("Response From iBoFCLI : %s", string(temp))
		}

		response := model.Response{}
		err = json.Unmarshal(temp, &response)

		if response.Rid != "timeout" && iBoFRequest.Rid != response.Rid {
			log.Printf("Previous CLI request's response, Wait again")
			continue
		}

		if err != nil {
			log.Printf("Response CLI Unmarshal Error : %v", err)
			return model.Response{}, ErrJson

		} else if response.Result.Status.Code != 0 {
			return response, ErrRes

		} else {
			//ctx.JSON(http.StatusOK, &response)
			return response, nil
		}
	}

	return model.Response{}, nil
}
