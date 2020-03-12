#!/bin/bash
rm -rf vendor/A-module
cp -r ../A-module ./vendor/


go build -mod vendor

#sudo ./CLI
