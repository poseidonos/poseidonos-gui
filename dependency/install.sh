#!/bin/bash

SCRIPT_PATH=$(readlink -f $(dirname $0))
cd $SCRIPT_PATH

if [ $1 ]
then
  if [ $1 = "nas" ]
  then
    sudo dpkg -i $SCRIPT_PATH/ubuntu-packages/libcurl4_7.58.0-2ubuntu3_amd64.deb
    sudo dpkg -i $SCRIPT_PATH/ubuntu-packages/influxdb_1.7.5_amd64.deb
    sudo dpkg -i $SCRIPT_PATH/ubuntu-packages/kapacitor_1.5.2_amd64.deb
    sudo dpkg -i $SCRIPT_PATH/ubuntu-packages/chronograf_1.7.9_amd64.deb
    sudo dpkg -i $SCRIPT_PATH/ubuntu-packages/nginx-common_1.14.0-0ubuntu1_all.deb
    sudo dpkg -i $SCRIPT_PATH/ubuntu-packages/libnginx-mod-http-echo_1.14.0-0ubuntu1_amd64.deb
    sudo dpkg -i $SCRIPT_PATH/ubuntu-packages/nginx-light_1.14.0-0ubuntu1_amd64.deb

    if ! [ -x "$(command -v pip3)" ]; then

      unzip $SCRIPT_PATH/python-packages/setuptools-50.3.0.zip
      cd setuptools-50.3.0
      python3 setup.py install
      cd ..
      rm -r setuptools-50.3.0

      tar -xzvf $SCRIPT_PATH/python-packages/pip-20.2.3.tar.gz
      cd pip-20.2.3
      python3 setup.py build
      python3 setup.py install
      cd ..
      rm -r pip-20.2.3
    else
      echo "Pip is present"
    fi


    sudo service influxdb start
    sudo service chronograf start
    sudo service kapacitor start

    # It should use requirements.txt
    sudo pip3 install --src $SCRIPT_PATH/python-packages msgpack --find-links=$SCRIPT_PATH/python-packages --no-index
    sudo pip3 install $SCRIPT_PATH/python-packages/influxdb-5.3.0-py2.py3-none-any.whl --find-links=$SCRIPT_PATH/python-packages --no-index
    sudo pip3 install $SCRIPT_PATH/python-packages/requests-2.21.0.tar.gz --find-links=$SCRIPT_PATH/python-packages --no-index
  elif [ $1 = "apt" ]
  then
    wget --no-check-certificate -qO- https://repos.influxdata.com/influxdb.key | sudo apt-key add -
    source /etc/lsb-release
    echo "deb https://repos.influxdata.com/${DISTRIB_ID,,} ${DISTRIB_CODENAME} stable" | sudo tee /etc/apt/sources.list.d/influxdb.list
    sudo dpkg --configure -a
    sudo apt-get update
    sudo apt-get install influxdb
    sudo apt-get install kapacitor
    sudo apt-get install chronograf
    sudo apt-get install nginx

    sudo service influxdb start
    sudo service chronograf start
    sudo service kapacitor start

    sudo pip3 install influxdb-client
    sudo pip3 install requests
  else
    echo "Provide nas/apt as argument for installation source"
    exit 0
  fi
else
  echo "Provide nas/apt as argument for installation source"
  exit 0
fi

sudo chown -R influxdb:influxdb /var/lib/influxdb

sudo $SCRIPT_PATH/setup_nginx.sh
sudo $SCRIPT_PATH/change_influx_conf.sh
sudo echo "--influxdb-url=http:///0.0.0.0:8086" | sudo tee /usr/share/chronograf/resources/influx.src
sudo python3 $SCRIPT_PATH/create_retention_policy.py

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


