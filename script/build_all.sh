#!/bin/bash

SCRIPT_PATH=$(readlink -f $(dirname $0))

$SCRIPT_PATH/../src/dagent/script/build_dagent.sh

if [ ! -d $SCRIPT_PATH/../src/mtool/api/public ]
then
    mkdir $SCRIPT_PATH/../src/mtool/api/public
fi

cd $SCRIPT_PATH/../src/mtool/ui
npm install --legacy-peer-deps
npm run build
cp -r build/* ../api/public
