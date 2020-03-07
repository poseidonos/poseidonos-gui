#!/bin/bash
logfile="/etc/ibofos/log/DAgent.log"

if [ ! -f "DAgent" ]; then
	echo "Fail to find executable file."
else
	sudo pkill -9 DAgent
	sudo nohup ./DAgent &>> ${logfile} &
	echo "D-Agent is running in background."
	echo "logfile=${logfile}"
fi

