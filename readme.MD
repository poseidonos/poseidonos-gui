# Dynamic Agent

*  This app provides RESTFul APIs to contorl iBoF System (iBoFOS, BMC ...)

***

## Known Issue
* None.

***

## Dev Enviroment
* Language : GoLang 1.13
* Test : Ubuntu 19.10 LTS
* D-Agent Branch : devel (Latest)
* iBoFOS Branch : devel (11/19 - d56cc7aec4d80fd54b40b42588a74dc369063993)

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
$ sudo ./run_dagent.sh # Background Run 
```

***

## API
#### Postman
1. Install Postman
2. File -> Import -> Import File -> "postman/D-Agent.postman_collection.json"
3. Set the envirments (host, vendor)
: Host value should be URL
4. : Vendor value should be "mtool" or "nbp"    
5. Call FORCEKILLIBOFOS
    : To kill current iBoFOS  
6. Call RUNIBOFOS 
    : it exec "run_ibofos.sh"
7. Test

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

