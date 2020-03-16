#!/bin/bash
rm -rf vendor/A-module
cp -r ../A-module ./vendor/

go build -mod vendor -tags debug
#go build -mod vendor -tags release

cp cli ../../ibofos/bin/

#sudo ./CLI
