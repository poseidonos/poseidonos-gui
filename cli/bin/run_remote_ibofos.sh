#!/bin/bash

ROOT_DIR=$(readlink -f $(dirname $0))/
cd $ROOT_DIR

sshpass -pseb ssh -o StrictHostKeyChecking=no root@$1 "bash -s" < ../../DAgent/bin/run_ibofos.sh

exit 0
