# POS Management Stack - Middleware (Metric Agent (M-Agent))
*  This app provides functions to retrieve and store the storage metrics such as CPU, Memory or other relevant ones.

## Pre-Requisites
go v1.14+

## Build Agent
* It is build along with the other components of the POS Management Stack. 

## Run Agent
* It is run along with the other components of the POS Management Stack. 

## Capabilities
Collects cpu metrics and tails /tmp/air_ddmmyy_pid.json file and outputs to InfluxDB using REST/Unix Socket.

Note: /tmp//air_ddmmyy_pid.json should contain only JSON data without nested values

