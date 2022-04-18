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
	"fmt"
	"os"
	"path/filepath"
	"pnconnector/src/log"
	"pnconnector/src/routers/m9k/model"
	"pnconnector/src/setting"
	"pnconnector/src/util"
	"time"
)

func ExitiBoFOS(xrId string, param interface{}) (model.Request, model.Response, error) {
	return SystemSender(xrId, param, "STOPPOS")
}

func UpdateResponse(response model.Response, res *model.Response, opName string, errorInfoList *[]map[string]interface{}) {
	info := make(map[string]interface{})
	info["id"] = opName
	info["code"] = response.Result.Status.Code
	info["description"] = response.Result.Status.Description
	*errorInfoList = append(*errorInfoList, info)
}

func transport(xrId string, config setting.HostConf, res *model.Response, opName string, errorInfoList *[]map[string]interface{}) {
	subsystemParam := model.SubSystemParam{}
	subsystemParam.TRANSPORTTYPE = config.TransportType
	subsystemParam.BUFCACHESIZE = config.BufCacheSize
	subsystemParam.NUMSHAREDBUF = config.NumSharedBuf
	//create Transport
	_, response, _ := CreateTransport(xrId, subsystemParam)
	UpdateResponse(response, res, opName, errorInfoList)

}

func subSystem(xrId string, config setting.HostConf, res *model.Response, name string, opName string, errorInfoList *[]map[string]interface{}) {
	subsystemParam := model.SubSystemParam{}
	subsystemParam.SUBNQN = name
	subsystemParam.SERIAL = config.Serial
	subsystemParam.MODEL = config.Model
	subsystemParam.MAXNAMESPACES = config.MaxNameSpaces
	subsystemParam.ALLOWANYHOST = config.AllowAnyHost

	_, response, _ := CreateSubSystem(xrId, subsystemParam)
	//update response
	UpdateResponse(response, res, opName, errorInfoList)

}
func listener(xrId string, config setting.HostConf, res *model.Response, name string, opName string, errorInfoList *[]map[string]interface{}) {
	subsystemParam := model.SubSystemParam{}
	subsystemParam.SUBNQN = name
	subsystemParam.TRANSPORTTYPE = config.TransportType
	subsystemParam.TARGETADDRESS = config.TargetAddress
	subsystemParam.TRANSPORTSERVICEID = config.TransportServiceId
	_, response, _ := AddListener(xrId, subsystemParam)
	//update response
	UpdateResponse(response, res, opName, errorInfoList)

}
func uramDevice(xrId string, config setting.HostConf, res *model.Response, name string, opName string, errorInfoList *[]map[string]interface{}) {
	deviceParam := model.CreateDeviceReqParam{}
	deviceParam.DEVICENAME = name
	deviceParam.NUMBLOCKS = config.NumBlocks
	deviceParam.BLOCKSIZE = config.BlockSize
	deviceParam.DEVICETYPE = config.DevType
	deviceParam.NUMA = config.Numa
	_, response, _ := CreateDevice(xrId, deviceParam)
	//update response
	response.Result.Status.Description = name + ": " + response.Result.Status.Description
	UpdateResponse(response, res, opName, errorInfoList)

}
func RuniBoFOS(xrId string, param interface{}) (model.Request, model.Response, error) {
	errorInfo := make(map[string]interface{})
	errorInfoList := []map[string]interface{}{}
	iBoFRequest := model.Request{
		Command: "RUNIBOFOS",
		Rid:     xrId,
	}

	iBoFRequest.Param = param
	res := model.Response{}
	_, pathErr := os.Stat("/usr/local/bin/poseidonos")
	if os.IsNotExist(pathErr) {
		res.Result.Status.Code = 11001
		return iBoFRequest, res, pathErr
	}
	path, _ := filepath.Abs(filepath.Dir(os.Args[0]))
	cmd := fmt.Sprintf("/../script/run_remote_ibofos.sh %s", setting.Config.Server.IBoF.IP)
	err := util.ExecCmd(path+cmd, false)

	if err != nil {
		res.Result.Status.Code = 11000
	} else {
		res.Result.Status.Code = 0
		res.LastSuccessTime = time.Now().UTC().Unix()
	}

	log.Info("RuniBoFOS result : ", res.Result.Status.Code)
	if res.Result.Status.Code == 0 {
		config := setting.Config.Server.IBoF
		errorCode := 0
		transport(xrId, config, &res, "transport", &errorInfoList)
		subSystem(xrId, config, &res, config.Subsystem_1, "subSystem1", &errorInfoList)
		subSystem(xrId, config, &res, config.Subsystem_2, "subSystem2", &errorInfoList)
		listener(xrId, config, &res, config.Subsystem_1, "addListener1", &errorInfoList)
		listener(xrId, config, &res, config.Subsystem_2, "addListener2", &errorInfoList)
		uramDevice(xrId, config, &res, config.Uram1, "uram1", &errorInfoList)
		uramDevice(xrId, config, &res, config.Uram2, "uram2", &errorInfoList)
		for itr := 0; itr < len(errorInfoList); itr++ {
			if errorInfoList[itr]["code"].(int) != 0 {
				errorCode = 1
				break
			}
		}
		errorInfo["errorResponses"] = errorInfoList
		errorInfo["errorCode"] = errorCode
		res.Result.Status.ErrorInfo = errorInfo
	}
	return iBoFRequest, res, err
}

func IBoFOSInfo(xrId string, param interface{}) (model.Request, model.Response, error) {
	return SystemSender(xrId, param, "GETPOSINFO")
}

func IBoFOSVersion(xrId string, param interface{}) (model.Request, model.Response, error) {
	return SystemSender(xrId, param, "GETVERSION")
}

func MountiBoFOS(xrId string, param interface{}) (model.Request, model.Response, error) {
	return SystemSender(xrId, param, "MOUNTIBOFOS")
}

func UnmountiBoFOS(xrId string, param interface{}) (model.Request, model.Response, error) {
	return SystemSender(xrId, param, "UNMOUNTIBOFOS")
}

func SetPOSProperty(xrId string, param interface{}) (model.Request, model.Response, error) {
	return SystemSender(xrId, param, "REBUILDPERFIMPACT")
}

func WBT(xrId string, param interface{}) (model.Request, model.Response, error) {
	return SystemSender(xrId, param, "WBT")
}

func ListWBT(xrId string, param interface{}) (model.Request, model.Response, error) {
	return SystemSender(xrId, param, "LISTWBT")
}

func DoGC(xrId string, param interface{}) (model.Request, model.Response, error) {
	return SystemSender(xrId, param, "DOGC")
}

func DetachDevice(xrId string, param interface{}) (model.Request, model.Response, error) {
	return SystemSender(xrId, param, "DETACHDEVICE")
}

func SystemSender(xrId string, param interface{}, command string) (model.Request, model.Response, error) {
	return Requester{xrId, param, model.SystemParam{}}.Send(command)
}
