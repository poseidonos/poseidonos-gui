#!/bin/bash
wget -q --tries=1 --timeout=3 --spider http://google.com

if [[ $? -eq 0 ]]; then
	echo "Online"
	go mod vendor	

else
	echo "Offline"
	rm -rf vendor/A-module
	cp -rf ../A-module ./vendor/
fi

rm -rf vendor/DAgent
mkdir vendor/DAgent
cp -rf ../DAgent/src ./vendor/DAgent/

go build -mod vendor -tags debug
#go build -mod vendor -tags release

cp cli ../../ibofos/tool/cli_client/

#sudo ./CLI
