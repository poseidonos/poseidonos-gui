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
package dagent

import (
	"errors"
	iBoFOS "pnconnector/src/routers/m9k/api/ibofos"
	"pnconnector/src/routers/m9k/model"
	"pnconnector/src/util"
	"syscall"
	"time"
)

var GitCommit string
var BuildTime string

var LastSuccessTime int64

const MAXAGE int64 = 4 // 4sec

func HeartBeat(xrId string, param interface{}) (model.Response, error) {
	var err error
	var res model.Response
	successTime := updateSuccessTime(xrId)

	if successTime <= 0 {
		err = errors.New("one of iBoF service is dead")
		res.Result.Status, _ = util.GetStatusInfo(12010)
	} else {
		LastSuccessTime = successTime
		res.Result.Status, _ = util.GetStatusInfo(0)
	}

	res.LastSuccessTime = LastSuccessTime
	return res, err
}

func updateSuccessTime(xrId string) int64 {
	if LastSuccessTime+MAXAGE < time.Now().UTC().Unix() {
		param := model.DeviceParam{}
		_, res, _ := iBoFOS.IBoFOSInfo(xrId, param)
		return res.LastSuccessTime
	} else {
		return LastSuccessTime
	}
}

func KillDAgent(xrId string, param interface{}) (model.Response, error) {
	res := model.Response{}
	res.Result.Status.Code = 0
	syscall.Kill(syscall.Getpid(), syscall.SIGINT)
	return res, nil
}

func Version(xrId string, param interface{}) (model.Response, error) {
	buildInfo := model.BuildInfo{GitHash: GitCommit, BuildTime: BuildTime}
	res := model.Response{}
	res.Result.Data = buildInfo

	if GitCommit == "" || BuildTime == "" {
		res.Result.Status.Code = 12020
	} else {
		res.Result.Status.Code = 0
	}
	return res, nil
}
