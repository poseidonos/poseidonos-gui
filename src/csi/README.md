# POS CSI


## About

This feature contains [POS](https://github.com/poseidonos/poseidonos) CSI (Container Storage Interface) plugin for Kubernetes.

It provisions POS volumes on storage node dynamically and enables Pods to access POS storage backend through NVMe-oF.

This plugin conforms to [CSI Spec v1.7](https://github.com/container-storage-interface/spec/blob/release-1.7/spec.md). It is currently developed and tested only on Kubernetes.


>**WARNING: POS CSI for Kubernetes is an alpha-level preview release for testing and evaluation purposes only, and it should not be deployed in support of production workloads.**

## Table of Contents

  - [APIs Supported](#apis-supported)
  - [Prerequisites](#prerequisites)
  - [Setup](#setup)
    - [How to Build and Run](#how-to-build-and-run)
  - [Usage](#usage)
  - [Deploy POSCSI services](#deploy-poscsi-services)
    - [Prepare POS storage node](#prepare-pos-storage-node)
    - [Teardown](#teardown)
  - [Limitations/Constraints](#limitationsconstraints)

## APIs Supported

* CreateVolume
* DeleteVolume
* ListVolumes
* ControllerGetVolume
* NodeGetVolumeStats
* NodeStageVolume
* NodeUnstageVolume
* NodePublish
* NodeUnpublish
* NodeGetCapabilities
* GetPluginInfo
* GetPluginCapabilities
* Probe


## Prerequisites
1. OS: Ubuntu 18.04
2. RAM: 2GB or greater
3. CPUs: 2 or greater
4. minikube v1.24.0
5. docker v23.0.1
6. kubectl v1.26.3
7. kubeadm v1.26.3
8. go v1.19+
9. Below two docker images should be available in the system, Use docker pull to get these images if the Kubernetes cluster cannot access internet.
   1) docker pull k8s.gcr.io/sig-storage/csi-node-driver-registrar:v2.3.0
   2) docker pull k8s.gcr.io/sig-storage/csi-provisioner:v3.0.0
10.  The Driver assumes POS Array is already created and available.
11. POS version : v1.0.0
12. Supported volume access modes : ReadWriteOnce

13. NVMe/NVMEe-oF kernel modules should be pre-installed on all the nodes in the Kubernetes cluster. Run the below commands on each node before running POS-CSI driver
    1)  modprobe nvme
    2)  modprobe nvme_tcp



## Setup

### How to Build and Run
(Assuming single/multi node cluster is already setup and running, [DAgent](https://github.com/poseidonos/poseidonos-gui/tree/main/src/dagent) is running in POS node)

1) git clone https://github.com/poseidonos/poseidonos-gui.git --branch main
2) cd m9k/src/csi
3) Enable ControllerGetVolume API  (This is a optional step, ListVolumes API is called by default)
      Remove "csi.ControllerServiceCapability_RPC_LIST_VOLUMES" from csi/pkg/pos/driver.go
      The External Health Monitor Controller calls either ListVolumes or ControllerGetVolume CSI RPC
      References:
      https://kubernetes-csi.github.io/docs/volume-health-monitor.html
      https://github.com/kubernetes-csi/external-health-monitor

4) ./build.sh in every node
5) cd deploy/kubernetes (only in master node)
6) change configuration in storageclass.yaml (only in master node)
7) ./deploy.sh (only in master node)
8) kubectl apply -f testpod.yaml
	or
   kubectl apply -f blockpod.yaml

## Usage

Example deployment files can be found in deploy/kubernetes directory.

| File Name            | Usage                                         |
| -------------------- | -----                                         |
| storageclass.yaml    | StorageClass of provisioner "csi.pos.io" and POS storage cluster configurations	       |
| controller.yaml      | StatefulSet running CSI Controller service    |
| node.yaml            | DaemonSet running CSI Node service            |
| controller-rbac.yaml | Access control for CSI Controller service     |
| node-rbac.yaml       | Access control for CSI Node service           |


---




## Deploy POSCSI services
Below example is a simple test system running in a single host or VM.
### Prepare POS storage node
Follow [POSEIDONOS](https://github.com/poseidonos/poseidonos/blob/main/README.md) to deploy Poseidonos storage service.

1. Launch Minikube test cluster(Assuming minikube is already installed)
    ```bash
    $ sudo ./start_cluster.sh

    # Wait for Kubernetes ready
    $ kubectl get pods --all-namespaces
    NAMESPACE     NAME                          READY   STATUS    RESTARTS   AGE
    kube-system   coredns-6955765f44-dlb88      1/1     Running   0          81s
    ......                                              ......
    kube-system   kube-apiserver-poscsi-dev    1/1     Running   0          67s
    ......                                              ......
    ```
2. Configuration
    ```bash
   $ cd m9k/src/csi/deploy/kubernetes
   $ vi storageclass.yaml
    ---
    apiVersion: storage.k8s.io/v1
    kind: StorageClass
    metadata:
      name: poscsi-sc
    provisioner: csi.pos.io
    parameters:
      fsType: ext4
      transportType: "tcp"
      targetAddress: "x.x.x.x" #POS IP
      transportServiceId: "1158"
      provisionerIP: "x.x.x.x" #DAgent IP
      provisionerPort: "3000"
      arrayName: "POSArray"
    reclaimPolicy: Delete
    volumeBindingMode: Immediate
    ```

3. Deploy POS-CSI services
    ```bash
    $ cd deploy/kubernetes
    $ ./deploy.sh

    # Check status
    $ kubectl get pods
    NAME                   READY   STATUS    RESTARTS   AGE
    poscsi-controller-0   5/5     Running   0          1m6s
    poscsi-node-lzvg5     2/2     Running   0          1m6s
    ```
4. Deploy test pod
    ```bash
    $ cd deploy/kubernetes
    $ kubectl apply -f testpod.yaml
    or 
      # raw block device
    $ kubectl apply -f blockpod.yaml
    ```
5. Check status
    ```bash
    $ kubectl get pv
    NAME                       CAPACITY   ...    STORAGECLASS   REASON   AGE
    persistentvolume/pvc-...   256Mi      ...    poscsi-sc               33s

    $ kubectl get pvc
    NAME                                ...   CAPACITY   ACCESS MODES   STORAGECLASS   AGE
    persistentvolumeclaim/poscsi-pvc   ...   256Mi      RWO            poscsi-sc     34s

    $ kubectl get pods
    NAME                   READY   STATUS    RESTARTS   AGE
    poscsi-test-1           1/1     Running   0          1m31s
    ```
### Teardown
1. Delete test pod
    ```bash
    $ cd deploy/kubernetes
    $ kubectl delete -f testpod.yaml
    ```
2. Delete POS-CSI services
    ```bash
    $ cd deploy/kubernetes
    $ ./deploy.sh teardown
    ```
## Limitations/Constraints 
1) POS CSI driver does not support Ephermal volumes.
2) Currently POS-CSI driver supports only ReadWriteOnce access mode.
3) Basic list of mandatory APIs mentioned in the [CSI Spec](https://github.com/container-storage-interface/spec/blob/release-1.7/spec.md) are supported. Complete list of APIs are yet to be supported.
4) Solution testing is done with basic deployment. Extensive deployment testing and benchmarking are yet to be done
 

