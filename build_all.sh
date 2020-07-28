#!/bin/bash

SCRIPT_PATH=$(readlink -f $(dirname $0))/

$SCRIPT_PATH/a-module/script/build_resource.sh
$SCRIPT_PATH/cli/script/build_cli.sh
$SCRIPT_PATH/dagent/script/build_dagent.sh
$SCRIPT_PATH/tui/script/build_tui.sh
$SCRIPT_PATH/magent/script/build_magent.sh
