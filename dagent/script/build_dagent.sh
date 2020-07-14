#!/bin/bash

SCRIPT_PATH=$(readlink -f $(dirname $0))/

cd $SCRIPT_PATH

cd ..
rm -rf ./vendor/a-module
cp -rf ../a-module ./vendor/

export GIT_COMMIT_DAGENT=$(git rev-list -1 HEAD)
export BUILD_TIME_DAGENT=$(date +%s)

go build -mod vendor -tags ssloff -ldflags "-X dagent/src/routers/m9k/api/dagent.GitCommit=$GIT_COMMIT_DAGENT -X dagent/src/routers/m9k/api/dagent.BuildTime=$BUILD_TIME_DAGENT"

mv dagent ./bin
