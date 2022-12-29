package caller

import (
	"encoding/json"
	pb "kouros/api"
	"kouros/log"
	"kouros/model"
	pos "kouros/pos"

	"google.golang.org/protobuf/encoding/protojson"
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
	result, _, err1 := posMngr.CreateVolume(&paramStruct)
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
	result, _, err1 := posMngr.VolumeProperty(&paramStruct)
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
	result, _, err1 := posMngr.DeleteVolume(&paramStruct)
	if err1 != nil {
		log.Errorf(commandFailureMsg, GetFuncName(1), err1)
		return model.Response{}, ErrConn
	}
	resByte, err2 := protojson.Marshal(result)
	return HandleResponse(resByte, err2)
}

func CallMountVolume(xrId string, param interface{}, posMngr pos.POSManager) (model.Response, error) {
	var paramStruct pb.MountVolumeRequest_Param
	pByte, err := json.Marshal(param)
	if err != nil {
		log.Errorf(marshalErrMsg, GetFuncName(1), err)
		return model.Response{}, ErrJson
	}
	if err = json.Unmarshal(pByte, &paramStruct); err != nil {
		log.Errorf(unmarshalErrMsg, GetFuncName(1), err)
		return model.Response{}, ErrJson
	}
	result, _, err1 := posMngr.MountVolume(&paramStruct)
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
	result, _, err1 := posMngr.UnmountVolume(&paramStruct)
	if err1 != nil {
		log.Errorf(commandFailureMsg, GetFuncName(1), err1)
		return model.Response{}, ErrConn
	}
	resByte, err2 := protojson.Marshal(result)
	return HandleResponse(resByte, err2)
}

func CallListVolume(xrId string, param interface{}, posMngr pos.POSManager) (model.Response, error) {
	var paramStruct pb.ListVolumeRequest_Param
	pByte, err := json.Marshal(param)
	if err != nil {
		log.Errorf(marshalErrMsg, GetFuncName(1), err)
		return model.Response{}, ErrJson
	}
	if err = json.Unmarshal(pByte, &paramStruct); err != nil {
		log.Errorf(unmarshalErrMsg, GetFuncName(1), err)
		return model.Response{}, ErrJson
	}
	result, _, err1 := posMngr.ListVolume(&paramStruct)
	if err1 != nil {
		log.Errorf(commandFailureMsg, GetFuncName(1), err1)
		return model.Response{}, ErrConn
	}
	resByte, err2 := protojson.MarshalOptions{
		EmitUnpopulated: true,
	}.Marshal(result)
	return HandleResponse(resByte, err2)
}

func CallVolumeInfo(xrId string, param interface{}, posMngr pos.POSManager) (model.Response, error) {
	var paramStruct pb.VolumeInfoRequest_Param
	pByte, err := json.Marshal(param)
	if err != nil {
		log.Errorf(marshalErrMsg, GetFuncName(1), err)
		return model.Response{}, ErrJson
	}
	if err = json.Unmarshal(pByte, &paramStruct); err != nil {
		log.Errorf(unmarshalErrMsg, GetFuncName(1), err)
		return model.Response{}, ErrJson
	}
	result, _, err1 := posMngr.VolumeInfo(&paramStruct)
	if err1 != nil {
		log.Errorf(commandFailureMsg, GetFuncName(1), err1)
		return model.Response{}, ErrConn
	}
	resByte, err2 := protojson.MarshalOptions{
		EmitUnpopulated: true,
	}.Marshal(result)
	return HandleResponse(resByte, err2)
}

func CallRenameVolume(xrId string, param interface{}, posMngr pos.POSManager) (model.Response, error) {
	var paramStruct pb.VolumeRenameRequest_Param
	pByte, err := json.Marshal(param)
	if err != nil {
		log.Errorf(marshalErrMsg, GetFuncName(1), err)
		return model.Response{}, ErrJson
	}
	if err = json.Unmarshal(pByte, &paramStruct); err != nil {
		log.Errorf(unmarshalErrMsg, GetFuncName(1), err)
		return model.Response{}, ErrJson
	}
	result, _, err1 := posMngr.VolumeRename(&paramStruct)
	if err1 != nil {
		log.Errorf(commandFailureMsg, GetFuncName(1), err1)
		return model.Response{}, ErrConn
	}
	resByte, err2 := protojson.Marshal(result)
	return HandleResponse(resByte, err2)
}

func CallMountVolumeWithSubSystem(xrId string, param interface{}, posMngr pos.POSManager) (model.Response, error) {
	errorInfo := make(map[string]interface{})
	errorInfoList := []map[string]interface{}{}
	iBoFRequest := model.Request{
		Command: "MOUNTWITHSUBSYSTEM",
		Rid:     xrId,
	}
	iBoFRequest.Param = param
	res := model.Response{}
	reqMap := param.(map[string]interface{})
	errorCode := 0
	SubSystemAuto(xrId, &res, reqMap, "SubSystemAuto", &errorInfoList, posMngr)
	Addlistener(xrId, &res, reqMap, "AddListener", &errorInfoList, posMngr)
	MountVolume(xrId, &res, reqMap, "MountVolume", &errorInfoList, posMngr)
	for itr := 0; itr < len(errorInfoList); itr++ {
		if errorInfoList[itr]["code"].(int) != 0 {
			errorCode = 1
			break
		}
	}
	errorInfo["errorResponses"] = errorInfoList
	errorInfo["errorCode"] = errorCode
	res.Result.Status.ErrorInfo = errorInfo
	return res, nil
	//return Requester{xrId, param, model.VolumeParam{}}.Send("MOUNTVOLUME")
}

func SubSystemAuto(xrId string, res *model.Response, param map[string]interface{}, opName string, errorInfoList *[]map[string]interface{}, posMngr pos.POSManager) {
	subsystemParam := model.SubSystemParam{}
	subsystemParam.NQN, _ = param["subnqn"].(string)
	response, _ := CallCreateSubsystemAuto(xrId, subsystemParam, posMngr)
	//update response
	UpdateResponse(response, res, opName, errorInfoList)

}

func Addlistener(xrId string, res *model.Response, param map[string]interface{}, opName string, errorInfoList *[]map[string]interface{}, posMngr pos.POSManager) {
	subsystemParam := model.SubSystemParam{}
	subsystemParam.SUBNQN, _ = param["subnqn"].(string)
	subsystemParam.TRANSPORTTYPE, _ = param["transport_type"].(string)
	subsystemParam.TARGETADDRESS, _ = param["target_address"].(string)
	subsystemParam.TRANSPORTSERVICEID, _ = param["transport_service_id"].(string)
	response, _ := CallAddListener(xrId, subsystemParam, posMngr)
	//update response
	UpdateResponse(response, res, opName, errorInfoList)

}
func MountVolume(xrId string, res *model.Response, param map[string]interface{}, opName string, errorInfoList *[]map[string]interface{}, posMngr pos.POSManager) {
	volumeParam := model.VolumeParam{}
	volumeParam.Name, _ = param["name"].(string)
	volumeParam.Array, _ = param["array"].(string)
	volumeParam.SubNQN, _ = param["subnqn"].(string)
	response, _ := CallMountVolume(xrId, volumeParam, posMngr)
	//update response
	UpdateResponse(response, res, opName, errorInfoList)
}
