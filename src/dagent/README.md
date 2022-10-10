# D-Agent - POS Management Stack Middleware
*  This app provides [RESTFul APIs](src/dagent/doc/api.md) to Poseidonos System

## Pre-Requisites
1. go v1.18+
2. IP Address of Mellanox Port should be set in the file script/run_os.sh (eg: IP=10.100.11.7)

#### POS
* The POS should be installed and running. POS binary is assumed to be available at **/usr/local/bin**
#### Config File
* config.yaml file should be in the same location as the executable file (e.g src/dagent/bin/). If there is no config file, D-Agent will use default values.
* Management applications uses Nginx and it will forward D-Agent API requests to port 3000 port.

```yaml
server:
  dagent:
    ip: 127.0.0.1
    port: 3000
  ibof:
    ip: 127.0.0.1
    port: 18716
```

***

## Build & Run

#### Build
* It is build along with the other components of the M9K. (Please see ([README](../../README.md)) at the root level)
* It can be run on any path.
* It does not need any dependency pkg after compiling.

#### Run
* It is run along with the other components of the M9K. (Please see ([README](../../README.md)) at the root level)

***

## How to test API
#### Postman
1. Install Postman
2. Import Collection in postman folder
3. Import Environments in postman folder
4. Call RUNIBOFOS   
    : It exec "run_remote_ibofos.sh"
5. Call APIs to Test

#### API Spec and Error code
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
    // Ref. each API command
  }
}
```

***

* API Spec  
```
src/dagent/doc/api.html
src/dagent/doc/api.md
```
* Error Code  
```
src/dagent/doc/events.yaml
```

***

## Newman

#### Installation

- Newman is a node.js pkg and distributed by npm so you need to install node.js and npm.
- Install a newman using npm. (Install globally)

```
$npm install newman -g
```

#### How to use

```
$ cd src/dagent
$ newman run postman/D-Agent.postman_collection.json -e postman/D-Agent.postman_environment.json -r junit --reporter-junit-export ./result.xml
```

- You have to prepare collection and environment file which are exported from Postman.
- Put a collection file after "run" and add an environment file using option "-e".
- You can report the test result with JUnit format and it can be using option "-r junit" and make a specific xml formatted file like "--reporter-junit-export result.xml".
