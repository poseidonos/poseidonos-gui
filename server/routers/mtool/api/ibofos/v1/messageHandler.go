package v1

import (
	"encoding/json"
	"errors"
	"github.com/gin-gonic/gin"
	"ibofdagent/server/handler"
	"ibofdagent/server/routers/mtool/api"
	"log"
	"net/http"
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

func sendWithAsync(ctx *gin.Context, iBoFRequest api.Request) {
	// ToDO: Impl async logic
}

func sendWithSync(ctx *gin.Context, iBoFRequest api.Request) {
	if !atomic.CompareAndSwapUint32(&locker, stateUnlocked, stateLocked) {
		api.MakeFailResponse(ctx, 12000)
		return
	}
	defer atomic.StoreUint32(&locker, stateUnlocked)

	marshaled, _ := json.Marshal(iBoFRequest)
	handler.SendIBof(marshaled)

	temp := handler.GetIBoFResponse()
	log.Printf("Response From iBoF : %s", string(temp))

	response := api.Response{}
	err := json.Unmarshal(temp, &response)

	if err != nil {
		log.Printf("Response Unmarshal Error : %v", err)
		response.Result.Status.Code = 12310
		response.Result.Status.Description = error.Error(err)
		ctx.JSON(http.StatusBadRequest, &response)
	} else if response.Result.Status.Code != 0 {
		ctx.JSON(http.StatusBadRequest, &response)
	} else {
		ctx.JSON(http.StatusOK, &response)
	}

	if iBoFRequest.Rid != response.Rid {
		log.Printf("Concurency Error")
	}
}

func makeRequest(ctx *gin.Context, command string) api.Request {
	xrId := ctx.GetHeader("X-request-Id")
	request := api.Request{
		Command: command,
		Rid:     xrId,
	}
	return request
}
