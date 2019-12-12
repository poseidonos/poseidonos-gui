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
	sudo ${root_dir}/lib/spdk-19.01.1/scripts/rpc.py nvmf_subsystem_create nqn.2019-04.ibof:subsystem1 -a -s IBOF00000000000001
	sudo ${root_dir}/lib/spdk-19.01.1/scripts/rpc.py nvmf_create_transport -t RDMA -u 131072 -p 4 -c 0
	sudo ${root_dir}/lib/spdk-19.01.1/scripts/rpc.py nvmf_subsystem_add_listener nqn.2019-04.ibof:subsystem1 -t RDMA -a 172.16.1.1 -s 1158
        sudo ${root_dir}/lib/spdk-19.01.1/scripts/rpc.py construct_malloc_bdev -b uram0 1024 512 
fi
echo "finish run_ibofos.sh"

