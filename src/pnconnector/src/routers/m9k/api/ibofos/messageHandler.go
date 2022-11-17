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

package ibofos

import (
	"encoding/json"
	"errors"
	"io"
	"pnconnector/src/handler"
	"pnconnector/src/log"
	"pnconnector/src/routers/m9k/model"
	"time"
)

var (
	errLocked    = errors.New("Locked out buddy")
	ErrSending   = errors.New("Sending error")
	ErrReceiving = errors.New("Receiving error")
	ErrJson      = errors.New("Json error")
	ErrRes       = errors.New("Response error")
	ErrConn      = errors.New("iBoF Connection Error")
	ErrJsonType  = errors.New("Json Type Validation Error")
	//mutex        = &sync.Mutex{}
)

type Requester struct {
	xrId      string
	param     interface{}
	paramType interface{}
}

func (rq Requester) Send(command string) (model.Request, model.Response, error) {
	iBoFRequest := model.Request{
		Command: command,
		Rid:     rq.xrId,
	}

	err := CheckJsonType(rq.param, rq.paramType)
	if err != nil {
		return iBoFRequest, model.Response{}, err
	} else {
		iBoFRequest.Param = rq.param
		iBoFRequest.Requester = model.RequesterName
		res, err := sendIBoF(iBoFRequest)
		return iBoFRequest, res, err
	}
}

func CheckJsonType(srcParam interface{}, paramType interface{}) error {
	var err error
	marshalled, _ := json.Marshal(srcParam)

	switch param := paramType.(type) {
	case model.ArrayParam:
		err = json.Unmarshal(marshalled, &param)
	case model.DeviceParam:
		err = json.Unmarshal(marshalled, &param)
	case model.VolumeParam:
		err = json.Unmarshal(marshalled, &param)
	case model.InternalParam:
		err = json.Unmarshal(marshalled, &param)
	case model.SystemParam:
		err = json.Unmarshal(marshalled, &param)
	case model.RebuildParam:
		err = json.Unmarshal(marshalled, &param)
	case model.LoggerParam:
		err = json.Unmarshal(marshalled, &param)
	case model.WBTParam:
		err = json.Unmarshal(marshalled, &param)
	case model.VolumePolicyParam:
		err = json.Unmarshal(marshalled, &param)
	}

	if err != nil {
		log.Debugf("checkJsonType : ", ErrJsonType.Error())
		err = ErrJsonType
	}

	return err
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
		if err != nil && err != io.EOF {
			log.Infof("sendIBoF read error : %v", err)
			return model.Response{}, ErrReceiving
		} else {
			log.Infof("Response From iBoF : %s", string(temp))
		}

		response := model.Response{}
		/*d := json.NewDecoder([]byte(test))

		d.UseNumber()
		if err = d.Decode(&response); err != nil {
			log.Fatal(err)
		}*/
		json.Unmarshal([]byte(temp), &response)
		if iBoFRequest.Command == "LISTVOLUME" {
			listVolRes := model.ListVolumeResponse{}
			json.Unmarshal([]byte(temp), &listVolRes)
			response.Result.Data = listVolRes.RESULT.DATA
		} else if iBoFRequest.Command == "VOLUMEINFO" {
			volInfoRes := model.VolumeInfoResponse{}
			json.Unmarshal([]byte(temp), &volInfoRes)
			response.Result.Data = volInfoRes.RESULT.DATA
		} else if iBoFRequest.Command == "LISTQOSPOLICIES" {
			listQoSRes := model.ListQosResponse{}
			json.Unmarshal([]byte(temp), &listQoSRes)
			response.Result.Data = listQoSRes.RESULT.DATA
		}
		response.LastSuccessTime = time.Now().UTC().Unix()
		return response, nil
	}
}
