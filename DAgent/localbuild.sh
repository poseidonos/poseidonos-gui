#!/bin/bash

ROOT_DIR=$(readlink -f $(dirname $0))/
cd $ROOT_DIR

rm -rf vendor/A-module
cp -rf ../A-module ./vendor/

go build -mod vendor -tags ssloff
mv DAgent ./bin
cp statuscode.json ./bin
