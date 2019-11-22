
# D-Agent

REST API Collection and Documents of D-Agent (Dynamic Agent)

## Indices

* [Common](#common)

  * [Sample](#1-sample)

* [D-Agent](#d-agent)

  * [PING](#1-ping)
  * [STATUS CODE](#2-status-code)
  * [FORCEKILLIBOFOS](#3-forcekillibofos)
  * [RUNIBOFOS](#4-runibofos)

* [iBoFOS](#ibofos)

  * [HEARTBEAT](#1-heartbeat)
  * [EXITIBOFOS](#2-exitibofos)
  * [iBOFOSINFO](#3-ibofosinfo)
  * [MOUNTIBOFOS](#4-mountibofos)
  * [UNMOUNTIBOFOS](#5-unmountibofos)
  * [SCAN DEVICE](#6-scan-device)
  * [LIST DEVICE](#7-list-device)
  * [LIST ARRAY DEVICE](#8-list-array-device)
  * [CREATE ARRAY](#9-create-array)
  * [LOAD ARRAY](#10-load-array)
  * [DELETE ARRAY](#11-delete-array)
  * [STATE ARRAY](#12-state-array)
  * [CREATE VOLUME](#13-create-volume)
  * [UPDATE VOLUME](#14-update-volume)
  * [LIST VOLUME](#15-list-volume)
  * [MOUNT VOULUME](#16-mount-voulume)
  * [UNMOUNT VOLUME](#17-unmount-volume)
  * [DELETE VOLUME](#18-delete-volume)
  * [ATTACH DEVICE](#19-attach-device)
  * [DETACH DEVICE](#20-detach-device)

* [Redfish](#redfish)

  * [Cahsssis](#1-cahsssis)

* [Debug & Depricated](#debug-&-depricated)

  * [TEST - FIO](#1-test---fio)
  * [TEST - REPORTTEST](#2-test---reporttest)


--------


## Common
Most scheme of json is the similar to iBoF External API  
The id/pass for basic auth is the same as M-Tool's (It use the same DB)  
Currently D-Agent provides only basic auth.  

***

#### Request Headers

| Key | Value | Sample |
| --- | ------|-------------|
| X-Request-Id | {{xrid}} | 44f1280b-982e-4d2e-ab14-fe9eb2022045 |
| ts | {{timestamp}} | 1566287153702 |
| Content-Type | application/json | application/json |
| Authorization | {{basic_auth}} | Basic YWRtaW46YWRtaW4= |

***

#### Request Body (CUD)
* All API has common request scheme except GET method.

```json
{
  "param":{
    // Ref. each command
  }
}
```

***

#### Response Headers

| Key | Value | Sample |
| --- | ------|-------------|
| X-Request-Id | {{xrid}} | 44f1280b-982e-4d2e-ab14-fe9eb2022045 |
| Content-Type | application/json | application/json |
| Content-Length | {length}} | 97 |

***

#### Response Body (CRUD)
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

***

#### Timeout
* D-Agent default both read and write timeout is 30sec
* D-Agent waits 29sec from iBoFOS  

Response
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

***

#### Busy Status
* If iBof is busy, D-Agent return busy response

Response
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



### 1. Sample



***Endpoint:***

```bash
Method: GET
Type: RAW
URL: http://{{host}}/{{vendor}}/api/dagent/v1/sample
```


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| X-Request-Id | {{xrid}} |  |
| ts | {{timestamp}} |  |
| Content-Type | application/json |  |
| Authorization | {{basic_auth}} |  |



## D-Agent
The biz-logic execute in D-Agent own module



### 1. PING


Response Sample
```json
{
    "rid": "",
    "result": {
        "status": {
            "code": 0,
            "description": "Pong"
        }
    }
}
```


***Endpoint:***

```bash
Method: GET
Type: RAW
URL: http://{{host}}/{{vendor}}/api/dagent/v1/ping
```


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| X-Request-Id | {{xrid}} |  |
| ts | {{timestamp}} |  |
| Content-Type | application/json |  |
| Authorization | {{basic_auth}} |  |



### 2. STATUS CODE


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


***Endpoint:***

```bash
Method: GET
Type: RAW
URL: http://{{host}}/{{vendor}}/api/dagent/v1/statuscode
```


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| X-Request-Id | {{xrid}} |  |
| ts | {{timestamp}} |  |
| Content-Type | application/json |  |
| Authorization | {{basic_auth}} |  |



### 3. FORCEKILLIBOFOS


* It just runs "pkill -9 ibofos"

Response Sample
```json
{
    "rid": "",
    "result": {
        "status": {
            "code": 0,
            "description": "Success"
        }
    }
}
```


***Endpoint:***

```bash
Method: DELETE
Type: RAW
URL: http://{{host}}/{{vendor}}/api/dagent/v1/ibofos
```


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| X-Request-Id | {{xrid}} |  |
| ts | {{timestamp}} |  |
| Content-Type | application/json |  |
| Authorization | {{basic_auth}} |  |



### 4. RUNIBOFOS


* It just run command "run_ibof.sh" and does not gurantee to run.

Response Sample
```json
{
    "rid": "",
    "result": {
        "status": {
            "code": 0,
            "description": "Success"
        }
    }
}
```


***Endpoint:***

```bash
Method: POST
Type: RAW
URL: http://{{host}}/{{vendor}}/api/dagent/v1/ibofos
```


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| X-Request-Id | {{xrid}} |  |
| ts | {{timestamp}} |  |
| Content-Type | application/json |  |
| Authorization | {{basic_auth}} |  |



## iBoFOS
The biz-logic execute in both D-Agent and iBoFOS module



### 1. HEARTBEAT


Response Sample
```json
{
    "rid": "b469cefa-cf93-41ab-bc3c-a18c9828c6b2",
    "result": {
        "status": {
            "code": 0,
            "description": "alive"
        }
    }
}
```


***Endpoint:***

```bash
Method: GET
Type: RAW
URL: http://{{host}}/{{vendor}}/api/ibofos/v1/system/heartbeat
```


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| X-Request-Id | {{xrid}} |  |
| ts | {{timestamp}} |  |
| Content-Type | application/json |  |
| Authorization | {{basic_auth}} |  |



### 2. EXITIBOFOS


Response Sample

```json
TBD
```


***Endpoint:***

```bash
Method: DELETE
Type: RAW
URL: http://{{host}}/{{vendor}}/api/ibofos/v1/system/exitibofos
```


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| X-Request-Id | {{xrid}} |  |
| ts | {{timestamp}} |  |
| Content-Type | application/json |  |
| Authorization | {{basic_auth}} |  |



### 3. iBOFOSINFO


Response Sample

* `capacity` : The logical storage size / Unit : Byte

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


***Endpoint:***

```bash
Method: GET
Type: RAW
URL: http://{{host}}/{{vendor}}/api/ibofos/v1/system
```


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| X-Request-Id | {{xrid}} |  |
| ts | {{timestamp}} |  |
| Content-Type | application/json |  |
| Authorization | {{basic_auth}} |  |



### 4. MOUNTIBOFOS


Response Sample
```json
{
    "rid": "bdae9f64-ae85-4fd2-9b8a-3c2570298334",
    "result": {
        "status": {
            "code": 0,
            "description": "DONE"
        }
    }
}
```


***Endpoint:***

```bash
Method: POST
Type: RAW
URL: http://{{host}}/{{vendor}}/api/ibofos/v1/system/mount
```


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| X-Request-Id | {{xrid}} |  |
| ts | {{timestamp}} |  |
| Content-Type | application/json |  |
| Authorization | {{basic_auth}} |  |



***Body:***

```js        
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



### 5. UNMOUNTIBOFOS


Response Sample
```json
{
    "rid": "bdae9f64-ae85-4fd2-9b8a-3c2570298334",
    "result": {
        "status": {
            "code": 0,
            "description": "DONE"
        }
    }
}
```


***Endpoint:***

```bash
Method: DELETE
Type: RAW
URL: http://{{host}}/{{vendor}}/api/ibofos/v1/system/mount
```


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| X-Request-Id | {{xrid}} |  |
| ts | {{timestamp}} |  |
| Content-Type | application/json |  |
| Authorization | {{basic_auth}} |  |



***Body:***

```js        
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



### 6. SCAN DEVICE


Response Sample
```json
{
    "rid": "bdae9f64-ae85-4fd2-9b8a-3c2570298334",
    "result": {
        "status": {
            "code": 0,
            "description": "Scan Device Done"
        }
    }
}
```


***Endpoint:***

```bash
Method: GET
Type: RAW
URL: http://{{host}}/{{vendor}}/api/ibofos/v1/device/scan
```


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| X-Request-Id | {{xrid}} |  |
| ts | {{timestamp}} |  |
| Content-Type | application/json |  |
| Authorization | {{basic_auth}} |  |



### 7. LIST DEVICE


Response Sample

* `mn` : Model Number
* `sn` : Serial Number
* `size` : Currently It is page size, it will be fixed as "byte"

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


***Endpoint:***

```bash
Method: GET
Type: RAW
URL: http://{{host}}/{{vendor}}/api/ibofos/v1/device
```


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| X-Request-Id | {{xrid}} |  |
| ts | {{timestamp}} |  |
| Content-Type | application/json |  |
| Authorization | {{basic_auth}} |  |



### 8. LIST ARRAY DEVICE


Response Sample

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


***Endpoint:***

```bash
Method: GET
Type: RAW
URL: http://{{host}}/{{vendor}}/api/ibofos/v1/array/device
```


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| X-Request-Id | {{xrid}} |  |
| ts | {{timestamp}} |  |
| Content-Type | application/json |  |
| Authorization | {{basic_auth}} |  |



### 9. CREATE ARRAY


Response Sample

```json
{
   "rid": "3980c07e-a400-475a-b06a-0cdb9080b2f0",
   "result": {
       "status": {
           "code": 0,
           "description": "DONE"
       }
   }
}
```


***Endpoint:***

```bash
Method: POST
Type: RAW
URL: http://{{host}}/{{vendor}}/api/ibofos/v1/array
```


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| X-Request-Id | {{xrid}} |  |
| ts | {{timestamp}} |  |
| Content-Type | application/json |  |
| Authorization | {{basic_auth}} |  |



***Body:***

```js        
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



### 10. LOAD ARRAY


It loads the array info from MBR.  
This method should be called after run ibofos and before creating array.  
If success, you do not neet to create array.

Response Sample

```json
{
   "rid": "3980c07e-a400-475a-b06a-0cdb9080b2f0",
   "result": {
       "status": {
           "code": 0,
           "description": "DONE"
       }
   }
}
```


***Endpoint:***

```bash
Method: GET
Type: RAW
URL: http://{{host}}/{{vendor}}/api/ibofos/v1/array
```


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| X-Request-Id | {{xrid}} |  |
| ts | {{timestamp}} |  |
| Content-Type | application/json |  |
| Authorization | {{basic_auth}} |  |



### 11. DELETE ARRAY


Response Sample

```json
{
   "rid": "3980c07e-a400-475a-b06a-0cdb9080b2f0",
   "result": {
       "status": {
           "code": 0,
           "description": "DONE"
       }
   }
}
```


***Endpoint:***

```bash
Method: DELETE
Type: RAW
URL: http://{{host}}/{{vendor}}/api/ibofos/v1/array
```


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| X-Request-Id | {{xrid}} |  |
| ts | {{timestamp}} |  |
| Content-Type | application/json |  |
| Authorization | {{basic_auth}} |  |



***Body:***

```js        
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



### 12. STATE ARRAY



***Endpoint:***

```bash
Method: GET
Type: RAW
URL: http://{{host}}/{{vendor}}/api/ibofos/v1/array
```


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| X-Request-Id | {{xrid}} |  |
| ts | {{timestamp}} |  |
| Content-Type | application/json |  |
| Authorization | {{basic_auth}} |  |



### 13. CREATE VOLUME



***Endpoint:***

```bash
Method: POST
Type: RAW
URL: http://{{host}}/{{vendor}}/api/ibofos/v1/volume
```


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| X-Request-Id | {{xrid}} |  |
| ts | {{timestamp}} |  |
| Content-Type | application/json |  |
| Authorization | {{basic_auth}} |  |



***Body:***

```js        
{
    "param": {
        "name": "vol01",
        "size": 4194304
    }
}
```



### 14. UPDATE VOLUME



***Endpoint:***

```bash
Method: PUT
Type: RAW
URL: http://{{host}}/{{vendor}}/api/ibofos/v1/volume
```


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| X-Request-Id | {{xrid}} |  |
| ts | {{timestamp}} |  |
| Content-Type | application/json |  |
| Authorization | {{basic_auth}} |  |



***Body:***

```js        
{
    "param": {
        "name": "vol01",
        "maxiops": 0,
        "maxbw": 6000
    }
}
```



### 15. LIST VOLUME



***Endpoint:***

```bash
Method: GET
Type: RAW
URL: http://{{host}}/{{vendor}}/api/ibofos/v1/volume
```


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| X-Request-Id | {{xrid}} |  |
| ts | {{timestamp}} |  |
| Content-Type | application/json |  |
| Authorization | {{basic_auth}} |  |



### 16. MOUNT VOULUME



***Endpoint:***

```bash
Method: POST
Type: RAW
URL: http://{{host}}/{{vendor}}/api/ibofos/v1/volume/mount
```


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| X-Request-Id | {{xrid}} |  |
| ts | {{timestamp}} |  |
| Content-Type | application/json |  |
| Authorization | {{basic_auth}} |  |



***Body:***

```js        
{
    "param": {
        "name": "vol01"
    }
}
```



### 17. UNMOUNT VOLUME



***Endpoint:***

```bash
Method: DELETE
Type: RAW
URL: http://{{host}}/{{vendor}}/api/ibofos/v1/volume/mount
```


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| X-Request-Id | {{xrid}} |  |
| ts | {{timestamp}} |  |
| Content-Type | application/json |  |
| Authorization | {{basic_auth}} |  |



***Body:***

```js        
{
    "param": {
        "name": "vol01"
    }
}
```



### 18. DELETE VOLUME



***Endpoint:***

```bash
Method: DELETE
Type: RAW
URL: http://{{host}}/{{vendor}}/api/ibofos/v1/volume
```


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| X-Request-Id | {{xrid}} |  |
| ts | {{timestamp}} |  |
| Content-Type | application/json |  |
| Authorization | {{basic_auth}} |  |



***Body:***

```js        
{
    "param": {
        "name": "vol01"
    }
}
```



### 19. ATTACH DEVICE


Response Sample

```json
TBD
```


***Endpoint:***

```bash
Method: POST
Type: RAW
URL: http://{{host}}/{{vendor}}/api/ibofos/v1/device/attach
```


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| X-Request-Id | {{xrid}} |  |
| ts | {{timestamp}} |  |
| Content-Type | application/json |  |
| Authorization | {{basic_auth}} |  |



***Body:***

```js        
{
    "param": {
        "name": "vol01"
    }
}
```



### 20. DETACH DEVICE


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


***Endpoint:***

```bash
Method: DELETE
Type: RAW
URL: http://{{host}}/{{vendor}}/api/ibofos/v1/device/detach
```


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| X-Request-Id | {{xrid}} |  |
| ts | {{timestamp}} |  |
| Content-Type | application/json |  |
| Authorization | {{basic_auth}} |  |



***Body:***

```js        
{
    "param": {
        "name": "intel-unvmens-0"
    }
}
```



## Redfish
The biz-logic execute in both D-Agent and BMC module
* Redfish also uses basic auth. Not D-Agent's user info, But BMC user info 



### 1. Cahsssis



***Endpoint:***

```bash
Method: GET
Type: RAW
URL: http://{{host}}/redfish/v1/Chassis
```


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| Authorization | Basic cm9vdDowcGVuQm1j |  |



## Debug & Depricated
Only for debug, test and depricated API  
These APIs will be able to remove without any notice



### 1. TEST - FIO



***Endpoint:***

```bash
Method: GET
Type: RAW
URL: http://{{host}}/{{vendor}}/api/dagent/v1/test/fio
```


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| X-Request-Id | {{xrid}} |  |
| ts | {{timestamp}} |  |
| Content-Type | application/json |  |
| Authorization | {{basic_auth}} |  |



### 2. TEST - REPORTTEST


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


***Endpoint:***

```bash
Method: POST
Type: RAW
URL: http://{{host}}/{{vendor}}/api/ibofos/v1/test/report
```


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| X-Request-Id | {{xrid}} |  |
| ts | {{timestamp}} |  |
| Content-Type | application/json |  |
| Authorization | {{basic_auth}} |  |



---
[Back to top](#d-agent)
> Made with &#9829; by [thedevsaddam](https://github.com/thedevsaddam) | Generated at: 2019-11-22 19:30:33 by [docgen](https://github.com/thedevsaddam/docgen)
