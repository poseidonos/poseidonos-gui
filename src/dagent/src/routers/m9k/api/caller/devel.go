package caller

import (
    pos "kouros/pos"
    "kouros/model"
    "kouros/log"
    "google.golang.org/protobuf/encoding/protojson"
    pb "kouros/api"
    "encoding/json"
) 
func CallResetEventWRRPolicy(xrId string, param interface{}, posMngr pos.POSManager) (model.Response, error) {
    result, err1 := posMngr.ResetEventWRRPolicy()
    if err1 != nil {
        log.Errorf(commandFailureMsg, GetFuncName(1), err1)
    }
    resByte, err2 := protojson.Marshal(result)
    return HandleResponse(resByte, err2)
}

func CallResetMBR(xrId string, param interface{}, posMngr pos.POSManager) (model.Response, error) {
    result, err1 := posMngr.ResetMBR()
    if err1 != nil {
        log.Errorf(commandFailureMsg, GetFuncName(1), err1)
    }
    resByte, err2 := protojson.Marshal(result)
    return HandleResponse(resByte, err2)
}

func CallStopRebuilding(xrId string, param interface{}, posMngr pos.POSManager) (model.Response, error) {
    var paramStruct pb.StopRebuildingRequest_Param
    pByte, err := json.Marshal(param)
    if err != nil {
        log.Errorf(marshalErrMsg, GetFuncName(1), err)
    }
    if err = json.Unmarshal(pByte, &paramStruct); err != nil {
        log.Errorf(unmarshalErrMsg, GetFuncName(1), err)
    }
    result, err1 := posMngr.StopRebuilding(&paramStruct)
    if err1 != nil {
        log.Errorf(commandFailureMsg, GetFuncName(1), err1)
    }
    resByte, err2 := protojson.Marshal(result)
    return HandleResponse(resByte, err2)

}

func CallUpdateEventWRRPolicy(xrId string, param interface{}, posMngr pos.POSManager) (model.Response, error) {
    var paramStruct pb.UpdateEventWrrRequest_Param
    pByte, err := json.Marshal(param)
    if err != nil {
        log.Errorf(marshalErrMsg, GetFuncName(1), err)
    }
    if err = json.Unmarshal(pByte, &paramStruct); err != nil {
        log.Errorf(unmarshalErrMsg, GetFuncName(1), err)
    }
    result, err1 := posMngr.UpdateEventWRRPolicy(&paramStruct)
    if err1 != nil {
        log.Errorf(commandFailureMsg, GetFuncName(1), err1)
    }
    resByte, err2 := protojson.Marshal(result)
    return HandleResponse(resByte, err2)

}

