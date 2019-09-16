package setting

import (
	"encoding/json"
	"io/ioutil"
	"log"
)

var ServerConf = ConfigScheme{
	DagentPort:       "3000",
	IBoFOSPort:       "18716",
	IBoFOSHost:       "localhost",
	DAgentSocketAddr: "Disconnect",
	IBoFOSSocketAddr: "Disconnect",
}

type ConfigScheme struct {
	DagentPort       string `json:"dagentPort"`
	IBoFOSHost       string `json:"iBoFOSHost"`
	IBoFOSPort       string `json:"iBoFOSPort"`
	DAgentSocketAddr string `json:"dAgentSocketAddr"`
	IBoFOSSocketAddr string `json:"iBoFOSSocketAddr"`
}

func LoadSeverConfig() {
	filename := "serverConf.json"
	file, err := ioutil.ReadFile(filename)

	if err != nil {
		log.Printf("%v\nD-Agent will use default value\n", err)
	} else {
		err = json.Unmarshal(file, &ServerConf)
		if err != nil {
			log.Fatalf("Json Error : %v", err)
		} else {
			log.Printf("Open Success : %s", filename)
		}
	}
}
