
# D-Agent

REST API Collection and Documents of D-Agent (Dynamic Agent)

## Indices

* [Common](#common)

  * [Common](#1-common)

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
| X-Request-Id | {{$guid}} | 44f1280b-982e-4d2e-ab14-fe9eb2022045 |
| ts | {{$timestamp}} | 1566287153702 |
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
| X-Request-Id | {{$guid}} | 44f1280b-982e-4d2e-ab14-fe9eb2022045 |
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

***

#### Busy Status
* If iBof is busy, D-Agent return busy response



### 1. Common



***Endpoint:***

```bash
Method: GET
Type: 
URL: http://{{host}}/{{vendor}}/api/ibofos/v1/system/heartbeat
```


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| X-Request-Id | {{$guid}} |  |
| ts | {{$timestamp}} |  |
| Content-Type | application/json |  |
| Authorization | {{basic_auth}} |  |



***Responses:***


Status: Error - iBoF is busy | Code: 400



***Response Headers:***

| Key | Value |
| --- | ------|
| Content-Type | application/json; charset=utf-8 |
| X-Request-Id | 1a9368ad-5205-48cc-9569-60f9fc124af5 |
| Date | Wed, 27 Nov 2019 05:02:21 GMT |
| Content-Length | 74 |
| Connection | keep-alive |



```js
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



Status: Error - IBoF does not run | Code: 400



***Response Headers:***

| Key | Value |
| --- | ------|
| Content-Type | application/json; charset=utf-8 |
| X-Request-Id | 74228c0f-c5c2-4c1b-99b8-697278a095ae |
| Date | Wed, 27 Nov 2019 04:59:48 GMT |
| Content-Length | 79 |
| Connection | keep-alive |



```js
{
    "rid": "",
    "result": {
        "status": {
            "code": 12030,
            "description": "iBoF does not run"
        }
    }
}
```



## D-Agent
The biz-logic execute in D-Agent own module



### 1. PING



***Endpoint:***

```bash
Method: GET
Type: 
URL: http://{{host}}/{{vendor}}/api/dagent/v1/ping
```


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| X-Request-Id | {{$guid}} |  |
| ts | {{$timestamp}} |  |
| Content-Type | application/json |  |
| Authorization | {{basic_auth}} |  |



***Responses:***


Status: Success | Code: 200



***Response Headers:***

| Key | Value |
| --- | ------|
| Content-Type | application/json; charset=utf-8 |
| X-Request-Id | 6016494b-922b-40ff-bf7d-815ff3f567af |
| Date | Wed, 27 Nov 2019 02:11:30 GMT |
| Content-Length | 62 |
| Connection | keep-alive |



```js
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



### 2. STATUS CODE



***Endpoint:***

```bash
Method: GET
Type: 
URL: http://{{host}}/{{vendor}}/api/dagent/v1/statuscode
```


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| X-Request-Id | {{$guid}} |  |
| ts | {{$timestamp}} |  |
| Content-Type | application/json |  |
| Authorization | {{basic_auth}} |  |



***Responses:***


Status: Success | Code: 200



***Response Headers:***

| Key | Value |
| --- | ------|
| Content-Type | application/json; charset=utf-8 |
| X-Request-Id | e778873b-ef6a-4368-9453-3a3759ae89ed |
| Date | Wed, 27 Nov 2019 02:15:02 GMT |
| Content-Length | 1257 |
| Connection | keep-alive |



```js
{
    "rid": "",
    "result": {
        "status": {
            "code": 0,
            "description": "Success"
        },
        "data": {
            "StatusList": [
                {
                    "code": 0,
                    "description": "Success"
                },
                {
                    "code": 1200,
                    "description": "iBoFOS System Recovery Something"
                },
                {
                    "code": 1234,
                    "description": "iBoFOS System Recovery Inprogress"
                },
                {
                    "code": 2800,
                    "description": "Rebuild begin"
                },
                {
                    "code": 2801,
                    "description": "Rebuild done"
                },
                {
                    "code": 2082,
                    "description": "Rebuildjob added"
                },
                {
                    "code": 2083,
                    "description": "About job slicing point"
                },
                {
                    "code": 2804,
                    "description": "Rebuild progress report"
                },
                {
                    "code": 2805,
                    "description": "Rebuildjob begin"
                },
                {
                    "code": 2806,
                    "description": "Rebuildjob done"
                },
                {
                    "code": 2807,
                    "description": "Rebuilding debug log"
                },
                {
                    "code": 10110,
                    "description": "Auth Error : API does not activate"
                },
                {
                    "code": 10240,
                    "description": "Header Error : X-request-Id is invalid"
                },
                {
                    "code": 10250,
                    "description": "Header Error : ts missing"
                },
                {
                    "code": 10310,
                    "description": "Body Error : Json Error"
                },
                {
                    "code": 11000,
                    "description": "Exec command error"
                },
                {
                    "code": 12000,
                    "description": "iBoF is busy"
                },
                {
                    "code": 12030,
                    "description": "iBoF does not run"
                },
                {
                    "code": 12310,
                    "description": "iBoF Unmarshal Error"
                },
                {
                    "code": 19000,
                    "description": "iBof Response Timeout"
                },
                {
                    "code": 19002,
                    "description": "iBof Socket Connection Error"
                },
                {
                    "code": 40000,
                    "description": "This API does not implemente yet"
                }
            ]
        }
    }
}
```



### 3. FORCEKILLIBOFOS


It just runs "pkill -9 ibofos"



***Endpoint:***

```bash
Method: DELETE
Type: RAW
URL: http://{{host}}/{{vendor}}/api/dagent/v1/ibofos
```


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| X-Request-Id | {{$guid}} |  |
| ts | {{$timestamp}} |  |
| Content-Type | application/json |  |
| Authorization | {{basic_auth}} |  |



***Responses:***


Status: Error | Code: 400



***Response Headers:***

| Key | Value |
| --- | ------|
| Content-Type | application/json; charset=utf-8 |
| X-Request-Id | 6fc1553a-1631-4ef8-aa4e-0036b94d825e |
| Date | Wed, 27 Nov 2019 02:15:37 GMT |
| Content-Length | 85 |
| Connection | keep-alive |



```js
{
    "rid": "",
    "result": {
        "status": {
            "code": 11000,
            "description": "exec Run: exit status 1"
        }
    }
}
```



Status: Success | Code: 200



***Response Headers:***

| Key | Value |
| --- | ------|
| Content-Type | application/json; charset=utf-8 |
| X-Request-Id | 02d34f67-ce83-464a-99ab-641e7f85634e |
| Date | Wed, 27 Nov 2019 02:15:21 GMT |
| Content-Length | 65 |
| Connection | keep-alive |



```js
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



### 4. RUNIBOFOS


It just run command "run_ibof.sh" and does not gurantee to run.


***Endpoint:***

```bash
Method: POST
Type: RAW
URL: http://{{host}}/{{vendor}}/api/dagent/v1/ibofos
```


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| X-Request-Id | {{$guid}} |  |
| ts | {{$timestamp}} |  |
| Content-Type | application/json |  |
| Authorization | {{basic_auth}} |  |



***Responses:***


Status: Error | Code: 400



***Response Headers:***

| Key | Value |
| --- | ------|
| Content-Type | application/json; charset=utf-8 |
| X-Request-Id | 5b20dc94-d1d5-43ad-8636-3fbba9154fe8 |
| Date | Wed, 27 Nov 2019 02:16:35 GMT |
| Content-Length | 94 |
| Connection | keep-alive |



```js
{
    "rid": "",
    "result": {
        "status": {
            "code": 11000,
            "description": "exec Run: The iBoFOS already run"
        }
    }
}
```



Status: Success | Code: 200



***Response Headers:***

| Key | Value |
| --- | ------|
| Content-Type | application/json; charset=utf-8 |
| X-Request-Id | 601b49e5-7cf6-4b79-8aa4-7c1ea374b7ce |
| Date | Wed, 27 Nov 2019 02:16:07 GMT |
| Content-Length | 65 |
| Connection | keep-alive |



```js
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



## iBoFOS
The biz-logic execute in both D-Agent and iBoFOS module



### 1. HEARTBEAT



***Endpoint:***

```bash
Method: GET
Type: 
URL: http://{{host}}/{{vendor}}/api/ibofos/v1/system/heartbeat
```


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| X-Request-Id | {{$guid}} |  |
| ts | {{$timestamp}} |  |
| Content-Type | application/json |  |
| Authorization | {{basic_auth}} |  |



***Responses:***


Status: Error | Code: 400



***Response Headers:***

| Key | Value |
| --- | ------|
| Content-Type | application/json; charset=utf-8 |
| X-Request-Id | 46694ab0-b2bf-4325-9dc4-0021cc324478 |
| Date | Wed, 27 Nov 2019 04:32:22 GMT |
| Content-Length | 79 |
| Connection | keep-alive |



```js
{
    "rid": "",
    "result": {
        "status": {
            "code": 12030,
            "description": "iBoF does not run"
        }
    }
}
```



Status: Success | Code: 200



***Response Headers:***

| Key | Value |
| --- | ------|
| Content-Type | application/json; charset=utf-8 |
| X-Request-Id | 527630b1-31d5-42db-94d7-a057676faffd |
| Date | Wed, 27 Nov 2019 04:31:50 GMT |
| Content-Length | 99 |
| Connection | keep-alive |



```js
{
    "rid": "527630b1-31d5-42db-94d7-a057676faffd",
    "result": {
        "status": {
            "code": 0,
            "description": "alive"
        }
    }
}
```



### 2. EXITIBOFOS



***Endpoint:***

```bash
Method: GET
Type: 
URL: http://{{host}}/{{vendor}}/api/ibofos/v1/system/exitibofos
```


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| X-Request-Id | {{$guid}} |  |
| ts | {{$timestamp}} |  |
| Content-Type | application/json |  |
| Authorization | {{basic_auth}} |  |



***Responses:***


Status: Success | Code: 200



***Response Headers:***

| Key | Value |
| --- | ------|
| X-Request-Id | 78bdf271-fc16-49ce-bd57-00f0c42cec16 |
| Content-Type | application/json |
| Content-Length | 99 |



```js
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
| X-Request-Id | {{$guid}} |  |
| ts | {{$timestamp}} |  |
| Content-Type | application/json |  |
| Authorization | {{basic_auth}} |  |



***Responses:***


Status: Success | Code: 200



***Response Headers:***

| Key | Value |
| --- | ------|
| Content-Type | application/json; charset=utf-8 |
| X-Request-Id | df90d797-a2a7-46ef-8713-dd7f0d5f9529 |
| Date | Wed, 27 Nov 2019 04:33:00 GMT |
| Content-Length | 127 |
| Connection | keep-alive |



```js
{
    "rid": "df90d797-a2a7-46ef-8713-dd7f0d5f9529",
    "result": {
        "status": {
            "code": 0,
            "description": "DONE"
        },
        "data": {
            "state": "Unmounted"
        }
    }
}
```



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
| X-Request-Id | {{$guid}} |  |
| ts | {{$timestamp}} |  |
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



***Responses:***


Status: Success | Code: 200



***Response Headers:***

| Key | Value |
| --- | ------|
| Content-Type | application/json; charset=utf-8 |
| X-Request-Id | deb9617b-5697-45a9-a81d-4a9c7bfd6f87 |
| Date | Wed, 27 Nov 2019 04:35:54 GMT |
| Content-Length | 95 |
| Connection | keep-alive |



```js
{
    "rid": "deb9617b-5697-45a9-a81d-4a9c7bfd6f87",
    "result": {
        "status": {
            "code": 0,
            "description": "0"
        }
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
| X-Request-Id | {{$guid}} |  |
| ts | {{$timestamp}} |  |
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
Type: 
URL: http://{{host}}/{{vendor}}/api/ibofos/v1/device/scan
```


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| X-Request-Id | {{$guid}} |  |
| ts | {{$timestamp}} |  |
| Content-Type | application/json |  |
| Authorization | {{basic_auth}} |  |



***Responses:***


Status: Success | Code: 200



***Response Headers:***

| Key | Value |
| --- | ------|
| Content-Type | application/json; charset=utf-8 |
| X-Request-Id | 953d26c8-2efe-4f86-8601-5294ce52fd89 |
| Date | Wed, 27 Nov 2019 04:34:26 GMT |
| Content-Length | 110 |
| Connection | keep-alive |



```js
{
    "rid": "953d26c8-2efe-4f86-8601-5294ce52fd89",
    "result": {
        "status": {
            "code": 0,
            "description": "Scan Device Done"
        }
    }
}
```



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
Type: 
URL: http://{{host}}/{{vendor}}/api/ibofos/v1/device
```


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| X-Request-Id | {{$guid}} |  |
| ts | {{$timestamp}} |  |
| Content-Type | application/json |  |
| Authorization | {{basic_auth}} |  |



***Responses:***


Status: Success | Code: 200



***Response Headers:***

| Key | Value |
| --- | ------|
| Content-Type | application/json; charset=utf-8 |
| X-Request-Id | 9c30a21f-07b8-4011-a901-d28f66deb8af |
| Date | Wed, 27 Nov 2019 04:34:44 GMT |
| Content-Length | 643 |
| Connection | keep-alive |



```js
{
    "rid": "9c30a21f-07b8-4011-a901-d28f66deb8af",
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
                    "size": 16777216,
                    "sn": "VMWare NVME-0002",
                    "type": "SSD"
                },
                {
                    "mn": "VMware Virtual NVMe Disk",
                    "name": "intel-unvmens-1",
                    "size": 16777216,
                    "sn": "VMWare NVME-0003",
                    "type": "SSD"
                },
                {
                    "mn": "VMware Virtual NVMe Disk",
                    "name": "intel-unvmens-2",
                    "size": 16777216,
                    "sn": "VMWare NVME-0000",
                    "type": "SSD"
                },
                {
                    "mn": "VMware Virtual NVMe Disk",
                    "name": "intel-unvmens-3",
                    "size": 16777216,
                    "sn": "VMWare NVME-0001",
                    "type": "SSD"
                },
                {
                    "mn": "uram0",
                    "name": "uram0",
                    "size": 1048576,
                    "sn": "uram0",
                    "type": "NVRAM"
                }
            ]
        }
    }
}
```



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
| X-Request-Id | {{$guid}} |  |
| ts | {{$timestamp}} |  |
| Content-Type | application/json |  |
| Authorization | {{basic_auth}} |  |



***Responses:***


Status: Success | Code: 200



***Response Headers:***

| Key | Value |
| --- | ------|
| Content-Type | application/json; charset=utf-8 |
| X-Request-Id | 53580d54-4375-4aaf-9619-0c3ac05c8f60 |
| Date | Wed, 27 Nov 2019 04:35:00 GMT |
| Content-Length | 115 |
| Connection | keep-alive |



```js
{
    "rid": "53580d54-4375-4aaf-9619-0c3ac05c8f60",
    "result": {
        "status": {
            "code": 0,
            "description": "NO ARRAY DEVICE EXIST"
        }
    }
}
```



Status: Success | Code: 200



***Response Headers:***

| Key | Value |
| --- | ------|
| Content-Type | application/json; charset=utf-8 |
| X-Request-Id | 8ac075a6-b741-40a2-bb43-719d7e917810 |
| Date | Wed, 27 Nov 2019 04:35:33 GMT |
| Content-Length | 320 |
| Connection | keep-alive |



```js
{
    "rid": "8ac075a6-b741-40a2-bb43-719d7e917810",
    "result": {
        "status": {
            "code": 0,
            "description": "DONE"
        },
        "data": {
            "devicelist": [
                {
                    "name": "uram0",
                    "type": "BUFFER"
                },
                {
                    "name": "intel-unvmens-0",
                    "type": "DATA"
                },
                {
                    "name": "intel-unvmens-1",
                    "type": "DATA"
                },
                {
                    "name": "intel-unvmens-2",
                    "type": "DATA"
                },
                {
                    "name": "intel-unvmens-3",
                    "type": "SPARE"
                }
            ]
        }
    }
}
```



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
| X-Request-Id | {{$guid}} |  |
| ts | {{$timestamp}} |  |
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



***Responses:***


Status: Success | Code: 200



***Response Headers:***

| Key | Value |
| --- | ------|
| Content-Type | application/json; charset=utf-8 |
| X-Request-Id | dba7fbc3-a46d-4c07-ba9c-271581fdec9c |
| Date | Wed, 27 Nov 2019 04:35:20 GMT |
| Content-Length | 98 |
| Connection | keep-alive |



```js
{
    "rid": "dba7fbc3-a46d-4c07-ba9c-271581fdec9c",
    "result": {
        "status": {
            "code": 0,
            "description": "Done"
        }
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
| X-Request-Id | {{$guid}} |  |
| ts | {{$timestamp}} |  |
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
| X-Request-Id | {{$guid}} |  |
| ts | {{$timestamp}} |  |
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



***Responses:***


Status: Success | Code: 200



***Response Headers:***

| Key | Value |
| --- | ------|
| Content-Type | application/json; charset=utf-8 |
| X-Request-Id | 99defa34-b99b-438d-a0d4-95f1c6f3997c |
| Date | Thu, 28 Nov 2019 01:07:25 GMT |
| Content-Length | 98 |
| Connection | keep-alive |



```js
{
    "rid": "99defa34-b99b-438d-a0d4-95f1c6f3997c",
    "result": {
        "status": {
            "code": 0,
            "description": "Done"
        }
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
| X-Request-Id | {{$guid}} |  |
| ts | {{$timestamp}} |  |
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
| X-Request-Id | {{$guid}} |  |
| ts | {{$timestamp}} |  |
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



***Responses:***


Status: Success | Code: 200



***Response Headers:***

| Key | Value |
| --- | ------|
| Content-Type | application/json; charset=utf-8 |
| X-Request-Id | 567e609b-854a-4672-8637-7ef9ce8c277a |
| Date | Wed, 27 Nov 2019 04:37:34 GMT |
| Content-Length | 98 |
| Connection | keep-alive |



```js
{
    "rid": "567e609b-854a-4672-8637-7ef9ce8c277a",
    "result": {
        "status": {
            "code": 0,
            "description": "DONE"
        }
    }
}
```



Status: Error | Code: 400



***Response Headers:***

| Key | Value |
| --- | ------|
| Content-Type | application/json; charset=utf-8 |
| X-Request-Id | 11238da7-6018-477a-aae1-74567cbc8e4d |
| Date | Wed, 27 Nov 2019 04:37:58 GMT |
| Content-Length | 61 |
| Connection | keep-alive |



```js
{
    "rid": "",
    "result": {
        "status": {
            "code": 2022,
            "description": ""
        }
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
| X-Request-Id | {{$guid}} |  |
| ts | {{$timestamp}} |  |
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



***Responses:***


Status: Success | Code: 200



***Response Headers:***

| Key | Value |
| --- | ------|
| Content-Type | application/json; charset=utf-8 |
| X-Request-Id | c6ef5b8a-981a-407a-9366-1416b0afc61d |
| Date | Wed, 27 Nov 2019 04:38:22 GMT |
| Content-Length | 98 |
| Connection | keep-alive |



```js
{
    "rid": "c6ef5b8a-981a-407a-9366-1416b0afc61d",
    "result": {
        "status": {
            "code": 0,
            "description": "DONE"
        }
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
| X-Request-Id | {{$guid}} |  |
| ts | {{$timestamp}} |  |
| Content-Type | application/json |  |
| Authorization | {{basic_auth}} |  |



***Responses:***


Status: Success - Mounted | Code: 200



***Response Headers:***

| Key | Value |
| --- | ------|
| Content-Type | application/json; charset=utf-8 |
| X-Request-Id | b65bf976-2666-4b63-b755-cb08ae9cc18e |
| Date | Wed, 27 Nov 2019 04:39:15 GMT |
| Content-Length | 220 |
| Connection | keep-alive |



```js
{
    "rid": "b65bf976-2666-4b63-b755-cb08ae9cc18e",
    "result": {
        "status": {
            "code": 0,
            "description": "DONE"
        },
        "data": {
            "volumes": [
                {
                    "id": 0,
                    "maxbw": 6000,
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



Status: Success - Unmounted | Code: 200



***Response Headers:***

| Key | Value |
| --- | ------|
| Content-Type | application/json; charset=utf-8 |
| X-Request-Id | 5b1c50ea-fcd0-4d51-b226-430315fc8c50 |
| Date | Wed, 27 Nov 2019 04:38:35 GMT |
| Content-Length | 221 |
| Connection | keep-alive |



```js
{
    "rid": "5b1c50ea-fcd0-4d51-b226-430315fc8c50",
    "result": {
        "status": {
            "code": 0,
            "description": "DONE"
        },
        "data": {
            "volumes": [
                {
                    "id": 0,
                    "maxbw": 6000,
                    "maxiops": 0,
                    "name": "vol01",
                    "remain": 4194304,
                    "status": "Unmouted",
                    "total": 4194304
                }
            ]
        }
    }
}
```



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
| X-Request-Id | {{$guid}} |  |
| ts | {{$timestamp}} |  |
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



***Responses:***


Status: Success | Code: 200



***Response Headers:***

| Key | Value |
| --- | ------|
| Content-Type | application/json; charset=utf-8 |
| X-Request-Id | 24356bf1-92d3-48d1-82da-c2ea9c856927 |
| Date | Wed, 27 Nov 2019 04:39:04 GMT |
| Content-Length | 98 |
| Connection | keep-alive |



```js
{
    "rid": "24356bf1-92d3-48d1-82da-c2ea9c856927",
    "result": {
        "status": {
            "code": 0,
            "description": "DONE"
        }
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
| X-Request-Id | {{$guid}} |  |
| ts | {{$timestamp}} |  |
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



***Responses:***


Status: Success | Code: 200



***Response Headers:***

| Key | Value |
| --- | ------|
| Content-Type | application/json; charset=utf-8 |
| X-Request-Id | 493abe73-2aa7-4efb-969a-1b970f43e834 |
| Date | Thu, 28 Nov 2019 01:10:28 GMT |
| Content-Length | 98 |
| Connection | keep-alive |



```js
{
    "rid": "493abe73-2aa7-4efb-969a-1b970f43e834",
    "result": {
        "status": {
            "code": 0,
            "description": "DONE"
        }
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
| X-Request-Id | {{$guid}} |  |
| ts | {{$timestamp}} |  |
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



***Responses:***


Status: Error | Code: 400



***Response Headers:***

| Key | Value |
| --- | ------|
| Content-Type | application/json; charset=utf-8 |
| X-Request-Id | c1055589-a25c-4c22-b08e-2aadfe53ed24 |
| Date | Thu, 28 Nov 2019 01:09:39 GMT |
| Content-Length | 61 |
| Connection | keep-alive |



```js
{
    "rid": "",
    "result": {
        "status": {
            "code": 2010,
            "description": ""
        }
    }
}
```



Status: Success | Code: 200



***Response Headers:***

| Key | Value |
| --- | ------|
| Content-Type | application/json; charset=utf-8 |
| X-Request-Id | cefe68ce-51a4-4388-a8a1-32bb4ef2fe11 |
| Date | Thu, 28 Nov 2019 01:09:25 GMT |
| Content-Length | 98 |
| Connection | keep-alive |



```js
{
    "rid": "cefe68ce-51a4-4388-a8a1-32bb4ef2fe11",
    "result": {
        "status": {
            "code": 0,
            "description": "DONE"
        }
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
| X-Request-Id | {{$guid}} |  |
| ts | {{$timestamp}} |  |
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
| X-Request-Id | {{$guid}} |  |
| ts | {{$timestamp}} |  |
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
Type: 
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
Type: 
URL: http://{{host}}/{{vendor}}/api/dagent/v1/test/fio
```


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| X-Request-Id | {{$guid}} |  |
| ts | {{$timestamp}} |  |
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
| X-Request-Id | {{$guid}} |  |
| ts | {{$timestamp}} |  |
| Content-Type | application/json |  |
| Authorization | {{basic_auth}} |  |



---
[Back to top](#d-agent)
> Made with &#9829; by [thedevsaddam](https://github.com/thedevsaddam) | Generated at: 2019-12-04 16:53:28 by [docgen](https://github.com/thedevsaddam/docgen)
