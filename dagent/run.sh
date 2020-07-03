#!/bin/bash

./build_dagent.sh
sudo pkill -9 dagent
./bin/dagent
