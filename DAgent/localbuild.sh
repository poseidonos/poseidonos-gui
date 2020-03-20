#!/bin/bash

wget -q --tries=1 --timeout=3 --spider http://google.com

if [[ $? -eq 0 ]]; then
	echo "Online"
	rm -rf vendor/A-module
        cp -rf ../A-module ./vendor/
else
	echo "Offline"
	rm -rf vendor/A-module
	cp -rf ../A-module ./vendor/
fi

go build -mod vendor
mv DAgent ./bin

if [ ! -d doc ]; then
    mkdir doc
fi

cd tool
./docgen_html.sh
./docgen_md.sh
cd ..

#cd bin
#sudo ./DAgent
