#!/bin/bash

SCRIPT_PATH=$(readlink -f $(dirname $0))
PARENT_SCRIPT_PATH="$(dirname "$SCRIPT_PATH")"

cd $SCRIPT_PATH

sudo systemctl stop magent

#create a soft link of the directory, to get the absolute path for starting the service
sudo service influxdb stop
#$SCRIPT_PATH/change_influx_conf.sh
sudo service influxdb start

echo "Starting InfluxDB.."
sleep 8s
[ ! -d "/tmp/air_result.json" ] && touch /tmp/air_result.json
[ ! -d "/etc/ibofos" ] && mkdir /etc/ibofos
[ ! -d "/etc/ibofos/report" ] && mkdir /etc/ibofos/report
touch /etc/ibofos/report/report.log
#sudo python3 $SCRIPT_PATH/create_retention_policy.py
#sudo chown -R influxdb:influxdb /var/lib/influxdb
sudo rm /usr/local/magent
sudo ln -s $PARENT_SCRIPT_PATH /usr/local

#move the service file  to the /etc/systemd/system/
sudo cp $PWD/magent.service /etc/systemd/system
sudo chmod 664 /etc/systemd/system/magent.service

sudo systemctl daemon-reload
sudo systemctl enable magent.service
sudo systemctl start magent

echo "Starting MAgent...."
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