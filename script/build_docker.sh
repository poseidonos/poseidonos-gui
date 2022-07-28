#!/bin/bash

if [ $EUID -ne 0 ]; then
echo "please run as root"
exit
fi

SCRIPT_PATH=$(readlink -f $(dirname $0))

$SCRIPT_PATH/../src/dagent/script/build_dagent.sh
$SCRIPT_PATH/../src/magent/script/build_magent.sh

if [ ! -d $SCRIPT_PATH/../src/mtool/api/public ]
then
    mkdir $SCRIPT_PATH/../src/mtool/api/public
fi

cd $SCRIPT_PATH/../src/mtool/ui
npm install
npm run build
cp -r build/* public/

cd $SCRIPT_PATH/../src
docker-compose -f docker-compose-build.yml build
