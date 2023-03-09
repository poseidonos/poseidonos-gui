'''
/*
 *   BSD LICENSE
 *   Copyright (c) 2021 Samsung Electronics Corporation
 *   All rights reserved.
 *
 *   Redistribution and use in source and binary forms, with or without
 *   modification, are permitted provided that the following conditions
 *   are met:
 *
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in
 *       the documentation and/or other materials provided with the
 *       distribution.
 *     * Neither the name of Samsung Electronics Corporation nor the names of its
 *       contributors may be used to endorse or promote products derived
 *       from this software without specific prior written permission.
 *
 *   THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 *   "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 *   LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 *   A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 *   OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 *   SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 *   LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 *   DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 *   THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 *   (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 *   OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
 '''

import requests_mock
import jwt
import datetime
import os
import re
from flask import json
from unittest import mock
from rest.app import app
from util.macros.performance import TOTALCRITICALS, TOTALWARNINGS, TOTALNOMINALS, ISIPMICHASSISPOWERON, ERRORINDEVICES, ERRORINIPMI

INFLUXDB_URL = 'http://0.0.0.0:8086/write?db=poseidon&rp=autogen'
ip = "122.122.122.122"
old_ip = "122.122.111.122"
port = "5555"
prom_url = "http://{ip}:{port}".format(ip=ip, port=port)
grafa_url = "http://localhost:3500"
ds_name = "poseidon"
dagent_ip = os.environ.get('DAGENT_HOST', 'localhost')
DAGENT_URL = 'http://' + dagent_ip + ':3000'
ds_id = 1
json_token = jwt.encode({'_id': "test", 'exp': datetime.datetime.utcnow(
) + datetime.timedelta(minutes=60)}, app.config['SECRET_KEY'])

# json data 
success_json = {"status": "success"}
tel_json = {'telemetryIP': ip, 'telemetryPort': port}
devices = [
        {
            "metric": {
                "__name__": "unknown_name",
                "nvme_ctrl_id": "unknown_id",
                "publisher_name": "unknown_publisher",
            },
            "value": [
                1670921370.578,
                "10"
            ]
        },
        {
            "metric": {
                "__name__": "available_spare",
                "nvme_ctrl_id": "unvme-ns-0",
                "publisher_name": "Disk_Monitoring",
            },
            "value": [
                1670921370.578,
                "8"
            ]
        },
        {
            "metric": {
                "__name__": "available_spare",
                "nvme_ctrl_id": "unvme-ns-1",
                "publisher_name": "Disk_Monitoring",
            },
            "value": [
                1670921370.578,
                "100"
            ]
        },
        {
            "metric": {
                "__name__": "available_spare_threshold",
                "nvme_ctrl_id": "unvme-ns-0",
                "publisher_name": "Disk_Monitoring",
            },
            "value": [
                1670921370.578,
                "10"
            ]
        },
        {
            "metric": {
                "__name__": "available_spare_threshold",
                "nvme_ctrl_id": "unvme-ns-1",
                "publisher_name": "Disk_Monitoring",
            },
            "value": [
                1670921370.578,
                "10"
            ]
        },
        {
            "metric": {
                "__name__": "critical_temperature_time",
                "nvme_ctrl_id": "unvme-ns-0",
                "publisher_name": "Disk_Monitoring",
            },
            "value": [
                1670921370.578,
                "1"
            ]
        },
        {
            "metric": {
                "__name__": "critical_temperature_time",
                "nvme_ctrl_id": "unvme-ns-1",
                "publisher_name": "Disk_Monitoring",
            },
            "value": [
                1670921370.578,
                "0"
            ]
        },
        {
            "metric": {
                "__name__": "temperature",
                "nvme_ctrl_id": "unvme-ns-0",
                "publisher_name": "Disk_Monitoring",
            },
            "value": [
                1670921370.578,
                "308"
            ]
        },
        {
            "metric": {
                "__name__": "temperature",
                "nvme_ctrl_id": "unvme-ns-1",
                "publisher_name": "Disk_Monitoring",
            },
            "value": [
                1670921370.578,
                "308"
            ]
        },
        {
            "metric": {
                "__name__": "warning_temperature_time",
                "nvme_ctrl_id": "unvme-ns-0",
                "publisher_name": "Disk_Monitoring",
            },
            "value": [
                1670921370.578,
                "0"
            ]
        },
        {
            "metric": {
                "__name__": "warning_temperature_time",
                "nvme_ctrl_id": "unvme-ns-1",
                "publisher_name": "Disk_Monitoring",
            },
            "value": [
                1670921370.578,
                "1"
            ]
        },
        {
            "metric": {
                "__name__": "critical_temperature_time",
                "nvme_ctrl_id": "unvme-ns-1",
                "publisher_name": "Disk_Monitoring",
            },
            "value": [
                1670921370.578,
                "0"
            ]
        },
]
status_json = {
                        "data": {
                            "result": devices,
                        },
                        "status": "success"
                    }
data_json = {
            "message": "data source with the same name already exists",
            "traceID": "00000000000000000000000000000000"
        }
label_json = {
                        "data": {
                            "result": "ipmi",
                        },
                        "status": "success"
                    }
query_json = {
                        "data": {
                            "result": [{
                                "metric": {
                                    "job": "poseidonos"
                                },
                                "value": [
                                    "0", "1"
                                ]
                            },
                            {
                                "metric": {
                                    "job": "ipmi"
                                },
                                "value": [
                                    "0", "1"
                                ]
                            }]
                        }
                    }
graphana_json = [
            {
                "id": ds_id,
                "uid": "iFXqnLzVk",
                "orgId": 1,
                "name": "poseidon",
                "type": "prometheus",
                "typeName": "Prometheus",
                "typeLogoUrl": "public/app/plugins/datasource/prometheus/img/prometheus_logo.svg",
                "access": "proxy",
                "url": "http://"+old_ip+":"+port,
                "user": "",
                "database": "",
                "basicAuth": False,
                "isDefault": False,
                "jsonData": {},
                "readOnly": False
            }
        ]


ipmi = [
    {
        "metric": {
            "__name__": "unknown_name",
        },
        "value": [
            1670922558.274,
            "1"
        ]
    },
    {
        "metric": {
            "__name__": "ipmi_chassis_power_state",
        },
        "value": [
            1670922558.274,
            "1"
        ]
    },
    {
        "metric": {
            "__name__": "ipmi_fan_speed_rpm",
            "name": "FAN7"
        },
        "value": [
            1670922558.274,
            "3900"
        ]
    },
    {
        "metric": {
            "__name__": "ipmi_fan_speed_rpm",
            "name": "FAN4"
        },
        "value": [
            1670922558.274,
            "3900"
        ]
    },
    {
        "metric": {
            "__name__": "ipmi_fan_speed_state",
            "name": "FAN7"
        },
        "value": [
            1670922558.274,
            "0"
        ]
    },
    {
        "metric": {
            "__name__": "ipmi_fan_speed_state",
            "name": "FAN4"
        },
        "value": [
            1670922558.274,
            "0"
        ]
    },
    {
        "metric": {
            "__name__": "ipmi_sensor_state",
            "name": "PS1 Status"
        },
        "value": [
            1670922558.274,
            "0"
        ]
    },
    {
        "metric": {
            "__name__": "ipmi_sensor_state",
            "name": "PS2 Status"
        },
        "value": [
            1670922558.274,
            "0"
        ]
    },
    {
        "metric": {
            "__name__": "ipmi_sensor_value",
            "name": "PS1 Status"
        },
        "value": [
            1670922558.274,
            "NaN"
        ]
    },
    {
        "metric": {
            "__name__": "ipmi_sensor_value",
            "name": "PS2 Status"
        },
        "value": [
            1670922558.274,
            "NaN"
        ]
    },
    {
        "metric": {
            "__name__": "ipmi_temperature_celsius",
            "name": "PCH Temp"
        },
        "value": [
            1670922558.274,
            "55"
        ]
    },
    {
        "metric": {
            "__name__": "ipmi_temperature_celsius",
            "name": "P1-DIMMB1 Temp"
        },
        "value": [
            1670922558.274,
            "55"
        ]
    },
    {
        "metric": {
            "__name__": "ipmi_temperature_state",
            "name": "PCH Temp"
        },
        "value": [
            1670922558.274,
            "0"
        ]
    },
    {
        "metric": {
            "__name__": "ipmi_temperature_state",
            "name": "P1-DIMMB1 Temp"
        },
        "value": [
            1670922558.274,
            "0"
        ]
    },
    {
        "metric": {
            "__name__": "ipmi_voltage_state",
            "name": "5VCC"
        },
        "value": [
            1670922558.274,
            "0"
        ]
    },
    {
        "metric": {
            "__name__": "ipmi_voltage_state",
            "name": "3.3VCC"
        },
        "value": [
            1670922558.274,
            "0"
        ]
    },
    {
        "metric": {
            "__name__": "ipmi_voltage_volts",
            "name": "5VCC"
        },
        "value": [
            1670922558.274,
            "5.03"
        ]
    },
    {
        "metric": {
            "__name__": "ipmi_voltage_volts",
            "name": "3.3VCC"
        },
        "value": [
            1670922558.274,
            "3.35"
        ]
    }
]


@mock.patch("rest.app.connection_factory.get_telemetery_url",
            return_value=[ip,port], autospec=True)
def test_get_telemetry_config(mock_get_telemetry_url):
    response = app.test_client().get('/api/v1/configure')
    data = json.loads(response.get_data(as_text=True))
    assert response.status_code == 200
    assert data["isConfigured"] == True

@mock.patch("rest.app.connection_factory.get_telemetery_url",
            return_value=[], autospec=True)
def test_get_telemetry_config_none(mock_get_telemetry_url):
    response = app.test_client().get('/api/v1/configure')
    data = json.loads(response.get_data(as_text=True))
    assert response.status_code == 200 
    assert data["isConfigured"] == False

@requests_mock.Mocker(kw="mock")
@mock.patch("rest.app.connection_factory.update_telemetry_url",
            return_value=True, autospec=True)
def test_set_telemetry_config_success(mock_update_telemetry_url, **kwargs):
    kwargs["mock"].post(INFLUXDB_URL, text='Success', status_code=204)
    kwargs["mock"].get(prom_url + '/api/v1/status/runtimeinfo',
                       json=success_json,
                       status_code=200)
    kwargs["mock"].post(
        grafa_url+"/api/datasources",
        json={"message": "Datasource added"},
        status_code=200)
    
    response = app.test_client().post(
        '/api/v1/configure',
        data=json.dumps(tel_json)
    )

    data = response.get_data(as_text=True)
    assert response.status_code == 200
    assert data == "success"

@requests_mock.Mocker(kw="mock")
@mock.patch("rest.app.connection_factory.update_telemetry_url",
            return_value=True, autospec=True)
def test_set_telemetry_config_success_2(mock_update_telemetry_url, **kwargs):
    kwargs["mock"].post(INFLUXDB_URL, text='Success', status_code=204)
    kwargs["mock"].get(prom_url + '/api/v1/status/runtimeinfo',
                       json=success_json,
                       status_code=200)
    kwargs["mock"].post(
        grafa_url+"/api/datasources",
        json=data_json,
        status_code=200)

    kwargs["mock"].get(
        grafa_url+"/api/datasources",
        json=[
            {
                "id": ds_id,
                "uid": "iFXqnLzVk",
                "orgId": 1,
                "name": "poseidon",
                "type": "prometheus",
                "typeName": "Prometheus",
                "typeLogoUrl": "public/app/plugins/datasource/prometheus/img/prometheus_logo.svg",
                "access": "proxy",
                "url": "http://"+ip+":"+port,
                "user": "",
                "database": "",
                "basicAuth": False,
                "isDefault": False,
                "jsonData": {},
                "readOnly": False
            }
        ],
        status_code=200)    
    
    response = app.test_client().post(
        '/api/v1/configure',
        data=json.dumps(tel_json)
    )

    data = response.get_data(as_text=True)
    assert response.status_code == 200
    assert data == "success"

@requests_mock.Mocker(kw="mock")
@mock.patch("rest.app.connection_factory.update_telemetry_url",
            return_value=True, autospec=True)
def test_set_telemetry_config_success_3(mock_update_telemetry_url, **kwargs):
    kwargs["mock"].post(INFLUXDB_URL, text='Success', status_code=204)
    kwargs["mock"].get(prom_url + '/api/v1/status/runtimeinfo',
                       json=success_json,
                       status_code=200)
    kwargs["mock"].post(
        grafa_url+"/api/datasources",
        json = data_json,
        status_code=200)

    kwargs["mock"].get(
        grafa_url+"/api/datasources",
        json=graphana_json,
        status_code=200)    

    kwargs["mock"].put(
        grafa_url+"/api/datasources/{ds_id}".format(ds_id=ds_id),
        json={"message": "Datasource updated"},
        status_code=200)  
    
    response = app.test_client().post(
        '/api/v1/configure',
        data=json.dumps(tel_json)
    )

    data = response.get_data(as_text=True)
    assert response.status_code == 200
    assert data == "success"

@requests_mock.Mocker(kw="mock")
@mock.patch("rest.app.connection_factory.update_telemetry_url",
            return_value=True, autospec=True)
def test_set_telemetry_config_failure(mock_update_telemetry_url, **kwargs):
    kwargs["mock"].post(INFLUXDB_URL, text='Success', status_code=204)
    kwargs["mock"].get(prom_url + '/api/v1/status/runtimeinfo',
                       json={"status": ""},
                       status_code=200)
    
    response = app.test_client().post(
        '/api/v1/configure',
        data=json.dumps(tel_json)
    )

    assert response.status_code == 500

@requests_mock.Mocker(kw="mock")
@mock.patch("rest.app.connection_factory.update_telemetry_url",
            return_value=True, autospec=True)
def test_set_telemetry_config_failure_2(mock_update_telemetry_url, **kwargs):
    kwargs["mock"].post(INFLUXDB_URL, text='Success', status_code=204)
    kwargs["mock"].get(prom_url + '/api/v1/status/runtimeinfo',
                       json=success_json,
                       status_code=200)
    kwargs["mock"].post(
        grafa_url+"/api/datasources",
        json=data_json,
        status_code=200)

    kwargs["mock"].get(
        grafa_url+"/api/datasources",
        json= graphana_json,
        status_code=200)   

    kwargs["mock"].put(
        grafa_url+"/api/datasources/{ds_id}".format(ds_id=ds_id),
        json={"message": ""},
        status_code=200)  
    
    response = app.test_client().post(
        '/api/v1/configure',
        data=json.dumps(tel_json)
    )

    assert response.status_code == 500


@requests_mock.Mocker(kw="mock")
@mock.patch("rest.app.connection_factory.get_telemetery_url",
            return_value=["localhost", "9090"], autospec=True)
def test_get_current_perf(mock_get_current_user, **kwargs):
    kwargs["mock"].get(re.compile('http\:\/\/localhost:9090\/api\/v1\/query*'),
                    json={
                        "data": {
                            "result": [{
                                "value": [0, 1]
                            }]
                        }
                    },
                    status_code=200)
    response = app.test_client().get(
        '/api/v1/perf/all'
    )

    assert response.status_code == 200

@requests_mock.Mocker(kw="mock")
@mock.patch("rest.app.connection_factory.get_telemetery_url",
            return_value=["localhost", "9090"], autospec=True)
def test_get_hardware_health(mock_get_current_user, **kwargs):
    kwargs["mock"].get('http://localhost:9090/api/v1/query?query=up',
                    json=query_json,
                    status_code=200)
    kwargs["mock"].get("http://localhost:9090/api/v1/query?query=label_replace(%7B__name__=~%22temperature%7Cwarning_temperature_time%7Ccritical_temperature_time%7Cavailable_spare%7Cavailable_spare_threshold%7C%22,job=%22poseidonos%22%7D,%22name_label%22,%22$1%22,%22__name__%22,%221s%22)",
                    json=status_json,
                    status_code=200)
    kwargs["mock"].get("http://localhost:9090/api/v1/query?query=label_replace(%7B__name__=~%22ipmi_fan_speed_state%7Cipmi_fan_speed_rpm%7Cipmi_power_state%7Cipmi_power_watts%7Cipmi_sensor_state%7Cipmi_sensor_value%7Cipmi_voltage_state%7Cipmi_voltage_volts%7Cipmi_temperature_state%7Cipmi_temperature_celsius%7Cipmi_chassis_power_state%7C%22,instance=%22localhost:9290%22%7D,%22name_label%22,%22$1%22,%22__name__%22,%221s%22)",
                    json={
                        "data": {
                            "result": ipmi,
                        },
                        "status": "success"
                    },
                    status_code=200)
    response = app.test_client().get(
        '/api/v1/get_hardware_health',
        headers={'x-access-token': json_token},
    )
    assert response.status_code == 200
    response = json.loads(response.data)
    assert response[TOTALNOMINALS] == 10
    assert response[TOTALWARNINGS] == 1
    assert response[TOTALCRITICALS] == 1
    assert response[ERRORINDEVICES] == False
    assert response[ERRORINIPMI] == False
    assert response[ISIPMICHASSISPOWERON] == True

@requests_mock.Mocker(kw="mock")
@mock.patch("rest.app.connection_factory.get_telemetery_url",
            return_value=["localhost", "9090"], autospec=True)
def test_get_hardware_health_if_pos_exporter_not_running(mock_get_current_user, **kwargs):
    kwargs["mock"].get('http://localhost:9090/api/v1/query?query=up',
                    json=query_json,
                    status_code=200)
    kwargs["mock"].get("http://localhost:9090/api/v1/query?query=label_replace(%7B__name__=~%22temperature%7Cwarning_temperature_time%7Ccritical_temperature_time%7Cavailable_spare%7Cavailable_spare_threshold%7C%22,job=%22poseidonos%22%7D,%22name_label%22,%22$1%22,%22__name__%22,%221s%22)",
                    json={
                        "data": {
                            "result": [],
                        },
                    },
                    status_code=200)
    kwargs["mock"].get("http://localhost:9090/api/v1/query?query=label_replace(%7B__name__=~%22ipmi_fan_speed_state%7Cipmi_fan_speed_rpm%7Cipmi_power_state%7Cipmi_power_watts%7Cipmi_sensor_state%7Cipmi_sensor_value%7Cipmi_voltage_state%7Cipmi_voltage_volts%7Cipmi_temperature_state%7Cipmi_temperature_celsius%7Cipmi_chassis_power_state%7C%22,instance=%22localhost:9290%22%7D,%22name_label%22,%22$1%22,%22__name__%22,%221s%22)",
                    json={
                        "data": {
                            "result": ipmi,
                        },
                        "status": "success"
                    },
                    status_code=200)
    response = app.test_client().get(
        '/api/v1/get_hardware_health',
        headers={'x-access-token': json_token},
    )
    assert response.status_code == 200
    response = json.loads(response.data)
    assert response[TOTALNOMINALS] == 8
    assert response[ERRORINDEVICES] == True
    assert response[ERRORINIPMI] == False
    assert response[ISIPMICHASSISPOWERON] == True

@requests_mock.Mocker(kw="mock")
@mock.patch("rest.app.connection_factory.get_telemetery_url",
            return_value=["localhost", "9090"], autospec=True)
def test_get_hardware_health_if_ipmi_exporter_not_running(mock_get_current_user, **kwargs):
    kwargs["mock"].get('http://localhost:9090/api/v1/query?query=up',
                    json=query_json,
                    status_code=200)
    kwargs["mock"].get("http://localhost:9090/api/v1/query?query=label_replace(%7B__name__=~%22temperature%7Cwarning_temperature_time%7Ccritical_temperature_time%7Cavailable_spare%7Cavailable_spare_threshold%7C%22,job=%22poseidonos%22%7D,%22name_label%22,%22$1%22,%22__name__%22,%221s%22)",
                    json= status_json,
                    status_code=200)
    kwargs["mock"].get("http://localhost:9090/api/v1/query?query=label_replace(%7B__name__=~%22ipmi_fan_speed_state%7Cipmi_fan_speed_rpm%7Cipmi_power_state%7Cipmi_power_watts%7Cipmi_sensor_state%7Cipmi_sensor_value%7Cipmi_voltage_state%7Cipmi_voltage_volts%7Cipmi_temperature_state%7Cipmi_temperature_celsius%7Cipmi_chassis_power_state%7C%22,instance=%22localhost:9290%22%7D,%22name_label%22,%22$1%22,%22__name__%22,%221s%22)",
                    json={
                        "data": {
                            "result": [],
                        }
                    },
                    status_code=200)
    response = app.test_client().get(
        '/api/v1/get_hardware_health',
        headers={'x-access-token': json_token},
    )

    assert response.status_code == 200
    response = json.loads(response.data)
    assert response[TOTALNOMINALS] == 2
    assert response[TOTALCRITICALS] == 1
    assert response[TOTALWARNINGS] == 1
    assert response[ERRORINDEVICES] == False
    assert response[ERRORINIPMI] == True
    assert response[ISIPMICHASSISPOWERON] == False

@requests_mock.Mocker(kw="mock")
@mock.patch("rest.app.connection_factory.get_current_user",
            return_value="test", autospec=True)
def test_start_telemetry(mock_get_current_user, **kwargs):
    kwargs["mock"].post(DAGENT_URL + '/api/ibofos/v1/telemetry',
                       json=success_json,
                       status_code=200)
    response = app.test_client().post(
        '/api/v1/telemetry',
        headers={'x-access-token': json_token}
    )

    data = response.get_data(as_text=True)
    assert response.status_code == 200
    assert data == '{"status": "success"}'

@requests_mock.Mocker(kw="mock")
@mock.patch("rest.app.connection_factory.get_current_user",
            return_value="test", autospec=True)
def test_stop_telemetry(mock_get_current_user, **kwargs):
    kwargs["mock"].delete(DAGENT_URL + '/api/ibofos/v1/telemetry',
                       json=success_json,
                       status_code=200)
    response = app.test_client().delete(
        '/api/v1/telemetry',
        headers={'x-access-token': json_token}
    )

    data = response.get_data(as_text=True)
    assert response.status_code == 200
    assert data == '{"status": "success"}'

@requests_mock.Mocker(kw="mock")
@mock.patch("rest.app.connection_factory.get_current_user",
            return_value="test", autospec=True)
def test_set_telemetry_properties(mock_get_current_user, **kwargs):
    kwargs["mock"].post(DAGENT_URL + '/api/ibofos/v1/telemetry/properties',
                       json=success_json,
                       status_code=200)
    response = app.test_client().post(
        '/api/v1/telemetry/properties',
        headers={'x-access-token': json_token},
        data = json.dumps([{
            "category": "Common",
            "fields": [{
                "label": "Process Uptime Second",
                "field": "uptime_sec",
                "isSet": False
            }]
        }, {
            "category": "Device",
            "fields": [{
                "label": "Bandwidth",
                "field": "bandwidth_device",
                "isSet": True
            }, {
                "label": "Capacity",
                "field": "capacity_device",
                "isSet": True
            }]
        }]),
    )

    data = response.get_data(as_text=True)
    assert response.status_code == 200
    assert data == '{"status": "success"}'


@requests_mock.Mocker(kw="mock")
@mock.patch("rest.app.connection_factory.get_current_user",
            return_value="test", autospec=True)
def test_get_telemetry_properties(mock_get_current_user, **kwargs):
    kwargs["mock"].get(DAGENT_URL + '/api/ibofos/v1/telemetry/properties',
                    json={
                        "result": {
                            "status": {
                                "code": 0
                            },
                            "data": {
                                "metrics_to_publish": {
                                    "uptime_sec": None,
                                    "bandwidth_device": None
                                },
                                "telemetryStatus": {
                                    "status": True
                                }
                            }
                        }},
                       status_code=200)
    response = app.test_client().get(
        '/api/v1/telemetry/properties',
        headers={'x-access-token': json_token},
    )

    data = json.loads(response.data)
    assert response.status_code == 200
    for props in  data["properties"]:
        for field in props["fields"]:
            if field["field"] == "uptime_sec" or field["field"] == "bandwidth_device":
                assert field["isSet"] == True
            else:
                assert field["isSet"] == False

@requests_mock.Mocker(kw="mock")
@mock.patch("rest.app.connection_factory.get_telemetery_url",
            return_value=["localhost", "9090"], autospec=True)
def test_check_telemetry(mock_get_current_user, **kwargs):
    kwargs["mock"].get('http://localhost:9090/api/v1/query?query=up',
                    json={
                        "data": {
                            "result": [{
                                "metric": {
                                    "job": "poseidonos"
                                },
                                "value": [
                                    "0", "1"
                                ]
                            }]
                        }
                    },
                    status_code=200)
    kwargs["mock"].get('http://localhost:9090/api/v1/status/runtimeinfo',
            json=success_json,
            status_code=200
    )
    response = app.test_client().get(
        '/api/v1/checktelemetry',
        headers={'x-access-token': json_token},
    )

    assert response.status_code == 200

@requests_mock.Mocker(kw="mock")
@mock.patch("rest.app.connection_factory.delete_telemetery_url",
            return_value=[], autospec=True)
def test_delete_telemetry_config(mock_delete_telemetry_url, **kwargs):
    kwargs["mock"].delete(
        grafa_url+"/api/datasources/name/"+ds_name,
        json={"message": "Data source deleted"},
        status_code=200)
    response = app.test_client().delete('/api/v1/configure')
    assert response.status_code == 200 