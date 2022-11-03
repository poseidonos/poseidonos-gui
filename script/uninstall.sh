#!/bin/bash

sudo systemctl stop nginx

sudo apt-get purge nginx
sudo systemctl stop grafana-server
sudo apt-get purge grafana
while true; do
            read -p "Do you wish to delete the GrafanaDB? [Y/n] " yn
            case $yn in
                [Yy]* ) rm /var/lib/grafana/grafana.db; break;;
                [Nn]* ) break;;
                * ) echo "Please answer Y for yes or n for no.";;
            esac
        done
sudo systemctl stop start-iBofMtool
sudo systemctl disable start-iBofMtool
sudo rm /etc/systemd/system/start-iBofMtool.service
sudo systemctl stop dagent.service
sudo systemctl disable dagent.service
sudo rm /etc/systemd/system/dagent.service
sudo rm /usr/local/mtool
sudo rm /usr/local/dagent

