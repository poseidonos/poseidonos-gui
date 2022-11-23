
# D-Agent

REST API Collection and Documents of D-Agent (Dynamic Agent)

## Indices

* [Array](#array)

  * [ADD DEVICE](#1-add-device)
  * [ARRAY INFO](#2-array-info)
  * [ARRAY MOUNT 1st](#3-array-mount-1st)
  * [ARRAY MOUNT 2nd](#4-array-mount-2nd)
  * [ARRAY UNMOUNT 1st](#5-array-unmount-1st)
  * [ARRAY UNMOUNT 2nd](#6-array-unmount-2nd)
  * [ARRAYLIST](#7-arraylist)
  * [AUTO CREATE ARRAY](#8-auto-create-array)
  * [CREATE ARRAY 1st ARRAY](#9-create-array-1st-array)
  * [CREATE ARRAY 2nd ARRAY](#10-create-array-2nd-array)
  * [DELETE ARRAY](#11-delete-array)
  * [REBUILD ARRAY](#12-rebuild-array)
  * [REMOVE DEVICE](#13-remove-device)
  * [REPLACE DEVICE](#14-replace-device)

* [Common](#common)

  * [Template Dummy](#1-template-dummy)

* [D-Agent](#d-agent)

  * [VERSION](#1-version)

* [Developer](#developer)

  * [RESET EVENT WRR](#1-reset-event-wrr)
  * [RESET MBR](#2-reset-mbr)
  * [STOPREBUILDING](#3-stoprebuilding)
  * [UPDATE EVENT WRR](#4-update-event-wrr)

* [Devices](#devices)

  * [CREATE DEVICE](#1-create-device)
  * [LIST DEVICE](#2-list-device)
  * [SCAN DEVICE](#3-scan-device)
  * [SMARTLOG](#4-smartlog)

* [Internal](#internal)

  * [DOCUMENTATION (HTML)](#1-documentation-(html))
  * [DOCUMENTATION (MARKDOWN)](#2-documentation-(markdown))
  * [EVENT CODE](#3-event-code)
  * [FORCEKILLIBOFOS](#4-forcekillibofos)
  * [KILLDAGENT](#5-killdagent)

* [Logger](#logger)

  * [APPLY LOGGER FILTER](#1-apply-logger-filter)
  * [GET LOG INFO](#2-get-log-info)
  * [GET LOG LEVEL](#3-get-log-level)
  * [SET LOG LEVEL](#4-set-log-level)
  * [SET LOG PREFERENCE](#5-set-log-preference)

* [Subsystem](#subsystem)

  * [ADD LISTENER](#1-add-listener)
  * [CREATE SUBSYSTEM](#2-create-subsystem)
  * [CREATE TRANSPORT](#3-create-transport)
  * [DELETE SUBSYSTEM](#4-delete-subsystem)
  * [LIST SUBSYSTEM](#5-list-subsystem)
  * [SUBSYSTEM INFO](#6-subsystem-info)

* [System](#system)

  * [EXITIBOFOS](#1-exitibofos)
  * [GET SYSTEMPROPERTY](#2-get-systemproperty)
  * [RUNIBOFOS](#3-runibofos)
  * [SET SYSTEMPROPERTY](#4-set-systemproperty)
  * [iBOFOSINFO](#5-ibofosinfo)

* [Telemetry](#telemetry)

  * [GET TELEMETRY PROPERTIES PATH](#1-get-telemetry-properties-path)
  * [SET TELEMETRY PROPERTIES PATH](#2-set-telemetry-properties-path)
  * [START TELEMETRY](#3-start-telemetry)
  * [STOP TELEMETRY](#4-stop-telemetry)

* [Volume](#volume)

  * [CREATE VOLUME](#1-create-volume)
  * [CREATE VOLUME (Multi)](#2-create-volume-(multi))
  * [DELETE VOLUME](#3-delete-volume)
  * [LIST VOLUME](#4-list-volume)
  * [MOUNT VOLUME](#5-mount-volume)
  * [MOUNT VOLUME WITH SUBSYSTEM](#6-mount-volume-with-subsystem)
  * [QOS CREATE VOLUME POLICIES](#7-qos-create-volume-policies)
  * [QOS LIST VOLUME POLICIES](#8-qos-list-volume-policies)
  * [QOS RESET VOLUME POLICIES](#9-qos-reset-volume-policies)
  * [RENAME VOLUME](#10-rename-volume)
  * [UNMOUNT VOLUME](#11-unmount-volume)
  * [VOLUME INFO](#12-volume-info)


--------


## Array



### 1. ADD DEVICE



***Endpoint:***

```bash
Method: POST
Type: RAW
URL: http://{{host}}/api/ibofos/v1/array/POSArray/devices
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


##### I. Example Request: Fail - 2321


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



##### I. Example Response: Fail - 2321
```js
{
    "rid": "518fec1e-c61b-4478-ae0b-c15ab756cf83",
    "lastSuccessTime": 1656017388,
    "result": {
        "status": {
            "module": "MBR Manager",
            "code": 2321,
            "level": "ERROR",
            "description": "mbr device already in array",
            "posDescription": "failed to add unvme-ns-3 to POSArray"
        }
    },
    "info": {
        "version": "v0.11.0-rc5"
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
    "rid": "",
    "lastSuccessTime": 0,
    "result": {
        "status": {
            "module": "",
            "code": 0,
            "eventName": "SUCCESS",
            "cause": "NONE",
            "description": "NONE",
            "posDescription": "NONE",
            "solution": "NONE"
        }
    },
    "info": {
        "version": "v0.11.0-rc6"
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
URL: http://{{host}}/api/ibofos/v1/array/POSArray
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
    "rid": "5758e612-377b-11ed-8c02-3cecef280244",
    "lastSuccessTime": 0,
    "result": {
        "status": {
            "module": "",
            "code": 0,
            "eventName": "SUCCESS",
            "cause": "NONE",
            "description": "NONE",
            "posDescription": "NONE",
            "solution": "NONE"
        },
        "data": {
            "capacity": "3385669032346",
            "createDatetime": "2022-09-18 23:26:05 +0530",
            "dataRaid": "RAID5",
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
            ],
            "gcMode": "none",
            "metaRaid": "RAID10",
            "name": "POSArray",
            "rebuildingProgress": "0",
            "situation": "NORMAL",
            "state": "NORMAL",
            "uniqueId": 1458401891,
            "updateDatetime": "2022-09-18 23:26:29 +0530",
            "used": "5368709120"
        }
    },
    "info": {
        "version": "v0.11.0-rc6"
    }
}
```


***Status Code:*** 200

<br>



### 3. ARRAY MOUNT 1st



***Endpoint:***

```bash
Method: POST
Type: RAW
URL: http://{{host}}/api/ibofos/v1/array/POSArray/mount
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
        "enable_write_through": true
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



##### I. Example Response: Success
```js
{
    "rid": "",
    "lastSuccessTime": 0,
    "result": {
        "status": {
            "module": "",
            "code": 0,
            "eventName": "SUCCESS",
            "cause": "NONE",
            "description": "NONE",
            "posDescription": "NONE",
            "solution": "NONE"
        }
    },
    "info": {
        "version": "v0.11.0-rc6"
    }
}
```


***Status Code:*** 200

<br>



### 4. ARRAY MOUNT 2nd



***Endpoint:***

```bash
Method: POST
Type: RAW
URL: http://{{host}}/api/ibofos/v1/array/POSArray1/mount
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
        "array": "{{arrayName}}1",
        "enable_write_through": true
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



##### I. Example Response: Success
```js
{
    "rid": "",
    "lastSuccessTime": 0,
    "result": {
        "status": {
            "module": "",
            "code": 0,
            "eventName": "SUCCESS",
            "cause": "NONE",
            "description": "NONE",
            "posDescription": "NONE",
            "solution": "NONE"
        }
    },
    "info": {
        "version": "v0.11.0-rc6"
    }
}
```


***Status Code:*** 200

<br>



### 5. ARRAY UNMOUNT 1st



***Endpoint:***

```bash
Method: DELETE
Type: RAW
URL: http://{{host}}/api/ibofos/v1/array/POSArray/mount
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
            "eventName": "SUCCESS",
            "cause": "NONE",
            "description": "NONE",
            "posDescription": "NONE",
            "solution": "NONE"
        }
    },
    "info": {
        "version": "v0.11.0-rc6"
    }
}
```


***Status Code:*** 200

<br>



### 6. ARRAY UNMOUNT 2nd



***Endpoint:***

```bash
Method: DELETE
Type: RAW
URL: http://{{host}}/api/ibofos/v1/array/POSArray1/mount
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
            "eventName": "SUCCESS",
            "cause": "NONE",
            "description": "NONE",
            "posDescription": "NONE",
            "solution": "NONE"
        }
    },
    "info": {
        "version": "v0.11.0-rc6"
    }
}
```


***Status Code:*** 200

<br>



### 7. ARRAYLIST



***Endpoint:***

```bash
Method: GET
Type: RAW
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
    "rid": "4f86cfb7-377b-11ed-8c02-3cecef280244",
    "lastSuccessTime": 0,
    "result": {
        "status": {
            "module": "",
            "code": 0,
            "eventName": "SUCCESS",
            "cause": "NONE",
            "description": "NONE",
            "posDescription": "NONE",
            "solution": "NONE"
        },
        "data": {
            "arrayList": [
                {
                    "capacity": "3385669032346",
                    "createDatetime": "2022-09-18 23:26:05 +0530",
                    "dataRaid": "RAID5",
                    "name": "POSArray",
                    "status": "Mounted",
                    "updateDatetime": "2022-09-18 23:26:29 +0530",
                    "used": "5368709120"
                }
            ]
        }
    },
    "info": {
        "version": "v0.11.0-rc6"
    }
}
```


***Status Code:*** 200

<br>



### 8. AUTO CREATE ARRAY



***Endpoint:***

```bash
Method: POST
Type: RAW
URL: http://{{host}}/api/ibofos/v1/autoarray
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
        "buffer": [{"deviceName": "uram0"}],
        "numData" : 3,
        "numSpare" : 1
    }
}

```



***More example Requests/Responses:***


##### I. Example Request: Fail - 2502


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
        "buffer":[{"deviceName":"uram0"}],
        "num_data" : 3,
        "num_spare" : 1
    }
}
```



##### I. Example Response: Fail - 2502
```js
{
    "rid": "feadefdb-bd4e-4481-9d1a-3bcf980c1179",
    "lastSuccessTime": 1656017207,
    "result": {
        "status": {
            "module": "Array",
            "code": 2502,
            "level": "ERROR",
            "description": "Array already exists",
            "posDescription": "failed to create POSArray"
        }
    },
    "info": {
        "version": "v0.11.0-rc5"
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
        "name": "{{arrayName}}",
        "raidtype": "RAID5",
        "buffer":[{"deviceName":"uram0"}],
        "num_data" : 3,
        "num_spare" : 1
    }
}
```



##### II. Example Response: Success
```js
{
    "rid": "",
    "lastSuccessTime": 0,
    "result": {
        "status": {
            "module": "",
            "code": 0,
            "eventName": "SUCCESS",
            "cause": "NONE",
            "description": "NONE",
            "posDescription": "NONE",
            "solution": "NONE"
        }
    },
    "info": {
        "version": "v0.11.0-rc6"
    }
}
```


***Status Code:*** 200

<br>



### 9. CREATE ARRAY 1st ARRAY



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
    "rid": "",
    "lastSuccessTime": 0,
    "result": {
        "status": {
            "module": "",
            "code": 0,
            "eventName": "SUCCESS",
            "cause": "NONE",
            "description": "NONE",
            "posDescription": "NONE",
            "solution": "NONE"
        }
    },
    "info": {
        "version": "v0.11.0-rc6"
    }
}
```


***Status Code:*** 200

<br>



##### II. Example Request: Fail - 2502


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



##### II. Example Response: Fail - 2502
```js
{
    "rid": "",
    "lastSuccessTime": 0,
    "result": {
        "status": {
            "module": "",
            "code": 2502,
            "eventName": "CREATE_ARRAY_SAME_ARRAY_NAME_EXISTS",
            "cause": "Array with the same name already exists.",
            "description": "Failed to create array.",
            "posDescription": "Failed to create array.",
            "solution": "Please use another name."
        }
    },
    "info": {
        "version": "v0.12.0-rc3"
    }
}
```


***Status Code:*** 400

<br>



### 10. CREATE ARRAY 2nd ARRAY



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
        "name": "{{arrayName}}1",
        "raidtype": "RAID5",
        "buffer": [
            {
                "deviceName": "uram1"
            }
        ],
        "data": [
            {
                "deviceName": "{{deviceName5}}"
            },
            {
                "deviceName": "{{deviceName6}}"
            },
            {
                "deviceName": "{{deviceName7}}"
            }
        ],
        "spare": [
            {
                "deviceName": "{{deviceName8}}"
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
    "rid": "",
    "lastSuccessTime": 0,
    "result": {
        "status": {
            "module": "",
            "code": 0,
            "eventName": "SUCCESS",
            "cause": "NONE",
            "description": "NONE",
            "posDescription": "NONE",
            "solution": "NONE"
        }
    },
    "info": {
        "version": "v0.11.0-rc6"
    }
}
```


***Status Code:*** 200

<br>



##### II. Example Request: Fail - 2502


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



##### II. Example Response: Fail - 2502
```js
{
    "rid": "619b1dc5-fad3-4f93-80ba-348c7243782d",
    "lastSuccessTime": 1656017315,
    "result": {
        "status": {
            "module": "Array",
            "code": 2502,
            "level": "ERROR",
            "description": "Array already exists",
            "posDescription": "failed to create array POSArray1"
        }
    },
    "info": {
        "version": "v0.11.0-rc5"
    }
}
```


***Status Code:*** 400

<br>



### 11. DELETE ARRAY



***Endpoint:***

```bash
Method: DELETE
Type: RAW
URL: http://{{host}}/api/ibofos/v1/array/POSArray
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
            "eventName": "SUCCESS",
            "cause": "NONE",
            "description": "NONE",
            "posDescription": "NONE",
            "solution": "NONE"
        }
    },
    "info": {
        "version": "v0.11.0-rc6"
    }
}
```


***Status Code:*** 200

<br>



##### II. Example Request: Fail - 2551


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| X-Request-Id | {{$guid}} |  |
| ts | {{$timestamp}} |  |
| Content-Type | application/json |  |
| Authorization | {{basic_auth}} |  |



##### II. Example Response: Fail - 2551
```js
{
    "rid": "dcdaa564-536e-479c-a150-d150badba1fc",
    "lastSuccessTime": 1656005583,
    "result": {
        "status": {
            "module": "Array",
            "code": 2551,
            "level": "INFO",
            "description": "Array State : Exist Normal",
            "posDescription": "failed to delete POSArray1"
        }
    },
    "info": {
        "version": "v0.11.0-rc5"
    }
}
```


***Status Code:*** 400

<br>



### 12. REBUILD ARRAY



***Endpoint:***

```bash
Method: POST
Type: RAW
URL: http://{{host}}/api/ibofos/v1/array/POSArray/rebuild
```


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| X-Request-Id | {{$guid}} |  |
| ts | {{$timestamp}} |  |
| Content-Type | application/json |  |
| Authorization | {{basic_auth}} |  |



***More example Requests/Responses:***


##### I. Example Request: Fail - 2824


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| X-Request-Id | {{$guid}} |  |
| ts | {{$timestamp}} |  |
| Content-Type | application/json |  |
| Authorization | {{basic_auth}} |  |



##### I. Example Response: Fail - 2824
```js
{
    "rid": "180630b7-49a3-11ed-ba93-3cecef280244",
    "lastSuccessTime": 0,
    "result": {
        "status": {
            "module": "",
            "code": 2824,
            "eventName": "REBUILD_ARRAY_IS_NORMAL",
            "cause": "There is no device to rebuild in array.",
            "description": "Failed to rebuild an array.",
            "posDescription": "Failed to rebuild an array.",
            "solution": "Please check the state of array."
        }
    },
    "info": {
        "version": "v0.12.0-rc0"
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
            "module": "",
            "code": 0,
            "eventName": "SUCCESS",
            "cause": "NONE",
            "description": "NONE",
            "posDescription": "NONE",
            "solution": "NONE"
        }
    },
    "info": {
        "version": "v0.11.0-rc6"
    }
}
```


***Status Code:*** 200

<br>



### 13. REMOVE DEVICE



***Endpoint:***

```bash
Method: DELETE
Type: RAW
URL: http://{{host}}/api/ibofos/v1/array/POSArray/devices/unvme-ns-3
```


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| X-Request-Id | {{$guid}} |  |
| ts | {{$timestamp}} |  |
| Content-Type | application/json |  |
| Authorization | {{basic_auth}} |  |



***More example Requests/Responses:***


##### I. Example Request: Fail - 2617


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



##### I. Example Response: Fail - 2617
```js
{
    "rid": "fc51b2a8-1e4e-4a82-95c4-f922e647bf90",
    "lastSuccessTime": 1656017489,
    "result": {
        "status": {
            "module": "",
            "code": 2617,
            "description": "",
            "posDescription": "failed to remove unvme-ns-3 from POSArray(code:2617)"
        }
    },
    "info": {
        "version": "v0.11.0-rc5"
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
    "rid": "",
    "lastSuccessTime": 0,
    "result": {
        "status": {
            "module": "",
            "code": 0,
            "eventName": "SUCCESS",
            "cause": "NONE",
            "description": "NONE",
            "posDescription": "NONE",
            "solution": "NONE"
        }
    },
    "info": {
        "version": "v0.11.0-rc6"
    }
}
```


***Status Code:*** 200

<br>



### 14. REPLACE DEVICE



***Endpoint:***

```bash
Method: POST
Type: RAW
URL: http://{{host}}/api/ibofos/v1/array/POSArray/replace
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
        "device":"unvme-ns-4"
    }
}
```



***More example Requests/Responses:***


##### I. Example Request: Fail - 2321


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



##### I. Example Response: Fail - 2321
```js
{
    "rid": "518fec1e-c61b-4478-ae0b-c15ab756cf83",
    "lastSuccessTime": 1656017388,
    "result": {
        "status": {
            "module": "MBR Manager",
            "code": 2321,
            "level": "ERROR",
            "description": "mbr device already in array",
            "posDescription": "failed to add unvme-ns-3 to POSArray"
        }
    },
    "info": {
        "version": "v0.11.0-rc5"
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
    "rid": "ee659f68-01a9-4e7b-928a-98c1cc08204f",
    "lastSuccessTime": 1656017435,
    "result": {
        "status": {
            "module": "COMMON",
            "code": 0,
            "level": "INFO",
            "description": "Success",
            "posDescription": "unvme-ns-9 has been added to POSArray successfully"
        }
    },
    "info": {
        "version": "v0.11.0-rc5"
    }
}
```


***Status Code:*** 200

<br>



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
            "module": "COMMON",
            "code": 0,
            "level": "INFO",
            "description": "Success",
            "posDescription": ""
        },
        "data": {
            "githash": "ebbdc29c4473f3dcae71e7ee405a1d5e8f469bec",
            "buildTime": "1656014539"
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
            "module": "COMMON",
            "code": 12020,
            "level": "ERROR",
            "description": "could not find build info",
            "posDescription": ""
        },
        "data": {
            "githash": "",
            "buildTime": ""
        }
    }
}
```


***Status Code:*** 400

<br>



## Developer



### 1. RESET EVENT WRR



***Endpoint:***

```bash
Method: POST
Type: RAW
URL: http://{{host}}/api/ibofos/v1/devel/event-wrr/reset
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
    "rid": "cd796066-377b-11ed-8c02-3cecef280244",
    "lastSuccessTime": 0,
    "result": {
        "status": {
            "module": "",
            "code": 0,
            "eventName": "SUCCESS",
            "cause": "NONE",
            "description": "NONE",
            "posDescription": "NONE",
            "solution": "NONE"
        }
    },
    "info": {
        "version": "v0.11.0-rc6"
    }
}
```


***Status Code:*** 200

<br>



### 2. RESET MBR



***Endpoint:***

```bash
Method: GET
Type: RAW
URL: http://{{host}}/api/ibofos/v1/arrays/reset
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
    "rid": "cd796066-377b-11ed-8c02-3cecef280244",
    "lastSuccessTime": 0,
    "result": {
        "status": {
            "module": "",
            "code": 0,
            "eventName": "SUCCESS",
            "cause": "NONE",
            "description": "NONE",
            "posDescription": "NONE",
            "solution": "NONE"
        }
    },
    "info": {
        "version": "v0.11.0-rc6"
    }
}
```


***Status Code:*** 200

<br>



### 3. STOPREBUILDING



***Endpoint:***

```bash
Method: DELETE
Type: RAW
URL: http://{{host}}/api/ibofos/v1/devel/POSArray/rebuild
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
    "rid": "cd796066-377b-11ed-8c02-3cecef280244",
    "lastSuccessTime": 0,
    "result": {
        "status": {
            "module": "",
            "code": 0,
            "eventName": "SUCCESS",
            "cause": "NONE",
            "description": "NONE",
            "posDescription": "NONE",
            "solution": "NONE"
        }
    },
    "info": {
        "version": "v0.11.0-rc6"
    }
}
```


***Status Code:*** 200

<br>



### 4. UPDATE EVENT WRR



***Endpoint:***

```bash
Method: POST
Type: RAW
URL: http://{{host}}/api/ibofos/v1/devel/event-wrr/update
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
        "name": "flush",
        "weight": 1
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
        "name": "flush",
        "weight": 1
    }
}
```



##### I. Example Response: Success
```js
{
    "rid": "cd796066-377b-11ed-8c02-3cecef280244",
    "lastSuccessTime": 0,
    "result": {
        "status": {
            "module": "",
            "code": 0,
            "eventName": "SUCCESS",
            "cause": "NONE",
            "description": "NONE",
            "posDescription": "NONE",
            "solution": "NONE"
        }
    },
    "info": {
        "version": "v0.11.0-rc6"
    }
}
```


***Status Code:*** 200

<br>



## Devices



### 1. CREATE DEVICE



***Endpoint:***

```bash
Method: POST
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
        "name": "uram3",
        "numBlocks": 8388608,
        "blockSize": 512,
        "devType": "uram",
        "numa": 0
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



##### I. Example Response: Success
```js
{
    "rid": "2f31d484-3778-11ed-a4ce-3cecef280244",
    "lastSuccessTime": 0,
    "result": {
        "status": {
            "module": "",
            "code": 0,
            "eventName": "SUCCESS",
            "cause": "NONE",
            "description": "NONE",
            "posDescription": "NONE",
            "solution": "NONE"
        }
    },
    "info": {
        "version": "v0.11.0-rc6"
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
    "rid": "285dbeeb-3639-11ed-9382-3cecef280244",
    "lastSuccessTime": 0,
    "result": {
        "status": {
            "module": "",
            "code": 1246,
            "eventName": "CLI_CREATE_DEVICE_FAILURE",
            "cause": "NONE",
            "description": "Failed to create a device.",
            "posDescription": "Failed to create a device.",
            "solution": "Check out the PoseidonOS log."
        }
    },
    "info": {
        "version": "v0.11.0-rc6"
    }
}
```


***Status Code:*** 200

<br>



### 2. LIST DEVICE



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
    "rid": "242cde52-3639-11ed-9382-3cecef280244",
    "lastSuccessTime": 0,
    "result": {
        "status": {
            "module": "",
            "code": 0,
            "eventName": "SUCCESS",
            "cause": "NONE",
            "description": "NONE",
            "posDescription": "NONE",
            "solution": "NONE"
        },
        "data": {
            "devicelist": [
                {
                    "address": "0000:60:00.0",
                    "class": "ARRAY",
                    "modelNumber": "SAMSUNG MZQLB1T9HAJR-00007              ",
                    "name": "unvme-ns-0",
                    "numa": "0",
                    "serialNumber": "S439NA0MB02505      ",
                    "size": "1920383410176",
                    "type": "SSD"
                },
                {
                    "address": "0000:61:00.0",
                    "class": "ARRAY",
                    "modelNumber": "SAMSUNG MZQLB1T9HAJR-00007              ",
                    "name": "unvme-ns-1",
                    "numa": "0",
                    "serialNumber": "S439NA0MB02476      ",
                    "size": "1920383410176",
                    "type": "SSD"
                },
                {
                    "address": "0000:62:00.0",
                    "class": "ARRAY",
                    "modelNumber": "SAMSUNG MZQLB1T9HAJR-00007              ",
                    "name": "unvme-ns-2",
                    "numa": "0",
                    "serialNumber": "S439NA0MB02503      ",
                    "size": "1920383410176",
                    "type": "SSD"
                },
                {
                    "address": "0000:63:00.0",
                    "class": "ARRAY",
                    "modelNumber": "SAMSUNG MZQLB1T9HAJR-00007              ",
                    "name": "unvme-ns-3",
                    "numa": "0",
                    "serialNumber": "S439NA0MB02514      ",
                    "size": "1920383410176",
                    "type": "SSD"
                },
                {
                    "address": "0000:64:00.0",
                    "class": "SYSTEM",
                    "modelNumber": "SAMSUNG MZQLB1T9HAJR-00007              ",
                    "name": "unvme-ns-4",
                    "numa": "0",
                    "serialNumber": "S439NA0MB02492      ",
                    "size": "1920383410176",
                    "type": "SSD"
                },
                {
                    "address": "0000:65:00.0",
                    "class": "SYSTEM",
                    "modelNumber": "SAMSUNG MZQLB1T9HAJR-00007              ",
                    "name": "unvme-ns-5",
                    "numa": "0",
                    "serialNumber": "S439NA0MB02473      ",
                    "size": "1920383410176",
                    "type": "SSD"
                },
                {
                    "address": "0000:66:00.0",
                    "class": "SYSTEM",
                    "modelNumber": "SAMSUNG MZQLB1T9HAJR-00007              ",
                    "name": "unvme-ns-6",
                    "numa": "0",
                    "serialNumber": "S439NA0MB02490      ",
                    "size": "1920383410176",
                    "type": "SSD"
                },
                {
                    "address": "0000:67:00.0",
                    "class": "SYSTEM",
                    "modelNumber": "SAMSUNG MZQLB1T9HAJR-00007              ",
                    "name": "unvme-ns-7",
                    "numa": "0",
                    "serialNumber": "S439NA0MA02562      ",
                    "size": "1920383410176",
                    "type": "SSD"
                },
                {
                    "address": "0000:68:00.0",
                    "class": "SYSTEM",
                    "modelNumber": "SAMSUNG MZQLB1T9HAJR-00007              ",
                    "name": "unvme-ns-8",
                    "numa": "0",
                    "serialNumber": "S439NA0MB02512      ",
                    "size": "1920383410176",
                    "type": "SSD"
                },
                {
                    "address": "0000:69:00.0",
                    "class": "SYSTEM",
                    "modelNumber": "SAMSUNG MZQLB1T9HAJR-00007              ",
                    "name": "unvme-ns-9",
                    "numa": "0",
                    "serialNumber": "S439NA0MB02477      ",
                    "size": "1920383410176",
                    "type": "SSD"
                },
                {
                    "address": "0000:6a:00.0",
                    "class": "SYSTEM",
                    "modelNumber": "SAMSUNG MZQLB1T9HAJR-00007              ",
                    "name": "unvme-ns-10",
                    "numa": "0",
                    "serialNumber": "S439NA0MB02483      ",
                    "size": "1920383410176",
                    "type": "SSD"
                },
                {
                    "address": "0000:6b:00.0",
                    "class": "SYSTEM",
                    "modelNumber": "SAMSUNG MZQLB1T9HAJR-00007              ",
                    "name": "unvme-ns-11",
                    "numa": "0",
                    "serialNumber": "S439NA0MB02482      ",
                    "size": "1920383410176",
                    "type": "SSD"
                },
                {
                    "address": "0000:b1:00.0",
                    "class": "SYSTEM",
                    "modelNumber": "SAMSUNG MZQLB1T9HAJR-00007              ",
                    "name": "unvme-ns-12",
                    "numa": "1",
                    "serialNumber": "S439NA0MB02465      ",
                    "size": "1920383410176",
                    "type": "SSD"
                },
                {
                    "address": "0000:b2:00.0",
                    "class": "SYSTEM",
                    "modelNumber": "SAMSUNG MZQLB1T9HAJR-00007              ",
                    "name": "unvme-ns-13",
                    "numa": "1",
                    "serialNumber": "S439NA0MB02494      ",
                    "size": "1920383410176",
                    "type": "SSD"
                },
                {
                    "address": "0000:b3:00.0",
                    "class": "SYSTEM",
                    "modelNumber": "SAMSUNG MZQLB1T9HAJR-00007              ",
                    "name": "unvme-ns-14",
                    "numa": "1",
                    "serialNumber": "S439NA0MB02484      ",
                    "size": "1920383410176",
                    "type": "SSD"
                },
                {
                    "address": "0000:b4:00.0",
                    "class": "SYSTEM",
                    "modelNumber": "SAMSUNG MZQLB1T9HAJR-00007              ",
                    "name": "unvme-ns-15",
                    "numa": "1",
                    "serialNumber": "S439NA0MB02468      ",
                    "size": "1920383410176",
                    "type": "SSD"
                },
                {
                    "address": "0000:b5:00.0",
                    "class": "SYSTEM",
                    "modelNumber": "SAMSUNG MZQLB1T9HAJR-00007              ",
                    "name": "unvme-ns-16",
                    "numa": "1",
                    "serialNumber": "S439NA0MB02466      ",
                    "size": "1920383410176",
                    "type": "SSD"
                },
                {
                    "address": "0000:b6:00.0",
                    "class": "SYSTEM",
                    "modelNumber": "SAMSUNG MZQLB1T9HAJR-00007              ",
                    "name": "unvme-ns-17",
                    "numa": "1",
                    "serialNumber": "S439NA0MA02555      ",
                    "size": "1920383410176",
                    "type": "SSD"
                },
                {
                    "address": "0000:b7:00.0",
                    "class": "SYSTEM",
                    "modelNumber": "SAMSUNG MZQLB1T9HAJR-00007              ",
                    "name": "unvme-ns-18",
                    "numa": "1",
                    "serialNumber": "S439NA0MB02491      ",
                    "size": "1920383410176",
                    "type": "SSD"
                },
                {
                    "address": "0000:b8:00.0",
                    "class": "SYSTEM",
                    "modelNumber": "SAMSUNG MZQLB1T9HAJR-00007              ",
                    "name": "unvme-ns-19",
                    "numa": "1",
                    "serialNumber": "S439NA0MB02464      ",
                    "size": "1920383410176",
                    "type": "SSD"
                },
                {
                    "address": "0000:b9:00.0",
                    "class": "SYSTEM",
                    "modelNumber": "SAMSUNG MZQLB1T9HAJR-00007              ",
                    "name": "unvme-ns-20",
                    "numa": "1",
                    "serialNumber": "S439NA0MB02469      ",
                    "size": "1920383410176",
                    "type": "SSD"
                },
                {
                    "address": "0000:ba:00.0",
                    "class": "SYSTEM",
                    "modelNumber": "SAMSUNG MZQLB1T9HAJR-00007              ",
                    "name": "unvme-ns-21",
                    "numa": "1",
                    "serialNumber": "S439NA0MB02513      ",
                    "size": "1920383410176",
                    "type": "SSD"
                },
                {
                    "address": "0000:bb:00.0",
                    "class": "SYSTEM",
                    "modelNumber": "SAMSUNG MZQLB1T9HAJR-00007              ",
                    "name": "unvme-ns-22",
                    "numa": "1",
                    "serialNumber": "S439NA0MB02485      ",
                    "size": "1920383410176",
                    "type": "SSD"
                },
                {
                    "address": "0000:bc:00.0",
                    "class": "SYSTEM",
                    "modelNumber": "SAMSUNG MZQLB1T9HAJR-00007              ",
                    "name": "unvme-ns-23",
                    "numa": "1",
                    "serialNumber": "S439NA0MB02472      ",
                    "size": "1920383410176",
                    "type": "SSD"
                },
                {
                    "class": "ARRAY",
                    "modelNumber": "uram0",
                    "name": "uram0",
                    "numa": "0",
                    "serialNumber": "uram0",
                    "size": "4294967296",
                    "type": "NVRAM"
                },
                {
                    "class": "SYSTEM",
                    "modelNumber": "uram1",
                    "name": "uram1",
                    "numa": "0",
                    "serialNumber": "uram1",
                    "size": "4294967296",
                    "type": "NVRAM"
                }
            ]
        }
    },
    "info": {
        "version": "v0.11.0-rc6"
    }
}
```


***Status Code:*** 200

<br>



### 3. SCAN DEVICE



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
    "rid": "2f31d484-3778-11ed-a4ce-3cecef280244",
    "lastSuccessTime": 0,
    "result": {
        "status": {
            "module": "",
            "code": 0,
            "eventName": "SUCCESS",
            "cause": "NONE",
            "description": "NONE",
            "posDescription": "NONE",
            "solution": "NONE"
        }
    },
    "info": {
        "version": "v0.11.0-rc6"
    }
}
```


***Status Code:*** 200

<br>



### 4. SMARTLOG



***Endpoint:***

```bash
Method: GET
Type: 
URL: http://{{host}}/api/ibofos/v1/devices/unvme-ns-0/smart
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
    "rid": "1edf45cc-3639-11ed-9382-3cecef280244",
    "lastSuccessTime": 0,
    "result": {
        "status": {
            "module": "",
            "code": 0,
            "eventName": "SUCCESS",
            "cause": "NONE",
            "description": "NONE",
            "posDescription": "NONE",
            "solution": "NONE"
        },
        "data": {
            "availableSpare": "100%",
            "availableSpareSpace": "OK",
            "availableSpareThreshold": "10%",
            "controllerBusyTime": "894",
            "criticalTemperatureTime": "0m",
            "currentTemperature": "45C",
            "dataUnitsRead": "37403752",
            "dataUnitsWritten": "48659276",
            "deviceReliability": "OK",
            "hostReadCommands": "648111034",
            "hostWriteCommands": "277261928",
            "lifePercentageUsed": "0%",
            "lifetimeErrorLogEntries": "139",
            "powerCycles": "143",
            "powerOnHours": "15481",
            "readOnly": "No",
            "temperature": "OK",
            "temperatureSensor": [
                "45C",
                "52C",
                "60C"
            ],
            "unrecoverableMediaErrors": "0",
            "unsafeShutdowns": "123",
            "volatileMemoryBackup": "OK",
            "warningTemperatureTime": "0m"
        }
    },
    "info": {
        "version": "v0.11.0-rc6"
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
        "state": "",
        "situation": "",
        "rebuliding_progress": 0,
        "capacity": 0,
        "used": 0
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
---
Goal: Events Unification
Version: "v.92"
modules:
  - name: "COMMON"
    count: 999
    idStart: 0
    idEnd:   999
    info:
      - code: 0
        level: "INFO"
        message: "Success"
        problem: ""
        solution: ""
  - name: "CLI"
    count: 100
    idStart: 1000
    idEnd:   1099
    info:
      - code: 1000
        level: INFO
        message: ibofos is started
        problem:
        solution:
      - code: 1001
        level: INFO
        message: ibofos is terminated
        problem:
        solution:
      - code: 1002
        level: INFO
        message: cli server is initialized
        problem:
        solution:
      - code: 1003
        level: INFO
        message: new client is connected
        problem:
        solution:
      - code: 1004
        level: INFO
        message: client is disconnected
        problem:
        solution:
      - code: 1005
        level: INFO
        message: request msg is received
        problem:
        solution:
      - code: 1006
        level: INFO
        message: response msg is sent
        problem:
        solution:
      - code: 1010
        level: INFO
        message: cli server preparing exit
        problem:
        solution:
      - code: 1011
        level: INFO
        message: cli server thread joined
        problem:
        solution:
      - code: 1012
        level: INFO
        message: enable reuse-addr
        problem:
        solution:
      - code: 1013
        level: WARN
        message: enable reuse-addr failed
        problem:
        solution:
      - code: 1014
        level: ERROR
        message: socket creation failed
        problem:
        solution:
      - code: 1015
        level: ERROR
        message: socket binding failed
        problem:
        solution:
      - code: 1016
        level: ERROR
        message: socket listen failed
        problem:
        solution:
      - code: 1017
        level: ERROR
        message: epoll creation failed
        problem:
        solution:
      - code: 1018
        level: ERROR
        message: socket accept failed
        problem:
        solution:
      - code: 1019
        level: ERROR
        message: max client error
        problem:
        solution:
      - code: 1020
        level: ERROR
        message: message sending failed
        problem:
        solution:
      - code: 1021
        level: ERROR
        message: message receiving failed
        problem:
        solution:
      - code: 1022
        level: WARN
        message: TIMED OUT
        problem:
        solution:
      - code: 1023
        level: ERROR
        message: INVALID PARAM
        problem:
        solution:
      - code: 1030
        level: INFO
        message: POS IS BUSY
        problem:
        solution:
  - name: "IBoFOS State Manager"
    count: 200
    idStart: 1100
    idEnd:   1299
    info:
      - code: 1101
        level: DEBUG
        message: state context added
        problem:
        solution:
      - code: 1102
        level: INFO
        message: state changed
        problem:
        solution:
      - code: 1103
        level: INFO
        message: state added
        problem:
        solution:
      - code: 1104
        level: INFO
        message: state removed
        problem:
        solution:
      - code: 1105
        level: INFO
        message: state debugged
        problem:
        solution:
      - code: 1234
        level: REPORT_TRACE
        message: iBoFOS System Recovery Inprogress
        problem:
        solution:
  - name: "VolumeManager"
    count: 300
    idStart: 2000
    idEnd:   2299
    info:
      - code: 2000
        level: INFO
        message: Volume created
        problem:
        solution:
      - code: 2001
        level: INFO
        message: Volume deleted
        problem:
        solution:
      - code: 2002
        level: INFO
        message: Volume mounted
        problem:
        solution:
      - code: 2003
        level: INFO
        message: Volume unmounted
        problem:
        solution:
      - code: 2004
        level: INFO
        message: Volume added to the list
        problem:
        solution:
      - code: 2005
        level: INFO
        message: Volume removed from the list
        problem:
        solution:
      - code: 2010
        level: WARN
        message: The requested volume does not exist
        problem: The volume with the requested volume name or volume ID does not exist
        solution: Enter the correct volume name or volume ID after checking the volume list
      - code: 2011
        level: WARN
        message: Too many volumes
        problem: Volume can not be created because the maximum number of volumes that can be created is exceeded
        solution: Retry after removing unnecessary volume among existing created volumes
      - code: 2012
        level: WARN
        message: Exceed creatable volume size
        problem: The requested volume size exceeds Array capacity
        solution: Check the system capacity and try again
      - code: 2020
        level: WARN
        message: Volume name is too short
        problem: The volume name entered is to short
        solution: Enter a volume name between 2 and 255 characters
      - code: 2021
        level: WARN
        message: Volume name  is too long
        problem: Volume name entered is too long
        solution: Enter a volume name that does not exceed 255 characters
      - code: 2022
        level: WARN
        message: Volume name is duplicated
        problem: A volume with a duplicate name already exists
        solution: Enter a different volume name
      - code: 2023
        level: WARN
        message: Unacceptable volume name
        problem: Volume name entered contains a string that is not allowed
        solution: Enter the volume name that meets the volume name rules
      - code: 2026
        level: Error
        message: Requested volume size  larger than remaining space in array
        problem: The requested volume size is larger than the remaining space in array
        solution: Please check the volume size and remaining Array space and try again
      - code: 2030
        level: WARN
        message: Requested size too large
        problem: The requested volume size is too large
        solution: Retry after checking the possible volume size
      - code: 2031
        level: WARN
        message: Requested size too small
        problem: The requested volume size is too small
        solution: Check the minimum allocatable volume size and retry
      - code: 2032
        level: WARN
        message: Requested size not aligned
        problem: The requested volume size does not align with block size
        solution: Input volume size to be multiple of block size
      - code: 2033
        level: WARN
        message: Requested size is invalid
        problem: The requested volume size is invalid
        solution: Check the allocatable volume size and retry
      - code: 2040
        level: WARN
        message: Volume already mounted
        problem: Attempt to mount a volume that is already mounted
        solution: Nothing to do
      - code: 2041
        level: WARN
        message: Volume already unmounted
        problem: Attempt to unmount a volume that is already unmounted
        solution: Nothing to do
      - code: 2050
        level: Info
        message: Can not delete mounted volume
        problem: Attempted to delete a mounted volume
        solution: Attempt to delete volume after unmounting the volume
      - code: 2060
        level: Error
        message: Fail to create volume meta
        problem:
        solution:
      - code: 2061
        level: Error
        message: Fail to open volume meta
        problem:
        solution:
      - code: 2062
        level: Error
        message: Fail to read volume meta
        problem:
        solution:
      - code: 2063
        level: Error
        message: Fail to write volume meta
        problem:
        solution:
      - code: 2064
        level: Error
        message: Volume meta content broken
        problem:
        solution:
      - code: 2070
        level: Error
        message: Memory allocation failure
        problem: A case that should never occur - heap allocation failure
        solution: Try again
      - code: 2071
        level: Error
        message: Invalid index error
        problem: A case that should never occur - index(volume id) internally granted is invalid
        solution: Internal logic error
      - code: 2072
        level: Error
        message: Fail to alloc. new volume ID
        problem: A case that should never occur - Unable to give volume ID, despite the volume count is not max
        solution: Internal logic error
      - code: 2073
        level: Error
        message: The same ID volume exists
        problem: A case that should never occur - A volume with the same ID already exists
        solution: Internal logic error
      - code: 2074
        level: Error
        message: Volume unexpected pending IO count
        problem: 
        solution: Internal logic error
      - code: 2080
        level: Warning
        message: Out of qos range
        problem: A value less than the minimum applicable qos value was entered
        solution: Check the minimum qos value that can be entered and try again.
      - code: 2090
        level: Warning
        message: Max Bandwidth value outside allowed range
        problem: A value lesser or greater than the applicable qos value was entered
        solution: Check the qos value that can be entered and try again
      - code: 2091
        level: Warning
        message: System Fault
        problem: Volume command cannot be performed in the STOP state
        solution:
      - code: 2092
        level: Warning
        message: Done with error
        problem: Some errors may occur during the processing of the request, and the subsequent operation may not work well.
        solution: Error for error handling although it cannot occur with user sequence
      - code: 2100
        level: Warning
        message: subsystem not created
        problem: Attempt to mount volume with no subsystem created
        solution: Subsystems must be created before mounting volumes
      - code: 2101
        level: Warning
        message: Volume already has set subsysten nqn
        solution: Subsystems must be created before mounting volumes
      - code: 2102
        level: Warning
        message: Fail to attach namespace to subsystem
        solution: Check if max namespaces was specified during subsystem creation (ex. -m 256)
      - code: 2103
        level: Warning
        message: Volume unmount failed
        solution: 
      - code: 2104
        level: Warning
        message: Volume detach failed
        solution:
  - name: "MBR Manager"
    count: 100
    idStart: 2300
    idEnd:   2399
    info:
      - code: 2300
        level: INFO
        message: Allocate memory success
        problem:
        solution:
      - code: 2301
        level: INFO
        message: mbr data create and write
        problem:
        solution:
      - code: 2302
        level: INFO
        message: mbr data add and write
        problem:
        solution:
      - code: 2303
        level: INFO
        message: parity check success
        problem:
        solution:
      - code: 2304
        level: INFO
        message: system uuid check success
        problem:
        solution:
      - code: 2310
        level: WARN
        message: device not found
        problem:
        solution:
      - code: 2311
        level: WARN
        message: parity check fail
        problem:
        solution:
      - code: 2312
        level: WARN
        message: system uuid check fail
        problem:
        solution:
      - code: 2313
        level: WARN
        message: mbr data not found
        problem:
        solution:
      - code: 2314
        level: WARN
        message: mbr key not found
        problem:
        solution:
      - code: 2320
        level: ERROR
        message: mbr wrong array index map
        problem:
        solution:
      - code: 2321
        level: ERROR
        message: mbr device already in array
        problem:
        solution:
      - code: 2330
        level: ERROR
        message: Allocate memory fail
        problem:
        solution:
      - code: 2331
        level: ERROR
        message: mbr data size error
        problem:
        solution:
      - code: 2332
        level: ERROR
        message: mbr format error
        problem:
        solution:
      - code: 2333
        level: ERROR
        message: get system uuid fail
        problem:
        solution:
  - name: "DeviceManager"
    count: 100
    idStart: 2400
    idEnd:   2499
    info:
      - code: 2400
        level: INFO
        message: Initial scan
        problem:
        solution:
      - code: 2401
        level: INFO
        message: Rescan
        problem:
        solution:
      - code: 2402
        level: INFO
        message: List device
        problem:
        solution:
      - code: 2403
        level: INFO
        message: List array device
        problem:
        solution:
      - code: 2404
        level: INFO/WARN
        message: Find dev(uid)
        problem:
        solution:
      - code: 2405
        level: ERROR
        message: scan error
        problem:
        solution:
      - code: 2406
        level: ERROR
        message: device open error
        problem:
        solution:
      - code: 2407
        level: ERROR
        message: device close error
        problem:
        solution:
      - code: 2408
        level: WARN
        message: device  not found
        problem: Device requested to be removed was not found
        solution:
      - code: 2409
        level: WARN
        message: Nonremovable Device
        problem: Only detached device can be removed
        solution:
      - code: 2410
        level: INFO
        message: daemon start
        problem:
        solution:
      - code: 2411
        level: INFO
        message: daemon stop
        problem:
        solution:
      - code: 2412
        level: INFO
        message: device attachment detected
        problem:
        solution:
      - code: 2413
        level: INFO
        message: device detachment detected
        problem:
        solution:
      - code: 2414
        level: INFO
        message: attach device
        problem:
        solution:
      - code: 2415
        level: INFO
        message: detach device
        problem:
        solution:
      - code: 2416
        level: WARN
        message: attach device error
        problem:
        solution:
      - code: 2417
        level: WARN
        message: detach device error
        problem:
        solution:
      - code: 2418
        level: WARN
        message: unable to start monitoring
        problem: all monitoring daemons are already running, or no monitors exist
        solution:
      - code: 2419
        level: WARN
        message: unable to stop monitoring
        problem: all monitoring daemons are already stopped, or no monitors exist
        solution:
      - code: 2420
        level: ERROR
        message: daemon stopped unexpectedly
        problem: daemon stopped unexpectedly
        solution:
      - code: 2421
        level: DEBUG
        message: prepare device
        problem:
        solution:
      - code: 2422
        level: DEBUG
        message: release device
        problem:
        solution:
  - name: "Array"
    count: 300
    idStart: 2500
    idEnd:   2799
    info:
      - code: 2500
        level: ERROR
        message: Array is alreday mounted.
        problem:
        solution:
      - code: 2501
        level: ERROR
        message: Failed to create array because the maximum number of possible arrays has been exceeded
        problem:
        solution: If you remove the existing array, you can create a new array
      - code: 2502
        level: ERROR
        message: Array already exists
        problem:
        solution:
      - code: 2503
        level: ERROR
        message: Array name is too short
        problem: Failed to create array
        solution: Enter the array name between 2 and 63 letters
      - code: 2504
        level: ERROR
        message: Array name is too long
        problem: Failed to create array
        solution: Enter the array name between 2 and 63 letters
      - code: 2505
        level: ERROR
        message: the number of ssds must be between 3 and 32
        problem:
        solution:
      - code: 2506
        level: ERROR
        message: nvm device size error
        problem:
        solution:
      - code: 2507
        level: ERROR
        message: Ssd size must be greater than {} bytes
        problem:
        solution:
      - code: 2508
        level: ERROR
        message: Ssds must be the same sizes
        problem:
        solution:
      - code: 2509
        level: ERROR
        message: MBR read error
        problem:
        solution:
      - code: 2510
        level: ERROR
        message: MBR write error
        problem:
        solution:
      - code: 2511
        level: ERROR
        message: Fault-tolerance info read error
        problem:
        solution:
      - code: 2512
        level: ERROR
        message: Wrong Fault-tolerance method type
        problem:
        solution:
      - code: 2513
        level: ERROR
        message: "{} Partition creation error"
        problem:
        solution:
      - code: 2514
        level: ERROR
        message: "{} Partiton load error"
        problem:
        solution:
      - code: 2515
        level: ERROR
        message: Wrong Array event id
        problem:
        solution:
      - code: 2516
        level: ERROR
        message: invalid logical address error
        problem:
        solution:
      - code: 2517
        level: ERROR
        message: RAID10 only supports even number of data devices
        problem: 
        solution: Select even number of data devices with RAID10
      - code: 2518
        level: ERROR
        message: Wrong type for array device
        problem: The type (for buffer or for data-storage) specified by the array device and the actual device type are different.
        solution: Check the type and retry
      - code: 2520
        level: INFO
        message: handle device detachment
        problem:
        solution:
      - code: 2521
        level: WARN
        message: no remaining spare device
        problem:
        solution:
      - code: 2522
        level: WARN
        message: no array exist
        problem:
        solution:
      - code: 2523
        level: WARN
        message: need mount first add or remove device
        problem:
        solution:
      - code: 2524
        level: WARN
        message: Array count exceeded
        problem:
        solution:
      - code: 2525
        level: WARN
        message: Array already exist
        problem:
        solution:
      - code: 2526
        level: WARN
        message: Array not found
        problem:
        solution:
      - code: 2527
        level: WARN
        message: Array shutdown takes too long
        problem:
        solution:
      - code: 2528
        level: WARN
        message: Array load failed
        problem:
        solution:
      - code: 2530
        level: INFO
        message: the array device has been added
        problem:
        solution:
      - code: 2531
        level: INFO
        message: the array device has been removed
        problem:
        solution:
      - code: 2532
        level: WARN
        message: failed to add the array device
        problem: the array device with a duplicate name already exists
        solution:
      - code: 2533
        level: WARN
        message: failed to remove the array device
        problem: The device with the requested name is not a spare device
        solution:
      - code: 2534
        level: INFO
        message: array devices are cleared
        problem:
        solution:
      - code: 2535
        level: ERROR
        message: failed to add or remove device
        problem: array not created
        solution:
      - code: 2536
        level: ERROR
        message: failed to add or remove device
        problem: unknown device with wrong name
        solution:
      - code: 2537
        level: ERROR
        message: failed to add device
        problem: the requested device is already in the array
        solution:
      - code: 2550
        level: INFO
        message: array status updated
        problem:
        solution:
      - code: 2551
        level: INFO
        message: "Array State : Exist Normal"
      - code: 2552
        level: INFO
        message: "Failed to delete array because array of the requested name could not be found"
        solution: "please check array's name to delete and try again"
      - code: 2553
        level: INFO
        message: "Array State : Exist Missing"
      - code: 2554
        level: INFO
        message: "Array State : Exist Broken"
      - code: 2555
        level: INFO
        message: "Array State : Normal"
      - code: 2556
        level: INFO
        message: "Array State : Degraded"
      - code: 2557
        level: INFO
        message: "Array State : Rebuilding"
      - code: 2558
        level: INFO
        message: "Array State : Stop"
      - code: 2560
        level: INFO
        message: "Array name too short"
      - code: 2561
        level: INFO
        message: "Array name too long"
        solution: "Enter a Array name that does not exceed 63 characters"
      - code: 2562
        level: INFO
        message: "Array name not allowed"
      - code: 2580
        level: INFO
        message: "Mounted Array Exist"
        solution: "Unmount Array"
      - code: 2581
        level: INFO
        message: "Array already unmounted"
        solution:
      - code: 2582
        level: INFO
        message: "Array mount priority error"
        solution:
      - code: 2583
        level: INFO
        message: "Array unmount priority error"
        solution: 
      - code: 2584
        level: INFO
        message: "Array unmounting"
        solution: 
      - code: 2585
        level: INFO
        message: "Array mounting"
        solution:
      - code: 2586
        level: INFO
        message: "Array already mounted"
        solution:
      - code: 2790
        level: INFO
        message: "Failed to terminate POS, Mounted array exist"
        solution: "Unmount the array"
  - name: "Rebuild"
    count: 100
    idStart: 2800
    idEnd:   2899
    info:
      - code: 2800
        level: INFO
        message: RebuildingDebuglog
      - code: 2802
        level: INFO
        message: Rebuilding stopped
      - code: 2803
        level: INFO
        message: Rebuilding failed
      - code: 2804
        level: REPORT_TRACE 
        message: rebuild progress report
      - code: 2805
        level: INFO
        message: rebuild progress
        problem:
        solution:
      - code: 2806
        level: INFO
        message: specific stripe is locked
        problem:
        solution:
      - code: 2807
        level: INFO
        message: specific stripe is unlocked
        problem:
        solution:
      - code: 2810
        level: INFO
        message: rebuild complete successfully
        problem:
        solution:
      - code: 2811
        level: ERROR
        message: "rebuild result: rebuild failure"
        problem:
        solution:
      - code: 2812
        level: WARN
        message: "rebuild result: rebuild stopped"
        problem:
        solution:
      - code: 2813
        level: WARN
        message: no rebuild target
        problem: the device detached is not belong to any partition
        solution:
      - code: 2814
        level: INFO
        message: no need to rebuild
        problem: state is not degraded
        solution:
      - code: 2815
        level: ERROR
        message: Failed to start rebuild, system is stop state
        problem:
        solution:
  - name: "ConfigManager"
    count: 100
    idStart: 2900
    idEnd:   2999
    info:
      - code: 2900
        level: INFO
        message: config file read done
        problem:
        solution:
      - code: 2901
        level: INFO
        message: get value done
        problem:
        solution:
      - code: 2902
        level: INFO
        message: valid value success
        problem:
        solution:
      - code: 2903
        level: INFO
        message: valid value fail
        problem:
        solution:
      - code: 2910
        level: Warning
        message: request config type error
        problem:
        solution:
      - code: 2911
        level: Warning
        message: request key error
        problem:
        solution:
      - code: 2920
        level: Error
        message: config file open fail
        problem:
        solution:
      - code: 2921
        level: Error
        message: config file size error
        problem:
        solution:
      - code: 2922
        level: Error
        message: config file read error
        problem:
        solution:
      - code: 2923
        level: Error
        message: config file format error
        problem:
        solution:
      - code: 2924
        level: Error
        message: json doc is not object
        problem: request get value & validate value after file open fail, read error & format error
        solution:
  - name: "Mapper"
    count: 200
    idStart: 3000
    idEnd:   3199
    info:
  - name: "Allocator"
    count: 200
    idStart: 3200
    idEnd:   3399
    info:
  - name: "GC"
    count: 100
    idStart: 3400
    idEnd:   3499
    info:
      - code: 3400
        level: INFO
        message: GC triggered
        problem:
        solution:
      - code: 3401
        level: INFO
        message: GC started
        problem:
        solution:
      - code: 3402
        level: INFO
        message: GC done
        problem:
        solution:
      - code: 3403
        level: INFO
        message: GC can not start
        problem:
        solution:
      - code: 3410
        level: INFO
        message: Victim stripe constructor
        problem:
        solution:
      - code: 3411
        level: INFO
        message: Load reverse map
        problem:
        solution:
      - code: 3412
        level: INFO
        message: Load valid blocks
        problem:
        solution:
  - name: "MetaFS"
    count: 500
    idStart: 4000
    idEnd:   4499
    info:
      - code: 4000
        level: DEBUG
        message: Message type for debugging
        problem:
        solution:
      - code: 4100
        level: INFO
        message: Message type for information
        problem:
        solution:
      - code: 4200
        level: WARN
        message: Initialize MFS again
        problem:
        solution:
      - code: 4201
        level: WARN
        message: Mount MFS again
        problem:
        solution:
      - code: 4202
        level: WARN
        message: Unmount MFS again
        problem:
        solution:
      - code: 4203
        level: WARN
        message: Failed to enqueue new msg
        problem: Failed to enqueue new msg to MFS, may need to expand free msg Q
        solution:
      - code: 4204
        level: WARN
        message: Compaction failed
        problem: Compaction couldn't be done due to not enough free space
        solution:
      - code: 4204
        level: WARN
        message: Compaction couldn't be done due to not enough free space
      - code: 4300
        level: ERROR
        message: MFS is mounted
        problem:
        solution:
      - code: 4301
        level: ERROR
        message: MFS is unmounted
        problem:
        solution:
      - code: 4302
        level: ERROR
        message: Message type for error
        problem:
        solution:
      - code: 4303
        level: ERROR
        message: Invalid parameters
        problem:
        solution:
      - code: 4304
        level: ERROR
        message: not ready
        problem:
        solution:
      - code: 4305
        level: ERROR
        message: already ready
        problem:
        solution:
      - code: 4306
        level: ERROR
        message: failed to initialize
        problem:
        solution:
      - code: 4307
        level: ERROR
        message: failed to bring up
        problem:
        solution:
      - code: 4308
        level: ERROR
        message: no media for MFS
        problem:
        solution:
      - code: 4309
        level: ERROR
        message: Request size is too big
        problem:
        solution:
      - code: 4310
        level: ERROR
        message: failed to open
        problem:
        solution:
      - code: 4311
        level: ERROR
        message: invalid information
        problem:
        solution:
      - code: 4312
        level: ERROR
        message: failed to create file
        problem:
        solution:
      - code: 4313
        level: ERROR
        message: failed to find the file
        problem:
        solution:
      - code: 4314
        level: ERROR
        message: the file is not opened
        problem:
        solution:
      - code: 4315
        level: ERROR
        message: failed to find the file
        problem:
        solution:
      - code: 4316
        level: ERROR
        message: tried to open the file again
        problem:
        solution:
      - code: 4317
        level: ERROR
        message: failed to close the file
        problem:
        solution:
      - code: 4318
        level: ERROR
        message: failed to format the file
        problem:
        solution:
      - code: 4319
        level: ERROR
        message: failed to delete the file
        problem:
        solution:
      - code: 4320
        level: ERROR
        message: the file is already locked
        problem:
        solution:
      - code: 4321
        level: ERROR
        message: failed to read the file
        problem:
        solution:
      - code: 4322
        level: ERROR
        message: failed to write to the file
        problem:
        solution:
      - code: 4323
        level: ERROR
        message: wrote size is not matched with request size
        problem: for ram disk
        solution:
      - code: 4324
        level: ERROR
        message: failed to seek the file
        problem: for ram disk
        solution:
      - code: 4325
        level: ERROR
        message: read size is not matched with request size
        problem: for ram disk
        solution:
      - code: 4326
        level: ERROR
        message: wrote size is not matched with request size
        problem: for ram disk
        solution:
      - code: 4327
        level: ERROR
        message: mount failed
        problem: for ram disk
        solution:
      - code: 4328
        level: ERROR
        message: unmount failed
        problem: for ram disk
        solution:
      - code: 4329
        level: ERROR
        message: no media
        problem: for ram disk
        solution:
      - code: 4330
        level: ERROR
        message: failed to create meta storage
        problem:
        solution:
      - code: 4331
        level: ERROR
        message: failed to close meta storage
        problem:
        solution:
      - code: 4332
        level: ERROR
        message: meta storage is not ready
        problem:
        solution:
      - code: 4333
        level: ERROR
        message: failed to create meta volume
        problem:
        solution:
      - code: 4334
        level: ERROR
        message: failed to open meta volume
        problem:
        solution:
      - code: 4335
        level: ERROR
        message: failed to close meta volume
        problem:
        solution:
      - code: 4336
        level: ERROR
        message: not enough space to create
        problem:
        solution:
      - code: 4337
        level: ERROR
        message: almost full
        problem:
        solution:
      - code: 4338
        level: ERROR
        message: already closed
        problem:
        solution:
      - code: 4339
        level: ERROR
        message: the catalog is invalid
        problem:
        solution:
      - code: 4340
        level: ERROR
        message: enqueue failed
        problem:
        solution:
      - code: 4341
        level: ERROR
        message: failed with various reason
        problem:
        solution:
      - code: 4342
        level: ERROR
        message: failed to save inode
        problem:
        solution:
      - code: 4343
        level: ERROR
        message: failed to pop from a queue
        problem:
        solution:
      - code: 4344
        level: ERROR
        message: failed to push to a queue
        problem:
        solution:
      - code: 4400
        level: CRITICAL
        message: Catalog is broken
        problem:
        solution:
  - name: "Sys-event"
    count: 80
    idStart: 4500
    idEnd:   4579
    info:
      - code: 4500
        level: DEBUG
        message: volume_event
        problem:
        solution:
      - code: 4510
        level: DEBUG
        message: device_ad_event
        problem:
        solution:
      - code: 4520
        level: DEBUG
        message: state_changed_event
        problem:
        solution:
  - name: "Logger"
    count: 20
    idStart: 4580
    idEnd:   4599
    info:
      - code: 4580
        level: WARN
        message: filter syntax error
        problem:
        solution:
      - code: 4581
        level: WARN
        message: no filter file in the path
        problem:
        solution:
      - code: 4582
        level: WARN
        message: requested log-level to set is invalid
        problem:
        solution:
  - name: "QoSManager"
    count: 20
    idStart: 4600
    idEnd:   4699
    info:
      - code: 4600
        level: INFO
        message: set event policy
  - name: "IOPath-nvmf"
    count: 100
    idStart: 5000
    idEnd:   5099
    info:
  - name: "IOPath-frontend"
    count: 100
    idStart: 5100
    idEnd:   5199
    info:
  - name: "IOPath-backend"
    count: 100
    idStart: 5200
    idEnd:   5299
    info:
  - name: "system"
    count: 1000
    idStart: 9000
    idEnd:   9999
    info:
      - code: 9000
        level: INFO
        message: SPACE INFO
        problem:
        solution:
      - code: 9001
        level: ERROR
        message: failed to unmount ibofos
        problem: ibofos not mounted
        solution:
      - code: 9002
        level: ERROR
        message: failed to unmount ibofos
        problem: higher priority job such as rebuilding is progressing.
        solution: try again after a while
      - code: 9003
        level: ERROR
        message: The request cannot be executed since ibofos is mounted
        problem: ibofos already has been mounted
        solution: try again after unmount ibofos
      - code: 9004
        level: INFO
        message: load system versionA
        problem: load system versionA
      - code: 9005
        level: INFO
        message: system unmounting
        problem: pos system unmounting
  - name: "D-Agent"
    count: 10000
    idStart: 10000
    idEnd:   19999
    info:
      - code: 10004
        level: ERROR
        message: Undefined Error
      - code: 10005
        level: ERROR
        message: Json Type Error
        solution: Check Request Body Type
      - code: 10050
        level: ERROR
        message: Receiving error from POS
      - code: 10110
        level: ERROR
        message: Unauthorized User
        solution: Check Authorization Header
      - code: 10120
        level: ERROR
        message: Body Json Error
        solution: Check Body Payload format
      - code: 10130
        level: ERROR
        message: X-request-Id Header Error
        solution: Check X-request-Id (uuid) Value
      - code: 10202
        level: INFO
        message: Request Accepted and passed to POS
      - code: 11000
        level: ERROR
        message: Sending error
        problem: connection problem between POS and Management Stack
        solution: restart POS
      - code: 11001
        level: ERROR
        message: Sending error
        problem: poseidonos binary not found in /usr/local/bin/
        solution: Please build the poseidonos and run 'make install' from poseidonos root directory
      - code: 11010
        level: ERROR
        message: Json Error
        problem: Malformed Json
        solution: Use valid Json format
      - code: 11020
        level: ERROR
        message: iBof Connection Error
        problem: connection problem between POS and Management Stack
        solution: restart POS
      - code: 11021
        level: ERROR
        message: 
        problem: connection problem between POS and Management Stack, No POS instance to kill
        solution: start POS
      - code: 11030
        level: ERROR
        message: Another request already in progress
        problem: another request is in progress. Wait for it's completion
      - code: 11040
        level: ERROR
        message: Associated POS call failed
        problem: POS calls returned error or busy status
        solution: Try again after some time
      - code: 11050
        level: ERROR
        message: Volume count exceeds limit
        problem: POS allows only 256 volumes to create. please check and try again
        solution: Try with a smaller value for count
      - code: 11060
        level: ERROR
        message: Volume suffix invalid
        problem: Only positive numeric suffix allowed
        solution: Please try positive numeric suffix
      - code: 12010
        level: ERROR
        message: one of iBoF service is dead
      - code: 12020
        level: ERROR
        message: could not find build info
      - code: 12090
        level: ERROR
        message: POS array is not mounted
        problem: Volumes can be created only after POS is mounted
        solution: mount POS
      - code: 13000
        level: ERROR
        message: Response timeout
  - name: "M-Agent"
    count: 10000
    idStart: 20000
    idEnd:   29999
    info:
      - code: 20313
        level: WARN
        message: Data not found
        problem: requested data is not present
        solution: check if the data is requested for an existing entity
      - code: 21000
        level: ERROR
        message: Querying error
        problem: connection problem between InfluxDB and Agent
        solution: restart InfluxDB
      - code: 21010
        level: ERROR
        message: Time parameter error
        problem: Invalid time period specified
        solution: use time from 1m,5m,15m,1h,6h,12h,24h,7d,30d
  - name: "NVME admin"
    count: 100
    idStart: 30000
    idEnd:   30099
    info:
      - code: 30000
        level: ERROR
        message: NVME ctlr error
        problem: Can't get nvme ctrlr
      - code: 30001
        level: ERROR
        message: Log page error
        problem: Can't get log page
      - code: 30002
        level: ERROR
        message: Completion error
        problem: Can't process completions
  - name: "NVME Admin"
    count: 100
    idStart: 30000
    idEnd:   30099
    info:
      - code: 30000
        level: ERROR
        message: Can't get nvme ctrlr
      - code: 30001
        level: ERROR
        message: Can't get log page
      - code: 30002
        level: ERROR
        message: Can't process completions

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
            "module": "COMMON",
            "code": 0,
            "level": "INFO",
            "description": "Success",
            "posDescription": ""
        }
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
            "module": "COMMON",
            "code": 0,
            "level": "INFO",
            "description": "Success",
            "posDescription": ""
        }
    }
}
```


***Status Code:*** 200

<br>



## Logger



### 1. APPLY LOGGER FILTER



***Endpoint:***

```bash
Method: POST
Type: RAW
URL: http://{{host}}/api/ibofos/v1/logger/filter
```


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| X-Request-Id | {{$guid}} |  |
| ts | {{$timestamp}} |  |
| Content-Type | application/json |  |
| Authorization | {{basic_auth}} |  |



***More example Requests/Responses:***


##### I. Example Request: Failure - No Filter File


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| X-Request-Id | {{$guid}} |  |
| ts | {{$timestamp}} |  |
| Content-Type | application/json |  |
| Authorization | {{basic_auth}} |  |



##### I. Example Response: Failure - No Filter File
```js
{
    "rid": "dd1a56c9-a040-4d7d-ae00-5cf09abafc4d",
    "lastSuccessTime": 1656018612,
    "result": {
        "status": {
            "module": "Logger",
            "code": 4581,
            "level": "WARN",
            "description": "no filter file in the path",
            "posDescription": "failed to apply filter(code:4581)"
        }
    },
    "info": {
        "version": "v0.11.0-rc5"
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
    "rid": "f9b2d55f-377b-11ed-8c02-3cecef280244",
    "lastSuccessTime": 0,
    "result": {
        "status": {
            "module": "",
            "code": 0,
            "eventName": "SUCCESS",
            "cause": "NONE",
            "description": "NONE",
            "posDescription": "NONE",
            "solution": "NONE"
        },
        "data": {
            "level": "debug"
        }
    },
    "info": {
        "version": "v0.11.0-rc6"
    }
}
```


***Status Code:*** 400

<br>



### 2. GET LOG INFO



***Endpoint:***

```bash
Method: GET
Type: 
URL: http://{{host}}/api/ibofos/v1/logger/info
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
    "rid": "e4aa4faf-377b-11ed-8c02-3cecef280244",
    "lastSuccessTime": 0,
    "result": {
        "status": {
            "module": "",
            "code": 0,
            "eventName": "SUCCESS",
            "cause": "NONE",
            "description": "NONE",
            "posDescription": "NONE",
            "solution": "NONE"
        },
        "data": {
            "logfileRotationCount": 20,
            "logfileSizeInMb": "50",
            "majorLogPath": "/var/log/pos/pos_major.log",
            "minAllowableLogLevel": "info",
            "minorLogPath": "/var/log/pos/pos.log"
        }
    },
    "info": {
        "version": "v0.11.0-rc6"
    }
}
```


***Status Code:*** 200

<br>



### 3. GET LOG LEVEL



***Endpoint:***

```bash
Method: GET
Type: 
URL: http://{{host}}/api/ibofos/v1/logger/level
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
    "rid": "f9b2d55f-377b-11ed-8c02-3cecef280244",
    "lastSuccessTime": 0,
    "result": {
        "status": {
            "module": "",
            "code": 0,
            "eventName": "SUCCESS",
            "cause": "NONE",
            "description": "NONE",
            "posDescription": "NONE",
            "solution": "NONE"
        },
        "data": {
            "level": "debug"
        }
    },
    "info": {
        "version": "v0.11.0-rc6"
    }
}
```


***Status Code:*** 200

<br>



### 4. SET LOG LEVEL



***Endpoint:***

```bash
Method: POST
Type: RAW
URL: http://{{host}}/api/ibofos/v1/logger/level
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
        "level": "debug"
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
        "level": "info"
    }
}
```



##### I. Example Response: Success
```js
{
    "rid": "eaee709e-377b-11ed-8c02-3cecef280244",
    "lastSuccessTime": 0,
    "result": {
        "status": {
            "module": "",
            "code": 0,
            "eventName": "SUCCESS",
            "cause": "NONE",
            "description": "NONE",
            "posDescription": "NONE",
            "solution": "NONE"
        }
    },
    "info": {
        "version": "v0.11.0-rc6"
    }
}
```


***Status Code:*** 200

<br>



### 5. SET LOG PREFERENCE



***Endpoint:***

```bash
Method: POST
Type: RAW
URL: http://{{host}}/api/ibofos/v1/logger/preference
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
        "structuredLogging": "true"
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
        "structuredLogging": "true"
    }
}
```



##### I. Example Response: Success
```js
{
    "rid": "1eb016cb-67f4-11ed-9c8f-0cc47a3a4522",
    "lastSuccessTime": 0,
    "result": {
        "status": {
            "module": "",
            "code": 0,
            "eventName": "SUCCESS",
            "cause": "NONE",
            "description": "NONE",
            "posDescription": "NONE",
            "solution": "NONE"
        }
    },
    "info": {
        "version": "v0.12.0-rc3"
    }
}
```


***Status Code:*** 200

<br>



## Subsystem



### 1. ADD LISTENER



***Endpoint:***

```bash
Method: POST
Type: RAW
URL: http://{{host}}/api/ibofos/v1/listener
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
        "subnqn": "nqn.2019-04.pos:subsystem1",
        "transportType": "TCP",
        "targetAddress": "107.108.83.97",
        "transportServiceId": "1158"
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
        "name":"nqn.2019-04.pos:subsystem1",
        "transport_type":"tcp",
        "target_address":"107.108.221.146",
        "transport_service_id":"1158"
    }
}
```



##### I. Example Response: Success
```js
{
    "rid": "8b2723ba-3650-11ed-85c9-3cecef280244",
    "lastSuccessTime": 0,
    "result": {
        "status": {
            "module": "",
            "code": 0,
            "eventName": "SUCCESS",
            "cause": "NONE",
            "description": "NONE",
            "posDescription": "NONE",
            "solution": "NONE"
        }
    },
    "info": {
        "version": "v0.11.0-rc6"
    }
}
```


***Status Code:*** 200

<br>



### 2. CREATE SUBSYSTEM



***Endpoint:***

```bash
Method: POST
Type: RAW
URL: http://{{host}}/api/ibofos/v1/subsystem
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
        "nqn":"nqn.2019-04.pos:subsystem11",
        "serialNumber": "POS0000000003",
        "modelNumber": "IBOF_VOLUME_EEEXTENSION",
        "maxNamespaces": 256,
        "allowAnyHost": true,
        "anaReporting":false
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
        "nqn":"nqn.2019-04.pos:subsystem11",
        "serialNumber": "POS0000000003",
        "modelNumber": "IBOF_VOLUME_EEEXTENSION",
        "maxNamespaces": 256,
        "allowAnyHost": true,
        "anaReporting":false
    }
}
```



##### I. Example Response: Success
```js
{
    "rid": "953fb07a-67f3-11ed-9c8f-0cc47a3a4522",
    "lastSuccessTime": 0,
    "result": {
        "status": {
            "module": "",
            "code": 0,
            "eventName": "SUCCESS",
            "cause": "NONE",
            "description": "NONE",
            "posDescription": "NONE",
            "solution": "NONE"
        }
    },
    "info": {
        "version": "v0.12.0-rc3"
    }
}
```


***Status Code:*** 200

<br>



### 3. CREATE TRANSPORT



***Endpoint:***

```bash
Method: POST
Type: RAW
URL: http://{{host}}/api/ibofos/v1/transport
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
        "transportType": "tcp",
        "bufCacheSize": 64,
        "numSharedBuf": 4096
    }
}
```



***More example Requests/Responses:***


##### I. Example Request: Fail


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
        "transport_type": "tcp",
        "buf_cache_size": 64,
        "num_shared_buf": 4096
    }
}
```



##### I. Example Response: Fail
```js
{
    "rid": "c792c11b-6a62-45a4-9aff-65606b7914d5",
    "lastSuccessTime": 1656018278,
    "result": {
        "status": {
            "module": "",
            "code": -32603,
            "description": "",
            "posDescription": "Failed to create transport. INTERNAL_ERROR: : Transport type 'tcp' already exists"
        }
    },
    "info": {
        "version": "v0.11.0-rc5"
    }
}
```


***Status Code:*** 400

<br>



### 4. DELETE SUBSYSTEM



***Endpoint:***

```bash
Method: DELETE
Type: RAW
URL: http://{{host}}/api/ibofos/v1/subsystem
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
        "subnqn": "nqn.2019-04.pos:subsystem10"
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
        "name": "nqn.2019-04.pos:subsystem1"
    }
}
```



##### I. Example Response: Success
```js
{
    "rid": "cd796066-377b-11ed-8c02-3cecef280244",
    "lastSuccessTime": 0,
    "result": {
        "status": {
            "module": "",
            "code": 0,
            "eventName": "SUCCESS",
            "cause": "NONE",
            "description": "NONE",
            "posDescription": "NONE",
            "solution": "NONE"
        }
    },
    "info": {
        "version": "v0.11.0-rc6"
    }
}
```


***Status Code:*** 200

<br>



### 5. LIST SUBSYSTEM



***Endpoint:***

```bash
Method: GET
Type: RAW
URL: http://{{host}}/api/ibofos/v1/subsystem
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
    "rid": "90dac1b8-3650-11ed-85c9-3cecef280244",
    "lastSuccessTime": 0,
    "result": {
        "status": {
            "module": "",
            "code": 0,
            "eventName": "SUCCESS",
            "cause": "NONE",
            "description": "NONE",
            "posDescription": "NONE",
            "solution": "NONE"
        },
        "data": {
            "subsystemlist": [
                {
                    "allowAnyHost": 1,
                    "nqn": "nqn.2014-08.org.nvmexpress.discovery",
                    "subtype": "Discovery"
                },
                {
                    "allowAnyHost": 1,
                    "listenAddresses": [
                        {
                            "addressFamily": "IPv4",
                            "targetAddress": "107.108.83.97",
                            "transportServiceId": "1158",
                            "transportType": "TCP"
                        },
                        {
                            "addressFamily": "IPv4",
                            "targetAddress": "127.0.0.1",
                            "transportServiceId": "1158",
                            "transportType": "TCP"
                        }
                    ],
                    "maxNamespaces": 256,
                    "modelNumber": "IBOF_VOLUME_EEEXTENSION",
                    "namespaces": [
                        {
                            "bdevName": "bdev_0_POSArray",
                            "nsid": 1,
                            "uuid": "0881ab4e-f601-4af7-bdeb-c325d30eb1f0"
                        },
                        {
                            "bdevName": "bdev_1_POSArray",
                            "nsid": 2,
                            "uuid": "20c7e973-c3fb-464b-9c7f-ffc040c68425"
                        }
                    ],
                    "nqn": "nqn.2019-04.pos:subsystem1",
                    "serialNumber": "POS0000000003",
                    "subtype": "NVMe"
                },
                {
                    "allowAnyHost": 1,
                    "listenAddresses": [
                        {
                            "addressFamily": "IPv4",
                            "targetAddress": "107.108.83.97",
                            "transportServiceId": "1158",
                            "transportType": "TCP"
                        },
                        {
                            "addressFamily": "IPv4",
                            "targetAddress": "127.0.0.1",
                            "transportServiceId": "1158",
                            "transportType": "TCP"
                        }
                    ],
                    "maxNamespaces": 256,
                    "modelNumber": "IBOF_VOLUME_EEEXTENSION",
                    "namespaces": [
                        {
                            "bdevName": "bdev_2_POSArray",
                            "nsid": 1,
                            "uuid": "b3e73ca6-b24f-4ff2-aa80-ad48ac4d84d2"
                        }
                    ],
                    "nqn": "nqn.2019-04.pos:subsystem2",
                    "serialNumber": "POS0000000003",
                    "subtype": "NVMe"
                },
                {
                    "allowAnyHost": 1,
                    "maxNamespaces": 256,
                    "modelNumber": "IBOF_VOLUME_EEEXTENSION",
                    "nqn": "nqn.2019-04.pos:subsystem11",
                    "serialNumber": "POS0000000003",
                    "subtype": "NVMe"
                }
            ]
        }
    },
    "info": {
        "version": "v0.11.0-rc6"
    }
}
```


***Status Code:*** 200

<br>



### 6. SUBSYSTEM INFO



***Endpoint:***

```bash
Method: POST
Type: RAW
URL: http://{{host}}/api/ibofos/v1/subsysteminfo
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
        "subnqn": "nqn.2019-04.pos:subsystem1"
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
        "subnqn": "nqn.2019-04.pos:subsystem1"
    }
}
```



##### I. Example Response: Success
```js
{
    "rid": "c7115735-67f3-11ed-9c8f-0cc47a3a4522",
    "lastSuccessTime": 0,
    "result": {
        "status": {
            "module": "",
            "code": 0,
            "eventName": "SUCCESS",
            "cause": "NONE",
            "description": "NONE",
            "posDescription": "NONE",
            "solution": "NONE"
        },
        "data": {
            "subsystemlist": [
                {
                    "allowAnyHost": 1,
                    "maxNamespaces": 256,
                    "modelNumber": "IBOF_VOLUME_EEEXTENSION",
                    "nqn": "nqn.2019-04.pos:subsystem1",
                    "serialNumber": "POS0000000003",
                    "subtype": "NVMe"
                }
            ]
        }
    },
    "info": {
        "version": "v0.12.0-rc3"
    }
}
```


***Status Code:*** 200

<br>



## System



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
    "rid": "b3aac4e2-3637-11ed-9382-3cecef280244",
    "lastSuccessTime": 0,
    "result": {
        "status": {
            "module": "",
            "code": 3,
            "eventName": "POS_STOP_FAILURE_BEING_TERMINATED",
            "cause": "PoseidonOS is already in termination process.",
            "description": "Failed to stop PoseidonOS.",
            "posDescription": "Failed to stop PoseidonOS.",
            "solution": "Please wait a moment."
        }
    },
    "info": {
        "version": "v0.11.0-rc6"
    }
}
```


***Status Code:*** 200

<br>



### 2. GET SYSTEMPROPERTY



***Endpoint:***

```bash
Method: GET
Type: RAW
URL: http://{{host}}/api/ibofos/v1/system/property
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
    "rid": "cfe7705e-3779-11ed-8c02-3cecef280244",
    "lastSuccessTime": 0,
    "result": {
        "status": {
            "module": "",
            "code": 0,
            "eventName": "SUCCESS",
            "cause": "NONE",
            "description": "NONE",
            "posDescription": "NONE",
            "solution": "NONE"
        },
        "data": {
            "rebuildPolicy": "low"
        }
    },
    "info": {
        "version": "v0.11.0-rc6"
    }
}
```


***Status Code:*** 200

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
    "lastSuccessTime": 1663522874,
    "result": {
        "status": {
            "module": "",
            "code": 0,
            "eventName": "",
            "cause": "",
            "description": "",
            "posDescription": "",
            "errorInfo": {
                "errorCode": 0,
                "errorResponses": [
                    {
                        "cause": "NONE",
                        "code": 0,
                        "description": "NONE",
                        "eventName": "SUCCESS",
                        "id": "transport"
                    },
                    {
                        "cause": "NONE",
                        "code": 0,
                        "description": "NONE",
                        "eventName": "SUCCESS",
                        "id": "subSystem1"
                    },
                    {
                        "cause": "NONE",
                        "code": 0,
                        "description": "NONE",
                        "eventName": "SUCCESS",
                        "id": "subSystem2"
                    },
                    {
                        "cause": "NONE",
                        "code": 0,
                        "description": "NONE",
                        "eventName": "SUCCESS",
                        "id": "addListener1"
                    },
                    {
                        "cause": "NONE",
                        "code": 0,
                        "description": "NONE",
                        "eventName": "SUCCESS",
                        "id": "addListener2"
                    },
                    {
                        "cause": "NONE",
                        "code": 0,
                        "description": "uram0: NONE",
                        "eventName": "SUCCESS",
                        "id": "uram1"
                    },
                    {
                        "cause": "NONE",
                        "code": 0,
                        "description": "uram1: NONE",
                        "eventName": "SUCCESS",
                        "id": "uram2"
                    }
                ]
            }
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
    "lastSuccessTime": 1663522874,
    "result": {
        "status": {
            "module": "",
            "code": 0,
            "eventName": "",
            "cause": "",
            "description": "",
            "posDescription": "",
            "errorInfo": {
                "errorCode": 0,
                "errorResponses": [
                   
                ]
            }
        }
    }
}
```


***Status Code:*** 400

<br>



### 4. SET SYSTEMPROPERTY


This API is used to set the system rebuild performance impact. User can set low, medium or high level for the performance impact


***Endpoint:***

```bash
Method: POST
Type: RAW
URL: http://{{host}}/api/ibofos/v1/system/property
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
        "level": "medium"
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



##### I. Example Response: Success
```js
{
    "rid": "d8172a44-3779-11ed-8c02-3cecef280244",
    "lastSuccessTime": 0,
    "result": {
        "status": {
            "module": "",
            "code": 0,
            "eventName": "SUCCESS",
            "cause": "NONE",
            "description": "NONE",
            "posDescription": "NONE",
            "solution": "NONE"
        }
    },
    "info": {
        "version": "v0.11.0-rc6"
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
    "rid": "96b954b1-3779-11ed-8c02-3cecef280244",
    "lastSuccessTime": 0,
    "result": {
        "status": {
            "module": "",
            "code": 0,
            "eventName": "SUCCESS",
            "cause": "NONE",
            "description": "NONE",
            "posDescription": "NONE",
            "solution": "NONE"
        },
        "data": {
            "baseboardManufacturer": "Supermicro",
            "baseboardProductName": "X11DPU",
            "baseboardSerialNumber": "OM202S018522",
            "baseboardVersion": "1.10",
            "biosReleaseDate": "02/21/2020",
            "biosVendor": "American Megatrends Inc.",
            "biosVersion": "3.3",
            "processorFrequency": "2400 MHz2400 MHz",
            "processorManufacturer": "Intel(R) CorporationIntel(R) Corporation",
            "processorVersion": "Intel(R) Xeon(R) Silver 4214R CPU @ 2.40GHzIntel(R) Xeon(R) Silver 4214R CPU @ 2.40GHz",
            "systemManufacturer": "Supermicro",
            "systemProductName": "SYS-2029U-TN24R4T",
            "systemSerialNumber": "A264025X0A04015",
            "systemUuid": "00000000-0000-0000-0000-AC1F6BC86358",
            "version": "v0.11.0-rc6"
        }
    },
    "info": {
        "version": "v0.11.0-rc6"
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
    "rid": "619782d1-bad3-4dc3-8202-ab4b43144610",
    "lastSuccessTime": 1656005726,
    "result": {
        "status": {
            "module": "COMMON",
            "code": 0,
            "level": "INFO",
            "description": "Ibof connection error",
            "posDescription": ""
        },
        "data": {
            "version": "v0.11.0-rc5"
        }
    },
    "info": {
        "version": "v0.11.0-rc5"
    }
}
```


***Status Code:*** 400

<br>



## Telemetry



### 1. GET TELEMETRY PROPERTIES PATH



***Endpoint:***

```bash
Method: GET
Type: RAW
URL: http://{{host}}/api/ibofos/v1/telemetry/properties/path
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
    "rid": "22d7d70e-3a9c-11ed-9d8b-3cecef280244",
    "lastSuccessTime": 0,
    "result": {
        "status": {
            "module": "",
            "code": 0,
            "eventName": "SUCCESS",
            "cause": "NONE",
            "description": "NONE",
            "posDescription": "NONE",
            "solution": "NONE"
        },
        "data": {
            "publicationListPath": "/usr/local/dagent/telemetry_config.yaml",
            "status": true
        }
    },
    "info": {
        "version": "v0.11.0-rc6"
    }
}
```


***Status Code:*** 200

<br>



### 2. SET TELEMETRY PROPERTIES PATH



***Endpoint:***

```bash
Method: POST
Type: RAW
URL: http://{{host}}/api/ibofos/v1/telemetry/properties/path
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
        "publicationListPath": "/usr/local/dagent/telemetry_config.yaml"
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



##### I. Example Response: Success
```js
{
    "rid": "17dee8f4-377c-11ed-8c02-3cecef280244",
    "lastSuccessTime": 0,
    "result": {
        "status": {
            "module": "",
            "code": 0,
            "eventName": "SUCCESS",
            "cause": "NONE",
            "description": "NONE",
            "posDescription": "NONE",
            "solution": "NONE"
        }
    },
    "info": {
        "version": "v0.11.0-rc6"
    }
}
```


***Status Code:*** 200

<br>



### 3. START TELEMETRY



***Endpoint:***

```bash
Method: POST
Type: RAW
URL: http://{{host}}/api/ibofos/v1/telemetry
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
    "rid": "17dee8f4-377c-11ed-8c02-3cecef280244",
    "lastSuccessTime": 0,
    "result": {
        "status": {
            "module": "",
            "code": 0,
            "eventName": "SUCCESS",
            "cause": "NONE",
            "description": "NONE",
            "posDescription": "NONE",
            "solution": "NONE"
        }
    },
    "info": {
        "version": "v0.11.0-rc6"
    }
}
```


***Status Code:*** 200

<br>



### 4. STOP TELEMETRY



***Endpoint:***

```bash
Method: DELETE
Type: 
URL: http://{{host}}/api/ibofos/v1/telemetry
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
    "rid": "1d7957e3-377c-11ed-8c02-3cecef280244",
    "lastSuccessTime": 0,
    "result": {
        "status": {
            "module": "",
            "code": 0,
            "eventName": "SUCCESS",
            "cause": "NONE",
            "description": "NONE",
            "posDescription": "NONE",
            "solution": "NONE"
        }
    },
    "info": {
        "version": "v0.11.0-rc6"
    }
}
```


***Status Code:*** 200

<br>



## Volume



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
        "size": 5242880,
        "maxbw": 0,
        "maxiops": 0,
        "subnqn": "nqn.2019-04.pos:subsystem1"
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
        "array": "{{arrayName}}",
        "name": "vol01",
        "size": 4194304,
        "maxbw": 0,
        "maxiops": 0
    }
}
```



##### I. Example Response: Success
```js
{
    "rid": "9907a1a1-67f2-11ed-9c8f-0cc47a3a4522",
    "lastSuccessTime": 0,
    "result": {
        "status": {
            "module": "",
            "code": 0,
            "eventName": "SUCCESS",
            "cause": "NONE",
            "description": "NONE",
            "posDescription": "NONE",
            "solution": "NONE"
        },
        "data": {}
    },
    "info": {
        "version": "v0.12.0-rc3"
    }
}
```


***Status Code:*** 200

<br>



##### II. Example Request: Fail - 1810


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



##### II. Example Response: Fail - 1810
```js
{
    "rid": "e8a4a62f-727c-4c58-ad3c-141d42f6c2a0",
    "lastSuccessTime": 1656017567,
    "result": {
        "status": {
            "module": "VolumeManager",
            "code": 2022,
            "level": "WARN",
            "description": "Volume name is duplicated",
            "posDescription": "failed to create vol01",
            "problem": "A volume with a duplicate name already exists",
            "solution": "Enter a different volume name"
        }
    },
    "info": {
        "version": "v0.11.0-rc5"
    }
}
```


***Status Code:*** 400

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
        "name": "volume-",
        "size": 5242880,
        "maxbw": 0,
        "maxiops": 0,
        "totalcount": 2,
        "stoponerror": false,
        "namesuffix": 0,
        "mountall": true,
        "subnqn": "nqn.2019-04.pos:subsystem1"
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
        "array": "{{arrayName}}",
        "name": "vol01",
        "size": 4194304,
        "maxbw": 0,
        "maxiops": 0
    }
}
```



##### I. Example Response: Success
```js
{
    "rid": "",
    "lastSuccessTime": 0,
    "result": {
        "status": {
            "module": "D-Agent",
            "code": 10202,
            "level": "INFO",
            "description": "Request Accepted and passed to POS",
            "posDescription": ""
        }
    }
}
```


***Status Code:*** 200

<br>



### 3. DELETE VOLUME



***Endpoint:***

```bash
Method: DELETE
Type: RAW
URL: http://{{host}}/api/ibofos/v1/volumes/vol01
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
    "rid": "1b657da2-67f3-11ed-9c8f-0cc47a3a4522",
    "lastSuccessTime": 0,
    "result": {
        "status": {
            "module": "",
            "code": 0,
            "eventName": "SUCCESS",
            "cause": "NONE",
            "description": "NONE",
            "posDescription": "NONE",
            "solution": "NONE"
        }
    },
    "info": {
        "version": "v0.12.0-rc3"
    }
}
```


***Status Code:*** 200

<br>



##### II. Example Request: Fail - 1807


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



##### II. Example Response: Fail - 1807
```js
{
    "rid": "81ba7e14-67f2-11ed-9c8f-0cc47a3a4522",
    "lastSuccessTime": 0,
    "result": {
        "status": {
            "module": "",
            "code": 1807,
            "eventName": "VOL_NOT_FOUND",
            "cause": "The volume of the requested name or ID could not be found",
            "description": "Failed to find a volume.",
            "posDescription": "Failed to find a volume.",
            "solution": "Please check volume name or ID and try again"
        }
    },
    "info": {
        "version": "v0.12.0-rc3"
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
URL: http://{{host}}/api/ibofos/v1/volumelist/POSArray
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
    "rid": "ee3a0da3-b289-45b6-8bda-85fdb8985add",
    "lastSuccessTime": 1663523892,
    "result": {
        "status": {
            "module": "",
            "code": 0,
            "description": "list of volumes in POSArray",
            "posDescription": "list of volumes in POSArray",
            "solution": "NONE"
        },
        "data": {
            "volumes": [
                {
                    "index": 0,
                    "maxbw": 0,
                    "maxiops": 0,
                    "minbw": 0,
                    "miniops": 0,
                    "name": "pvc-2c7aaefd-e2d5-4851-b3f1-2d93a93ea8f0",
                    "status": "Unmounted",
                    "total": 5368709120,
                    "uuid": "55175127-2284-48b5-b67a-14d6273677d4"
                },
                {
                    "index": 1,
                    "maxbw": 0,
                    "maxiops": 0,
                    "minbw": 0,
                    "miniops": 0,
                    "name": "vol01",
                    "status": "Unmounted",
                    "total": 5242880,
                    "uuid": "ce6242a6-1231-4fbf-b96a-bb3d05e9c21a"
                }
            ]
        }
    },
    "info": {
        "version": "v0.11.0-rc6"
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
URL: http://{{host}}/api/ibofos/v1/volumes/vol01/mount
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
        "subnqn": "nqn.2019-04.pos:subsystem1"
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
        "array": "{{arrayName}}", 
        "name": "vol01",
        "subnqn": "nqn.2019-04.pos:subsystem1"
    }
}
```



##### I. Example Response: Success
```js
{
    "rid": "046c359e-d958-4ed2-b060-7a1805d39c54",
    "lastSuccessTime": 1668852494,
    "result": {
        "status": {
            "module": "",
            "code": 0,
            "description": "vol01 has been mounted successfully.",
            "posDescription": "vol01 has been mounted successfully.",
            "solution": "NONE"
        }
    },
    "info": {
        "version": "v0.12.0-rc3"
    }
}
```


***Status Code:*** 200

<br>



##### II. Example Request: Fail - 1843


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
        "subnqn": "nqn.2019-04.pos:subsystem1"
    }
}
```



##### II. Example Response: Fail - 1843
```js
{
    "rid": "f5543c1b-806b-4a3f-bfe9-e65e5f7c8941",
    "lastSuccessTime": 1668852854,
    "result": {
        "status": {
            "module": "",
            "code": 1843,
            "description": "failed to mount vol01",
            "posDescription": "failed to mount vol01",
            "solution": "Check the status of the volume in the volume list."
        }
    },
    "info": {
        "version": "v0.12.0-rc3"
    }
}
```


***Status Code:*** 400

<br>



### 6. MOUNT VOLUME WITH SUBSYSTEM



***Endpoint:***

```bash
Method: POST
Type: RAW
URL: http://{{host}}/api/ibofos/v1/volumes/vol01/mount/subsystem
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
        "subnqn": "nqn.2019-04.pos:subsystem9",
        "transport_type":"tcp",
        "target_address":"107.108.221.146",
        "transport_service_id":"1158"
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
        "array": "{{arrayName}}",
        "subnqn": "nqn.2019-04.pos:subsystem9",
        "transport_type":"tcp",
        "target_address":"107.108.221.146",
        "transport_service_id":"1158"
    }
}
```



##### I. Example Response: Success
```js
{
    "rid": "",
    "lastSuccessTime": 0,
    "result": {
        "status": {
            "module": "COMMON",
            "code": 0,
            "level": "INFO",
            "description": "Success",
            "posDescription": "",
            "errorInfo": {
                "errorCode": 0,
                "errorResponses": [
                    {
                        "code": 0,
                        "description": "Subsystem ( nqn.2019-04.pos:subsystem9 ) has been created.",
                        "id": "SubSystemAuto"
                    },
                    {
                        "code": 0,
                        "description": "Address ( 107.108.83.97 ) added to Subsystem ( nqn.2019-04.pos:subsystem9 )",
                        "id": "AddListener"
                    },
                    {
                        "code": 0,
                        "description": "vol01 is mounted successfully",
                        "id": "MountVolume"
                    }
                ]
            }
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



***Body:***

```js        
{
    "param": {
        "array": "{{arrayName}}",
        "subnqn": "nqn.2019-04.pos:subsystem9",
        "transport_type":"tcp",
        "target_address":"107.108.221.146",
        "transport_service_id":"1158"
    }
}
```



##### II. Example Response: Fail
```js
{
    "rid": "",
    "lastSuccessTime": 0,
    "result": {
        "status": {
            "module": "COMMON",
            "code": 0,
            "level": "INFO",
            "description": "Success",
            "posDescription": "",
            "errorInfo": {
                "errorCode": 1,
                "errorResponses": [
                    {
                        "code": 0,
                        "description": "Subsystem ( nqn.2019-04.pos:subsystem9 ) has been created.",
                        "id": "SubSystemAuto"
                    },
                    {
                        "code": 0,
                        "description": "Address ( 107.108.221.146 ) added to Subsystem ( nqn.2019-04.pos:subsystem9 )",
                        "id": "AddListener"
                    },
                    {
                        "code": 2070,
                        "description": "failed to mount vol(code:2070)",
                        "id": "MountVolume"
                    }
                ]
            }
        }
    }
}
```


***Status Code:*** 207

<br>



### 7. QOS CREATE VOLUME POLICIES



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
        "maxbw": 400,
        "maxiops":300,
        "miniops":10
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
        "array": "{{arrayName}}",
		"vol":[{"volumeName":"vol"}],
        "maxbw": 8096000,
        "maxiops": 30,
        "miniops": 10
    }
}
```



##### I. Example Response: Success
```js
{
    "rid": "b357cc24-d88c-4d9a-9d68-f4b470d14adf",
    "lastSuccessTime": 1656017706,
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
        "version": "v0.11.0-rc5"
    }
}
```


***Status Code:*** 200

<br>



### 8. QOS LIST VOLUME POLICIES



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
        "array": "{{arrayName}}",
		"vol":[{"volumeName":"vol"}]
    }
}
```



##### I. Example Response: Success
```js
{
    "rid": "662809e0-dbac-4a5a-b51b-2f00b30ace56",
    "lastSuccessTime": 1656017733,
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
                    "rebuild": "highest"
                }
            ],
            "volumePolicies": [
                {
                    "id": 2,
                    "maxbw": 400,
                    "maxiops": 300,
                    "min_bw_guarantee": "No",
                    "min_iops_guarantee": "Yes",
                    "minbw": 0,
                    "miniops": 10,
                    "name": "volume-0"
                }
            ]
        }
    },
    "info": {
        "version": "v0.11.0-rc5"
    }
}
```


***Status Code:*** 200

<br>



### 9. QOS RESET VOLUME POLICIES



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
        "array": "{{arrayName}}",
		"vol":[{"volumeName":"vol"}]
    }
}
```



##### I. Example Response: Success
```js
{
    "rid": "32510b68-a89c-4342-9f63-a60e6069a36a",
    "lastSuccessTime": 1656017756,
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
        "version": "v0.11.0-rc5"
    }
}
```


***Status Code:*** 200

<br>



### 10. RENAME VOLUME



***Endpoint:***

```bash
Method: PATCH
Type: RAW
URL: http://{{host}}/api/ibofos/v1/volumes/vol01
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
        "array": "{{arrayName}}",
        "newname": "newvol01"
    }
}
```



##### I. Example Response: Success
```js
{
    "rid": "3b256c5a-345b-470b-83e0-d2b6cb67edbc",
    "lastSuccessTime": 1663523956,
    "result": {
        "status": {
            "module": "",
            "code": 0,
            "description": "vol01 is renamed successfully to newvol01",
            "posDescription": "vol01 is renamed successfully to newvol01",
            "solution": "NONE"
        }
    },
    "info": {
        "version": "v0.11.0-rc6"
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
        "array": "{{arrayName}}",
        "newname": "newvol01"
    }
}
```



##### II. Example Response: Fail - 2010
```js
{
    "rid": "d7dc1e69-4d3a-4962-8c75-63066ddde98d",
    "lastSuccessTime": 1656017797,
    "result": {
        "status": {
            "module": "VolumeManager",
            "code": 2010,
            "level": "WARN",
            "description": "The requested volume does not exist",
            "posDescription": "failed to rename vol01 to newvol01(code:2010)",
            "problem": "The volume with the requested volume name or volume ID does not exist",
            "solution": "Enter the correct volume name or volume ID after checking the volume list"
        }
    },
    "info": {
        "version": "v0.11.0-rc5"
    }
}
```


***Status Code:*** 400

<br>



### 11. UNMOUNT VOLUME



***Endpoint:***

```bash
Method: DELETE
Type: RAW
URL: http://{{host}}/api/ibofos/v1/volumes/vol01/mount
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
    "rid": "2ca1b19e-67f2-11ed-9c8f-0cc47a3a4522",
    "lastSuccessTime": 0,
    "result": {
        "status": {
            "module": "",
            "code": 0,
            "eventName": "SUCCESS",
            "cause": "NONE",
            "description": "NONE",
            "posDescription": "NONE",
            "solution": "NONE"
        }
    },
    "info": {
        "version": "v0.12.0-rc3"
    }
}
```


***Status Code:*** 200

<br>



##### II. Example Request: Fail - 1807


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



##### II. Example Response: Fail - 1807
```js
{
    "rid": "5324b2a5-67f2-11ed-9c8f-0cc47a3a4522",
    "lastSuccessTime": 0,
    "result": {
        "status": {
            "module": "",
            "code": 1807,
            "eventName": "VOL_NOT_FOUND",
            "cause": "The volume of the requested name or ID could not be found",
            "description": "Failed to find a volume.",
            "posDescription": "Failed to find a volume.",
            "solution": "Please check volume name or ID and try again"
        }
    },
    "info": {
        "version": "v0.12.0-rc3"
    }
}
```


***Status Code:*** 400

<br>



### 12. VOLUME INFO



***Endpoint:***

```bash
Method: GET
Type: RAW
URL: http://{{host}}/api/ibofos/v1/array/POSArray/volume/vol01
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
    "rid": "2e6c6a11-2398-4140-8bc3-63d414e1dc01",
    "lastSuccessTime": 1668852800,
    "result": {
        "status": {
            "module": "",
            "code": 0,
            "description": "information of volume: vol01 of array: POSArray",
            "posDescription": "information of volume: vol01 of array: POSArray",
            "solution": "NONE"
        },
        "data": {
            "array_name": "POSArray",
            "maxbw": 0,
            "maxiops": 0,
            "minbw": 0,
            "miniops": 0,
            "name": "vol01",
            "status": "Unmounted",
            "subnqn": "",
            "total": 5242880,
            "uuid": "b5a5d712-797c-4917-8e63-f02de850d139"
        }
    },
    "info": {
        "version": "v0.12.0-rc3"
    }
}
```


***Status Code:*** 200

<br>



***Available Variables:***

| Key | Value | Type |
| --- | ------|-------------|
| deviceName1 | unvme-ns-0 | string |
| deviceName2 | unvme-ns-1 | string |
| deviceName3 | unvme-ns-2 | string |
| deviceName4 | unvme-ns-3 | string |
| volumeName1 | vol01 | string |
| volumeName2 | vol02 | string |
| volumeNameNew1 | volNew01 | string |
| period | 5m | string |
| arrayName | POSArray | string |
| volid01 | 1 | string |
| deviceName5 | unvme-ns-4 | string |
| deviceName6 | unvme-ns-5 | string |
| deviceName7 | unvme-ns-6 | string |
| deviceName8 | unvme-ns-7 | string |



---
[Back to top](#d-agent)
> Made with &#9829; by [thedevsaddam](https://github.com/thedevsaddam) | Generated at: 2022-11-19 07:08:08 by [docgen](https://github.com/thedevsaddam/docgen)
