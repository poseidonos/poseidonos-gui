#!/bin/bash

SCRIPT_PATH=$(readlink -f $(dirname $0))/

cd $SCRIPT_PATH

cd ..
rm -rf ./vendor/a-module
cp -rf ../a-module ./vendor/

export GIT_COMMIT_TUI=$(git rev-list -1 HEAD)
export BUILD_TIME_TUI=$(date +%s)

go build -mod vendor -ldflags "-X dagent/src/routers/m9k/api/dagent.GitCommit=$GIT_COMMIT_TUI -X dagent/src/routers/m9k/api/dagent.BuildTime=$BUILD_TIME_TUI"

rm -rf ./bin
mkdir bin
mv tui ./bin
