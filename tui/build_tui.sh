#!/bin/bash

ROOT_DIR=$(readlink -f $(dirname $0))/
cd $ROOT_DIR

cd ../a-module/bin
./go-bindata -o resource.go  -pkg util ../resources/
cd $ROOT_DIR

rm -rf vendor/a-module
cp -rf ../a-module ./vendor/

export GIT_COMMIT_TUI=$(git rev-list -1 HEAD)
export BUILD_TIME_TUI=$(date +%s)
go build -mod vendor -tags ssloff -ldflags "-X tui/src/storage/widget.GitCommit=$GIT_COMMIT_TUI -X tui/src/storage/widget.BuildTime=$BUILD_TIME_TUI"

mkdir -p ./bin
mv tui ./bin
