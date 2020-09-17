#!/bin/bash
SCRIPT_PATH=$(readlink -f $(dirname $0))/
cd $SCRIPT_PATH

if [ ! -d doc ]; then
    mkdir doc
fi

cp ../../a-module/resources/events.yaml ./

cd tool
./docgen_html.sh
./docgen_md.sh
 cd ..
