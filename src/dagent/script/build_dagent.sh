#!/bin/bash
SCRIPT_PATH=$(readlink -f $(dirname $0))/
cd $SCRIPT_PATH

cd ..
rm -rf ./vendor/pnconnector
cp -rf ../pnconnector ./vendor/

rm -rf ./vendor/kouros
cp -rf ../kouros ./vendor/

cp ../kouros/resources/events.yaml ./doc

export GIT_COMMIT_DAGENT=$(git rev-list -1 HEAD)
export BUILD_TIME_DAGENT=$(date +%s)
go mod vendor
go build -mod vendor -tags ssloff -ldflags "-X dagent/src/routers/m9k/api/dagent.GitCommit=$GIT_COMMIT_DAGENT -X dagent/src/routers/m9k/api/dagent.BuildTime=$BUILD_TIME_DAGENT"

if [ -d "bin" ]
then
   rm -rf ./bin
fi
mkdir bin
mv dagent ./bin
cp config.yaml ./bin
