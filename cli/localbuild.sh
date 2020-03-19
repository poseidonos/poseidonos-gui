#!/bin/bash
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

go build -mod vendor -tags debug
#go build -mod vendor -tags release


if [ -d ../../ibofos ]; then
	cp cli ../../ibofos/tool/cli_client/
fi

#sudo ./CLI
