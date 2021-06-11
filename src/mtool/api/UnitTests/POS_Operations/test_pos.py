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
 *     * Neither the name of Intel Corporation nor the names of its
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

from rest.app import app
import requests_mock
import jwt
import datetime
from unittest import mock
from rest.rest_api.dagent.ibofos import start_ibofos
from bson import json_util
from flask import json

json_token = jwt.encode({'_id': "test", 'exp': datetime.datetime.utcnow(
) + datetime.timedelta(minutes=60)}, app.config['SECRET_KEY'])
ip = os.environ.get('DAGENT_HOST', 'localhost')

DAGENT_URL = 'http://' + ip + ':3000'
INFLUXDB_URL = 'http://0.0.0.0:8086/write?db=poseidon&rp=autogen'

@requests_mock.Mocker(kw="mock")
@mock.patch("rest.app.connection_factory.get_current_user",
            return_value="test", autospec=True)
def test_is_ibofos_running(mock_get_current_user, **kwargs):
    kwargs["mock"].post(INFLUXDB_URL, text='Success', status_code=204)
    kwargs["mock"].get(DAGENT_URL + '/api/ibofos/v1/system',
                       json={"result": {"status": {"description": "SUCCESS",
                       "code":0}}},
                       status_code=200)
    response = app.test_client().get(
        '/api/v1.0/get_Is_Ibof_OS_Running/',
        headers={'x-access-token': json_token})
    assert response.status_code == 200

    kwargs["mock"].get(DAGENT_URL + '/api/ibofos/v1/system',
                       json=None)
    response = app.test_client().get(
        '/api/v1.0/get_Is_Ibof_OS_Running/',
        headers={'x-access-token': json_token})
    assert response.status_code == 200




@requests_mock.Mocker(kw="mock")
@mock.patch("rest.app.connection_factory.get_current_user",
            return_value="test", autospec=True)
@mock.patch("rest.app.fetch_system_state", return_value={'lastSuccessTime':1}, autospec=True)
def test_is_ibofos_running_failure(mock_get_current_user, mock_fetch_system_state,  **kwargs):
    kwargs["mock"].post(INFLUXDB_URL, text='Success', status_code=204)
    kwargs["mock"].get(DAGENT_URL + '/api/dagent/v1/heartbeat',
                       json={"result": {"status": {"description": "SUCCESS", "code":0}}},
                       status_code=200)
    response = app.test_client().get(
        '/api/v1.0/get_Is_Ibof_OS_Running/',
        headers={'x-access-token': json_token})
    assert response.status_code == 200


"""
@requests_mock.Mocker(kw="mock")
@mock.patch("rest.app.get_rebuilding_status",return_value=(), autospec=True)
@mock.patch("rest.app.connection_factory.get_current_user", return_value="test", autospec=True)
def test_is_ibofos_runningi_failure(mock_get_current_user, mock_get_rebuilding_status, **kwargs):
    kwargs["mock"].post(INFLUXDB_URL, text='Success', status_code=204)
    kwargs["mock"].get(DAGENT_URL + '/api/dagent/v1/heartbeat',
                       json={"result": {"status": {"description": "SUCCESS", "code":0}}},
                       status_code=200)
    response = app.test_client().get(
        '/api/v1.0/get_Is_Ibof_OS_Running/',
        headers={'x-access-token': json_token})
    assert response.status_code == 200
"""

@requests_mock.Mocker(kw="mock")
@mock.patch("rest.app.get_ibof_os_status",return_value=False, autospec=True)
@mock.patch("rest.app.is_ibofos_running",return_value=False, autospec=True)
@mock.patch("rest.app.connection_factory.get_current_user",return_value="test", autospec=True)
def test_start_ibofos(mock_get_current_user,mock_get_ibof_os_status,mock_is_ibofos_running, **kwargs):
    kwargs["mock"].post(INFLUXDB_URL, text='Success', status_code=204)
    kwargs["mock"].post(DAGENT_URL + '/api/ibofos/v1/system',
                       json={"result": {"status": {"description": "SUCCESS", "code":0}}},
                       status_code=200)
    kwargs["mock"].get(DAGENT_URL + '/api/ibofos/v1/system',
                       json={"result": {"status": {"description": "SUCCESS",
                       "code":0}}},
                       status_code=200)
    response = app.test_client().get(
        '/api/v1.0/start_ibofos',
        headers={'x-access-token': json_token})

    #data = json.loads(response.get_data(as_text=True))
    print("response ",response.data)

    assert response.status_code == 200
    kwargs["mock"].post(DAGENT_URL + '/api/ibofos/v1/system', json=None, status_code=500)
    response = app.test_client().get(
        '/api/v1.0/start_ibofos',
        headers={'x-access-token': json_token})
    assert response.status_code == 500


@requests_mock.Mocker(kw="mock")
@mock.patch("rest.app.connection_factory.get_current_user",return_value="test", autospec=True)
def test_start_ibofos_dagent_ibofos(mock_get_current_user,**kwargs):
    kwargs["mock"].post(INFLUXDB_URL, text='Success', status_code=204)
    kwargs["mock"].post(DAGENT_URL + '/api/ibofos/v1/system',
                       json={"result": {"status": {"description": "SUCCESS", "code":0}}},
                       status_code=200)
    response = start_ibofos()
    assert response.status_code == 200

@requests_mock.Mocker(kw="mock")
@mock.patch("rest.app.get_ibof_os_status",return_value=False, autospec=True)
@mock.patch("rest.app.connection_factory.get_current_user",return_value="test", autospec=True)
@mock.patch("rest.app.is_ibofos_running",return_value=True, autospec=True)
def test_start_ibofos_already_running_failure(mock_get_current_user, mock_get_ibof_os_status, mock_is_ibofos_running, **kwargs):
    kwargs["mock"].post(INFLUXDB_URL, text='Success', status_code=204)
    kwargs["mock"].post(DAGENT_URL + '/api/ibofos/v1/system',
                       json={"result": {"status": {"description": "", "code":0}}}, status_code=500)

    response = app.test_client().get(
        '/api/v1.0/start_ibofos',
        headers={'x-access-token': json_token})

    #data = json.loads(response.get_data(as_text=True))
    print("response ",response)
    assert response.status_code == 200



@requests_mock.Mocker(kw="mock")
@mock.patch("rest.app.connection_factory.get_current_user",
            return_value="test", autospec=True)
@mock.patch("rest.app.is_ibofos_running",return_value=False, autospec=True)
@mock.patch("rest.app.get_ibof_os_status",return_value=False, autospec=True)
def test_start_ibofos_failure(mock_get_current_user, mock_get_ibof_os_status,mock_is_ibofos_running, **kwargs):
    kwargs["mock"].post(INFLUXDB_URL, text='Success', status_code=204)
    kwargs["mock"].post(DAGENT_URL + '/api/ibofos/v1/system',
                       json={"result": {"status": {"description": "FAIL", "code":20}}},
                       status_code=400)

    response = app.test_client().get(
        '/api/v1.0/start_ibofos',
        headers={'x-access-token': json_token})
    #data = json.loads(response.get_data(as_text=True))
    assert response.status_code == 200
    kwargs["mock"].post(DAGENT_URL + '/api/ibofos/v1/system', json=None, status_code=400)

    response = app.test_client().get(
        '/api/v1.0/start_ibofos',
        headers={'x-access-token': json_token})
    assert response.status_code == 500



@requests_mock.Mocker(kw="mock")
@mock.patch("rest.app.get_ibof_os_status",return_value=False, autospec=True)
@mock.patch("rest.app.connection_factory.get_current_user",return_value="test", autospec=True)
@mock.patch("rest.app.is_ibofos_running",return_value=False, autospec=True)
def test_start_ibofos_already_running(mock_get_current_user,mock_get_ibof_os_statusi, mock_is_ibofos_running,  **kwargs):
    kwargs["mock"].post(INFLUXDB_URL, text='Success', status_code=204)
    kwargs["mock"].post(DAGENT_URL + '/api/ibofos/v1/system',
                       json={"result": {"status": {"description": "SUCCESS", "code":0}}},
                       status_code=200)
    kwargs["mock"].get(DAGENT_URL + '/api/ibofos/v1/array',
                       status_code=200)
    response = app.test_client().get(
        '/api/v1.0/start_ibofos',
        headers={'x-access-token': json_token})

    #data = json.loads(response.get_data(as_text=True))

    assert response.status_code == 200

"""
@requests_mock.Mocker(kw="mock")
@mock.patch("rest.app.connection_factory.get_current_user",
            return_value="test", autospec=True)
@mock.patch("rest.app.is_ibofos_running",return_value=False, autospec=True)
def test_stop_ibofos_already_running(mock_get_current_user,mock_is_ibofos_running, **kwargs):
    kwargs["mock"].post(INFLUXDB_URL, text='Success', status_code=204)
    kwargs["mock"].get(DAGENT_URL + '/api/ibofos/v1/system/mount',
                       status_code=200)
    kwargs["mock"].post(DAGENT_URL + '/api/ibofos/v1/system',
                       json={"result": {"status": {"description": "FAIL", "code":20}}},
                       status_code=400)
    response = app.test_client().get(
        '/api/v1.0/stop_ibofos',
        headers={'x-access-token': json_token})

    #data = json.loads(response.get_data(as_text=True))
    assert response.status_code == 200
"""


@requests_mock.Mocker(kw="mock")
@mock.patch("rest.app.connection_factory.get_current_user",
            return_value="test", autospec=True)
@mock.patch("rest.app.IBOF_OS_Running.Is_Ibof_Os_Running_Flag",
            return_value=True, autospec=True)
@mock.patch("rest.app.is_ibofos_running",return_value=False, autospec=True)
def test_stop_ibofos(mock_get_current_user,mock_Is_Ibof_Os_Running_Flag, mock_is_ibofos_running, **kwargs):
    kwargs["mock"].post(INFLUXDB_URL, text='Success', status_code=204)
    kwargs["mock"].delete(DAGENT_URL + '/api/ibofos/v1/system/mount',
                       json={"result": {"status": {"description": "SUCCESS", "code":0}}},
                       status_code=200)



    kwargs["mock"].delete(DAGENT_URL + '/api/ibofos/v1/system',
                       json={"result": {"status": {"description": "SUCCESS", "code":0}}},
                       status_code=200)

    response = app.test_client().get(
        '/api/v1.0/stop_ibofos',
        headers={'x-access-token': json_token})

    #data = json.loads(response.get_data(as_text=True))
    print("response ",response.data)
    assert response.status_code == 200


@requests_mock.Mocker(kw="mock")
@mock.patch("rest.app.connection_factory.get_current_user",
            return_value="test", autospec=True)
@mock.patch("rest.app.IBOF_OS_Running.Is_Ibof_Os_Running_Flag",
            return_value=True, autospec=True)
@mock.patch("rest.app.is_ibofos_running",return_value=False, autospec=True)
def test_stop_ibofos_failure(mock_get_current_user,mock_Is_Ibof_Os_Running_Flag, mock_is_ibofos_running, **kwargs):
    kwargs["mock"].post(INFLUXDB_URL, text='Success', status_code=204)
    kwargs["mock"].delete(DAGENT_URL + '/api/ibofos/v1/system',
                       json={"result": {"status": {"description": "FAIL", "code":0}}},
                       status_code=400)

    response = app.test_client().get(
        '/api/v1.0/stop_ibofos',
        headers={'x-access-token': json_token})

    #data = json.loads(response.get_data(as_text=True))
    assert response.status_code == 200

    kwargs["mock"].delete(DAGENT_URL + '/api/ibofos/v1/system',
                       json=None, status_code=500)

    response = app.test_client().get(
        '/api/v1.0/stop_ibofos',
        headers={'x-access-token': json_token})

    #data = json.loads(response.get_data(as_text=True))
    assert response.status_code == 200

