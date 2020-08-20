#!/bin/bash

SCRIPT_PATH=$(readlink -f $(dirname $0))

$SCRIPT_PATH/dagent/script/run_dagent.sh
$SCRIPT_PATH/magent/script/run_magent.sh
#$SCRIPT_PATH/mtool/scripts/run_mtool.sh
