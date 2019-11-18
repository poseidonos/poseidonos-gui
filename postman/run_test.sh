#!/bin/bash

newman run test/sample_test.json -e Test.postman_environment.json -r junit --reporter-junit-export ./result.xml

exit 0
