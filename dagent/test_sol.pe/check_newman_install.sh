#!/bin/bash

ROOT_DIR=$(readlink -f $(dirname $0))/
cd $ROOT_DIR

newman=$(npm ls -g --depth 0)

if [[ ! $newman =~ "newman" ]]; then
	echo "no newman"
	apt-get install -y ./nodejs_10.21.0-1nodesource1_amd64.deb
	apt-get install -y npm
	npm config set registry http://10.227.253.89:8081/artifactory/api/npm/npm/
	npm -g install newman
fi
