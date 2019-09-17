package setting

import (
	"gopkg.in/yaml.v2"
	"io/ioutil"
	"log"
)

var Config ConfigScheme

type ConfigScheme struct {
	Server Server `yaml:"server"`
	IBoFOSSocketAddr string
	DAgentSocketAddr string
}

type Server struct {
	Dagent HostConf `yaml:"dagent"`
	IBoF   HostConf `yaml:"iBoF"`
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
}

func LoadSeverConfig() {
	filename := "config.yml"
	file, err := ioutil.ReadFile(filename)

	if err != nil {
		log.Printf("%v\nD-Agent will use default value\n", err)
	} else {
		err = yaml.Unmarshal(file, &Config)
		if err != nil {
			log.Fatalf("YAML Error : %v", err)
		} else {
			log.Printf("Open Success : %s", filename)
		}
	}
}
