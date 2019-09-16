package util

import (
	"ibofdagent/server/setting"
	"log"
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
		"\n      #####  D-Agent Port : " + setting.ServerConf.DagentPort + "       #####" +
		"\n      #####  iBoFOS Host : " + setting.ServerConf.IBoFOSHost + "   #####" +
		"\n      #####  iBoFOS Port : " + setting.ServerConf.IBoFOSPort + "       #####" +
		"\n      #####----------------------------#####" +
		"\n      #####                            #####" +
		"\n      ####    Socket Connect Status     ####" +
		"\n    ##### D-Agent Addr : " + setting.ServerConf.DAgentSocketAddr + " #####" +
		"\n  ####### iBoFOS Addr : " + setting.ServerConf.IBoFOSSocketAddr + "  #######" +
		"\n###########                            ###########" +
		"\n##################################################" +
		"\n        ##################################         " +
		"\n        ##################################         " +
		"\n        ##################################         " +
		"\n        ##################################         ")
}
