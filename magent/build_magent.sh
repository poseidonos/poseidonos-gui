#!/bin/bash

ROOT_DIR=$(readlink -f $(dirname $0))/
cd $ROOT_DIR

#cd ../a-module/util
#../bin/go-bindata -o resource.go  -pkg util ../resources/
#cd $ROOT_DIR

#rm -rf vendor/a-module
#cp -rf ../a-module ./vendor/

#export GIT_COMMIT_MAGENT=$(git rev-list -1 HEAD)
#export BUILD_TIME_MAGENT=$(date +%s)

go build -mod vendor 

mv magent ./bin
