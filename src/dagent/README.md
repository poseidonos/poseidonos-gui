# Demon Agent

*  This app provides RESTFul APIs to control Poseidon System (POS, Metric, BMC ...)

***

## Known Issue
* None.

***

## Pre Requirement
#### POS
* The POS should be installed

#### M-Tool
** Currently the DB feacture is disabled
* D-Agent uses the same user DB as M-Tool. Therefore, the M-Tool (or sqlite) should be installed.
 

#### Config File
* config.yaml file should be in the same location as the executable file.
If there is no config file, d-agent will use default values.
* Management Stack uses Nginx and it will forward to 3000 port for D-Agent API.
```yaml
server:
  dagent:
    ip: 127.0.0.1
    port: 3000
  ibof:
    ip: 127.0.0.1
    port: 18716
  bmc:
    ip: 192.168.0.2
    port: 443
```

***

## Build & Run
#### Directory
``` 
/root/workspace/m9k/dagent
```

#### Build
* It can be run on any path.
* It does not need any dependency pkg after compiling.
```shell script
$ git clone http://10.227.30.174:7990/scm/ibof/m9k.git
$ cd m9k/dagent
$ ./script/build_dagent.sh
```
#### Run
```shell script
$ sudo ./bin/dagent # General Run
# Or
$ sudo ./script/run_dagent.sh # Background Run 
```

***

## API
#### Postman
1. Install Postman
2. Import Collection in postman folder
3. Import Envirments in postman folder
4. Call FORCEKILLIBOFOS  
    : It exec "pkill -9 ibofos"  
5. Call RUNIBOFOS   
    : It exec "run_remote_ibofos.sh"
6. Call APIs to Test

#### API Spec and Error code
* It does not require header values.

* API Spec  
```
/api/dagent/v1/doc/api.html
/api/dagent/v1/doc/api.md
```
* Error Code  
```
/api/dagent/v1/doc/events.yaml
```

***

## Redfish (TBD)
#### API
* Endpoint
```
(ANY) /redfish/{redfishSpec}
```
  
#### Request Headers
* Redfish also uses basic auth. Not D-Agent's user info, But BMC user info 
```
Authorization : {basic auth value}
```

Sample
```
Authorization : Basic cm9vdDowcGVuQm1j
```

***

## Newman

#### Installation

- Newman is a node.js pkg and distributed by npm so you need to install node.js and npm.

```
$apt-get install node.js
$apt-get install npm
```

- Install a newman using npm.

```
$npm install newman
```

#### How to use

- You can find a run_test.sh in below directory.

 |-- postman
        |-- run_test.sh

- It contains a simple command like below.

```
$newman run test/sample_test.json -e Test.postman_environment.json -r junit --reporter-junit-export ./result.xml
```

- You have to prepare collection and environment file which are exported from Postman.
- put a collection file after "run" and add an environment file using option "-e".
- You can report the test result with JUnit format and it can be using option "-r junit" and make a specific xml formatted file like "--reporter-junit-export result.xml".
