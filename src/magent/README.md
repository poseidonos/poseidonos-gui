## Build Agent
`
cd scripts
./build_magent.sh
`

## Run Agent
`
cd scripts
./run_magent.sh
`

## Pre-Requisites
go v1.14+

## Capabilities
Collects cpu metrics and tails /tmp/air_result.json file and outputs to InfluxDB using REST/Unix Socket.

Note: /tmp/air_result.json should contain only JSON data without nested values

## Build Docker Image
docker build -t magent-docker . 

## Run Docker image 
docker run -d -p 8090:8090 magent-docker

## Finding Docker containers
docker ps -a
