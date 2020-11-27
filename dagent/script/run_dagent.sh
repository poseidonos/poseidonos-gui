#!/bin/bash

SCRIPT_PATH=$(readlink -f $(dirname $0))
PARENT_SCRIPT_PATH="$(dirname "$SCRIPT_PATH")"
sudo mkdir -p /var/log/m9k/

if [ -e "/etc/systemd/system/dagent.service" ]; then
  sudo systemctl stop dagent
fi

#create a soft link of the directory, to get the absolute path for starting the service
if [ -e "/usr/local/dagent" ]; then
  sudo rm /usr/local/dagent
fi
sudo ln -s $PARENT_SCRIPT_PATH /usr/local

#move the service file  to the /etc/systemd/system/
sudo cp $SCRIPT_PATH/dagent.service /etc/systemd/system
sudo chmod 664 /etc/systemd/system/dagent.service

sudo systemctl daemon-reload
sudo systemctl enable dagent.service
sudo systemctl start dagent

echo "Starting DAgent..."
sleep 8s
echo "Checking Status..."

x=`systemctl is-active dagent.service`

if [ $x = "active" ]
then
  echo "DAgent Service Started Succesfully"
else
  sleep 90s
  if [ $x = "active" ]
  then
    echo "DAgent Service Started Successfully"
  else
    echo "DAgent Service Failed to Start"
  fi
fi
