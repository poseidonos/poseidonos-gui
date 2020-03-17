package v1

import (
	"A-module/routers/mtool/model"
)

func WBTTest(rid string, param model.WBTParam) (model.Response, error) {
	return postWBTTest(rid, "WBT", param)
}

func postWBTTest(rid string, command string, param model.WBTParam) (model.Response, error) {
	iBoFRequest := makeRequest(rid, command)
	iBoFRequest.Param = param
	return sendIBoF(iBoFRequest)
}
