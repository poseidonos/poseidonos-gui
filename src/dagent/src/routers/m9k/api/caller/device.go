package caller

import (
	"encoding/json"
	"google.golang.org/protobuf/encoding/protojson"
	pb "kouros/api"
	"kouros/log"
	"kouros/model"
	pos "kouros/pos"
)

func CallListDevices(xrId string, param interface{}, posMngr pos.POSManager) (model.Response, error) {
	result, err1 := posMngr.ListDevices()
	if err1 != nil {
		log.Errorf(commandFailureMsg, GetFuncName(1), err1)
		return model.Response{}, ErrConn
	}
	resByte, err2 := protojson.Marshal(result)
	return HandleResponse(resByte, err2)
}

func CallCreateDevice(xrId string, param interface{}, posMngr pos.POSManager) (model.Response, error) {
	var paramStruct pb.CreateDeviceRequest_Param
	var resp model.Response
	pByte, err := json.Marshal(param)
	if err != nil {
		log.Errorf(marshalErrMsg, GetFuncName(1), err)
		resp.Result.Status.CAUSE = err.Error()
		return resp, ErrJson
	}
	if err = json.Unmarshal(pByte, &paramStruct); err != nil {
		log.Errorf(unmarshalErrMsg, GetFuncName(1), err)
		resp.Result.Status.CAUSE = err.Error()
		return resp, ErrJson
	}
	result, err1 := posMngr.CreateDevice(&paramStruct)
	if err1 != nil {
		log.Errorf(commandFailureMsg, GetFuncName(1), err1)
		resp.Result.Status.CAUSE = err.Error()
		return resp, ErrJson
	}
	resByte, err2 := protojson.Marshal(result)
	return HandleResponse(resByte, err2)
}

func CallScanDevice(xrId string, param interface{}, posMngr pos.POSManager) (model.Response, error) {
	result, err1 := posMngr.ScanDevice()
	if err1 != nil {
		log.Errorf(commandFailureMsg, GetFuncName(1), err1)
		return model.Response{}, ErrConn
	}
	resByte, err2 := protojson.Marshal(result)
	return HandleResponse(resByte, err2)
}

func CallGetDeviceSmartLog(xrId string, param interface{}, posMngr pos.POSManager) (model.Response, error) {
	var paramStruct pb.GetSmartLogRequest_Param
	pByte, err := json.Marshal(param)
	if err != nil {
		log.Errorf(marshalErrMsg, GetFuncName(1), err)
		return model.Response{}, ErrJson
	}
	if err = json.Unmarshal(pByte, &paramStruct); err != nil {
		log.Errorf(unmarshalErrMsg, GetFuncName(1), err)
		return model.Response{}, ErrJson
	}
	result, err1 := posMngr.GetDeviceSmartLog(&paramStruct)
	if err1 != nil {
		log.Errorf(commandFailureMsg, GetFuncName(1), err1)
		return model.Response{}, ErrConn
	}
	resByte, err2 := protojson.Marshal(result)
	return HandleResponse(resByte, err2)
}
