package util

import (
        "a-module/log"
        "a-module/routers/m9k/model"
        //"encoding/json"
        "gopkg.in/yaml.v2"
        "io/ioutil"
        "os"
        "path/filepath"
)

var eventsmap  PosEvents

type code struct{
        Eventid int `yaml:"code"`
        Level string `yaml:"level"`
        Message string `yaml:"message"`
        Problem string `yaml:"problem,omitempty"`
        Solution string `yaml:"solution,omitempty"`
}

type module struct{
         Name string `yaml:"name"`
         Count int `yaml:"counts"`
         Idstart int `yaml:"idStart"`
         Idend int `yaml:"idEnd"`
         Codes []code `yaml:"codes"`
 }
type PosEvents struct{
	//Goal string `yaml:"goal"`
	//Modules string `yaml:"modules"` 
	Modules []module  `yaml:"modules"`
  }

//var eventsmap  modules

//func init()
//{
//}
func LoadEvents() {
        path, _ := filepath.Abs(filepath.Dir(os.Args[0]))
        path = path + "/events.yaml"
        file, err := ioutil.ReadFile(path)

        if err != nil {
                log.Infof("LoadSeverConfig : %v\n EventId cannot be decoded\n", err)
        } else {
		// log.Infof("Loaded Config Info : %+v", file)
                err = yaml.Unmarshal(file, &eventsmap)
                if err != nil {
                        log.Fatalf("loadevents Error : %v", err)
                } else {
                        log.Infof("Open Success : %s", path)
			var temp model.Status
			temp.Code = 2010
			ReturnEventsDets(&temp)
			log.Infof("Name : %s, Level : %s, Desc : %s, Problem : %s, Solution = %s ", temp.Module,temp.Level, temp.Description, temp.Problem,temp.Solution)
			log.Infof("Total Modules : %+v",len( eventsmap.Modules))
                        //log.Infof("Loaded Config Info : %+v", eventsmap)
			log.Infof("start index : %d end index : %d", eventsmap.Modules[0].Idstart, eventsmap.Modules[0].Idend) 
                }
        }
}

func ReturnEventsDets(status *model.Status)(int ){
	totMods := len(eventsmap.Modules)
	eventid := status.Code
	for  i:= 0; i < totMods; i++ {
		if(eventid >= eventsmap.Modules[i].Idstart  &&  eventid <= eventsmap.Modules[i].Idend){
			totcodes := len(eventsmap.Modules[i].Codes);
			 for  j:= 0; j < totcodes; j++ {
			  if( eventsmap.Modules[i].Codes[j].Eventid == eventid){
				  status.Module =  eventsmap.Modules[i].Name
				  status.Description =  eventsmap.Modules[i].Codes[j].Message
				  status.Problem =  eventsmap.Modules[i].Codes[j].Problem
				  status.Solution = eventsmap.Modules[i].Codes[j].Solution
				  status.Level = eventsmap.Modules[i].Codes[j].Level
				  //log.Infof("Name : %s, Level : %s,  Desc : %s, Problem : %s, Solution = %s ",  status.Module, status.Level, status.Description,  status.Problem, status.Solution)
				  return 1
			 }

		}
		
	}
	

    }	
     return 0
}
