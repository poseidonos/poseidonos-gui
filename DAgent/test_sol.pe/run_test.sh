#!/bin/bash

ROOT_DIR=$(readlink -f $(dirname $0))/
cd $ROOT_DIR

newman run --delay-request 5000  "Base Test.postman_collection.json" -e D-Agent.postman_environment.json -r junit --reporter-junit-export result.xml

exit 0
