#!/bin/bash
go build -mod vendor
mv DAgent ./bin

if [ ! -d doc ]; then
    mkdir doc
fi

cd tool
./docgen_html.sh
./docgen_md.sh
cd ..

cd bin
sudo ./DAgent

