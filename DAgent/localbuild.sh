#!/bin/bash

ROOT_DIR=$(readlink -f $(dirname $0))/
cd $ROOT_DIR

wget -q --tries=1 --timeout=3 --spider http://google.com

if [[ $? -eq 0 ]]; then
	echo "Online"
	rm -rf vendor/A-module
        cp -rf ../A-module ./vendor/
else
	echo "Offline"
	rm -rf vendor/A-module
	cp -rf ../A-module ./vendor/
fi

go build -mod vendor -tags ssloff
mv DAgent ./bin

if [ ! -d doc ]; then
    mkdir doc
fi
