package v1

import (
	"A-module/routers/mtool/model"
)

func WBTTest(xrId string, param model.WBTParam) (model.Response, error) {
	return postWBTTest(xrId, "WBT", param)
}

func WBTList(xrId string, param model.WBTParam) (model.Response, error) {
	return postWBTTest(xrId, "LISTWBT", param)
}

func postWBTTest(xrId string, command string, param model.WBTParam) (model.Response, error) {
	iBoFRequest := makeRequest(xrId, command)

	if param != (model.WBTParam{}) {
		iBoFRequest.Param = param
	}

	return sendIBoF(iBoFRequest)
}
