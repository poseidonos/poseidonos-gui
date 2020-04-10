#!/bin/bash

newman run base_test.json -e D-Agent.postman_environment.json -r junit --reporter-junit-export result.xml

exit 0
