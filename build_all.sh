#!/bin/bash

SCRIPT_PATH=$(readlink -f $(dirname $0))

$SCRIPT_PATH/pnconnector/script/build_resource.sh
$SCRIPT_PATH/dagent/script/build_dagent.sh
$SCRIPT_PATH/magent/script/build_magent.sh
$SCRIPT_PATH/mtool/scripts/build_mtool.sh
$SCRIPT_PATH/dependency/build_python_scripts.sh
