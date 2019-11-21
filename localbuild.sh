#!/bin/bash
go build -mod vendor

if [ ! -d doc ]; then
    mkdir doc
fi
cd bin
./docgen_html.sh
./docgen_md.sh
cd ..
sudo ./ibofdagent

