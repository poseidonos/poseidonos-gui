#!/bin/bash

./build_tui.sh
sudo pkill -9 tui
sudo ./bin/tui
