#!/bin/bash

SCRIPT_PATH=$(readlink -f $(dirname $0))

$SCRIPT_PATH/../src/dagent/script/build_dagent.sh
$SCRIPT_PATH/../src/magent/script/build_magent.sh
cd $SCRIPT_PATH/../src/mtool/ui
npm run build
cp -r build/* ../api/public
