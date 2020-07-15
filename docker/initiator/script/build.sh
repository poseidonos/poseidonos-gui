#!/bin/bash

echo "Get pos sources and change to the devel branch."
echo ""

git clone http://10.227.30.174:7990/scm/ibof/ibofos.git /root/workspace/ibofos
cd /root/workspace/ibofos
git checkout devel
cp /root/script/npor_quick_test.sh /root/workspace/ibofos/script/

#echo ""
#echo "Set root password"
#echo ""

#passwd
