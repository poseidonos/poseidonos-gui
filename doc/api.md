
# D-Agent

New collection (imported from DHC)

## Indices

* [DAGENT](#dagent)

  * [TEST - FIO](#1-test---fio)
  * [PING (X-Request-Id empty)](#2-ping-(x-request-id-empty))
  * [PING](#3-ping)
  * [STATUS CODE](#4-status-code)
  * [FORCEKILLIBOFOS](#5-forcekillibofos)
  * [RUNIBOFOS](#6-runibofos)

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


## DAGENT



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



### 2. PING (X-Request-Id empty)



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



### 3. PING



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



### 4. STATUS CODE



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



### 5. FORCEKILLIBOFOS



***Endpoint:***

```bash
Method: DELETE
Type: 
URL: http://{{host}}/{{vendor}}/api/dagent/v1/ibofos
```


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| X-Request-Id | {{xrid}} |  |
| ts | {{timestamp}} |  |
| Content-Type | application/json |  |
| Authorization | {{basic_auth}} |  |



### 6. RUNIBOFOS



***Endpoint:***

```bash
Method: POST
Type: 
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
> Made with &#9829; by [thedevsaddam](https://github.com/thedevsaddam) | Generated at: 2019-11-22 10:13:06 by [docgen](https://github.com/thedevsaddam/docgen)
