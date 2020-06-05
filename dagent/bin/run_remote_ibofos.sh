#!/bin/bash
SCRIPT_PATH=$(dirname $(realpath $0))
sshpass -pseb ssh -o StrictHostKeyChecking=no root@$1 "bash -s" < $SCRIPT_PATH/run_ibofos.sh

exit 0
