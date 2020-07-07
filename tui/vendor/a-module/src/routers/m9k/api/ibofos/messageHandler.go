package ibofos

import (
	"a-module/src/handler"
	"a-module/src/log"
	"a-module/src/routers/m9k/model"
	"bytes"
	"encoding/json"
	"errors"
	"sync"
	"time"
)

const (
	stateUnlocked uint32 = iota
	stateLocked
)

var (
	locker       = stateUnlocked
	errLocked    = errors.New("Locked out buddy")
	ErrSending   = errors.New("Sending error")
	ErrReceiving = errors.New("Receiving error")
	ErrJson      = errors.New("Json error")
	ErrRes       = errors.New("Response error")
	ErrConn      = errors.New("iBoF Connection Error")
	mutex        = &sync.Mutex{}
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
	conn, err := handler.ConnectToIBoFOS()
	if err != nil {
		return model.Response{}, ErrConn
	}
	defer handler.DisconnectToIBoFOS(conn)

	log.Infof("sendIBoF : %+v", iBoFRequest)

	marshaled, _ := json.Marshal(iBoFRequest)
	err = handler.WriteToIBoFSocket(conn, marshaled)

	if err != nil {
		log.Infof("sendIBoF write error : %v", err)
		return model.Response{}, ErrSending
	}

	for {
		temp, err := handler.ReadFromIBoFSocket(conn)

		if err != nil {
			log.Infof("sendIBoF read error : %v", err)
			return model.Response{}, ErrReceiving
		} else {
			log.Infof("Response From iBoF : %s", string(temp))
		}

		response := model.Response{}

		d := json.NewDecoder(bytes.NewBuffer(temp))
		d.UseNumber()

		if err = d.Decode(&response); err != nil {
			log.Fatal(err)
		}

		if err != nil {
			log.Infof("Response Unmarshal Error : %v", err)
			return model.Response{}, ErrJson
		} else {
			response.LastSuccessTime = time.Now().UTC().Unix()
			return response, nil
		}
	}
}
