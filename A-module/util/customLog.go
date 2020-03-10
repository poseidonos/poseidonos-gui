package util

import (
	"A-module/setting"
	"A-module/log"
)

func PrintCurrentServerStatus() {
	log.Print("\n" +
		"\n                  #############" +
		"\n               ####################" +
		"\n            ##########################" +
		"\n         ################################" +
		"\n      ######################################" +
		"\n      #####          D-Agent           #####" +
		"\n      ######################################" +
		"\n      #####----------------------------#####" +
		"\n      #####      Config.json Info      #####" +
		"\n      #####  D-Agent Port : " + setting.Config.Server.Dagent.Port + "       #####" +
		"\n      #####  iBoFOS Host : " + setting.Config.Server.IBoF.IP + "   #####" +
		"\n      #####  iBoFOS Port : " + setting.Config.Server.IBoF.Port + "       #####" +
		"\n      #####----------------------------#####" +
		"\n      #####                            #####" +
		"\n      ####    Socket Connect Status     ####" +
		"\n    ##### D-Agent Addr : " + setting.Config.DAgentSocketAddr + " #####" +
		"\n  ####### iBoFOS Addr : " + setting.Config.IBoFOSSocketAddr + "  #######" +
		"\n###########                            ###########" +
		"\n##################################################" +
		"\n        ##################################         " +
		"\n        ##################################         " +
		"\n        ##################################         " +
		"\n        ##################################         ")
}
