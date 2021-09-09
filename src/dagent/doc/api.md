
# D-Agent

REST API Collection and Documents of D-Agent (Dynamic Agent)

## Indices

* [Common](#common)

  * [Template Dummy](#1-template-dummy)

* [D-Agent](#d-agent)

  * ~~[HEARTBEAT](#1-heartbeat)~~
  * [VERSION](#2-version)

* [Internal](#internal)

  * [DOCUMENTATION (HTML)](#1-documentation-(html))
  * [DOCUMENTATION (MARKDOWN)](#2-documentation-(markdown))
  * [EVENT CODE](#3-event-code)
  * [FORCEKILLIBOFOS](#4-forcekillibofos)
  * [KILLDAGENT](#5-killdagent)

* [POS/Array](#posarray)

  * [ADD DEVICE](#1-add-device)
  * [ARRAY INFO](#2-array-info)
  * [CREATE ARRAY](#3-create-array)
  * [DELETE ARRAY](#4-delete-array)
  * [LIST ARRAY DEVICE](#5-list-array-device)
  * ~~[LOAD ARRAY](#6-load-array)~~
  * [REMOVE DEVICE](#7-remove-device)
  * [MOUNT ARRAY](#8-mount-array)
  * [UNMOUNT ARRAY](#9-unmount-array)
  * [ARRAY LIST](#10-array-list)

* [POS/Devices](#posdevices)

  * [LIST DEVICE](#1-list-device)
  * [SCAN DEVICE](#2-scan-device)
  * [SMART](#3-smart)

* [POS/System](#possystem)

  * [EXITIBOFOS](#1-exitibofos)
  * ~~[MOUNTIBOFOS](#2-mountibofos)~~
  * [RUNIBOFOS](#3-runibofos)
  * ~~[UNMOUNTIBOFOS](#4-unmountibofos)~~
  * [iBOFOSINFO](#5-ibofosinfo)

* [POS/Volume](#posvolume)

  * [CREATE VOLUME](#1-create-volume)
  * [CREATE VOLUME (Multi)](#2-create-volume-(multi))
  * [DELETE VOLUME](#3-delete-volume)
  * [LIST VOLUME](#4-list-volume)
  * [MOUNT VOLUME](#5-mount-volume)
  * [RENAME VOLUME](#6-rename-volume)
  * [UNMOUNT VOLUME](#7-unmount-volume)
  * [LIST QOS POLICIES](#8-list-qos-policies)
  * [CREATE QOS VOLUME POLICY](#9-create-qos-volume-policy)
  * [RESET QOS VOLUME POLICY](#10-reset-qos-volume-policy)


--------


## Common

***
#### About
* D-Agent provides a REST API for communication from and to Poseidonos service
* D-Agent's default port 80 in Nginx (Internal Default is 3000)
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
        "version": "pos-0.9.10"
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



## D-Agent
The most biz-logic executes in D-Agent own module



### ~~1. HEARTBEAT~~ (DEPRECATED)


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



***More example Requests/Responses:***


##### I. Example Request: Success


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| X-Request-Id | {{$guid}} |  |
| ts | {{$timestamp}} |  |
| Content-Type | application/json |  |
| Authorization | {{basic_auth}} |  |



##### I. Example Response: Success
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


***Status Code:*** 200

<br>



##### II. Example Request: Fail


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| X-Request-Id | {{$guid}} |  |
| ts | {{$timestamp}} |  |
| Content-Type | application/json |  |
| Authorization | {{basic_auth}} |  |



##### II. Example Response: Fail
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


***Status Code:*** 400

<br>



### 2. VERSION



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



***More example Requests/Responses:***


##### I. Example Request: Fail


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| X-Request-Id | {{$guid}} |  |
| ts | {{$timestamp}} |  |
| Content-Type | application/json |  |
| Authorization | {{basic_auth}} |  |



##### I. Example Response: Fail
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
        "version": "pos-0.9.10"
    }
}
```


***Status Code:*** 400

<br>



##### II. Example Request: Success


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| X-Request-Id | {{$guid}} |  |
| ts | {{$timestamp}} |  |
| Content-Type | application/json |  |
| Authorization | {{basic_auth}} |  |



##### II. Example Response: Success
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


***Status Code:*** 200

<br>



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



***More example Requests/Responses:***


##### I. Example Request: Success


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| X-Request-Id | {{$guid}} |  |
| ts | {{$timestamp}} |  |
| Content-Type | application/json |  |
| Authorization | {{basic_auth}} |  |



##### I. Example Response: Success
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
        "version": "pos-0.9.10"
    }
}
```


***Status Code:*** 200

<br>



### 2. DOCUMENTATION (MARKDOWN)



***Endpoint:***

```bash
Method: GET
Type: 
URL: http://{{host}}/api/dagent/v1/doc/api.md
```



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



***More example Requests/Responses:***


##### I. Example Request: Success


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| X-Request-Id | {{$guid}} |  |
| ts | {{$timestamp}} |  |
| Content-Type | application/json |  |
| Authorization | {{basic_auth}} |  |



##### I. Example Response: Success
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
        "version": "pos-0.9.10"
    }
}
```


***Status Code:*** 200

<br>



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



***More example Requests/Responses:***


##### I. Example Request: Success


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| X-Request-Id | {{$guid}} |  |
| ts | {{$timestamp}} |  |
| Content-Type | application/json |  |
| Authorization | {{basic_auth}} |  |



##### I. Example Response: Success
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
        "version": "pos-0.9.10"
    }
}
```


***Status Code:*** 200

<br>



### 5. KILLDAGENT


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



***More example Requests/Responses:***


##### I. Example Request: Success


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| X-Request-Id | {{$guid}} |  |
| ts | {{$timestamp}} |  |
| Content-Type | application/json |  |
| Authorization | {{basic_auth}} |  |



##### I. Example Response: Success
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
        "version": "pos-0.9.10"
    }
}
```


***Status Code:*** 200

<br>


## POS/Array



### 1. ADD DEVICE



***Endpoint:***

```bash
Method: POST
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



***Body:***

```js        
{
    "param": {
        "spare": [
            {
                "deviceName": "{{deviceName4}}"
            }
        ]
    }
}
```



***More example Requests/Responses:***


##### I. Example Request: Fail - 2501


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



##### I. Example Response: Fail - 2501
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
        "version": "pos-0.9.10"
    }
}
```


***Status Code:*** 400

<br>



##### II. Example Request: Success


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



##### II. Example Response: Success
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
        "version": "pos-0.9.10"
    }
}
```


***Status Code:*** 200

<br>



### 2. ARRAY INFO



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



***More example Requests/Responses:***


##### I. Example Request: Success


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| X-Request-Id | {{$guid}} |  |
| ts | {{$timestamp}} |  |
| Content-Type | application/json |  |
| Authorization | {{basic_auth}} |  |



##### I. Example Response: Success
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
        "version": "pos-0.9.10"
    }
}
```


***Status Code:*** 200

<br>



### 3. CREATE ARRAY



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



***More example Requests/Responses:***


##### I. Example Request: Success


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



##### I. Example Response: Success
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
        "version": "pos-0.9.10"
    }
}
```


***Status Code:*** 200

<br>



##### II. Example Request: Fail - 2504


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



##### II. Example Response: Fail - 2504
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
        "version": "pos-0.9.10"
    }
}
```


***Status Code:*** 400

<br>



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



***More example Requests/Responses:***


##### I. Example Request: Success


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| X-Request-Id | {{$guid}} |  |
| ts | {{$timestamp}} |  |
| Content-Type | application/json |  |
| Authorization | {{basic_auth}} |  |



##### I. Example Response: Success
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
        "version": "pos-0.9.10"
    }
}
```


***Status Code:*** 200

<br>



##### II. Example Request: Fail - 2500


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| X-Request-Id | {{$guid}} |  |
| ts | {{$timestamp}} |  |
| Content-Type | application/json |  |
| Authorization | {{basic_auth}} |  |



##### II. Example Response: Fail - 2500
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
        "version": "pos-0.9.10"
    }
}
```


***Status Code:*** 400

<br>



### 5. LIST ARRAY DEVICE



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



***More example Requests/Responses:***


##### I. Example Request: Success


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| X-Request-Id | {{$guid}} |  |
| ts | {{$timestamp}} |  |
| Content-Type | application/json |  |
| Authorization | {{basic_auth}} |  |



##### I. Example Response: Success
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
        "version": "pos-0.9.10"
    }
}
```


***Status Code:*** 200

<br>



### ~~6. LOAD ARRAY~~ (DEPRECATED)



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



***More example Requests/Responses:***


##### I. Example Request: Fail (2509)


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| X-Request-Id | {{$guid}} |  |
| ts | {{$timestamp}} |  |
| Content-Type | application/json |  |
| Authorization | {{basic_auth}} |  |



##### I. Example Response: Fail (2509)
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
        "version": "pos-0.9.10"
    }
}
```


***Status Code:*** 400

<br>



### 7. REMOVE DEVICE



***Endpoint:***

```bash
Method: DELETE
Type: RAW
URL: http://{{host}}/api/ibofos/v1/array/{{arrayName}}/devices/{{deviceName}}
```


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| X-Request-Id | {{$guid}} |  |
| ts | {{$timestamp}} |  |
| Content-Type | application/json |  |
| Authorization | {{basic_auth}} |  |



***More example Requests/Responses:***


##### I. Example Request: Success


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| X-Request-Id | {{$guid}} |  |
| ts | {{$timestamp}} |  |
| Content-Type | application/json |  |
| Authorization | {{basic_auth}} |  |



***Body:***


##### I. Example Response: Success
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
        "version": "pos-0.9.10"
    }
}
```


***Status Code:*** 200

<br>

### 8. MOUNT ARRAY


***Endpoint:***

```bash
Method: POST
Type: 
URL: http://{{host}}/api/ibofos/v1/array/{{arrayName}}/mount
```


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| X-Request-Id | {{$guid}} |  |
| ts | {{$timestamp}} |  |
| Content-Type | application/json |  |
| Authorization | {{basic_auth}} |  |



***More example Requests/Responses:***


##### I. Example Request: Fail - 1022


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| X-Request-Id | {{$guid}} |  |
| ts | {{$timestamp}} |  |
| Content-Type | application/json |  |
| Authorization | {{basic_auth}} |  |



##### I. Example Response: Fail - 1022
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
    }
}
```


***Status Code:*** 200

<br>



##### II. Example Request: Success


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| X-Request-Id | {{$guid}} |  |
| ts | {{$timestamp}} |  |
| Content-Type | application/json |  |
| Authorization | {{basic_auth}} |  |



##### II. Example Response: Success
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
        "version": "pos-0.8.2"
    }
}
```


***Status Code:*** 200

<br>



##### III. Example Request: Fail - 10050


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| X-Request-Id | {{$guid}} |  |
| ts | {{$timestamp}} |  |
| Content-Type | application/json |  |
| Authorization | {{basic_auth}} |  |



##### III. Example Response: Fail - 10050
```js
{
    "rid": "",
    "lastSuccessTime": 0,
    "result": {
        "status": {
            "module": "D-Agent",
            "code": 10050,
            "level": "ERROR",
            "description": "Receiving error from POS"
        }
    }
}
```


***Status Code:*** 400

<br>
### 9. UNMOUNT ARRAY



***Endpoint:***

```bash
Method: DELETE
Type: 
URL: http://{{host}}/api/ibofos/v1/array/{{arrayName}}/mount
```


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| X-Request-Id | {{$guid}} |  |
| ts | {{$timestamp}} |  |
| Content-Type | application/json |  |
| Authorization | {{basic_auth}} |  |



***More example Requests/Responses:***


##### I. Example Request: Fail - 2522


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| X-Request-Id | {{$guid}} |  |
| ts | {{$timestamp}} |  |
| Content-Type | application/json |  |
| Authorization | {{basic_auth}} |  |



##### I. Example Response: Fail - 2522
```js
{
    "rid": "44f1280b-982e-4d2e-ab14-fe9eb2022045",
    "lastSuccessTime": 1622986144,
    "result": {
        "status": {
            "module": "Array",
            "code": 2522,
            "level": "WARN",
            "description": "no array exist"
        }
    },
    "info": {
        "version": "pos-0.8.2"
    }
}
```


***Status Code:*** 400

<br>



##### II. Example Request: Success


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| X-Request-Id | {{$guid}} |  |
| ts | {{$timestamp}} |  |
| Content-Type | application/json |  |
| Authorization | {{basic_auth}} |  |



##### II. Example Response: Success
```js
{
    "rid": "44f1280b-982e-4d2e-ab14-fe9eb2022045",
    "lastSuccessTime": 1622987052,
    "result": {
        "status": {
            "module": "COMMON",
            "code": 0,
            "level": "INFO",
            "description": "Success"
        }
    },
    "info": {
        "version": "pos-0.8.2"
    }
}
```


***Status Code:*** 200

<br>
### 10. LIST ARRAY



***Endpoint:***

```bash
Method: GET
Type: 
URL: http://{{host}}/api/ibofos/v1/arrays
```


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| X-Request-Id | {{$guid}} |  |
| ts | {{$timestamp}} |  |
| Content-Type | application/json |  |
| Authorization | {{basic_auth}} |  |



***More example Requests/Responses:***


##### I. Example Request: Success


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| X-Request-Id | {{$guid}} |  |
| ts | {{$timestamp}} |  |
| Content-Type | application/json |  |
| Authorization | {{basic_auth}} |  |



##### I. Example Response: Success
```js
{
    "rid": "44f1280b-982e-4d2e-ab14-fe9eb2022045",
    "lastSuccessTime": 1622985867,
    "result": {
        "status": {
            "module": "COMMON",
            "code": 0,
            "level": "INFO",
            "description": "Success"
        },
        "data": {
            "arrayList": [
                {
                    "createDatetime": "2021-06-06 16:20:48 +0530",
                    "devicelist": [
                        {
                            "name": "uram0",
                            "type": "BUFFER"
                        },
                        {
                            "name": "S45ANY0K100220      ",
                            "type": "DATA"
                        },
                        {
                            "name": "S45ANY0K300748      ",
                            "type": "DATA"
                        },
                        {
                            "name": "S45ANY0K300762      ",
                            "type": "DATA"
                        },
                        {
                            "name": "S45ANY0K300769      ",
                            "type": "SPARE"
                        }
                    ],
                    "name": "POSArray",
                    "status": "Mounted",
                    "updateDatetime": "2021-06-06 16:20:48 +0530"
                }
            ]
        }
    },
    "info": {
        "version": "pos-0.8.2"
    }
}
```


***Status Code:*** 200

<br>



## POS/Devices



### 1. LIST DEVICE



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



***More example Requests/Responses:***


##### I. Example Request: Success


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| X-Request-Id | {{$guid}} |  |
| ts | {{$timestamp}} |  |
| Content-Type | application/json |  |
| Authorization | {{basic_auth}} |  |



##### I. Example Response: Success
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


***Status Code:*** 200

<br>



### 2. SCAN DEVICE



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



***More example Requests/Responses:***


##### I. Example Request: Success


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| X-Request-Id | {{$guid}} |  |
| ts | {{$timestamp}} |  |
| Content-Type | application/json |  |
| Authorization | {{basic_auth}} |  |



##### I. Example Response: Success
```js
{
    "rid": "c993d360-e423-455d-a8f0-13ff816e89e5",
    "lastSuccessTime": 1631167785,
    "result": {
        "status": {
            "module": "COMMON",
            "code": 0,
            "level": "INFO",
            "description": "Success",
            "posDescription": "device scanning complete"
        }
    },
    "info": {
        "version": "pos-0.9.10"
    }
}
```


***Status Code:*** 200

<br>



### 3. SMART



***Endpoint:***

```bash
Method: GET
Type: 
URL: http://{{host}}/api/ibofos/v1/devices/{{deviceName}}/smart
```


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| X-Request-Id | {{$guid}} |  |
| ts | {{$timestamp}} |  |
| Content-Type | application/json |  |
| Authorization | {{basic_auth}} |  |



***More example Requests/Responses:***


##### I. Example Request: Success


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| X-Request-Id | {{$guid}} |  |
| ts | {{$timestamp}} |  |
| Content-Type | application/json |  |
| Authorization | {{basic_auth}} |  |



##### I. Example Response: Success
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
			"version": "pos-0.9.10"
    }
}
```


***Status Code:*** 200

<br>



## POS/System



### 1. EXITIBOFOS



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



***More example Requests/Responses:***


##### I. Example Request: Fail - 9003


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| X-Request-Id | {{$guid}} |  |
| ts | {{$timestamp}} |  |
| Content-Type | application/json |  |
| Authorization | {{basic_auth}} |  |



##### I. Example Response: Fail - 9003
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


***Status Code:*** 400

<br>



##### II. Example Request: Success


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| X-Request-Id | {{$guid}} |  |
| ts | {{$timestamp}} |  |
| Content-Type | application/json |  |
| Authorization | {{basic_auth}} |  |



##### II. Example Response: Success
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


***Status Code:*** 200

<br>



### ~~2. MOUNTIBOFOS~~ (DEPRECATED)



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



***More example Requests/Responses:***


##### I. Example Request: Fail - 1022


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| X-Request-Id | {{$guid}} |  |
| ts | {{$timestamp}} |  |
| Content-Type | application/json |  |
| Authorization | {{basic_auth}} |  |



##### I. Example Response: Fail - 1022
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


***Status Code:*** 200

<br>



##### II. Example Request: Success


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| X-Request-Id | {{$guid}} |  |
| ts | {{$timestamp}} |  |
| Content-Type | application/json |  |
| Authorization | {{basic_auth}} |  |



##### II. Example Response: Success
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


***Status Code:*** 200

<br>



##### III. Example Request: Fail - 2503


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| X-Request-Id | {{$guid}} |  |
| ts | {{$timestamp}} |  |
| Content-Type | application/json |  |
| Authorization | {{basic_auth}} |  |



##### III. Example Response: Fail - 2503
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


***Status Code:*** 400

<br>



### 3. RUNIBOFOS



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



***More example Requests/Responses:***


##### I. Example Request: Success


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| X-Request-Id | {{$guid}} |  |
| ts | {{$timestamp}} |  |
| Content-Type | application/json |  |
| Authorization | {{basic_auth}} |  |



##### I. Example Response: Success
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


***Status Code:*** 200

<br>



##### II. Example Request: Fail


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| X-Request-Id | {{$guid}} |  |
| ts | {{$timestamp}} |  |
| Content-Type | application/json |  |
| Authorization | {{basic_auth}} |  |



##### II. Example Response: Fail
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


***Status Code:*** 400

<br>



### ~~4. UNMOUNTIBOFOS~~ (DEPRECATED)



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



***More example Requests/Responses:***


##### I. Example Request: Fail - 9001


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| X-Request-Id | {{$guid}} |  |
| ts | {{$timestamp}} |  |
| Content-Type | application/json |  |
| Authorization | {{basic_auth}} |  |



##### I. Example Response: Fail - 9001
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


***Status Code:*** 400

<br>



##### II. Example Request: Success


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| X-Request-Id | {{$guid}} |  |
| ts | {{$timestamp}} |  |
| Content-Type | application/json |  |
| Authorization | {{basic_auth}} |  |



##### II. Example Response: Success
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


***Status Code:*** 200

<br>



### 5. iBOFOSINFO



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



***More example Requests/Responses:***


##### I. Example Request: Success


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| X-Request-Id | {{$guid}} |  |
| ts | {{$timestamp}} |  |
| Content-Type | application/json |  |
| Authorization | {{basic_auth}} |  |



##### I. Example Response: Success
```js
{
    "rid": "4e5ac098-da7c-4800-83d9-2edcfc251881",
    "lastSuccessTime": 1631167978,
    "result": {
        "status": {
            "module": "COMMON",
            "code": 0,
            "level": "INFO",
            "description": "Success",
            "posDescription": "DONE"
        },
        "data": {
            "version": "pos-0.9.10"
        }
    },
    "info": {
        "version": "pos-0.9.10"
    }
}
```


***Status Code:*** 200

<br>



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
        "name": "vol01f",
        "size": 4194304,
        "maxbw": 0,
        "maxiops": 0
    }
}
```



***More example Requests/Responses:***


##### I. Example Request: Fail - 2022


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



##### I. Example Response: Fail - 2022
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


***Status Code:*** 400

<br>



##### II. Example Request: Success


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



##### II. Example Response: Success
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


***Status Code:*** 200

<br>



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
        "array": "{{arrayName}}",
        "name": "volmulAA",
        "size": 5242880,
        "maxbw": 0,
        "maxiops": 0,
        "totalcount": 174,
        "stoponerror": false,
        "namesuffix": 0,
        "mountall": true
    }
}
```



### 3. DELETE VOLUME



***Endpoint:***

```bash
Method: DELETE
Type: RAW
URL: http://{{host}}/api/ibofos/v1/volumes/{{volumeName}}
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



***More example Requests/Responses:***


##### I. Example Request: Success


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



##### I. Example Response: Success
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
        "version": "pos-0.9.10"
    }
}
```


***Status Code:*** 200

<br>



##### II. Example Request: Fail - 2010


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



##### II. Example Response: Fail - 2010
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
        "version": "pos-0.9.10"
    }
}
```


***Status Code:*** 400

<br>



### 4. LIST VOLUME



***Endpoint:***

```bash
Method: GET
Type: RAW
URL: http://{{host}}/api/ibofos/v1/volumelist/{{arrayName}}
```


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| X-Request-Id | {{$guid}} |  |
| ts | {{$timestamp}} |  |
| Content-Type | application/json |  |
| Authorization | {{basic_auth}} |  |



***More example Requests/Responses:***


##### I. Example Request: Success


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| X-Request-Id | {{$guid}} |  |
| ts | {{$timestamp}} |  |
| Content-Type | application/json |  |
| Authorization | {{basic_auth}} |  |



##### I. Example Response: Success
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
        "version": "pos-0.9.10"
    }
}
```


***Status Code:*** 200

<br>

### 5. MOUNT VOLUME



***Endpoint:***

```bash
Method: POST
Type: RAW
URL: http://{{host}}/api/ibofos/v1/volumes/{{volumeName}}/mount
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



***More example Requests/Responses:***


##### I. Example Request: Fail - 2040


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



##### I. Example Response: Fail - 2040
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
        "version": "pos-0.9.10"
    }
}
```


***Status Code:*** 400

<br>



##### II. Example Request: Success


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



##### II. Example Response: Success
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
        "version": "pos-0.9.10"
    }
}
```


***Status Code:*** 200

<br>



### 6. RENAME VOLUME



***Endpoint:***

```bash
Method: PATCH
Type: RAW
URL: http://{{host}}/api/ibofos/v1/volumes/{{volumeName}}
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



***More example Requests/Responses:***


##### I. Example Request: Fail - 2010


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



##### I. Example Response: Fail - 2010
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
        "version": "pos-0.9.10"
    }
}
```


***Status Code:*** 400

<br>



##### II. Example Request: Success


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



##### II. Example Response: Success
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
        "version": "pos-0.9.10"
    }
}
```


***Status Code:*** 200

<br>



### 7. UNMOUNT VOLUME



***Endpoint:***

```bash
Method: DELETE
Type: RAW
URL: http://{{host}}/api/ibofos/v1/volumes/{{volumeName}}/mount
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



***More example Requests/Responses:***


##### I. Example Request: Success


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



##### I. Example Response: Success
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
        "version": "pos-0.9.10"
    }
}
```


***Status Code:*** 200

<br>



##### II. Example Request: Fail - 2041


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



##### II. Example Response: Fail - 2041
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
        "version": "pos-0.9.10"
    }
}
```


***Status Code:*** 400

<br>



### 8. LIST QOS VOLUME POLICIES



***Endpoint:***

```bash
Method: POST
Type: RAW
URL: http://{{host}}/api/ibofos/v1/qos/policies
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
        "vol":[{"volumeName":"volume-0"}]
    }
}
```



***More example Requests/Responses:***


##### I. Example Request: Fail - 4600


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
        "vol":[{"volumeName":"volume-0"}]
    }
}
```



##### I. Example Response: Fail - 4600
```js
{
    "rid": "df05ff24-d686-47c7-bf97-06830f1db485",
    "lastSuccessTime": 1631105717,
    "result": {
        "status": {
            "module": "QoSManager",
            "code": 4600,
            "level": "INFO",
            "description": "set event policy",
            "posDescription": "Invalid Volume Name vol"
        }
    },
    "info": {
        "version": "pos-0.9.10"
    }
}

```


***Status Code:*** 400

<br>



##### II. Example Request: Success


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
        "vol":[{"volumeName":"vol-0"}]
    }
}
```



##### II. Example Response: Success
```js
{
    "rid": "09117322-8994-4d94-9480-3a5257c07c08",
    "lastSuccessTime": 1631105738,
    "result": {
        "status": {
            "module": "COMMON",
            "code": 0,
            "level": "INFO",
            "description": "Success",
            "posDescription": "List of Volume Policies in POSArray"
        },
        "data": {
            "arrayName": [
                {
                    "ArrayName": "POSArray"
                }
            ],
            "rebuildPolicy": [
                {
                    "rebuild": "low"
                }
            ],
            "volumePolicies": [
                {
                    "id": 0,
                    "maxbw": 0,
                    "maxiops": 0,
                    "min_bw_guarantee": "No",
                    "min_iops_guarantee": "No",
                    "minbw": 0,
                    "miniops": 0,
                    "name": "vol0"
                }
            ]
        }
    },
    "info": {
        "version": "pos-0.9.10"
    }
}
```


***Status Code:*** 200

<br>

### 9. CREATE QOS VOLUME POLICY



***Endpoint:***

```bash
Method: POST
Type: RAW
URL: http://{{host}}/api/ibofos/v1/qos
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
        "vol":[{"volumeName":"volume-0"}],
        "maxiops": 100,
        "maxbw": 500
    }
}
```



***More example Requests/Responses:***


##### I. Example Request: Fail - 4600


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
        "vol":[{"volumeName":"volume-0"}],
        "maxiops": 100,
        "maxbw": 500
    }
}
```



##### I. Example Response: Fail - 4600
```js
{
    "rid": "ac36a4f1-edfb-4605-a5aa-a528ea135123",
    "lastSuccessTime": 1631105036,
    "result": {
        "status": {
            "module": "QoSManager",
            "code": 4600,
            "level": "INFO",
            "description": "set event policy",
            "posDescription": "Invalid Volume Name volume-0"
        }
    },
    "info": {
        "version": "pos-0.9.10"
    }
}


```


***Status Code:*** 400

<br>



##### II. Example Request: Success


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
        "vol":[{"volumeName":"vol-0"}],
        "maxiops": 100,
        "maxbw": 500
    }
}
```



##### II. Example Response: Success
```js
{
    "rid": "19022419-70f4-4bbb-82e0-ca8a73d8c103",
    "lastSuccessTime": 1631105124,
    "result": {
        "status": {
            "module": "COMMON",
            "code": 0,
            "level": "INFO",
            "description": "Success",
            "posDescription": "Volume Qos Policy Create"
        }
    },
    "info": {
        "version": "pos-0.9.10"
    }
}

```


***Status Code:*** 200

<br>

### 10. RESET QOS VOLUME POLICY



***Endpoint:***

```bash
Method: POST
Type: RAW
URL: http://{{host}}/api/ibofos/v1/qos/reset
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
        "vol":[{"volumeName":"volume-0"}]
    }
}
```



***More example Requests/Responses:***


##### I. Example Request: Fail - 4600


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
        "vol":[{"volumeName":"volume-0"}]
    }
}
```



##### I. Example Response: Fail - 4600
```js
{
    "rid": "88521bc2-ae2a-4b2b-b09b-536cdd3bdd80",
    "lastSuccessTime": 1631105505,
    "result": {
        "status": {
            "module": "QoSManager",
            "code": 4600,
            "level": "INFO",
            "description": "set event policy",
            "posDescription": "Invalid Volume Name volume-0"
        }
    },
    "info": {
        "version": "pos-0.9.10"
    }
}
```


***Status Code:*** 400

<br>



##### II. Example Request: Success


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
        "vol":[{"volumeName":"vol-0"}]
    }
}
```



##### II. Example Response: Success
```js
{
    "rid": "016b99d8-19d9-4c6a-bb65-aebc89117d5c",
    "lastSuccessTime": 1631105543,
    "result": {
        "status": {
            "module": "COMMON",
            "code": 0,
            "level": "INFO",
            "description": "Success",
            "posDescription": "Volume Qos Policy Reset"
        }
    },
    "info": {
        "version": "pos-0.9.10"
    }
}
```


***Status Code:*** 200

<br>


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
| volid01 | 1 |  |



---
[Back to top](#d-agent)
> Made with &#9829; by [thedevsaddam](https://github.com/thedevsaddam) | Generated at: 2020-11-11 18:13:28 by [docgen](https://github.com/thedevsaddam/docgen)
