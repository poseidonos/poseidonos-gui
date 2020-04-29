#!/bin/bash

ROOT_DIR=$(readlink -f $(dirname $0))/
cd $ROOT_DIR

wget -q --tries=1 --timeout=3 --spider http://google.com

if [[ $? -eq 0 ]]; then
	echo "Online"
	go mod vendor	

else
	echo "Offline"
	rm -rf vendor/A-module
	cp -rf ../A-module ./vendor/
	rm -rf vendor/DAgent
	mkdir vendor/DAgent
	cp -rf ../DAgent/src ./vendor/DAgent/
fi

go build -mod vendor -tags debug,ssloff
#go build -mod vendor -tags release
mv cli bin/

#if [ -d ../../ibofos ]; then
#	cp bin/cli ../../ibofos/tool/cli_client/
#fi

#sudo ./CLI
