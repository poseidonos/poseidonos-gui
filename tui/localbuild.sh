#!/bin/bash

ROOT_DIR=$(readlink -f $(dirname $0))/
cd $ROOT_DIR

rm -rf vendor/A-module
cp -rf ../A-module ./vendor/

export GIT_COMMIT=$(git rev-list -1 HEAD)
export BUILD_TIME=$(date +%s)
go build -mod vendor -tags ssloff -ldflags "-X main.GitCommit=$GIT_COMMIT -X main.BuildTime=$BUILD_TIME"

mkdir -p ./bin
mv tui ./bin
