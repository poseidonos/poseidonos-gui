package caller


import (
    "encoding/json"
    "google.golang.org/protobuf/encoding/protojson"
    pb "kouros/api"
    pos "kouros/pos"
    "kouros/log"
    "kouros/model"
)


func CallCreateVolume(xrId string, param interface{}, posMngr pos.POSManager) (model.Response, error) {
    var paramStruct pb.CreateVolumeRequest_Param
    pByte, err := json.Marshal(param)
    if err != nil {
        log.Errorf(marshalErrMsg, GetFuncName(1), err)
    }
    if err = json.Unmarshal(pByte, &paramStruct); err != nil {
        log.Errorf(unmarshalErrMsg, GetFuncName(1), err)
    }
    result, err1 := posMngr.CreateVolume(&paramStruct)
    if err1 != nil {
        log.Errorf(commandFailureMsg, GetFuncName(1), err1)
    }
    resByte, err2 := protojson.Marshal(result)
    return HandleResponse(resByte, err2)

}

func CallVolumeProperty(xrId string, param interface{}, posMngr pos.POSManager) (model.Response, error) {
    var paramStruct pb.SetVolumePropertyRequest_Param
    pByte, err := json.Marshal(param)
    if err != nil {
        log.Errorf(marshalErrMsg, GetFuncName(1), err)
    }
    if err = json.Unmarshal(pByte, &paramStruct); err != nil {
        log.Errorf(unmarshalErrMsg, GetFuncName(1), err)
    }
    result, err1 := posMngr.VolumeProperty(&paramStruct)
    if err1 != nil {
        log.Errorf(commandFailureMsg, GetFuncName(1), err1)
    }
    resByte, err2 := protojson.Marshal(result)
    return HandleResponse(resByte, err2)

}

