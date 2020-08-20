#!/usr/bin/bash

if [[ -z "${INFLUXDB_RETENTION_ENABLED}" ]]; then
    export INFLUXDB_RETENTION_ENABLED=true
    echo 'export INFLUXDB_RETENTION_ENABLED=true' >> ~/.bashrc
fi
if [[ -z "${INFLUXDB_RETENTION_CHECK_INTERVAL}" ]]; then
    echo 'export INFLUXDB_RETENTION_CHECK_INTERVAL="10m"' >> ~/.bashrc
fi
if [[ -z "${INFLUXDB_CONTINUOUS_QUERIES_ENABLED}" ]]; then
    echo 'export INFLUXDB_CONTINUOUS_QUERIES_ENABLED=true' >> ~/.bashrc
fi
if [[ -z "${INFLUXDB_CONTINUOUS_QUERIES_RUN_INTERVAL}" ]]; then
    echo 'export INFLUXDB_CONTINUOUS_QUERIES_RUN_INTERVAL="1m"' >> ~/.bashrc
fi
if [[ -z "${INFLUXDB_LOGGING_LEVEL}" ]]; then
    echo 'export INFLUXDB_LOGGING_LEVEL="error"' >> ~/.bashrc
fi
. ~/.bashrc
