package v1

import (
	"A-module/routers/mtool/model"
)

func ListArrayDevice(xrId string, param model.ArrayParam) (model.Request, model.Response, error) {
	return getArray(xrId, "LISTARRAYDEVICE")
}

func LoadArray(xrId string, param model.ArrayParam) (model.Request, model.Response, error) {
	return getArray(xrId, "LOADARRAY")
}

func CreateArray(xrId string, param model.ArrayParam) (model.Request, model.Response, error) {
	return postArray(xrId, "CREATEARRAY", param)
}

func DeleteArray(xrId string, param model.ArrayParam) (model.Request, model.Response, error) {
	return deleteArray(xrId, "DELETEARRAY", param)
}

func postArray(xrId string, command string, param model.ArrayParam) (model.Request, model.Response, error) {
	iBoFRequest := makeRequest(xrId, command)
	iBoFRequest.Param = param
	res, err := sendIBoF(iBoFRequest)
	return iBoFRequest, res, err
}

func getArray(xrId string, command string) (model.Request, model.Response, error) {
	iBoFRequest := makeRequest(xrId, command)
	res, err := sendIBoF(iBoFRequest)
	return iBoFRequest, res, err
}

func deleteArray(xrId string, command string, param model.ArrayParam) (model.Request, model.Response, error) {
	iBoFRequest := makeRequest(xrId, command)
	iBoFRequest.Param = param
	res, err := sendIBoF(iBoFRequest)
	return iBoFRequest, res, err
}
