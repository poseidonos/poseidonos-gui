package v1

import (
	"A-module/routers/mtool/model"
)

func ListArrayDevice(xrId string, param model.ArrayParam) (model.Response, error) {
	return getArray(xrId, "LISTARRAYDEVICE")
}

func LoadArray(xrId string, param model.ArrayParam) (model.Response, error) {
	return getArray(xrId, "LOADARRAY")
}

func CreateArray(xrId string, param model.ArrayParam) (model.Response, error) {
	return postArray(xrId, "CREATEARRAY", param)
}

func DeleteArray(xrId string, param model.ArrayParam) (model.Response, error) {
	return deleteArray(xrId, "DELETEARRAY", param)
}

func postArray(xrId string, command string, param model.ArrayParam) (model.Response, error) {
	iBoFRequest := makeRequest(xrId, command)
	iBoFRequest.Param = param
	return sendIBoF(iBoFRequest)
}

func getArray(xrId string, command string) (model.Response, error) {
	iBoFRequest := makeRequest(xrId, command)
	return sendIBoF(iBoFRequest)
}

func deleteArray(xrId string, command string, param model.ArrayParam) (model.Response, error) {
	iBoFRequest := makeRequest(xrId, command)
	iBoFRequest.Param = param
	return sendIBoF(iBoFRequest)
}
