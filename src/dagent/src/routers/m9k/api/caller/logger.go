package caller

import (
    pos "kouros/pos"
    pb "kouros/api"
    "encoding/json"
    "kouros/model"
    "kouros/log"
    "google.golang.org/protobuf/encoding/protojson"
)

func CallApplyLogFilter(xrId string, param interface{}, posMngr pos.POSManager) (model.Response, error) {
    result, err1 := posMngr.ApplyLogFilter()
    if err1 != nil {
        log.Errorf(commandFailureMsg, GetFuncName(1), err1)
        return model.Response{}, ErrConn
    }
    resByte, err2 := protojson.Marshal(result)
    return HandleResponse(resByte, err2)
}

func CallGetLogLevel(xrId string, param interface{}, posMngr pos.POSManager) (model.Response, error) {
    result, err1 := posMngr.GetLogLevel()
    if err1 != nil {
        log.Errorf(commandFailureMsg, GetFuncName(1), err1)
        return model.Response{}, ErrConn
    }
    resByte, err2 := protojson.Marshal(result)
    return HandleResponse(resByte, err2)
}

func CallLoggerInfo(xrId string, param interface{}, posMngr pos.POSManager) (model.Response, error) {
    result, err1 := posMngr.LoggerInfo()
    if err1 != nil {
        log.Errorf(commandFailureMsg, GetFuncName(1), err1)
        return model.Response{}, ErrConn
    }
    resByte, err2 := protojson.Marshal(result)
    return HandleResponse(resByte, err2)
}

func CallSetLogLevel(xrId string, param interface{}, posMngr pos.POSManager) (model.Response, error) {
    var paramStruct pb.SetLogLevelRequest_Param
    pByte, err := json.Marshal(param)
    if err != nil {
        log.Errorf(marshalErrMsg, GetFuncName(1), err)
        return model.Response{}, .ErrJson
    }
    if err = json.Unmarshal(pByte, &paramStruct); err != nil {
        log.Errorf(unmarshalErrMsg, GetFuncName(1), err)
        return model.Response{}, .ErrJson
    }
    result, err1 := posMngr.SetLogLevel(&paramStruct)
    if err1 != nil {
        log.Errorf(commandFailureMsg, GetFuncName(1), err1)
        return model.Response{}, ErrConn
    }
    resByte, err2 := protojson.Marshal(result)
    return HandleResponse(resByte, err2)

}

func CallSetLogPreference(xrId string, param interface{}, posMngr pos.POSManager) (model.Response, error) {
    var paramStruct pb.SetLogPreferenceRequest_Param
    pByte, err := json.Marshal(param)
    if err != nil {
        log.Errorf(marshalErrMsg, GetFuncName(1), err)
        return model.Response{}, .ErrJson
    }
    if err = json.Unmarshal(pByte, &paramStruct); err != nil {
        log.Errorf(unmarshalErrMsg, GetFuncName(1), err)
        return model.Response{}, .ErrJson
    }
    result, err1 := posMngr.SetLogPreference(&paramStruct)
    if err1 != nil {
        log.Errorf(commandFailureMsg, GetFuncName(1), err1)
        return model.Response{}, ErrConn
    }
    resByte, err2 := protojson.Marshal(result)
    return HandleResponse(resByte, err2)

}

