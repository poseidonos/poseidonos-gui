#!/bin/bash

SCRIPT_PATH=$(readlink -f $(dirname $0))
PARENT_SCRIPT_PATH="$(dirname "$SCRIPT_PATH")"
sudo mkdir -p /var/log/m9k/
if [ -e "/etc/systemd/system/magent.service" ]; then
  sudo systemctl stop magent
fi

#create a soft link of the directory, to get the absolute path for starting the service
if [ -L "/usr/local/magent" ]; then
  sudo rm /usr/local/magent
fi
sudo ln -s $PARENT_SCRIPT_PATH /usr/local

#move the service file  to the /etc/systemd/system/
sudo cp $SCRIPT_PATH/magent.service /etc/systemd/system
sudo chmod 664 /etc/systemd/system/magent.service

sudo service influxdb stop
sudo service influxdb start

echo "Starting InfluxDB..."
sleep 8s
[ ! -d "/tmp/air_result.json" ] && sudo touch /tmp/air_result.json
[ ! -d "/var/log/ibofos" ] && sudo mkdir /var/log/ibofos
sudo touch /var/log/ibofos/report.log

sudo systemctl daemon-reload
sudo systemctl enable magent.service
sudo systemctl start magent

echo "Starting MAgent..."
sleep 8s
echo "Checking Status..."

x=`systemctl is-active magent.service`
if [ $x = "active" ]
then
  echo "MAgent Service Started Succesfully"
else
  sleep 90s
  if [ $x = "active" ]
  then
    echo "MAgent Service Started Successfully"
  else
    echo "MAgent Service Failed to Start"
  fi
fi
