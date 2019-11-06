---

---

[TOC]

# Dynamic Agent

*  This app provides RESTFul APIs to contorl iBoF System (iBoFOS, BMC ...)

***

## Known Issue
* None.

***

## Dev Enviroment
* Language : GoLang 1.13
* Test : Ubuntu 18.04 LTS
* D-Agent Branch : devel
* iBoFOS Branch : devel

***

## Pre Requirement
#### iBoFOS
* The iBoFOS should be installed


#### M-Tool
* D-Agent uses the same user info as M-Tool. Therefore, the M-Tool (or mongodb) should be installed. 

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
```
#### Run
* The exec binaray is also uploaded, so you can run without build
```shell script
$ sudo ./ibofdagent # General Run
# Or
$ sudo ./run_dagent.sh # Background Run 
```

***

## How to Test
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

***

## API

* I will change swagger style (TBD)  
* Most scheme of json is the similar to iBoF External API
* The id/pass for basic auth is the same as M-Tool's (It use the same DB)
* Currently D-Agent provides only basic auth.

#### Common Request Headers
```
X-Request-Id : {uuid}
ts : {unix timestamp}
Content-Type : application/json
Authorization : {basic auth value}
```

Sample
```
X-Request-Id : 44f1280b-982e-4d2e-ab14-fe9eb2022045
ts : 1566287153702
Content-Type : application/json
Authorization : Basic YWRtaW46YWRtaW4=
```

#### Common Request Body (CUD)
* All API has common request scheme without GET method.

```json
{
  "param":{
    // Ref. each command
  }
}
```

#### Common Response Headers
Sample
```
X-Request-Id : 44f1280b-982e-4d2e-ab14-fe9eb2022045
Content-Type : application/json; charset=utf-8
Content-Length : 97
```

#### Common Response Body (CRUD)
* All API has common response scheme.

Response Sample
```json
{
   "result":{
    "status":{
      "code":0,
      "description":"Volume Create Success"
    },
    "data":{
      // Ref. each command
    } 
  }
}
```

#### Timeout
* D-Agent default both read and write timeout is 30sec
* D-Agent waits 29sec from iBoFOS  

Response Sample
```json
{
    "rid": "",
    "result": {
        "status": {
            "code": 19000,
            "description": "iBof Response Timeout"
        }
    }
}
```

#### Busy Status
* If iBof is busy, D-Agent return busy response

Response Sample
```json
{
    "rid": "",
    "result": {
        "status": {
            "code": 12000,
            "description": "iBoF is busy"
        }
    }
}
```

### API Path  
* http://{localhost}/{vendor}/api/{type}/{version}/{command}/{command}...  

Sample
```  
http://12.36.56.173:3000/mtool/api/dagent/v1/ping
http://12.36.56.173:3000/mtool/api/ibofos/v1/system/sysstate
http://12.36.56.173:3000/mtool/api/ibofos/v1/volume/create
http://12.36.56.173:3000/mtool/api/bmc/v1/psu
http://12.36.56.173:3000/nbp/api/dagent/v1/ping
```

### TEST API
##### [REPORTTEST]
(POST) /ibofos/v1/test/report    

* It makes a report file for self test.
* It is made for only test, so it can be deprecated without any notice.
* Report file directory : /etc/ibofos/report/  
Report file name : report.log / report.1.log / report.2.log ... report.4.log  
(5 files, rotationally write, 100MB per file)
* Code Definition : See below Error Code section

Format
```
[{timestamp}][{code}}][{level}] [{value}]
```

Sample in report.log
```
[1567675252][2804][info] [85]
[1567675253][2804][info] [86]
[1567675254][2804][info] [87]
[1567675266][2804][info] [99]
[1567675267][2804][info] [100]
```

Response Sample  
* It takes about 100 sec, so D-Agent will make timeout.
### AP
#### For D-Agent
* The biz logic is executed in D-Agent

##### [PING]
(GET) /dagent/v1/ping  
Response Sample
```json
{
    "rid": "",
    "result": {
        "status": {
            "code": 0,
            "description": "Pong"
        },
        "data": null
    }
}
```

##### [STATUSCODE]
(GET) /dagent/v1/statuscode  
Response Sample
```json
{
    "rid": "",
    "result": {
        "status": {
            "code": 0,
            "level": "",
            "description": "success"
        },
        "data": {
            "statuslist": [
                {
                    "code": 1000,
                    "level": "INFO",
                    "description": "cli server initialized"
                },
                {
                    "code": 1001,
                    "level": "INFO",
                    "description": "new client"
                }
            ]
        }
    }
}
```

##### [RUN IBOF]
* It just run command "run_ibof.sh" and does not gurantee to run.  
(POST) /dagent/v1/ibofos  
  

Response Sample
```json
{
    "rid": "",
    "result": {
        "status": {
            "code": 0,
            "description": "Success"
        },
        "data": null
    }
}
```

##### [FORCE KILL IBOF]
* It runs "pkill -9 ibofos"   
(DELETE) /dagent/v1/ibofos  

Response Sample

```json
{
    "rid": "",
    "result": {
        "status": {
            "code": 0,
            "description": "Success"
        },
        "data": null
    }
}
```

#### For iBoFOS
* The biz logic is executed in D-Agent and iBoFOS

##### [SYS STATE]
(GET) /ibofos/v1/system/sysstate  
Response Sample
```json
{
    "rid": "b469cefa-cf93-41ab-bc3c-a18c9828c6b2",
    "result": {
        "status": {
            "code": 0,
            "description": "alive"
        },
        "data": null
    }
}
```

##### [EXIT SYSTEM]
(GET) /ibofos/v1/system/exit  
* Currently this api does now work due to iboFOS Bug  
Response Sample
```json
{
    "rid": "bdae9f64-ae85-4fd2-9b8a-3c2570298334",
    "result": {
        "status": {
            "code": 0,
            "description": "something"
        },
        "data": null
    }
}
```

##### [SCAN DEVICE]
(GET) /ibofos/v1/device/scan  
Response Sample
```json
{
    "rid": "bdae9f64-ae85-4fd2-9b8a-3c2570298334",
    "result": {
        "status": {
            "code": 0,
            "description": "Scan Device Done"
        },
        "data": null
    }
}
```

##### [LIST DEVICE]
(GET) /ibofos/v1/device  

Response Sample
* "mn" : Model Number
* "sn" : Serial Number
* "size" : Currently It is page size, it will be fixed as "byte"
```json
{
    "rid": "3922e5eb-3061-433c-a543-5fdeb3b32d25",
    "result": {
        "status": {
            "code": 0,
            "description": "DONE"
        },
        "data": {
            "devicelist": [
                {
                    "mn": "VMware Virtual NVMe Disk",
                    "name": "intel-unvmens-0",
                    "size": 67108864,
                    "sn": "VMWare NVME-0002",
                    "type": "SSD"
                },
                {
                    "mn": "VMware Virtual NVMe Disk",
                    "name": "intel-unvmens-1",
                    "size": 67108864,
                    "sn": "VMWare NVME-0003",
                    "type": "SSD"
                },
                {
                    "mn": "VMware Virtual NVMe Disk",
                    "name": "intel-unvmens-2",
                    "size": 67108864,
                    "sn": "VMWare NVME-0000",
                    "type": "SSD"
                },
                {
                    "mn": "VMware Virtual NVMe Disk",
                    "name": "intel-unvmens-3",
                    "size": 67108864,
                    "sn": "VMWare NVME-0001",
                    "type": "SSD"
                },
                {
                    "mn": "",
                    "name": "uram0",
                    "size": 262144,
                    "sn": "",
                    "type": "NVRAM"
                }
            ]
        }
    }
}
```

##### [ATTACH DEVICE]
(POST) /ibofos/v1/device/attach
// Not Imple in iBoFOS, It will provide by 20, sep
Request Body Sample

```json
{
    "param": {
        "name": "vol01"
    }
}
```
Response Sample
```json
{
   "rid": "3980c07e-a400-475a-b06a-0cdb9080b2f0",
    "result": {
        "status": {
            "code": 0,
            "description": "success"
        }
    }
}
```

##### [DETACH DEVICE]
(DELETE) /ibofos/v1/device/detach
// Not Imple in iBoFOS, It will provide by 20, sep
Request Body Sample

```json
{
    "param": {
        "name": "vol01"
    },
}
```

Response Sample
```json
{
   "rid": "3980c07e-a400-475a-b06a-0cdb9080b2f0",
    "result": {
        "status": {
            "code": 0,
            "description": "success"
        }
    }
}
```

##### [CREATE ARRAY]
(POST) /ibofos/v1/array
// (TBD)  

##### [DELETE ARRAY]
(DELETE) /ibofos/v1/array
// (TBD)

##### [STATE ARRAY]
(GET) /ibofos/v1/array

* "capacity" : The logical storage size / Unit : Byte

Response Sample
```json
{
    "rid": "8a6773aa-3eb8-4c26-b4b7-be5cec6fb415",
    "result": {
        "status": {
            "code": 0,
            "description": "DONE"
        },
        "data": {
            "state": "Unmounted",
            "capacity": 40964096, 
            "used": 10240
        }
    }
}
```

##### [MOUNT ARRAY]
(POST) /ibofos/v1/array/mount  
Request Body Sample
```json
{
   "param": {
       "fttype": 1,
       "buffer": [
           {
               "deviceName": "uram0"
           }
       ],
       "data": [
           {
               "deviceName": "intel-unvmens-0"
           },
           {
               "deviceName": "intel-unvmens-1"
           },
           {
               "deviceName": "intel-unvmens-2"
           }
       ],
       "spare": [
           {
               "deviceName": "intel-unvmens-3"
           }
       ]
   }
}
```
Response Sample
```json
{
   "rid": "3980c07e-a400-475a-b06a-0cdb9080b2f0",
   "result": {
       "status": {
           "code": 0,
           "description": "DONE"
       },
       "data": null
   }
}
```

##### [UNMOUNT ARRAY]
(DELETE) /ibofos/v1/array/mount
// (TBD)

##### [LIST ARRAY DEVICE]
(GET) /ibofos/v1/array/device
* This API will br merged to other one after 3q PoC
* Available Type : BUFFER, DATA, SPARE
```json
{
    "rid": "b447f812-ab74-4b19-8563-0d2a7613d010",
    "result": {
        "status": {
            "code": 0,
            "level": "",
            "description": "NO ARRAY DEVICE EXIST"
        }
    }
}
```


##### [CREATE VOLUME]
(POST) /ibofos/v1/volume  

Request Body Sample
* "maxbw" : 0 means unlimited (or do not add "limit" attribute) / Unit : MB
* "maxiops" : 0 means unlimited (or do not add "limit" attribute) / Unit : K (1000)

```json
{
    "param": {
        "name": "vol01",
        "size": 4194304,
        "maxbw": 0,
        "maxiops": 0
    }
}
```

```json
{
    "param": {
        "name": "vol01",
        "size": 4194304
    }
}
```

Response Sample
```json
{
    "rid": "1d4d31ba-462a-4b18-b699-8e71fd6f20e7",
    "result": {
        "status": {
            "code": 0,
            "description": "DONE"
        },
        "data": null
    }
}
```
```json
{
    "rid": "061f6617-e75f-459d-8f79-758a92411ebe",
    "result": {
        "status": {
            "code": 2022,
            "description": "FAILED"
        },
        "data": null
    }
}
```

##### [LIST VOLUME]
(GET) /ibofos/v1/volume  
     
Response Sample
```json
{
    "rid": "78bdf271-fc16-49ce-bd57-00f0c42cec16",
    "result": {
        "status": {
            "code": 0,
            "description": "DONE"
        },
        "data": {
            "volumes": [
                {
                    "id": 0,
                    "maxbw": 0,
                    "maxiops": 0,
                    "name": "vol01",
                    "remain": 4194304,
                    "status": "Mounted",
                    "total": 4194304
                }
            ]
        }
    }
}
```

##### [UPDATE VOLUME]
(PUT) /ibofos/v1/volume  

Request Body Sample
```json
{
    "param": {
        "name": "vol01",
        "maxiops": 0,
        "maxbw": 6000
    }
}
```
Response Sample
```json
{
    "rid": "1da5dad2-3604-4979-be74-2b32f1ce38f3",
    "result": {
        "status": {
            "code": 0,
            "description": "DONE"
        }
    }
}
```

##### [DELETE VOLUME]
(DELETE) /ibofos/v1/volume  

Request Body Sample
```json
{
    "param": {
        "name": "vol01"
    }
}
```
Response Sample
```json
{
    "rid": "1da5dad2-3604-4979-be74-2b32f1ce38f3",
    "result": {
        "status": {
            "code": 0,
            "description": "DONE"
        },
        "data": null
    }
}
```

##### [MOUNT VOLUME]
(POST) /ibofos/v1/volume/mount    
Request Body Sample
```json
{
    "param": {
        "name": "vol01"
    }
}
```
Response Sample
```json
{
    "rid": "10cdb292-8942-4cb0-8202-032c9e7db98a",
    "result": {
        "status": {
            "code": 0,
            "description": "DONE"
        },
        "data": null
    }
}
```
```json
{
    "rid": "c46c4401-b083-41f1-8951-f147a2339304",
    "result": {
        "status": {
            "code": 2040,
            "description": "FAILED"
        },
        "data": null
    }
}
```

##### [UNMOUNT VOLUME]
(DELETE) /ibofos/v1/volume/mount  

Request Body Sample
```json
{
    "param": {
        "name": "vol01"
    }
}
```
Response Sample
```json
{
    "rid": "b31576cb-f092-4f6f-96be-4dc1ca7c98e4",
    "result": {
        "status": {
            "code": 0,
            "description": "DONE"
        },
        "data": null
    }
}
```
```json
{
    "rid": "fda8a39e-a92c-4f3b-90ea-a2d773370a03",
    "result": {
        "status": {
            "code": 2041,
            "description": "FAILED"
        },
        "data": null
    }
}
```

#### Error Code
* See statuscode.json in root folder
* Latest : http://12.30.97.244:8090/wiki/pages/viewpage.action?pageId=159199976 
* PDF code available upon request {d.moon/hs0112.moon/sk921.park}@samsung.com

***

## Redfish
#### API
(ANY) /redfish/{redfishSpec}  

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

