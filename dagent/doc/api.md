
# D-Agent

REST API Collection and Documents of D-Agent (Dynamic Agent)

## Indices

* [Common](#common)

  * [Template Dummy](#1-template-dummy)

* [Internal](#internal)

  * [DOCUMENTATION (HTML)](#1-documentation-(html))
  * [DOCUMENTATION (MARKDOWN)](#2-documentation-(markdown))
  * [EVENT CODE](#3-event-code)
  * [FORCEKILLIBOFOS](#4-forcekillibofos)

* [D-Agent](#d-agent)

  * [VERSION](#1-version)
  * [HEARTBEAT](#2-heartbeat)

* [Metric](#metric)

  * [CPU](#1-cpu)
  * [CPU with PERIOD](#2-cpu-with-period)
  * [MEMORY](#3-memory)
  * [MEMORY with PERIOD](#4-memory-with-period)
  * [NETWORK](#5-network)
  * [NETWORK with PERIOD](#6-network-with-period)
  * [READ BW](#7-read-bw)
  * [READ BW with PERIOD](#8-read-bw-with-period)
  * [VOL READ BW](#9-vol-read-bw)
  * [VOL READ BW with PERIOD](#10-vol-read-bw-with-period)
  * [WRITE BW](#11-write-bw)
  * [WRITE BW with PERIOD](#12-write-bw-with-period)
  * [VOL WRITE BW](#13-vol-write-bw)
  * [VOL WRITE BW with PERIOD](#14-vol-write-bw-with-period)
  * [READ IOPS](#15-read-iops)
  * [READ IOPS with PERIOD](#16-read-iops-with-period)
  * [VOL READ IOPS](#17-vol-read-iops)
  * [VOL READ IOPS with PERIOD](#18-vol-read-iops-with-period)
  * [WRITE IOPS](#19-write-iops)
  * [WRITE IOPS with PERIOD](#20-write-iops-with-period)
  * [VOL WRITE BW IOPS](#21-vol-write-bw-iops)
  * [VOL WRITE BW IOPS with PERIOD](#22-vol-write-bw-iops-with-period)
  * [LATENCY](#23-latency)
  * [LATENCY with PERIOD](#24-latency-with-period)
  * [VOL LATENCY](#25-vol-latency)
  * [VOL LATENCY with PERIOD](#26-vol-latency-with-period)
  * [REBUILD LOG](#27-rebuild-log)

* [POS/Volume](#posvolume)

  * [CREATE VOLUME](#1-create-volume)
  * [CREATE VOLUME (Multi)](#2-create-volume-(multi))
  * [UPDATE VOLUME QOS](#3-update-volume-qos)
  * [RENAME VOLUME](#4-rename-volume)
  * [LIST VOLUME](#5-list-volume)
  * [MOUNT VOLUME](#6-mount-volume)
  * [UNMOUNT VOLUME](#7-unmount-volume)
  * [DELETE VOLUME](#8-delete-volume)
  * [MAX VOLUME COUNT](#9-max-volume-count)

* [POS/Array](#posarray)

  * [CREATE ARRAY](#1-create-array)
  * [LIST ARRAY DEVICE](#2-list-array-device)
  * [ARRAY INFO](#3-array-info)
  * [DELETE ARRAY](#4-delete-array)
  * [LOAD ARRAY](#5-load-array)

* [POS/Devices](#posdevices)

  * [SCAN DEVICE](#1-scan-device)
  * [ADD DEVICE](#2-add-device)
  * [REMOVE DEVICE](#3-remove-device)
  * [SMART](#4-smart)
  * [LIST DEVICE](#5-list-device)

* [POS/System](#possystem)

  * [RUNIBOFOS](#1-runibofos)
  * [iBOFOSINFO](#2-ibofosinfo)
  * [MOUNTIBOFOS](#3-mountibofos)
  * [UNMOUNTIBOFOS](#4-unmountibofos)
  * [EXITIBOFOS](#5-exitibofos)


--------


## Common
***
#### Contact
* Contact : d.moon@samsung.com / hs.moon0112@samsung.com  

***
#### About
* D-Agent's default port 80 in Nginx (Internal Default is 3000)
* Dev Doucment : http://10.227.30.174:7990/projects/IBOF/repos/m9k/browse/dagent/readme.MD

***

#### Request Headers
* UUID : https://tools.ietf.org/html/rfc4122  

| Key | Value | Sample |
| --- | ------|-------------|
| X-Request-Id | {uuid4} | 44f1280b-982e-4d2e-ab14-fe9eb2022045 |
| ts | {unix_timestamp} | 1566287153702 |
| Content-Type | application/json | application/json |
 
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
| X-Request-Id | {the same as request's} | 44f1280b-982e-4d2e-ab14-fe9eb2022045 |
| Content-Type | application/json | application/json |
| Content-Length | {ength} | 97 |

***

#### Response Body (CRUD)
* All API has common response scheme.

Response Sample
```json
{
   "result":{
    "status":{
      "code":0,
      "description":"Some Message"
    },
    "data":{ // Optional
      // Ref. each command
    } 
  },
  "info": { // Optional
      "state": "OFFLINE",
      "situation": "DEFAULT",
      "rebuliding_progress": 0,
      "capacity": 0,
      "used": 0
  }
}
```

***

#### Timeout
* D-Agent default both read and write timeout is 30sec
* D-Agent waits 29sec from POS  

***

#### Busy Status
* If iBof is busy, D-Agent return busy response



### 1. Template Dummy



***Endpoint:***

```bash
Method: GET
Type: 
URL: 
```



## Internal
Internal is only for POS developer and QA.  
Internal APIs will not provide to 3rd party



### 1. DOCUMENTATION (HTML)



***Endpoint:***

```bash
Method: GET
Type: 
URL: http://{{host}}/api/dagent/v1/doc/api.html
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
| X-Request-Id | 562b9d26-1fbf-4aaa-9cb8-c9bef13ffbee |
| Date | Fri, 05 Jun 2020 06:34:16 GMT |
| Content-Length | 267 |
| Connection | keep-alive |



```js
{
    "rid": "",
    "lastSuccessTime": 0,
    "result": {
        "status": {
            "module": "",
            "code": 0,
            "description": "Success"
        },
        "data": {
            "githash": "b98039e5f8ab19351994044960cf0e27262665b4",
            "build_time": "1591338851"
        }
    },
    "info": {
        "state": "",
        "situation": "",
        "rebuliding_progress": 0,
        "capacity": 0,
        "used": 0
    }
}
```



### 2. DOCUMENTATION (MARKDOWN)



***Endpoint:***

```bash
Method: GET
Type: 
URL: http://{{host}}/api/dagent/v1/doc/api.md
```


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| X-Request-Id | {{$guid}} |  |
| ts | {{$timestamp}} |  |
| Content-Type | application/json |  |
| Authorization | {{basic_auth}} |  |



### 3. EVENT CODE


It will return all POS syste status code and description


***Endpoint:***

```bash
Method: GET
Type: 
URL: http://{{host}}/api/dagent/v1/doc/events.yaml
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
| X-Request-Id | 1dd8be0f-cf72-4c11-ae9e-8216d47717fa |
| Date | Fri, 08 May 2020 09:15:51 GMT |
| Transfer-Encoding | chunked |
| Connection | keep-alive |



```js
{
    "rid": "",
    "lastSuccessTime": 0,
    "result": {
        "status": {
            "module": "",
            "code": 0,
            "description": "Success"
        },
        "data": {
            "StatusList": [
                {
                    "module": "",
                    "code": 0,
                    "description": "Success"
                },
                {
                    "module": "",
                    "code": 1200,
                    "description": "iBoFOS System Recovery Something"
                },
                {
                    "module": "",
                    "code": 1234,
                    "description": "iBoFOS System Recovery In Progress"
                },
                {
                    "module": "",
                    "code": 2060,
                    "description": "Fail to create volume meta"
                },
                {
                    "module": "",
                    "code": 2800,
                    "description": "Rebuild begin"
                },
                {
                    "module": "",
                    "code": 2801,
                    "description": "Rebuild done"
                },
                {
                    "module": "",
                    "code": 2082,
                    "description": "Rebuildjob added"
                },
                {
                    "module": "",
                    "code": 2083,
                    "description": "About job slicing point"
                },
                {
                    "module": "",
                    "code": 2500,
                    "description": "Array is alreday mounted"
                },
                {
                    "module": "",
                    "code": 2501,
                    "description": "Array is already umounted"
                },
                {
                    "module": "",
                    "code": 2052,
                    "description": "Array already exists"
                },
                {
                    "module": "",
                    "code": 2053,
                    "description": "Array does not exists"
                },
                {
                    "module": "",
                    "code": 2804,
                    "description": "Rebuild progress report"
                },
                {
                    "module": "",
                    "code": 2805,
                    "description": "Rebuildjob begin"
                },
                {
                    "module": "",
                    "code": 2806,
                    "description": "Rebuildjob done"
                },
                {
                    "module": "",
                    "code": 2807,
                    "description": "Rebuilding debug log"
                },
                {
                    "module": "",
                    "code": 10110,
                    "description": "Auth Error : API does not activate",
                    "solution": "Activate API"
                },
                {
                    "module": "",
                    "code": 10240,
                    "description": "Header Error : X-request-Id is invalid",
                    "solution": "Put valid value"
                },
                {
                    "module": "",
                    "code": 10250,
                    "description": "Header Error : ts missing",
                    "solution": "Put valid value"
                },
                {
                    "module": "",
                    "code": 10310,
                    "description": "Body Error : Json Error",
                    "solution": "Put valid value"
                },
                {
                    "module": "",
                    "code": 11000,
                    "description": "Exec command error"
                },
                {
                    "module": "",
                    "code": 12000,
                    "description": "iBoF is busy",
                    "solution": "Try later"
                },
                {
                    "module": "",
                    "code": 12030,
                    "description": "iBoF does not run",
                    "solution": "run iBoFOS first"
                },
                {
                    "module": "",
                    "code": 11010,
                    "description": "iBoF Unmarshal Error",
                    "solution": "Put valid value"
                },
                {
                    "module": "",
                    "code": 19000,
                    "description": "iBof Response Timeout"
                },
                {
                    "module": "",
                    "code": 11000,
                    "description": "iBof Socket Connection Error"
                },
                {
                    "module": "",
                    "code": 27756,
                    "description": "exec Run: The iBoFOS already run"
                },
                {
                    "module": "",
                    "code": 27757,
                    "description": "exec Run: Fail to run iBoFOS"
                },
                {
                    "module": "",
                    "code": 40000,
                    "description": "This API does not implemente yet"
                }
            ]
        }
    },
    "info": {
        "state": "",
        "situation": "",
        "rebuliding_progress": 0,
        "capacity": 0,
        "used": 0
    }
}
```



### 4. FORCEKILLIBOFOS


It just runs "pkill -9 ibofos"



***Endpoint:***

```bash
Method: DELETE
Type: RAW
URL: http://{{host}}/api/dagent/v1/ibofos
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
| X-Request-Id | e236b251-5bbf-457b-97e2-b1b63aacadd9 |
| Date | Fri, 08 May 2020 10:13:46 GMT |
| Content-Length | 179 |
| Connection | keep-alive |



```js
{
    "rid": "",
    "lastSuccessTime": 0,
    "result": {
        "status": {
            "module": "",
            "code": 0,
            "description": "Success"
        }
    },
    "info": {
        "state": "",
        "situation": "",
        "rebuliding_progress": 0,
        "capacity": 0,
        "used": 0
    }
}
```



## D-Agent
The most biz-logic executes in D-Agent own module



### 1. VERSION



***Endpoint:***

```bash
Method: GET
Type: 
URL: http://{{host}}/api/dagent/v1/version
```


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| X-Request-Id | {{$guid}} |  |
| ts | {{$timestamp}} |  |
| Content-Type | application/json |  |
| Authorization | {{basic_auth}} |  |



***Responses:***


Status: Fail | Code: 400



***Response Headers:***

| Key | Value |
| --- | ------|
| Content-Type | application/json; charset=utf-8 |
| X-Request-Id | c950f121-dd24-4f31-822e-69c70f1c432a |
| Date | Fri, 05 Jun 2020 06:32:42 GMT |
| Content-Length | 223 |



```js
{
    "rid": "",
    "lastSuccessTime": 0,
    "result": {
        "status": {
            "module": "COMMON",
            "code": 12020,
            "level": "ERROR",
            "description": "could not find build info"
        },
        "data": {
            "githash": "",
            "build_time": ""
        }
    },
    "info": {
        "state": "",
        "situation": "",
        "rebuliding_progress": 0,
        "capacity": 0,
        "used": 0
    }
}
```



Status: Success | Code: 200



***Response Headers:***

| Key | Value |
| --- | ------|
| Content-Type | application/json; charset=utf-8 |
| X-Request-Id | 562b9d26-1fbf-4aaa-9cb8-c9bef13ffbee |
| Date | Fri, 05 Jun 2020 06:34:16 GMT |
| Content-Length | 267 |
| Connection | keep-alive |



```js
{
    "rid": "",
    "lastSuccessTime": 0,
    "result": {
        "status": {
            "module": "COMMON",
            "code": 0,
            "level": "INFO",
            "description": "Success"
        },
        "data": {
            "githash": "3c25b82ae226af620a99fd8e42b921662a658219",
            "buildTime": "1597889522"
        }
    }
}
```



### 2. HEARTBEAT


It will check POS status.
D-Agent holds cached status of POS for 4sec.


***Endpoint:***

```bash
Method: GET
Type: 
URL: http://{{host}}/api/dagent/v1/heartbeat
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
| X-Request-Id | 6e87f233-44bc-4981-a747-e2c325d4268f |
| Date | Fri, 08 May 2020 09:15:37 GMT |
| Content-Length | 186 |
| Connection | keep-alive |



```js
{
    "rid": "",
    "lastSuccessTime": 1597908627,
    "result": {
        "status": {
            "module": "COMMON",
            "code": 0,
            "level": "INFO",
            "description": "Success"
        }
    }
}
```



Status: Fail | Code: 400



***Response Headers:***

| Key | Value |
| --- | ------|
| Date | Thu, 20 Aug 2020 07:28:16 GMT |
| Content-Type | application/json; charset=utf-8 |
| Content-Length | 158 |
| X-Request-Id | b14c6017-a5ab-41bf-bdaa-1ef872b2a693 |
| Connection | keep-alive |



```js
{
    "rid": "",
    "lastSuccessTime": 0,
    "result": {
        "status": {
            "module": "Management Stack(M9K)",
            "code": 12010,
            "level": "ERROR",
            "description": "one of iBoF service is dead"
        }
    }
}
```



## Metric



### 1. CPU



***Endpoint:***

```bash
Method: GET
Type: 
URL: http://{{host}}/api/metric/v1/cpu
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
| X-Request-Id | 562b9d26-1fbf-4aaa-9cb8-c9bef13ffbee |
| Date | Fri, 05 Jun 2020 06:34:16 GMT |
| Content-Length | 267 |
| Connection | keep-alive |



```js
{
    "rid": "",
    "lastSuccessTime": 0,
    "result": {
        "status": {
            "module": "COMMON",
            "code": 0,
            "level": "INFO",
            "description": "Success"
        },
        "data": [
            {
                "time": 1597734721044941113,
                "usageUser": 9.188034187863039
            }
        ]
    }
}
```



### 2. CPU with PERIOD



***Endpoint:***

```bash
Method: GET
Type: 
URL: http://{{host}}/api/metric/v1/cpu/{{period}}
```


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| X-Request-Id | {{$guid}} |  |
| ts | {{$timestamp}} |  |
| Content-Type | application/json |  |
| Authorization | {{basic_auth}} |  |



***Responses:***


Status: Fail | Code: 400



***Response Headers:***

| Key | Value |
| --- | ------|
| Content-Type | application/json; charset=utf-8 |
| X-Request-Id | c950f121-dd24-4f31-822e-69c70f1c432a |
| Date | Fri, 05 Jun 2020 06:32:42 GMT |
| Content-Length | 223 |



```js
{
    "rid": "",
    "lastSuccessTime": 0,
    "result": {
        "status": {
            "module": "MAgent",
            "code": 21010,
            "level": "ERROR",
            "description": "Time parameter error",
            "problem": "Invalid time period specified",
            "solution": "use time from 1m,5m,15m,1h,6h,12h,24h,7d,30d"
        },
        "data": []
    }
}
```



Status: Success | Code: 200



***Response Headers:***

| Key | Value |
| --- | ------|
| Content-Type | application/json; charset=utf-8 |
| X-Request-Id | 562b9d26-1fbf-4aaa-9cb8-c9bef13ffbee |
| Date | Fri, 05 Jun 2020 06:34:16 GMT |
| Content-Length | 267 |
| Connection | keep-alive |



```js
{
    "rid": "",
    "lastSuccessTime": 0,
    "result": {
        "status": {
            "module": "COMMON",
            "code": 0,
            "level": "INFO",
            "description": "Success"
        },
        "data": [
            {
                "time": 1597734494000000000,
                "usageUser": 8.904109589275766
            },
            {
                "time": 1597734496000000000,
                "usageUser": 8.932369203964832
            },
            {
                "time": 1597734498000000000,
                "usageUser": 9.071550256103384
            },
            {
                "time": 1597734500000000000,
                "usageUser": 9.211087419587525
            },
            {
                "time": 1597734502000000000,
                "usageUser": 9.00554844300112
            }
        ]
    }
}
```



### 3. MEMORY



***Endpoint:***

```bash
Method: GET
Type: 
URL: http://{{host}}/api/metric/v1/memory
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
| X-Request-Id | 562b9d26-1fbf-4aaa-9cb8-c9bef13ffbee |
| Date | Fri, 05 Jun 2020 06:34:16 GMT |
| Content-Length | 267 |
| Connection | keep-alive |



```js
{
    "rid": "",
    "lastSuccessTime": 0,
    "result": {
        "status": {
            "module": "COMMON",
            "code": 0,
            "level": "INFO",
            "description": "Success"
        },
        "data": [
            {
                "time": 1597734867980046613,
                "usageUser": 58.26696813592269
            }
        ]
    }
}
```



### 4. MEMORY with PERIOD



***Endpoint:***

```bash
Method: GET
Type: 
URL: http://{{host}}/api/metric/v1/memory/{{period}}
```


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| X-Request-Id | {{$guid}} |  |
| ts | {{$timestamp}} |  |
| Content-Type | application/json |  |
| Authorization | {{basic_auth}} |  |



***Responses:***


Status: Fail | Code: 400



***Response Headers:***

| Key | Value |
| --- | ------|
| Content-Type | application/json; charset=utf-8 |
| X-Request-Id | c950f121-dd24-4f31-822e-69c70f1c432a |
| Date | Fri, 05 Jun 2020 06:32:42 GMT |
| Content-Length | 223 |



```js
{
    "rid": "",
    "lastSuccessTime": 0,
    "result": {
        "status": {
            "module": "MAgent",
            "code": 21010,
            "level": "ERROR",
            "description": "Time parameter error",
            "problem": "Invalid time period specified",
            "solution": "use time from 1m,5m,15m,1h,6h,12h,24h,7d,30d"
        },
        "data": []
    }
}
```



Status: Success | Code: 200



***Response Headers:***

| Key | Value |
| --- | ------|
| Content-Type | application/json; charset=utf-8 |
| X-Request-Id | 562b9d26-1fbf-4aaa-9cb8-c9bef13ffbee |
| Date | Fri, 05 Jun 2020 06:34:16 GMT |
| Content-Length | 267 |
| Connection | keep-alive |



```js
{
    "rid": "",
    "lastSuccessTime": 0,
    "result": {
        "status": {
            "module": "COMMON",
            "code": 0,
            "level": "INFO",
            "description": "Success"
        },
        "data": [
            {
                "time": 1597734590000000000,
                "usageUser": 58.280068777146624
            },
            {
                "time": 1597734591000000000,
                "usageUser": 58.27984921332723
            },
            {
                "time": 1597734592000000000,
                "usageUser": 58.27962964950783
            },
            {
                "time": 1597734593000000000,
                "usageUser": 58.282093643481055
            },
            {
                "time": 1597734594000000000,
                "usageUser": 58.281190992223536
            },
            {
                "time": 1597734595000000000,
                "usageUser": 58.28163011986233
            },
            {
                "time": 1597734596000000000,
                "usageUser": 58.281386160063
            }
        ]
    }
}
```



### 5. NETWORK



***Endpoint:***

```bash
Method: GET
Type: 
URL: http://{{host}}/api/metric/v1/network
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
| X-Request-Id | 562b9d26-1fbf-4aaa-9cb8-c9bef13ffbee |
| Date | Fri, 05 Jun 2020 06:34:16 GMT |
| Content-Length | 267 |
| Connection | keep-alive |



```js
{
    "rid": "",
    "lastSuccessTime": 0,
    "result": {
        "status": {
            "module": "COMMON",
            "code": 0,
            "level": "INFO",
            "description": "Success"
        },
        "data": [
            {
                "time": 0,
                "bytesRecv": 83131870,
                "bytesSent": 32235833,
                "dropIn": 0,
                "dropOut": 0,
                "packetsRecv": 303382,
                "packetsSent": 187262
            }
        ]
    }
}
```



### 6. NETWORK with PERIOD



***Endpoint:***

```bash
Method: GET
Type: 
URL: http://{{host}}/api/metric/v1/network/{{period}}
```


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| X-Request-Id | {{$guid}} |  |
| ts | {{$timestamp}} |  |
| Content-Type | application/json |  |
| Authorization | {{basic_auth}} |  |



***Responses:***


Status: Fail | Code: 400



***Response Headers:***

| Key | Value |
| --- | ------|
| Content-Type | application/json; charset=utf-8 |
| X-Request-Id | c950f121-dd24-4f31-822e-69c70f1c432a |
| Date | Fri, 05 Jun 2020 06:32:42 GMT |
| Content-Length | 223 |



```js
{
    "rid": "",
    "lastSuccessTime": 0,
    "result": {
        "status": {
            "module": "MAgent",
            "code": 21010,
            "level": "ERROR",
            "description": "Time parameter error",
            "problem": "Invalid time period specified",
            "solution": "use time from 1m,5m,15m,1h,6h,12h,24h,7d,30d"
        },
        "data": []
    }
}
```



Status: Success | Code: 200



***Response Headers:***

| Key | Value |
| --- | ------|
| Content-Type | application/json; charset=utf-8 |
| X-Request-Id | 562b9d26-1fbf-4aaa-9cb8-c9bef13ffbee |
| Date | Fri, 05 Jun 2020 06:34:16 GMT |
| Content-Length | 267 |
| Connection | keep-alive |



```js
{
    "rid": "",
    "lastSuccessTime": 0,
    "result": {
        "status": {
            "module": "COMMON",
            "code": 0,
            "level": "INFO",
            "description": "Success"
        },
        "data": [
            {
                "time": 1597738402000000000,
                "bytesRecv": 41148503,
                "bytesSent": 16558355.75,
                "dropIn": 0,
                "dropOut": 0,
                "packetsRecv": 147997.75,
                "packetsSent": 97631.75
            },
            {
                "time": 1597738403000000000,
                "bytesRecv": 41148503,
                "bytesSent": 16558355.75,
                "dropIn": 0,
                "dropOut": 0,
                "packetsRecv": 147997.75,
                "packetsSent": 97631.75
            },
            {
                "time": 1597738404000000000,
                "bytesRecv": 41148708,
                "bytesSent": 16558355.75,
                "dropIn": 0,
                "dropOut": 0,
                "packetsRecv": 147998.75,
                "packetsSent": 97631.75
            },
            {
                "time": 1597738405000000000,
                "bytesRecv": 41149103.5,
                "bytesSent": 16558355.75,
                "dropIn": 0,
                "dropOut": 0,
                "packetsRecv": 148000.25,
                "packetsSent": 97631.75
            },
            {
                "time": 1597738406000000000,
                "bytesRecv": 41149308.5,
                "bytesSent": 16558355.75,
                "dropIn": 0,
                "dropOut": 0,
                "packetsRecv": 148001.25,
                "packetsSent": 97631.75
            }
        ]
    }
}
```



### 7. READ BW



***Endpoint:***

```bash
Method: GET
Type: 
URL: http://{{host}}/api/metric/v1/readbw
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
| X-Request-Id | 562b9d26-1fbf-4aaa-9cb8-c9bef13ffbee |
| Date | Fri, 05 Jun 2020 06:34:16 GMT |
| Content-Length | 267 |
| Connection | keep-alive |



```js
{
    "rid": "",
    "lastSuccessTime": 0,
    "result": {
        "status": {
            "module": "COMMON",
            "code": 0,
            "level": "INFO",
            "description": "Success"
        },
        "data": [
            {
                "bw": 22313472,
                "time": 1597735688784524383
            }
        ]
    }
}
```



### 8. READ BW with PERIOD



***Endpoint:***

```bash
Method: GET
Type: 
URL: http://{{host}}/api/metric/v1/readbw/{{period}}
```


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| X-Request-Id | {{$guid}} |  |
| ts | {{$timestamp}} |  |
| Content-Type | application/json |  |
| Authorization | {{basic_auth}} |  |



***Responses:***


Status: Fail - 0 invalid time interval, empty response | Code: 400



***Response Headers:***

| Key | Value |
| --- | ------|
| Content-Type | application/json; charset=utf-8 |
| X-Request-Id | 1293204d-6196-45ec-b886-0eb4738b9f3a |
| Date | Wed, 19 Aug 2020 06:55:20 GMT |
| Content-Length | 128 |



```js
{
    "rid": "",
    "lastSuccessTime": 0,
    "result": {
        "status": {
            "module": "MAgent",
            "code": 21010,
            "level": "ERROR",
            "description": "Time parameter error",
            "problem": "Invalid time period specified",
            "solution": "use time from 1m,5m,15m,1h,6h,12h,24h,7d,30d"
        },
        "data": []
    }
}
```



Status: Success | Code: 200



***Response Headers:***

| Key | Value |
| --- | ------|
| Content-Type | application/json; charset=utf-8 |
| X-Request-Id | 562b9d26-1fbf-4aaa-9cb8-c9bef13ffbee |
| Date | Fri, 05 Jun 2020 06:34:16 GMT |
| Content-Length | 267 |
| Connection | keep-alive |



```js
{
    "rid": "",
    "lastSuccessTime": 0,
    "result": {
        "status": {
            "module": "COMMON",
            "code": 0,
            "level": "INFO",
            "description": "Success"
        },
        "data": [
            {
                "bw": 0,
                "time": 1597739252000000000
            },
            {
                "bw": 0,
                "time": 1597739253000000000
            },
            {
                "bw": 0,
                "time": 1597739254000000000
            },
            {
                "bw": 35348480,
                "time": 1597739255000000000
            },
            {
                "bw": 45733376,
                "time": 1597739256000000000
            },
            {
                "bw": 23500288,
                "time": 1597739257000000000
            },
            {
                "bw": 11842048,
                "time": 1597739258000000000
            },
            {
                "bw": 14945280,
                "time": 1597739259000000000
            },
            {
                "bw": 15092224,
                "time": 1597739260000000000
            },
            {
                "bw": 23834624,
                "time": 1597739261000000000
            }
        ]
    }
}
```



### 9. VOL READ BW



***Endpoint:***

```bash
Method: GET
Type: 
URL: http://{{host}}/api/metric/v1/volumes/{{volid01}}/readbw
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
| X-Request-Id | 562b9d26-1fbf-4aaa-9cb8-c9bef13ffbee |
| Date | Fri, 05 Jun 2020 06:34:16 GMT |
| Content-Length | 267 |
| Connection | keep-alive |



```js
{
    "rid": "",
    "lastSuccessTime": 0,
    "result": {
        "status": {
            "module": "COMMON",
            "code": 0,
            "level": "INFO",
            "description": "Success"
        },
        "data": [
            {
                "bw": 0,
                "time": 1597735928875564783
            }
        ]
    }
}
```



### 10. VOL READ BW with PERIOD



***Endpoint:***

```bash
Method: GET
Type: 
URL: http://{{host}}/api/metric/v1/volumes/{{volid01}}/readbw/{{period}}
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
| X-Request-Id | 562b9d26-1fbf-4aaa-9cb8-c9bef13ffbee |
| Date | Fri, 05 Jun 2020 06:34:16 GMT |
| Content-Length | 267 |
| Connection | keep-alive |



```js
{
    "rid": "",
    "lastSuccessTime": 0,
    "result": {
        "status": {
            "module": "COMMON",
            "code": 0,
            "level": "INFO",
            "description": "Success"
        },
        "data": [
            {
                "bw": 0,
                "time": 1597735678000000000
            },
            {
                "bw": 0,
                "time": 1597735679000000000
            },
            {
                "bw": 0,
                "time": 1597735680000000000
            },
            {
                "bw": 28773888,
                "time": 1597735681000000000
            },
            {
                "bw": 53703680,
                "time": 1597735682000000000
            }
        ]
    }
}
```



Status: Fail - 0 invalid time interval, empty response | Code: 400



***Response Headers:***

| Key | Value |
| --- | ------|
| Content-Type | application/json; charset=utf-8 |
| X-Request-Id | 4360d852-cd5e-4dd5-a4c8-cb0015bd6a36 |
| Date | Wed, 19 Aug 2020 06:54:35 GMT |
| Content-Length | 128 |



```js
{
    "rid": "",
    "lastSuccessTime": 0,
    "result": {
        "status": {
            "module": "MAgent",
            "code": 21010,
            "level": "ERROR",
            "description": "Time parameter error",
            "problem": "Invalid time period specified",
            "solution": "use time from 1m,5m,15m,1h,6h,12h,24h,7d,30d"
        },
        "data": []
    }
}
```



### 11. WRITE BW



***Endpoint:***

```bash
Method: GET
Type: 
URL: http://{{host}}/api/metric/v1/writebw
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
| X-Request-Id | 562b9d26-1fbf-4aaa-9cb8-c9bef13ffbee |
| Date | Fri, 05 Jun 2020 06:34:16 GMT |
| Content-Length | 267 |
| Connection | keep-alive |



```js
{
    "rid": "",
    "lastSuccessTime": 0,
    "result": {
        "status": {
            "module": "COMMON",
            "code": 0,
            "level": "INFO",
            "description": "Success"
        },
        "data": [
            {
                "bw": 53438976,
                "time": 1597735948079139123
            }
        ]
    }
}
```



### 12. WRITE BW with PERIOD



***Endpoint:***

```bash
Method: GET
Type: 
URL: http://{{host}}/api/metric/v1/writebw/{{period}}
```


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| X-Request-Id | {{$guid}} |  |
| ts | {{$timestamp}} |  |
| Content-Type | application/json |  |
| Authorization | {{basic_auth}} |  |



***Responses:***


Status: Fail - 0 invalid time interval, empty response | Code: 400



***Response Headers:***

| Key | Value |
| --- | ------|
| Content-Type | application/json; charset=utf-8 |
| X-Request-Id | 08484908-859d-48d0-8d76-25f09b68216d |
| Date | Wed, 19 Aug 2020 06:53:56 GMT |
| Content-Length | 128 |



```js
{
    "rid": "",
    "lastSuccessTime": 0,
    "result": {
        "status": {
            "module": "MAgent",
            "code": 21010,
            "level": "ERROR",
            "description": "Time parameter error",
            "problem": "Invalid time period specified",
            "solution": "use time from 1m,5m,15m,1h,6h,12h,24h,7d,30d"
        },
        "data": []
    }
}
```



Status: Success | Code: 200



***Response Headers:***

| Key | Value |
| --- | ------|
| Content-Type | application/json; charset=utf-8 |
| X-Request-Id | 562b9d26-1fbf-4aaa-9cb8-c9bef13ffbee |
| Date | Fri, 05 Jun 2020 06:34:16 GMT |
| Content-Length | 267 |
| Connection | keep-alive |



```js
{
    "rid": "",
    "lastSuccessTime": 0,
    "result": {
        "status": {
            "module": "COMMON",
            "code": 0,
            "level": "INFO",
            "description": "Success"
        },
        "data": [
            {
                "bw": 0,
                "time": 1597735793000000000
            },
            {
                "bw": 29779968,
                "time": 1597735794000000000
            },
            {
                "bw": 26093568,
                "time": 1597735795000000000
            },
            {
                "bw": 28407808,
                "time": 1597735796000000000
            },
            {
                "bw": 0,
                "time": 1597735797000000000
            },
            {
                "bw": 0,
                "time": 1597735798000000000
            },
            {
                "bw": 6858752,
                "time": 1597735799000000000
            },
            {
                "bw": 0,
                "time": 1597735800000000000
            },
            {
                "bw": 0,
                "time": 1597735801000000000
            },
            {
                "bw": 17127936,
                "time": 1597735802000000000
            },
            {
                "bw": 21874688,
                "time": 1597735803000000000
            },
            {
                "bw": 21850112,
                "time": 1597735804000000000
            }
        ]
    }
}
```



### 13. VOL WRITE BW



***Endpoint:***

```bash
Method: GET
Type: 
URL: http://{{host}}/api/metric/v1/volumes/{{volid01}}/writebw
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
| X-Request-Id | 562b9d26-1fbf-4aaa-9cb8-c9bef13ffbee |
| Date | Fri, 05 Jun 2020 06:34:16 GMT |
| Content-Length | 267 |
| Connection | keep-alive |



```js
{
    "rid": "",
    "lastSuccessTime": 0,
    "result": {
        "status": {
            "module": "",
            "code": 0,
            "description": "Success"
        },
        "data": {
            "githash": "b98039e5f8ab19351994044960cf0e27262665b4",
            "build_time": "1591338851"
        }
    },
    "info": {
        "state": "",
        "situation": "",
        "rebuliding_progress": 0,
        "capacity": 0,
        "used": 0
    }
}
```



### 14. VOL WRITE BW with PERIOD



***Endpoint:***

```bash
Method: GET
Type: 
URL: http://{{host}}/api/metric/v1/volumes/{{volid01}}/writebw/{{period}}
```


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| X-Request-Id | {{$guid}} |  |
| ts | {{$timestamp}} |  |
| Content-Type | application/json |  |
| Authorization | {{basic_auth}} |  |



***Responses:***


Status: Fail - 0 invalid time interval, empty response | Code: 400



***Response Headers:***

| Key | Value |
| --- | ------|
| Content-Type | application/json; charset=utf-8 |
| X-Request-Id | cb3df3ea-4063-49ef-9d1a-b3514c3e9c5c |
| Date | Wed, 19 Aug 2020 06:53:10 GMT |
| Content-Length | 128 |



```js
{
    "rid": "",
    "lastSuccessTime": 0,
    "result": {
        "status": {
            "module": "MAgent",
            "code": 21010,
            "level": "ERROR",
            "description": "Time parameter error",
            "problem": "Invalid time period specified",
            "solution": "use time from 1m,5m,15m,1h,6h,12h,24h,7d,30d"
        },
        "data": []
    }
}
```



Status: Success | Code: 200



***Response Headers:***

| Key | Value |
| --- | ------|
| Content-Type | application/json; charset=utf-8 |
| X-Request-Id | 562b9d26-1fbf-4aaa-9cb8-c9bef13ffbee |
| Date | Fri, 05 Jun 2020 06:34:16 GMT |
| Content-Length | 267 |
| Connection | keep-alive |



```js
{
    "rid": "",
    "lastSuccessTime": 0,
    "result": {
        "status": {
            "module": "COMMON",
            "code": 0,
            "level": "INFO",
            "description": "Success"
        },
        "data": [
            {
                "bw": 0,
                "time": 1597736239000000000
            },
            {
                "bw": 7731712,
                "time": 1597736240000000000
            },
            {
                "bw": 26097664,
                "time": 1597736241000000000
            },
            {
                "bw": 24965632,
                "time": 1597736242000000000
            },
            {
                "bw": 26224128,
                "time": 1597736243000000000
            },
            {
                "bw": 19838464,
                "time": 1597736244000000000
            },
            {
                "bw": 0,
                "time": 1597736245000000000
            },
            {
                "bw": 0,
                "time": 1597736246000000000
            }
        ]
    }
}
```



### 15. READ IOPS



***Endpoint:***

```bash
Method: GET
Type: 
URL: http://{{host}}/api/metric/v1/readiops
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
| X-Request-Id | 562b9d26-1fbf-4aaa-9cb8-c9bef13ffbee |
| Date | Fri, 05 Jun 2020 06:34:16 GMT |
| Content-Length | 267 |
| Connection | keep-alive |



```js
{
    "rid": "",
    "lastSuccessTime": 0,
    "result": {
        "status": {
            "module": "COMMON",
            "code": 0,
            "level": "INFO",
            "description": "Success"
        },
        "data": [
            {
                "iops": 1633,
                "time": 1597736262767388762
            }
        ]
    }
}
```



### 16. READ IOPS with PERIOD



***Endpoint:***

```bash
Method: GET
Type: 
URL: http://{{host}}/api/metric/v1/readiops/{{period}}
```


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| X-Request-Id | {{$guid}} |  |
| ts | {{$timestamp}} |  |
| Content-Type | application/json |  |
| Authorization | {{basic_auth}} |  |



***Responses:***


Status: Fail - 0 invalid time interval, empty response | Code: 400



***Response Headers:***

| Key | Value |
| --- | ------|
| Content-Type | application/json; charset=utf-8 |
| X-Request-Id | 934dda29-1780-40f8-8461-97afbe4bbd70 |
| Date | Wed, 19 Aug 2020 06:51:38 GMT |
| Content-Length | 128 |



```js
{
    "rid": "",
    "lastSuccessTime": 0,
    "result": {
        "status": {
            "module": "MAgent",
            "code": 21010,
            "level": "ERROR",
            "description": "Time parameter error",
            "problem": "Invalid time period specified",
            "solution": "use time from 1m,5m,15m,1h,6h,12h,24h,7d,30d"
        },
        "data": []
    }
}
```



Status: Success | Code: 200



***Response Headers:***

| Key | Value |
| --- | ------|
| Content-Type | application/json; charset=utf-8 |
| X-Request-Id | 562b9d26-1fbf-4aaa-9cb8-c9bef13ffbee |
| Date | Fri, 05 Jun 2020 06:34:16 GMT |
| Content-Length | 267 |
| Connection | keep-alive |



```js
{
    "rid": "",
    "lastSuccessTime": 0,
    "result": {
        "status": {
            "module": "COMMON",
            "code": 0,
            "level": "INFO",
            "description": "Success"
        },
        "data": [
            {
                "iops": 0,
                "time": 1597736236000000000
            },
            {
                "iops": 6376,
                "time": 1597736237000000000
            },
            {
                "iops": 23973.25,
                "time": 1597736238000000000
            },
            {
                "iops": 96155,
                "time": 1597736239000000000
            },
            {
                "iops": 0,
                "time": 1597736240000000000
            },
            {
                "iops": 0,
                "time": 1597736241000000000
            },
            {
                "iops": 0,
                "time": 1597736242000000000
            },
            {
                "iops": 0,
                "time": 1597736243000000000
            },
            {
                "iops": 19665,
                "time": 1597736244000000000
            }
        ]
    }
}
```



### 17. VOL READ IOPS



***Endpoint:***

```bash
Method: GET
Type: 
URL: http://{{host}}/api/metric/v1/volumes/{{volid01}}/readiops
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
| X-Request-Id | 562b9d26-1fbf-4aaa-9cb8-c9bef13ffbee |
| Date | Fri, 05 Jun 2020 06:34:16 GMT |
| Content-Length | 267 |
| Connection | keep-alive |



```js
{
    "rid": "",
    "lastSuccessTime": 0,
    "result": {
        "status": {
            "module": "COMMON",
            "code": 0,
            "level": "INFO",
            "description": "Success"
        },
        "data": [
            {
                "iops": 0,
                "time": 1597737402983947953
            }
        ]
    }
}
```



### 18. VOL READ IOPS with PERIOD



***Endpoint:***

```bash
Method: GET
Type: 
URL: http://{{host}}/api/metric/v1/volumes/{{volid01}}/readiops/{{period}}
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
| X-Request-Id | 562b9d26-1fbf-4aaa-9cb8-c9bef13ffbee |
| Date | Fri, 05 Jun 2020 06:34:16 GMT |
| Content-Length | 267 |
| Connection | keep-alive |



```js
{
    "rid": "",
    "lastSuccessTime": 0,
    "result": {
        "status": {
            "module": "COMMON",
            "code": 0,
            "level": "INFO",
            "description": "Success"
        },
        "data": [
            {
                "iops": 406,
                "time": 1597737213000000000
            },
            {
                "iops": 394,
                "time": 1597737214000000000
            },
            {
                "iops": 800,
                "time": 1597737215000000000
            },
            {
                "iops": 800,
                "time": 1597737216000000000
            },
            {
                "iops": 1645,
                "time": 1597737217000000000
            },
            {
                "iops": 1635,
                "time": 1597737218000000000
            },
            {
                "iops": 1504,
                "time": 1597737219000000000
            },
            {
                "iops": 129,
                "time": 1597737220000000000
            }
        ]
    }
}
```



Status: Fail - 0 invalid time interval, empty response | Code: 200



***Response Headers:***

| Key | Value |
| --- | ------|
| Content-Type | application/json; charset=utf-8 |
| X-Request-Id | 37f02223-409f-497e-b61e-ef27ffc2fd9f |
| Date | Wed, 19 Aug 2020 06:50:29 GMT |
| Content-Length | 128 |



```js
{
    "rid": "",
    "lastSuccessTime": 0,
    "result": {
        "status": {
            "module": "MAgent",
            "code": 21010,
            "level": "ERROR",
            "description": "Time parameter error",
            "problem": "Invalid time period specified",
            "solution": "use time from 1m,5m,15m,1h,6h,12h,24h,7d,30d"
        },
        "data": []
    }
}
```



### 19. WRITE IOPS



***Endpoint:***

```bash
Method: GET
Type: 
URL: http://{{host}}/api/metric/v1/writeiops
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
| X-Request-Id | 562b9d26-1fbf-4aaa-9cb8-c9bef13ffbee |
| Date | Fri, 05 Jun 2020 06:34:16 GMT |
| Content-Length | 267 |
| Connection | keep-alive |



```js
{
    "rid": "",
    "lastSuccessTime": 0,
    "result": {
        "status": {
            "module": "COMMON",
            "code": 0,
            "level": "INFO",
            "description": "Success"
        },
        "data": [
            {
                "iops": 0,
                "time": 1597737402983947953
            }
        ]
    }
}
```



### 20. WRITE IOPS with PERIOD



***Endpoint:***

```bash
Method: GET
Type: 
URL: http://{{host}}/api/metric/v1/writeiops/{{period}}
```


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| X-Request-Id | {{$guid}} |  |
| ts | {{$timestamp}} |  |
| Content-Type | application/json |  |
| Authorization | {{basic_auth}} |  |



***Responses:***


Status: Fail - 0 invalid time interval, empty response | Code: 400



***Response Headers:***

| Key | Value |
| --- | ------|
| Content-Type | application/json; charset=utf-8 |
| X-Request-Id | 9a2404a5-c123-45a6-8bc0-8e9ae4706539 |
| Date | Wed, 19 Aug 2020 06:48:51 GMT |
| Content-Length | 128 |



```js
{
    "rid": "",
    "lastSuccessTime": 0,
    "result": {
        "status": {
            "module": "MAgent",
            "code": 21010,
            "level": "ERROR",
            "description": "Time parameter error",
            "problem": "Invalid time period specified",
            "solution": "use time from 1m,5m,15m,1h,6h,12h,24h,7d,30d"
        },
        "data": []
    }
}
```



Status: Success | Code: 200



***Response Headers:***

| Key | Value |
| --- | ------|
| Content-Type | application/json; charset=utf-8 |
| X-Request-Id | 562b9d26-1fbf-4aaa-9cb8-c9bef13ffbee |
| Date | Fri, 05 Jun 2020 06:34:16 GMT |
| Content-Length | 267 |
| Connection | keep-alive |



```js
{
    "rid": "",
    "lastSuccessTime": 0,
    "result": {
        "status": {
            "module": "COMMON",
            "code": 0,
            "level": "INFO",
            "description": "Success"
        },
        "data": [
            {
                "iops": 0,
                "time": 1597737381000000000
            },
            {
                "iops": 47193,
                "time": 1597737382000000000
            },
            {
                "iops": 33480,
                "time": 1597737383000000000
            },
            {
                "iops": 0,
                "time": 1597737384000000000
            },
            {
                "iops": 0,
                "time": 1597737385000000000
            },
            {
                "iops": 20450,
                "time": 1597737386000000000
            },
            {
                "iops": 31656,
                "time": 1597737387000000000
            },
            {
                "iops": 27805,
                "time": 1597737388000000000
            },
            {
                "iops": 22408,
                "time": 1597737389000000000
            }
        ]
    }
}
```



### 21. VOL WRITE BW IOPS



***Endpoint:***

```bash
Method: GET
Type: 
URL: http://{{host}}/api/metric/v1/volumes/{{volid01}}/writeiops
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
| X-Request-Id | 562b9d26-1fbf-4aaa-9cb8-c9bef13ffbee |
| Date | Fri, 05 Jun 2020 06:34:16 GMT |
| Content-Length | 267 |
| Connection | keep-alive |



```js
{
    "rid": "",
    "lastSuccessTime": 0,
    "result": {
        "status": {
            "module": "COMMON",
            "code": 0,
            "level": "INFO",
            "description": "Success"
        },
        "data": [
            {
                "iops": 0,
                "time": 1597737402983947953
            }
        ]
    }
}
```



### 22. VOL WRITE BW IOPS with PERIOD



***Endpoint:***

```bash
Method: GET
Type: 
URL: http://{{host}}/api/metric/v1/volumes/{{volid01}}/writeiops/{{period}}
```


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| X-Request-Id | {{$guid}} |  |
| ts | {{$timestamp}} |  |
| Content-Type | application/json |  |
| Authorization | {{basic_auth}} |  |



***Responses:***


Status: Fail - 0 invalid time interval, empty response | Code: 400



***Response Headers:***

| Key | Value |
| --- | ------|
| Content-Type | application/json; charset=utf-8 |
| X-Request-Id | a6584a59-ba43-4b3d-a5da-ef470df60a3d |
| Date | Wed, 19 Aug 2020 06:48:17 GMT |
| Content-Length | 128 |



```js
{
    "rid": "",
    "lastSuccessTime": 0,
    "result": {
        "status": {
            "module": "MAgent",
            "code": 21010,
            "level": "ERROR",
            "description": "Time parameter error",
            "problem": "Invalid time period specified",
            "solution": "use time from 1m,5m,15m,1h,6h,12h,24h,7d,30d"
        },
        "data": []
    }
}
```



Status: Success | Code: 200



***Response Headers:***

| Key | Value |
| --- | ------|
| Content-Type | application/json; charset=utf-8 |
| X-Request-Id | 562b9d26-1fbf-4aaa-9cb8-c9bef13ffbee |
| Date | Fri, 05 Jun 2020 06:34:16 GMT |
| Content-Length | 267 |
| Connection | keep-alive |



```js
{
    "rid": "",
    "lastSuccessTime": 0,
    "result": {
        "status": {
            "module": "COMMON",
            "code": 0,
            "level": "INFO",
            "description": "Success"
        },
        "data": [
            {
                "iops": 28927,
                "time": 1597737831000000000
            },
            {
                "iops": 9124,
                "time": 1597737832000000000
            },
            {
                "iops": 0,
                "time": 1597737833000000000
            },
            {
                "iops": 25600,
                "time": 1597737834000000000
            },
            {
                "iops": 25600,
                "time": 1597737835000000000
            },
            {
                "iops": 0,
                "time": 1597737836000000000
            },
            {
                "iops": 12800,
                "time": 1597737837000000000
            },
            {
                "iops": 800,
                "time": 1597737838000000000
            },
            {
                "iops": 800,
                "time": 1597737839000000000
            }
        ]
    }
}
```



### 23. LATENCY



***Endpoint:***

```bash
Method: GET
Type: 
URL: http://{{host}}/api/metric/v1/latency
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
| X-Request-Id | 562b9d26-1fbf-4aaa-9cb8-c9bef13ffbee |
| Date | Fri, 05 Jun 2020 06:34:16 GMT |
| Content-Length | 267 |
| Connection | keep-alive |



```js
{
    "rid": "",
    "lastSuccessTime": 0,
    "result": {
        "status": {
            "module": "COMMON",
            "code": 0,
            "level": "INFO",
            "description": "Success"
        },
        "data": [
            {
                "latency": 0,
                "time": 1597737402983947953
            }
        ]
    }
}
```



### 24. LATENCY with PERIOD



***Endpoint:***

```bash
Method: GET
Type: 
URL: http://{{host}}/api/metric/v1/latency/{{period}}
```


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| X-Request-Id | {{$guid}} |  |
| ts | {{$timestamp}} |  |
| Content-Type | application/json |  |
| Authorization | {{basic_auth}} |  |



***Responses:***


Status: Fail - 0 invalid time interval, empty response | Code: 400



***Response Headers:***

| Key | Value |
| --- | ------|
| Content-Type | application/json; charset=utf-8 |
| X-Request-Id | 7801c974-61f1-4e74-a73f-4ff31d2b1597 |
| Date | Wed, 19 Aug 2020 06:47:45 GMT |
| Content-Length | 128 |



```js
{
    "rid": "",
    "lastSuccessTime": 0,
    "result": {
        "status": {
            "module": "MAgent",
            "code": 21010,
            "level": "ERROR",
            "description": "Time parameter error",
            "problem": "Invalid time period specified",
            "solution": "use time from 1m,5m,15m,1h,6h,12h,24h,7d,30d"
        },
        "data": []
    }
}
```



Status: Success | Code: 200



***Response Headers:***

| Key | Value |
| --- | ------|
| Content-Type | application/json; charset=utf-8 |
| X-Request-Id | 562b9d26-1fbf-4aaa-9cb8-c9bef13ffbee |
| Date | Fri, 05 Jun 2020 06:34:16 GMT |
| Content-Length | 267 |
| Connection | keep-alive |



```js
{
    "rid": "",
    "lastSuccessTime": 0,
    "result": {
        "status": {
            "module": "",
            "code": 0,
            "description": "Success"
        },
        "data": {
            "githash": "b98039e5f8ab19351994044960cf0e27262665b4",
            "build_time": "1591338851"
        }
    },
    "info": {
        "state": "",
        "situation": "",
        "rebuliding_progress": 0,
        "capacity": 0,
        "used": 0
    }
}
```



### 25. VOL LATENCY



***Endpoint:***

```bash
Method: GET
Type: 
URL: http://{{host}}/api/metric/v1/volumes/{{volid01}}/latency
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
| X-Request-Id | 562b9d26-1fbf-4aaa-9cb8-c9bef13ffbee |
| Date | Fri, 05 Jun 2020 06:34:16 GMT |
| Content-Length | 267 |
| Connection | keep-alive |



```js
{
    "rid": "",
    "lastSuccessTime": 0,
    "result": {
        "status": {
            "module": "COMMON",
            "code": 0,
            "level": "INFO",
            "description": "Success"
        },
        "data": [
            {
                "latency": 0,
                "time": 1597737402983947953
            }
        ]
    }
}
```



### 26. VOL LATENCY with PERIOD



***Endpoint:***

```bash
Method: GET
Type: 
URL: http://{{host}}/api/metric/v1/volumes/{{volid01}}/latency/{{period}}
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
| X-Request-Id | 562b9d26-1fbf-4aaa-9cb8-c9bef13ffbee |
| Date | Fri, 05 Jun 2020 06:34:16 GMT |
| Content-Length | 267 |
| Connection | keep-alive |



```js
{
    "rid": "",
    "lastSuccessTime": 0,
    "result": {
        "status": {
            "module": "COMMON",
            "code": 0,
            "level": "INFO",
            "description": "Success"
        },
        "data": [
            {
                "latency": 0,
                "time": 1597736236000000000
            },
            {
                "latency": 6376,
                "time": 1597736237000000000
            },
            {
                "latency": 23973.25,
                "time": 1597736238000000000
            },
            {
                "latency": 96155,
                "time": 1597736239000000000
            },
            {
                "latency": 0,
                "time": 1597736240000000000
            },
            {
                "latency": 0,
                "time": 1597736241000000000
            },
            {
                "latency": 0,
                "time": 1597736242000000000
            },
            {
                "latency": 0,
                "time": 1597736243000000000
            },
            {
                "latency": 19665,
                "time": 1597736244000000000
            }
        ]
    }
}
```



Status: Fail - invalid time interval, empty response | Code: 400



***Response Headers:***

| Key | Value |
| --- | ------|
| Content-Type | application/json; charset=utf-8 |
| X-Request-Id | 560f0b7a-594a-48b1-ae51-1d593479049d |
| Date | Wed, 19 Aug 2020 06:45:37 GMT |
| Content-Length | 128 |



```js
{
    "rid": "",
    "lastSuccessTime": 0,
    "result": {
        "status": {
            "module": "MAgent",
            "code": 21010,
            "level": "ERROR",
            "description": "Time parameter error",
            "problem": "Invalid time period specified",
            "solution": "use time from 1m,5m,15m,1h,6h,12h,24h,7d,30d"
        },
        "data": []
    }
}
```



### 27. REBUILD LOG



***Endpoint:***

```bash
Method: GET
Type: 
URL: http://{{host}}/api/metric/v1/rebuildlogs/{{period}}
```


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| X-Request-Id | {{$guid}} |  |
| ts | {{$timestamp}} |  |
| Content-Type | application/json |  |
| Authorization | {{basic_auth}} |  |



***Responses:***


Status: Fail - 0 data not present | Code: 400



***Response Headers:***

| Key | Value |
| --- | ------|
| Content-Type | application/json; charset=utf-8 |
| X-Request-Id | c950f121-dd24-4f31-822e-69c70f1c432a |
| Date | Fri, 05 Jun 2020 06:32:42 GMT |
| Content-Length | 223 |



```js
{
    "rid": "",
    "lastSuccessTime": 0,
    "result": {
        "status": {
            "module": "MAgent",
            "code": 20313,
            "level": "WARN",
            "description": "Data not found",
            "problem": "requested data is not present",
            "solution": "check if the data is requested for an existing entity"
        },
        "data": []
    }
}
```



Status: Success | Code: 200



***Response Headers:***

| Key | Value |
| --- | ------|
| Content-Type | application/json; charset=utf-8 |
| X-Request-Id | 562b9d26-1fbf-4aaa-9cb8-c9bef13ffbee |
| Date | Fri, 05 Jun 2020 06:34:16 GMT |
| Content-Length | 267 |
| Connection | keep-alive |



```js
{
    "rid": "",
    "lastSuccessTime": 0,
    "result": {
        "status": {
            "module": "COMMON",
            "code": 0,
            "level": "INFO",
            "description": "Success"
        },
        "data": [
            {
                "Time": 1597743919603338213,
                "Value": "[1596194025][1234][trace] progress report: [100]"
            }
        ]
    }
}
```



## POS/Volume



### 1. CREATE VOLUME



***Endpoint:***

```bash
Method: POST
Type: RAW
URL: http://{{host}}/api/ibofos/v1/volumes
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
        "array": "{{arrayName}}",
        "name": "vol01",
        "size": 4194304,
        "maxbw": 0,
        "maxiops": 0
    }
}
```



***Responses:***


Status: Fail - 2022 | Code: 400



***Response Headers:***

| Key | Value |
| --- | ------|
| Date | Thu, 20 Aug 2020 08:05:44 GMT |
| Content-Type | application/json; charset=utf-8 |
| Content-Length | 403 |
| X-Request-Id | 1ce8c5c3-d2f7-4ac8-9e59-2478605ef11d |
| Connection | keep-alive |



```js
{
    "rid": "1ce8c5c3-d2f7-4ac8-9e59-2478605ef11d",
    "lastSuccessTime": 1597910744,
    "result": {
        "status": {
            "module": "VolumeManager",
            "code": 2022,
            "level": "WARN",
            "description": "Volume name is duplicated",
            "problem": "A volume with a duplicate name already exists",
            "solution": "Enter a different volume name"
        }
    },
    "info": {
        "capacity": 120312771380,
        "rebuildingProgress": "0",
        "situation": "NORMAL",
        "state": "NORMAL",
        "used": 4194304
    }
}
```



Status: Success | Code: 200



***Response Headers:***

| Key | Value |
| --- | ------|
| Date | Thu, 20 Aug 2020 08:04:44 GMT |
| Content-Type | application/json; charset=utf-8 |
| Content-Length | 274 |
| X-Request-Id | bde37273-adc4-459f-883b-cf5ea2542134 |
| Connection | keep-alive |



```js
{
    "rid": "bde37273-adc4-459f-883b-cf5ea2542134",
    "lastSuccessTime": 1597910684,
    "result": {
        "status": {
            "module": "COMMON",
            "code": 0,
            "level": "INFO",
            "description": "Success"
        }
    },
    "info": {
        "capacity": 120312771380,
        "rebuildingProgress": "0",
        "situation": "NORMAL",
        "state": "NORMAL",
        "used": 4194304
    }
}
```



### 2. CREATE VOLUME (Multi)



***Endpoint:***

```bash
Method: POST
Type: RAW
URL: http://{{host}}/api/ibofos/v1/volumes
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
        "array": "{{arrayName}}"
        "name": "volmul",
        "size": 10737418,
        "maxbw": 0,
        "maxiops": 0,
        "totalcount": 2,
        "stoponerror": false,
        "namesuffix": 0,
        "mountall": true
    }
}
```



### 3. UPDATE VOLUME QOS



***Endpoint:***

```bash
Method: PATCH
Type: RAW
URL: http://{{host}}/api/ibofos/v1/volumes/{{volumeName1}}/qos
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
        "array": "{{arrayName}}",
        "maxiops": 0,
        "maxbw": 6000
    }
}
```



***Responses:***


Status: Fail - 2010 | Code: 400



***Response Headers:***

| Key | Value |
| --- | ------|
| Date | Thu, 20 Aug 2020 08:05:17 GMT |
| Content-Type | application/json; charset=utf-8 |
| Content-Length | 481 |
| X-Request-Id | 45785ae6-e619-4c8a-ac6e-18eb90952862 |
| Connection | keep-alive |



```js
{
    "rid": "45785ae6-e619-4c8a-ac6e-18eb90952862",
    "lastSuccessTime": 1597910717,
    "result": {
        "status": {
            "module": "VolumeManager",
            "code": 2010,
            "level": "WARN",
            "description": "The requested volume does not exist",
            "problem": "The volume with the requested volume name or volume ID does not exist",
            "solution": "Enter the correct volume name or volume ID after checking the volume list"
        }
    },
    "info": {
        "capacity": 120312771380,
        "rebuildingProgress": "0",
        "situation": "NORMAL",
        "state": "NORMAL",
        "used": 4194304
    }
}
```



Status: Success | Code: 200



***Response Headers:***

| Key | Value |
| --- | ------|
| Date | Thu, 20 Aug 2020 08:05:00 GMT |
| Content-Type | application/json; charset=utf-8 |
| Content-Length | 274 |
| X-Request-Id | 1fd40c80-6752-49be-9510-a843c08d09d5 |
| Connection | keep-alive |



```js
{
    "rid": "1fd40c80-6752-49be-9510-a843c08d09d5",
    "lastSuccessTime": 1597910700,
    "result": {
        "status": {
            "module": "COMMON",
            "code": 0,
            "level": "INFO",
            "description": "Success"
        }
    },
    "info": {
        "capacity": 120312771380,
        "rebuildingProgress": "0",
        "situation": "NORMAL",
        "state": "NORMAL",
        "used": 4194304
    }
}
```



### 4. RENAME VOLUME



***Endpoint:***

```bash
Method: PATCH
Type: RAW
URL: http://{{host}}/api/ibofos/v1/volumes/{{volumeName1}}
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
        "array": "{{arrayName}}",
        "newname": "newvol01"
    }
}
```



***Responses:***


Status: Fail - 2010 | Code: 400



***Response Headers:***

| Key | Value |
| --- | ------|
| Date | Thu, 20 Aug 2020 08:06:12 GMT |
| Content-Type | application/json; charset=utf-8 |
| Content-Length | 481 |
| X-Request-Id | 1530cced-60d1-4623-b670-8854a089eb79 |
| Connection | keep-alive |



```js
{
    "rid": "1530cced-60d1-4623-b670-8854a089eb79",
    "lastSuccessTime": 1597910772,
    "result": {
        "status": {
            "module": "VolumeManager",
            "code": 2010,
            "level": "WARN",
            "description": "The requested volume does not exist",
            "problem": "The volume with the requested volume name or volume ID does not exist",
            "solution": "Enter the correct volume name or volume ID after checking the volume list"
        }
    },
    "info": {
        "capacity": 120312771380,
        "rebuildingProgress": "0",
        "situation": "NORMAL",
        "state": "NORMAL",
        "used": 4194304
    }
}
```



Status: Success | Code: 200



***Response Headers:***

| Key | Value |
| --- | ------|
| Date | Thu, 20 Aug 2020 08:06:01 GMT |
| Content-Type | application/json; charset=utf-8 |
| Content-Length | 274 |
| X-Request-Id | d30a0f60-fceb-4652-889e-3dc4b374ac83 |
| Connection | keep-alive |



```js
{
    "rid": "d30a0f60-fceb-4652-889e-3dc4b374ac83",
    "lastSuccessTime": 1597910761,
    "result": {
        "status": {
            "module": "COMMON",
            "code": 0,
            "level": "INFO",
            "description": "Success"
        }
    },
    "info": {
        "capacity": 120312771380,
        "rebuildingProgress": "0",
        "situation": "NORMAL",
        "state": "NORMAL",
        "used": 4194304
    }
}
```



### 5. LIST VOLUME



***Endpoint:***

```bash
Method: GET
Type: RAW
URL: http://{{host}}/api/ibofos/v1/volumes
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
| Date | Thu, 20 Aug 2020 08:06:29 GMT |
| Content-Type | application/json; charset=utf-8 |
| Content-Length | 501 |
| X-Request-Id | f51223bf-db87-4308-b49b-64b981cc6d9e |
| Connection | keep-alive |



```js
{
    "rid": "f51223bf-db87-4308-b49b-64b981cc6d9e",
    "lastSuccessTime": 1597910789,
    "result": {
        "status": {
            "module": "COMMON",
            "code": 0,
            "level": "INFO",
            "description": "Success"
        },
        "data": {
            "volumes": [
                {
                    "id": 0,
                    "maxbw": 6000,
                    "maxiops": 0,
                    "name": "newvol01",
                    "remain": 4194304,
                    "status": "Unmounted",
                    "total": 4194304
                },
                {
                    "id": 1,
                    "maxbw": 0,
                    "maxiops": 0,
                    "name": "vol01",
                    "remain": 4194304,
                    "status": "Unmounted",
                    "total": 4194304
                }
            ]
        }
    },
    "info": {
        "capacity": 120312771380,
        "rebuildingProgress": "0",
        "situation": "NORMAL",
        "state": "NORMAL",
        "used": 8388608
    }
}
```



### 6. MOUNT VOLUME



***Endpoint:***

```bash
Method: POST
Type: RAW
URL: http://{{host}}/api/ibofos/v1/volumes/{{volumeName1}}/mount
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
        "array": "{{arrayName}}"
    }
}
```



***Responses:***


Status: Fail - 2040 | Code: 400



***Response Headers:***

| Key | Value |
| --- | ------|
| Date | Thu, 20 Aug 2020 08:06:48 GMT |
| Content-Type | application/json; charset=utf-8 |
| Content-Length | 388 |
| X-Request-Id | 83447d87-e5a9-4f5a-bee8-a857cb8b9aa3 |
| Connection | keep-alive |



```js
{
    "rid": "83447d87-e5a9-4f5a-bee8-a857cb8b9aa3",
    "lastSuccessTime": 1597910808,
    "result": {
        "status": {
            "module": "VolumeManager",
            "code": 2040,
            "level": "WARN",
            "description": "Volume already mounted",
            "problem": "Attempt to mount a volume that is already mounted",
            "solution": "Nothing to do"
        }
    },
    "info": {
        "capacity": 120312771380,
        "rebuildingProgress": "0",
        "situation": "NORMAL",
        "state": "NORMAL",
        "used": 8388608
    }
}
```



Status: Success | Code: 200



***Response Headers:***

| Key | Value |
| --- | ------|
| Date | Thu, 20 Aug 2020 08:06:40 GMT |
| Content-Type | application/json; charset=utf-8 |
| Content-Length | 274 |
| X-Request-Id | 964d431e-ac03-4920-b94a-86c33c1ecacc |
| Connection | keep-alive |



```js
{
    "rid": "964d431e-ac03-4920-b94a-86c33c1ecacc",
    "lastSuccessTime": 1597910800,
    "result": {
        "status": {
            "module": "COMMON",
            "code": 0,
            "level": "INFO",
            "description": "Success"
        }
    },
    "info": {
        "capacity": 120312771380,
        "rebuildingProgress": "0",
        "situation": "NORMAL",
        "state": "NORMAL",
        "used": 8388608
    }
}
```



### 7. UNMOUNT VOLUME



***Endpoint:***

```bash
Method: DELETE
Type: RAW
URL: http://{{host}}/api/ibofos/v1/volumes/{{volumeName1}}/mount
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
        "array": "{{arrayName}}"
    }
}
```



***Responses:***


Status: Success | Code: 200



***Response Headers:***

| Key | Value |
| --- | ------|
| Date | Thu, 20 Aug 2020 08:06:59 GMT |
| Content-Type | application/json; charset=utf-8 |
| Content-Length | 274 |
| X-Request-Id | 2f6400e3-6a6f-4028-aea0-c5daa8a4f1d5 |
| Connection | keep-alive |



```js
{
    "rid": "2f6400e3-6a6f-4028-aea0-c5daa8a4f1d5",
    "lastSuccessTime": 1597910819,
    "result": {
        "status": {
            "module": "COMMON",
            "code": 0,
            "level": "INFO",
            "description": "Success"
        }
    },
    "info": {
        "capacity": 120312771380,
        "rebuildingProgress": "0",
        "situation": "NORMAL",
        "state": "NORMAL",
        "used": 8388608
    }
}
```



Status: Fail - 2041 | Code: 400



***Response Headers:***

| Key | Value |
| --- | ------|
| Date | Thu, 20 Aug 2020 08:07:07 GMT |
| Content-Type | application/json; charset=utf-8 |
| Content-Length | 394 |
| X-Request-Id | 157e6963-e935-4c2e-8649-fa5cd1d8b846 |
| Connection | keep-alive |



```js
{
    "rid": "157e6963-e935-4c2e-8649-fa5cd1d8b846",
    "lastSuccessTime": 1597910827,
    "result": {
        "status": {
            "module": "VolumeManager",
            "code": 2041,
            "level": "WARN",
            "description": "Volume already unmounted",
            "problem": "Attempt to unmount a volume that is already unmounted",
            "solution": "Nothing to do"
        }
    },
    "info": {
        "capacity": 120312771380,
        "rebuildingProgress": "0",
        "situation": "NORMAL",
        "state": "NORMAL",
        "used": 8388608
    }
}
```



### 8. DELETE VOLUME



***Endpoint:***

```bash
Method: DELETE
Type: RAW
URL: http://{{host}}/api/ibofos/v1/volumes/{{volumeName1}}
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
        "array": "{{arrayName}}"
    }
}
```



***Responses:***


Status: Success | Code: 200



***Response Headers:***

| Key | Value |
| --- | ------|
| Date | Thu, 20 Aug 2020 08:07:18 GMT |
| Content-Type | application/json; charset=utf-8 |
| Content-Length | 274 |
| X-Request-Id | 805514bf-445b-40b6-9b84-b33a6d07e409 |
| Connection | keep-alive |



```js
{
    "rid": "805514bf-445b-40b6-9b84-b33a6d07e409",
    "lastSuccessTime": 1597910838,
    "result": {
        "status": {
            "module": "COMMON",
            "code": 0,
            "level": "INFO",
            "description": "Success"
        }
    },
    "info": {
        "capacity": 120312771380,
        "rebuildingProgress": "0",
        "situation": "NORMAL",
        "state": "NORMAL",
        "used": 4194304
    }
}
```



Status: Fail - 2010 | Code: 400



***Response Headers:***

| Key | Value |
| --- | ------|
| Date | Thu, 20 Aug 2020 08:07:28 GMT |
| Content-Type | application/json; charset=utf-8 |
| Content-Length | 481 |
| X-Request-Id | 9139d5fa-f93f-4ecb-a9f4-5fe9cc553a9d |
| Connection | keep-alive |



```js
{
    "rid": "9139d5fa-f93f-4ecb-a9f4-5fe9cc553a9d",
    "lastSuccessTime": 1597910848,
    "result": {
        "status": {
            "module": "VolumeManager",
            "code": 2010,
            "level": "WARN",
            "description": "The requested volume does not exist",
            "problem": "The volume with the requested volume name or volume ID does not exist",
            "solution": "Enter the correct volume name or volume ID after checking the volume list"
        }
    },
    "info": {
        "capacity": 120312771380,
        "rebuildingProgress": "0",
        "situation": "NORMAL",
        "state": "NORMAL",
        "used": 4194304
    }
}
```



### 9. MAX VOLUME COUNT



***Endpoint:***

```bash
Method: GET
Type: RAW
URL: http://{{host}}/api/ibofos/v1/volumes/maxcount
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
| Date | Thu, 20 Aug 2020 08:04:33 GMT |
| Content-Type | application/json; charset=utf-8 |
| Content-Length | 291 |
| X-Request-Id | 10dd290c-9bc2-4e32-971f-4550866fd646 |
| Connection | keep-alive |



```js
{
    "rid": "10dd290c-9bc2-4e32-971f-4550866fd646",
    "lastSuccessTime": 1597910673,
    "result": {
        "status": {
            "module": "COMMON",
            "code": 0,
            "level": "INFO",
            "description": "Success"
        },
        "data": {
            "count": "256"
        }
    },
    "info": {
        "capacity": 120312771380,
        "rebuildingProgress": "0",
        "situation": "NORMAL",
        "state": "NORMAL",
        "used": 0
    }
}
```



## POS/Array



### 1. CREATE ARRAY



***Endpoint:***

```bash
Method: POST
Type: RAW
URL: http://{{host}}/api/ibofos/v1/array
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
        "name": "{{arrayName}}",
        "raidtype": "RAID5",
        "buffer": [
            {
                "deviceName": "uram0"
            }
        ],
        "data": [
            {
                "deviceName": "{{deviceName1}}"
            },
            {
                "deviceName": "{{deviceName2}}"
            },
            {
                "deviceName": "{{deviceName3}}"
            }
        ],
        "spare": [
            {
                "deviceName": "{{deviceName4}}"
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
| Date | Wed, 19 Aug 2020 06:52:48 GMT |
| Content-Type | application/json; charset=utf-8 |
| Content-Length | 259 |
| X-Request-Id | cc3eed56-3478-4180-af0b-eac6b88f264f |
| Connection | keep-alive |



```js
{
    "rid": "cc3eed56-3478-4180-af0b-eac6b88f264f",
    "lastSuccessTime": 1597819968,
    "result": {
        "status": {
            "module": "COMMON",
            "code": 0,
            "level": "INFO",
            "description": "Success"
        }
    },
    "info": {
        "capacity": 0,
        "rebuildingProgress": "0",
        "situation": "DEFAULT",
        "state": "OFFLINE",
        "used": 0
    }
}
```



Status: Fail - 2504 | Code: 400



***Response Headers:***

| Key | Value |
| --- | ------|
| Date | Wed, 19 Aug 2020 06:52:14 GMT |
| Content-Type | application/json; charset=utf-8 |
| Content-Length | 271 |
| X-Request-Id | 3cfc6d1e-6595-4aad-829a-bfca0d831069 |
| Connection | keep-alive |



```js
{
    "rid": "3cfc6d1e-6595-4aad-829a-bfca0d831069",
    "lastSuccessTime": 1597819934,
    "result": {
        "status": {
            "module": "Array",
            "code": 2504,
            "level": "ERROR",
            "description": "Device not found"
        }
    },
    "info": {
        "capacity": 0,
        "rebuildingProgress": "0",
        "situation": "DEFAULT",
        "state": "OFFLINE",
        "used": 0
    }
}
```



### 2. LIST ARRAY DEVICE



***Endpoint:***

```bash
Method: GET
Type: RAW
URL: http://{{host}}/api/ibofos/v1/array/{{arrayName}}/devices
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
| X-Request-Id | 6e787e27-1964-44da-bcdf-b5f44ffbd1a3 |
| Date | Fri, 08 May 2020 06:51:22 GMT |
| Content-Length | 437 |
| Connection | keep-alive |



```js
{
    "rid": "6e787e27-1964-44da-bcdf-b5f44ffbd1a3",
    "lastSuccessTime": 1588920682,
    "result": {
        "status": {
            "module": "",
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
                    "name": "unvme-ns-0",
                    "type": "DATA"
                },
                {
                    "name": "unvme-ns-1",
                    "type": "DATA"
                },
                {
                    "name": "unvme-ns-2",
                    "type": "DATA"
                },
                {
                    "name": "unvme-ns-3",
                    "type": "SPARE"
                }
            ]
        }
    },
    "info": {
        "state": "OFFLINE",
        "situation": "DEFAULT",
        "rebulidingProgress": 0,
        "capacity": 0,
        "used": 0
    }
}
```



### 3. ARRAY INFO



***Endpoint:***

```bash
Method: GET
Type: RAW
URL: http://{{host}}/api/ibofos/v1/array/{{arrayName}}
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
| X-Request-Id | 6e787e27-1964-44da-bcdf-b5f44ffbd1a3 |
| Date | Fri, 08 May 2020 06:51:22 GMT |
| Content-Length | 437 |
| Connection | keep-alive |



```js
{
    "rid": "6e787e27-1964-44da-bcdf-b5f44ffbd1a3",
    "lastSuccessTime": 1588920682,
    "result": {
        "status": {
            "module": "",
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
                    "name": "unvme-ns-0",
                    "type": "DATA"
                },
                {
                    "name": "unvme-ns-1",
                    "type": "DATA"
                },
                {
                    "name": "unvme-ns-2",
                    "type": "DATA"
                },
                {
                    "name": "unvme-ns-3",
                    "type": "SPARE"
                }
            ]
        }
    },
    "info": {
        "state": "OFFLINE",
        "situation": "DEFAULT",
        "rebuliding_progress": 0,
        "capacity": 0,
        "used": 0
    }
}
```



### 4. DELETE ARRAY



***Endpoint:***

```bash
Method: DELETE
Type: RAW
URL: http://{{host}}/api/ibofos/v1/array/{{arrayName}}
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
| Date | Thu, 20 Aug 2020 08:01:28 GMT |
| Content-Type | application/json; charset=utf-8 |
| Content-Length | 259 |
| X-Request-Id | f0755583-73c9-436c-9e10-c53d36418fa9 |
| Connection | keep-alive |



```js
{
    "rid": "f0755583-73c9-436c-9e10-c53d36418fa9",
    "lastSuccessTime": 1597910488,
    "result": {
        "status": {
            "module": "COMMON",
            "code": 0,
            "level": "INFO",
            "description": "Success"
        }
    },
    "info": {
        "capacity": 0,
        "rebuildingProgress": "0",
        "situation": "DEFAULT",
        "state": "OFFLINE",
        "used": 0
    }
}
```



Status: Fail - 2500 | Code: 400



***Response Headers:***

| Key | Value |
| --- | ------|
| Date | Wed, 19 Aug 2020 07:00:57 GMT |
| Content-Type | application/json; charset=utf-8 |
| Content-Length | 289 |
| X-Request-Id | 6426aca5-2d99-496a-9341-7e1e962dcceb |
| Connection | keep-alive |



```js
{
    "rid": "6426aca5-2d99-496a-9341-7e1e962dcceb",
    "lastSuccessTime": 1597820457,
    "result": {
        "status": {
            "module": "Array",
            "code": 2500,
            "level": "ERROR",
            "description": "Array is alreday mounted."
        }
    },
    "info": {
        "capacity": 120312771380,
        "rebuildingProgress": "0",
        "situation": "NORMAL",
        "state": "NORMAL",
        "used": 0
    }
}
```



### 5. LOAD ARRAY



***Endpoint:***

```bash
Method: GET
Type: RAW
URL: http://{{host}}/api/ibofos/v1/array/{{arrayName}}/load
```


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| X-Request-Id | {{$guid}} |  |
| ts | {{$timestamp}} |  |
| Content-Type | application/json |  |
| Authorization | {{basic_auth}} |  |



***Responses:***


Status: Fail (2509) | Code: 400



***Response Headers:***

| Key | Value |
| --- | ------|
| Date | Thu, 30 Jul 2020 03:50:38 GMT |
| Content-Type | application/json; charset=utf-8 |
| Content-Length | 274 |
| X-Request-Id | c6c54c1f-13ef-46f6-9e0c-3d1a4a1b2ee8 |
| Connection | keep-alive |



```js
{
    "rid": "c6c54c1f-13ef-46f6-9e0c-3d1a4a1b2ee8",
    "lastSuccessTime": 1596081038,
    "result": {
        "status": {
            "module": "Array",
            "code": 2509,
            "level": "ERROR",
            "description": "MBR read error"
        }
    },
    "info": {
        "state": "OFFLINE",
        "situation": "DEFAULT",
        "rebuildingProgress": "0",
        "capacity": "0",
        "used": "0"
    }
}
```



## POS/Devices



### 1. SCAN DEVICE



***Endpoint:***

```bash
Method: GET
Type: 
URL: http://{{host}}/api/ibofos/v1/devices/all/scan
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
| Date | Wed, 19 Aug 2020 06:52:30 GMT |
| Content-Type | application/json; charset=utf-8 |
| Content-Length | 259 |
| X-Request-Id | 3b6f2a86-7369-40e0-9c63-65cdf417fad4 |
| Connection | keep-alive |



```js
{
    "rid": "3b6f2a86-7369-40e0-9c63-65cdf417fad4",
    "lastSuccessTime": 1597819950,
    "result": {
        "status": {
            "module": "COMMON",
            "code": 0,
            "level": "INFO",
            "description": "Success"
        }
    },
    "info": {
        "capacity": 0,
        "rebuildingProgress": "0",
        "situation": "DEFAULT",
        "state": "OFFLINE",
        "used": 0
    }
}
```



### 2. ADD DEVICE



***Endpoint:***

```bash
Method: POST
Type: RAW
URL: http://{{host}}/api/ibofos/v1/devices
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
        "array": "{{arrayName}}",
        "spare": "{{deviceName4}}"
    }
}
```



***Responses:***


Status: Fail - 2501 | Code: 400



***Response Headers:***

| Key | Value |
| --- | ------|
| Date | Thu, 20 Aug 2020 07:59:11 GMT |
| Content-Type | application/json; charset=utf-8 |
| Content-Length | 281 |
| X-Request-Id | 51cb31eb-35a1-4bf7-87e9-b33bcef2b066 |
| Connection | keep-alive |



```js
{
    "rid": "51cb31eb-35a1-4bf7-87e9-b33bcef2b066",
    "lastSuccessTime": 1597910351,
    "result": {
        "status": {
            "module": "Array",
            "code": 2501,
            "level": "ERROR",
            "description": "Array is already umounted."
        }
    },
    "info": {
        "capacity": 0,
        "rebuildingProgress": "0",
        "situation": "DEFAULT",
        "state": "OFFLINE",
        "used": 0
    }
}
```



Status: Success | Code: 200



***Response Headers:***

| Key | Value |
| --- | ------|
| Date | Thu, 20 Aug 2020 08:00:36 GMT |
| Content-Type | application/json; charset=utf-8 |
| Content-Length | 268 |
| X-Request-Id | 5794b792-4506-4323-a51c-59a26c064d8e |
| Connection | keep-alive |



```js
{
    "rid": "5794b792-4506-4323-a51c-59a26c064d8e",
    "lastSuccessTime": 1597910436,
    "result": {
        "status": {
            "module": "COMMON",
            "code": 0,
            "level": "INFO",
            "description": "Success"
        }
    },
    "info": {
        "capacity": 120312771380,
        "rebuildingProgress": "0",
        "situation": "NORMAL",
        "state": "NORMAL",
        "used": 0
    }
}
```



### 3. REMOVE DEVICE



***Endpoint:***

```bash
Method: DELETE
Type: RAW
URL: http://{{host}}/api/ibofos/v1/devices/{{deviceName4}}
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
        "array": "{{arrayName}}"
    }
}
```



***Responses:***


Status: Success | Code: 200



***Response Headers:***

| Key | Value |
| --- | ------|
| Date | Thu, 20 Aug 2020 08:00:17 GMT |
| Content-Type | application/json; charset=utf-8 |
| Content-Length | 268 |
| X-Request-Id | 2e7818c7-34e4-4668-9663-b5670a4678a1 |
| Connection | keep-alive |



```js
{
    "rid": "2e7818c7-34e4-4668-9663-b5670a4678a1",
    "lastSuccessTime": 1597910417,
    "result": {
        "status": {
            "module": "COMMON",
            "code": 0,
            "level": "INFO",
            "description": "Success"
        }
    },
    "info": {
        "capacity": 120312771380,
        "rebuildingProgress": "0",
        "situation": "NORMAL",
        "state": "NORMAL",
        "used": 0
    }
}
```



Status: Fail - 2501 | Code: 400



***Response Headers:***

| Key | Value |
| --- | ------|
| Date | Thu, 20 Aug 2020 07:58:22 GMT |
| Content-Type | application/json; charset=utf-8 |
| Content-Length | 281 |
| X-Request-Id | 6827ac78-40e2-47f6-a3b9-1a10224e694c |
| Connection | keep-alive |



```js
{
    "rid": "6827ac78-40e2-47f6-a3b9-1a10224e694c",
    "lastSuccessTime": 1597910302,
    "result": {
        "status": {
            "module": "Array",
            "code": 2501,
            "level": "ERROR",
            "description": "Array is already umounted."
        }
    },
    "info": {
        "capacity": 0,
        "rebuildingProgress": "0",
        "situation": "DEFAULT",
        "state": "OFFLINE",
        "used": 0
    }
}
```



### 4. SMART



***Endpoint:***

```bash
Method: GET
Type: 
URL: http://{{host}}/api/ibofos/v1/devices/{{deviceName1}}/smart
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
| Date | Wed, 19 Aug 2020 06:59:19 GMT |
| Content-Type | application/json; charset=utf-8 |
| Content-Length | 933 |
| X-Request-Id | 5b77c361-1c61-4d37-b871-48a44d573d1d |
| Connection | keep-alive |



```js
{
    "rid": "4ed9f174-7458-453a-a3a9-63a81b4cdc8c",
    "lastSuccessTime": 1597910447,
    "result": {
        "status": {
            "module": "COMMON",
            "code": 0,
            "level": "INFO",
            "description": "Success"
        },
        "data": {
            "availableSpare": "1%",
            "availableSpareSpace": "OK",
            "availableSpareThreshold": "100%",
            "contollerBusyTime": "0x50000000000000000m",
            "criticalTemperatureTime": "0m",
            "currentTemperature": "11759C",
            "dataUnitsRead": "0x60000000000000000",
            "dataUnitsWritten": "0x50000000000000000",
            "deviceReliability": "OK",
            "hostReadCommands": "0x17700000000000000000",
            "hostWriteCommands": "0x13880000000000000000",
            "lifePercentageUsed": "0%",
            "lifetimeErrorLogEntries": "0",
            "powerCycles": "0xA0000000000000000",
            "powerOnHours": "0x3C0000000000000000h",
            "readOnly": "No",
            "temperature": "OK",
            "unrecoverableMediaErrors": "0",
            "unsafeShutdowns": "0",
            "volatileMemoryBackup": "OK",
            "warningTemperatureTime": "0m"
        }
    },
    "info": {
        "capacity": 120312771380,
        "rebuildingProgress": "0",
        "situation": "NORMAL",
        "state": "NORMAL",
        "used": 0
    }
}
```



### 5. LIST DEVICE



***Endpoint:***

```bash
Method: GET
Type: 
URL: http://{{host}}/api/ibofos/v1/devices
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
| X-Request-Id | 7ec6e965-dc86-4a95-8a3a-353dc36478a1 |
| Date | Fri, 08 May 2020 06:50:42 GMT |
| Content-Length | 942 |
| Connection | keep-alive |



```js
{
    "rid": "7ec6e965-dc86-4a95-8a3a-353dc36478a1",
    "lastSuccessTime": 1588920642,
    "result": {
        "status": {
            "module": "",
            "code": 0,
            "description": "DONE"
        },
        "data": {
            "devicelist": [
                {
                    "addr": "0000:04:00.0",
                    "class": "SYSTEM",
                    "mn": "VMware Virtual NVMe Disk",
                    "name": "unvme-ns-0",
                    "size": 16777216,
                    "sn": "VMWare NVME-0002",
                    "type": "SSD"
                },
                {
                    "addr": "0000:0c:00.0",
                    "class": "SYSTEM",
                    "mn": "VMware Virtual NVMe Disk",
                    "name": "unvme-ns-1",
                    "size": 16777216,
                    "sn": "VMWare NVME-0003",
                    "type": "SSD"
                },
                {
                    "addr": "0000:13:00.0",
                    "class": "SYSTEM",
                    "mn": "VMware Virtual NVMe Disk",
                    "name": "unvme-ns-2",
                    "size": 16777216,
                    "sn": "VMWare NVME-0000",
                    "type": "SSD"
                },
                {
                    "addr": "0000:1b:00.0",
                    "class": "SYSTEM",
                    "mn": "VMware Virtual NVMe Disk",
                    "name": "unvme-ns-3",
                    "size": 16777216,
                    "sn": "VMWare NVME-0001",
                    "type": "SSD"
                },
                {
                    "addr": "",
                    "class": "SYSTEM",
                    "mn": "uram0",
                    "name": "uram0",
                    "size": 262144,
                    "sn": "uram0",
                    "type": "NVRAM"
                }
            ]
        }
    },
    "info": {
        "state": "OFFLINE",
        "situation": "DEFAULT",
        "rebuliding_progress": 0,
        "capacity": 0,
        "used": 0
    }
}
```



## POS/System



### 1. RUNIBOFOS



***Endpoint:***

```bash
Method: POST
Type: 
URL: http://{{host}}/api/ibofos/v1/system
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
| Date | Wed, 19 Aug 2020 06:49:22 GMT |
| Content-Type | application/json; charset=utf-8 |
| Content-Length | 127 |
| X-Request-Id | e995210c-87fa-4253-a320-302583c8ad6d |
| Connection | keep-alive |



```js
{
    "rid": "",
    "lastSuccessTime": 1597819762,
    "result": {
        "status": {
            "module": "COMMON",
            "code": 0,
            "level": "INFO",
            "description": "Success"
        }
    }
}
```



Status: Fail | Code: 400



***Response Headers:***

| Key | Value |
| --- | ------|
| Content-Type | application/json; charset=utf-8 |
| X-Request-Id | 992167b4-5e3b-4067-94b9-56adddf00bda |
| Date | Fri, 08 May 2020 10:16:19 GMT |
| Content-Length | 194 |
| Connection | keep-alive |



```js
{
    "rid": "",
    "lastSuccessTime": 0,
    "result": {
        "status": {
            "module": "",
            "code": 11000,
            "description": "Exec command error"
        }
    },
    "info": {
        "state": "",
        "situation": "",
        "rebuliding_progress": 0,
        "capacity": 0,
        "used": 0
    }
}
```



### 2. iBOFOSINFO



***Endpoint:***

```bash
Method: GET
Type: RAW
URL: http://{{host}}/api/ibofos/v1/system
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
| Date | Wed, 19 Aug 2020 06:50:49 GMT |
| Content-Type | application/json; charset=utf-8 |
| Content-Length | 355 |
| X-Request-Id | 8c10498a-e188-4a4d-b9bf-89cfef979af4 |
| Connection | keep-alive |



```js
{
    "rid": "d62522e2-336c-42dd-95dc-f7cd44c7e708",
    "lastSuccessTime": 1597908994,
    "result": {
        "status": {
            "module": "COMMON",
            "code": 0,
            "level": "INFO",
            "description": "Success"
        },
        "data": {
            "capacity": 120312771380,
            "rebuildingProgress": "0",
            "situation": "NORMAL",
            "state": "NORMAL",
            "used": 4194304
        }
    },
    "info": {
        "capacity": 120312771380,
        "rebuildingProgress": "0",
        "situation": "NORMAL",
        "state": "NORMAL",
        "used": 4194304
    }
}
```



### 3. MOUNTIBOFOS



***Endpoint:***

```bash
Method: POST
Type: 
URL: http://{{host}}/api/ibofos/v1/system/mount
```


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| X-Request-Id | {{$guid}} |  |
| ts | {{$timestamp}} |  |
| Content-Type | application/json |  |
| Authorization | {{basic_auth}} |  |



***Responses:***


Status: Fail - 1022 | Code: 200



***Response Headers:***

| Key | Value |
| --- | ------|
| Content-Type | application/json; charset=utf-8 |
| X-Request-Id | 85b04f05-e5d7-46c8-aa75-192f35a58a21 |
| Date | Fri, 08 May 2020 06:51:43 GMT |
| Content-Length | 258 |
| Connection | keep-alive |



```js
{
    "rid": "85b04f05-e5d7-46c8-aa75-192f35a58a21",
    "lastSuccessTime": 1588920703,
    "result": {
        "status": {
            "module": "",
            "code": 1022,
            "description": "TIMED OUT"
        }
    },
    "info": {
        "state": "DIAGNOSIS",
        "situation": "TRY_MOUNT",
        "rebuliding_progress": 0,
        "capacity": 120795955200,
        "used": 0
    }
}
```



Status: Success | Code: 200



***Response Headers:***

| Key | Value |
| --- | ------|
| Date | Wed, 19 Aug 2020 06:53:10 GMT |
| Content-Type | application/json; charset=utf-8 |
| Content-Length | 268 |
| X-Request-Id | 8f5ecc2c-7772-4081-b3b8-e0e52822dcdb |
| Connection | keep-alive |



```js
{
    "rid": "8f5ecc2c-7772-4081-b3b8-e0e52822dcdb",
    "lastSuccessTime": 1597819990,
    "result": {
        "status": {
            "module": "COMMON",
            "code": 0,
            "level": "INFO",
            "description": "Success"
        }
    },
    "info": {
        "capacity": 120312771380,
        "rebuildingProgress": "0",
        "situation": "NORMAL",
        "state": "NORMAL",
        "used": 0
    }
}
```



Status: Fail - 2503 | Code: 400



***Response Headers:***

| Key | Value |
| --- | ------|
| Date | Wed, 19 Aug 2020 06:51:37 GMT |
| Content-Type | application/json; charset=utf-8 |
| Content-Length | 276 |
| X-Request-Id | d3fe603c-655b-4e2c-b240-7e81428047f5 |
| Connection | keep-alive |



```js
{
    "rid": "d3fe603c-655b-4e2c-b240-7e81428047f5",
    "lastSuccessTime": 1597819897,
    "result": {
        "status": {
            "module": "Array",
            "code": 2503,
            "level": "ERROR",
            "description": "Array does not exists"
        }
    },
    "info": {
        "capacity": 0,
        "rebuildingProgress": "0",
        "situation": "DEFAULT",
        "state": "OFFLINE",
        "used": 0
    }
}
```



### 4. UNMOUNTIBOFOS



***Endpoint:***

```bash
Method: DELETE
Type: 
URL: http://{{host}}/api/ibofos/v1/system/mount
```


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| X-Request-Id | {{$guid}} |  |
| ts | {{$timestamp}} |  |
| Content-Type | application/json |  |
| Authorization | {{basic_auth}} |  |



***Responses:***


Status: Fail - 9001 | Code: 400



***Response Headers:***

| Key | Value |
| --- | ------|
| Date | Wed, 19 Aug 2020 06:51:23 GMT |
| Content-Type | application/json; charset=utf-8 |
| Content-Length | 311 |
| X-Request-Id | 742c4553-0909-43b6-97bf-6519cdee2b71 |
| Connection | keep-alive |



```js
{
    "rid": "742c4553-0909-43b6-97bf-6519cdee2b71",
    "lastSuccessTime": 1597819883,
    "result": {
        "status": {
            "module": "system",
            "code": 9001,
            "level": "ERROR",
            "description": "failed to unmount ibofos",
            "problem": "ibofos not mounted"
        }
    },
    "info": {
        "capacity": 0,
        "rebuildingProgress": "0",
        "situation": "DEFAULT",
        "state": "OFFLINE",
        "used": 0
    }
}
```



Status: Success | Code: 200



***Response Headers:***

| Key | Value |
| --- | ------|
| Date | Wed, 19 Aug 2020 06:53:24 GMT |
| Content-Type | application/json; charset=utf-8 |
| Content-Length | 259 |
| X-Request-Id | 84fd344b-774a-4733-b6a8-dcebd68dedf8 |
| Connection | keep-alive |



```js
{
    "rid": "84fd344b-774a-4733-b6a8-dcebd68dedf8",
    "lastSuccessTime": 1597820004,
    "result": {
        "status": {
            "module": "COMMON",
            "code": 0,
            "level": "INFO",
            "description": "Success"
        }
    },
    "info": {
        "capacity": 0,
        "rebuildingProgress": "0",
        "situation": "DEFAULT",
        "state": "OFFLINE",
        "used": 0
    }
}
```



### 5. EXITIBOFOS



***Endpoint:***

```bash
Method: DELETE
Type: 
URL: http://{{host}}/api/ibofos/v1/system
```


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| X-Request-Id | {{$guid}} |  |
| ts | {{$timestamp}} |  |
| Content-Type | application/json |  |
| Authorization | {{basic_auth}} |  |



***Responses:***


Status: Fail - 9003 | Code: 400



***Response Headers:***

| Key | Value |
| --- | ------|
| Date | Wed, 19 Aug 2020 06:54:26 GMT |
| Content-Type | application/json; charset=utf-8 |
| Content-Length | 407 |
| X-Request-Id | 6e4ab80b-07ee-4354-87d3-12df9821e432 |
| Connection | keep-alive |



```js
{
    "rid": "6e4ab80b-07ee-4354-87d3-12df9821e432",
    "lastSuccessTime": 1597820066,
    "result": {
        "status": {
            "module": "system",
            "code": 9003,
            "level": "ERROR",
            "description": "The request cannot be executed since ibofos is mounted",
            "problem": "ibofos already has been mounted",
            "solution": "try again after unmount ibofos"
        }
    },
    "info": {
        "capacity": 120312771380,
        "rebuildingProgress": "0",
        "situation": "NORMAL",
        "state": "NORMAL",
        "used": 0
    }
}
```



Status: Success | Code: 200



***Response Headers:***

| Key | Value |
| --- | ------|
| Date | Wed, 19 Aug 2020 06:54:44 GMT |
| Content-Type | application/json; charset=utf-8 |
| Content-Length | 259 |
| X-Request-Id | c9487931-cfdd-4f5b-a595-d09b6ce0fe89 |
| Connection | keep-alive |



```js
{
    "rid": "c9487931-cfdd-4f5b-a595-d09b6ce0fe89",
    "lastSuccessTime": 1597820084,
    "result": {
        "status": {
            "module": "COMMON",
            "code": 0,
            "level": "INFO",
            "description": "Success"
        }
    },
    "info": {
        "capacity": 0,
        "rebuildingProgress": "0",
        "situation": "DEFAULT",
        "state": "OFFLINE",
        "used": 0
    }
}
```



***Available Variables:***

| Key | Value | Type |
| --- | ------|-------------|
| deviceName1 | unvme-ns-0 |  |
| deviceName2 | unvme-ns-1 |  |
| deviceName3 | unvme-ns-2 |  |
| deviceName4 | unvme-ns-3 |  |
| volumeName1 | vol01 |  |
| volumeName2 | vol02 |  |
| volumeNameNew1 | volNew01 |  |
| period | 5m |  |
| arrayName | POSArray |  |



---
[Back to top](#d-agent)
> Made with &#9829; by [thedevsaddam](https://github.com/thedevsaddam) | Generated at: 2020-08-21 16:17:08 by [docgen](https://github.com/thedevsaddam/docgen)
