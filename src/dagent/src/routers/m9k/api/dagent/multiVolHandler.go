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
	"bytes"
	"dagent/src/routers/m9k/header"
	"encoding/json"
	"github.com/gin-gonic/gin"
	"github.com/gin-gonic/gin/binding"
	"github.com/google/uuid"
	"io/ioutil"
	"net/http"
	"pnconnector/src/log"
	iBoFOS "pnconnector/src/routers/m9k/api/ibofos"
	"pnconnector/src/routers/m9k/model"
	"pnconnector/src/util"
	"strconv"
	"time"
)

const (
	CREATE_VOLUME        = "CREATEVOLUME"
	MOUNT_VOLUME         = "MOUNTVOLUME"
	SINGLE_VOLUME_COUNT  = 1
	AUTHORIZATION_HEADER = "Authorization"
	CALLBACK_IP          = "127.0.0.1"
	CALLBACK_PORT        = "5000"
	CONTENT_TYPE         = "application/json"
	CALLBACK_URL         = "http://" + CALLBACK_IP + ":" + CALLBACK_PORT + "/api/v1.0/multi_vol_response/"
	MAX_RETRY_COUNT      = 5
	POST                 = "POST"
	POS_API_ERROR        = 11040
	COUNT_EXCEEDED_ERROR = 11050
	ARRAY_UNMOUNT_ERROR  = 2090
	DELAY                = 50 * time.Millisecond
	MAX_VOLS_COUNT       = 256
)

var (
	CreateVolumeMutex  bool = false
	MountVolumeMutex   bool = false
	CreateVolResponses []model.Response
	MountVolResponses  []model.Response
	CreateVolPassCount int = 0
	MountVolPassCount  int = 0
)

func callbackMethod(Buffer []model.Response, Auth string, PassCount int, totalCount int) {
	responseData := &model.CallbackMultiVol{
		TotalCount:    totalCount,
		Pass:          PassCount,
		Fail:          totalCount - PassCount,
		MultiVolArray: Buffer,
	}
	for retryCount := 1; retryCount < MAX_RETRY_COUNT; retryCount = retryCount + 1 {
		bytesRepresentation, err := json.Marshal(responseData)
		if err != nil {
			log.Error(err)
			continue
		}
		//Create Request Object
		req, _ := http.NewRequest(
			POST,
			CALLBACK_URL,
			bytes.NewBuffer(bytesRepresentation),
		)
		//Add Request Header
		req.Header.Add(AUTHORIZATION_HEADER, Auth)
		res, err := http.DefaultClient.Do(req)
		if err != nil {
			log.Error(err)
			continue
		}

		// read response body
		data, _ := ioutil.ReadAll(res.Body)

		// close response body
		res.Body.Close()

		// print response status and body
		log.Infof("status: %d\n", res.StatusCode)
		log.Infof("body: %s\n", data)
		break
	}
}

/*
  createVolumeWrite function tries to create the volumes and mount them. For each Volume the following steps are done
  1. Call the create Volume API
  2. If Create VOlume Succeeds, go to step 4
  3. If Create Volume fails, Try MAX_RETRY_COUNT times. If it still fails, move to next volume and Start from step 1
  4. If MountAll parameter is true, Call the Mount Volume API
  5. If Mount Volume fails, try MAX_RETRY_COUNT times. If it still fails, move to next voluem and Start from Step 1
*/
func createVolumeWrite(CreateVolCh chan model.Response, ctx *gin.Context, volParam *model.VolumeParam) {
	volId := volParam.NameSuffix
	volName := volParam.Name
	//	var volList []model.Volume{}
	var volList []interface{}
	for volItr := 0; volItr < int(volParam.TotalCount); volItr, volId = volItr+1, volId+1 {
		posErr := false
		volParam.Name = volName + strconv.Itoa(int(volId))

		// Retry Create Volume API if the API fails
		for createItr := 1; createItr <= MAX_RETRY_COUNT; createItr = createItr + 1 {

			// Call the API after a delay
			time.Sleep(DELAY)
			_, res, err := iBoFOS.CreateVolume(header.XrId(ctx), *volParam)
			// If Create Volume API fails, retry
			if err != nil || res.Result.Status.Code != 0 {
				if createItr == MAX_RETRY_COUNT {
					posDescription := res.Result.Status.Description
					res.Result.Status, _ = util.GetStatusInfo(res.Result.Status.Code)
					res.Result.Status.PosDescription = posDescription
					CreateVolCh <- res
					posErr = true
				}
				continue
			}
			CreateVolCh <- res
			if posErr {
				break
			}

			// if MountAll parameter is true, mount the volume
			if volParam.MountAll {
				// Retry Mount Volume API if it fails
				for mountItr := 1; mountItr <= MAX_RETRY_COUNT; mountItr = mountItr + 1 {
					time.Sleep(DELAY)
					paramMap := make(map[string]interface{})
					paramMap["name"] = volParam.Name
					paramMap["array"] = volParam.Array
					paramMap["subnqn"] = volParam.SubNQN
					paramMap["size"] = volParam.Size
					paramMap["transport_type"] = volParam.TRANSPORTTYPE
					paramMap["target_address"] = volParam.TARGETADDRESS
					paramMap["transport_service_id"] = volParam.TRANSPORTSERVICEID
					if volParam.TRANSPORTTYPE == "" || volParam.TARGETADDRESS == "" || volParam.TRANSPORTSERVICEID == "" {
						_, res, err = iBoFOS.MountVolume(header.XrId(ctx), *volParam)
					} else {
						_, res, err = iBoFOS.MountVolumeWithSubSystem(header.XrId(ctx), paramMap)
					}
					if err != nil || res.Result.Status.Code != 0 {
						if mountItr == MAX_RETRY_COUNT {
							posErr = true
							CreateVolCh <- res
						}
						continue
					}
					CreateVolCh <- res
					break
				}
			}
			volume := make(map[string]string)
			volume["volumeName"] = volParam.Name
			volList = append(volList, volume)
			break

		}

		if !posErr {
			CreateVolPassCount++
		} else if volParam.StopOnError {
			break
		}
	}
	qosParam := make(map[string]interface{})
	qosParam["array"] = volParam.Array
	qosParam["maxiops"] = volParam.Maxiops
	qosParam["maxbw"] = volParam.Maxbw
	qosParam["vol"] = volList
	if volParam.Minbw == 0 && volParam.Miniops == 0 {
		qosParam["minbw"] = 0
	} else if volParam.Minbw > 0 {
		qosParam["minbw"] = volParam.Minbw
	} else {
		qosParam["miniops"] = volParam.Miniops
	}
	_, qosResp, _ := iBoFOS.QOSCreateVolumePolicies(header.XrId(ctx), qosParam)
	CreateVolCh <- qosResp
	close(CreateVolCh)

}

func createVolumeRead(CreateVolCh chan model.Response, Auth string, totalCount int) {
	for {
		res, ok := <-CreateVolCh
		if ok == false {
			log.Info("Channel Close ", ok)
			break
		}
		log.Info("channel open")
		CreateVolResponses = append(CreateVolResponses, res)
	}
	CreateVolumeMutex = false
	callbackMethod(CreateVolResponses, Auth, CreateVolPassCount, totalCount)
	CreateVolResponses = nil
	CreateVolPassCount = 0
}

func mountVolumeWrite(MountVolCh chan model.Response, ctx *gin.Context, f func(string, interface{}) (model.Request, model.Response, error), volParam *model.VolumeParam) {
	volId := volParam.NameSuffix
	volName := volParam.Name
	for volItr := 0; volItr < int(volParam.TotalCount); volItr, volId = volItr+1, volId+1 {
		volParam.Name = volName + strconv.Itoa(int(volId))
		_, res, err := f(header.XrId(ctx), *volParam)
		MountVolCh <- res
		if err != nil || res.Result.Status.Code != 0 {
			if volParam.StopOnError == true {
				break
			}
		} else {
			MountVolPassCount++
		}
	}
	close(MountVolCh)

}

func mountVolumeRead(MountVolCh chan model.Response, Auth string, totalCount int) {
	for {
		res, ok := <-MountVolCh
		if ok == false {
			log.Info("Channel Close ", ok)
			break
		}
		MountVolResponses = append(MountVolResponses, res)
	}
	MountVolumeMutex = false
	callbackMethod(MountVolResponses, Auth, MountVolPassCount, totalCount)
	MountVolResponses = nil
	MountVolPassCount = 0
}

func IsMultiVolume(ctx *gin.Context) (model.VolumeParam, bool) {
	req := model.Request{}
	ctx.ShouldBindBodyWith(&req, binding.JSON)
	marshalled, _ := json.Marshal(req.Param)
	volParam := model.VolumeParam{}
	err := json.Unmarshal(marshalled, &volParam)
	if err != nil {
		log.Info("Unmarshalling Error in Implement Async multi volume function: %v", err)
	}
	if volParam.TotalCount > SINGLE_VOLUME_COUNT {
		return volParam, true
	} else {
		return volParam, false
	}
}

func maxCountExceeded(count int, array string) (int, bool) {
	param := model.VolumeParam{Array: array}
	listXrid, _ := uuid.NewUUID()
	//countXrid, _ := uuid.NewUUID()
	_, volList, err := iBoFOS.ListVolume(listXrid.String(), param)
	//_, volMaxCount, err := iBoFOS.GetMaxVolumeCount(countXrid.String(), param)
	if err != nil {
		return POS_API_ERROR, true
	}
	volCount := 0
	maxCount := MAX_VOLS_COUNT
	/*if volList.Info.(map[string]interface{})["state"].(string) != "NORMAL" {
		return 12090, true
	}*/
	if volList.Result.Data != nil {
		volumes := volList.Result.Data.(model.ListVolumeResData).VOLUMELIST
		volCount = len(volumes)
	}
	/*maxCount, err = strconv.Atoi(volMaxCount.Result.Data.(map[string]interface{})["max volume count per Array"].(string))
	if err != nil {
		return POS_API_ERROR, true
	}*/
	if count <= (maxCount - volCount) {
		return 0, false
	}
	return COUNT_EXCEEDED_ERROR, true
}
func checkArrayExist(array string) (int, bool) {
	param := model.ArrayParam{Name: array}
	listXrid, _ := uuid.NewUUID()
	_, resp, err := iBoFOS.ArrayInfo(listXrid.String(), param)
	if err != nil {
		return POS_API_ERROR, true
	}
	if resp.Result.Status.Code != 0 {
		return resp.Result.Status.Code, true
	}
	if resp.Result.Data.(map[string]interface{})["state"] == "OFFLINE" {
		return ARRAY_UNMOUNT_ERROR, true
	}
	return 0, false
}
func ImplementAsyncMultiVolume(ctx *gin.Context, f func(string, interface{}) (model.Request, model.Response, error), volParam *model.VolumeParam, command string) {
	res := model.Response{}
	res.Result.Status, _ = util.GetStatusInfo(10202)
	if volParam.Name == "" {
		res.Result.Status, _ = util.GetStatusInfo(2020)
		ctx.AbortWithStatusJSON(http.StatusBadRequest, &res)
		return
	}

	if status, ok := checkArrayExist(volParam.Array); ok {
		res.Result.Status, _ = util.GetStatusInfo(status)
		ctx.AbortWithStatusJSON(http.StatusServiceUnavailable, &res)
		return
	}

	if status, ok := maxCountExceeded(int(volParam.TotalCount), volParam.Array); ok {
		res.Result.Status, _ = util.GetStatusInfo(status)
		ctx.AbortWithStatusJSON(http.StatusServiceUnavailable, &res)
		return
	}

	if (command == CREATE_VOLUME && CreateVolumeMutex) || (command == MOUNT_VOLUME && MountVolumeMutex) {
		res.Result.Status, _ = util.GetStatusInfo(11030)
		ctx.AbortWithStatusJSON(http.StatusServiceUnavailable, &res)
		return
	}

	switch command {
	case CREATE_VOLUME:
		if CreateVolumeMutex == false {
			CreateVolCh := make(chan model.Response)
			CreateVolumeMutex = true
			go createVolumeWrite(CreateVolCh, ctx, volParam)
			go createVolumeRead(CreateVolCh, ctx.Request.Header.Get(AUTHORIZATION_HEADER), int(volParam.TotalCount))
		}
	case MOUNT_VOLUME: //Optional Functionality for MTool
		if MountVolumeMutex == false {
			MountVolCh := make(chan model.Response)
			MountVolumeMutex = true
			go mountVolumeWrite(MountVolCh, ctx, f, volParam)
			go mountVolumeRead(MountVolCh, ctx.Request.Header.Get(AUTHORIZATION_HEADER), int(volParam.TotalCount))
		}
	}
	//Pending Request 202
	ctx.AbortWithStatusJSON(http.StatusAccepted, &res)
}
