#!/bin/bash

ROOT_DIR=$(readlink -f $(dirname $0))
cd $ROOT_DIR

if [ $1 ]
then
if [ $1 = "nas" ]
then
  wget -O /tmp/ibofmgmt_package.tar.gz  http://10.1.5.22/mtool.packages/ibofmgmt_package.tar.gz
  cd /tmp
  chmod 777 ibofmgmt_package.tar.gz
  tar -xzvf ibofmgmt_package.tar.gz
  chmod 777 -R *
  echo "DONE"
  cd $ROOT_DIR
  sudo -H pip3  install --no-index --find-links=/tmp/ibofmgmt_package/python-packages/ -r ../requirements.txt
  rm /tmp/ibofmgmt_package.tar.gz
  rm  -r /tmp/ibofmgmt_package
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
. ../scripts/change_influx_conf.sh
sudo python3 ../scripts/create_retention_policy.py
sudo chown -R influxdb:influxdb /var/lib/influxdb
