#!/bin/bash
rm -rf vendor/A-module
rm -rf vendor/DAgent
mkdir vendor/DAgent
cp -rf ../A-module ./vendor/
cp -rf ../DAgent/src ./vendor/DAgent/

go build -mod vendor -tags debug
#go build -mod vendor -tags release

cp cli ../../ibofos/tool/cli_client/

#sudo ./CLI
