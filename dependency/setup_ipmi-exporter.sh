#!/bin/bash

if [ ! -s /etc/pos/pos-prometheus.yml ]
then
    echo "Skiping IPMI-Exporter setup"
    exit 1
fi

wget https://github.com/prometheus-community/ipmi_exporter/releases/download/v1.6.1/ipmi_exporter-1.6.1.linux-amd64.tar.gz

tar xvfz ipmi_exporter-1.6.1.linux-amd64.tar.gz

# add PATH
mv ipmi_exporter-1.6.1.linux-amd64/ipmi_exporter /usr/local/bin/

rm -r ipmi_exporter-1.6.1.linux-amd64*

# register ipmi-exporter.service
cp ipmi-exporter.service /lib/systemd/system/

sudo apt install freeipmi-tools -y

systemctl daemon-reload
systemctl enable ipmi-exporter
systemctl start ipmi-exporter

if ! grep -R "ipmi" /etc/pos/pos-prometheus.yml 
then
    cat ipmi-config.yaml >> /etc/pos/pos-prometheus.yml
fi
docker restart pos-prometheus
