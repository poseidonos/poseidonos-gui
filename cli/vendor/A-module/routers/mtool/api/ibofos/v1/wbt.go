package v1

import (
	"A-module/routers/mtool/model"
)

func WBTTest(param model.WBTParam) (model.Response, error) {
	return postWBTTest("WBT", param)
}

func postWBTTest(command string, param model.WBTParam) (model.Response, error) {
	iBoFRequest := makeRequest("", command)
	iBoFRequest.Param = param
	return sendIBoF(iBoFRequest)
}
