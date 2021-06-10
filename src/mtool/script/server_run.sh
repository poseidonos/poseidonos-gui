#!/bin/bash
ROOT_DIR=$(readlink -f $(dirname $0))
cd $ROOT_DIR
cd ..

export PYTHONPATH=$PYTHONPATH:$PWD
echo #PWD
#/home/ibofmtool/plugin/net-socket &
. ./script/ProcessorAffinitySet.sh
#echo "Selected Core"
#echo $CoresSel
#python3 PreConfiguredAlerts.py
cd api
taskset -c $CoresSel python3 rest/app.py
