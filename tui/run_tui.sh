#!/bin/bash

./build_tui.sh
pkill -9 tui
./bin/tui
