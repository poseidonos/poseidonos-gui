
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
  * [KILLDAGENT](#3-killdagent)

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

* [POS](#pos)

  * [RUNIBOFOS](#1-runibofos)
  * [EXITIBOFOS](#2-exitibofos)
  * [iBOFOSINFO](#3-ibofosinfo)
  * [SCAN DEVICE](#4-scan-device)
  * [SMART](#5-smart)
  * [ADD DEVICE](#6-add-device)
  * [REMOVE DEVICE](#7-remove-device)
  * [LIST DEVICE](#8-list-device)
  * [CREATE ARRAY](#9-create-array)
  * [MOUNTIBOFOS](#10-mountibofos)
  * [UNMOUNTIBOFOS](#11-unmountibofos)
  * [LIST ARRAY DEVICE](#12-list-array-device)
  * [DELETE ARRAY](#13-delete-array)
  * [LOAD ARRAY](#14-load-array)
  * [CREATE VOLUME](#15-create-volume)
  * [CREATE VOLUME (Multi)](#16-create-volume-(multi))
  * [UPDATE VOLUME](#17-update-volume)
  * [LIST VOLUME](#18-list-volume)
  * [MOUNT VOLUME](#19-mount-volume)
  * [UNMOUNT VOLUME](#20-unmount-volume)
  * [DELETE VOLUME](#21-delete-volume)

* [Redfish](#redfish)

  * [Cahsssis](#1-cahsssis)


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
            "module": "",
            "code": 12020,
            "description": "not defined"
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
    "lastSuccessTime": 1588929337,
    "result": {
        "status": {
            "module": "",
            "code": 0,
            "description": "alive"
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



### 3. KILLDAGENT


It just run command "run_ibof.sh" and does not gurantee to run.


***Endpoint:***

```bash
Method: DELETE
Type: RAW
URL: http://{{host}}/api/dagent/v1/dagent
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
| X-Request-Id | 41872401-0604-4ced-b2a9-d722a7b465c7 |
| Date | Fri, 08 May 2020 10:14:44 GMT |
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
            "module": "",
            "code": 12020,
            "description": "not defined"
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
            "module": "",
            "code": 12020,
            "description": "not defined"
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
            "module": "",
            "code": 12020,
            "description": "not defined"
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
            "module": "",
            "code": 12020,
            "description": "not defined"
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
            "module": "",
            "code": 12020,
            "description": "not defined"
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
            "module": "",
            "code": 12020,
            "description": "not defined"
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
            "module": "",
            "code": 12020,
            "description": "not defined"
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
            "module": "",
            "code": 12020,
            "description": "not defined"
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



### 9. VOL READ BW



***Endpoint:***

```bash
Method: GET
Type: 
URL: http://{{host}}/api/metric/v1//vol/{{volid01}}/readbw
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
            "module": "",
            "code": 12020,
            "description": "not defined"
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



### 10. VOL READ BW with PERIOD



***Endpoint:***

```bash
Method: GET
Type: 
URL: http://{{host}}/api/metric/v1//vol/{{volid01}}/readbw/{{period}}
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
            "module": "",
            "code": 12020,
            "description": "not defined"
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
            "module": "",
            "code": 12020,
            "description": "not defined"
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
            "module": "",
            "code": 12020,
            "description": "not defined"
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



### 13. VOL WRITE BW



***Endpoint:***

```bash
Method: GET
Type: 
URL: http://{{host}}/api/metric/v1/vol/{{volid01}}/writebw
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
            "module": "",
            "code": 12020,
            "description": "not defined"
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



### 14. VOL WRITE BW with PERIOD



***Endpoint:***

```bash
Method: GET
Type: 
URL: http://{{host}}/api/metric/v1/vol/{{volid01}}/writebw/{{period}}
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
            "module": "",
            "code": 12020,
            "description": "not defined"
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
            "module": "",
            "code": 12020,
            "description": "not defined"
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
            "module": "",
            "code": 12020,
            "description": "not defined"
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



### 17. VOL READ IOPS



***Endpoint:***

```bash
Method: GET
Type: 
URL: http://{{host}}/api/metric/v1/vol/{{volid01}}/readiops
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
            "module": "",
            "code": 12020,
            "description": "not defined"
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



### 18. VOL READ IOPS with PERIOD



***Endpoint:***

```bash
Method: GET
Type: 
URL: http://{{host}}/api/metric/v1/vol/{{volid01}}/readiops/{{period}}
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
            "module": "",
            "code": 12020,
            "description": "not defined"
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
            "module": "",
            "code": 12020,
            "description": "not defined"
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
            "module": "",
            "code": 12020,
            "description": "not defined"
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



### 21. VOL WRITE BW IOPS



***Endpoint:***

```bash
Method: GET
Type: 
URL: http://{{host}}/api/metric/v1//vol/{{volid01}}/writeiops
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
            "module": "",
            "code": 12020,
            "description": "not defined"
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



### 22. VOL WRITE BW IOPS with PERIOD



***Endpoint:***

```bash
Method: GET
Type: 
URL: http://{{host}}/api/metric/v1//vol/{{volid01}}/writeiops/{{period}}
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
            "module": "",
            "code": 12020,
            "description": "not defined"
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
            "module": "",
            "code": 12020,
            "description": "not defined"
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
            "module": "",
            "code": 12020,
            "description": "not defined"
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
URL: http://{{host}}/api/metric/v1/vol/{{volid01}}/latency
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
            "module": "",
            "code": 12020,
            "description": "not defined"
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



### 26. VOL LATENCY with PERIOD



***Endpoint:***

```bash
Method: GET
Type: 
URL: http://{{host}}/api/metric/v1/vol/{{volid01}}/latency/{{period}}
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
            "module": "",
            "code": 12020,
            "description": "not defined"
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



### 27. REBUILD LOG



***Endpoint:***

```bash
Method: GET
Type: 
URL: http://{{host}}/api/metric/v1/rebuild_logs/{{period}}
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
            "module": "",
            "code": 12020,
            "description": "not defined"
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



## POS
The biz-logic execute in both D-Agent and iBoFOS module



### 1. RUNIBOFOS



***Endpoint:***

```bash
Method: POST
Type: 
URL: http://{{host}}/api/ibofos/v1/system/ibofos
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
| X-Request-Id | 603c7ae6-252c-4832-9384-fdf1dc61aeef |
| Date | Mon, 04 May 2020 08:02:24 GMT |
| Content-Length | 176 |
| Connection | keep-alive |



```js
{
    "rid": "",
    "lastSuccessTime": 1588579344,
    "result": {
        "status": {
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



### 2. EXITIBOFOS



***Endpoint:***

```bash
Method: DELETE
Type: 
URL: http://{{host}}/api/ibofos/v1/system/ibofos
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
| X-Request-Id | bccc8e71-0cc0-4371-83b1-f09dc7ee776d |
| Date | Fri, 08 May 2020 10:16:39 GMT |
| Content-Length | 197 |
| Connection | keep-alive |



```js
{
    "rid": "",
    "lastSuccessTime": 0,
    "result": {
        "status": {
            "module": "",
            "code": 11020,
            "description": "iBoF Connection Error"
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
| X-Request-Id | 9cee863a-9e31-4a9e-8bf4-afa04783f95c |
| Date | Fri, 08 May 2020 09:20:26 GMT |
| Content-Length | 256 |
| Connection | keep-alive |



```js
{
    "rid": "9cee863a-9e31-4a9e-8bf4-afa04783f95c",
    "lastSuccessTime": 1588929626,
    "result": {
        "status": {
            "module": "",
            "code": 0,
            "description": "Exit iBoFOS Done"
        }
    },
    "info": {
        "state": "NORMAL",
        "situation": "NORMAL",
        "rebuliding_progress": 0,
        "capacity": 120795955200,
        "used": 0
    }
}
```



### 3. iBOFOSINFO



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
| Content-Type | application/json; charset=utf-8 |
| X-Request-Id | e36d87a7-bf2d-4232-9b09-a6654fca1353 |
| Date | Fri, 08 May 2020 06:49:57 GMT |
| Content-Length | 235 |
| Connection | keep-alive |



```js
{
    "rid": "e36d87a7-bf2d-4232-9b09-a6654fca1353",
    "lastSuccessTime": 1588920597,
    "result": {
        "status": {
            "module": "",
            "code": 0,
            "description": "DONE"
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



### 4. SCAN DEVICE



***Endpoint:***

```bash
Method: GET
Type: 
URL: http://{{host}}/api/ibofos/v1/device/scan
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
| X-Request-Id | 64ebd37c-80fe-42ee-96a3-8545b6fd8199 |
| Date | Fri, 08 May 2020 06:50:29 GMT |
| Content-Length | 247 |
| Connection | keep-alive |



```js
{
    "rid": "64ebd37c-80fe-42ee-96a3-8545b6fd8199",
    "lastSuccessTime": 1588920629,
    "result": {
        "status": {
            "module": "",
            "code": 0,
            "description": "Scan Device Done"
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



### 5. SMART



***Endpoint:***

```bash
Method: GET
Type: 
URL: http://{{host}}/api/ibofos/v1/device/smart/{{deviceName1}}
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
| X-Request-Id | 5fc25342-a46f-4567-8e2b-a748a5ffb09a |
| Date | Tue, 09 Jun 2020 00:25:17 GMT |
| Content-Length | 935 |
| Connection | keep-alive |



```js
{
    "rid": "5fc25342-a46f-4567-8e2b-a748a5ffb09a",
    "lastSuccessTime": 1591662317,
    "result": {
        "status": {
            "module": "",
            "code": 0,
            "description": "DONE"
        },
        "data": {
            "available_spare": "1%",
            "available_spare_space": "OK",
            "available_spare_threshold": "100%",
            "contoller_busy_time": "0x50000000000000000m",
            "critical_temperature_time": "0m",
            "current_temperature": "11759C",
            "data_units_read": "0x60000000000000000",
            "data_units_written": "0x50000000000000000",
            "device_reliability": "OK",
            "host_read_commands": "0x17700000000000000000",
            "host_write_commands": "0x13880000000000000000",
            "life_percentage_used": "0%",
            "lifetime_error_log_entries": "0",
            "power_cycles": "0xA0000000000000000",
            "power_on_hours": "0x3C0000000000000000h",
            "read_only": "No",
            "temperature": "OK",
            "unrecoverable_media_errors": "0",
            "unsafe_shutdowns": "0",
            "volatile_memory_backup": "OK",
            "warning_temperature_time": "0m"
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



### 6. ADD DEVICE



***Endpoint:***

```bash
Method: POST
Type: RAW
URL: http://{{host}}/api/ibofos/v1/device/attach
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



### 7. REMOVE DEVICE



***Endpoint:***

```bash
Method: DELETE
Type: RAW
URL: http://{{host}}/api/ibofos/v1/device
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



***Responses:***


Status: Fail | Code: 400



***Response Headers:***

| Key | Value |
| --- | ------|
| Content-Type | application/json; charset=utf-8 |
| X-Request-Id | 06cdfc9f-bceb-41ef-8324-468696b14763 |
| Date | Fri, 08 May 2020 10:22:47 GMT |
| Content-Length | 280 |
| Connection | keep-alive |



```js
{
    "rid": "06cdfc9f-bceb-41ef-8324-468696b14763",
    "lastSuccessTime": 1588933367,
    "result": {
        "status": {
            "module": "",
            "code": 2417,
            "description": "an error occurred during DETACHDEVICE"
        }
    },
    "info": {
        "state": "NORMAL",
        "situation": "NORMAL",
        "rebuliding_progress": 0,
        "capacity": 120795955200,
        "used": 0
    }
}
```



### 8. LIST DEVICE



***Endpoint:***

```bash
Method: GET
Type: 
URL: http://{{host}}/api/ibofos/v1/device
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



### 9. CREATE ARRAY



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
| Content-Type | application/json; charset=utf-8 |
| X-Request-Id | 2c79e5c2-d14c-4a30-a79a-e3af4a440da2 |
| Date | Fri, 08 May 2020 06:51:04 GMT |
| Content-Length | 235 |
| Connection | keep-alive |



```js
{
    "rid": "2c79e5c2-d14c-4a30-a79a-e3af4a440da2",
    "lastSuccessTime": 1588920664,
    "result": {
        "status": {
            "module": "",
            "code": 0,
            "description": "Done"
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



### 10. MOUNTIBOFOS



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


Status: Fail - Timeout / Mounting | Code: 200



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



### 11. UNMOUNTIBOFOS



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


Status: Success | Code: 200



***Response Headers:***

| Key | Value |
| --- | ------|
| Content-Type | application/json; charset=utf-8 |
| X-Request-Id | ebed102c-17c9-4f80-9063-d2e66f60f50a |
| Date | Fri, 08 May 2020 09:03:14 GMT |
| Content-Length | 244 |
| Connection | keep-alive |



```js
{
    "rid": "ebed102c-17c9-4f80-9063-d2e66f60f50a",
    "lastSuccessTime": 1588928594,
    "result": {
        "status": {
            "module": "",
            "code": 0,
            "description": "DONE"
        }
    },
    "info": {
        "state": "NORMAL",
        "situation": "NORMAL",
        "rebuliding_progress": 0,
        "capacity": 120795955200,
        "used": 0
    }
}
```



### 12. LIST ARRAY DEVICE



***Endpoint:***

```bash
Method: GET
Type: RAW
URL: http://{{host}}/api/ibofos/v1/array/device
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



### 13. DELETE ARRAY



***Endpoint:***

```bash
Method: DELETE
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
        "fttype": 1,
        "buffer": [
            {
                "deviceName": "uram0"
            }
        ],
        "data": [
            {
                "deviceName": "unvme-ns-0"
            },
            {
                "deviceName": "unvme-ns-1"
            },
            {
                "deviceName": "unvme-ns-2"
            }
        ],
        "spare": [
            {
                "deviceName": "unvme-ns-3"
            }
        ]
    }
}
```



***Responses:***


Status: Fail - Array is not created | Code: 400



***Response Headers:***

| Key | Value |
| --- | ------|
| Content-Type | application/json; charset=utf-8 |
| X-Request-Id | 8f97c091-fd8f-4d6f-92bb-c27935c54d65 |
| Date | Fri, 08 May 2020 10:38:50 GMT |
| Content-Length | 240 |
| Connection | keep-alive |



```js
{
    "rid": "8f97c091-fd8f-4d6f-92bb-c27935c54d65",
    "lastSuccessTime": 1588934330,
    "result": {
        "status": {
            "module": "",
            "code": 500000,
            "description": "2503"
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



Status: Success | Code: 200



***Response Headers:***

| Key | Value |
| --- | ------|
| Content-Type | application/json; charset=utf-8 |
| X-Request-Id | 2dbe3cab-2045-466d-9a87-64b8f01f6b78 |
| Date | Fri, 08 May 2020 09:04:28 GMT |
| Content-Length | 244 |
| Connection | keep-alive |



```js
{
    "rid": "2dbe3cab-2045-466d-9a87-64b8f01f6b78",
    "lastSuccessTime": 1588928668,
    "result": {
        "status": {
            "module": "",
            "code": 0,
            "description": "Done"
        }
    },
    "info": {
        "state": "NORMAL",
        "situation": "NORMAL",
        "rebuliding_progress": 0,
        "capacity": 120795955200,
        "used": 0
    }
}
```



Status: Fail - iBoF is mounted | Code: 400



***Response Headers:***

| Key | Value |
| --- | ------|
| Content-Type | application/json; charset=utf-8 |
| X-Request-Id | fea9d5f8-9e7e-4360-9a58-f09898b5af90 |
| Date | Fri, 08 May 2020 10:37:16 GMT |
| Content-Length | 255 |
| Connection | keep-alive |



```js
{
    "rid": "fea9d5f8-9e7e-4360-9a58-f09898b5af90",
    "lastSuccessTime": 1588934236,
    "result": {
        "status": {
            "module": "",
            "code": 500000,
            "description": "2500"
        }
    },
    "info": {
        "state": "NORMAL",
        "situation": "NORMAL",
        "rebuliding_progress": 0,
        "capacity": 120795955200,
        "used": 8388608
    }
}
```



### 14. LOAD ARRAY



***Endpoint:***

```bash
Method: GET
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



***Responses:***


Status: Fail | Code: 400



***Response Headers:***

| Key | Value |
| --- | ------|
| Content-Type | application/json; charset=utf-8 |
| X-Request-Id | b2b3a577-4579-40c7-8d7c-f67363ce6936 |
| Date | Fri, 08 May 2020 09:11:17 GMT |
| Content-Length | 249 |
| Connection | keep-alive |



```js
{
    "rid": "b2b3a577-4579-40c7-8d7c-f67363ce6936",
    "lastSuccessTime": 1588929077,
    "result": {
        "status": {
            "module": "",
            "code": 500000,
            "description": "2509"
        }
    },
    "info": {
        "state": "NORMAL",
        "situation": "NORMAL",
        "rebuliding_progress": 0,
        "capacity": 120795955200,
        "used": 0
    }
}
```



### 15. CREATE VOLUME



***Endpoint:***

```bash
Method: POST
Type: RAW
URL: http://{{host}}/api/ibofos/v1/volume
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
        "name": "vol",
        "size": 4194304,
        "maxbw": 0,
        "maxiops": 0
    }
}

```



***Responses:***


Status: Fail - Volume Name Special Character | Code: 400



***Response Headers:***

| Key | Value |
| --- | ------|
| Content-Type | application/json; charset=utf-8 |
| X-Request-Id | c5d59f2b-54ea-431c-b264-a62e7467e129 |
| Date | Fri, 08 May 2020 10:32:19 GMT |
| Content-Length | 256 |
| Connection | keep-alive |



```js
{
    "rid": "c5d59f2b-54ea-431c-b264-a62e7467e129",
    "lastSuccessTime": 1588933939,
    "result": {
        "status": {
            "module": "",
            "code": 2023,
            "description": "FAILED"
        }
    },
    "info": {
        "state": "NORMAL",
        "situation": "NORMAL",
        "rebuliding_progress": 0,
        "capacity": 120795955200,
        "used": 12582912
    }
}
```



Status: Fail - Volume size Empty | Code: 400



***Response Headers:***

| Key | Value |
| --- | ------|
| Content-Type | application/json; charset=utf-8 |
| Date | Fri, 08 May 2020 10:25:49 GMT |
| Content-Length | 199 |
| Connection | keep-alive |



```js
{
    "rid": "",
    "lastSuccessTime": 0,
    "result": {
        "status": {
            "module": "",
            "code": 10310,
            "description": "Body Error : Json Error"
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



Status: Fail | Code: 400



***Response Headers:***

| Key | Value |
| --- | ------|
| Content-Type | application/json; charset=utf-8 |
| X-Request-Id | eba2377b-6da5-48e0-ad1b-ed4ee4b7f6a5 |
| Date | Fri, 08 May 2020 09:11:45 GMT |
| Content-Length | 249 |
| Connection | keep-alive |



```js
{
    "rid": "eba2377b-6da5-48e0-ad1b-ed4ee4b7f6a5",
    "lastSuccessTime": 1588929105,
    "result": {
        "status": {
            "module": "",
            "code": 2060,
            "description": "FAILED"
        }
    },
    "info": {
        "state": "NORMAL",
        "situation": "NORMAL",
        "rebuliding_progress": 0,
        "capacity": 120795955200,
        "used": 0
    }
}
```



Status: Fail - Volume Name Duplicated | Code: 400



***Response Headers:***

| Key | Value |
| --- | ------|
| Content-Type | application/json; charset=utf-8 |
| X-Request-Id | aeb62d7c-dda7-43e0-b3c4-ff27849063bf |
| Date | Fri, 08 May 2020 10:29:05 GMT |
| Content-Length | 255 |
| Connection | keep-alive |



```js
{
    "rid": "aeb62d7c-dda7-43e0-b3c4-ff27849063bf",
    "lastSuccessTime": 1588933745,
    "result": {
        "status": {
            "module": "",
            "code": 2022,
            "description": "FAILED"
        }
    },
    "info": {
        "state": "NORMAL",
        "situation": "NORMAL",
        "rebuliding_progress": 0,
        "capacity": 120795955200,
        "used": 4194304
    }
}
```



Status: Fail - Volume Size 0 | Code: 400



***Response Headers:***

| Key | Value |
| --- | ------|
| Content-Type | application/json; charset=utf-8 |
| X-Request-Id | 11a54435-e59d-4348-ad93-4fb2197c5467 |
| Date | Fri, 08 May 2020 10:26:14 GMT |
| Content-Length | 249 |
| Connection | keep-alive |



```js
{
    "rid": "11a54435-e59d-4348-ad93-4fb2197c5467",
    "lastSuccessTime": 1588933574,
    "result": {
        "status": {
            "module": "",
            "code": 2032,
            "description": "FAILED"
        }
    },
    "info": {
        "state": "NORMAL",
        "situation": "NORMAL",
        "rebuliding_progress": 0,
        "capacity": 120795955200,
        "used": 0
    }
}
```



Status: Fail - Volume Name Empty | Code: 400



***Response Headers:***

| Key | Value |
| --- | ------|
| Content-Type | application/json; charset=utf-8 |
| X-Request-Id | a08ce0f5-851c-47f4-9611-ad105850517f |
| Date | Fri, 08 May 2020 10:25:14 GMT |
| Content-Length | 249 |
| Connection | keep-alive |



```js
{
    "rid": "a08ce0f5-851c-47f4-9611-ad105850517f",
    "lastSuccessTime": 1588933514,
    "result": {
        "status": {
            "module": "",
            "code": 2020,
            "description": "FAILED"
        }
    },
    "info": {
        "state": "NORMAL",
        "situation": "NORMAL",
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
| Content-Type | application/json; charset=utf-8 |
| X-Request-Id | 2ed41e67-7c0d-4888-8b40-76d2c2edbf0a |
| Date | Fri, 08 May 2020 10:19:39 GMT |
| Content-Length | 250 |
| Connection | keep-alive |



```js
{
    "rid": "2ed41e67-7c0d-4888-8b40-76d2c2edbf0a",
    "lastSuccessTime": 1588933179,
    "result": {
        "status": {
            "module": "",
            "code": 0,
            "description": "DONE"
        }
    },
    "info": {
        "state": "NORMAL",
        "situation": "NORMAL",
        "rebuliding_progress": 0,
        "capacity": 120795955200,
        "used": 4194304
    }
}
```



### 16. CREATE VOLUME (Multi)



***Endpoint:***

```bash
Method: POST
Type: RAW
URL: http://{{host}}/api/ibofos/v1/volume
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



***Responses:***


Status: Fail - Volume Name Special Character | Code: 400



***Response Headers:***

| Key | Value |
| --- | ------|
| Content-Type | application/json; charset=utf-8 |
| X-Request-Id | c5d59f2b-54ea-431c-b264-a62e7467e129 |
| Date | Fri, 08 May 2020 10:32:19 GMT |
| Content-Length | 256 |
| Connection | keep-alive |



```js
{
    "rid": "c5d59f2b-54ea-431c-b264-a62e7467e129",
    "lastSuccessTime": 1588933939,
    "result": {
        "status": {
            "module": "",
            "code": 2023,
            "description": "FAILED"
        }
    },
    "info": {
        "state": "NORMAL",
        "situation": "NORMAL",
        "rebuliding_progress": 0,
        "capacity": 120795955200,
        "used": 12582912
    }
}
```



Status: Success | Code: 200



***Response Headers:***

| Key | Value |
| --- | ------|
| Content-Type | application/json; charset=utf-8 |
| X-Request-Id | 2ed41e67-7c0d-4888-8b40-76d2c2edbf0a |
| Date | Fri, 08 May 2020 10:19:39 GMT |
| Content-Length | 250 |
| Connection | keep-alive |



```js
{
    "rid": "2ed41e67-7c0d-4888-8b40-76d2c2edbf0a",
    "lastSuccessTime": 1588933179,
    "result": {
        "status": {
            "module": "",
            "code": 0,
            "description": "DONE"
        }
    },
    "info": {
        "state": "NORMAL",
        "situation": "NORMAL",
        "rebuliding_progress": 0,
        "capacity": 120795955200,
        "used": 4194304
    }
}
```



Status: Fail - Volume Size 0 | Code: 400



***Response Headers:***

| Key | Value |
| --- | ------|
| Content-Type | application/json; charset=utf-8 |
| X-Request-Id | 11a54435-e59d-4348-ad93-4fb2197c5467 |
| Date | Fri, 08 May 2020 10:26:14 GMT |
| Content-Length | 249 |
| Connection | keep-alive |



```js
{
    "rid": "11a54435-e59d-4348-ad93-4fb2197c5467",
    "lastSuccessTime": 1588933574,
    "result": {
        "status": {
            "module": "",
            "code": 2032,
            "description": "FAILED"
        }
    },
    "info": {
        "state": "NORMAL",
        "situation": "NORMAL",
        "rebuliding_progress": 0,
        "capacity": 120795955200,
        "used": 0
    }
}
```



Status: Fail | Code: 400



***Response Headers:***

| Key | Value |
| --- | ------|
| Content-Type | application/json; charset=utf-8 |
| X-Request-Id | eba2377b-6da5-48e0-ad1b-ed4ee4b7f6a5 |
| Date | Fri, 08 May 2020 09:11:45 GMT |
| Content-Length | 249 |
| Connection | keep-alive |



```js
{
    "rid": "eba2377b-6da5-48e0-ad1b-ed4ee4b7f6a5",
    "lastSuccessTime": 1588929105,
    "result": {
        "status": {
            "module": "",
            "code": 2060,
            "description": "FAILED"
        }
    },
    "info": {
        "state": "NORMAL",
        "situation": "NORMAL",
        "rebuliding_progress": 0,
        "capacity": 120795955200,
        "used": 0
    }
}
```



Status: Fail - Volume Name Empty | Code: 400



***Response Headers:***

| Key | Value |
| --- | ------|
| Content-Type | application/json; charset=utf-8 |
| X-Request-Id | a08ce0f5-851c-47f4-9611-ad105850517f |
| Date | Fri, 08 May 2020 10:25:14 GMT |
| Content-Length | 249 |
| Connection | keep-alive |



```js
{
    "rid": "a08ce0f5-851c-47f4-9611-ad105850517f",
    "lastSuccessTime": 1588933514,
    "result": {
        "status": {
            "module": "",
            "code": 2020,
            "description": "FAILED"
        }
    },
    "info": {
        "state": "NORMAL",
        "situation": "NORMAL",
        "rebuliding_progress": 0,
        "capacity": 120795955200,
        "used": 0
    }
}
```



Status: Fail - Volume Name Duplicated | Code: 400



***Response Headers:***

| Key | Value |
| --- | ------|
| Content-Type | application/json; charset=utf-8 |
| X-Request-Id | aeb62d7c-dda7-43e0-b3c4-ff27849063bf |
| Date | Fri, 08 May 2020 10:29:05 GMT |
| Content-Length | 255 |
| Connection | keep-alive |



```js
{
    "rid": "aeb62d7c-dda7-43e0-b3c4-ff27849063bf",
    "lastSuccessTime": 1588933745,
    "result": {
        "status": {
            "module": "",
            "code": 2022,
            "description": "FAILED"
        }
    },
    "info": {
        "state": "NORMAL",
        "situation": "NORMAL",
        "rebuliding_progress": 0,
        "capacity": 120795955200,
        "used": 4194304
    }
}
```



Status: Fail - Volume size Empty | Code: 400



***Response Headers:***

| Key | Value |
| --- | ------|
| Content-Type | application/json; charset=utf-8 |
| Date | Fri, 08 May 2020 10:25:49 GMT |
| Content-Length | 199 |
| Connection | keep-alive |



```js
{
    "rid": "",
    "lastSuccessTime": 0,
    "result": {
        "status": {
            "module": "",
            "code": 10310,
            "description": "Body Error : Json Error"
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



### 17. UPDATE VOLUME



***Endpoint:***

```bash
Method: PUT
Type: RAW
URL: http://{{host}}/api/ibofos/v1/volume
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


Status: Fail | Code: 400



***Response Headers:***

| Key | Value |
| --- | ------|
| Content-Type | application/json; charset=utf-8 |
| X-Request-Id | 3c37afde-0dcc-49aa-8b4e-1f35fff01312 |
| Date | Fri, 08 May 2020 09:12:16 GMT |
| Content-Length | 249 |
| Connection | keep-alive |



```js
{
    "rid": "3c37afde-0dcc-49aa-8b4e-1f35fff01312",
    "lastSuccessTime": 1588929136,
    "result": {
        "status": {
            "module": "",
            "code": 2010,
            "description": "FAILED"
        }
    },
    "info": {
        "state": "NORMAL",
        "situation": "NORMAL",
        "rebuliding_progress": 0,
        "capacity": 120795955200,
        "used": 0
    }
}
```



### 18. LIST VOLUME



***Endpoint:***

```bash
Method: GET
Type: RAW
URL: http://{{host}}/api/ibofos/v1/volume
```


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| X-Request-Id | {{$guid}} |  |
| ts | {{$timestamp}} |  |
| Content-Type | application/json |  |
| Authorization | {{basic_auth}} |  |



***Responses:***


Status: Success - Unmounted | Code: 200



***Response Headers:***

| Key | Value |
| --- | ------|
| Content-Type | application/json; charset=utf-8 |
| X-Request-Id | c44d9d44-88a5-46aa-acc1-2b6c3dd0074f |
| Date | Fri, 08 May 2020 10:20:15 GMT |
| Content-Length | 371 |
| Connection | keep-alive |



```js
{
    "rid": "c44d9d44-88a5-46aa-acc1-2b6c3dd0074f",
    "lastSuccessTime": 1588933215,
    "result": {
        "status": {
            "module": "",
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
                    "status": "Unmounted",
                    "total": 4194304
                }
            ]
        }
    },
    "info": {
        "state": "NORMAL",
        "situation": "NORMAL",
        "rebuliding_progress": 0,
        "capacity": 120795955200,
        "used": 4194304
    }
}
```



Status: Success - Mounted | Code: 200



***Response Headers:***

| Key | Value |
| --- | ------|
| Content-Type | application/json; charset=utf-8 |
| X-Request-Id | bfdaa9a8-a390-4637-84c8-f4555e011205 |
| Date | Fri, 08 May 2020 10:21:18 GMT |
| Content-Length | 369 |
| Connection | keep-alive |



```js
{
    "rid": "bfdaa9a8-a390-4637-84c8-f4555e011205",
    "lastSuccessTime": 1588933278,
    "result": {
        "status": {
            "module": "",
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
    },
    "info": {
        "state": "NORMAL",
        "situation": "NORMAL",
        "rebuliding_progress": 0,
        "capacity": 120795955200,
        "used": 4194304
    }
}
```



Status: Success - No Volume | Code: 200



***Response Headers:***

| Key | Value |
| --- | ------|
| Content-Type | application/json; charset=utf-8 |
| X-Request-Id | 83c92a03-b2b0-4c83-923c-13a398629c6d |
| Date | Fri, 08 May 2020 09:12:29 GMT |
| Content-Length | 255 |
| Connection | keep-alive |



```js
{
    "rid": "83c92a03-b2b0-4c83-923c-13a398629c6d",
    "lastSuccessTime": 1588929149,
    "result": {
        "status": {
            "module": "",
            "code": 0,
            "description": "NO VOLUME EXIST"
        }
    },
    "info": {
        "state": "NORMAL",
        "situation": "NORMAL",
        "rebuliding_progress": 0,
        "capacity": 120795955200,
        "used": 0
    }
}
```



### 19. MOUNT VOLUME



***Endpoint:***

```bash
Method: POST
Type: RAW
URL: http://{{host}}/api/ibofos/v1/volume/mount
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
| X-Request-Id | 5e41f314-70ed-4806-8404-18e3642e0e79 |
| Date | Fri, 08 May 2020 10:20:46 GMT |
| Content-Length | 250 |
| Connection | keep-alive |



```js
{
    "rid": "5e41f314-70ed-4806-8404-18e3642e0e79",
    "lastSuccessTime": 1588933246,
    "result": {
        "status": {
            "module": "",
            "code": 0,
            "description": "DONE"
        }
    },
    "info": {
        "state": "NORMAL",
        "situation": "NORMAL",
        "rebuliding_progress": 0,
        "capacity": 120795955200,
        "used": 4194304
    }
}
```



Status: Fail - invalid volume name | Code: 400



***Response Headers:***

| Key | Value |
| --- | ------|
| Content-Type | application/json; charset=utf-8 |
| X-Request-Id | abde6ebf-0dcb-4da7-8a00-1d861b865417 |
| Date | Fri, 08 May 2020 09:13:51 GMT |
| Content-Length | 249 |
| Connection | keep-alive |



```js
{
    "rid": "abde6ebf-0dcb-4da7-8a00-1d861b865417",
    "lastSuccessTime": 1588929231,
    "result": {
        "status": {
            "module": "",
            "code": 2010,
            "description": "FAILED"
        }
    },
    "info": {
        "state": "NORMAL",
        "situation": "NORMAL",
        "rebuliding_progress": 0,
        "capacity": 120795955200,
        "used": 0
    }
}
```



### 20. UNMOUNT VOLUME



***Endpoint:***

```bash
Method: DELETE
Type: RAW
URL: http://{{host}}/api/ibofos/v1/volume/mount
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


Status: Fail - invalid volume name | Code: 400



***Response Headers:***

| Key | Value |
| --- | ------|
| Content-Type | application/json; charset=utf-8 |
| X-Request-Id | 6636068b-4edc-428c-a280-591be129866c |
| Date | Fri, 08 May 2020 09:14:07 GMT |
| Content-Length | 249 |
| Connection | keep-alive |



```js
{
    "rid": "6636068b-4edc-428c-a280-591be129866c",
    "lastSuccessTime": 1588929247,
    "result": {
        "status": {
            "module": "",
            "code": 2010,
            "description": "FAILED"
        }
    },
    "info": {
        "state": "NORMAL",
        "situation": "NORMAL",
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
| Content-Type | application/json; charset=utf-8 |
| X-Request-Id | fb8e3a59-f17c-4c8a-aa34-9a237fb15418 |
| Date | Fri, 08 May 2020 10:21:37 GMT |
| Content-Length | 250 |
| Connection | keep-alive |



```js
{
    "rid": "fb8e3a59-f17c-4c8a-aa34-9a237fb15418",
    "lastSuccessTime": 1588933297,
    "result": {
        "status": {
            "module": "",
            "code": 0,
            "description": "DONE"
        }
    },
    "info": {
        "state": "NORMAL",
        "situation": "NORMAL",
        "rebuliding_progress": 0,
        "capacity": 120795955200,
        "used": 4194304
    }
}
```



### 21. DELETE VOLUME



***Endpoint:***

```bash
Method: DELETE
Type: RAW
URL: http://{{host}}/api/ibofos/v1/volume
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


Status: Fail - Does not exist name | Code: 400



***Response Headers:***

| Key | Value |
| --- | ------|
| Content-Type | application/json; charset=utf-8 |
| X-Request-Id | c67e8be1-30f6-4c49-afe4-f2ae7c4f322e |
| Date | Fri, 08 May 2020 09:14:25 GMT |
| Content-Length | 249 |
| Connection | keep-alive |



```js
{
    "rid": "c67e8be1-30f6-4c49-afe4-f2ae7c4f322e",
    "lastSuccessTime": 1588929265,
    "result": {
        "status": {
            "module": "",
            "code": 2010,
            "description": "FAILED"
        }
    },
    "info": {
        "state": "NORMAL",
        "situation": "NORMAL",
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
| Content-Type | application/json; charset=utf-8 |
| X-Request-Id | 1aa7f401-1851-44da-ba74-4b6c6cd4f770 |
| Date | Fri, 08 May 2020 10:22:06 GMT |
| Content-Length | 244 |
| Connection | keep-alive |



```js
{
    "rid": "1aa7f401-1851-44da-ba74-4b6c6cd4f770",
    "lastSuccessTime": 1588933326,
    "result": {
        "status": {
            "module": "",
            "code": 0,
            "description": "DONE"
        }
    },
    "info": {
        "state": "NORMAL",
        "situation": "NORMAL",
        "rebuliding_progress": 0,
        "capacity": 120795955200,
        "used": 0
    }
}
```



## Redfish
Currently, D-Agent does not support Redfish.



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



***Available Variables:***

| Key | Value | Type |
| --- | ------|-------------|
| deviceName1 | unvme-ns-0 |  |
| deviceName2 | unvme-ns-1 |  |
| deviceName3 | unvme-ns-2 |  |
| deviceName4 | unvme-ns-3 |  |
| volid01 | vol01 |  |
| volid02 | vol02 |  |
| period | 5m |  |



---
[Back to top](#d-agent)
> Made with &#9829; by [thedevsaddam](https://github.com/thedevsaddam) | Generated at: 2020-07-17 16:46:43 by [docgen](https://github.com/thedevsaddam/docgen)
