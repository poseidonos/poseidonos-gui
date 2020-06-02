#!/bin/bash

./build_dagent.sh
pkill -9 DAgent
./bin/DAgent
