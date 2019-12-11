#!/bin/bash
# 
# run_ibofos.sh
#
sudo nohup /root/workspace/ibofos/script/run_ibofos.sh &
sleep 3
sudo /root/workspace/ibofos/lib/spdk-19.01.1/scripts/rpc.py nvmf_subsystem_create nqn.2019-04.ibof:subsystem1 -a -s IBOF00000000000001
sudo /root/workspace/ibofos/lib/spdk-19.01.1/scripts/rpc.py construct_malloc_bdev -b uram0 1024 512
