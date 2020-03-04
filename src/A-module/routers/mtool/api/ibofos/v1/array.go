package v1

import (
	"A-module/routers/mtool/model"
)

func ListArrayDevice(param model.ArrayParam) (model.Response, error) {
	return getArray("LISTARRAYDEVICE")
}

func LoadArray(param model.ArrayParam) (model.Response, error) {
	return getArray("LOADARRAY")
}

func CreateArray(param model.ArrayParam) (model.Response, error) {
	return postArray("CREATEARRAY", param)
}

func DeleteArray(param model.ArrayParam) (model.Response, error) {
	return deleteArray("DELETEARRAY", param)
}

func postArray(command string, param model.ArrayParam) (model.Response, error) {
	iBoFRequest := makeRequest("", command)
	iBoFRequest.Param = param
	return sendIBoF(iBoFRequest)
}

func getArray(command string) (model.Response, error) {
	iBoFRequest := makeRequest("", command)
	return sendIBoF(iBoFRequest)
}

func deleteArray(command string, param model.ArrayParam) (model.Response, error) {
	iBoFRequest := makeRequest("", command)
	iBoFRequest.Param = param
	return sendIBoF(iBoFRequest)
}
