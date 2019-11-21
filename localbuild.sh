#!/bin/bash
go build -mod vendor

if [ ! -d doc ]; then
    mkdir doc
fi
./bin/docgen_html.sh
./bin/docgen_md.sh
sudo ./ibofdagent

