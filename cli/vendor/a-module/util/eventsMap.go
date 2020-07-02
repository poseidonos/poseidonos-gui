package util

import (
	"a-module/errors"
	"a-module/log"
	"a-module/routers/m9k/model"
	"fmt"
	"gopkg.in/yaml.v2"
)

var eventsmap PosEvents

type info2 struct {
	Code     int    `yaml:"code"`
	Level    string `yaml:"level"`
	Message  string `yaml:"message"`
	Problem  string `yaml:"problem,omitempty"`
	Solution string `yaml:"solution,omitempty"`
}

type module struct {
	Name    string `yaml:"name"`
	Count   int    `yaml:"count"`
	Idstart int    `yaml:"idStart"`
	Idend   int    `yaml:"idEnd"`
	Info    []info2 `yaml:"info"`
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

func GetStatusInfo(code int) (model.Status, error) {
	var status model.Status
	status.Code = code
	totMods := len(eventsmap.Modules)

	for i := 0; i < totMods; i++ {
		fmt.Println("codecode = ",code)
		fmt.Println("count = ",eventsmap.Modules[i].Count)
		fmt.Println("name = ",eventsmap.Modules[i].Name)
		fmt.Println("eventsmap.Modules[i].Idstart = ",eventsmap.Modules[i].Idstart)
		fmt.Println("eventsmap.Modules[i].Idend = ",eventsmap.Modules[i].Idend)

		fmt.Println("totMods = ",totMods)

		if code >= eventsmap.Modules[i].Idstart && code <= eventsmap.Modules[i].Idend {
			totInfo := len(eventsmap.Modules[i].Info)
			fmt.Println("totInfo = ", totInfo)
			fmt.Println("ccccccccccccccccc = ", eventsmap.Modules[i].Name)


			for j := 0; j < totInfo; j++ {
				fmt.Println("eventsmap.Modules[i].Info[j].Code = ",eventsmap.Modules[i].Info[j].Code)
				fmt.Println("Code = ", code)
				if eventsmap.Modules[i].Info[j].Code == code {
					status.Module = eventsmap.Modules[i].Name
					status.Description = eventsmap.Modules[i].Info[j].Message
					status.Problem = eventsmap.Modules[i].Info[j].Problem
					status.Solution = eventsmap.Modules[i].Info[j].Solution
					status.Level = eventsmap.Modules[i].Info[j].Level

					return status, nil
				}
			}
		}
	}

	err := errors.New("there is no event info")
	status.Description = err.Error()
	return status, err
}
