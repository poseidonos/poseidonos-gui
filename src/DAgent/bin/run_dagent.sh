#!/bin/bash
logfile="/etc/ibofos/log/dagent.log"

if [ ! -f "ibofdagent" ]; then
	echo "Fail to find executable file."
else
	sudo pkill -9 ibofdagent
	sudo nohup ./ibofdagent &>> ${logfile} &
	echo "D-Agent is running in background."
	echo "logfile=${logfile}"
fi

