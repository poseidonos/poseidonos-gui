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
taskset -c $CoresSel python3 rest/app.py
