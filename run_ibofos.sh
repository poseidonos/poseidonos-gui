#!/bin/bash
# 
# run_ibofos.sh
#
logfile="ibofos.log"
root_dir=/root/workspace/ibofos
ibofos=${root_dir}/bin/ibofos

if [ ! -f "$ibofos" ]; then
        echo "fail to find $ibofos. run make prior to run run_ibofos.sh"
else
#       ${root_dir}/script/mtool/setup_env.sh
        \rm -rf /dev/shm/ibof_nvmf_trace*
#       ${root_dir}/script/mtool/cpumode.sh max
        nohup $ibofos primary &>> ${logfile} &
        sleep 2
        sudo ${root_dir}/lib/spdk-19.01.1/scripts/rpc.py construct_malloc_bdev -b uram0 4096 4096
fi
echo "finish run_ibofos.sh"

