#!/bin/bash

./localbuild.sh
pkill -9 DAgent
./bin/DAgent
