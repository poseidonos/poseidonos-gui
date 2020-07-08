#!/bin/bash
SCRIPT_PATH=$(dirname $(realpath $0))
LOG_FILE="/etc/ibofos/log/dagent.log"

if [ ! -f "$SCRIPT_PATH/../bin/dagent" ]; then
	echo "Fail to find executable file."
else
	sudo pkill -9 dagent
	sudo nohup $SCRIPT_PATH/../bin/dagent | sudo tee -a ${LOG_FILE} &
	echo "D-Agent is running in background."
	echo "Log File : ${LOG_FILE}"
fi
