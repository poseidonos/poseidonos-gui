#!/bin/bash

SCRIPT_PATH=$(readlink -f $(dirname $0))/

cd $SCRIPT_PATH

cd ..
go build -mod vendor

rm -rf ./bin
mkdir bin
mv magent ./bin
