# PoseidonOS-GUI
PoseidonOS-GUI is a reactjs application and a core component of the POS Management Stack (M9K). It provides a graphical user interface (GUI) to access, configure and monitor PoseidonOS.

PoseidonOS-GUI internally connects to a REST API provider (called DAgent) to access PoseidonOS. It uses JWT authentication for secured communication.


## Features

The following features are currently supported.

1. Login and Logout
   - Default Credentials - admin/admin


2. User Management
   - User Addition, Deletion, and Modification
   - Role assigment to the user (only ADMIN role is currently supported)


3. Dashboard
   - PoseidonOS status that auto refreshes every four seconds
   - Health metrics shows CPU, Memory and latency data
   - Storage array and volume status


4. Storage Management
   - Array creation, deletion, mount and unmount after Poseidon OS is started
   - Volume creation, deletion, mount and unmount 
   - Array and Volume details are persistent even after Poseidon OS is stopped and started.


5. PoseidonOS Operations
   - START and STOP of PoseidonOS 

# System Requirements: 
- Ubuntu 18.04 with python3 
- Access to internet and modern browser like Chrome or Firefox (Currently, supports Chrome and Firefox only)
- Display screen with resolution of 1920 x 1080 (currently tested in Mozilla Firefox and Chrome with 100% zoom level)

# Dev 
## Source 
> git clone http://github.com/poseidonos/poseidonos-gui.git 
### PoseidonOS-GUI code is found under `src/mtool` 

## Build and Run PoseidonOS-GUI

### 1. Install Packages
This step is performed along with installation of M9K components  (Please see ([README](../../README.md)) at the root level)

### 2. Run application
This step is performed along with build and run of M9K components  (Please see ([README](../../README.md)) at the root level)

### 3. Access application
The server will run on localhost and will be accessible from the browser

`
http://localhost
`
