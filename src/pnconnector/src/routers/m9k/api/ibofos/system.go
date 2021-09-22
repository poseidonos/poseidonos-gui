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
 *     * Neither the name of Intel Corporation nor the names of its
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
	return systemSender(xrId, param, "EXITIBOFOS")
}

func RuniBoFOS(xrId string, param interface{}) (model.Request, model.Response, error) {
	iBoFRequest := model.Request{
		Command: "RUNIBOFOS",
		Rid:     xrId,
	}

	iBoFRequest.Param = param
	res := model.Response{}

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

	return iBoFRequest, res, err
}

func IBoFOSInfo(xrId string, param interface{}) (model.Request, model.Response, error) {
	return systemSender(xrId, param, "GETPOSINFO")
}

func IBoFOSVersion(xrId string, param interface{}) (model.Request, model.Response, error) {
	return systemSender(xrId, param, "GETVERSION")
}

func MountiBoFOS(xrId string, param interface{}) (model.Request, model.Response, error) {
	return systemSender(xrId, param, "MOUNTIBOFOS")
}

func UnmountiBoFOS(xrId string, param interface{}) (model.Request, model.Response, error) {
	return systemSender(xrId, param, "UNMOUNTIBOFOS")
}

func WBT(xrId string, param interface{}) (model.Request, model.Response, error) {
	return systemSender(xrId, param, "WBT")
}

func ListWBT(xrId string, param interface{}) (model.Request, model.Response, error) {
	return systemSender(xrId, param, "LISTWBT")
}

func DoGC(xrId string, param interface{}) (model.Request, model.Response, error) {
	return systemSender(xrId, param, "DOGC")
}

func DetachDevice(xrId string, param interface{}) (model.Request, model.Response, error) {
	return systemSender(xrId, param, "DETACHDEVICE")
}

func systemSender(xrId string, param interface{}, command string) (model.Request, model.Response, error) {
	return Requester{xrId, param, model.SystemParam{}}.Send(command)
}
