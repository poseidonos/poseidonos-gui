#!/bin/bash

SCRIPT_PATH=$(readlink -f $(dirname $0))

if [ $1 ]
then
  if [ $1 = "nas" ]
  then
    sudo -H pip3  install --no-index --find-links=$SCRIPT_PATH/python-packages/ -r $SCRIPT_PATH/python-packages/requirements.txt
  elif [ $1 = "apt" ]
  then
    sudo -H pip3 install -r $SCRIPT_PATH/requirements.txt
  else
    echo "Provide nas/apt as argument for installation source"
    exit 0
  fi
else
  echo "Provide nas/apt as argument for installation source"
  exit 0
fi