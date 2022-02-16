#!/bin/bash

kubectl delete -f testpod.yaml
#kubectl delete -f blockpod.yaml
./deploy.sh teardown
#minikube delete
