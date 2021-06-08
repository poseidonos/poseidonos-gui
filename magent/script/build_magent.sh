#!/bin/bash
SCRIPT_PATH=$(readlink -f $(dirname $0))/
cd $SCRIPT_PATH

cd ..
go build -mod vendor
if [ -d "bin" ]
then
   rm -rf ./bin
fi
mkdir bin
mv magent ./bin
