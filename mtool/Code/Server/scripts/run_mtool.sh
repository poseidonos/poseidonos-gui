sudo service kapacitor stop
sudo service influxdb stop
#Set Influx ENV Variable

. ~/.bashrc

currdir=$PWD

sudo service influxdb start
sudo service kapacitor start

#Configuring nginx
sudo find /usr/share/nginx/html/ ! -name 'index.nginx-debian.html' -type f -exec rm -f {} +
if [ -d "/usr/share/nginx/html/static" ] 
then 
sudo rm -r /usr/share/nginx/html/static
fi
sudo cp -r ./public/* /usr/share/nginx/html/
python3 scripts/nginx_form_conf.py
sudo cp virtual.conf /etc/nginx/conf.d/

sudo nginx -t
sudo systemctl restart nginx

#create log files for the service
sudo touch /var/log/logmtool1.log
sudo touch /var/log/logmtool2.log
sudo chmod 777 /var/log/logmtool1.log
sudo chmod 777 /var/log/logmtool2.log

#create a soft link for the folder , to get absolute path for starting service
sudo rm /usr/local/m9k
parentdir="$(dirname "$currdir")"
echo $parentdir
sudo ln -s $parentdir /usr/local

#move the service file  to the /etc/systemd/system/
sudo cp $PWD/scripts/start-iBofMtool.service /etc/systemd/system/
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
#Run sudo -s at the end always
sudo -s
. ~/.bashrc
