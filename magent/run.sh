#!/bin/bash

./build_magent.sh
pkill -9 magent
./bin/magent
