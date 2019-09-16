#!/bin/bash
logfile="ibofdagent.log"

nohup ./ibofdagent &>> ${logfile} &
echo "D-Agent is running in background...logfile=${logfile}"