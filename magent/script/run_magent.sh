#!/bin/bash
currdir=$(readlink -f $(dirname $0))
cd $currdir
parentdir="$(dirname "$currdir")"
x=`systemctl is-active magent.service`

if [ $x = "active" ]
then
        echo MAgent service is already running!
else
	#create a soft link of the directory, to get the absolute path for starting the service
	sudo service influxdb stop
	. ./change_influx_conf.sh
	sudo service influxdb start
	echo "Starting InfuxDB.."
	sleep 8s
	sudo python3 ./create_retention_policy.py
	sudo chown -R influxdb:influxdb /var/lib/influxdb
	sudo rm /usr/local/magent
	sudo ln -s $parentdir /usr/local

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
  	echo MAgent Service Started Succesfully
	else
		sleep 90s
		if [ $x = "active" ]
		then
			echo MAgent Service Started Successfully
		else
        		echo MAgent Service Failed to Start!
		fi
	fi
fi