#!/bin/bash

ROOT_DIR=$(readlink -f $(dirname $0))
cd $ROOT_DIR

if [ $1 ]
then
if [ $1 = "nas" ]
then
  sudo -H pip3  install --no-index --find-links=../../dependency/python-packages/ -r ../requirements.txt
elif [ $1 = "apt" ]
then
  sudo -H pip3  install -r ../requirements.txt
else
  echo "Provide nas/apt as argument for installation source"
  exit 0
fi
else
  echo "Provide nas/apt as argument for installation source"
  exit 0
fi

cd $ROOT_DIR
#Changing retention Policy

