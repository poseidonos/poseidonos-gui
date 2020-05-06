#!/bin/bash

ROOT_DIR=$(readlink -f $(dirname $0))/
cd $ROOT_DIR

export GOROOT="$ROOT_DIR../../lib/go"
export GOPATH="$ROOT_DIR../"
export PATH=$GOPATH/bin:$GOROOT/bin:$PATH

:<<END
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
END

go build -mod vendor -tags debug,ssloff
