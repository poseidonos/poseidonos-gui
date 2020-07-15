#!/bin/bash

#set cert for ds repo
mkdir -p /usr/share/ca-certificates/extra
cp /root/etc/dscert.cer /usr/share/ca-certificates/extra/.
dpkg-reconfigure ca-certificates
