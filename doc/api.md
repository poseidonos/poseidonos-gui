
# D-Agent

##### REST API Collection and Documents of D-Agent (Dynamic Agent)

a
a
a
a
s


## Indices

* [Common](#common)

  * [TEST - FIO](#1-test---fio)

* [D-Agent](#d-agent)

  * [PING (X-Request-Id empty)](#1-ping-(x-request-id-empty))
  * [PING](#2-ping)
  * [STATUS CODE](#3-status-code)
  * [FORCEKILLIBOFOS](#4-forcekillibofos)
  * [RUNIBOFOS](#5-runibofos)

* [iBoFOS](#ibofos)

  * [(Temp) TEST - REPORTTEST](#1-(temp)-test---reporttest)
  * [HEARTBEAT (ts empty)](#2-heartbeat-(ts-empty))
  * [HEARTBEAT](#3-heartbeat)
  * [EXITIBOFOS](#4-exitibofos)
  * [iBOFOSINFO](#5-ibofosinfo)
  * [MOUNTIBOFOS](#6-mountibofos)
  * [UNMOUNTIBOFOS](#7-unmountibofos)
  * [SCAN DEVICE](#8-scan-device)
  * [LIST DEVICE](#9-list-device)
  * [LIST ARRAY DEVICE](#10-list-array-device)
  * [CREATE ARRAY](#11-create-array)
  * [LOAD ARRAY](#12-load-array)
  * [DELETE ARRAY](#13-delete-array)
  * [STATE ARRAY](#14-state-array)
  * [CREATE VOLUME](#15-create-volume)
  * [UPDATE VOLUME](#16-update-volume)
  * [LIST VOLUME](#17-list-volume)
  * [MOUNT VOULUME](#18-mount-voulume)
  * [UNMOUNT VOLUME](#19-unmount-volume)
  * [DELETE VOLUME](#20-delete-volume)
  * [ATTACH DEVICE](#21-attach-device)
  * [DETACH DEVICE](#22-detach-device)

* [Redfish](#redfish)

  * [Cahsssis](#1-cahsssis)


--------


## Common
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
| X-Request-Id | {{xrid}} |  |
| ts | {{timestamp}} |  |
| Content-Type | application/json |  |
| Authorization | {{basic_auth}} |  |



## D-Agent
##### The biz-logic execute in D-Agent own module



### 1. PING (X-Request-Id empty)



***Endpoint:***

```bash
Method: GET
Type: 
URL: http://{{host}}/{{vendor}}/api/dagent/v1/ping
```


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| ts | {{timestamp}} |  |
| Content-Type | application/json |  |
| Authorization | {{basic_auth}} |  |



### 2. PING



***Endpoint:***

```bash
Method: GET
Type: 
URL: http://{{host}}/{{vendor}}/api/dagent/v1/ping
```


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| X-Request-Id | {{xrid}} |  |
| ts | {{timestamp}} |  |
| Content-Type | application/json |  |
| Authorization | {{basic_auth}} |  |



### 3. STATUS CODE



***Endpoint:***

```bash
Method: GET
Type: 
URL: http://{{host}}/{{vendor}}/api/dagent/v1/statuscode
```


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| X-Request-Id | {{xrid}} |  |
| ts | {{timestamp}} |  |
| Content-Type | application/json |  |
| Authorization | {{basic_auth}} |  |



### 4. FORCEKILLIBOFOS



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



### 5. RUNIBOFOS



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
##### The biz-logic execute in both D-Agent and iBoFOS module



### 1. (Temp) TEST - REPORTTEST



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



### 2. HEARTBEAT (ts empty)



***Endpoint:***

```bash
Method: GET
Type: 
URL: http://{{host}}/{{vendor}}/api/ibofos/v1/system/heartbeat
```


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| X-Request-Id | {{xrid}} |  |
| Content-Type | application/json |  |
| Authorization | {{basic_auth}} |  |



### 3. HEARTBEAT



***Endpoint:***

```bash
Method: GET
Type: 
URL: http://{{host}}/{{vendor}}/api/ibofos/v1/system/heartbeat
```


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| X-Request-Id | {{xrid}} |  |
| ts | {{timestamp}} |  |
| Content-Type | application/json |  |
| Authorization | {{basic_auth}} |  |



### 4. EXITIBOFOS



***Endpoint:***

```bash
Method: GET
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



### 5. iBOFOSINFO



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



### 6. MOUNTIBOFOS



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



### 7. UNMOUNTIBOFOS



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



### 8. SCAN DEVICE



***Endpoint:***

```bash
Method: GET
Type: 
URL: http://{{host}}/{{vendor}}/api/ibofos/v1/device/scan
```


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| X-Request-Id | {{xrid}} |  |
| ts | {{timestamp}} |  |
| Content-Type | application/json |  |
| Authorization | {{basic_auth}} |  |



### 9. LIST DEVICE



***Endpoint:***

```bash
Method: GET
Type: 
URL: http://{{host}}/{{vendor}}/api/ibofos/v1/device
```


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| X-Request-Id | {{xrid}} |  |
| ts | {{timestamp}} |  |
| Content-Type | application/json |  |
| Authorization | {{basic_auth}} |  |



### 10. LIST ARRAY DEVICE



***Endpoint:***

```bash
Method: GET
Type: 
URL: http://{{host}}/{{vendor}}/api/ibofos/v1/array/device
```


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| X-Request-Id | {{xrid}} |  |
| ts | {{timestamp}} |  |
| Content-Type | application/json |  |
| Authorization | {{basic_auth}} |  |



### 11. CREATE ARRAY



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



### 12. LOAD ARRAY



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



### 13. DELETE ARRAY



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



### 14. STATE ARRAY



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



### 15. CREATE VOLUME



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



### 16. UPDATE VOLUME



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



### 17. LIST VOLUME



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



### 18. MOUNT VOULUME



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



### 19. UNMOUNT VOLUME



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



### 20. DELETE VOLUME



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



### 21. ATTACH DEVICE



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



### 22. DETACH DEVICE



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
##### The biz-logic execute in both D-Agent and BMC module



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



---
[Back to top](#d-agent)
> Made with &#9829; by [thedevsaddam](https://github.com/thedevsaddam) | Generated at: 2019-11-22 15:44:28 by [docgen](https://github.com/thedevsaddam/docgen)
