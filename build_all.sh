#!/bin/bash
cd cli
./build_cli.sh
cd ..

./DAgent/localbuild.sh
./tui/localbuild.sh

