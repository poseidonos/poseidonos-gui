package caller

import (
	"encoding/json"
	"fmt"
	pb "kouros/api"
	"kouros/log"
	"kouros/model"
	pos "kouros/pos"

	"google.golang.org/protobuf/encoding/protojson"
)

func CallQOSCreateVolumePolicies(xrId string, param interface{}, posMngr pos.POSManager) (model.Response, error) {
	var paramStruct pb.QosCreateVolumePolicyRequest_Param
	pByte, err := json.Marshal(param)
	fmt.Println(param)
	if err != nil {
		log.Errorf(marshalErrMsg, GetFuncName(1), err)
		return model.Response{}, ErrJson
	}
	if err = json.Unmarshal(pByte, &paramStruct); err != nil {
		log.Errorf(unmarshalErrMsg, GetFuncName(1), err)
		return model.Response{}, ErrJson
	}
	fmt.Println(paramStruct)
	result, _, err1 := posMngr.CreateQoSVolumePolicy(&paramStruct)
	if err1 != nil {
		log.Errorf(commandFailureMsg, GetFuncName(1), err1)
		return model.Response{}, ErrConn
	}
	resByte, err2 := protojson.Marshal(result)
	return HandleResponse(resByte, err2)
}

func CallQOSResetVolumePolicies(xrId string, param interface{}, posMngr pos.POSManager) (model.Response, error) {
	var paramStruct pb.QosResetVolumePolicyRequest_Param
	pByte, err := json.Marshal(param)
	if err != nil {
		log.Errorf(marshalErrMsg, GetFuncName(1), err)
		return model.Response{}, ErrJson
	}
	if err = json.Unmarshal(pByte, &paramStruct); err != nil {
		log.Errorf(unmarshalErrMsg, GetFuncName(1), err)
		return model.Response{}, ErrJson
	}
	result, _, err1 := posMngr.ResetQoSVolumePolicy(&paramStruct)
	if err1 != nil {
		log.Errorf(commandFailureMsg, GetFuncName(1), err1)
		return model.Response{}, ErrConn
	}
	resByte, err2 := protojson.Marshal(result)
	return HandleResponse(resByte, err2)
}

func CallQOSListVolumePolicies(xrId string, param interface{}, posMngr pos.POSManager) (model.Response, error) {
	var paramStruct pb.ListQOSPolicyRequest_Param
	pByte, err := json.Marshal(param)
	if err != nil {
		log.Errorf(marshalErrMsg, GetFuncName(1), err)
		return model.Response{}, ErrJson
	}
	if err = json.Unmarshal(pByte, &paramStruct); err != nil {
		log.Errorf(unmarshalErrMsg, GetFuncName(1), err)
		return model.Response{}, ErrJson
	}
	result, _, err1 := posMngr.ListQoSVolumePolicy(&paramStruct)
	if err1 != nil {
		log.Errorf(commandFailureMsg, GetFuncName(1), err1)
		return model.Response{}, ErrConn
	}
	resByte, err2 := protojson.Marshal(result)
	return HandleResponse(resByte, err2)
}
