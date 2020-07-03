#!/bin/bash

ROOT_DIR=$(readlink -f $(dirname $0))
cd $ROOT_DIR

if [ $1 ]
then
if [ $1 = "nas" ]
then
  wget -O /tmp/ibofmgmt_package.tar.gz  http://10.1.5.22/mtool.packages/ibofmgmt_package.tar.gz
  cd /tmp/
  chmod 666 ibofmgmt_package.tar.gz
  tar -xzvf ibofmgmt_package.tar.gz
  cd ibofmgmt_package
  chmod 666 -R *
  echo "DONE"
  dpkg -s influxdb &>/dev/null
  if [ $? -eq 0 ]; then
          echo "InfluxDB is already Present"
  else
          sudo dpkg -i ubuntu-packages/influxdb_1.7.5_amd64.deb
  fi
  dpkg -s python3 &>/dev/null
  if [ $? -eq 0 ]; then
          echo "python3 is already Present"
  else
          cd ubuntu-packages
          tar -xzvf Python-3.8.3.tgz
          cd Python-3.8.3
          ./configure --enable-optimizations
          sudo make install
          cd ../..
  fi
  sudo dpkg -i ubuntu-packages/python3-pip_1.5.6-5_all.deb
  cd python-packages/
  sudo pip3 install msgpack==0.6.1 -f ./ --no-index
  sudo pip3 install influxdb-5.3.0-py2.py3-none-any.whl -f ./ --no-index
  sudo pip3 install requests-2.21.0.tar.gz -f ./ --no-index
  cd ..
  rm /tmp/ibofmgmt_package.tar.gz
  rm -r /tmp/ibofmgmt_package
elif [ $1 = "apt" ]
then
  dpkg -s influxdb &>/dev/null
  if [ $? -eq 0 ]; then
          echo "InfluxDB is already Present"
  else
          wget --no-check-certificate -qO- https://repos.influxdata.com/influxdb.key | sudo apt-key add -
          source /etc/lsb-release
          echo "deb https://repos.influxdata.com/${DISTRIB_ID,,} ${DISTRIB_CODENAME} stable" | sudo tee /etc/apt/sources.list.d/influxdb.list
          sudo dpkg --configure -a
          sudo apt-get update
          sudo apt-get install influxdb
  fi
  dpkg -s python3 &>/dev/null
  if [ $? -eq 0 ]; then
          echo "python3 is already Present"
  else
          sudo apt-get install python3
  fi
  sudo apt-get install python3-pip
  sudo pip3 install influxdb-client
  sudo pip3 install requests
else
  echo "Provide nas/apt as argument for installation source"
  exit 0
fi
else
  echo "Provide nas/apt as argument for installation source"
  exit 0
fi

                     
