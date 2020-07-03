#!/bin/bash

./build_magent.sh
pkill -9 magent
sudo ./bin/magent
