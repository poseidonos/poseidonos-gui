
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
  * [REMOVE DEVICE](#12-remove-device)

* [Common](#common)

  * [Template Dummy](#1-template-dummy)

* [D-Agent](#d-agent)

  * [HEARTBEAT](#1-heartbeat)
  * [VERSION](#2-version)

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

* [Metric](#metric)

  * [CPU](#1-cpu)
  * [CPU with PERIOD](#2-cpu-with-period)
  * [MEMORY](#3-memory)
  * [MEMORY with PERIOD](#4-memory-with-period)
  * [NETWORK](#5-network)
  * [NETWORK with PERIOD](#6-network-with-period)
  * [READ BW](#7-read-bw)
  * [READ BW with PERIOD](#8-read-bw-with-period)
  * [READ IOPS](#9-read-iops)
  * [READ IOPS with PERIOD](#10-read-iops-with-period)
  * [READ LATENCY](#11-read-latency)
  * [READ LATENCY with PERIOD](#12-read-latency-with-period)
  * [VOL READ BW](#13-vol-read-bw)
  * [VOL READ BW with PERIOD](#14-vol-read-bw-with-period)
  * [VOL READ IOPS](#15-vol-read-iops)
  * [VOL READ IOPS with PERIOD](#16-vol-read-iops-with-period)
  * [VOL READ LATENCY](#17-vol-read-latency)
  * [VOL READ LATENCY with PERIOD](#18-vol-read-latency-with-period)
  * [VOL WRITE BW](#19-vol-write-bw)
  * [VOL WRITE BW with PERIOD](#20-vol-write-bw-with-period)
  * [VOL WRITE IOPS](#21-vol-write-iops)
  * [VOL WRITE IOPS with PERIOD](#22-vol-write-iops-with-period)
  * [VOL WRITE LATENCY](#23-vol-write-latency)
  * [VOL WRITE LATENCY with PERIOD](#24-vol-write-latency-with-period)
  * [WRITE BW](#25-write-bw)
  * [WRITE BW with PERIOD](#26-write-bw-with-period)
  * [WRITE IOPS](#27-write-iops)
  * [WRITE IOPS with PERIOD](#28-write-iops-with-period)
  * [WRITE LATENCY](#29-write-latency)
  * [WRITE LATENCY with PERIOD](#30-write-latency-with-period)

* [Subsystem](#subsystem)

  * [ADD LISTENER](#1-add-listener)
  * [CREATE SUBSYSTEM](#2-create-subsystem)
  * [CREATE TRANSPORT](#3-create-transport)
  * [DELETE SUBSYSTEM](#4-delete-subsystem)
  * [LIST SUBSYSTEM](#5-list-subsystem)

* [System](#system)

  * [EXITIBOFOS](#1-exitibofos)
  * [RUNIBOFOS](#2-runibofos)
  * [iBOFOSINFO](#3-ibofosinfo)

* [Telemetry](#telemetry)

  * [START TELEMETRY](#1-start-telemetry)
  * [STOP TELEMETRY](#2-stop-telemetry)

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
        "state": "OFFLINE",
        "situation": "DEFAULT",
        "rebulidingProgress": 0,
        "capacity": 0,
        "used": 0
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
        "state": "OFFLINE",
        "situation": "DEFAULT",
        "rebulidingProgress": 0,
        "capacity": 0,
        "used": 0
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
        "num_data" : 3,
        "num_spare" : 1
    }
}

```



***More example Requests/Responses:***


##### I. Example Request: Fail - 2504


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



##### I. Example Response: Fail - 2504
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


##### I. Example Request: Fail - 2504


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



##### I. Example Response: Fail - 2504
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



##### II. Example Response: Success
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


***Status Code:*** 200

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



### 12. REMOVE DEVICE



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
        "array": "{{arrayName}}"
    }
}
```



##### I. Example Response: Fail - 2501
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



### 1. HEARTBEAT


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
    "rid": "e293a396-2e39-4500-893c-0a17635dcc5f",
    "lastSuccessTime": 1650355492,
    "result": {
        "status": {
            "module": "COMMON",
            "code": 0,
            "level": "INFO",
            "description": "Success",
            "posDescription": "DONE"
        }
    },
    "info": {
        "version": "v0.10.6"
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
    "rid": "cfa88181-8b96-48c1-b473-2ca45da5b01e",
    "lastSuccessTime": 1650358059,
    "result": {
        "status": {
            "module": "COMMON",
            "code": 0,
            "level": "INFO",
            "description": "Success",
            "posDescription": "Rebuilding of 'POSArray' is stopped"
        }
    },
    "info": {
        "version": "v0.10.6"
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
    "rid": "4a86bf3f-20b1-4b42-8ad5-c2b7d8f52f27",
    "lastSuccessTime": 1650355475,
    "result": {
        "status": {
            "module": "COMMON",
            "code": 0,
            "level": "INFO",
            "description": "Success",
            "posDescription": "DONE"
        }
    },
    "info": {
        "version": "v0.10.6"
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
    "param":{
        "name": "uram3",
		"num_blocks" : 8388608,
		"block_size" : 512,
		"dev_type" : "uram",
		"numa" : 0
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
    "rid": "2c96f80b-a996-42e6-81c5-f7baf3bd3292",
    "lastSuccessTime": 1650341763,
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
        "version": "v0.10.6"
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
    "rid": "7a405519-b7cb-4403-906b-8d876eaa9747",
    "lastSuccessTime": 1649847974,
    "result": {
        "status": {
            "module": "COMMON",
            "code": 0,
            "level": "INFO",
            "description": "Success",
            "posDescription": "ibofs logger info"
        },
        "data": {
            "filter_enabled": 0,
            "logfile_rotation_count": 20,
            "logfile_size_in_mb": 50,
            "major_log_path": "/var/log/pos/pos_major.log",
            "min_allowable_log_level": "info",
            "minor_log_path": "/var/log/pos/pos.log"
        }
    },
    "info": {
        "version": "v0.10.6"
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
    "rid": "0e3172f5-be18-4c36-b13b-02741784ce5a",
    "lastSuccessTime": 1649848045,
    "result": {
        "status": {
            "module": "COMMON",
            "code": 0,
            "level": "INFO",
            "description": "Success",
            "posDescription": "log level changed to info"
        }
    },
    "info": {
        "version": "v0.10.6"
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
    "rid": "0e3172f5-be18-4c36-b13b-02741784ce5a",
    "lastSuccessTime": 1649848045,
    "result": {
        "status": {
            "module": "COMMON",
            "code": 0,
            "level": "INFO",
            "description": "Success",
            "posDescription": "log level changed to info"
        }
    },
    "info": {
        "version": "v0.10.6"
    }
}
```


***Status Code:*** 200

<br>



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


***Status Code:*** 200

<br>



### 2. CPU with PERIOD



***Endpoint:***

```bash
Method: GET
Type: 
URL: http://{{host}}/api/metric/v1/cpu/15m
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


***Status Code:*** 200

<br>



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


***Status Code:*** 200

<br>



### 4. MEMORY with PERIOD



***Endpoint:***

```bash
Method: GET
Type: 
URL: http://{{host}}/api/metric/v1/memory/5m
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


***Status Code:*** 400

<br>



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


***Status Code:*** 200

<br>



### 6. NETWORK with PERIOD



***Endpoint:***

```bash
Method: GET
Type: 
URL: http://{{host}}/api/metric/v1/network/5m
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


***Status Code:*** 400

<br>



### 7. READ BW



***Endpoint:***

```bash
Method: GET
Type: 
URL: http://{{host}}/api/metric/v1/readbw/arrays
```


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| X-Request-Id | {{$guid}} |  |
| ts | {{$timestamp}} |  |
| Content-Type | application/json |  |
| Authorization | {{basic_auth}} |  |



***Query params:***

| Key | Value | Description |
| --- | ------|-------------|
| arrayids | 0 |  |
| time |  |  |



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


***Status Code:*** 200

<br>



### 8. READ BW with PERIOD



***Endpoint:***

```bash
Method: GET
Type: 
URL: http://{{host}}/api/metric/v1/readbw/arrays
```


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| X-Request-Id | {{$guid}} |  |
| ts | {{$timestamp}} |  |
| Content-Type | application/json |  |
| Authorization | {{basic_auth}} |  |



***Query params:***

| Key | Value | Description |
| --- | ------|-------------|
| arrayids | 0 |  |
| time | 5m |  |



***More example Requests/Responses:***


##### I. Example Request: Fail - 0 invalid time interval, empty response


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| X-Request-Id | {{$guid}} |  |
| ts | {{$timestamp}} |  |
| Content-Type | application/json |  |
| Authorization | {{basic_auth}} |  |



##### I. Example Response: Fail - 0 invalid time interval, empty response
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


***Status Code:*** 200

<br>



### 9. READ IOPS



***Endpoint:***

```bash
Method: GET
Type: 
URL: http://{{host}}/api/metric/v1/readiops/arrays
```


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| X-Request-Id | {{$guid}} |  |
| ts | {{$timestamp}} |  |
| Content-Type | application/json |  |
| Authorization | {{basic_auth}} |  |



***Query params:***

| Key | Value | Description |
| --- | ------|-------------|
| arrayids | 0 |  |
| time |  |  |



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


***Status Code:*** 200

<br>



### 10. READ IOPS with PERIOD



***Endpoint:***

```bash
Method: GET
Type: 
URL: http://{{host}}/api/metric/v1/readiops/arrays
```


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| X-Request-Id | {{$guid}} |  |
| ts | {{$timestamp}} |  |
| Content-Type | application/json |  |
| Authorization | {{basic_auth}} |  |



***Query params:***

| Key | Value | Description |
| --- | ------|-------------|
| arrayids | 0 |  |
| time | 5m |  |



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


***Status Code:*** 200

<br>



##### II. Example Request: Fail - 0 invalid time interval, empty response


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| X-Request-Id | {{$guid}} |  |
| ts | {{$timestamp}} |  |
| Content-Type | application/json |  |
| Authorization | {{basic_auth}} |  |



##### II. Example Response: Fail - 0 invalid time interval, empty response
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


***Status Code:*** 400

<br>



### 11. READ LATENCY



***Endpoint:***

```bash
Method: GET
Type: 
URL: http://{{host}}/api/metric/v1/readlatency/arrays
```


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| X-Request-Id | {{$guid}} |  |
| ts | {{$timestamp}} |  |
| Content-Type | application/json |  |
| Authorization | {{basic_auth}} |  |



***Query params:***

| Key | Value | Description |
| --- | ------|-------------|
| arrayids | 0 |  |
| time |  |  |



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


***Status Code:*** 200

<br>



### 12. READ LATENCY with PERIOD



***Endpoint:***

```bash
Method: GET
Type: 
URL: http://{{host}}/api/metric/v1/readlatency/arrays
```


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| X-Request-Id | {{$guid}} |  |
| ts | {{$timestamp}} |  |
| Content-Type | application/json |  |
| Authorization | {{basic_auth}} |  |



***Query params:***

| Key | Value | Description |
| --- | ------|-------------|
| arrayids | 0 |  |
| time | 5m |  |



***More example Requests/Responses:***


##### I. Example Request: Fail - 0 invalid time interval, empty response


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| X-Request-Id | {{$guid}} |  |
| ts | {{$timestamp}} |  |
| Content-Type | application/json |  |
| Authorization | {{basic_auth}} |  |



##### I. Example Response: Fail - 0 invalid time interval, empty response
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



### 13. VOL READ BW



***Endpoint:***

```bash
Method: GET
Type: 
URL: http://{{host}}/api/metric/v1/readbw/arrays/volumes
```


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| X-Request-Id | {{$guid}} |  |
| ts | {{$timestamp}} |  |
| Content-Type | application/json |  |
| Authorization | {{basic_auth}} |  |



***Query params:***

| Key | Value | Description |
| --- | ------|-------------|
| arrayids | 0 |  |
| volumeids | 0 |  |
| time |  |  |



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


***Status Code:*** 200

<br>



### 14. VOL READ BW with PERIOD



***Endpoint:***

```bash
Method: GET
Type: 
URL: http://{{host}}/api/metric/v1/readbw/arrays/volumes
```


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| X-Request-Id | {{$guid}} |  |
| ts | {{$timestamp}} |  |
| Content-Type | application/json |  |
| Authorization | {{basic_auth}} |  |



***Query params:***

| Key | Value | Description |
| --- | ------|-------------|
| arrayids | 0 |  |
| volumeids | 0 |  |
| time | 5m |  |



***More example Requests/Responses:***


##### I. Example Request: Fail - 0 invalid time interval, empty response


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| X-Request-Id | {{$guid}} |  |
| ts | {{$timestamp}} |  |
| Content-Type | application/json |  |
| Authorization | {{basic_auth}} |  |



##### I. Example Response: Fail - 0 invalid time interval, empty response
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


***Status Code:*** 200

<br>



### 15. VOL READ IOPS



***Endpoint:***

```bash
Method: GET
Type: 
URL: http://{{host}}/api/metric/v1/readiops/arrays/volumes
```


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| X-Request-Id | {{$guid}} |  |
| ts | {{$timestamp}} |  |
| Content-Type | application/json |  |
| Authorization | {{basic_auth}} |  |



***Query params:***

| Key | Value | Description |
| --- | ------|-------------|
| arrayids | 0 |  |
| volumeids | 0 |  |
| time |  |  |



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


***Status Code:*** 200

<br>



### 16. VOL READ IOPS with PERIOD



***Endpoint:***

```bash
Method: GET
Type: 
URL: http://{{host}}/api/metric/v1/readiops/arrays/volumes
```


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| X-Request-Id | {{$guid}} |  |
| ts | {{$timestamp}} |  |
| Content-Type | application/json |  |
| Authorization | {{basic_auth}} |  |



***Query params:***

| Key | Value | Description |
| --- | ------|-------------|
| arrayids | 0 |  |
| volumeids | 0 |  |
| time | 5m |  |



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


***Status Code:*** 200

<br>



##### II. Example Request: Fail - 0 invalid time interval, empty response


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| X-Request-Id | {{$guid}} |  |
| ts | {{$timestamp}} |  |
| Content-Type | application/json |  |
| Authorization | {{basic_auth}} |  |



##### II. Example Response: Fail - 0 invalid time interval, empty response
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


***Status Code:*** 200

<br>



### 17. VOL READ LATENCY



***Endpoint:***

```bash
Method: GET
Type: 
URL: http://{{host}}/api/metric/v1/readlatency/arrays/volumes
```


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| X-Request-Id | {{$guid}} |  |
| ts | {{$timestamp}} |  |
| Content-Type | application/json |  |
| Authorization | {{basic_auth}} |  |



***Query params:***

| Key | Value | Description |
| --- | ------|-------------|
| arrayids | 0 |  |
| volumeids | 0 |  |
| time |  |  |



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


***Status Code:*** 200

<br>



### 18. VOL READ LATENCY with PERIOD



***Endpoint:***

```bash
Method: GET
Type: 
URL: http://{{host}}/api/metric/v1/readlatency/arrays/volumes
```


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| X-Request-Id | {{$guid}} |  |
| ts | {{$timestamp}} |  |
| Content-Type | application/json |  |
| Authorization | {{basic_auth}} |  |



***Query params:***

| Key | Value | Description |
| --- | ------|-------------|
| arrayids | 0 |  |
| volumeids | 0 |  |
| time | 5m |  |



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


***Status Code:*** 200

<br>



##### II. Example Request: Fail - invalid time interval, empty response


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| X-Request-Id | {{$guid}} |  |
| ts | {{$timestamp}} |  |
| Content-Type | application/json |  |
| Authorization | {{basic_auth}} |  |



##### II. Example Response: Fail - invalid time interval, empty response
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


***Status Code:*** 400

<br>



### 19. VOL WRITE BW



***Endpoint:***

```bash
Method: GET
Type: 
URL: http://{{host}}/api/metric/v1/writebw/arrays/volumes
```


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| X-Request-Id | {{$guid}} |  |
| ts | {{$timestamp}} |  |
| Content-Type | application/json |  |
| Authorization | {{basic_auth}} |  |



***Query params:***

| Key | Value | Description |
| --- | ------|-------------|
| arrayids | 0 |  |
| volumeids | 0 |  |
| time |  |  |



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



### 20. VOL WRITE BW with PERIOD



***Endpoint:***

```bash
Method: GET
Type: 
URL: http://{{host}}/api/metric/v1/writebw/arrays/volumes
```


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| X-Request-Id | {{$guid}} |  |
| ts | {{$timestamp}} |  |
| Content-Type | application/json |  |
| Authorization | {{basic_auth}} |  |



***Query params:***

| Key | Value | Description |
| --- | ------|-------------|
| arrayids | 0 |  |
| volumeids | 0 |  |
| time | 5m |  |



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


***Status Code:*** 200

<br>



##### II. Example Request: Fail - 0 invalid time interval, empty response


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| X-Request-Id | {{$guid}} |  |
| ts | {{$timestamp}} |  |
| Content-Type | application/json |  |
| Authorization | {{basic_auth}} |  |



##### II. Example Response: Fail - 0 invalid time interval, empty response
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


***Status Code:*** 400

<br>



### 21. VOL WRITE IOPS



***Endpoint:***

```bash
Method: GET
Type: 
URL: http://{{host}}/api/metric/v1/writeiops/arrays/volumes
```


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| X-Request-Id | {{$guid}} |  |
| ts | {{$timestamp}} |  |
| Content-Type | application/json |  |
| Authorization | {{basic_auth}} |  |



***Query params:***

| Key | Value | Description |
| --- | ------|-------------|
| arrayids | 0 |  |
| volumeids | 0 |  |
| time |  |  |



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


***Status Code:*** 200

<br>



### 22. VOL WRITE IOPS with PERIOD



***Endpoint:***

```bash
Method: GET
Type: 
URL: http://{{host}}/api/metric/v1/writeiops/arrays/volumes
```


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| X-Request-Id | {{$guid}} |  |
| ts | {{$timestamp}} |  |
| Content-Type | application/json |  |
| Authorization | {{basic_auth}} |  |



***Query params:***

| Key | Value | Description |
| --- | ------|-------------|
| arrayids | 0 |  |
| volumeids | 0 |  |
| time | 5m |  |



***More example Requests/Responses:***


##### I. Example Request: Fail - 0 invalid time interval, empty response


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| X-Request-Id | {{$guid}} |  |
| ts | {{$timestamp}} |  |
| Content-Type | application/json |  |
| Authorization | {{basic_auth}} |  |



##### I. Example Response: Fail - 0 invalid time interval, empty response
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


***Status Code:*** 200

<br>



### 23. VOL WRITE LATENCY



***Endpoint:***

```bash
Method: GET
Type: 
URL: http://{{host}}/api/metric/v1/writelatency/arrays/volumes
```


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| X-Request-Id | {{$guid}} |  |
| ts | {{$timestamp}} |  |
| Content-Type | application/json |  |
| Authorization | {{basic_auth}} |  |



***Query params:***

| Key | Value | Description |
| --- | ------|-------------|
| arrayids | 0 |  |
| volumeids | 0 |  |
| time |  |  |



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


***Status Code:*** 200

<br>



### 24. VOL WRITE LATENCY with PERIOD



***Endpoint:***

```bash
Method: GET
Type: 
URL: http://{{host}}/api/metric/v1/writelatency/arrays/volumes
```


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| X-Request-Id | {{$guid}} |  |
| ts | {{$timestamp}} |  |
| Content-Type | application/json |  |
| Authorization | {{basic_auth}} |  |



***Query params:***

| Key | Value | Description |
| --- | ------|-------------|
| arrayids | 0 |  |
| volumeids | 0 |  |
| time | 5m |  |



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


***Status Code:*** 200

<br>



##### II. Example Request: Fail - invalid time interval, empty response


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| X-Request-Id | {{$guid}} |  |
| ts | {{$timestamp}} |  |
| Content-Type | application/json |  |
| Authorization | {{basic_auth}} |  |



##### II. Example Response: Fail - invalid time interval, empty response
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


***Status Code:*** 400

<br>



### 25. WRITE BW



***Endpoint:***

```bash
Method: GET
Type: 
URL: http://{{host}}/api/metric/v1/writebw/arrays
```


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| X-Request-Id | {{$guid}} |  |
| ts | {{$timestamp}} |  |
| Content-Type | application/json |  |
| Authorization | {{basic_auth}} |  |



***Query params:***

| Key | Value | Description |
| --- | ------|-------------|
| arrayids | 0 |  |
| time |  |  |



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


***Status Code:*** 200

<br>



### 26. WRITE BW with PERIOD



***Endpoint:***

```bash
Method: GET
Type: 
URL: http://{{host}}/api/metric/v1/writebw/arrays
```


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| X-Request-Id | {{$guid}} |  |
| ts | {{$timestamp}} |  |
| Content-Type | application/json |  |
| Authorization | {{basic_auth}} |  |



***Query params:***

| Key | Value | Description |
| --- | ------|-------------|
| arrayids | 0 |  |
| time | 5m |  |



***More example Requests/Responses:***


##### I. Example Request: Fail - 0 invalid time interval, empty response


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| X-Request-Id | {{$guid}} |  |
| ts | {{$timestamp}} |  |
| Content-Type | application/json |  |
| Authorization | {{basic_auth}} |  |



##### I. Example Response: Fail - 0 invalid time interval, empty response
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


***Status Code:*** 200

<br>



### 27. WRITE IOPS



***Endpoint:***

```bash
Method: GET
Type: 
URL: http://{{host}}/api/metric/v1/writeiops/arrays
```


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| X-Request-Id | {{$guid}} |  |
| ts | {{$timestamp}} |  |
| Content-Type | application/json |  |
| Authorization | {{basic_auth}} |  |



***Query params:***

| Key | Value | Description |
| --- | ------|-------------|
| arrayids | 0 |  |
| time |  |  |



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


***Status Code:*** 200

<br>



### 28. WRITE IOPS with PERIOD



***Endpoint:***

```bash
Method: GET
Type: 
URL: http://{{host}}/api/metric/v1/writeiops/arrays
```


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| X-Request-Id | {{$guid}} |  |
| ts | {{$timestamp}} |  |
| Content-Type | application/json |  |
| Authorization | {{basic_auth}} |  |



***Query params:***

| Key | Value | Description |
| --- | ------|-------------|
| arrayids | 0 |  |
| time | 5m |  |



***More example Requests/Responses:***


##### I. Example Request: Fail - 0 invalid time interval, empty response


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| X-Request-Id | {{$guid}} |  |
| ts | {{$timestamp}} |  |
| Content-Type | application/json |  |
| Authorization | {{basic_auth}} |  |



##### I. Example Response: Fail - 0 invalid time interval, empty response
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


***Status Code:*** 200

<br>



### 29. WRITE LATENCY



***Endpoint:***

```bash
Method: GET
Type: 
URL: http://{{host}}/api/metric/v1/writelatency/arrays
```


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| X-Request-Id | {{$guid}} |  |
| ts | {{$timestamp}} |  |
| Content-Type | application/json |  |
| Authorization | {{basic_auth}} |  |



***Query params:***

| Key | Value | Description |
| --- | ------|-------------|
| arrayids | 0 |  |
| time |  |  |



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


***Status Code:*** 200

<br>



### 30. WRITE LATENCY with PERIOD



***Endpoint:***

```bash
Method: GET
Type: 
URL: http://{{host}}/api/metric/v1/writelatency/arrays
```


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| X-Request-Id | {{$guid}} |  |
| ts | {{$timestamp}} |  |
| Content-Type | application/json |  |
| Authorization | {{basic_auth}} |  |



***Query params:***

| Key | Value | Description |
| --- | ------|-------------|
| arrayids | 0 |  |
| time | 5m |  |



***More example Requests/Responses:***


##### I. Example Request: Fail - 0 invalid time interval, empty response


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| X-Request-Id | {{$guid}} |  |
| ts | {{$timestamp}} |  |
| Content-Type | application/json |  |
| Authorization | {{basic_auth}} |  |



##### I. Example Response: Fail - 0 invalid time interval, empty response
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
        "name":"nqn.2019-04.pos:subsystem1",
        "transport_type":"tcp",
        "target_address":"107.108.83.97",
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
    "rid": "d21d51b0-7dd9-414f-83bb-cf7bf6a37bfc",
    "lastSuccessTime": 1650431247,
    "result": {
        "status": {
            "module": "COMMON",
            "code": 0,
            "level": "INFO",
            "description": "Success",
            "posDescription": "Address ( 107.108.221.146 ) added to Subsystem ( nqn.2019-04.pos:subsystem1 )"
        }
    },
    "info": {
        "version": "v0.11.0-rc1"
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
        "name":"nqn.2019-04.pos:subsystem1",
        "sn": "POS0000000003",
        "mn": "IBOF_VOLUME_EEEXTENSION",
        "max_namespaces": 256,
        "allow_any_host": true
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
        "name":"nqn.2019-04.pos:subsystem3",
        "sn": "POS0000000003",
        "mn": "IBOF_VOLUME_EEEXTENSION",
        "max_namespaces": 256,
        "allow_any_host": true
    }
}
```



##### I. Example Response: Success
```js
{
    "rid": "43cec6b0-9cf5-47a8-a2c3-de20cd508418",
    "lastSuccessTime": 1650431107,
    "result": {
        "status": {
            "module": "COMMON",
            "code": 0,
            "level": "INFO",
            "description": "Success",
            "posDescription": "Subsystem ( nqn.2019-04.pos:subsystem3 ) has been created."
        }
    },
    "info": {
        "version": "v0.11.0-rc1"
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
        "transport_type": "tcp",
        "buf_cache_size": 64,
        "num_shared_buf": 4096
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
    "rid": "c74be7e6-9a1e-414f-babb-cf7ea968b46c",
    "lastSuccessTime": 1650431042,
    "result": {
        "status": {
            "module": "",
            "code": -1,
            "description": "",
            "posDescription": "Failed to create transport. INTERNAL_ERROR: : Transport type 'tcp' already exists"
        }
    },
    "info": {
        "version": "v0.11.0-rc1"
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
        "name": "nqn.2019-04.pos:subsystem1"
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
    "rid": "d0ce17ae-1016-4c42-9c56-1f5f1fe59768",
    "lastSuccessTime": 1650431354,
    "result": {
        "status": {
            "module": "COMMON",
            "code": 0,
            "level": "INFO",
            "description": "Success",
            "posDescription": "Subsystem ( nqn.2019-04.pos:subsystem1) has been deleted."
        }
    },
    "info": {
        "version": "v0.11.0-rc1"
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
    "rid": "64360fbe-bec0-418a-bc45-712706fc5c72",
    "lastSuccessTime": 1650431291,
    "result": {
        "status": {
            "module": "COMMON",
            "code": 0,
            "level": "INFO",
            "description": "Success",
            "posDescription": "list of existing subsystems"
        },
        "data": {
            "subsystemlist": [
                {
                    "allow_any_host": 1,
                    "hosts": [],
                    "listen_addresses": [],
                    "nqn": "nqn.2014-08.org.nvmexpress.discovery",
                    "subtype": "Discovery"
                },
                {
                    "allow_any_host": 1,
                    "hosts": [],
                    "listen_addresses": [
                        {
                            "address_family": "IPv4",
                            "target_address": "107.108.221.146",
                            "transport_service_id": "1158",
                            "transport_type": "TCP"
                        }
                    ],
                    "max_namespaces": 256,
                    "model_number": "IBOF_VOLUME_EEEXTENSION",
                    "namespaces": [
                        {
                            "bdev_name": "bdev_0_POSArray",
                            "nsid": 1,
                            "uuid": "23c13962-1f47-4f8d-85ce-272850b15c26"
                        }
                    ],
                    "nqn": "nqn.2019-04.pos:subsystem1",
                    "serial_number": "POS0000000003",
                    "subtype": "NVMe"
                },
                {
                    "allow_any_host": 1,
                    "hosts": [],
                    "listen_addresses": [
                        {
                            "address_family": "IPv4",
                            "target_address": "107.108.221.146",
                            "transport_service_id": "1158",
                            "transport_type": "TCP"
                        }
                    ],
                    "max_namespaces": 256,
                    "model_number": "IBOF_VOLUME_EEEXTENSION",
                    "namespaces": [],
                    "nqn": "nqn.2019-04.pos:subsystem2",
                    "serial_number": "POS0000000003",
                    "subtype": "NVMe"
                },
                {
                    "allow_any_host": 1,
                    "hosts": [],
                    "listen_addresses": [
                        {
                            "address_family": "IPv4",
                            "target_address": "107.108.221.146",
                            "transport_service_id": "1158",
                            "transport_type": "TCP"
                        }
                    ],
                    "max_namespaces": 256,
                    "model_number": "POS_VOLUME_EXTENTION",
                    "namespaces": [
                        {
                            "bdev_name": "bdev_1_POSArray",
                            "nsid": 1,
                            "uuid": "96fd735d-c39e-4664-bb45-075eed5dfd88"
                        }
                    ],
                    "nqn": "nqn.2019-04.pos:subsystem9",
                    "serial_number": "POS00000000000009",
                    "subtype": "NVMe"
                },
                {
                    "allow_any_host": 1,
                    "hosts": [],
                    "listen_addresses": [],
                    "max_namespaces": 256,
                    "model_number": "IBOF_VOLUME_EEEXTENSION",
                    "namespaces": [],
                    "nqn": "nqn.2019-04.pos:subsystem3",
                    "serial_number": "POS0000000003",
                    "subtype": "NVMe"
                }
            ]
        }
    },
    "info": {
        "version": "v0.11.0-rc1"
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



### 2. RUNIBOFOS



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


***Status Code:*** 200

<br>



## Telemetry



### 1. START TELEMETRY



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
    "rid": "4a86bf3f-20b1-4b42-8ad5-c2b7d8f52f27",
    "lastSuccessTime": 1650355475,
    "result": {
        "status": {
            "module": "COMMON",
            "code": 0,
            "level": "INFO",
            "description": "Success",
            "posDescription": "DONE"
        }
    },
    "info": {
        "version": "v0.10.6"
    }
}
```


***Status Code:*** 200

<br>



### 2. STOP TELEMETRY



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
    "rid": "cfa88181-8b96-48c1-b473-2ca45da5b01e",
    "lastSuccessTime": 1650358059,
    "result": {
        "status": {
            "module": "COMMON",
            "code": 0,
            "level": "INFO",
            "description": "Success",
            "posDescription": "Rebuilding of 'POSArray' is stopped"
        }
    },
    "info": {
        "version": "v0.10.6"
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



##### II. Example Request: Fail - 2022


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



##### II. Example Response: Fail - 2022
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
        "totalcount": 5,
        "stoponerror": false,
        "namesuffix": 0,
        "mountall": true,
        "subnqn": "nqn.2019-04.pos:subsystem1"
    }
}
```



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
        "array": "{{arrayName}}"
    }
}
```



##### I. Example Response: Fail - 2010
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


***Status Code:*** 200

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
    "rid": "7128c77b-9751-4413-8657-2e634c735de2",
    "lastSuccessTime": 1650429907,
    "result": {
        "status": {
            "module": "COMMON",
            "code": 0,
            "level": "INFO",
            "description": "Success",
            "posDescription": "list of volumes in POSArray"
        },
        "data": {
            "volumes": [
                {
                    "id": 0,
                    "maxbw": 0,
                    "maxiops": 0,
                    "minbw": 0,
                    "miniops": 0,
                    "name": "vol",
                    "remain": 99999547392,
                    "status": "Mounted",
                    "total": 99999547392
                }
            ]
        }
    },
    "info": {
        "version": "v0.11.0-rc1"
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
        "name": "vol0",
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
        "array": "{{arrayName}}"
    }
}
```



##### I. Example Response: Success
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


***Status Code:*** 200

<br>



##### II. Example Request: Fail - 2040


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



##### II. Example Response: Fail - 2040
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
                        "description": "Requested volume will be mounted on Subsystem ( nqn.2019-04.pos:subsystem9 ).",
                        "id": "SubSystemAuto"
                    },
                    {
                        "code": 0,
                        "description": "Address ( 107.108.221.146 ) added to Subsystem ( nqn.2019-04.pos:subsystem9 )",
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
    "rid": "492ff554-4305-4bff-8694-d1f117b75f4a",
    "lastSuccessTime": 1650430193,
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
        "version": "v0.11.0-rc1"
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
    "rid": "d9001461-e6b6-479b-a2e2-ee6707fb04a3",
    "lastSuccessTime": 1650430325,
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
                    "id": 0,
                    "maxbw": 0,
                    "maxiops": 0,
                    "min_bw_guarantee": "No",
                    "min_iops_guarantee": "No",
                    "minbw": 0,
                    "miniops": 0,
                    "name": "vol"
                }
            ]
        }
    },
    "info": {
        "version": "v0.11.0-rc1"
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
    "rid": "4826af58-2408-4ea5-8769-2aee3f58c373",
    "lastSuccessTime": 1650430248,
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
        "version": "v0.11.0-rc1"
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


##### I. Example Request: Fail - 2041


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



##### I. Example Response: Fail - 2041
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


***Status Code:*** 200

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
    "rid": "e9a222ce-ec7b-4c2d-86a3-17253f189279",
    "lastSuccessTime": 1654195561,
    "result": {
        "status": {
            "module": "COMMON",
            "code": 0,
            "level": "INFO",
            "description": "Success",
            "posDescription": "information of volume: vol01 of array: POSArray"
        },
        "data": {
            "array_name": "POSArray",
            "maxbw": 0,
            "maxiops": 0,
            "minbw": 0,
            "miniops": 0,
            "name": "vol01",
            "remain": 9999220736,
            "status": "Mounted",
            "subnqn": "nqn.2019-04.pos:subsystem1",
            "total": 9999220736,
            "uuid": "d7314cde-dd74-48c0-b922-a2ed6f60179f"
        }
    },
    "info": {
        "version": "v0.11.0-rc5"
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
> Made with &#9829; by [thedevsaddam](https://github.com/thedevsaddam) | Generated at: 2022-06-21 05:13:29 by [docgen](https://github.com/thedevsaddam/docgen)
