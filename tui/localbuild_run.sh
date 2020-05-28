#!/bin/bash

./localbuild.sh
pkill -9 tui
./bin/tui
