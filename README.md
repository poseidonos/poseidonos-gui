# POS Management Stack (M9K)
POS Management Stack is designed for management and monitoring of storage in POS box. It uses a client server model and consists of a frontend application (client - Javascript) that facilitates users requests by interacting with a backend application (server - Python). The backend application host a API server and uses a middleware (Golang) to interact with POS system.

Storage Management enables array management, volume management and user management. Storage Monitoring enables to know the state and health of the storage. It consists of graphs and notification system. Graphs can be displayed for benchmarking of I/O, bandwidth, CPU utilization and other metrics gathered from POS.

# Implementation Details

POS Management Stack consists of three major components as described above - a client (UI), backend (API server) and middlewware (interacts with POS server). 
* Client is developed using Javascript framework [Reactjs](https://reactjs.org/)
* Backend is developed in Python 
* Middleware is developed using GO
* Tested and works fine in the following latest modern browsers
    * Google Chrome 
    * Mozilla Firefox 
* Required and works with latest version of Poseidon 

# Features Supported
* Authentication and Authorization (Only Admin role is supported)
* Storage Management (Array and Volume management - creation, updtaion and deletion)
* Performance (IOPS, BW and Latency charts)
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

### Supported OS and Version
1. Linux Ubuntu 18.04

### Download and Install dependencies 
1. Clone the project from GitHub
2. Navigate to M9K directory in /tool/m9k/
3. Run scripts to install and run the application
4. Access the application in the browser (e.g. http://<local_ip_addr>)

```
1. git clone http://github.com/poseidonos/poseidonos.git
2. cd tool/m9k
3. ./script/install_all.sh
4. ./script/build_all.sh
5. ./script/run_all.sh
```
