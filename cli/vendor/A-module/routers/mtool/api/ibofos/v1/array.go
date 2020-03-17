package v1

import (
	"A-module/routers/mtool/model"
)

func ListArrayDevice(rid string, param model.ArrayParam) (model.Response, error) {
	return getArray(rid, "LISTARRAYDEVICE")
}

func LoadArray(rid string, param model.ArrayParam) (model.Response, error) {
	return getArray(rid, "LOADARRAY")
}

func CreateArray(rid string, param model.ArrayParam) (model.Response, error) {
	return postArray(rid, "CREATEARRAY", param)
}

func DeleteArray(rid string, param model.ArrayParam) (model.Response, error) {
	return deleteArray(rid, "DELETEARRAY", param)
}

func postArray(rid string, command string, param model.ArrayParam) (model.Response, error) {
	iBoFRequest := makeRequest(rid, command)
	iBoFRequest.Param = param
	return sendIBoF(iBoFRequest)
}

func getArray(rid string, command string) (model.Response, error) {
	iBoFRequest := makeRequest(rid, command)
	return sendIBoF(iBoFRequest)
}

func deleteArray(rid string, command string, param model.ArrayParam) (model.Response, error) {
	iBoFRequest := makeRequest(rid, command)
	iBoFRequest.Param = param
	return sendIBoF(iBoFRequest)
}
