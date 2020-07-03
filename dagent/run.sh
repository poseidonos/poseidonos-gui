#!/bin/bash

./build_dagent.sh
sudo pkill -9 dagent
sudo ./bin/dagent
