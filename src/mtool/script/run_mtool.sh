#!/bin/bash

ROOT_DIR=$(readlink -f $(dirname $0))
#cd $ROOT_DIR        #/mtool/script
#echo $ROOT_DIR
#cd ..               #/mtool


. ~/.bashrc

#currdir=$PWD               #
currdir=$ROOT_DIR/..        #/mtool
#echo $currdir


if [ ! -d $currdir"/api/public" ]
then
    mkdir $currdir"/api/public"
fi

#Configuring nginx
sudo find /usr/share/nginx/html/ ! -name 'index.nginx-debian.html' -type f -exec rm -f {} +
if [ -d "/usr/share/nginx/html/static" ]
then
sudo rm -r /usr/share/nginx/html/static
fi
if [ -d "/usr/share/nginx/html" ]
then
    sudo cp -r $currdir/api/public/* /usr/share/nginx/html/
fi
#python3 scripts/nginx_form_conf.py
#sudo cp virtual.conf /etc/nginx/conf.d/

#sudo nginx -t
#sudo systemctl restart nginx

#create log files for the service
sudo touch /var/log/logmtool1.log
sudo touch /var/log/logmtool2.log
sudo chmod 777 /var/log/logmtool1.log
sudo chmod 777 /var/log/logmtool2.log

#give permission to sqlite db
if [ -e "$currdir/api/dist/ibof.db" ]; then
   sudo chmod 777 $currdir/api/dist/ibof.db
fi

#give permission to cleanup.sh
sudo chmod +x $currdir/script/cleanup.sh

#create a soft link for the folder , to get absolute path for starting service
if [ -L "/usr/local/mtool" ]; then
  sudo rm /usr/local/mtool
fi
parentdir="$(dirname $ROOT_DIR)"
sudo ln -s $parentdir /usr/local

if [ ! -d $currdir"/api/public/log" ]
then
   sudo mkdir $currdir/api/public/log
fi

#move the service file  to the /etc/systemd/system/
echo "Stopping MTool service if already present"
if [ -e "/etc/systemd/system/start-iBofMtool.service" ]; then
  sudo systemctl stop start-iBofMtool
fi

echo "Starting MTool Service"
sudo cp $currdir/script/start-iBofMtool.service /etc/systemd/system/
sudo chmod 664 /etc/systemd/system/start-iBofMtool.service

sudo systemctl daemon-reload
sudo systemctl enable start-iBofMtool.service
sudo systemctl start start-iBofMtool

echo "Starting MTOOL...."
sleep 8s
echo "checking status..."

x=`systemctl is-active start-iBofMtool.service`
if [ $x = "active" ]
then
        echo Mtool  started  succesfully

else
        echo Mtool  failed to start

fi

#echo $currdir      #/mtool

#python3 PreConfiguredAlerts.py #Set Kapacitor Pre-Configured Alerts...Kapacitor takes sometime to load its resources.. Adding this statement at the end...
