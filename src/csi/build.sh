#!/bin/bash

make -C . poscsi
cp _out/poscsi deploy/image/
cd deploy/image
docker build . -t poscsi
if [[ -f poscsi.tar ]]; then
  rm poscsi.tar
fi
docker save poscsi -o poscsi.tar
chmod +x poscsi.tar
ctr -n=k8s.io images import poscsi.tar
docker load < poscsi.tar
