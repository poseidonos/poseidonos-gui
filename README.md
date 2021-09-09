# POS Management Stack (M9K)
POS Management Stack is designed for management and monitoring of storage in PoseidonOS. It uses a client server model and consists of a frontend application (client that is written using reactjs) that facilitates users requests by interacting with a backend application (server that is written using Python3). The backend application hosts a API server and uses a middleware (provisioner that is written using Golang) to interact with PoseidonOS system.

Storage Management enables array management, volume management and user management. Storage Monitoring enables to know the state and health of the storage. It consists of graphs and notification system. Graphs can be displayed for benchmarking of I/O, bandwidth, CPU utilization and other metrics gathered from POS.

# Implementation Details

POS Management Stack consists of three major components as described above - a client (UI), backend (API server) and middlewware (interacts with POS server). 
* Client is developed using Javascript framework [Reactjs](https://reactjs.org/)
* Backend is developed using Python3 
* Middleware is developed using GO
* Tested and works fine in the following latest modern browsers
    * Google Chrome 
    * Mozilla Firefox 
* PoseidonOS is required to be installed and running already  

# Features Supported
* Roles, Authentication and Authorization (Only Admin role is supported)
* Storage Management (Array and Volume management - creation, updation and deletion)
* Poseidon Administration (Start, Stop and Status)
* User Management (Create, update and remove user - only Admin role is supported)

# Documentation

## User Guide
---
The official user guide is in the /doc/ directory

## Getting Started
---
### Prerequisites 
1. python3
2. go v1.14+
3. nodejs 14.x
4. InfluxDB (1.8.x)
5. IP Address of Mellanox Port should be set (Please refer to the file src/dagent/README.md)
6. POS should run from this directory - /root/workspace/ibofos/ (e.g the POS binaries should be present at /root/workspace/ibofos/bin directory)

### Supported OS and Version
1. Linux Ubuntu 18.04

### Download and Install dependencies 
1. Clone the project from GitHub - https://github.com/poseidonos/poseidonos-gui
2. Navigate to poseidonos-gui directory
3. Run scripts as described below to install and run the application
4. Access the application in the browser (e.g. http://<local_ip_addr>)

```
1. git clone https://github.com/poseidonos/poseidonos-gui.git
2. cd poseidonos-gui
3. ./script/install_all.sh
4. ./script/build_all.sh
5. ./script/run_all.sh
```
