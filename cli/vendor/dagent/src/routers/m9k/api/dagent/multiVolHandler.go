package dagent

import (
	"a-module/log"
	iBoFOS "a-module/routers/m9k/api/ibofos"
	"a-module/routers/m9k/model"
	"bytes"
	"dagent/src/routers/m9k/header"
	"encoding/json"
	"github.com/gin-gonic/gin"
	"github.com/gin-gonic/gin/binding"
	"io/ioutil"
	"net/http"
	"strconv"
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
	REQUEST_PENDING      = "REQUEST PENDING"
	MAX_RETRY_COUNT      = 5
	PENDING_STATUS_CODE  = 999
	POST                 = "POST"
)

var (
	CreateVolumeMutex  bool = false
	MountVolumeMutex   bool = false
	CreateVolResponses []model.Response
	MountVolResponses  []model.Response
	CreateVolPassCount int = 0
	MountVolPassCount  int = 0
)

func callbackMethod(Buffer []model.Response, Auth string, PassCount int) {
	responseData := &model.CallbackMultiVol{
		TotalCount:    len(Buffer),
		Pass:          PassCount,
		Fail:          len(Buffer) - PassCount,
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

func createVolumeWrite(CreateVolCh chan model.Response, ctx *gin.Context, volParam *model.VolumeParam) {
	volId := volParam.NameSuffix
	volName := volParam.Name
	for volItr := 0; volItr < int(volParam.TotalCount); volItr, volId = volItr+1, volId+1 {
		volParam.Name = volName + strconv.Itoa(int(volId))
		_, res, err := iBoFOS.CreateVolume(header.XrId(ctx), *volParam)
		if err == nil && res.Result.Status.Code == 0 && volParam.MountAll == true {
			_, res, err = iBoFOS.MountVolume(header.XrId(ctx), *volParam)
		}
		CreateVolCh <- res
		if err != nil || res.Result.Status.Code != 0 {
			if volParam.StopOnError == true {
				break
			}
		} else {
			CreateVolPassCount++
		}
	}
	close(CreateVolCh)

}

func createVolumeRead(CreateVolCh chan model.Response, Auth string) {
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
	callbackMethod(CreateVolResponses, Auth, CreateVolPassCount)
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

func mountVolumeRead(MountVolCh chan model.Response, Auth string) {
	for {
		res, ok := <-MountVolCh
		if ok == false {
			log.Info("Channel Close ", ok)
			break
		}
		MountVolResponses = append(MountVolResponses, res)
	}
	MountVolumeMutex = false
	callbackMethod(MountVolResponses, Auth, MountVolPassCount)
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
		log.Fatalf("Unmarshalling Error in Implement Async multi volume function: %v", err)
	}
	if volParam.TotalCount > SINGLE_VOLUME_COUNT {
		return volParam, true
	} else {
		return volParam, false
	}
}

func ImplementAsyncMultiVolume(ctx *gin.Context, f func(string, interface{}) (model.Request, model.Response, error), volParam *model.VolumeParam, command string) {
	response := model.Response{}
	response.Result.Status.Code = PENDING_STATUS_CODE //PENDING
	response.Result.Status.Description = REQUEST_PENDING
	if (command == CREATE_VOLUME && CreateVolumeMutex) || (command == MOUNT_VOLUME && MountVolumeMutex) {
		ctx.AbortWithStatusJSON(http.StatusServiceUnavailable, &response)
		return
	}
	switch command {
	case CREATE_VOLUME:
		if CreateVolumeMutex == false {
			CreateVolCh := make(chan model.Response)
			CreateVolumeMutex = true
			go createVolumeWrite(CreateVolCh, ctx, volParam)
			go createVolumeRead(CreateVolCh, ctx.Request.Header.Get(AUTHORIZATION_HEADER))
		}
	case MOUNT_VOLUME: //Optional Functionality for MTool
		if MountVolumeMutex == false {
			MountVolCh := make(chan model.Response)
			MountVolumeMutex = true
			go mountVolumeWrite(MountVolCh, ctx, f, volParam)
			go mountVolumeRead(MountVolCh, ctx.Request.Header.Get(AUTHORIZATION_HEADER))
		}
	}
	//Pending Request 202
	ctx.AbortWithStatusJSON(http.StatusAccepted, &response)
}
