#!/bin/bash
SCRIPT_PATH=$(readlink -f $(dirname $0))/
cd $SCRIPT_PATH

if [ ! -d ../doc ]; then
    mkdir ../doc
fi

cp ../../kouros/resources/events.yaml ../doc

./docgen_html.sh
./docgen_md.sh
 cd ..
