package setting

import (
	"a-module/log"
	"a-module/routers/m9k/model"
	"encoding/json"
	"gopkg.in/yaml.v2"
	"io/ioutil"
	"os"
	"path/filepath"
)

var Config ConfigScheme
var StatusMap map[int]string
var StatusList model.StatusList

type ConfigScheme struct {
	Server           Server `yaml:"server"`
	IBoFOSSocketAddr string
	DAgentSocketAddr string
}

type Server struct {
	Dagent HostConf `yaml:"dagent"`
	IBoF   HostConf `yaml:"ibof"`
	BMC    HostConf `yaml:"bmc"`
}
type HostConf struct {
	IP   string `yaml:"ip"`
	Port string `yaml:"port"`
}

func init() {
	Config.Server.Dagent.IP = "127.0.0.1"
	Config.Server.Dagent.Port = "3000"
	Config.Server.IBoF.IP = "127.0.0.1"
	Config.Server.IBoF.Port = "18716"
	Config.Server.BMC.IP = "192.168.0.2"
	Config.Server.BMC.Port = "443"
}

func LoadConfig() {
	path, _ := filepath.Abs(filepath.Dir(os.Args[0]))
	loadSeverConfig(path + "/config.yaml")
	loadStatusCode(path + "/statuscode.json")
}

func loadSeverConfig(filename string) {
	file, err := ioutil.ReadFile(filename)

	if err != nil {
		log.Infof("LoadSeverConfig : %v\nD-Agent will use default value\n", err)
	} else {
		err = yaml.Unmarshal(file, &Config)
		if err != nil {
			log.Fatalf("loadSeverConfig Error : %v", err)
		} else {
			log.Infof("Open Success : %s", filename)
			log.Infof("Loaded Config Info : %+v", Config)
		}
	}
}

func loadStatusCode(filename string) {
	file, err := ioutil.ReadFile(filename)
	if err != nil {
		log.Infof("LoadStatusList : %v\n", err)
	} else {
		err = json.Unmarshal(file, &StatusList)
		if err != nil {
			log.Fatalf("loadStatusCode Error : %v", err)
		} else {
			log.Infof("Open Success : %s", filename)
		}
	}
	StatusMap = make(map[int]string)
	for _, status := range StatusList.StatusList {
		StatusMap[status.Code] = status.Description
	}
}

func StatusDesc(code int) string {
	desc, exist := StatusMap[code]
	if exist {
		return desc
	} else {
		return "not defined"
	}
}
