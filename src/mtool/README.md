# POS Management Stack - Client (called MTool) 
MTool acts as client in the POS Management Stack. It provides UI to configure available Poseidon boxes, aggregate events and represent a big picture of operations.

MTool exposes REST APIs with JWT authentication for secured communication with Poseidon Management UI or any third party UI applications.


## Features
1. Login Screen
   - Default Credentials - admin/admin

2. User Management
   - User Addition, Deletion, Modification
   - Logout   

3. Performance Page
   - Array - Read Bandwidth, Write Bandwidth, Read IOPS, Write IOPS, Latency
   - Volume - Read Bandwidth, Write Bandwidth, Read IOPS, Write IOPS, Latency
   - System - CPU Usage

4. Dashboard
   - Poseidon OS status ( refreshes every 4 seconds )
   - Health metrics for CPU, Memory and latency data
   - Storage and volume status
   
5. Storage Management
   - Array creation, deletion, mount and unmount after Poseidon OS is started
   - Volume creation, deletion, mount and unmount 
   - Array and Volume details are persistent even after Poseidon OS is stopped and started.
   
6. Poseidon OS Operations
   - Start and STOP of Poseidon OS 
   - Run command to run and bash files  

# System Requirements: 
- Ubuntu 18.04 with python3 
- Best Resolution: 1920 x 1080 (currently tested in Mozilla Firefox and Chrome with 100% zoom level)

# Dev 
## Source 
> git clone http://github.com/poseidonos/poseidonos.git 
### MTool code is found under `tool/m9k/src/mtool/`

## Setting up and running MTool

### 1. Install Packages
This step is performed along with installation of other components  

### 2. Run application
This step is performed along with running of other components  

### 3. Access application
The server will run on localhost and will be accessible from the browser

`
http://localhost
`
