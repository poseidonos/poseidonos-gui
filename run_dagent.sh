#!/bin/bash
sudo pkill -9 ibofdagent
logfile="/etc/ibofos/log/dagent.log"

sudo nohup ./ibofdagent &>> ${logfile} &
echo "D-Agent is running in background...logfile=${logfile}"
