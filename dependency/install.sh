#!/bin/bash

SCRIPT_PATH=$(readlink -f $(dirname $0))
cd $SCRIPT_PATH


wget --no-check-certificate -qO- https://repos.influxdata.com/influxdb.key | sudo apt-key add -
source /etc/lsb-release
echo "deb https://repos.influxdata.com/${DISTRIB_ID,,} ${DISTRIB_CODENAME} stable" | sudo tee /etc/apt/sources.list.d/influxdb.list
sudo dpkg --configure -a
sudo apt-get update
sudo apt-get install -y influxdb
sudo apt-get install -y kapacitor
sudo apt-get install -y chronograf
sudo apt-get install -y nginx

sudo service influxdb start
sudo service chronograf start
sudo service kapacitor start

sudo chown -R influxdb:influxdb /var/lib/influxdb

sudo $SCRIPT_PATH/setup_nginx.sh
sudo $SCRIPT_PATH/change_influx_conf.sh
sudo echo "--influxdb-url=http:///0.0.0.0:8086" | sudo tee /usr/share/chronograf/resources/influx.src
pip3 install -r $SCRIPT_PATH/../mtool/requirements.txt
python3 $SCRIPT_PATH/create_retention_policy.py

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


