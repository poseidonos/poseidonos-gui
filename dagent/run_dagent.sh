#!/bin/bash

./build_dagent.sh
pkill -9 dagent
./bin/dagent
