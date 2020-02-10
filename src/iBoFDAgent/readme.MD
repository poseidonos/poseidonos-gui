# Dynamic Agent

*  This app provides RESTFul APIs to contorl iBoF System (iBoFOS, BMC ...)

***

## Known Issue
* None.

***

## Dev Enviroment
* Language : GoLang 1.13
* Test : Ubuntu 19.10
* D-Agent Branch : devel (Latest)
* iBoFOS Branch : devel (12/12 - 9d061e4c2b1db07f57c7bda71c651e4aaa2b024d)

***

## Pre Requirement
#### iBoFOS
* The iBoFOS should be installed

#### M-Tool
* D-Agent uses the same user DB as M-Tool. Therefore, the M-Tool (or mongodb) should be installed. 

#### Config File
* config.yaml file should be in the same location as the executable file.
If there is no config file, d-agent will use default values.
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

#### Patient & Coffee
* This app is still in progress, so it can be died without any notice.

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
$ git clone http://10.227.30.174:7990/scm/ibof/ibofdagent.git
$ cd ibofdagent
$ go mod vendor
$ go build -mod vendor
#or
$ ./localbuild # It will also generate api documentation
```
#### Run
* The exec binaray is also uploaded, so you can run without build
```shell script
$ sudo ./ibofdagent # General Run
# Or
$ sudo ./bin/run_dagent.sh # Background Run 
```

***

## API
#### Postman
1. Install Postman
2. Import Collection in postman folder
3. Import envirments in postman folder
4. Call FORCEKILLIBOFOS
    : To kill current iBoFOS  
5. Call RUNIBOFOS 
    : it exec "run_ibofos.sh"
6. Test

#### API Spec HTML & Markdown
There are two type documentations; api.html and api.MD
* The id/pass for basic auth is the same as M-Tool's (It use the same DB)

* Endpoint  
```
/mtool/api/dagent/v1/doc/api.html
/mtool/api/dagent/v1/doc/api.md
```

***

#### Error Code
Use below APIs to get error codes

* Endpoint
```
/mtool/api/dagent/v1/statuscode
```

***

## Redfish
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
