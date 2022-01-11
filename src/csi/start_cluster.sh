#!/bin/bash
minikube start --driver=none
minikube image load poscsi
minikube image load k8s.gcr.io/sig-storage/csi-node-driver-registrar:v2.3.0
minikube image load k8s.gcr.io/sig-storage/csi-provisioner:v3.0.0

