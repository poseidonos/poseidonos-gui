#!/bin/bash
ROOT_DIR=$(readlink -f $(dirname $0))
cd $ROOT_DIR
cd ..

export PYTHONPATH=$PYTHONPATH:$PWD
echo #PWD
#/home/ibofmtool/plugin/net-socket &
. ./scripts/ProcessorAffinitySet.sh
#echo "Selected Core"
#echo $CoresSel
#python3 PreConfiguredAlerts.py
cd dist
taskset -c $CoresSel ./bin/app
