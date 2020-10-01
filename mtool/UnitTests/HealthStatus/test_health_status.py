from rest.app import app
import jwt
import os
import datetime
import requests_mock
from unittest import mock
import json
from requests.exceptions import HTTPError

json_token = jwt.encode({'_id': "test", 'exp': datetime.datetime.utcnow(
) + datetime.timedelta(minutes=60)}, app.config['SECRET_KEY'])
ip = os.environ.get('DAGENT_HOST', 'localhost')
port = '3000'

DAGENT_URL = 'http://' + ip + ':' + port


@requests_mock.Mocker(kw="mock")
@mock.patch("rest.app.connection_factory.get_current_user",
            return_value="test", autospec=True)                       
def test_getHealthStatus(mock_get_current_user, **kwargs):
    kwargs["mock"].get(DAGENT_URL + '/api/metric/v1/cpu/15m',
                       json={"result": {"status": {"description": "SUCCESS"},
                                        "data": [{
                                            "time": 123456789,
                                            "cpuUsagePercent": 10
                                            },{"time": 1601531640000000000,"cpuUsagePercent": 9.61057635612553},{
                "time": 1601531700000000000,
                "cpuUsagePercent": 9.623660376562308
            }]}}, status_code=200)

    kwargs["mock"].get(DAGENT_URL + '/api/metric/v1/memory/15m',
                       json={"result": {"status": {"description": "SUCCESS"},
                                        "data": [{
                                            "time": 123456789,
                                            "memoryUsagePercent": 10
                                            },{"time": 1601531640000000000,"memoryUsagePercent": 9.61057635612553},{
                "time": 1601531700000000000,
                "memoryUsagePercent": 9.623660376562308
            }]}}, status_code=200)

    kwargs["mock"].get(DAGENT_URL + '/api/metric/v1/latency/15m',
                       json={"result": {"status": {"description": "SUCCESS"},
                                        "data": [{
                                            "time": 123456789,
                                            "latency": 565645
                                            },{"time": 1601531640000000000,"latency": 93434},{
                "time": 1601531700000000000,
                "latency": 900
            }]}}, status_code=200)

    kwargs["mock"].get(DAGENT_URL + '/api/metric/v1/latency/',
                       json={"result": {"status": {"description": "SUCCESS"},
                                        "data": [{
                                            "time": 123456789,
                                            "latency": 565645
                                            }]}}, status_code=200)

    response = app.test_client().get(
        '/api/v1.0/health_status/',
        headers={'x-access-token': json_token})
    print("Response :",response)	

    data = json.loads(response.get_data(as_text=True))
    print("Data ",data,type(data))
    assert response.status_code == 200
    assert data["statuses"][0]["name"] == "cpu"
    assert data["statuses"][1]["name"] == "memory"
    assert data["statuses"][2]["name"] == "latency"



