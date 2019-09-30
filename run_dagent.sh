#!/bin/bash
logfile="/etc/ibofos/log/dagent.log"

nohup ./ibofdagent &>> ${logfile} &
echo "D-Agent is running in background...logfile=${logfile}"
