#!/bin/bash
SCRIPT_PATH=$(dirname $(realpath $0))
LOG_FILE="/etc/ibofos/log/dagent.log"

if [ ! -f "$SCRIPT_PATH/dagent" ]; then
	echo "Fail to find executable file."
else
	sudo pkill -9 dagent
	sudo nohup $SCRIPT_PATH/dagent &>> ${LOG_FILE} &
	echo "D-Agent is running in background."
	echo "Run Path : ${SCRIPT_PATH}"
	echo "Log File : ${LOG_FILE}"
fi

