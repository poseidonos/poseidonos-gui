#!/bin/bash

sudo service influxdb stop
sudo service chronograf stop
sudo service kapacitor stop
sudo systemctl stop nginx

sudo apt-get purge influxdb
sudo apt-get purge chronograf
sudo apt-get purge kapacitor
sudo apt-get purge nginx
sudo systemctl stop start-iBofMtool
sudo systemctl disable start-iBofMtool
sudo rm /etc/systemd/system/start-iBofMtool.service
sudo systemctl stop dagent.service
sudo systemctl disable dagent.service
sudo rm /etc/systemd/system/dagent.service
sudo systemctl stop magent.service
sudo systemctl disable magent.service
sudo rm /etc/systemd/system/magent.service
sudo rm /usr/local/mtool
sudo rm /usr/local/magent
sudo rm /usr/local/dagent

