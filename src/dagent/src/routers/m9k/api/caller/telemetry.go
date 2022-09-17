package caller

import (
    pos "kouros/pos"
    pb "kouros/api"
    "encoding/json"
    "kouros/model"
    "google.golang.org/protobuf/encoding/protojson"
    "kouros/log"
)

func CallStartTelemetry(xrId string, param interface{}, posMngr pos.POSManager) (model.Response, error) {
    result, err1 := posMngr.StartTelemetry()
    if err1 != nil {
        log.Errorf(commandFailureMsg, GetFuncName(1), err1)
    }
    resByte, err2 := protojson.Marshal(result)
    return HandleResponse(resByte, err2)
}

func CallStopTelemetry(xrId string, param interface{}, posMngr pos.POSManager) (model.Response, error) {
    result, err1 := posMngr.StopTelemetry()
    if err1 != nil {
        log.Errorf(commandFailureMsg, GetFuncName(1), err1)
    }
    resByte, err2 := protojson.Marshal(result)
    return HandleResponse(resByte, err2)
}

func CallSetTelemetryProperty(xrId string, param interface{}, posMngr pos.POSManager) (model.Response, error) {
    var paramStruct pb.SetTelemetryPropertyRequest_Param
    pByte, err := json.Marshal(param)
    if err != nil {
        log.Errorf(marshalErrMsg, GetFuncName(1), err)
    }
    if err = json.Unmarshal(pByte, &paramStruct); err != nil {
        log.Errorf(unmarshalErrMsg, GetFuncName(1), err)
    }
    result, err1 := posMngr.SetTelemetryProperty(&paramStruct)
    if err1 != nil {
        log.Errorf(commandFailureMsg, GetFuncName(1), err1)
    }
    resByte, err2 := protojson.Marshal(result)
    return HandleResponse(resByte, err2)

}


