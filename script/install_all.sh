#!/bin/bash

SCRIPT_PATH=$(readlink -f $(dirname $0))

$SCRIPT_PATH/../dependency/install.sh
$SCRIPT_PATH/../src/dagent/dependency/install.sh
