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
 
from rest.app import app, getHealthStatus
#from rest.app import getHealthStatus
import jwt
import os
import datetime
import requests_mock
from unittest import mock

json_token = jwt.encode({'_id': "test", 'exp': datetime.datetime.utcnow(
) + datetime.timedelta(minutes=60)}, app.config['SECRET_KEY'])
ip = os.environ.get('DAGENT_HOST', 'localhost')
port = '3000'

DAGENT_URL = 'http://' + ip + ':' + port
INFLUXDB_URL = 'http://0.0.0.0:8086/write?db=poseidon&rp=autogen'

@requests_mock.Mocker(kw="mock")
@mock.patch("rest.app.connection_factory.get_current_user",
            return_value="test", autospec=True)                       
def test_getHealthStatus(mock_get_current_user, **kwargs): #time unit : nano sec
    kwargs["mock"].post(INFLUXDB_URL, text='Success', status_code=204)
    kwargs["mock"].get(DAGENT_URL + '/api/metric/v1/cpu/15m',
                       json={"result": {"status": {"description": "SUCCESS"},
                                        "data": [[{
                                            "time": 123456789,
                                            "cpuUsagePercent": 10
                                            },{"time": 1601531640000000000,"cpuUsagePercent": 9.61057635612553},{
                "time": 1601531700000000000,
                "cpuUsagePercent": 9.623660376562308
            }]]}}, status_code=200)

    kwargs["mock"].get(DAGENT_URL + '/api/metric/v1/memory/15m',
                       json={"result": {"status": {"description": "SUCCESS"},
                                        "data": [[{
                                            "time": 123456789,
                                            "memoryUsagePercent": 10
                                            },{"time": 1601531640000000000,"memoryUsagePercent": 9.61057635612553},{
                "time": 1601531700000000000,
                "memoryUsagePercent": 9.623660376562308
            }]]}}, status_code=200)

    kwargs["mock"].get(DAGENT_URL + '/api/metric/v1/latency/15m',
                       json={"result": {"status": {"description": "SUCCESS"},
                                        "data":[ [{
                                            "time": 123456789,
                                            "latency": 565645
                                            },{"time": 1601531640000000000,"latency": 93434},{
                "time": 1601531700000000000,
                "latency": 900
            }]]}}, status_code=200)

    kwargs["mock"].get(DAGENT_URL + '/api/metric/v1/latency/',
                       json={"result": {"status": {"description": "SUCCESS"},
                                        "data": [[{
                                            "time": 123456789,
                                            "latency": 565645
                                            }]]}}, status_code=200)

    """response = app.test_client().get(
        '/api/v1.0/health_status/',
        headers={'x-access-token': json_token})"""
    data = getHealthStatus()
    assert len(data["statuses"]) > 0

@requests_mock.Mocker(kw="mock")
@mock.patch("rest.app.connection_factory.get_current_user",
            return_value="test", autospec=True)
def test_getHealthStatus_different_values(mock_get_current_user, **kwargs): #time unit : nano sec
    kwargs["mock"].post(INFLUXDB_URL, text='Success', status_code=204)
    kwargs["mock"].get(DAGENT_URL + '/api/metric/v1/cpu/15m',
                       json={"result": {"status": {"description": "SUCCESS"},
                                        "data": [[{
                                            "time": 123456789,
                                            "cpuUsagePercent": 45
                                            },{"time": 1601531640000000000,"cpuUsagePercent": 49.61057635612553},{
                "time": 1601531700000000000,
                "cpuUsagePercent": 49.623660376562308
            }]]}}, status_code=200)

    kwargs["mock"].get(DAGENT_URL + '/api/metric/v1/memory/15m',
                       json={"result": {"status": {"description": "SUCCESS"},
                                        "data": [[{
                                            "time": 123456789,
                                            "memoryUsagePercent": 55
                                            },{"time": 1601531640000000000,"memoryUsagePercent": 59.61057635612553},{
                "time": 1601531700000000000,
                "memoryUsagePercent": 59.623660376562308
            }]]}}, status_code=200)
    kwargs["mock"].get(DAGENT_URL + '/api/metric/v1/latency/15m',
                       json={"result": {"status": {"description": "SUCCESS"},
                                        "data": [[{
                                            "time": 123456789,
                                            "latency": 9565645
                                            },{"time": 1601531640000000000,"latency": 9993434},{
                "time": 1601531700000000000,
                "latency": 99900
            }]]}}, status_code=200)

    kwargs["mock"].get(DAGENT_URL + '/api/metric/v1/latency/',
                       json={"result": {"status": {"description": "SUCCESS"},
                                        "data": [[{
                                            "time": 123456789,
                                            "latency": 565645
                                            }]]}}, status_code=200)

    """response = app.test_client().get(
        '/api/v1.0/health_status/',
        headers={'x-access-token': json_token})"""

    data = getHealthStatus()
    assert len(data["statuses"]) > 0

@requests_mock.Mocker(kw="mock")
@mock.patch("rest.app.connection_factory.get_current_user",
            return_value="test", autospec=True)
def test_getHealthStatus_with_empty_result(mock_get_current_user, **kwargs): #time unit : nano sec
    kwargs["mock"].post(INFLUXDB_URL, text='Success', status_code=204)
    kwargs["mock"].get(DAGENT_URL + '/api/metric/v1/cpu/15m',
                       json={"result": {"status": {"description": "SUCCESS"},
                                        "data": []}}, status_code=200)

    kwargs["mock"].get(DAGENT_URL + '/api/metric/v1/memory/15m',
                       json={"result": {"status": {"description": "SUCCESS"},
                                        "data": []}}, status_code=200)

    kwargs["mock"].get(DAGENT_URL + '/api/metric/v1/latency/15m',
                       json={"result": {"status": {"description": "SUCCESS"},
                                        "data": []}}, status_code=200)
    kwargs["mock"].get(DAGENT_URL + '/api/metric/v1/latency/',
                       json={"result": {"status": {"description": "SUCCESS"},
                                        "data": []}}, status_code=200)

    """response = app.test_client().get(
        '/api/v1.0/health_status/',
        headers={'x-access-token': json_token})
    #data = json.loads(response.get_data(as_text=True))
    assert response.status_code == 200

    kwargs["mock"].get(DAGENT_URL + '/api/metric/v1/memory/15m',
                       json=None, status_code=200)

    response = app.test_client().get(
        '/api/v1.0/health_status/',
        headers={'x-access-token': json_token})
    #data = json.loads(response.get_data(as_text=True))
    assert response.status_code == 200
	"""
    data = getHealthStatus()
    assert len(data["statuses"]) == 0

