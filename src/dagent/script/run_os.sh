#!/bin/bash

ROOT_DIR=/usr/local
logfile=pos.log
binary_name=poseidonos

pkill -9 poseidonos
pkill -9 ibofos # temporary line 
sleep 2
rm -rf /dev/shm/ibof_nvmf_trace*

execute_ibofos()
{
    if [ -f ${ROOT_DIR}/bin/$binary_name ];
    then
        echo "Execute poseidonos"
        nohup ${ROOT_DIR}/bin/$binary_name &>> ${logfile} &
    else
        echo "No executable poseidonos file"
        exit -1
    fi
}

check_started()
{
    result=`${ROOT_DIR}/bin/poseidonos-cli system info --json-res | jq '.Response.data.version' 2>/dev/null`

    if [ -z ${result} ] || [ ${result} == '""' ];
    then
        return 0
    else
        return 1
    fi
}

wait_started()
{
    check_started
    while [ $? -eq 0 ];
    do
        echo "Wait poseidonos"
        sleep 0.5
        check_started
    done
}

if [[ ! -z "$1" ]];then
    binary_name=$1
fi

execute_ibofos
wait_started

echo "poseidonos is running in background...logfile=${logfile}"
