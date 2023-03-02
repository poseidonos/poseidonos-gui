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
import os
import pytest
from rest.app import app
import requests_mock
import jwt
import datetime
from unittest import mock
from flask import json

json_token = jwt.encode({'_id': "test", 'exp': datetime.datetime.utcnow(
) + datetime.timedelta(minutes=60)}, app.config['SECRET_KEY'])
ip = os.environ.get('DAGENT_HOST', 'localhost')

DAGENT_URL = 'http://' + ip + ':3000'

#json data

listner_json = '''{
        "name":"nqn.2019-04.pos:subsystem1",
        "transport_type":"tcp",
        "target_address":"111.100.13.97",
        "transport_service_id":"1158"
}'''

subsystem_json = '''{
        "name":"nqn.2019-04.pos:subsystem1",
        "sn": "POS0000000003",
        "mn": "IBOF_VOLUME_EEEXTENSION",
        "max_namespaces": 256,
        "allow_any_host": true
}'''

INFLUXDB_URL = 'http://0.0.0.0:8086/write?db=poseidon&rp=autogen'
ARRAY_NAME = "POSArray"
ARRAY_LIST_URL = DAGENT_URL + '/api/ibofos/v1/arrays'
@pytest.fixture(scope='module')
@mock.patch("rest.app.connection_factory.match_username_from_db",
            return_value="admin", autospec=True)
def global_data(mock_match_username_from_db):
    login_response = app.test_client().post(
        '/api/v1.0/login/',
        data=json.dumps({'username': "admin", 'password': "admin"}),
        content_type='application/json',
    )
    login_data = json.loads(login_response.get_data(as_text=True))
    print("Token :",login_data['token'])

    return {'token': login_data['token']}



@requests_mock.Mocker(kw="mock")
@mock.patch("rest.app.connection_factory.get_current_user",
            return_value="test", autospec=True)
def test_create_transport(mock_get_current_user, **kwargs):
    kwargs["mock"].post(INFLUXDB_URL, text='Success', status_code=204)
    kwargs["mock"].post(DAGENT_URL + '/api/ibofos/v1/transport',
                       json={"result": {"status": {"description": "SUCCESS"},
                                        "data": {"temp": "120C"}}},
                       status_code=200)
    response = app.test_client().post('/api/v1/transport/',
        data='''{
        "transport_type": "tcp",
        "buf_cache_size": 64,
        "num_shared_buf": 4096
		}''',
        headers={'x-access-token': json_token})
    assert response.status_code == 200


@requests_mock.Mocker(kw="mock")
@mock.patch("rest.app.connection_factory.get_current_user",
            return_value="test", autospec=True)
def test_create_transport_failure(mock_get_current_user, **kwargs):
    kwargs["mock"].post(INFLUXDB_URL, text='Success', status_code=204)
    kwargs["mock"].post(DAGENT_URL + '/api/ibofos/v1/transport',
                       json={"rid": "28d51e12-545a-42ee-991d-075cb194a4c8",
    "lastSuccessTime": 1653372795,
    "result": {
        "status": {
            "module": "",
            "code": -32603,
            "description": "",
            "posDescription": "Failed to create transport. INTERNAL_ERROR: : Transport type 'tcp' already exists"
        }}}, status_code=400)
    response = app.test_client().post('/api/v1/transport/',
        data='''{
        "transport_type": "tcp",
        "buf_cache_size": 64,
        "num_shared_buf": 4096
                }''',
        headers={'x-access-token': json_token})
    assert response.status_code == 200

@requests_mock.Mocker(kw="mock")
@mock.patch("rest.app.connection_factory.get_current_user",
            return_value="test", autospec=True)
def test_create_subsystem(mock_get_current_user, **kwargs):
    kwargs["mock"].post(INFLUXDB_URL, text='Success', status_code=204)
    kwargs["mock"].post(DAGENT_URL + '/api/ibofos/v1/subsystem',
                       json={
    "rid": "f581fabb-4cc4-472b-91e7-11afa97bfa22",
    "lastSuccessTime": 1653374568,
    "result": {
        "status": {
            "module": "COMMON",
            "code": 0,
            "level": "INFO",
            "description": "Success",
            "posDescription": "Subsystem ( nqn.2019-04.pos:subsystem13 ) has been created."
        }
    }}, status_code=200)
    response = app.test_client().post('/api/v1/subsystem/',
        data= subsystem_json,
        headers={'x-access-token': json_token})
    assert response.status_code == 200

@requests_mock.Mocker(kw="mock")
@mock.patch("rest.app.connection_factory.get_current_user",
            return_value="test", autospec=True)
def test_create_subsystem_failure(mock_get_current_user, **kwargs):
    kwargs["mock"].post(INFLUXDB_URL, text='Success', status_code=204)
    kwargs["mock"].post(DAGENT_URL + '/api/ibofos/v1/subsystem',
                       json={
    "rid": "a654632c-4f6c-4724-a701-335ae70a196e",
    "lastSuccessTime": 1653375032,
    "result": {
        "status": {
            "module": "",
            "code": -1,
            "description": "",
            "posDescription": "Failed to create subsystem ( nqn.2019-04.pos:subsystem13 ). Suggested subnqn name already exists."
        }
    },
    "info": {
        "version": "v0.11.0-rc4"
    }
}, status_code=400)
    response = app.test_client().post('/api/v1/subsystem/',
        data= subsystem_json,
        headers={'x-access-token': json_token})
    assert response.status_code == 200



@requests_mock.Mocker(kw="mock")
@mock.patch("rest.app.connection_factory.get_current_user",
            return_value="test", autospec=True)
def test_add_listener(mock_get_current_user, **kwargs):
    kwargs["mock"].post(INFLUXDB_URL, text='Success', status_code=204)
    kwargs["mock"].post(DAGENT_URL + '/api/ibofos/v1/listener',
                       json={
    "rid": "ceae8fa7-50c2-4247-9dd0-5f3146e46a54",
    "lastSuccessTime": 1653375647,
    "result": {
        "status": {
            "module": "COMMON",
            "code": 0,
            "level": "INFO",
            "description": "Success",
            "posDescription": "Address ( 107.108.221.146 ) added to Subsystem ( nqn.2019-04.pos:subsystem13 )"
        }
    },
    "info": {
        "version": "v0.11.0-rc4"
    }
}, status_code=200)
    response = app.test_client().post('/api/v1/listener/',
        data=listner_json,
        headers={'x-access-token': json_token})
    assert response.status_code == 200

@requests_mock.Mocker(kw="mock")
@mock.patch("rest.app.connection_factory.get_current_user",
            return_value="test", autospec=True)
def test_add_listener_failure(mock_get_current_user, **kwargs):
    kwargs["mock"].post(INFLUXDB_URL, text='Success', status_code=204)
    kwargs["mock"].post(DAGENT_URL + '/api/ibofos/v1/listener',
                       json={
    "rid": "4f189f46-e15f-4fc9-ab69-5735a9ad5af8",
    "lastSuccessTime": 1653375609,
    "result": {
        "status": {
            "module": "",
            "code": -32602,
            "description": "",
            "posDescription": "Failed to add listener. INVALID_PARAMS: Invalid method parameters (invalid name and/or type) recognised: Invalid parameters"
        }
    },
    "info": {
        "version": "v0.11.0-rc4"
    }
}, status_code=400)
    response = app.test_client().post('/api/v1/listener/',
        data=listner_json,
        headers={'x-access-token': json_token})
    assert response.status_code == 200

@requests_mock.Mocker(kw="mock")
@mock.patch("rest.app.connection_factory.get_current_user",
            return_value="test", autospec=True)
def test_list_subsystem(mock_get_current_user, **kwargs):
    kwargs["mock"].post(INFLUXDB_URL, text='Success', status_code=204)
    kwargs["mock"].get(DAGENT_URL + '/api/ibofos/v1/subsystem',
                       json={
    "rid": "1fdc75f4-663c-49ab-abd2-f1f897e072f8",
    "lastSuccessTime": 1653380398,
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
                            "bdevName": "bdev_0_POSArray",
                            "nsid": 1,
                            "uuid": "f2f3111e-4599-4fba-b65b-aae3c243395b"
                        },
                        {
                            "bdevName": "bdev_1_POSArray",
                            "nsid": 2,
                            "uuid": "e0b8314b-dbfa-45ed-9986-606a45728584"
                        }
                    ],
                    "nqn": "nqn.2019-04.pos:subsystem1",
                    "serial_number": "POS0000000003",
                    "subtype": "NVMe"
                }
                
            ]
        }
    },
    "info": {
        "version": "v0.11.0-rc4"
    }
}, status_code=200)
    response = app.test_client().get('/api/v1/subsystem/',
        headers={'x-access-token': json_token})
    assert response.status_code == 200

@requests_mock.Mocker(kw="mock")
@mock.patch("rest.app.connection_factory.get_current_user",
            return_value="test", autospec=True)
def test_delete_subsystem(mock_get_current_user, **kwargs):
    kwargs["mock"].post(INFLUXDB_URL, text='Success', status_code=204)
    kwargs["mock"].delete(DAGENT_URL + '/api/ibofos/v1/subsystem',
                       json={
    "rid": "b7673aac-42dd-4354-8902-9bc96b525b11",
    "lastSuccessTime": 1653384928,
    "result": {
        "status": {
            "module": "COMMON",
            "code": 0,
            "level": "INFO",
            "description": "Success",
            "posDescription": "Subsystem ( nqn.2019-04.pos:subsystem13) has been deleted."
        }
    },
    "info": {
        "version": "v0.11.0-rc4"
    }
}, status_code=200)
    response = app.test_client().delete('/api/v1/subsystem/',data='''{
        "name":"nqn.2019-04.pos:subsystem13"
}''', headers={'x-access-token': json_token})
    assert response.status_code == 200


@requests_mock.Mocker(kw="mock")
@mock.patch("rest.app.connection_factory.get_current_user",
            return_value="test", autospec=True)
def test_delete_subsystem_failure(mock_get_current_user, **kwargs):
    kwargs["mock"].post(INFLUXDB_URL, text='Success', status_code=204)
    kwargs["mock"].delete(DAGENT_URL + '/api/ibofos/v1/subsystem',
                       json={
    "rid": "cdf47cbd-44ce-4eac-95cc-d20d1c895312",
    "lastSuccessTime": 1653385128,
    "result": {
        "status": {
            "module": "",
            "code": -1,
            "description": "",
            "posDescription": "Failed to delete subsystem. Requested Subsystem does not exist or invalid subnqn. "
        }
    },
    "info": {
        "version": "v0.11.0-rc4"
    }
}, status_code=400)
    response = app.test_client().delete('/api/v1/subsystem/',data='''{
        "name":"nqn.2019-04.pos:subsystem12"
}''', headers={'x-access-token': json_token})
    assert response.status_code == 200



