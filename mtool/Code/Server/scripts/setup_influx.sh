#!/bin/bash



#installing influx db
#wget https://dl.influxdata.com/influxdb/releases/influxdb_1.7.3_amd64.deb
#sudo dpkg -i influxdb_1.7.3_amd64.deb



wget -qO- https://repos.influxdata.com/influxdb.key | sudo apt-key add -
source /etc/lsb-release
echo "deb https://repos.influxdata.com/${DISTRIB_ID,,} ${DISTRIB_CODENAME} stable" | sudo tee /etc/apt/sources.list.d/influxdb.list



sudo apt-get update && sudo apt-get install influxdb
sudo service influxdb start