#!/bin/bash

echo "Get pos sources and change to the devel branch."
echo ""

git clone http://10.227.30.174:7990/scm/ibof/ibofos.git /root/workspace/ibofos
cd /root/workspace/ibofos/script
git checkout devel
./pkgdep.sh
./build_ibofos.sh

echo ""
echo "Set root password"
echo ""

passwd
