
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

@mock.patch("rest.app.connection_factory.get_current_user",
            return_value="test", autospec=True)
@mock.patch("util.db.influx.InfluxDBClient",
            return_value=InfluxMock(), autospec=True)
def test_get_total_processes(mock_get_current_user, mock_influx_db):
    response = app.test_client().get(
        '/api/v1.0/total_processes/1m',
        headers={'x-access-token': json_token})
    assert response.status_code == 200

@mock.patch("rest.app.connection_factory.get_current_user",
            return_value="test", autospec=True)
@mock.patch("util.db.influx.InfluxDBClient",
            return_value=InfluxMock(), autospec=True)
def test_get_total_processes_failure(mock_get_current_user, mock_influx_db):
    response = app.test_client().get(
        '/api/v1.0/total_processes/1',
        headers={'x-access-token': json_token})
    assert response.status_code == 404


@mock.patch("rest.app.connection_factory.get_current_user",
            return_value="test", autospec=True)
@mock.patch("util.db.influx.InfluxDBClient",
            return_value=InfluxMock(), autospec=True)
def test_get_disk_write_mbps(mock_get_current_user, mock_influx_db):
    response = app.test_client().get(
        '/api/v1.0/disk_write_mbps/1m/array',
        headers={'x-access-token': json_token})
    assert response.status_code == 200

@mock.patch("rest.app.connection_factory.get_current_user",
            return_value="test", autospec=True)
@mock.patch("util.db.influx.InfluxDBClient",
            return_value=InfluxMock(), autospec=True)
def test_get_disk_write_mbps_failure(mock_get_current_user, mock_influx_db):
    response = app.test_client().get(
        '/api/v1.0/disk_write_mbps/1/array',
        headers={'x-access-token': json_token})
    assert response.status_code == 404


@mock.patch("rest.app.connection_factory.get_current_user",
            return_value="test", autospec=True)
@mock.patch("util.db.influx.InfluxDBClient",
            return_value=InfluxMock(), autospec=True)
def test_get_disk_used_percent(mock_get_current_user, mock_influx_db):
    response = app.test_client().get(
        '/api/v1.0/disk_used_percent/1m/array',
        headers={'x-access-token': json_token})
    assert response.status_code == 200

@mock.patch("rest.app.connection_factory.get_current_user",
            return_value="test", autospec=True)
@mock.patch("util.db.influx.InfluxDBClient",
            return_value=InfluxMock(), autospec=True)
def test_get_disk_used_percent_failure(mock_get_current_user, mock_influx_db):
    response = app.test_client().get(
        '/api/v1.0/disk_used_percent/1/array',
        headers={'x-access-token': json_token})
    assert response.status_code == 404

@requests_mock.Mocker(kw="mock")
@mock.patch("rest.app.connection_factory.get_current_user",
            return_value="test", autospec=True)
def test_get_read_iops(mock_get_current_user, **kwargs): #time unit : nano sec
    kwargs["mock"].post(INFLUXDB_URL, text='Success', status_code=204)
    kwargs["mock"].get(DAGENT_URL + '/api/metric/v1/readiops/1m',
                       json={"result": {"status": {"description": "SUCCESS"},
                                        "data": [{
                                            "time": 123456789,
                                            "usageUser": 10
                                            }]}},
                       status_code=200)
    kwargs["mock"].get(DAGENT_URL + '/api/metric/v1/readiops/7d',
                       status_code=500)
    kwargs["mock"].get(DAGENT_URL + '/api/metric/v1/readiops/12h',
                       json="test",
                       status_code=200)
    kwargs["mock"].get(DAGENT_URL + '/api/metric/v1/readiops/30d',
                       exc=HTTPError)
    response = app.test_client().get(
        '/api/v1.0/iops_read/1m/array',
        headers={'x-access-token': json_token})
    assert response.status_code == 200

    response = app.test_client().get(
        '/api/v1.0/iops_read/7d/array',
        headers={'x-access-token': json_token})
    assert response.status_code == 200

    response = app.test_client().get(
        '/api/v1.0/iops_read/12h/array',
        headers={'x-access-token': json_token})
    assert response.status_code == 200

    response = app.test_client().get(
        '/api/v1.0/iops_read/30d/array',
        headers={'x-access-token': json_token})
    assert response.status_code == 200

@requests_mock.Mocker(kw="mock")
@mock.patch("rest.app.connection_factory.get_current_user",
            return_value="test", autospec=True)
def test_get_read_iops_failure(mock_get_current_user, **kwargs):
    kwargs["mock"].post(INFLUXDB_URL, text='Success', status_code=204)
    kwargs["mock"].get(DAGENT_URL + '/api/metric/v1/readiops/1m',
                       json={"result": {"status": {"description": "SUCCESS"},
                                        "data": [{
                                            "time": 123456789,
                                            "usageUser": 10
                                            }]}},
                       status_code=200)
    kwargs["mock"].get(DAGENT_URL + '/api/metric/v1/readiops/7d',
                       status_code=500)
    kwargs["mock"].get(DAGENT_URL + '/api/metric/v1/readiops/12h',
                       json="test",
                       status_code=200)
    kwargs["mock"].get(DAGENT_URL + '/api/metric/v1/readiops/30d',
                       exc=HTTPError)
    response = app.test_client().get(
        '/api/v1.0/iops_read/1/array',
        headers={'x-access-token': json_token})
    assert response.status_code == 404


@requests_mock.Mocker(kw="mock")
@mock.patch("rest.app.connection_factory.get_current_user",
            return_value="test", autospec=True)
def test_get_vol_read_iops(mock_get_current_user, **kwargs): #time unit : nano sec
    kwargs["mock"].post(INFLUXDB_URL, text='Success', status_code=204)
    kwargs["mock"].get(DAGENT_URL + '/api/metric/v1/volumes/0/readiops/1m',
                       json={"result": {"status": {"description": "SUCCESS"},
                                        "data": [{
                                            "time": 123456789,
                                            "usageUser": 10
                                            }]}},
                       status_code=200)
    kwargs["mock"].get(DAGENT_URL + '/api/metric/v1/volumes/0/readiops/7d',
                       status_code=500)
    kwargs["mock"].get(DAGENT_URL + '/api/metric/v1/volumes/0/readiops/12h',
                       json="test",
                       status_code=200)
    kwargs["mock"].get(DAGENT_URL + '/api/metric/v1/volumes/0/readiops/30d',
                        exc=HTTPError)
    response = app.test_client().get(
        '/api/v1.0/iops_read/1m/0',
        headers={'x-access-token': json_token})
    assert response.status_code == 200

    response = app.test_client().get(
        '/api/v1.0/iops_read/7d/0',
        headers={'x-access-token': json_token})
    assert response.status_code == 200

    response = app.test_client().get(
        '/api/v1.0/iops_read/12h/0',
        headers={'x-access-token': json_token})
    assert response.status_code == 200

    response = app.test_client().get(
        '/api/v1.0/iops_read/30d/0',
        headers={'x-access-token': json_token})
    assert response.status_code == 200


@requests_mock.Mocker(kw="mock")
@mock.patch("rest.app.connection_factory.get_current_user",
            return_value="test", autospec=True)
def test_get_write_iops(mock_get_current_user, **kwargs):
    kwargs["mock"].post(INFLUXDB_URL, text='Success', status_code=204)
    kwargs["mock"].get(DAGENT_URL + '/api/metric/v1/writeiops/1m',
                       json={"result": {"status": {"description": "SUCCESS"},
                                        "data": [{
                                            "time": 123456789,
                                            "usageUser": 10
                                            }]}},
                       status_code=200)
    kwargs["mock"].get(DAGENT_URL + '/api/metric/v1/writeiops/7d',
                       status_code=500)
    kwargs["mock"].get(DAGENT_URL + '/api/metric/v1/writeiops/12h',
                       json="test",
                       status_code=200)
    kwargs["mock"].get(DAGENT_URL + '/api/metric/v1/writeiops/30d',
                        exc=HTTPError)
    response = app.test_client().get(
        '/api/v1.0/iops_write/1m/array',
        headers={'x-access-token': json_token})
    assert response.status_code == 200

    response = app.test_client().get(
        '/api/v1.0/iops_write/7d/array',
        headers={'x-access-token': json_token})
    assert response.status_code == 200

    response = app.test_client().get(
        '/api/v1.0/iops_write/12h/array',
        headers={'x-access-token': json_token})
    assert response.status_code == 200

    response = app.test_client().get(
        '/api/v1.0/iops_write/30d/array',
        headers={'x-access-token': json_token})
    assert response.status_code == 200

@requests_mock.Mocker(kw="mock")
@mock.patch("rest.app.connection_factory.get_current_user",
            return_value="test", autospec=True)
def test_get_write_iops_failure(mock_get_current_user, **kwargs):
    kwargs["mock"].post(INFLUXDB_URL, text='Success', status_code=204)
    kwargs["mock"].get(DAGENT_URL + '/api/metric/v1/writeiops/1m',
                       json={"result": {"status": {"description": "SUCCESS"},
                                        "data": [{
                                            "time": 123456789,
                                            "usageUser": 10
                                            }]}},
                       status_code=200)
    kwargs["mock"].get(DAGENT_URL + '/api/metric/v1/writeiops/7d',
                       status_code=500)
    kwargs["mock"].get(DAGENT_URL + '/api/metric/v1/writeiops/12h',
                       json="test",
                       status_code=200)
    kwargs["mock"].get(DAGENT_URL + '/api/metric/v1/writeiops/30d',
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
    kwargs["mock"].get(DAGENT_URL + '/api/metric/v1/volumes/0/writeiops/1m',
                       json={"result": {"status": {"description": "SUCCESS"},
                                        "data": [{
                                            "time": 123456789,
                                            "usageUser": 10
                                            }]}},
                       status_code=200)
    kwargs["mock"].get(DAGENT_URL + '/api/metric/v1/volumes/0/writeiops/7d',
                       status_code=500)
    kwargs["mock"].get(DAGENT_URL + '/api/metric/v1/volumes/0/writeiops/12h',
                       json="test",
                       status_code=200)
    kwargs["mock"].get(DAGENT_URL + '/api/metric/v1/volumes/0/writeiops/30d',
                        exc=HTTPError)

    response = app.test_client().get(
        '/api/v1.0/iops_write/1m/0',
        headers={'x-access-token': json_token})
    assert response.status_code == 200

    response = app.test_client().get(
        '/api/v1.0/iops_write/7d/0',
        headers={'x-access-token': json_token})
    assert response.status_code == 200

    response = app.test_client().get(
        '/api/v1.0/iops_write/12h/0',
        headers={'x-access-token': json_token})
    assert response.status_code == 200

    response = app.test_client().get(
        '/api/v1.0/iops_write/30d/0',
        headers={'x-access-token': json_token})
    assert response.status_code == 200


@requests_mock.Mocker(kw="mock")
@mock.patch("rest.app.connection_factory.get_current_user",
            return_value="test", autospec=True)
def test_get_read_bw(mock_get_current_user, **kwargs):
    kwargs["mock"].post(INFLUXDB_URL, text='Success', status_code=204)
    kwargs["mock"].get(DAGENT_URL + '/api/metric/v1/readbw/1m',
                       json={"result": {"status": {"description": "SUCCESS"},
                                        "data": [{
                                            "time": 123456789,
                                            "usageUser": 10
                                            }]}},
                       status_code=200)
    kwargs["mock"].get(DAGENT_URL + '/api/metric/v1/readbw/7d',
                       status_code=500)
    kwargs["mock"].get(DAGENT_URL + '/api/metric/v1/readbw/12h',
                       json="test",
                       status_code=200)
    kwargs["mock"].get(DAGENT_URL + '/api/metric/v1/readbw/30d',
                        exc=HTTPError)
    response = app.test_client().get(
        '/api/v1.0/bw_read/1m/array',
        headers={'x-access-token': json_token})
    assert response.status_code == 200

    response = app.test_client().get(
        '/api/v1.0/bw_read/7d/array',
        headers={'x-access-token': json_token})
    assert response.status_code == 200

    response = app.test_client().get(
        '/api/v1.0/bw_read/12h/array',
        headers={'x-access-token': json_token})
    assert response.status_code == 200

    response = app.test_client().get(
        '/api/v1.0/bw_read/30d/array',
        headers={'x-access-token': json_token})
    assert response.status_code == 200


@requests_mock.Mocker(kw="mock")
@mock.patch("rest.app.connection_factory.get_current_user",
            return_value="test", autospec=True)
def test_get_read_bw_failure(mock_get_current_user, **kwargs):
    kwargs["mock"].post(INFLUXDB_URL, text='Success', status_code=204)
    kwargs["mock"].get(DAGENT_URL + '/api/metric/v1/readbw/1m',
                       json={"result": {"status": {"description": "SUCCESS"},
                                        "data": [{
                                            "time": 123456789,
                                            "usageUser": 10
                                            }]}},
                       status_code=200)
    kwargs["mock"].get(DAGENT_URL + '/api/metric/v1/readbw/7d',
                       status_code=500)
    kwargs["mock"].get(DAGENT_URL + '/api/metric/v1/readbw/12h',
                       json="test",
                       status_code=200)
    kwargs["mock"].get(DAGENT_URL + '/api/metric/v1/readbw/30d',
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
    kwargs["mock"].get(DAGENT_URL + '/api/metric/v1/volumes/0/readbw/1m',
                       json={"result": {"status": {"description": "SUCCESS"},
                                        "data": [{
                                            "time": 123456789,
                                            "usageUser": 10
                                            }]}},
                       status_code=200)
    kwargs["mock"].get(DAGENT_URL + '/api/metric/v1/volumes/0/readbw/7d',
                       status_code=500)
    kwargs["mock"].get(DAGENT_URL + '/api/metric/v1/volumes/0/readbw/12h',
                       json="test",
                       status_code=200)
    kwargs["mock"].get(DAGENT_URL + '/api/metric/v1/volumes/0/readbw/30d',
                       exc=HTTPError)
    response = app.test_client().get(
        '/api/v1.0/bw_read/1m/0',
        headers={'x-access-token': json_token})
    assert response.status_code == 200

    response = app.test_client().get(
        '/api/v1.0/bw_read/7d/0',
        headers={'x-access-token': json_token})
    assert response.status_code == 200

    response = app.test_client().get(
        '/api/v1.0/bw_read/12h/0',
        headers={'x-access-token': json_token})
    assert response.status_code == 200

    response = app.test_client().get(
        '/api/v1.0/bw_read/30d/0',
        headers={'x-access-token': json_token})
    assert response.status_code == 200



@requests_mock.Mocker(kw="mock")
@mock.patch("rest.app.connection_factory.get_current_user",
            return_value="test", autospec=True)
def test_get_write_bw(mock_get_current_user, **kwargs):
    kwargs["mock"].post(INFLUXDB_URL, text='Success', status_code=204)
    kwargs["mock"].get(DAGENT_URL + '/api/metric/v1/writebw/1m',
                       json={"result": {"status": {"description": "SUCCESS"},
                                        "data": [{
                                            "time": 123456789,
                                            "usageUser": 10
                                            }]}},
                       status_code=200)
    kwargs["mock"].get(DAGENT_URL + '/api/metric/v1/writebw/30d',
                        exc=HTTPError)
    kwargs["mock"].get(DAGENT_URL + '/api/metric/v1/writebw/7d',
                       status_code=500)
    kwargs["mock"].get(DAGENT_URL + '/api/metric/v1/writebw/12h',
                       json="test",
                       status_code=200)
    response = app.test_client().get(
        '/api/v1.0/bw_write/1m/array',
        headers={'x-access-token': json_token})
    assert response.status_code == 200

    response = app.test_client().get(
        '/api/v1.0/bw_write/7d/array',
        headers={'x-access-token': json_token})
    assert response.status_code == 200

    response = app.test_client().get(
        '/api/v1.0/bw_write/12h/array',
        headers={'x-access-token': json_token})
    assert response.status_code == 200

    response = app.test_client().get(
        '/api/v1.0/bw_write/30d/array',
        headers={'x-access-token': json_token})
    assert response.status_code == 200

@requests_mock.Mocker(kw="mock")
@mock.patch("rest.app.connection_factory.get_current_user",
            return_value="test", autospec=True)
def test_get_write_bw_failure(mock_get_current_user, **kwargs):
    kwargs["mock"].post(INFLUXDB_URL, text='Success', status_code=204)
    kwargs["mock"].get(DAGENT_URL + '/api/metric/v1/writebw/1m',
                       json={"result": {"status": {"description": "SUCCESS"},
                                        "data": [{
                                            "time": 123456789,
                                            "usageUser": 10
                                            }]}},
                       status_code=200)
    kwargs["mock"].get(DAGENT_URL + '/api/metric/v1/writebw/30d',
                        exc=HTTPError)
    kwargs["mock"].get(DAGENT_URL + '/api/metric/v1/writebw/7d',
                       status_code=500)
    kwargs["mock"].get(DAGENT_URL + '/api/metric/v1/writebw/12h',
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
    kwargs["mock"].get(DAGENT_URL + '/api/metric/v1/volumes/0/writebw/1m',
                       json={"result": {"status": {"description": "SUCCESS"},
                                        "data": [{
                                            "time": 123456789,
                                            "usageUser": 10
                                            }]}},
                       status_code=200)
    kwargs["mock"].get(DAGENT_URL + '/api/metric/v1/volumes/0/writebw/7d',
                       status_code=500)
    kwargs["mock"].get(DAGENT_URL + '/api/metric/v1/volumes/0/writebw/12h',
                       json="test",
                       status_code=200)
    kwargs["mock"].get(DAGENT_URL + '/api/metric/v1/volumes/0/writebw/30d',
                        exc=HTTPError)
    response = app.test_client().get(
        '/api/v1.0/bw_write/1m/0',
        headers={'x-access-token': json_token})
    assert response.status_code == 200

    response = app.test_client().get(
        '/api/v1.0/bw_write/7d/0',
        headers={'x-access-token': json_token})
    assert response.status_code == 200

    response = app.test_client().get(
        '/api/v1.0/bw_write/12h/0',
        headers={'x-access-token': json_token})
    assert response.status_code == 200

    response = app.test_client().get(
        '/api/v1.0/bw_write/30d/0',
        headers={'x-access-token': json_token})
    assert response.status_code == 200



@requests_mock.Mocker(kw="mock")
@mock.patch("rest.app.connection_factory.get_current_user",
            return_value="test", autospec=True)
def test_get_vol_latency(mock_get_current_user, **kwargs):
    kwargs["mock"].post(INFLUXDB_URL, text='Success', status_code=204)
    kwargs["mock"].get(DAGENT_URL + '/api/metric/v1/volumes/0/latency/1m',
                       json={"result": {"status": {"description": "SUCCESS"},
                                        "data": [{
                                            "time": 123456789,
                                            "usageUser": 10
                                            }]}},
                       status_code=200)
    kwargs["mock"].get(DAGENT_URL + '/api/metric/v1/volumes/0/latency/7d',
                       status_code=500)
    kwargs["mock"].get(DAGENT_URL + '/api/metric/v1/volumes/0/latency/12h',
                       json="test",
                       status_code=200)
    kwargs["mock"].get(DAGENT_URL + '/api/metric/v1/volumes/0/latency/30d',
                        exc=HTTPError)
    response = app.test_client().get(
        '/api/v1.0/latency/1m/0',
        headers={'x-access-token': json_token})
    assert response.status_code == 200

    response = app.test_client().get(
        '/api/v1.0/latency/7d/0',
        headers={'x-access-token': json_token})
    assert response.status_code == 200

    response = app.test_client().get(
        '/api/v1.0/latency/12h/0',
        headers={'x-access-token': json_token})
    assert response.status_code == 200

    response = app.test_client().get(
        '/api/v1.0/latency/30d/0',
        headers={'x-access-token': json_token})
    assert response.status_code == 200


@requests_mock.Mocker(kw="mock")
@mock.patch("rest.app.connection_factory.get_current_user",
            return_value="test", autospec=True)
def test_get_vol_latency_failure(mock_get_current_user, **kwargs):
    kwargs["mock"].post(INFLUXDB_URL, text='Success', status_code=204)
    kwargs["mock"].get(DAGENT_URL + '/api/metric/v1/volumes/0/latency/1m',
                       json={"result": {"status": {"description": "SUCCESS"},
                                        "data": [{
                                            "time": 123456789,
                                            "usageUser": 10
                                            }]}},
                       status_code=200)
    kwargs["mock"].get(DAGENT_URL + '/api/metric/v1/volumes/0/latency/7d',
                       status_code=500)
    kwargs["mock"].get(DAGENT_URL + '/api/metric/v1/volumes/0/latency/12h',
                       json="test",
                       status_code=200)
    kwargs["mock"].get(DAGENT_URL + '/api/metric/v1/volumes/0/latency/30d',
                        exc=HTTPError)
    response = app.test_client().get(
        '/api/v1.0/latency/1/0',
        headers={'x-access-token': json_token})
    assert response.status_code == 404


@requests_mock.Mocker(kw="mock")
@mock.patch("rest.app.connection_factory.get_current_user",
            return_value="test", autospec=True)
def test_get_latency(mock_get_current_user, **kwargs):
    kwargs["mock"].post(INFLUXDB_URL, text='Success', status_code=204)
    kwargs["mock"].get(DAGENT_URL + '/api/metric/v1/latency/1m',
                       json={"result": {"status": {"description": "SUCCESS"},
                                        "data": [{
                                            "time": 123456789,
                                            "usageUser": 10
                                            }]}},
                       status_code=200)
    kwargs["mock"].get(DAGENT_URL + '/api/metric/v1/latency/7d',
                       status_code=500)
    kwargs["mock"].get(DAGENT_URL + '/api/metric/v1/latency/30d',
                        exc=HTTPError)
    kwargs["mock"].get(DAGENT_URL + '/api/metric/v1/latency/12h',
                       json="test",
                       status_code=200)
    response = app.test_client().get(
        '/api/v1.0/latency/1m/array',
        headers={'x-access-token': json_token})
    assert response.status_code == 200

    response = app.test_client().get(
        '/api/v1.0/latency/7d/array',
        headers={'x-access-token': json_token})
    assert response.status_code == 200

    response = app.test_client().get(
        '/api/v1.0/latency/12h/array',
        headers={'x-access-token': json_token})
    assert response.status_code == 200

    response = app.test_client().get(
        '/api/v1.0/latency/30d/array',
        headers={'x-access-token': json_token})
    assert response.status_code == 200


@requests_mock.Mocker(kw="mock")
@mock.patch("rest.app.connection_factory.get_current_user",
            return_value="test", autospec=True)
def test_get_current_iops(mock_get_current_user, **kwargs):
    kwargs["mock"].post(INFLUXDB_URL, text='Success', status_code=204)
    kwargs["mock"].get(DAGENT_URL + '/api/metric/v1/readbw/',
                       json={"result": {"status": {"description": "SUCCESS"},
                                        "data": [{
                                            "time": 123456789,
                                            "bw": 10
                                            }]}},
                       status_code=200)
    kwargs["mock"].get(DAGENT_URL + '/api/metric/v1/writebw/',
                       json={"result": {"status": {"description": "SUCCESS"},
                                        "data": [{
                                            "time": 123456789,
                                            "bw": 10
                                            }]}},
                       status_code=200)
    kwargs["mock"].get(DAGENT_URL + '/api/metric/v1/latency/',
                       json={"result": {"status": {"description": "SUCCESS"},
                                        "data": [{
                                            "time": 123456789,
                                            "latency": 10
                                            }]}},
                       status_code=200)
    kwargs["mock"].get(DAGENT_URL + '/api/metric/v1/readiops/',
                       json={"result": {"status": {"description": "SUCCESS"},
                                        "data": [{
                                            "time": 123456789,
                                            "iops": 10
                                            }]}},
                       status_code=200)
    kwargs["mock"].get(DAGENT_URL + '/api/metric/v1/writeiops/',
                       json={"result": {"status": {"description": "SUCCESS"},
                                        "data": [{
                                            "time": 123456789,
                                            "iops": 10
                                            }]}},
                       status_code=200)
    response = app.test_client().get(
        '/api/v1.0/perf/all',
        headers={'x-access-token': json_token})
    assert response.status_code == 200
