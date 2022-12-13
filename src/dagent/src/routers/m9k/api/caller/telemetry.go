package caller

import (
	"dagent/src/routers/m9k/globals"
	"encoding/json"
	"github.com/ghodss/yaml"
	"google.golang.org/protobuf/encoding/protojson"
	pb "kouros/api"
	"kouros/log"
	"kouros/model"
	pos "kouros/pos"
	"kouros/utils"
	"os"
	"strings"
)

func CallStartTelemetry(xrId string, param interface{}, posMngr pos.POSManager) (model.Response, error) {
	result, err1 := posMngr.StartTelemetry()
	if err1 != nil {
		log.Errorf(commandFailureMsg, GetFuncName(1), err1)
		return model.Response{}, ErrConn
	}
	resByte, err2 := protojson.Marshal(result)
	return HandleResponse(resByte, err2)
}

func CallStopTelemetry(xrId string, param interface{}, posMngr pos.POSManager) (model.Response, error) {
	result, err1 := posMngr.StopTelemetry()
	if err1 != nil {
		log.Errorf(commandFailureMsg, GetFuncName(1), err1)
		return model.Response{}, ErrConn
	}
	resByte, err2 := protojson.Marshal(result)
	return HandleResponse(resByte, err2)
}

func CallSetTelemetryProperty(xrId string, param interface{}, posMngr pos.POSManager) (model.Response, error) {
	var paramStruct pb.SetTelemetryPropertyRequest_Param
	pByte, err := json.Marshal(param)
	if err != nil {
		log.Errorf(marshalErrMsg, GetFuncName(1), err)
		return model.Response{}, ErrJson
	}
	if err = json.Unmarshal(pByte, &paramStruct); err != nil {
		log.Errorf(unmarshalErrMsg, GetFuncName(1), err)
		return model.Response{}, ErrJson
	}
	result, err1 := posMngr.SetTelemetryProperty(&paramStruct)
	if err1 != nil {
		log.Errorf(commandFailureMsg, GetFuncName(1), err1)
		return model.Response{}, ErrConn
	}
	resByte, err2 := protojson.Marshal(result)
	return HandleResponse(resByte, err2)

}

func CallGetTelemetryProperty(xrId string, param interface{}, posMngr pos.POSManager) (model.Response, error) {
	result, err1 := posMngr.GetTelemetryProperty()
	if err1 != nil {
		log.Errorf(commandFailureMsg, GetFuncName(1), err1)
		return model.Response{}, ErrConn
	}
	resByte, err2 := protojson.MarshalOptions{
        EmitUnpopulated: true,
    }.Marshal(result)

	return HandleResponse(resByte, err2)
}

func CallReadTelemetryProperty(xrId string, param interface{}, posMngr pos.POSManager) (model.Response, error) {
	res, _ := CallGetTelemetryProperty(xrId, param, posMngr)
	status := false
	if res.Result.Status.Code == 0 && res.Result.Status.EVENTNAME == "SUCCESS" {
		data := res.Result.Data.(map[string]interface{})
		if _, ok := data["status"]; ok {
			status = data["status"].(bool)
		}
		if _, ok := data["publicationListPath"]; ok {
			return ReadYAML(data["publicationListPath"].(string), status)
		}
	}
	param = model.SetTelemetryPropertyRequest_Param{PublicationListPath: globals.Telemetry_config_path}

	_, setErr := CallSetTelemetryProperty(xrId, param, posMngr)
	if setErr != nil {
		log.Errorf(setPropertyFailureMsg, GetFuncName(1), setErr)
	}
	return ReadYAML(globals.Telemetry_config_path, status)

}

func ReadYAML(path string, status bool) (model.Response, error) {
	res := model.Response{}
	if _, err := os.Stat(path); err != nil {
		res.Result.Status, _ = utils.GetStatusInfo(2925)
		return res, err

	}
	dat, err := os.ReadFile(path)
	if err != nil {
		res.Result.Status, _ = utils.GetStatusInfo(2922)
		return res, err
	}
	resData := &map[string](map[string]interface{}){}
	jsonData, err := yaml.YAMLToJSON(dat)
	if err != nil {
		res.Result.Status, _ = utils.GetStatusInfo(2922)
		return res, err
	}
	err = json.Unmarshal(jsonData, resData)
	if err != nil {
		res.Result.Status, _ = utils.GetStatusInfo(2922)
	} else {
		(*resData)["telemetryStatus"] = map[string]interface{}{"status": status}
		res.Result.Data = resData
	}

	return res, err
}

func CallWriteTelemetryProperty(xrId string, param interface{}, posMngr pos.POSManager) (model.Response, error) {
	res, _ := CallGetTelemetryProperty(xrId, param, posMngr)
	if res.Result.Status.Code == 0 && res.Result.Status.EVENTNAME == "SUCCESS" {
		data := res.Result.Data.(map[string]interface{})
		if _, ok := data["publicationListPath"]; ok {
			return WriteYAML(data["publicationListPath"].(string), param)

		}
	}
	param = model.SetTelemetryPropertyRequest_Param{PublicationListPath: globals.Telemetry_config_path}

	_, setErr := CallSetTelemetryProperty(xrId, param, posMngr)
	if setErr != nil {
		log.Errorf(setPropertyFailureMsg, GetFuncName(1), setErr)
	}
	return WriteYAML(globals.Telemetry_config_path, param)

}

func WriteYAML(path string, param interface{}) (model.Response, error) {
	res := model.Response{}
	j, _ := json.Marshal(param)
	yamlData, err := yaml.JSONToYAML(j)
	if err != nil {
		res.Result.Status, _ = utils.GetStatusInfo(2922)
		return res, err
	}
	globals.TelemetryWriteLock.Lock()
	yamlFile := strings.ReplaceAll(string(yamlData), "null", "")
	err = os.WriteFile(path, []byte(yamlFile), 0644)
	globals.TelemetryWriteLock.Unlock()
	if err != nil {
		res.Result.Status, _ = utils.GetStatusInfo(2922)
	} else {
		res.Result.Status, _ = utils.GetStatusInfo(0)
	}

	return res, err
}
