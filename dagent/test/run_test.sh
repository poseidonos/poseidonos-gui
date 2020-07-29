#!/bin/bash

SCRIPT_PATH=$(readlink -f $(dirname $0))/
cd $SCRIPT_PATH

newman run --delay-request 5000  Basic-Logic.postman_collection.json -e Local.postman_environment.json -r junit --reporter-junit-export result.xml

exit 0
