
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
    "rid": "01f9694d-27df-47de-9876-e5dd1e193368",
    "lastSuccessTime": 1656017362,
    "result": {
        "status": {
            "module": "COMMON",
            "code": 0,
            "level": "INFO",
            "description": "Success",
            "posDescription": "POSArray information"
        },
        "data": {
            "capacity": 3385669032346,
            "create_datetime": "2022-06-24 02:17:35 +0530",
            "data_raid": "RAID5",
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
            "index": 0,
            "meta_raid": "RAID10",
            "name": "POSArray",
            "rebuilding_progress": 0,
            "situation": "NORMAL",
            "state": "NORMAL",
            "unique_id": 1933940387,
            "update_datetime": "2022-06-24 02:18:00 +0530",
            "used": 0,
            "write_through_enabled": true
        }
    },
    "info": {
        "version": "v0.11.0-rc5"
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
    "rid": "5d23e81e-cb21-49e9-a73c-84ced5914397",
    "lastSuccessTime": 1655976957,
    "result": {
        "status": {
            "module": "COMMON",
            "code": 0,
            "level": "INFO",
            "description": "Success",
            "posDescription": "POSArray is mounted successfully"
        }
    },
    "info": {
        "version": "v0.11.0-rc5"
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
    "rid": "5d23e81e-cb21-49e9-a73c-84ced5914397",
    "lastSuccessTime": 1655976957,
    "result": {
        "status": {
            "module": "COMMON",
            "code": 0,
            "level": "INFO",
            "description": "Success",
            "posDescription": "POSArray is mounted successfully"
        }
    },
    "info": {
        "version": "v0.11.0-rc5"
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
    "rid": "4b6284c0-8f38-4705-9cac-892fcea3c5a8",
    "lastSuccessTime": 1656005235,
    "result": {
        "status": {
            "module": "COMMON",
            "code": 0,
            "level": "INFO",
            "description": "Success",
            "posDescription": "POSArray has been unmounted successfully"
        }
    },
    "info": {
        "version": "v0.11.0-rc5"
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
    "rid": "36e6aae9-4d8b-45e7-81cf-318031dd7bf6",
    "lastSuccessTime": 1656005277,
    "result": {
        "status": {
            "module": "COMMON",
            "code": 0,
            "level": "INFO",
            "description": "Success",
            "posDescription": "POSArray1 has been unmounted successfully"
        }
    },
    "info": {
        "version": "v0.11.0-rc5"
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
    "rid": "d0d3a7d5-2b2c-4f72-be5b-82c4a5b2b3e8",
    "lastSuccessTime": 1656004793,
    "result": {
        "status": {
            "module": "COMMON",
            "code": 0,
            "level": "INFO",
            "description": "Success",
            "posDescription": "list of array and its devices "
        },
        "data": {
            "arrayList": [
                {
                    "capacity": 3385669032346,
                    "create_datetime": "2022-06-23 04:11:23 +0530",
                    "data_raid": "RAID5",
                    "index": 1,
                    "name": "POSArray",
                    "status": "Mounted",
                    "update_datetime": "2022-06-23 11:41:59 +0530",
                    "used": 15367929856,
                    "write_through_enabled": false
                },
                {
                    "capacity": 5078503548519,
                    "create_datetime": "2022-06-23 04:05:11 +0530",
                    "data_raid": "RAID0",
                    "index": 0,
                    "name": "POSArray1",
                    "status": "Mounted",
                    "update_datetime": "2022-06-23 11:42:55 +0530",
                    "used": 0,
                    "write_through_enabled": true
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
    "rid": "5b603248-70b7-4933-9253-922cd5fdb938",
    "lastSuccessTime": 1656017259,
    "result": {
        "status": {
            "module": "COMMON",
            "code": 0,
            "level": "INFO",
            "description": "Success",
            "posDescription": "POSArray has been created successfully"
        }
    },
    "info": {
        "version": "v0.11.0-rc5"
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



##### I. Example Response: Fail - 2502
```js
{
    "rid": "60b4cc7e-15e5-486a-a989-9b41598feabd",
    "lastSuccessTime": 1656017170,
    "result": {
        "status": {
            "module": "Array",
            "code": 2502,
            "level": "ERROR",
            "description": "Array already exists",
            "posDescription": "failed to create array POSArray"
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
            "description": "Success",
            "posDescription": "POSArray has been created successfully"
        }
    },
    "info": {
        "version": "v0.11.0-rc5"
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
    "lastSuccessTime": 1597829857,
    "result": {
        "status": {
            "module": "COMMON",
            "code": 0,
            "level": "INFO",
            "description": "Success",
            "posDescription": "POSArray has been created successfully"
        }
    },
    "info": {
        "version": "v0.11.0-rc5"
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
    "rid": "40a9a0fd-58cb-4c19-be34-28443a58d0b9",
    "lastSuccessTime": 1656005535,
    "result": {
        "status": {
            "module": "COMMON",
            "code": 0,
            "level": "INFO",
            "description": "Success",
            "posDescription": "POSArray has been deleted successfully"
        }
    },
    "info": {
        "version": "v0.11.0-rc5"
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
    "rid": "de6d9ad6-198a-4abb-9070-49317bdd01cb",
    "lastSuccessTime": 1656017473,
    "result": {
        "status": {
            "module": "COMMON",
            "code": 0,
            "level": "INFO",
            "description": "Success",
            "posDescription": "unvme-ns-3 is removed from POSArray successfully"
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
            "module": "D-Agent",
            "code": 12010,
            "level": "ERROR",
            "description": "one of iBoF service is dead",
            "posDescription": "one of iBoF service is dead"
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
    "rid": "129d72d0-aef4-4e11-92a8-733d40eff015",
    "lastSuccessTime": 1656018489,
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
        "version": "v0.11.0-rc5"
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
    "rid": "8d1cabb5-8d5c-4633-8a62-09fe0d1cdfc7",
    "lastSuccessTime": 1656018451,
    "result": {
        "status": {
            "module": "COMMON",
            "code": 0,
            "level": "INFO",
            "description": "Success",
            "posDescription": "Reset mbr done"
        },
        "data": {}
    },
    "info": {
        "version": "v0.11.0-rc5"
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
    "rid": "866036fb-65fc-46e9-ab31-7bafd4b7461b",
    "lastSuccessTime": 1656018517,
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
        "version": "v0.11.0-rc5"
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
    "rid": "d992e468-3375-402f-b1f9-199701f69006",
    "lastSuccessTime": 1656018467,
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
        "version": "v0.11.0-rc5"
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
        "num_blocks": 8388608,
        "block_size": 512,
        "dev_type": "uram",
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
    "rid": "4095dbf5-2207-4b90-b678-3be9649ab728",
    "lastSuccessTime": 1656005171,
    "result": {
        "status": {
            "module": "COMMON",
            "code": 0,
            "level": "INFO",
            "description": "Success",
            "posDescription": "Device has been created"
        }
    },
    "info": {
        "version": "v0.11.0-rc5"
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
    "rid": "602b5562-f939-4797-a9f6-c157358019b9",
    "lastSuccessTime": 1656017003,
    "result": {
        "status": {
            "module": "COMMON",
            "code": 0,
            "level": "INFO",
            "description": "Success",
            "posDescription": "list of existing devices"
        },
        "data": {
            "devicelist": [
                {
                    "addr": "0000:60:00.0",
                    "class": "ARRAY",
                    "mn": "SAMSUNG MZQLB1T9HAJR-00007              ",
                    "name": "unvme-ns-0",
                    "numa": "0",
                    "size": 1920383410176,
                    "sn": "S439NA0MB02505      ",
                    "type": "SSD"
                },
                {
                    "addr": "0000:61:00.0",
                    "class": "ARRAY",
                    "mn": "SAMSUNG MZQLB1T9HAJR-00007              ",
                    "name": "unvme-ns-1",
                    "numa": "0",
                    "size": 1920383410176,
                    "sn": "S439NA0MB02476      ",
                    "type": "SSD"
                },
                {
                    "addr": "0000:62:00.0",
                    "class": "ARRAY",
                    "mn": "SAMSUNG MZQLB1T9HAJR-00007              ",
                    "name": "unvme-ns-2",
                    "numa": "0",
                    "size": 1920383410176,
                    "sn": "S439NA0MB02503      ",
                    "type": "SSD"
                },
                {
                    "addr": "0000:63:00.0",
                    "class": "ARRAY",
                    "mn": "SAMSUNG MZQLB1T9HAJR-00007              ",
                    "name": "unvme-ns-3",
                    "numa": "0",
                    "size": 1920383410176,
                    "sn": "S439NA0MB02514      ",
                    "type": "SSD"
                },
                {
                    "addr": "0000:64:00.0",
                    "class": "ARRAY",
                    "mn": "SAMSUNG MZQLB1T9HAJR-00007              ",
                    "name": "unvme-ns-4",
                    "numa": "0",
                    "size": 1920383410176,
                    "sn": "S439NA0MB02492      ",
                    "type": "SSD"
                },
                {
                    "addr": "0000:65:00.0",
                    "class": "ARRAY",
                    "mn": "SAMSUNG MZQLB1T9HAJR-00007              ",
                    "name": "unvme-ns-5",
                    "numa": "0",
                    "size": 1920383410176,
                    "sn": "S439NA0MB02473      ",
                    "type": "SSD"
                },
                {
                    "addr": "0000:66:00.0",
                    "class": "ARRAY",
                    "mn": "SAMSUNG MZQLB1T9HAJR-00007              ",
                    "name": "unvme-ns-6",
                    "numa": "0",
                    "size": 1920383410176,
                    "sn": "S439NA0MB02490      ",
                    "type": "SSD"
                },
                {
                    "addr": "0000:67:00.0",
                    "class": "ARRAY",
                    "mn": "SAMSUNG MZQLB1T9HAJR-00007              ",
                    "name": "unvme-ns-7",
                    "numa": "0",
                    "size": 1920383410176,
                    "sn": "S439NA0MA02562      ",
                    "type": "SSD"
                },
                {
                    "addr": "0000:68:00.0",
                    "class": "SYSTEM",
                    "mn": "SAMSUNG MZQLB1T9HAJR-00007              ",
                    "name": "unvme-ns-8",
                    "numa": "0",
                    "size": 1920383410176,
                    "sn": "S439NA0MB02512      ",
                    "type": "SSD"
                },
                {
                    "addr": "0000:69:00.0",
                    "class": "SYSTEM",
                    "mn": "SAMSUNG MZQLB1T9HAJR-00007              ",
                    "name": "unvme-ns-9",
                    "numa": "0",
                    "size": 1920383410176,
                    "sn": "S439NA0MB02477      ",
                    "type": "SSD"
                },
                {
                    "addr": "0000:6a:00.0",
                    "class": "SYSTEM",
                    "mn": "SAMSUNG MZQLB1T9HAJR-00007              ",
                    "name": "unvme-ns-10",
                    "numa": "0",
                    "size": 1920383410176,
                    "sn": "S439NA0MB02483      ",
                    "type": "SSD"
                },
                {
                    "addr": "0000:6b:00.0",
                    "class": "SYSTEM",
                    "mn": "SAMSUNG MZQLB1T9HAJR-00007              ",
                    "name": "unvme-ns-11",
                    "numa": "0",
                    "size": 1920383410176,
                    "sn": "S439NA0MB02482      ",
                    "type": "SSD"
                },
                {
                    "addr": "0000:b1:00.0",
                    "class": "SYSTEM",
                    "mn": "SAMSUNG MZQLB1T9HAJR-00007              ",
                    "name": "unvme-ns-12",
                    "numa": "1",
                    "size": 1920383410176,
                    "sn": "S439NA0MB02465      ",
                    "type": "SSD"
                },
                {
                    "addr": "0000:b2:00.0",
                    "class": "SYSTEM",
                    "mn": "SAMSUNG MZQLB1T9HAJR-00007              ",
                    "name": "unvme-ns-13",
                    "numa": "1",
                    "size": 1920383410176,
                    "sn": "S439NA0MB02494      ",
                    "type": "SSD"
                },
                {
                    "addr": "0000:b3:00.0",
                    "class": "SYSTEM",
                    "mn": "SAMSUNG MZQLB1T9HAJR-00007              ",
                    "name": "unvme-ns-14",
                    "numa": "1",
                    "size": 1920383410176,
                    "sn": "S439NA0MB02484      ",
                    "type": "SSD"
                },
                {
                    "addr": "0000:b4:00.0",
                    "class": "SYSTEM",
                    "mn": "SAMSUNG MZQLB1T9HAJR-00007              ",
                    "name": "unvme-ns-15",
                    "numa": "1",
                    "size": 1920383410176,
                    "sn": "S439NA0MB02468      ",
                    "type": "SSD"
                },
                {
                    "addr": "0000:b5:00.0",
                    "class": "SYSTEM",
                    "mn": "SAMSUNG MZQLB1T9HAJR-00007              ",
                    "name": "unvme-ns-16",
                    "numa": "1",
                    "size": 1920383410176,
                    "sn": "S439NA0MB02466      ",
                    "type": "SSD"
                },
                {
                    "addr": "0000:b6:00.0",
                    "class": "SYSTEM",
                    "mn": "SAMSUNG MZQLB1T9HAJR-00007              ",
                    "name": "unvme-ns-17",
                    "numa": "1",
                    "size": 1920383410176,
                    "sn": "S439NA0MA02555      ",
                    "type": "SSD"
                },
                {
                    "addr": "0000:b7:00.0",
                    "class": "SYSTEM",
                    "mn": "SAMSUNG MZQLB1T9HAJR-00007              ",
                    "name": "unvme-ns-18",
                    "numa": "1",
                    "size": 1920383410176,
                    "sn": "S439NA0MB02491      ",
                    "type": "SSD"
                },
                {
                    "addr": "0000:b8:00.0",
                    "class": "SYSTEM",
                    "mn": "SAMSUNG MZQLB1T9HAJR-00007              ",
                    "name": "unvme-ns-19",
                    "numa": "1",
                    "size": 1920383410176,
                    "sn": "S439NA0MB02464      ",
                    "type": "SSD"
                },
                {
                    "addr": "0000:b9:00.0",
                    "class": "SYSTEM",
                    "mn": "SAMSUNG MZQLB1T9HAJR-00007              ",
                    "name": "unvme-ns-20",
                    "numa": "1",
                    "size": 1920383410176,
                    "sn": "S439NA0MB02469      ",
                    "type": "SSD"
                },
                {
                    "addr": "0000:ba:00.0",
                    "class": "SYSTEM",
                    "mn": "SAMSUNG MZQLB1T9HAJR-00007              ",
                    "name": "unvme-ns-21",
                    "numa": "1",
                    "size": 1920383410176,
                    "sn": "S439NA0MB02513      ",
                    "type": "SSD"
                },
                {
                    "addr": "0000:bb:00.0",
                    "class": "SYSTEM",
                    "mn": "SAMSUNG MZQLB1T9HAJR-00007              ",
                    "name": "unvme-ns-22",
                    "numa": "1",
                    "size": 1920383410176,
                    "sn": "S439NA0MB02485      ",
                    "type": "SSD"
                },
                {
                    "addr": "0000:bc:00.0",
                    "class": "SYSTEM",
                    "mn": "SAMSUNG MZQLB1T9HAJR-00007              ",
                    "name": "unvme-ns-23",
                    "numa": "1",
                    "size": 1920383410176,
                    "sn": "S439NA0MB02472      ",
                    "type": "SSD"
                },
                {
                    "addr": "",
                    "class": "ARRAY",
                    "mn": "uram0",
                    "name": "uram0",
                    "numa": "0",
                    "size": 4294967296,
                    "sn": "uram0",
                    "type": "NVRAM"
                },
                {
                    "addr": "",
                    "class": "ARRAY",
                    "mn": "uram1",
                    "name": "uram1",
                    "numa": "0",
                    "size": 4294967296,
                    "sn": "uram1",
                    "type": "NVRAM"
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
    "rid": "1216e563-72b6-4b37-8754-d71ea8949709",
    "lastSuccessTime": 1656005959,
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
        "version": "v0.11.0-rc5"
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
    "rid": "88b49d44-060f-40ad-a8b5-852dc0003f9b",
    "lastSuccessTime": 1656016984,
    "result": {
        "status": {
            "module": "COMMON",
            "code": 0,
            "level": "INFO",
            "description": "Success",
            "posDescription": "DONE"
        },
        "data": {
            "available_spare": "100%",
            "available_spare_space": "OK",
            "available_spare_threshold": "10%",
            "controller_busy_time": "886m",
            "critical_temperature_time": "0m",
            "current_temperature": "41C",
            "data_units_read": "37037838",
            "data_units_written": "48416164",
            "device_reliability": "OK",
            "host_read_commands": "633772250",
            "host_write_commands": "255651122",
            "life_percentage_used": "0%",
            "lifetime_error_log_entries": "139",
            "power_cycles": "142",
            "power_on_hours": "13434h",
            "read_only": "No",
            "temperature": "OK",
            "temperature_sensor1": "41C",
            "temperature_sensor2": "48C",
            "temperature_sensor3": "55C",
            "unrecoverable_media_errors": "0",
            "unsafe_shutdowns": "122",
            "volatile_memory_backup": "OK",
            "warning_temperature_time": "0m"
        }
    },
    "info": {
        "version": "v0.11.0-rc5"
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
    "rid": "81d1c6ed-0249-4eb4-a03f-6dca10dbafd1",
    "lastSuccessTime": 1656016204,
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
            "min_allowable_log_level": "debug",
            "minor_log_path": "/var/log/pos/pos.log",
            "structured_logging": false
        }
    },
    "info": {
        "version": "v0.11.0-rc5"
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
    "rid": "2fe16fb7-f27d-4e9a-b872-6b5fc4dc620e",
    "lastSuccessTime": 1656018594,
    "result": {
        "status": {
            "module": "COMMON",
            "code": 0,
            "level": "INFO",
            "description": "Success",
            "posDescription": "current log level"
        },
        "data": {
            "level": "debug"
        }
    },
    "info": {
        "version": "v0.11.0-rc5"
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
    "rid": "1e096ccd-b4cb-444e-82ee-4844f97114cb",
    "lastSuccessTime": 1656018579,
    "result": {
        "status": {
            "module": "COMMON",
            "code": 0,
            "level": "INFO",
            "description": "Success",
            "posDescription": "log level changed to debug"
        }
    },
    "info": {
        "version": "v0.11.0-rc5"
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
            "description": "Success",
            "posDescription": "Success"
        },
        "data": [
            [
                {
                    "time": 1687466099229187668,
                    "cpuUsagePercent": 10.922787197283993
                }
            ],
            [
                {
                    "startTime": 1656018679726049531,
                    "endTime": 1656018679726049531
                }
            ]
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
            "module": "M-Agent",
            "code": 21010,
            "level": "ERROR",
            "description": "Time parameter error",
            "posDescription": "Time parameter error",
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
            "description": "Success",
            "posDescription": "Success"
        },
        "data": [
            [
                {
                    "time": 1656017760000000000,
                    "cpuUsagePercent": 13.841175942528926
                },
                {
                    "time": 1656017820000000000,
                    "cpuUsagePercent": 13.996402559268665
                },
                {
                    "time": 1656017880000000000,
                    "cpuUsagePercent": 14.110407884289035
                },
                {
                    "time": 1656017940000000000,
                    "cpuUsagePercent": 13.975579096698404
                },
                {
                    "time": 1656018000000000000,
                    "cpuUsagePercent": 14.023956663880794
                },
                {
                    "time": 1656018060000000000,
                    "cpuUsagePercent": 13.427215283649103
                },
                {
                    "time": 1656018120000000000,
                    "cpuUsagePercent": 12.772797879551149
                },
                {
                    "time": 1656018180000000000,
                    "cpuUsagePercent": 12.753718764781272
                },
                {
                    "time": 1656018240000000000,
                    "cpuUsagePercent": 12.38281927702806
                },
                {
                    "time": 1656018300000000000,
                    "cpuUsagePercent": 12.084211341612463
                },
                {
                    "time": 1656018360000000000,
                    "cpuUsagePercent": 12.048966385434348
                },
                {
                    "time": 1656018420000000000,
                    "cpuUsagePercent": 12.886916570638887
                },
                {
                    "time": 1656018480000000000,
                    "cpuUsagePercent": 12.231366456081394
                },
                {
                    "time": 1656018540000000000,
                    "cpuUsagePercent": 11.694761742610918
                },
                {
                    "time": 1656018600000000000,
                    "cpuUsagePercent": 13.033791621356347
                },
                {
                    "time": 1656018660000000000,
                    "cpuUsagePercent": 11.626470362972542
                }
            ],
            [
                {
                    "startTime": 1656017807013210740,
                    "endTime": 1656018707013210740
                }
            ]
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
            "description": "Success",
            "posDescription": "Success"
        },
        "data": [
            [
                {
                    "time": 1687466100088619482,
                    "memoryUsagePercent": 27.034952106025116
                }
            ],
            [
                {
                    "startTime": 1656018753755909605,
                    "endTime": 1656018753755909605
                }
            ]
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
            "description": "Success",
            "posDescription": "Success"
        },
        "data": [
            [
                {
                    "time": 1656017820000000000,
                    "memoryUsagePercent": 26.991639320306824
                },
                {
                    "time": 1656017880000000000,
                    "memoryUsagePercent": 26.99194098312256
                },
                {
                    "time": 1656017940000000000,
                    "memoryUsagePercent": 26.992178520653024
                },
                {
                    "time": 1656018000000000000,
                    "memoryUsagePercent": 26.992523830074628
                },
                {
                    "time": 1656018060000000000,
                    "memoryUsagePercent": 26.99248732954309
                },
                {
                    "time": 1656018120000000000,
                    "memoryUsagePercent": 26.993367268853472
                },
                {
                    "time": 1656018180000000000,
                    "memoryUsagePercent": 26.99385380793468
                },
                {
                    "time": 1656018240000000000,
                    "memoryUsagePercent": 26.994682702053424
                },
                {
                    "time": 1656018300000000000,
                    "memoryUsagePercent": 26.99440764131999
                },
                {
                    "time": 1656018360000000000,
                    "memoryUsagePercent": 26.994104248800745
                },
                {
                    "time": 1656018420000000000,
                    "memoryUsagePercent": 26.991830812372537
                },
                {
                    "time": 1656018480000000000,
                    "memoryUsagePercent": 26.9916131853707
                },
                {
                    "time": 1656018540000000000,
                    "memoryUsagePercent": 26.992740939427975
                },
                {
                    "time": 1656018600000000000,
                    "memoryUsagePercent": 26.992876727465614
                },
                {
                    "time": 1656018660000000000,
                    "memoryUsagePercent": 26.99214824452897
                },
                {
                    "time": 1656018720000000000,
                    "memoryUsagePercent": 26.99231791703663
                }
            ],
            [
                {
                    "startTime": 1656017878966921736,
                    "endTime": 1656018778966921736
                }
            ]
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
            "module": "M-Agent",
            "code": 21010,
            "level": "ERROR",
            "description": "Time parameter error",
            "posDescription": "Time parameter error",
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
            "description": "Success",
            "posDescription": "Success"
        },
        "data": [
            [
                {
                    "time": 1656018815572780603,
                    "bytesRecv": 3268386390,
                    "bytesSent": 108173682,
                    "dropIn": 0,
                    "dropOut": 0,
                    "packetsRecv": 10932724,
                    "packetsSent": 637376
                }
            ],
            [
                {
                    "startTime": 1656018815572780603,
                    "endTime": 1656018815572780603
                }
            ]
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
            "description": "Success",
            "posDescription": "Success"
        },
        "data": [
            [
                {
                    "time": 1656017940000000000,
                    "bytesRecv": 1700793874.590909,
                    "bytesSent": 55324897,
                    "dropIn": 0,
                    "dropOut": 0,
                    "packetsRecv": 5691072.590909091,
                    "packetsSent": 325643
                },
                {
                    "time": 1656018000000000000,
                    "bytesRecv": 1700829221.9416666,
                    "bytesSent": 55325109.06666667,
                    "dropIn": 0,
                    "dropOut": 0,
                    "packetsRecv": 5691178.566666666,
                    "packetsSent": 325644.43333333335
                },
                {
                    "time": 1656018060000000000,
                    "bytesRecv": 1700866755.35,
                    "bytesSent": 55326684.06666667,
                    "dropIn": 0,
                    "dropOut": 0,
                    "packetsRecv": 5691320.983333333,
                    "packetsSent": 325653.9
                },
                {
                    "time": 1656018120000000000,
                    "bytesRecv": 1700895914.825,
                    "bytesSent": 55328478.583333336,
                    "dropIn": 0,
                    "dropOut": 0,
                    "packetsRecv": 5691431.55,
                    "packetsSent": 325664.44166666665
                },
                {
                    "time": 1656018180000000000,
                    "bytesRecv": 1700925554.2916667,
                    "bytesSent": 55330360.7,
                    "dropIn": 0,
                    "dropOut": 0,
                    "packetsRecv": 5691540.958333333,
                    "packetsSent": 325675.01666666666
                },
                {
                    "time": 1656018240000000000,
                    "bytesRecv": 1700975939.9237287,
                    "bytesSent": 55330797,
                    "dropIn": 0,
                    "dropOut": 0,
                    "packetsRecv": 5691701.381355932,
                    "packetsSent": 325677
                },
                {
                    "time": 1656018300000000000,
                    "bytesRecv": 1701035229.15,
                    "bytesSent": 55330797,
                    "dropIn": 0,
                    "dropOut": 0,
                    "packetsRecv": 5691874.741666666,
                    "packetsSent": 325677
                },
                {
                    "time": 1656018360000000000,
                    "bytesRecv": 1701093047.1,
                    "bytesSent": 55330797,
                    "dropIn": 0,
                    "dropOut": 0,
                    "packetsRecv": 5692043.8,
                    "packetsSent": 325677
                },
                {
                    "time": 1656018420000000000,
                    "bytesRecv": 1701138097.05,
                    "bytesSent": 55330797,
                    "dropIn": 0,
                    "dropOut": 0,
                    "packetsRecv": 5692175.525,
                    "packetsSent": 325677
                },
                {
                    "time": 1656018480000000000,
                    "bytesRecv": 1701175377.6833334,
                    "bytesSent": 55330945.35,
                    "dropIn": 0,
                    "dropOut": 0,
                    "packetsRecv": 5692285.3,
                    "packetsSent": 325678.025
                },
                {
                    "time": 1656018540000000000,
                    "bytesRecv": 1701213484.0833333,
                    "bytesSent": 55332559.78333333,
                    "dropIn": 0,
                    "dropOut": 0,
                    "packetsRecv": 5692422.591666667,
                    "packetsSent": 325687.375
                },
                {
                    "time": 1656018600000000000,
                    "bytesRecv": 1701246104.2583334,
                    "bytesSent": 55334590.25,
                    "dropIn": 0,
                    "dropOut": 0,
                    "packetsRecv": 5692548.025,
                    "packetsSent": 325698.425
                },
                {
                    "time": 1656018660000000000,
                    "bytesRecv": 1701276311.175,
                    "bytesSent": 55336818.083333336,
                    "dropIn": 0,
                    "dropOut": 0,
                    "packetsRecv": 5692659.4,
                    "packetsSent": 325710.05833333335
                },
                {
                    "time": 1656018720000000000,
                    "bytesRecv": 1701319464.2,
                    "bytesSent": 55337346,
                    "dropIn": 0,
                    "dropOut": 0,
                    "packetsRecv": 5692795.85,
                    "packetsSent": 325712.5
                },
                {
                    "time": 1656018780000000000,
                    "bytesRecv": 1701375865.7,
                    "bytesSent": 55337346,
                    "dropIn": 0,
                    "dropOut": 0,
                    "packetsRecv": 5692960.766666667,
                    "packetsSent": 325712.5
                },
                {
                    "time": 1656018840000000000,
                    "bytesRecv": 1701411034.7,
                    "bytesSent": 55337346,
                    "dropIn": 0,
                    "dropOut": 0,
                    "packetsRecv": 5693063.6,
                    "packetsSent": 325712.5
                }
            ],
            [
                {
                    "startTime": 1656017945075624573,
                    "endTime": 1656018845075624573
                }
            ]
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
            "module": "M-Agent",
            "code": 21010,
            "level": "ERROR",
            "description": "Time parameter error",
            "posDescription": "Time parameter error",
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
            "description": "Success",
            "posDescription": "Success"
        },
        "data": [
            [
                {
                    "bw": 80521028,
                    "time": 1656019213000000000
                }
            ],
            [
                {
                    "endTime": 1656019216998605689,
                    "startTime": 1656019216998605689
                }
            ]
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
| arrayids | 0 | Comma separated integers corresponding to the ids of array |
| time | 5m | Time period for which the Bandwidth should be queried |



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
            "module": "M-Agent",
            "code": 21010,
            "level": "ERROR",
            "description": "Time parameter error",
            "posDescription": "Time parameter error",
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
            "description": "Success",
            "posDescription": "Success"
        },
        "data": [
            [
                {
                    "bw": 790547.5,
                    "time": 1656019140000000000
                },
                {
                    "bw": 60586384,
                    "time": 1656019200000000000
                }
            ],
            [
                {
                    "endTime": 1656019242019678647,
                    "startTime": 1656018342019678647
                }
            ]
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
            "description": "Success",
            "posDescription": "Success"
        },
        "data": [
            [
                {
                    "iops": 592,
                    "time": 1656019638000000000
                }
            ],
            [
                {
                    "endTime": 1656019642103097225,
                    "startTime": 1656019642103097225
                }
            ]
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
            "description": "Success",
            "posDescription": "Success"
        },
        "data": [
            [
                {
                    "iops": 29.5,
                    "time": 1656019140000000000
                },
                {
                    "iops": 465.75,
                    "time": 1656019200000000000
                },
                {
                    "iops": 568.1,
                    "time": 1656019260000000000
                },
                {
                    "iops": 546.5714285714286,
                    "time": 1656019320000000000
                },
                {
                    "iops": 421.6363636363636,
                    "time": 1656019380000000000
                },
                {
                    "iops": 556.7222222222222,
                    "time": 1656019440000000000
                },
                {
                    "iops": 533.7,
                    "time": 1656019500000000000
                },
                {
                    "iops": 293.3333333333333,
                    "time": 1656019560000000000
                },
                {
                    "iops": 517.25,
                    "time": 1656019620000000000
                },
                {
                    "iops": 555.6666666666666,
                    "time": 1656019680000000000
                }
            ],
            [
                {
                    "endTime": 1656019689510611595,
                    "startTime": 1656018789510611595
                }
            ]
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
            "module": "M-Agent",
            "code": 21010,
            "level": "ERROR",
            "description": "Time parameter error",
            "posDescription": "Time parameter error",
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
            "description": "Success",
            "posDescription": "Success"
        },
        "data": [
            [
                {
                    "latency": 0,
                    "time": 1656006077178028882
                }
            ],
            [
                {
                    "endTime": 1656006077178028882,
                    "startTime": 1656006077178028882
                }
            ]
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
            "module": "M-Agent",
            "code": 21010,
            "level": "ERROR",
            "description": "Time parameter error",
            "posDescription": "Time parameter error",
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
            "description": "Success",
            "posDescription": "Success"
        },
        "data": [
            [
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
            ],
            [
                {
                    "endTime": 1597736236000000000,
                    "startTime": 1597736244000000000
                }
            ]
        ]
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
            "description": "Success",
            "posDescription": "Success"
        },
        "data": [
            [
                {
                    "data": [
                        [
                            {
                                "bw": 77528839,
                                "time": 1656019289000000000
                            }
                        ],
                        [
                            {
                                "endTime": 1656019293047888274,
                                "startTime": 1656019293047888274
                            }
                        ]
                    ]
                }
            ]
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
            "module": "M-Agent",
            "code": 21010,
            "level": "ERROR",
            "description": "Time parameter error",
            "posDescription": "Time parameter error",
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
            "description": "Success",
            "posDescription": "Success"
        },
        "data": [
            [
                {
                    "arrayid": "0",
                    "data": [
                        [
                            {
                                "bw": 0,
                                "time": 1656018420000000000
                            },
                            {
                                "bw": 0,
                                "time": 1656018480000000000
                            },
                            {
                                "bw": 0,
                                "time": 1656018540000000000
                            },
                            {
                                "bw": 0,
                                "time": 1656018600000000000
                            },
                            {
                                "bw": 0,
                                "time": 1656018660000000000
                            },
                            {
                                "bw": 0,
                                "time": 1656018720000000000
                            },
                            {
                                "bw": 0,
                                "time": 1656018780000000000
                            },
                            {
                                "bw": 0,
                                "time": 1656018840000000000
                            },
                            {
                                "bw": 0,
                                "time": 1656018900000000000
                            },
                            {
                                "bw": 0,
                                "time": 1656018960000000000
                            },
                            {
                                "bw": 0,
                                "time": 1656019020000000000
                            },
                            {
                                "bw": 0,
                                "time": 1656019080000000000
                            },
                            {
                                "bw": 790676,
                                "time": 1656019140000000000
                            },
                            {
                                "bw": 61011781.25,
                                "time": 1656019200000000000
                            },
                            {
                                "bw": 74520789.45,
                                "time": 1656019260000000000
                            },
                            {
                                "bw": 71445236.5,
                                "time": 1656019320000000000
                            }
                        ],
                        [
                            {
                                "endTime": 1656019333571340927,
                                "startTime": 1656018433571340927
                            }
                        ]
                    ],
                    "volumeid": "1"
                }
            ]
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
            "description": "Success",
            "posDescription": "Success"
        },
        "data": [
            [
                {
                    "data": [
                        [
                            {
                                "iops": 517,
                                "time": 1656019741000000000
                            }
                        ],
                        [
                            {
                                "endTime": 1656019744820479109,
                                "startTime": 1656019744820479109
                            }
                        ]
                    ]
                }
            ]
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
            "description": "Success",
            "posDescription": "Success"
        },
        "data": [
            [
                {
                    "arrayid": "0",
                    "data": [
                        [
                            {
                                "iops": 0,
                                "time": 1656018840000000000
                            },
                            {
                                "iops": 0,
                                "time": 1656018900000000000
                            },
                            {
                                "iops": 0,
                                "time": 1656018960000000000
                            },
                            {
                                "iops": 0,
                                "time": 1656019020000000000
                            },
                            {
                                "iops": 0,
                                "time": 1656019080000000000
                            },
                            {
                                "iops": 30,
                                "time": 1656019140000000000
                            },
                            {
                                "iops": 465.75,
                                "time": 1656019200000000000
                            },
                            {
                                "iops": 568.1,
                                "time": 1656019260000000000
                            },
                            {
                                "iops": 546.5714285714286,
                                "time": 1656019320000000000
                            },
                            {
                                "iops": 421.6363636363636,
                                "time": 1656019380000000000
                            },
                            {
                                "iops": 556.7222222222222,
                                "time": 1656019440000000000
                            },
                            {
                                "iops": 533.7,
                                "time": 1656019500000000000
                            },
                            {
                                "iops": 293.3333333333333,
                                "time": 1656019560000000000
                            },
                            {
                                "iops": 517.25,
                                "time": 1656019620000000000
                            },
                            {
                                "iops": 530.25,
                                "time": 1656019680000000000
                            },
                            {
                                "iops": 516.3076923076923,
                                "time": 1656019740000000000
                            }
                        ],
                        [
                            {
                                "endTime": 1656019778252328540,
                                "startTime": 1656018878252328540
                            }
                        ]
                    ],
                    "volumeid": "1"
                }
            ]
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
            "description": "Success",
            "posDescription": "Success"
        },
        "data": [
            [
                {
                    "data": [
                        [
                            {
                                "latency": 0,
                                "time": 1597737402983947953
                            }
                        ],
                        [
                            {
                                "endTime": 1597737402983947953,
                                "startTime": 1597737402983947953
                            }
                        ]
                    ]
                }
            ]
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
            "description": "Success",
            "posDescription": "Success"
        },
        "data": [
            [
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
            ],
            [
                {
                    "endTime": 1597736236000000000,
                    "startTime": 1597736244000000000
                }
            ]
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
            "module": "M-Agent",
            "code": 21010,
            "level": "ERROR",
            "description": "Time parameter error",
            "posDescription": "Time parameter error",
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
            "module": "COMMON",
            "code": 0,
            "level": "INFO",
            "description": "Success",
            "posDescription": "Success"
        },
        "data": [
            [
                {
                    "data": [
                        [
                            {
                                "bw": 73206290,
                                "time": 1656019500000000000
                            }
                        ],
                        [
                            {
                                "endTime": 1656019502282401572,
                                "startTime": 1656019502282401572
                            }
                        ]
                    ]
                }
            ]
        ]
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
            "description": "Success",
            "posDescription": "Success"
        },
        "data": [
            [
                {
                    "arrayid": "0",
                    "data": [
                        [
                            {
                                "bw": 0,
                                "time": 1656018600000000000
                            },
                            {
                                "bw": 0,
                                "time": 1656018660000000000
                            },
                            {
                                "bw": 0,
                                "time": 1656018720000000000
                            },
                            {
                                "bw": 0,
                                "time": 1656018780000000000
                            },
                            {
                                "bw": 0,
                                "time": 1656018840000000000
                            },
                            {
                                "bw": 0,
                                "time": 1656018900000000000
                            },
                            {
                                "bw": 0,
                                "time": 1656018960000000000
                            },
                            {
                                "bw": 0,
                                "time": 1656019020000000000
                            },
                            {
                                "bw": 0,
                                "time": 1656019080000000000
                            },
                            {
                                "bw": 0,
                                "time": 1656019140000000000
                            },
                            {
                                "bw": 73171758.125,
                                "time": 1656019200000000000
                            },
                            {
                                "bw": 74797078.2,
                                "time": 1656019260000000000
                            },
                            {
                                "bw": 70977386.5,
                                "time": 1656019320000000000
                            },
                            {
                                "bw": 95178253.8,
                                "time": 1656019380000000000
                            },
                            {
                                "bw": 77808191.5263158,
                                "time": 1656019440000000000
                            },
                            {
                                "bw": 74387173.70588236,
                                "time": 1656019500000000000
                            }
                        ],
                        [
                            {
                                "endTime": 1656019551781706692,
                                "startTime": 1656018651781706692
                            }
                        ]
                    ],
                    "volumeid": "1"
                }
            ]
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
            "module": "M-Agent",
            "code": 21010,
            "level": "ERROR",
            "description": "Time parameter error",
            "posDescription": "Time parameter error",
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
            "description": "Success",
            "posDescription": "Success"
        },
        "data": [
            [
                {
                    "data": [
                        [
                            {
                                "iops": 550,
                                "time": 1656019856000000000
                            }
                        ],
                        [
                            {
                                "endTime": 1656019859600672376,
                                "startTime": 1656019859600672376
                            }
                        ]
                    ]
                }
            ]
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
            "description": "Success",
            "posDescription": "Success"
        },
        "data": [
            [
                {
                    "arrayid": "0",
                    "data": [
                        [
                            {
                                "iops": 0,
                                "time": 1656018960000000000
                            },
                            {
                                "iops": 0,
                                "time": 1656019020000000000
                            },
                            {
                                "iops": 0,
                                "time": 1656019080000000000
                            },
                            {
                                "iops": 0,
                                "time": 1656019140000000000
                            },
                            {
                                "iops": 557.875,
                                "time": 1656019200000000000
                            },
                            {
                                "iops": 570.2,
                                "time": 1656019260000000000
                            },
                            {
                                "iops": 541.1428571428571,
                                "time": 1656019320000000000
                            },
                            {
                                "iops": 725.7,
                                "time": 1656019380000000000
                            },
                            {
                                "iops": 593.1052631578947,
                                "time": 1656019440000000000
                            },
                            {
                                "iops": 577.6,
                                "time": 1656019500000000000
                            },
                            {
                                "iops": 841.15,
                                "time": 1656019560000000000
                            },
                            {
                                "iops": 615.85,
                                "time": 1656019620000000000
                            },
                            {
                                "iops": 522.65,
                                "time": 1656019680000000000
                            },
                            {
                                "iops": 514.25,
                                "time": 1656019740000000000
                            },
                            {
                                "iops": 518.75,
                                "time": 1656019800000000000
                            },
                            {
                                "iops": 1233.7142857142858,
                                "time": 1656019860000000000
                            }
                        ],
                        [
                            {
                                "endTime": 1656019883115441363,
                                "startTime": 1656018983115441363
                            }
                        ]
                    ],
                    "volumeid": "1"
                }
            ]
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
            "description": "Success",
            "posDescription": "Success"
        },
        "data": [
            [
                {
                    "data": [
                        [
                            {
                                "latency": 0,
                                "time": 1597737402983947953
                            }
                        ],
                        [
                            {
                                "endTime": 1597737402983947953,
                                "startTime": 1597737402983947953
                            }
                        ]
                    ]
                }
            ]
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
            "description": "Success",
            "posDescription": "Success"
        },
        "data": [
            [
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
            ],
            [
                {
                    "endTime": 1597736236000000000,
                    "startTime": 1597736244000000000
                }
            ]
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
            "module": "M-Agent",
            "code": 21010,
            "level": "ERROR",
            "description": "Time parameter error",
            "posDescription": "Time parameter error",
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
            "description": "Success",
            "posDescription": "Success"
        },
        "data": [
            [
                {
                    "bw": 71083000,
                    "time": 1656019376000000000
                }
            ],
            [
                {
                    "endTime": 1656019380381039915,
                    "startTime": 1656019380381039915
                }
            ]
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
            "module": "M-Agent",
            "code": 21010,
            "level": "ERROR",
            "description": "Time parameter error",
            "posDescription": "Time parameter error",
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
            "description": "Success",
            "posDescription": "Success"
        },
        "data": [
            [
                {
                    "bw": 73171758.125,
                    "time": 1656019200000000000
                },
                {
                    "bw": 74797078.2,
                    "time": 1656019260000000000
                },
                {
                    "bw": 70977386.5,
                    "time": 1656019320000000000
                },
                {
                    "bw": 76742547.9,
                    "time": 1656019380000000000
                }
            ],
            [
                {
                    "endTime": 1656019412273911399,
                    "startTime": 1656018512273911399
                }
            ]
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
            "description": "Success",
            "posDescription": "Success"
        },
        "data": [
            [
                {
                    "iops": 542,
                    "time": 1656019813000000000
                }
            ],
            [
                {
                    "endTime": 1656019815837038954,
                    "startTime": 1656019815837038954
                }
            ]
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
            "description": "Success",
            "posDescription": "Success"
        },
        "data": [
            [
                {
                    "iops": 557.875,
                    "time": 1656019200000000000
                },
                {
                    "iops": 570.2,
                    "time": 1656019260000000000
                },
                {
                    "iops": 541.1428571428571,
                    "time": 1656019320000000000
                },
                {
                    "iops": 725.7,
                    "time": 1656019380000000000
                },
                {
                    "iops": 593.1052631578947,
                    "time": 1656019440000000000
                },
                {
                    "iops": 577.6,
                    "time": 1656019500000000000
                },
                {
                    "iops": 841.15,
                    "time": 1656019560000000000
                },
                {
                    "iops": 615.85,
                    "time": 1656019620000000000
                },
                {
                    "iops": 522.65,
                    "time": 1656019680000000000
                },
                {
                    "iops": 514.25,
                    "time": 1656019740000000000
                },
                {
                    "iops": 526.6363636363636,
                    "time": 1656019800000000000
                }
            ],
            [
                {
                    "endTime": 1656019835320469052,
                    "startTime": 1656018935320469052
                }
            ]
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
            "description": "Success",
            "posDescription": "Success"
        },
        "data": [
            [
                {
                    "latency": 0,
                    "time": 1656006167445344583
                }
            ],
            [
                {
                    "endTime": 1656006167445344583,
                    "startTime": 1656006167445344583
                }
            ]
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
            "module": "M-Agent",
            "code": 21010,
            "level": "ERROR",
            "description": "Time parameter error",
            "posDescription": "Time parameter error",
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
            "description": "Success",
            "posDescription": "Success"
        },
        "data": [
            [
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
            ],
            [
                {
                    "endTime": 1597736236000000000,
                    "startTime": 1597736244000000000
                }
            ]
        ]
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
        "name": "nqn.2019-04.pos:subsystem1",
        "transport_type": "tcp",
        "target_address": "107.108.83.97",
        "transport_service_id": "1158"
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
        "version": "v0.11.0-rc5"
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
        "version": "v0.11.0-rc5"
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
        "version": "v0.11.0-rc5"
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
        "version": "v0.11.0-rc5"
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
    "lastSuccessTime": 1656016889,
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
                        "description": "Transport ( tcp ) has been created.",
                        "id": "transport"
                    },
                    {
                        "code": 0,
                        "description": "Subsystem ( nqn.2019-04.pos:subsystem1 ) has been created.",
                        "id": "subSystem1"
                    },
                    {
                        "code": 0,
                        "description": "Subsystem ( nqn.2019-04.pos:subsystem2 ) has been created.",
                        "id": "subSystem2"
                    },
                    {
                        "code": 0,
                        "description": "Address ( 107.108.83.97 ) added to Subsystem ( nqn.2019-04.pos:subsystem1 )",
                        "id": "addListener1"
                    },
                    {
                        "code": 0,
                        "description": "Address ( 107.108.83.97 ) added to Subsystem ( nqn.2019-04.pos:subsystem2 )",
                        "id": "addListener2"
                    },
                    {
                        "code": 0,
                        "description": "uram0: Device has been created",
                        "id": "uram1"
                    },
                    {
                        "code": 0,
                        "description": "uram1: Device has been created",
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
    "rid": "619782d1-bad3-4dc3-8202-ab4b43144610",
    "lastSuccessTime": 1656005726,
    "result": {
        "status": {
            "module": "COMMON",
            "code": 0,
            "level": "INFO",
            "description": "Success",
            "posDescription": "DONE"
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
    "rid": "99c366f5-bc5d-4f38-820f-7c1b5e3517ef",
    "lastSuccessTime": 1656018644,
    "result": {
        "status": {
            "module": "COMMON",
            "code": 0,
            "level": "INFO",
            "description": "Success",
            "posDescription": "Telemetry has started "
        },
        "data": {}
    },
    "info": {
        "version": "v0.11.0-rc5"
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
    "rid": "686dbf95-fb84-4def-b929-addc54be72a9",
    "lastSuccessTime": 1656018659,
    "result": {
        "status": {
            "module": "COMMON",
            "code": 0,
            "level": "INFO",
            "description": "Success",
            "posDescription": "Telemetry has stopped "
        },
        "data": {}
    },
    "info": {
        "version": "v0.11.0-rc5"
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
    "rid": "b05407df-a571-494c-be0b-48529ef2ff81",
    "lastSuccessTime": 1656017545,
    "result": {
        "status": {
            "module": "COMMON",
            "code": 0,
            "level": "INFO",
            "description": "Success",
            "posDescription": "vol01 has been created successfully."
        }
    },
    "info": {
        "version": "v0.11.0-rc5"
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
    "rid": "8859a9aa-a30d-4a13-817d-85e369d12921",
    "lastSuccessTime": 1656018228,
    "result": {
        "status": {
            "module": "VolumeManager",
            "code": 2010,
            "level": "WARN",
            "description": "The requested volume does not exist",
            "posDescription": "failed to delete vol01(code:2010)",
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
    "rid": "86bb9c41-08fd-432a-8d90-ae88e32b0137",
    "lastSuccessTime": 1656018206,
    "result": {
        "status": {
            "module": "COMMON",
            "code": 0,
            "level": "INFO",
            "description": "Success",
            "posDescription": "vol01is deleted successfully"
        }
    },
    "info": {
        "version": "v0.11.0-rc5"
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
    "rid": "10cfdcad-02dc-4a5d-b722-2007e5337f10",
    "lastSuccessTime": 1656017601,
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
                    "index": 0,
                    "maxbw": 0,
                    "maxiops": 0,
                    "minbw": 0,
                    "miniops": 0,
                    "name": "pvc-2c7aaefd-e2d5-4851-b3f1-2d93a93ea8f0",
                    "status": "Unmounted",
                    "total": 5368709120,
                    "uuid": "9fcdb071-77d3-42be-81aa-caed48018913"
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
        "array": "{{arrayName}}"
    }
}
```



##### I. Example Response: Success
```js
{
    "rid": "f3fe4c70-19c5-42ab-9818-eae1857b73d6",
    "lastSuccessTime": 1656017935,
    "result": {
        "status": {
            "module": "COMMON",
            "code": 0,
            "level": "INFO",
            "description": "Success",
            "posDescription": "vol0 is mounted successfully"
        }
    },
    "info": {
        "version": "v0.11.0-rc5"
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
    "rid": "da25a190-837e-4140-8059-4695254c820a",
    "lastSuccessTime": 1656018011,
    "result": {
        "status": {
            "module": "VolumeManager",
            "code": 2010,
            "level": "WARN",
            "description": "The requested volume does not exist",
            "posDescription": "failed to mount vol0s(code:2010)",
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
    "rid": "364b3fa2-3922-4f01-ade5-1de0f02ff8fe",
    "lastSuccessTime": 1656017774,
    "result": {
        "status": {
            "module": "COMMON",
            "code": 0,
            "level": "INFO",
            "description": "Success",
            "posDescription": "vol01 is renamed to newvol01"
        }
    },
    "info": {
        "version": "v0.11.0-rc5"
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
    "rid": "a2494030-7a38-487e-8054-ddd87a7f8564",
    "lastSuccessTime": 1656018241,
    "result": {
        "status": {
            "module": "VolumeManager",
            "code": 2010,
            "level": "WARN",
            "description": "The requested volume does not exist",
            "posDescription": "failed to unmount vol01(code:2010)",
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
    "rid": "162781a9-db4a-4861-822b-0a8960bb049c",
    "lastSuccessTime": 1656018127,
    "result": {
        "status": {
            "module": "COMMON",
            "code": 0,
            "level": "INFO",
            "description": "Success",
            "posDescription": "vol01is unmounted successfully"
        }
    },
    "info": {
        "version": "v0.11.0-rc5"
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
    "rid": "1c268f9f-4ae3-46ae-b51f-2d8d1be62499",
    "lastSuccessTime": 1656017659,
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
            "status": "Unmounted",
            "subnqn": "",
            "total": 5242880,
            "uuid": "b0fb4c4b-812b-44be-bfda-1285be40ca52"
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
> Made with &#9829; by [thedevsaddam](https://github.com/thedevsaddam) | Generated at: 2022-06-24 03:26:30 by [docgen](https://github.com/thedevsaddam/docgen)
