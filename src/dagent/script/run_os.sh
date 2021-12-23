#!/bin/bash
#
# run_ibofos.sh
#
logfile="ibofos.log"
ibofos=/usr/local/bin/poseidonos

pkill -9 poseidonos
pkill -9 ibofos
sleep 2

if [ ! -f "$ibofos" ]; then
        echo "fail to find $ibofos. run make prior to run run_os.sh"
else
#       ${root_dir}/script/setup_env.sh
        \rm -rf /dev/shm/ibof_nvmf_trace*
#       ${root_dir}/script/m9k/cpumode.sh max
        nohup $ibofos primary &>> ${logfile} &
        sleep 2
fi

