#!/bin/bash

SCRIPT_PATH=$(readlink -f $(dirname $0))
cd $SCRIPT_PATH

if [ $1 ]
then
  if [ $1 = "nas" ]
  then
    sudo dpkg -i $SCRIPT_PATH/ubuntu-packages/libcurl4_7.58.0-2ubuntu3_amd64.deb
    sudo dpkg -i $SCRIPT_PATH/ubuntu-packages/influxdb_1.7.6_amd64.deb
    sudo dpkg -i $SCRIPT_PATH/ubuntu-packages/kapacitor_1.5.2_amd64.deb
    sudo dpkg -i $SCRIPT_PATH/ubuntu-packages/chronograf_1.7.9_amd64.deb
    sudo dpkg -i $SCRIPT_PATH/ubuntu-packages/nginx-common_1.14.0-0ubuntu1_all.deb
    sudo dpkg -i $SCRIPT_PATH/ubuntu-packages/libnginx-mod-http-echo_1.14.0-0ubuntu1_amd64.deb
    sudo dpkg -i $SCRIPT_PATH/ubuntu-packages/nginx-light_1.14.0-0ubuntu1_amd64.deb

    sudo service influxdb start
    sudo service chronograf start
    sudo service kapacitor start

  elif [ $1 = "apt" ]
  then
    wget --no-check-certificate -qO- https://repos.influxdata.com/influxdb.key | sudo apt-key add -
    source /etc/lsb-release
    echo "deb https://repos.influxdata.com/${DISTRIB_ID,,} ${DISTRIB_CODENAME} stable" | sudo tee /etc/apt/sources.list.d/influxdb.list
    sudo dpkg --configure -a
    sudo apt-get update
    sudo apt-get install influxdb
    sudo apt-get install kapacitor
    sudo apt-get install chronograf
    sudo apt-get install nginx

    sudo service influxdb start
    sudo service chronograf start
    sudo service kapacitor start

  else
    echo "Provide nas/apt as argument for installation source"
    exit 0
  fi
else
  echo "Provide nas/apt as argument for installation source"
  exit 0
fi

sudo chown -R influxdb:influxdb /var/lib/influxdb

sudo $SCRIPT_PATH/setup_nginx.sh
sudo $SCRIPT_PATH/change_influx_conf.sh
sudo echo "--influxdb-url=http:///0.0.0.0:8086" | sudo tee /usr/share/chronograf/resources/influx.src
sudo $SCRIPT_PATH/dist/create_retention_policy

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


