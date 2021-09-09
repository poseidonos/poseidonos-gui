# POS Management Stack - Middleware (D-Agent)
*  This app provides RESTFul APIs to Poseidon System

## Pre-Requisites
1. go v1.14+
2. IP Address of Mellanox Port should be set in the file script/run_os.sh (Eg: IP=10.100.11.7)

#### POS
* The POS should be installed and running 

#### Management Stack client application
* The client application should be installed (e.g. PoseidonOS-GUI)
* D-Agent uses the same DB for user auth as the client. Therefore, the client application should be installed OR sqlite should be installed, which client uses too.
 

#### Config File
* config.yaml file should be in the same location as the executable file.
If there is no config file, D-Agent will use default values.
* Management applications uses Nginx and it will forward D-Agent API requests to port 3000 port.

```yaml
server:
  dagent:
    ip: 127.0.0.1
    port: 3000
  ibof:
    ip: 127.0.0.1
    port: 18716
```

***

## Build & Run
#### Directory
``` 
/root/workspace/ibofos/tool/m9k/dagent
```

#### Build
* It can be run on any path.
* It does not need any dependency pkg after compiling.
* It is build along with the other components of the Management Stack Client. 

#### Run
* It is run along with the other components of the Management Stack Client.

***

## How to test API
#### Postman
1. Install Postman
2. Import Collection in postman folder
3. Import Environments in postman folder
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

## Newman

#### Installation

- Newman is a node.js pkg and distributed by npm so you need to install node.js and npm.
- Install a newman using npm.

```
$npm install newman
```

#### How to use

- You can find a run_test.sh in below directory.

- |-- postman

        |-- run_test.sh

- It contains a simple command like below.

```
$newman run test/sample_test.json -e Test.postman_environment.json -r junit --reporter-junit-export ./result.xml
```

- You have to prepare collection and environment file which are exported from Postman.
- put a collection file after "run" and add an environment file using option "-e".
- You can report the test result with JUnit format and it can be using option "-r junit" and make a specific xml formatted file like "--reporter-junit-export result.xml".
