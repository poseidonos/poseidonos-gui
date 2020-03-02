#!/bin/bash
go build -mod vendor
mv ibofdagent ./bin

if [ ! -d doc ]; then
    mkdir doc
fi

cd tool
./docgen_html.sh
./docgen_md.sh
cd ..

cd bin
sudo ./ibofdagent

