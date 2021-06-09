
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
INFLUXDB_URL = 'http://0.0.0.0:8086/write?db=poseidon&rp=autogen'
DAGENT_ARRAY_URL = DAGENT_URL + '/api/metric/v1/{}/arrays?arrayids=0&time={}'
MTOOL_ARRAY_URL = '/api/v1/{}/arrays?arrayids=0&time={}'
DAGENT_VOLUME_URL = DAGENT_URL + '/api/metric/v1/{}/arrays/volumes?arrayids=0&volumeids=0&time={}'
MTOOL_VOLUME_URL = '/api/v1/{}/arrays/volumes?arrayids=0&volumeids=0&time={}'

class InfluxMock:
    '''
    def get_connection(self):
        print("influxDB connection Established")
        return self
        '''
    def __init__(self):
        self.dbquery = ""
    
    def query(self, query):
        self.dbquery = query
        return self

    def close(self):
        return self

    def get_points(self):
        if "cpu" in self.dbquery and "1m" in self.dbquery:
            return [{
                "time": "152635612776125", #time unit : nano sec
                "usage_user": 20
            }]
        if "cpu" in self.dbquery and "7d" in self.dbquery:
            return [{
                "time": "12736487678236",
                "mean_usage_user": 10
            }]
        if "iops_read" in self.dbquery and "1m" in self.dbquery:
            return [{
                "mean_perf_data_0_tid_arr_0_aid_arr_0_iops_read": 100,
                "time": "12345678236",
                "mean_perf_data_0_tid_arr_0_aid_arr_0_aid": 0
            }]
        if "iops_read" in self.dbquery and "15m" in self.dbquery:
            return[{
                "mean_perf_data_0_tid_arr_0_aid_arr_0_iops_read": 100,
                "time": "12345678236",
                "mean_perf_data_0_tid_arr_0_aid_arr_0_aid": 0
            }]
        if "iops_read" in self.dbquery and "7d" in self.dbquery:
            return[{
                "mean_perf_data_0_tid_arr_0_aid_arr_0_iops_read": 100,
                "time": "12345678236",
                "mean_perf_data_0_tid_arr_0_aid_arr_0_aid": 0
            }]
        return []


@requests_mock.Mocker(kw="mock")
@mock.patch("rest.app.connection_factory.get_current_user",
            return_value="test", autospec=True)
def test_get_cpu_usage(mock_get_current_user, **kwargs): #time unit : nano sec
    kwargs["mock"].post(INFLUXDB_URL, text='Success', status_code=204)
    kwargs["mock"].get(DAGENT_URL + '/api/metric/v1/cpu/1m',
                       json={"result": {"status": {"description": "SUCCESS"},
                                        "data": [{
                                            "time": 123456789,
                                            "usageUser": 10
                                            }]}},
                       status_code=200)
    kwargs["mock"].get(DAGENT_URL + '/api/metric/v1/cpu/7d',
                       status_code=500)
    kwargs["mock"].get(DAGENT_URL + '/api/metric/v1/cpu/12h',
                       json="test",
                       status_code=200)

    response = app.test_client().get(
        '/api/v1.0/usage_user/1m',
        headers={'x-access-token': json_token})
    assert response.status_code == 200
    response = app.test_client().get(
        '/api/v1.0/usage_user/7d',
        headers={'x-access-token': json_token})
    data = json.loads(response.get_data())
    assert data == []
    assert response.status_code == 200
    response = app.test_client().get(
        '/api/v1.0/usage_user/12h',
        headers={'x-access-token': json_token})
    data = json.loads(response.get_data())
    assert data == []
    assert response.status_code == 200

@requests_mock.Mocker(kw="mock")
@mock.patch("rest.app.connection_factory.get_current_user",
            return_value="test", autospec=True)
def test_get_cpu_usage_failure(mock_get_current_user, **kwargs): #time unit : nano sec
    kwargs["mock"].post(INFLUXDB_URL, text='Success', status_code=204)
    kwargs["mock"].get(DAGENT_URL + '/api/metric/v1/cpu/1m',
                       json={"result": {"status": {"description": "SUCCESS"},
                                        "data": [{
                                            "time": 123456789,
                                            "usageUser": 10
                                            }]}},
                       status_code=200)
    kwargs["mock"].get(DAGENT_URL + '/api/metric/v1/cpu/7d',
                       status_code=500)
    kwargs["mock"].get(DAGENT_URL + '/api/metric/v1/cpu/12h',
                       json="test",
                       status_code=200)
    response = app.test_client().get(
        '/api/v1.0/usage_user/1',
        headers={'x-access-token': json_token})
    assert response.status_code == 404



@requests_mock.Mocker(kw="mock")
@mock.patch("rest.app.connection_factory.get_current_user",
            return_value="test", autospec=True)
def test_get_read_iops(mock_get_current_user, **kwargs): #time unit : nano sec
    kwargs["mock"].post(INFLUXDB_URL, text='Success', status_code=204)
    kwargs["mock"].get(DAGENT_ARRAY_URL.format("readiops","1m"),
                       json={"result": {"status": {"description": "SUCCESS"},
                                        "data": [{
                                            "time": 123456789,
                                            "usageUser": 10
                                            }]}},
                       status_code=200)
    kwargs["mock"].get(DAGENT_ARRAY_URL.format("readiops","7d"),
                       status_code=500)
    kwargs["mock"].get(DAGENT_ARRAY_URL.format("readiops","12h"),
                       json="test",
                       status_code=200)
    kwargs["mock"].get(DAGENT_ARRAY_URL.format("readiops","30d"),
                       exc=HTTPError)
    response = app.test_client().get(MTOOL_ARRAY_URL.format("readiops","1m"), headers={'x-access-token': json_token})
    assert response.status_code == 200

    response = app.test_client().get(MTOOL_ARRAY_URL.format("readiops","7d"), headers={'x-access-token': json_token})
    assert response.status_code == 200

    response = app.test_client().get(MTOOL_ARRAY_URL.format("readiops","12h"), headers={'x-access-token': json_token})
    assert response.status_code == 200

    response = app.test_client().get(MTOOL_ARRAY_URL.format("readiops","30d"), headers={'x-access-token': json_token})
    assert response.status_code == 200

@requests_mock.Mocker(kw="mock")
@mock.patch("rest.app.connection_factory.get_current_user",
            return_value="test", autospec=True)
def test_get_read_iops_failure(mock_get_current_user, **kwargs):
    kwargs["mock"].post(INFLUXDB_URL, text='Success', status_code=204)
    kwargs["mock"].get(DAGENT_ARRAY_URL.format("readiops","1m"),
                       json={"result": {"status": {"description": "SUCCESS"},
                                        "data": [{
                                            "time": 123456789,
                                            "usageUser": 10
                                            }]}},
                       status_code=200)
    kwargs["mock"].get(DAGENT_ARRAY_URL.format("readiops","7d"), status_code=500)
    kwargs["mock"].get(DAGENT_ARRAY_URL.format("readiops","12d"), json="test", status_code=200)
    kwargs["mock"].get(DAGENT_ARRAY_URL.format("readiops","30d"), exc=HTTPError)
    response = app.test_client().get('/api/v1/readiops/1/arrays?arrayids=0',
        headers={'x-access-token': json_token})
    print("response ",response)
    assert response.status_code == 404


@requests_mock.Mocker(kw="mock")
@mock.patch("rest.app.connection_factory.get_current_user",
            return_value="test", autospec=True)
def test_get_vol_read_iops(mock_get_current_user, **kwargs): #time unit : nano sec
    kwargs["mock"].post(INFLUXDB_URL, text='Success', status_code=204)
    kwargs["mock"].get(DAGENT_VOLUME_URL.format("readiops","1m"),
                       json={"result": {"status": {"description": "SUCCESS"},
                                        "data": [{
                                            "time": 123456789,
                                            "usageUser": 10
                                            }]}},
                       status_code=200)
    kwargs["mock"].get(DAGENT_VOLUME_URL.format("readiops","7d"),
                       status_code=500)
    kwargs["mock"].get(DAGENT_VOLUME_URL.format("readiops","12h"),
                       json="test",
                       status_code=200)
    kwargs["mock"].get(DAGENT_VOLUME_URL.format("readiops","30d"),
                        exc=HTTPError)
    response = app.test_client().get(MTOOL_VOLUME_URL.format("readiops","1m"), headers={'x-access-token': json_token})
    assert response.status_code == 200

    response = app.test_client().get(MTOOL_VOLUME_URL.format("readiops","7d"), headers={'x-access-token': json_token})
    assert response.status_code == 200

    response = app.test_client().get(MTOOL_VOLUME_URL.format("readiops","12h"), headers={'x-access-token': json_token})
    assert response.status_code == 200

    response = app.test_client().get(MTOOL_VOLUME_URL.format("readiops","30d"), headers={'x-access-token': json_token})
    assert response.status_code == 200


@requests_mock.Mocker(kw="mock")
@mock.patch("rest.app.connection_factory.get_current_user",
            return_value="test", autospec=True)
def test_get_write_iops(mock_get_current_user, **kwargs):
    kwargs["mock"].post(INFLUXDB_URL, text='Success', status_code=204)
    kwargs["mock"].get(DAGENT_ARRAY_URL.format("writeiops","1m"),
                       json={"result": {"status": {"description": "SUCCESS"},
                                        "data": [{
                                            "time": 123456789,
                                            "usageUser": 10
                                            }]}},
                       status_code=200)
    kwargs["mock"].get(DAGENT_ARRAY_URL.format("writeiops","7d"),
                       status_code=500)
    kwargs["mock"].get(DAGENT_ARRAY_URL.format("writeiops","12h"),
                       json="test",
                       status_code=200)
    kwargs["mock"].get(DAGENT_ARRAY_URL.format("writeiops","30d"),
                        exc=HTTPError)
    response = app.test_client().get(MTOOL_ARRAY_URL.format("writeiops","1m"), headers={'x-access-token': json_token})
    assert response.status_code == 200

    response = app.test_client().get(MTOOL_ARRAY_URL.format("writeiops","7d"), headers={'x-access-token': json_token})
    assert response.status_code == 200

    response = app.test_client().get(MTOOL_ARRAY_URL.format("writeiops","12h"), headers={'x-access-token': json_token})
    assert response.status_code == 200

    response = app.test_client().get(MTOOL_ARRAY_URL.format("writeiops","30d"), headers={'x-access-token': json_token})
    assert response.status_code == 200

@requests_mock.Mocker(kw="mock")
@mock.patch("rest.app.connection_factory.get_current_user",
            return_value="test", autospec=True)
def test_get_write_iops_failure(mock_get_current_user, **kwargs):
    kwargs["mock"].post(INFLUXDB_URL, text='Success', status_code=204)
    kwargs["mock"].get(DAGENT_ARRAY_URL.format("writeiops","1m"),
                       json={"result": {"status": {"description": "SUCCESS"},
                                        "data": [{
                                            "time": 123456789,
                                            "usageUser": 10
                                            }]}},
                       status_code=200)
    kwargs["mock"].get(DAGENT_ARRAY_URL.format("writeiops","7d"),
                       status_code=500)
    kwargs["mock"].get(DAGENT_ARRAY_URL.format("writeiops","12h"),
                       json="test",
                       status_code=200)
    kwargs["mock"].get(DAGENT_ARRAY_URL.format("writeiops","30d"),
                        exc=HTTPError)
    response = app.test_client().get(
        '/api/v1.0/iops_write/1/array',
        headers={'x-access-token': json_token})
    assert response.status_code == 404


@requests_mock.Mocker(kw="mock")
@mock.patch("rest.app.connection_factory.get_current_user",
            return_value="test", autospec=True)
def test_get_vol_write_iops(mock_get_current_user, **kwargs):
    kwargs["mock"].post(INFLUXDB_URL, text='Success', status_code=204)
    kwargs["mock"].get(DAGENT_VOLUME_URL.format("writeiops","1m"),
                       json={"result": {"status": {"description": "SUCCESS"},
                                        "data": [{
                                            "time": 123456789,
                                            "usageUser": 10
                                            }]}},
                       status_code=200)
    kwargs["mock"].get(DAGENT_VOLUME_URL.format("writeiops","7d"), status_code=500)
    kwargs["mock"].get(DAGENT_VOLUME_URL.format("writeiops","12h"), json="test", status_code=200)
    kwargs["mock"].get(DAGENT_VOLUME_URL.format("writeiops","30d"), exc=HTTPError)

    response = app.test_client().get(MTOOL_VOLUME_URL.format("writeiops","1m"), headers={'x-access-token': json_token})
    assert response.status_code == 200

    response = app.test_client().get(MTOOL_VOLUME_URL.format("writeiops","7d"), headers={'x-access-token': json_token})
    assert response.status_code == 200

    response = app.test_client().get(MTOOL_VOLUME_URL.format("writeiops","12h"), headers={'x-access-token': json_token})
    assert response.status_code == 200

    response = app.test_client().get(MTOOL_VOLUME_URL.format("writeiops","30d"), headers={'x-access-token': json_token})
    assert response.status_code == 200


@requests_mock.Mocker(kw="mock")
@mock.patch("rest.app.connection_factory.get_current_user",
            return_value="test", autospec=True)
def test_get_read_bw(mock_get_current_user, **kwargs):
    kwargs["mock"].post(INFLUXDB_URL, text='Success', status_code=204)
    kwargs["mock"].get(DAGENT_ARRAY_URL.format("readbw","1m"),
                       json={"result": {"status": {"description": "SUCCESS"},
                                        "data": [{
                                            "time": 123456789,
                                            "usageUser": 10
                                            }]}},
                       status_code=200)
    kwargs["mock"].get(DAGENT_ARRAY_URL.format("readbw","7d"),
                       status_code=500)
    kwargs["mock"].get(DAGENT_ARRAY_URL.format("readbw","12h"),
                       json="test",
                       status_code=200)
    kwargs["mock"].get(DAGENT_ARRAY_URL.format("readbw","30d"),
                        exc=HTTPError)
    response = app.test_client().get(MTOOL_ARRAY_URL.format("readbw","1m"),
        headers={'x-access-token': json_token})
    assert response.status_code == 200

    response = app.test_client().get(MTOOL_ARRAY_URL.format("readbw","7d"),
        headers={'x-access-token': json_token})
    assert response.status_code == 200

    response = app.test_client().get(MTOOL_ARRAY_URL.format("readbw","12h"),
        headers={'x-access-token': json_token})
    assert response.status_code == 200

    response = app.test_client().get(MTOOL_ARRAY_URL.format("readbw","30d"),
        headers={'x-access-token': json_token})
    assert response.status_code == 200


@requests_mock.Mocker(kw="mock")
@mock.patch("rest.app.connection_factory.get_current_user",
            return_value="test", autospec=True)
def test_get_read_bw_failure(mock_get_current_user, **kwargs):
    kwargs["mock"].post(INFLUXDB_URL, text='Success', status_code=204)
    kwargs["mock"].get(DAGENT_ARRAY_URL.format("readbw","1m"),
                       json={"result": {"status": {"description": "SUCCESS"},
                                        "data": [{
                                            "time": 123456789,
                                            "usageUser": 10
                                            }]}},
                       status_code=200)
    kwargs["mock"].get(DAGENT_ARRAY_URL.format("readbw","7d"),
                       status_code=500)
    kwargs["mock"].get(DAGENT_ARRAY_URL.format("readbw","12h"),
                       json="test",
                       status_code=200)
    kwargs["mock"].get(DAGENT_ARRAY_URL.format("readbw","30d"),
                        exc=HTTPError)
    response = app.test_client().get(
        '/api/v1.0/bw_read/1/array',
        headers={'x-access-token': json_token})
    assert response.status_code == 404


@requests_mock.Mocker(kw="mock")
@mock.patch("rest.app.connection_factory.get_current_user",
            return_value="test", autospec=True)
def test_get_vol_read_bw(mock_get_current_user, **kwargs):
    kwargs["mock"].post(INFLUXDB_URL, text='Success', status_code=204)
    kwargs["mock"].get(DAGENT_VOLUME_URL.format("readbw","1m"),
                       json={"result": {"status": {"description": "SUCCESS"},
                                        "data": [{
                                            "time": 123456789,
                                            "usageUser": 10
                                            }]}},
                       status_code=200)
    kwargs["mock"].get(DAGENT_VOLUME_URL.format("readbw","7d"),
                       status_code=500)
    kwargs["mock"].get(DAGENT_VOLUME_URL.format("readbw","12h"),
                       json="test",
                       status_code=200)
    kwargs["mock"].get(DAGENT_VOLUME_URL.format("readbw","30d"),
                       exc=HTTPError)
    response = app.test_client().get(MTOOL_VOLUME_URL.format("readbw","1m"), headers={'x-access-token': json_token})
    assert response.status_code == 200

    response = app.test_client().get(MTOOL_VOLUME_URL.format("readbw","7d"), headers={'x-access-token': json_token})
    assert response.status_code == 200

    response = app.test_client().get(MTOOL_VOLUME_URL.format("readbw","12h"), headers={'x-access-token': json_token})
    assert response.status_code == 200

    response = app.test_client().get(MTOOL_VOLUME_URL.format("readbw","30d"), headers={'x-access-token': json_token})
    assert response.status_code == 200



@requests_mock.Mocker(kw="mock")
@mock.patch("rest.app.connection_factory.get_current_user",
            return_value="test", autospec=True)
def test_get_write_bw(mock_get_current_user, **kwargs):
    kwargs["mock"].post(INFLUXDB_URL, text='Success', status_code=204)
    kwargs["mock"].get(DAGENT_ARRAY_URL.format("writebw","1m"),
                       json={"result": {"status": {"description": "SUCCESS"},
                                        "data": [{
                                            "time": 123456789,
                                            "usageUser": 10
                                            }]}},
                       status_code=200)
    kwargs["mock"].get(DAGENT_ARRAY_URL.format("writebw","30d"), exc=HTTPError)
    kwargs["mock"].get(DAGENT_ARRAY_URL.format("writebw","7d"), status_code=500)
    kwargs["mock"].get(DAGENT_ARRAY_URL.format("writebw","12h"), json="test", status_code=200)
    response = app.test_client().get(MTOOL_ARRAY_URL.format("writebw","1m"), headers={'x-access-token': json_token})
    assert response.status_code == 200

    response = app.test_client().get(MTOOL_ARRAY_URL.format("writebw","7d"), headers={'x-access-token': json_token})
    assert response.status_code == 200

    response = app.test_client().get(MTOOL_ARRAY_URL.format("writebw","12h"), headers={'x-access-token': json_token})
    assert response.status_code == 200

    response = app.test_client().get(MTOOL_ARRAY_URL.format("writebw","30d"), headers={'x-access-token': json_token})
    assert response.status_code == 200

@requests_mock.Mocker(kw="mock")
@mock.patch("rest.app.connection_factory.get_current_user",
            return_value="test", autospec=True)
def test_get_write_bw_failure(mock_get_current_user, **kwargs):
    kwargs["mock"].post(INFLUXDB_URL, text='Success', status_code=204)
    kwargs["mock"].get(DAGENT_ARRAY_URL.format("writebw","1m"),
                       json={"result": {"status": {"description": "SUCCESS"},
                                        "data": [{
                                            "time": 123456789,
                                            "usageUser": 10
                                            }]}},
                       status_code=200)
    kwargs["mock"].get(DAGENT_ARRAY_URL.format("writebw","30d"),
                        exc=HTTPError)
    kwargs["mock"].get(DAGENT_ARRAY_URL.format("writebw","7d"),
                       status_code=500)
    kwargs["mock"].get(DAGENT_ARRAY_URL.format("writebw","12h"),
                       json="test",
                       status_code=200)
    response = app.test_client().get(
        '/api/v1.0/bw_write/1/array',
        headers={'x-access-token': json_token})
    assert response.status_code == 404


@requests_mock.Mocker(kw="mock")
@mock.patch("rest.app.connection_factory.get_current_user",
            return_value="test", autospec=True)
def test_get_vol_write_bw(mock_get_current_user, **kwargs):
    kwargs["mock"].post(INFLUXDB_URL, text='Success', status_code=204)
    kwargs["mock"].get(DAGENT_VOLUME_URL.format("writebw","1m"),
                       json={"result": {"status": {"description": "SUCCESS"},
                                        "data": [{
                                            "time": 123456789,
                                            "usageUser": 10
                                            }]}},
                       status_code=200)
    kwargs["mock"].get(DAGENT_VOLUME_URL.format("writebw","7d"), status_code=500)
    kwargs["mock"].get(DAGENT_VOLUME_URL.format("writebw","12h"), json="test", status_code=200)
    kwargs["mock"].get(DAGENT_VOLUME_URL.format("writebw","30d"), exc=HTTPError)
    response = app.test_client().get(MTOOL_VOLUME_URL.format("writebw","1m"), headers={'x-access-token': json_token})
    assert response.status_code == 200

    response = app.test_client().get(MTOOL_VOLUME_URL.format("writebw","7d"), headers={'x-access-token': json_token})
    assert response.status_code == 200

    response = app.test_client().get(MTOOL_VOLUME_URL.format("writebw","12h"), headers={'x-access-token': json_token})
    assert response.status_code == 200

    response = app.test_client().get(MTOOL_VOLUME_URL.format("writebw","30d"), headers={'x-access-token': json_token})
    assert response.status_code == 200



@requests_mock.Mocker(kw="mock")
@mock.patch("rest.app.connection_factory.get_current_user",
            return_value="test", autospec=True)
def test_get_vol_latency(mock_get_current_user, **kwargs):
    kwargs["mock"].post(INFLUXDB_URL, text='Success', status_code=204)
    kwargs["mock"].get(DAGENT_VOLUME_URL.format("latency","1m"),
                       json={"result": {"status": {"description": "SUCCESS"},
                                        "data": [{
                                            "time": 123456789,
                                            "usageUser": 10
                                            }]}},
                       status_code=200)
    kwargs["mock"].get(DAGENT_VOLUME_URL.format("latency","7d"), status_code=500)
    kwargs["mock"].get(DAGENT_VOLUME_URL.format("latency","12h"), json="test", status_code=200)
    kwargs["mock"].get(DAGENT_VOLUME_URL.format("latency","30d"), exc=HTTPError)
    response = app.test_client().get(MTOOL_VOLUME_URL.format("latency","1m"), headers={'x-access-token': json_token})
    assert response.status_code == 200

    response = app.test_client().get(MTOOL_VOLUME_URL.format("latency","7d"), headers={'x-access-token': json_token})
    assert response.status_code == 200

    response = app.test_client().get(MTOOL_VOLUME_URL.format("latency","12h"), headers={'x-access-token': json_token})
    assert response.status_code == 200

    response = app.test_client().get(MTOOL_VOLUME_URL.format("latency","30d"), headers={'x-access-token': json_token})
    assert response.status_code == 200


@requests_mock.Mocker(kw="mock")
@mock.patch("rest.app.connection_factory.get_current_user",
            return_value="test", autospec=True)
def test_get_vol_latency_failure(mock_get_current_user, **kwargs):
    kwargs["mock"].post(INFLUXDB_URL, text='Success', status_code=204)
    kwargs["mock"].get(DAGENT_VOLUME_URL.format("latency","1m"),
                       json={"result": {"status": {"description": "SUCCESS"},
                                        "data": [{
                                            "time": 123456789,
                                            "usageUser": 10
                                            }]}},
                       status_code=200)
    kwargs["mock"].get(DAGENT_VOLUME_URL.format("latency","7d"), status_code=500)
    kwargs["mock"].get(DAGENT_VOLUME_URL.format("latency","12h"), json="test", status_code=200)
    kwargs["mock"].get(DAGENT_VOLUME_URL.format("latency","30d"), exc=HTTPError)
    response = app.test_client().get(
        '/api/v1/latency/1/0',
        headers={'x-access-token': json_token})
    assert response.status_code == 404


@requests_mock.Mocker(kw="mock")
@mock.patch("rest.app.connection_factory.get_current_user",
            return_value="test", autospec=True)
def test_get_latency(mock_get_current_user, **kwargs):
    kwargs["mock"].post(INFLUXDB_URL, text='Success', status_code=204)
    kwargs["mock"].get(DAGENT_ARRAY_URL.format("latency","1m"),
                       json={"result": {"status": {"description": "SUCCESS"},
                                        "data": [{
                                            "time": 123456789,
                                            "usageUser": 10
                                            }]}},
                       status_code=200)
    kwargs["mock"].get(DAGENT_ARRAY_URL.format("latency","7d"),
                       status_code=500)
    kwargs["mock"].get(DAGENT_ARRAY_URL.format("latency","30d"),
                        exc=HTTPError)
    kwargs["mock"].get(DAGENT_ARRAY_URL.format("latency","12h"),
                       json="test",
                       status_code=200)
    response = app.test_client().get(MTOOL_ARRAY_URL.format("latency","1m"), headers={'x-access-token': json_token})
    assert response.status_code == 200

    response = app.test_client().get(MTOOL_ARRAY_URL.format("latency","7d"), headers={'x-access-token': json_token})
    assert response.status_code == 200

    response = app.test_client().get(MTOOL_ARRAY_URL.format("latency","12h"), headers={'x-access-token': json_token})
    assert response.status_code == 200

    response = app.test_client().get(MTOOL_ARRAY_URL.format("latency","30d"), headers={'x-access-token': json_token})
    assert response.status_code == 200


@requests_mock.Mocker(kw="mock")
@mock.patch("rest.app.connection_factory.get_current_user",
            return_value="test", autospec=True)
def test_get_current_iops(mock_get_current_user, **kwargs):
    kwargs["mock"].post(INFLUXDB_URL, text='Success', status_code=204)
    kwargs["mock"].get(DAGENT_ARRAY_URL.format("readbw",""),
                       json={"result": {"status": {"description": "SUCCESS"},
                                        "data": [{
                                            "time": 123456789,
                                            "bw": 10
                                            }]}},
                       status_code=200)
    kwargs["mock"].get(DAGENT_ARRAY_URL.format("writebw",""),
                       json={"result": {"status": {"description": "SUCCESS"},
                                        "data": [{
                                            "time": 123456789,
                                            "bw": 10
                                            }]}},
                       status_code=200)
    kwargs["mock"].get(DAGENT_ARRAY_URL.format("latency",""),
                       json={"result": {"status": {"description": "SUCCESS"},
                                        "data": [{
                                            "time": 123456789,
                                            "latency": 10
                                            }]}},
                       status_code=200)
    kwargs["mock"].get(DAGENT_ARRAY_URL.format("readiops",""),
                       json={"result": {"status": {"description": "SUCCESS"},
                                        "data": [{
                                            "time": 123456789,
                                            "iops": 10
                                            }]}},
                       status_code=200)
    kwargs["mock"].get(DAGENT_ARRAY_URL.format("writeiops",""),
                       json={"result": {"status": {"description": "SUCCESS"},
                                        "data": [{
                                            "time": 123456789,
                                            "iops": 10
                                            }]}},
                       status_code=200)
    response = app.test_client().get(
        '/api/v1/perf/all',
        headers={'x-access-token': json_token})
    assert response.status_code == 200
