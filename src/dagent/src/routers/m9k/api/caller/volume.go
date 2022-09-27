package caller

import (
	"encoding/json"
	"google.golang.org/protobuf/encoding/protojson"
	pb "kouros/api"
	"kouros/log"
	"kouros/model"
	pos "kouros/pos"
)

func CallCreateVolume(xrId string, param interface{}, posMngr pos.POSManager) (model.Response, error) {
	var paramStruct pb.CreateVolumeRequest_Param
	pByte, err := json.Marshal(param)
	if err != nil {
		log.Errorf(marshalErrMsg, GetFuncName(1), err)
		return model.Response{}, ErrJson
	}
	if err = json.Unmarshal(pByte, &paramStruct); err != nil {
		log.Errorf(unmarshalErrMsg, GetFuncName(1), err)
		return model.Response{}, ErrJson
	}
	result, err1 := posMngr.CreateVolume(&paramStruct)
	if err1 != nil {
		log.Errorf(commandFailureMsg, GetFuncName(1), err1)
		return model.Response{}, ErrConn
	}
	resByte, err2 := protojson.Marshal(result)
	return HandleResponse(resByte, err2)

}

func CallVolumeProperty(xrId string, param interface{}, posMngr pos.POSManager) (model.Response, error) {
	var paramStruct pb.SetVolumePropertyRequest_Param
	pByte, err := json.Marshal(param)
	if err != nil {
		log.Errorf(marshalErrMsg, GetFuncName(1), err)
		return model.Response{}, ErrJson
	}
	if err = json.Unmarshal(pByte, &paramStruct); err != nil {
		log.Errorf(unmarshalErrMsg, GetFuncName(1), err)
		return model.Response{}, ErrJson
	}
	result, err1 := posMngr.VolumeProperty(&paramStruct)
	if err1 != nil {
		log.Errorf(commandFailureMsg, GetFuncName(1), err1)
		return model.Response{}, ErrConn
	}
	resByte, err2 := protojson.Marshal(result)
	return HandleResponse(resByte, err2)

}

func CallDeleteVolume(xrId string, param interface{}, posMngr pos.POSManager) (model.Response, error) {
	var paramStruct pb.DeleteVolumeRequest_Param
	pByte, err := json.Marshal(param)
	if err != nil {
		log.Errorf(marshalErrMsg, GetFuncName(1), err)
		return model.Response{}, ErrJson
	}
	if err = json.Unmarshal(pByte, &paramStruct); err != nil {
		log.Errorf(unmarshalErrMsg, GetFuncName(1), err)
		return model.Response{}, ErrJson
	}
	result, err1 := posMngr.DeleteVolume(&paramStruct)
	if err1 != nil {
		log.Errorf(commandFailureMsg, GetFuncName(1), err1)
		return model.Response{}, ErrConn
	}
	resByte, err2 := protojson.Marshal(result)
	return HandleResponse(resByte, err2)
}

func CallUnmountVolume(xrId string, param interface{}, posMngr pos.POSManager) (model.Response, error) {
	var paramStruct pb.UnmountVolumeRequest_Param
	pByte, err := json.Marshal(param)
	if err != nil {
		log.Errorf(marshalErrMsg, GetFuncName(1), err)
		return model.Response{}, ErrJson
	}
	if err = json.Unmarshal(pByte, &paramStruct); err != nil {
		log.Errorf(unmarshalErrMsg, GetFuncName(1), err)
		return model.Response{}, ErrJson
	}
	result, err1 := posMngr.UnmountVolume(&paramStruct)
	if err1 != nil {
		log.Errorf(commandFailureMsg, GetFuncName(1), err1)
		return model.Response{}, ErrConn
	}
	resByte, err2 := protojson.Marshal(result)
	return HandleResponse(resByte, err2)
}
