# MTool 
M-Tool is a Management tool for Posiedon. It gives the ability to configure available Poseidon boxes, aggregate events and represent a big picture of operations. In the event of a failure, MTool has the capabilities to alert users about the problem, and allow them to take necessary actions.

MTool exposes REST APIs with JWT authentication for secured communication with Poseidon Management UI or any third party UI applications.


Release Contents:
1. API changes with respect to D-Agent API changes

2. Unit changes (from int to string) with respect to the unit changes in POS

3. D-Agent APIs used instead of influxDB queries for metrics

4. Test cases refinement and adding new test cases based on new or updated requirements

5. First version of MTool rest API automation using Postman

6. Reviewed the poc design and poc code related to the Cli_server_decoupling_from_POS task

7. Work with process team to setup Jenkins environment and configure a jenkins job for MTool FE code

8. Manual TCs verification related to Login, Storage, Performance and Dashboard features

9. Achieved 0 errors and warnings in MTool backend static code analysis

10. Fixed the UI crash on screen inactivity.

11. Changed the response structure in the UI for create/delete volume

12. Changed the logic for delete volume. Now, the user has to manually unmount the volume first before deleting it

13. Disabled some features for PoC1

14. Created REST API workflow document for MTool

15. Implemented load array feature in front end and backend. 


Observations:
1. In Dashboard page, IOPS, and Bandwidth is showing last non-zero value even if IOs are not running

2. Latency graphs are showing zero values always. Need to change according to latest AIR schema

3. POS is crashing when array creation and deletion is repeated multiple times

4. If we stop POS without deleting the array and start POS again, the array doesn't show up. Issue with load array API

 

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
   - UI with backend APIs
   - Poseidon OS status is checked every 4 seconds and displayed 
   
5. Storage Management
   - Array Creation/Deletion after Poseidon OS is started
   - Volumes creation/deletion 
   - Array and Volume details are persistent even after Poseidon OS is stopped and started.
   
6. Poseidon OS Operations
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



