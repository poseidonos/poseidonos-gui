#!/bin/bash

echo "Get m9k sources and change to the devel branch."
echo ""

git clone http://10.227.30.174:7990/scm/ibof/m9k.git /root/workspace/m9k
cd /root/workspace/m9k
git checkout devel

./build_all.sh

#echo ""
#echo "Set root password"
#echo ""

#passwd
