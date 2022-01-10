# SPDK CSI

## About

This repo contains SPDK CSI ([Container Storage Interface](https://github.com/container-storage-interface/)) plugin for Kubernetes.

SPDK CSI plugin brings SPDK to Kubernetes. It provisions SPDK logical volumes on storage node dynamically and enables Pods to access SPDK storage backend through NVMe-oF or iSCSI.

Please see [SPDK CSI Design Document](https://docs.google.com/document/d/1aLi6SkNBp__wjG7YkrZu7DdhoftAquZiWiIOMy3hskY/) for detailed introduction.

## Supported platforms

This plugin conforms to [CSI Spec v1.1.0](https://github.com/container-storage-interface/spec/blob/v1.1.0/spec.md). It is currently developed and tested only on Kubernetes.

This plugin supports `x86_64` and `Arm64` architectures.

## Project status

Status: **Beta**

## Prerequisites

SPDK-CSI is currently developed and tested with `Go 1.14`, `Docker 19.03` and `Kubernetes 1.19.3` on `Ubuntu 18.04`.

Minimal requirement: Go 1.12+(supports Go module), Docker 18.03+ and Kubernetes 1.13+(supports CSI spec 1.0).

## Setup

### Build

- `$ make all`
Build targets spdkcsi, lint, test.

- `$ make spdkcsi`
Build SPDK-CSI binary `_out/spdkcsi`.

- `$ make lint`
Lint code and scripts.
  - `$ make golangci`
Install [golangci-lint](https://github.com/golangci/golangci-lint) and perform various go code static checks.
  - `$ make yamllint`
Lint yaml files if yamllint is installed. Requires yamllint 1.10+.

- `$ make test`
Verify go modules and run unit tests. Requires SPDK target and JsonRPC HTTP proxy running on localhost. See [deploy/spdk/README](deploy/spdk/README.md) for details.

- `$ make e2e-test`
Verify core features through Kubernetes end-to-end (e2e) test.

- `$ make image`
Build SPDK-CSI docker image.

### Parameters

`spdkcsi` executable accepts several command line parameters.

| Parameter      | Type   | Description               | Default           |
| ---------      | ----   | -----------               | -------           |
| `--controller` | -      | enable controller service | -                 |
| `--node`       | -      | enable node service       | -                 |
| `--endpoint`   | string | communicate with sidecars | /tmp/spdkcsi.sock |
| `--drivername` | string | driver name               | csi.spdk.io       |
| `--nodeid`     | string | node id                   | -                 |

## Usage

Example deployment files can be found in deploy/kubernetes directory.

| File Name            | Usage                                      |
| -------------------- | -----                                      |
| storageclass.yaml    | StorageClass of provisioner "csi.spdk.io"  |
| controller.yaml      | StatefulSet running CSI Controller service |
| node.yaml            | DaemonSet running CSI Node service         |
| controller-rbac.yaml | Access control for CSI Controller service  |
| node-rbac.yaml       | Access control for CSI Node service        |
| config-map.yaml      | SPDK storage cluster configurations        |
| secret.yaml          | SPDK storage cluster access tokens         |
| snapshotclass.yaml   | SnapshotClass of provisioner "csi.spdk.io" |

---
**_NOTE:_**

Below example is a simplest test system running in a single host or VM. No NVMe device is required, memory based bdev is used instead.
[docs/multi-node.md](docs/multi-node.md) introduces how to deploy SPDKCSI on multiple nodes with NVMe devices.

---

### Prepare SPDK storage node

Follow [deploy/spdk/README](deploy/spdk/README.md) to deploy SPDK storage service on localhost.

### Deploy SPDKCSI services

1. Launch Minikube test cluster
  ```bash
  $ cd scripts
  $ sudo ./minikube.sh up

  # Create kubectl shortcut (assume kubectl version 1.19.3)
  $ sudo ln -s /var/lib/minikube/binaries/v1.19.3/kubectl /usr/local/bin/kubectl

  # Wait for Kubernetes ready
  $ kubectl get pods --all-namespaces
  NAMESPACE     NAME                          READY   STATUS    RESTARTS   AGE
  kube-system   coredns-6955765f44-dlb88      1/1     Running   0          81s
  ......                                              ......
  kube-system   kube-apiserver-spdkcsi-dev    1/1     Running   0          67s
  ......                                              ......
  ```

2. Install snapshot controller and CRD
  ```bash
  SNAPSHOT_VERSION="v3.0.3" ./scripts/install-snapshot.sh install

  # Check status
  $ kubectl get pod snapshot-controller-0
  NAME                    READY   STATUS    RESTARTS   AGE
  snapshot-controller-0   1/1     Running   0          6m14s
  ```

3. Deploy SPDK-CSI services
  ```bash
  $ cd deploy/kubernetes
  $ ./deploy.sh

  # Check status
  $ kubectl get pods
  NAME                   READY   STATUS    RESTARTS   AGE
  spdkcsi-controller-0   3/3     Running   0          3m16s
  spdkcsi-node-lzvg5     2/2     Running   0          3m16s
  ```

4. Deploy test pod
  ```bash
  $ cd deploy/kubernetes
  $ kubectl apply -f testpod.yaml

  # Check status
  $ kubectl get pv
  NAME                       CAPACITY   ...    STORAGECLASS   REASON   AGE
  persistentvolume/pvc-...   256Mi      ...    spdkcsi-sc              43s

  $ kubectl get pvc
  NAME                                ...   CAPACITY   ACCESS MODES   STORAGECLASS   AGE
  persistentvolumeclaim/spdkcsi-pvc   ...   256Mi      RWO            spdkcsi-sc     44s

  $ kubectl get pods
  NAME                   READY   STATUS    RESTARTS   AGE
  spdkcsi-test           1/1     Running   0          1m31s

  # Check attached spdk volume in test pod
  $ kubectl exec spdkcsi-test mount | grep spdkcsi
  /dev/disk/by-id/nvme-..._spdkcsi-sn on /spdkvol type ext4 (rw,relatime)
  ```

5. Deploy PVC snapshot
```bash
  # Create snapshot of the bound PVC
  $ cd deploy/kubernetes
  $ kubectl apply -f snapshot.yaml

  # Get details about the snapshot
  $ kubectl get volumesnapshot spdk-snapshot
  NAME            READYTOUSE   SOURCEPVC   ... SNAPSHOTCLASS         AGE
  spdk-snapshot   false        spdkcsi-pvc ... csi-spdk-snapclass    29s

  # Get details about the volumesnapshotcontent
  kubectl get volumesnapshotcontent
  $ kubectl get volumesnapshotcontent
  NAME        ...   READYTOUSE   RESTORESIZE   DELETIONPOLICY   DRIVER        VOLUMESNAPSHOTCLASS   VOLUMESNAPSHOT   AGE
  snapcontent-...   true         268435456     Delete           csi.spdk.io   csi-spdk-snapclass    spdk-snapshot    29s
```

### Teardown

1. Delete PVC snapshot
  ```bash
  cd deploy/kubernetes
  kubectl delete -f snapshot.yaml
  ```

2. Delete test pod
  ```bash
  $ cd deploy/kubernetes
  $ kubectl delete -f testpod.yaml
  ```

3. Delete SPDK-CSI services
  ```bash
  $ cd deploy/kubernetes
  $ ./deploy.sh teardown
  ```

4. Delete snapshot controller and CRD
  ```bash
  SNAPSHOT_VERSION="v3.0.3" ./scripts/install-snapshot.sh cleanup
  ```

5. Teardown Kubernetes test cluster
  ```bash
  $ cd scripts
  $ sudo ./minikube.sh clean
  ```

## Communication and Contribution

Please join [SPDK community](https://spdk.io/community/) for communication and contribution.

Project progress is tracked in [Trello board](https://trello.com/b/nBujJzya/kubernetes-integration).
