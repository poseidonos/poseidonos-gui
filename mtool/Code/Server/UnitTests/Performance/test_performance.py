
from rest.app import app
import jwt
import datetime
from unittest import mock

json_token = jwt.encode({'_id': "test", 'exp': datetime.datetime.utcnow(
) + datetime.timedelta(minutes=60)}, app.config['SECRET_KEY'])


class InfluxMock:
    '''
    def get_connection(self):
        print("influxDB connection Established")
        return self
        '''

    def query(self, query):
        self.dbquery = query
        return self

    def close(self):
        return self

    def get_points(self):
        if "cpu" in self.dbquery and "1m" in self.dbquery:
            return [{
                "time": "152635612776125",
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


@mock.patch("rest.app.connection_factory.get_current_user",
            return_value="test", autospec=True)
@mock.patch("util.db.influx.InfluxDBClient",
            return_value=InfluxMock(), autospec=True)
def test_get_cpu_usage(mock_get_current_user, mock_influx_db):
    response = app.test_client().get(
        '/api/v1.0/usage_user/1m',
        headers={'x-access-token': json_token})
    #data = json.loads(response.get_data(as_text=True))
    assert response.status_code == 200
    response = app.test_client().get(
        '/api/v1.0/usage_user/7d',
        headers={'x-access-token': json_token})
    #data = json.loads(response.get_data(as_text=True))
    assert response.status_code == 200


@mock.patch("rest.app.connection_factory.get_current_user",
            return_value="test", autospec=True)
@mock.patch("util.db.influx.InfluxDBClient",
            return_value=InfluxMock(), autospec=True)
def test_get_total_processes(mock_get_current_user, mock_influx_db):
    response = app.test_client().get(
        '/api/v1.0/total_processes/1m',
        headers={'x-access-token': json_token})
    #data = json.loads(response.get_data(as_text=True))
    assert response.status_code == 200


@mock.patch("rest.app.connection_factory.get_current_user",
            return_value="test", autospec=True)
@mock.patch("util.db.influx.InfluxDBClient",
            return_value=InfluxMock(), autospec=True)
def test_get_disk_write_mbps(mock_get_current_user, mock_influx_db):
    response = app.test_client().get(
        '/api/v1.0/disk_write_mbps/1m/array',
        headers={'x-access-token': json_token})
    #data = json.loads(response.get_data(as_text=True))
    assert response.status_code == 200


@mock.patch("rest.app.connection_factory.get_current_user",
            return_value="test", autospec=True)
@mock.patch("util.db.influx.InfluxDBClient",
            return_value=InfluxMock(), autospec=True)
def test_get_disk_used_percent(mock_get_current_user, mock_influx_db):
    response = app.test_client().get(
        '/api/v1.0/disk_used_percent/1m/array',
        headers={'x-access-token': json_token})
    #data = json.loads(response.get_data(as_text=True))
    assert response.status_code == 200


@mock.patch("rest.app.connection_factory.get_current_user",
            return_value="test", autospec=True)
@mock.patch("util.db.influx.InfluxDBClient",
            return_value=InfluxMock(), autospec=True)
def test_get_read_iops(mock_get_current_user, mock_influx_db):
    response = app.test_client().get(
        '/api/v1.0/iops_read/1m/array',
        headers={'x-access-token': json_token})
    #data = json.loads(response.get_data(as_text=True))
    assert response.status_code == 200

    response = app.test_client().get(
        '/api/v1.0/iops_read/15m/array',
        headers={'x-access-token': json_token})
    #data = json.loads(response.get_data(as_text=True))
    assert response.status_code == 200

    response = app.test_client().get(
        '/api/v1.0/iops_read/7d/array',
        headers={'x-access-token': json_token})
    #data = json.loads(response.get_data(as_text=True))
    assert response.status_code == 200

    response = app.test_client().get(
        '/api/v1.0/iops_read/1m/0',
        headers={'x-access-token': json_token})
    #data = json.loads(response.get_data(as_text=True))
    assert response.status_code == 200


@mock.patch("rest.app.connection_factory.get_current_user",
            return_value="test", autospec=True)
@mock.patch("util.db.influx.InfluxDBClient",
            return_value=InfluxMock(), autospec=True)
def test_get_write_iops(mock_get_current_user, mock_influx_db):
    response = app.test_client().get(
        '/api/v1.0/iops_write/1m/array',
        headers={'x-access-token': json_token})
    #data = json.loads(response.get_data(as_text=True))
    assert response.status_code == 200

    response = app.test_client().get(
        '/api/v1.0/iops_write/15m/array',
        headers={'x-access-token': json_token})
    #data = json.loads(response.get_data(as_text=True))
    assert response.status_code == 200

    response = app.test_client().get(
        '/api/v1.0/iops_write/7d/array',
        headers={'x-access-token': json_token})
    #data = json.loads(response.get_data(as_text=True))
    assert response.status_code == 200

    response = app.test_client().get(
        '/api/v1.0/iops_write/1m/0',
        headers={'x-access-token': json_token})
    #data = json.loads(response.get_data(as_text=True))
    assert response.status_code == 200


@mock.patch("rest.app.connection_factory.get_current_user",
            return_value="test", autospec=True)
@mock.patch("util.db.influx.InfluxDBClient",
            return_value=InfluxMock(), autospec=True)
def test_get_read_bw(mock_get_current_user, mock_influx_db):
    response = app.test_client().get(
        '/api/v1.0/bw_read/1m/array',
        headers={'x-access-token': json_token})
    #data = json.loads(response.get_data(as_text=True))
    assert response.status_code == 200

    response = app.test_client().get(
        '/api/v1.0/bw_read/15m/array',
        headers={'x-access-token': json_token})
    #data = json.loads(response.get_data(as_text=True))
    assert response.status_code == 200

    response = app.test_client().get(
        '/api/v1.0/bw_read/7d/array',
        headers={'x-access-token': json_token})
    #data = json.loads(response.get_data(as_text=True))
    assert response.status_code == 200

    response = app.test_client().get(
        '/api/v1.0/bw_read/1m/0',
        headers={'x-access-token': json_token})
    #data = json.loads(response.get_data(as_text=True))
    assert response.status_code == 200


@mock.patch("rest.app.connection_factory.get_current_user",
            return_value="test", autospec=True)
@mock.patch("util.db.influx.InfluxDBClient",
            return_value=InfluxMock(), autospec=True)
def test_get_write_bw(mock_get_current_user, mock_influx_db):
    response = app.test_client().get(
        '/api/v1.0/bw_write/1m/array',
        headers={'x-access-token': json_token})
    #data = json.loads(response.get_data(as_text=True))
    assert response.status_code == 200

    response = app.test_client().get(
        '/api/v1.0/bw_write/15m/array',
        headers={'x-access-token': json_token})
    #data = json.loads(response.get_data(as_text=True))
    assert response.status_code == 200

    response = app.test_client().get(
        '/api/v1.0/bw_write/7d/array',
        headers={'x-access-token': json_token})
    #data = json.loads(response.get_data(as_text=True))
    assert response.status_code == 200

    response = app.test_client().get(
        '/api/v1.0/bw_write/1m/0',
        headers={'x-access-token': json_token})
    #data = json.loads(response.get_data(as_text=True))
    assert response.status_code == 200


@mock.patch("rest.app.connection_factory.get_current_user",
            return_value="test", autospec=True)
@mock.patch("util.db.influx.InfluxDBClient",
            return_value=InfluxMock(), autospec=True)
def test_get_latency(mock_get_current_user, mock_influx_db):
    response = app.test_client().get(
        '/api/v1.0/latency/1m/array',
        headers={'x-access-token': json_token})
    #data = json.loads(response.get_data(as_text=True))
    assert response.status_code == 200

    response = app.test_client().get(
        '/api/v1.0/latency/15m/array',
        headers={'x-access-token': json_token})
    #data = json.loads(response.get_data(as_text=True))
    assert response.status_code == 200

    response = app.test_client().get(
        '/api/v1.0/latency/7d/array',
        headers={'x-access-token': json_token})
    #data = json.loads(response.get_data(as_text=True))
    assert response.status_code == 200

    response = app.test_client().get(
        '/api/v1.0/latency/1m/0',
        headers={'x-access-token': json_token})
    #data = json.loads(response.get_data(as_text=True))
    assert response.status_code == 200


@mock.patch("rest.app.connection_factory.get_current_user",
            return_value="test", autospec=True)
@mock.patch("util.db.influx.InfluxDBClient",
            return_value=InfluxMock(), autospec=True)
def test_get_current_iops(mock_get_current_user, mock_influx_db):
    response = app.test_client().get(
        '/api/v1.0/perf/all',
        headers={'x-access-token': json_token})
    #data = json.loads(response.get_data(as_text=True))
    assert response.status_code == 200
