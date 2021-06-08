#!/bin/bash

SCRIPT_PATH=$(readlink -f $(dirname $0))

$SCRIPT_PATH/dependency/install.sh
$SCRIPT_PATH/dagent/dependency/install.sh
$SCRIPT_PATH/magent/dependency/install.sh
