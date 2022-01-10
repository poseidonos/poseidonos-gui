#!/bin/bash

minikube start --driver=none
make -C . spdkcsi
cp _out/spdkcsi deploy/image/
cd deploy/image
docker build . -t poscsi
minikube image load poscsi
minikube image load k8s.gcr.io/sig-storage/csi-node-driver-registrar:v2.3.0
minikube image load k8s.gcr.io/sig-storage/csi-provisioner:v3.0.0
