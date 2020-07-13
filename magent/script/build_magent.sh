#!/bin/bash

SCRIPT_PATH=$(readlink -f $(dirname $0))/

cd $SCRIPT_PATH
cd ..
go build -mod vendor
if [ ! -d "bin" ] 
then
	mkdir bin
fi
mv magent bin
