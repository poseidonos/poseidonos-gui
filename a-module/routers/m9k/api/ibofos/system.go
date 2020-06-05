package ibofos

import (
	"a-module/log"
	"a-module/routers/m9k/model"
	"a-module/setting"
	"a-module/util"
	"fmt"
	"os"
	"path/filepath"
	"time"
)

func ExitiBoFOS(xrId string, param interface{}) (model.Request, model.Response, error) {
	return Requester{xrId, param}.Delete("EXITIBOFOS")
}

func RuniBoFOS(xrId string, param interface{}) (model.Request, model.Response, error) {

	iBoFRequest := model.Request{
		Command: "RUNIBOFOS",
		Rid:     xrId,
	}

	iBoFRequest.Param = param
	res := model.Response{}

	path, _ := filepath.Abs(filepath.Dir(os.Args[0]))
	cmd := fmt.Sprintf("/run_remote_ibofos.sh %s", setting.Config.Server.IBoF.IP)
	err := util.ExecCmd(path+cmd, false)

	if err != nil {
		res.Result.Status.Code = 11000
	} else {
		res.Result.Status.Code = 0
		res.LastSuccessTime = time.Now().UTC().Unix()
	}

	log.Info("RuniBoFOS result : ", res.Result.Status.Code)

	return iBoFRequest, res, err
}

func IBoFOSInfo(xrId string, param interface{}) (model.Request, model.Response, error) {
	return Requester{xrId, param}.Get("GETIBOFOSINFO")
}

func MountiBoFOS(xrId string, param interface{}) (model.Request, model.Response, error) {
	return Requester{xrId, param}.Post("MOUNTIBOFOS")
}

func UnmountiBoFOS(xrId string, param interface{}) (model.Request, model.Response, error) {
	return Requester{xrId, param}.Delete("UNMOUNTIBOFOS")
}

func StopRebuilding(xrId string, param interface{}) (model.Request, model.Response, error) {
	return Requester{xrId, param}.Put("STOPREBUILDING")
}

func SetLogLevel(xrId string, param interface{}) (model.Request, model.Response, error) {
	return Requester{xrId, param}.Put("SETLOGLEVEL")
}

func GetLogLevel(xrId string, param interface{}) (model.Request, model.Response, error) {
	return Requester{xrId, param}.Get("GETLOGLEVEL")
}

func ApplyLogFilter(xrId string, param interface{}) (model.Request, model.Response, error) {
	return Requester{xrId, param}.Put("APPLYLOGFILTER")
}

func WBT(xrId string, param interface{}) (model.Request, model.Response, error) {
	return Requester{xrId, param}.Put("WBT")
}

func ListWBT(xrId string, param interface{}) (model.Request, model.Response, error) {
	return Requester{xrId, param}.Get("LISTWBT")
}

func DoGC(xrId string, param interface{}) (model.Request, model.Response, error) {
	return Requester{xrId, param}.Get("DOGC")
}

func DetachDevice(xrId string, param interface{}) (model.Request, model.Response, error) {
	return Requester{xrId, param}.Delete("DETACHDEVICE")
}
