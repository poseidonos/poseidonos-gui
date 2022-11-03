#!/bin/bash

SCRIPT_PATH=$(readlink -f $(dirname $0))
cd $SCRIPT_PATH


source /etc/lsb-release
sudo dpkg --configure -a
sudo apt-get update
sudo apt-get install -y nginx
sudo apt-get install -y python3-pip
sudo apt-get install -y jq


sudo $SCRIPT_PATH/setup_nginx.sh
pip3 install -r $SCRIPT_PATH/requirements.txt

sudo $SCRIPT_PATH/install_grafana.sh "${RESET_GRAFANA}"

# For uninstalling, comment out the above lines and uncomment below lines
# sudo apt-get purge nginx
# sudo systemctl stop start-iBofMtool
# sudo systemctl disable start-iBofMtool
# sudo rm /etc/systemd/system/start-iBofMtool.service
# sudo systemctl daemon-reload
# sudo systemctl reset-failed
# sudo rm /usr/local/m9k
# rm -r /root/workspace/m9k


