# MTool 
M-Tool is a Management tool for Posiedon. It gives the ability to configure available Poseidon boxes, aggregate events and represent a big picture of operations. In the event of a failure, MTool has the capabilities to alert users about the problem, and allow them to take necessary actions.

MTool exposes REST APIs with JWT authentication for secured communication with Poseidon Management UI or any third party UI applications.

## Features
1. Login Screen
   - Default Credentials - admin/admin

2. User Management
   - User Addition, Deletion, Modification
   - Change Password for logged in user
   - Logout   

3. Performance Page
   - Array - Read Bandwidth, Write Bandwidth, Read IOPS, Write IOPS 
   - Volume - Read Bandwidth, Write Bandwidth, Read IOPS, Write IOPS
   - System - CPU Usage

4. Dashboard
   - UI with backend APIs
   - Poseidon OS status is checked every 4 seconds and displayed 
   
5. Storage Management
   - Array Creation/Deletion after Poseidon OS is started
   - Volumes creation/deletion 
   - Array and Volume details are persistent even after Poseidon OS is stopped and started.

6. Alert Management
   - Alert Creation, Deletion, Enable/Disable and Modification 
   - Displaying triggered alerts in the Dashboard
   
7. Poseidon OS Operations
   - Start and STOP of Poseidon OS 
   - Run command to run and bash files  

# System Requirements: 
- Ubuntu 18.04 with python 3.5+. 
- SMTP port access for triggering emails. 
- Email with a "@samsung.com" domain
- Best Resolution: 1920 x 1080 (currently tested in Chrome with 100% zoom level)

# Dev 
## Source 
> git clone http://10.227.30.174:7990/scm/ibof/m9k.git
### After cloning, MTool code is found under `/m9k/mtool/`

## Setting up and running the iBOF management tool

### 1. Install System Level Packages

These packages are required for proper working of the Management tool.

Move to m9k folder

Execute install.sh script in m9k/dependency. It will install required packages such as influxdb, telegraf, chronograf, kapacitor on the host

For offline installation (It will install packages from NAS)

`./dependency/install.sh nas`

For online installation (It will install packages from apt)

`./dependency/install.sh apt`

### 2. Navigate to `m9k/mtool`

M-Tool dependency Packages should be installed as one time activity.
M-Tool dependency Packages can be installed either on-line or off-line

### 3. On-Line Package Installation
Run ` ./dependency/install.sh apt ` to setup required python libraries  on the host.

### 4. Off-Line Package Installation
Run ` ./dependency/install.sh nas ` to setup required python libraries on the host.
It will copy the required packages from  NAS location -  'http://10.1.5.22/mtool.packages/ibofmgmt_package.tar.gz

After the packages are installed , run 'run_mtool.sh' file to start the service. 
A M-Tool service will be started on every boot of Ubuntu system. 

## Setup db and agent for getting usage statistics
### Navigate to `m9k/mtool`
`
./scripts/run_mtool.sh
`

The server will run on localhost and will be accessible from the browser

`
http://localhost
`
