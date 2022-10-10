#!/bin/bash

SCRIPT_PATH=$(readlink -f $(dirname $0))

$SCRIPT_PATH/../src/dagent/script/run_dagent.sh
$SCRIPT_PATH/../src/mtool/script/run_mtool.sh
