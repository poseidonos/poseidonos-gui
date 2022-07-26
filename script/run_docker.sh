#!/bin/bash

if [ $EUID -ne 0 ]; then
echo "please run as root"
exit
fi

SCRIPT_PATH=$(readlink -f $(dirname $0))

service nginx stop
fuser -k 80/tcp
fuser -k 8086/tcp
fuser -k 9092/tcp
fuser -k 5000/tcp

cd $SCRIPT_PATH/../src
docker-compose -f docker-compose-run.yml up
