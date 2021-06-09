# MTool 
M-Tool is a Management tool for Posiedon. It gives the ability to configure available Poseidon boxes, aggregate events and represent a big picture of operations. In the event of a failure, MTool has the capabilities to alert users about the problem, and allow them to take necessary actions.

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
- Ubuntu 18.04 with python 3.5+. 
- SMTP port access for triggering emails. 
- Best Resolution: 1920 x 1080 (currently tested in Mozilla Firefox and Chrome with 100% zoom level)

# Dev 
## Source 
> git clone http://10.227.30.174:7990/scm/ibof/m9k.git --branch devel
### Change the branch as per the current need   
### After cloning, MTool code is found under `/m9k/mtool/`

## Code Directory
`
cd m9k
`

## Setting up and running the iBOF management tool

### 1. Install Packages

These packages are required for proper working of the Management tool.

This will install required packages such as influxdb, telegraf, chronograf, kapacitor on the host.

`
./install_all.sh
`

### 2. Run application
To run various applications, use this command below.

`
./run_all.sh
`

The server will run on localhost and will be accessible from the browser

`
http://localhost
`
