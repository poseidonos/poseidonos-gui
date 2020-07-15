#!/bin/bash

export PYTHONPATH=$PYTHONPATH:$PWD
echo #PWD
#/home/ibofmtool/plugin/net-socket &
. ./scripts/ProcessorAffinitySet.sh
#echo "Selected Core"
#echo $CoresSel
taskset -c $CoresSel python3 rest/app.py
