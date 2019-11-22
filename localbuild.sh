#!/bin/bash
go build -mod vendor

if [ ! -d doc ]; then
    mkdir doc
fi
cd tool
./docgen_html.sh
./docgen_md.sh
cd ..
sudo ./ibofdagent

