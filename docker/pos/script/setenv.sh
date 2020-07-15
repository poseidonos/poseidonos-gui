#!/bin/bash

#set cert for ds repo
mkdir -p /usr/share/ca-certificates/extra
cp /root/etc/dscert.cer /usr/share/ca-certificates/extra/.
dpkg-reconfigure ca-certificates

#set kernel source
#mkdir -p /lib/modules/5.3.0-19-generic/
#ln -s /usr/src/linux-headers-5.3.0-19-generic/ /lib/modules/5.3.0-19-generic/build
