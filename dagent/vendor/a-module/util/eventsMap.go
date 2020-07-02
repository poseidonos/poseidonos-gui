package util

import (
	"a-module/log"
	"a-module/routers/m9k/model"
	"gopkg.in/yaml.v2"
)

var eventsmap PosEvents

type code struct {
	Eventid  int    `yaml:"code"`
	Level    string `yaml:"level"`
	Message  string `yaml:"message"`
	Problem  string `yaml:"problem,omitempty"`
	Solution string `yaml:"solution,omitempty"`
}

type module struct {
	Name    string `yaml:"name"`
	Count   int    `yaml:"counts"`
	Idstart int    `yaml:"idStart"`
	Idend   int    `yaml:"idEnd"`
	Codes   []code `yaml:"codes"`
}
type PosEvents struct {
	Modules []module `yaml:"modules"`
}

func init() {
	LoadEvents()
}

func LoadEvents() {

	file, err := Asset("../resources/events.yaml")

	if err != nil {
		log.Infof("LoadSeverConfig : %v\n EventId cannot be decoded\n", err)
	} else {
		err = yaml.Unmarshal(file, &eventsmap)
		if err != nil {
			log.Fatalf("loadevents Error : %v", err)
		}
		/*
			else {
				var temp model.Status
				temp.Code = 2010
				ReturnEventsDets(&temp)
				fmt.Printf("Name : %s, Level : %s, Desc : %s, Problem : %s, Solution = %s \n", temp.Module, temp.Level, temp.Description, temp.Problem, temp.Solution)
				fmt.Printf("Total Modules : %+v\n", len(eventsmap.Modules))
				//fmt.Println("Loaded Config Info : %+v", eventsmap)
				fmt.Printf("start index : %d end index : %d\n", eventsmap.Modules[0].Idstart, eventsmap.Modules[0].Idend)
			}
		*/
	}
}

func ReturnEventsDets(status *model.Status) bool {
	totMods := len(eventsmap.Modules)
	eventid := status.Code
	for i := 0; i < totMods; i++ {
		if eventid >= eventsmap.Modules[i].Idstart && eventid <= eventsmap.Modules[i].Idend {
			totcodes := len(eventsmap.Modules[i].Codes)
			for j := 0; j < totcodes; j++ {
				if eventsmap.Modules[i].Codes[j].Eventid == eventid {
					status.Module = eventsmap.Modules[i].Name
					status.Description = eventsmap.Modules[i].Codes[j].Message
					status.Problem = eventsmap.Modules[i].Codes[j].Problem
					status.Solution = eventsmap.Modules[i].Codes[j].Solution
					status.Level = eventsmap.Modules[i].Codes[j].Level

					return true
				}
			}
		}
	}

	return false
}
