package v1

import (
	"encoding/json"
	"github.com/gin-gonic/gin"
	"ibofdagent/server/handler"
	"ibofdagent/server/routers/mtool/api"
	"log"
	"net/http"
	"sync"
)

var mutex = new(sync.Mutex)

func sendWithAsync(ctx *gin.Context, iBoFRequest api.Request) {
	mutex.Lock()
	// ToDO: Impl async logic
	mutex.Unlock()
}

func sendWithSync(ctx *gin.Context, iBoFRequest api.Request) {
	mutex.Lock()

	marshaled, _ := json.Marshal(iBoFRequest)
	response := api.Response{}

	handler.SendIBof(marshaled)

	temp := handler.GetIBoFResponse()
	log.Printf("Response : %s", string(temp))

	err := json.Unmarshal(temp, &response)

	if err != nil {
		log.Printf("Response Unmarshal Error : %v", err)
		response.Result.Status.Code = 10099
		response.Result.Status.Description = error.Error(err)
		ctx.JSON(http.StatusBadRequest, &response)
	} else if response.Result.Status.Code !=0 {
		ctx.JSON(http.StatusBadRequest, &response)
	} else {
		ctx.JSON(http.StatusOK, &response)
	}

	if iBoFRequest.Rid != response.Rid {
		log.Printf("Concurency Error")
		// if it use mutex it might not happen. (Not tested)
		// If happen, re-add disk to iBoFReceiveChan
		// change to sync not channel
	}
	mutex.Unlock()
}

func makeRequest(ctx *gin.Context, command string) api.Request {
	xrId := ctx.GetHeader("X-request-Id")
	request := api.Request{
		Command: command,
		Rid:     xrId,
	}
	return request
}
