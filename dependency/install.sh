#!/bin/bash

SCRIPT_PATH=$(readlink -f $(dirname $0))
cd $SCRIPT_PATH

if [ $1 ]
then
if [ $1 = "nas" ]
then
  wget -O /tmp/ibofmgmt_package.tar.gz  http://10.1.5.22/mtool.packages/ibofmgmt_package.tar.gz
  cd /tmp
  chmod 666 ibofmgmt_package.tar.gz
  tar -xzvf ibofmgmt_package.tar.gz
  cd ibofmgmt_package
  chmod 666 -R *
  echo "DONE"
  sudo ./scripts/install.sh

  cd ..
  cd python-packages/
  sudo pip3 install msgpack==0.6.1 -f ./ --no-index
  sudo pip3 install influxdb-5.3.0-py2.py3-none-any.whl -f ./ --no-index
  sudo pip3 install requests-2.21.0.tar.gz -f ./ --no-index

  rm /tmp/ibofmgmt_package.tar.gz
  rm -r /tmp/ibofmgmt_package
elif [ $1 = "apt" ]
then
  wget --no-check-certificate -qO- https://repos.influxdata.com/influxdb.key | sudo apt-key add -
  source /etc/lsb-release
  echo "deb https://repos.influxdata.com/${DISTRIB_ID,,} ${DISTRIB_CODENAME} stable" | sudo tee /etc/apt/sources.list.d/influxdb.list
  sudo dpkg --configure -a
  sudo apt-get update
  sudo apt-get install python3-pip
  sudo apt-get install influxdb
  sudo apt-get install chronograf
  sudo apt-get install kapacitor
  sudo service influxdb start
  sudo service chronograf start
  sudo service kapacitor start
  sudo apt-get install nginx

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

sudo chown -R influxdb:influxdb /var/lib/influxdb

$SCRIPT_PATH/setup_nginx.sh
$SCRIPT_PATH/change_influx_conf.sh
echo "--influxdb-url=http:///0.0.0.0:8086" | sudo tee /usr/share/chronograf/resources/influx.src
sudo python3 $SCRIPT_PATH/create_retention_policy.py

# For uninstalling, comment out the above lines and uncomment below lines
# sudo apt-get purge influxdb
# sudo apt-get purge chronograf
# sudo apt-get purge kapacitor
# sudo apt-get purge nginx
# sudo systemctl stop start-iBofMtool
# sudo systemctl disable start-iBofMtool
# sudo rm /etc/systemd/system/start-iBofMtool.service
# sudo systemctl daemon-reload
# sudo systemctl reset-failed
# sudo rm /usr/local/m9k
# rm -r /root/workspace/m9k


