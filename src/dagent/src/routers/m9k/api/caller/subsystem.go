package caller

import (
	"dagent/src/routers/m9k/globals"
	"encoding/json"
	"google.golang.org/protobuf/encoding/protojson"
	pb "kouros/api"
	"kouros/log"
	"kouros/model"
	pos "kouros/pos"
	"kouros/utils"
	"strconv"
)

func CallListListener(xrId string, param interface{}, posMngr pos.POSManager) (model.Response, error) {
	var paramStruct pb.ListListenerRequest_Param
	pByte, err := json.Marshal(param)
	if err != nil {
		log.Errorf(marshalErrMsg, GetFuncName(1), err)
		return model.Response{}, ErrJson
	}
	if err = json.Unmarshal(pByte, &paramStruct); err != nil {
		log.Errorf(unmarshalErrMsg, GetFuncName(1), err)
		return model.Response{}, ErrJson
	}
	result, _, err1 := posMngr.ListListener(&paramStruct)
	if err1 != nil {
		log.Errorf(commandFailureMsg, GetFuncName(1), err1)
		return model.Response{}, ErrConn
	}
	resByte, err2 := protojson.Marshal(result)
	return HandleResponse(resByte, err2)

}

func CallAddListener(xrId string, param interface{}, posMngr pos.POSManager) (model.Response, error) {
	var paramStruct pb.AddListenerRequest_Param
	pByte, err := json.Marshal(param)
	if err != nil {
		log.Errorf(marshalErrMsg, GetFuncName(1), err)
		return model.Response{}, ErrJson
	}
	if err = json.Unmarshal(pByte, &paramStruct); err != nil {
		log.Errorf(unmarshalErrMsg, GetFuncName(1), err)
		return model.Response{}, ErrJson
	}
	result, _, err1 := posMngr.AddListener(&paramStruct)
	if err1 != nil {
		log.Errorf(commandFailureMsg, GetFuncName(1), err1)
		return model.Response{}, ErrConn
	}
	resByte, err2 := protojson.Marshal(result)
	return HandleResponse(resByte, err2)

}

func CallDeleteListener(xrId string, param interface{}, posMngr pos.POSManager) (model.Response, error) {
	var paramStruct pb.RemoveListenerRequest_Param
	pByte, err := json.Marshal(param)
	if err != nil {
		log.Errorf(marshalErrMsg, GetFuncName(1), err)
		return model.Response{}, ErrJson
	}
	if err = json.Unmarshal(pByte, &paramStruct); err != nil {
		log.Errorf(unmarshalErrMsg, GetFuncName(1), err)
		return model.Response{}, ErrJson
	}
	result, _, err1 := posMngr.RemoveListener(&paramStruct)
	if err1 != nil {
		log.Errorf(commandFailureMsg, GetFuncName(1), err1)
		return model.Response{}, ErrConn
	}
	resByte, err2 := protojson.Marshal(result)
	return HandleResponse(resByte, err2)

}

func CallCreateSubsystemAuto(xrId string, param interface{}, posMngr pos.POSManager) (model.Response, error) {
	var paramStruct pb.CreateSubsystemRequest_Param
	pByte, err := json.Marshal(param)
	if err != nil {
		log.Errorf(marshalErrMsg, GetFuncName(1), err)
		return model.Response{}, ErrJson
	}
	if err = json.Unmarshal(pByte, &paramStruct); err != nil {
		log.Errorf(unmarshalErrMsg, GetFuncName(1), err)
		return model.Response{}, ErrJson
	}
	result, _, err1 := posMngr.CreateSubsystemAuto(&paramStruct)
	if err1 != nil {
		log.Errorf(commandFailureMsg, GetFuncName(1), err1)
		return model.Response{}, ErrConn
	}
	resByte, err2 := protojson.Marshal(result)
	return HandleResponse(resByte, err2)

}

func CallCreateSubsystem(xrId string, param interface{}, posMngr pos.POSManager) (model.Response, error) {
	var paramStruct pb.CreateSubsystemRequest_Param
	pByte, err := json.Marshal(param)
	if err != nil {
		log.Errorf(marshalErrMsg, GetFuncName(1), err)
		return model.Response{}, ErrJson
	}
	if err = json.Unmarshal(pByte, &paramStruct); err != nil {
		log.Errorf(unmarshalErrMsg, GetFuncName(1), err)
		return model.Response{}, ErrJson
	}
	result, _, err1 := posMngr.CreateSubsystem(&paramStruct)
	if err1 != nil {
		log.Errorf(commandFailureMsg, GetFuncName(1), err1)
		return model.Response{}, ErrConn
	}
	resByte, err2 := protojson.Marshal(result)
	return HandleResponse(resByte, err2)

}

func CallCreateTransport(xrId string, param interface{}, posMngr pos.POSManager) (model.Response, error) {
	var paramStruct pb.CreateTransportRequest_Param
	res := model.Response{}
	_, ok := param.(map[string]interface{})["transportType"].(string)
	if !ok {
		res.Result.Status, _ = utils.GetStatusInfo(1859)
		return res, nil
	}
	numValue, ok := param.(map[string]interface{})["numSharedBuf"].(json.Number)
	numSharedBuf, _ := strconv.Atoi(numValue.String())
	// Below range check is temporary code, DAgent is client of POS server. Ideally this range check condition should be present in POS server.
	if !ok {
		res.Result.Status, _ = utils.GetStatusInfo(1859)
		return res, nil

	} else if numSharedBuf < 1 || numSharedBuf > globals.NumSharedBufRange {
		res.Result.Status, _ = utils.GetStatusInfo(1859)
		return res, nil
	}
	cacheValue, ok := param.(map[string]interface{})["bufCacheSize"].(json.Number)
	bufCacheSize, _ := strconv.Atoi(cacheValue.String())
	if !ok {
		res.Result.Status, _ = utils.GetStatusInfo(1859)
		return res, nil
	} else if bufCacheSize < 1 || bufCacheSize > globals.NumSharedBufRange {
		res.Result.Status, _ = utils.GetStatusInfo(1859)
		return res, nil
	}
	pByte, err := json.Marshal(param)
	if err != nil {
		log.Errorf(marshalErrMsg, GetFuncName(1), err)
		return model.Response{}, ErrJson
	}
	if err = json.Unmarshal(pByte, &paramStruct); err != nil {
		log.Errorf(unmarshalErrMsg, GetFuncName(1), err)
		return model.Response{}, ErrJson
	}
	result, _, err1 := posMngr.CreateTransport(&paramStruct)
	if err1 != nil {
		log.Errorf(commandFailureMsg, GetFuncName(1), err1)
		return model.Response{}, ErrConn
	}
	resByte, err2 := protojson.Marshal(result)
	return HandleResponse(resByte, err2)

}

func CallListTransport(xrId string, param interface{}, posMngr pos.POSManager) (model.Response, error) {
	result, _, err1 := posMngr.ListTransport()
	if err1 != nil {
		log.Errorf(commandFailureMsg, GetFuncName(1), err1)
		return model.Response{}, ErrConn
	}
	resByte, err2 := protojson.Marshal(result)
	return HandleResponse(resByte, err2)
}

func CallDeleteSubsystem(xrId string, param interface{}, posMngr pos.POSManager) (model.Response, error) {
	var paramStruct pb.DeleteSubsystemRequest_Param
	pByte, err := json.Marshal(param)
	if err != nil {
		log.Errorf(marshalErrMsg, GetFuncName(1), err)
		return model.Response{}, ErrJson
	}
	if err = json.Unmarshal(pByte, &paramStruct); err != nil {
		log.Errorf(unmarshalErrMsg, GetFuncName(1), err)
		return model.Response{}, ErrJson
	}
	result, _, err1 := posMngr.DeleteSubsystem(&paramStruct)
	if err1 != nil {
		log.Errorf(commandFailureMsg, GetFuncName(1), err1)
		return model.Response{}, ErrConn
	}
	resByte, err2 := protojson.Marshal(result)
	return HandleResponse(resByte, err2)

}

func CallSubsystemInfo(xrId string, param interface{}, posMngr pos.POSManager) (model.Response, error) {
	var paramStruct pb.SubsystemInfoRequest_Param
	pByte, err := json.Marshal(param)
	if err != nil {
		log.Errorf(marshalErrMsg, GetFuncName(1), err)
		return model.Response{}, ErrJson
	}
	if err = json.Unmarshal(pByte, &paramStruct); err != nil {
		log.Errorf(unmarshalErrMsg, GetFuncName(1), err)
		return model.Response{}, ErrJson
	}
	result, _, err1 := posMngr.SubsystemInfo(&paramStruct)
	if err1 != nil {
		log.Errorf(commandFailureMsg, GetFuncName(1), err1)
		return model.Response{}, ErrConn
	}
	resByte, err2 := protojson.Marshal(result)
	return HandleResponse(resByte, err2)
}

func CallListSubsystem(xrId string, param interface{}, posMngr pos.POSManager) (model.Response, error) {
	result, _, err1 := posMngr.ListSubsystem()
	if err1 != nil {
		log.Errorf(commandFailureMsg, GetFuncName(1), err1)
		return model.Response{}, ErrConn
	}
	resByte, err2 := protojson.Marshal(result)
	return HandleResponse(resByte, err2)
}
