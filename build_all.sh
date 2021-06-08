#!/bin/bash

SCRIPT_PATH=$(readlink -f $(dirname $0))

$SCRIPT_PATH/dagent/script/build_dagent.sh
$SCRIPT_PATH/magent/script/build_magent.sh
