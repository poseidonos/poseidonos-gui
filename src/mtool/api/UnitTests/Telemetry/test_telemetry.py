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
from unittest import mock
from rest.app import app
from flask import json

INFLUXDB_URL = 'http://0.0.0.0:8086/write?db=poseidon&rp=autogen'
ip = "122.122.122.122"
old_ip = "122.122.111.122"
port = "5555"
prom_url = "http://{ip}:{port}".format(ip=ip, port=port)
grafa_url = "http://localhost:3500"
ds_name = "poseidon"
ds_id = 1

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
                       json={"status": "success"},
                       status_code=200)
    kwargs["mock"].post(
        grafa_url+"/api/datasources",
        json={"message": "Datasource added"},
        status_code=200)
    
    response = app.test_client().post(
        '/api/v1/configure',
        data=json.dumps({'telemetryIP': ip, 'telemetryPort': port})
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
                       json={"status": "success"},
                       status_code=200)
    kwargs["mock"].post(
        grafa_url+"/api/datasources",
        json={
            "message": "data source with the same name already exists",
            "traceID": "00000000000000000000000000000000"
        },
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
        data=json.dumps({'telemetryIP': ip, 'telemetryPort': port})
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
                       json={"status": "success"},
                       status_code=200)
    kwargs["mock"].post(
        grafa_url+"/api/datasources",
        json={
            "message": "data source with the same name already exists",
            "traceID": "00000000000000000000000000000000"
        },
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
                "url": "http://"+old_ip+":"+port,
                "user": "",
                "database": "",
                "basicAuth": False,
                "isDefault": False,
                "jsonData": {},
                "readOnly": False
            }
        ],
        status_code=200)    

    kwargs["mock"].put(
        grafa_url+"/api/datasources/{ds_id}".format(ds_id=ds_id),
        json={"message": "Datasource updated"},
        status_code=200)  
    
    response = app.test_client().post(
        '/api/v1/configure',
        data=json.dumps({'telemetryIP': ip, 'telemetryPort': port})
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
        data=json.dumps({'telemetryIP': ip, 'telemetryPort': port})
    )

    assert response.status_code == 500

@requests_mock.Mocker(kw="mock")
@mock.patch("rest.app.connection_factory.update_telemetry_url",
            return_value=True, autospec=True)
def test_set_telemetry_config_failure_2(mock_update_telemetry_url, **kwargs):
    kwargs["mock"].post(INFLUXDB_URL, text='Success', status_code=204)
    kwargs["mock"].get(prom_url + '/api/v1/status/runtimeinfo',
                       json={"status": "success"},
                       status_code=200)
    kwargs["mock"].post(
        grafa_url+"/api/datasources",
        json={
            "message": "data source with the same name already exists",
            "traceID": "00000000000000000000000000000000"
        },
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
                "url": "http://"+old_ip+":"+port,
                "user": "",
                "database": "",
                "basicAuth": False,
                "isDefault": False,
                "jsonData": {},
                "readOnly": False
            }
        ],
        status_code=200)   

    kwargs["mock"].put(
        grafa_url+"/api/datasources/{ds_id}".format(ds_id=ds_id),
        json={"message": ""},
        status_code=200)  
    
    response = app.test_client().post(
        '/api/v1/configure',
        data=json.dumps({'telemetryIP': ip, 'telemetryPort': port})
    )

    assert response.status_code == 500