import pytest
from rest.app import app
from flask import json
from unittest import mock
import requests_mock
token = ""

INFLUXDB_URL = 'http://0.0.0.0:8086/write?db=poseidon&rp=autogen'


@pytest.fixture(scope='module')
@mock.patch("rest.app.connection_factory.match_username_from_db",
            return_value="xyz", autospec=True)
def global_data(mock_match_username_from_db):
    login_response = app.test_client().post(
        '/api/v1.0/login/',
        data=json.dumps({'username': "xyz", 'password': "xyz"}),
        content_type='application/json',
    )
    login_data = json.loads(login_response.get_data(as_text=True))
    return {'token': login_data['token']}


#@requests_mock.Mocker(kw="mock")
@mock.patch("rest.app.connection_factory.execute_get_email_list_query", return_value=[["abc@abc.com",True]], autospec=True)
def test_get_email_ids(mock_execute_get_email_list_query, global_data):
    response = app.test_client().get(
        '/api/v1.0/get_email_ids/',
        headers={
            'x-access-token': global_data['token'],
            'Accept': 'application/json',
        },
        content_type='application/json',
    )

    #data = json.dumps(response.get_data(as_text=True))
    assert response.status_code == 200

#@requests_mock.Mocker(kw="mock")
@mock.patch("rest.app.connection_factory.execute_get_email_list_query", return_value=[], autospec=True)
def test_get_email_ids_emptylist(mock_execute_get_email_list_query, global_data):
    response = app.test_client().get(
        '/api/v1.0/get_email_ids/',
        headers={
            'x-access-token': global_data['token'],
            'Accept': 'application/json',
        },
        content_type='application/json',
    )

    #data = json.dumps(response.get_data(as_text=True))
    assert response.status_code == 200



def test_getIpAndMac( global_data):
    response = app.test_client().get(
        '/api/v1.0/get_ip_and_mac',
        headers={
            'x-access-token': global_data['token'],
            'Accept': 'application/json',
        },
        content_type='application/json',
    )

    #data = json.dumps(response.get_data(as_text=True))
    assert response.status_code == 200

@requests_mock.Mocker(kw="mock")
#@mock.patch("rest.app.connection_factory.delete_emailids_list",
#             return_value=True,
#             autospec=True)
@mock.patch("rest.app.connection_factory.execute_delete_query", return_value=True, autospec=True)
@mock.patch("rest.app.connection_factory.execute_email_insert_query", return_value=['abc@abc.com'], autospec=True)
def test_delete_emailids(mock_execute_delete_query, mock_execute_email_insert_query, global_data, **kwargs):
    kwargs["mock"].get("http://localhost:9092/kapacitor/v1/config/smtp/", json={"options": {"to": ["xyz@gmail.com"]}}, status_code=200)
    kwargs["mock"].post("http://localhost:9092/kapacitor/v1/config/smtp/", json={}, status_code=200)
    kwargs["mock"].post(INFLUXDB_URL, text='Success', status_code=204)

    response = app.test_client().post(
        '/api/v1.0/delete_emailids/',
        data=json.dumps({'ids': ["xyz@gmail.com"]}),
        headers={
            'x-access-token': global_data['token'],
            'Accept': 'application/json',
        },
        content_type='application/json',
    )
    assert response.status_code == 200

@requests_mock.Mocker(kw="mock")
#@mock.patch("rest.app.connection_factory.toggle_email_update",
#             autospec=True)
@mock.patch("rest.app.connection_factory.execute_toggle_email_update_query", return_value=True, autospec=True)
def test_toggle_email_status(mock_execute_toggle_email_update_query, global_data, **kwargs):
    kwargs["mock"].get("http://localhost:9092/kapacitor/v1/config/smtp/", json={"options": {"to": ["xzk@gmail.com"]}}, status_code=200)
    kwargs["mock"].post("http://localhost:9092/kapacitor/v1/config/smtp/", json={}, status_code=200)
    kwargs["mock"].post(INFLUXDB_URL, text='Success', status_code=204)
    response = app.test_client().post(
        '/api/v1.0/toggle_email_status/',
        data=json.dumps({'emailid': "xzk@gmail.com", 'status':True}),
        headers={
            'x-access-token': global_data['token'],
            'Accept': 'application/json',
        },
        content_type='application/json',
    )

    assert response.status_code == 200

"""
@requests_mock.Mocker(kw="mock")
@mock.patch("rest.app.connection_factory.insert_smtp_ip",
             autospec=True)
@mock.patch("rest.app.smtplib.SMTP",
             autospec=True)
def test_smtpserver(mock_insert_smtp_ip,mock_SMTP, global_data, **kwargs):
    kwargs["mock"].post("http://localhost:9092/kapacitor/v1/config/smtp/", json={}, status_code=204)
    response = app.test_client().post(
        '/api/v1.0/test_smtpserver/',
        data=json.dumps({'smtpserverip': "10.10.10.10", 'smtpserverport': "6002"}),
        headers={
            'x-access-token': global_data['token'],
            'Accept': 'application/json',
        },
        content_type='application/json',
    )

    assert response.status_code == 200


@mock.patch("rest.app.smtplib.SMTP",
             autospec=True)
def test_send_email(mock_SMTP, global_data):
    response = app.test_client().post(
        '/api/v1.0/send_email/',
        data=json.dumps({'smtpserverip': "10.10.10.10", 'smtpserverport': "6002", 'ids':['palak.k@samsung.com']}),
        headers={
            'x-access-token': global_data['token'],
            'Accept': 'application/json',
        },
        content_type='application/json',
    )

    assert response.status_code == 200


@requests_mock.Mocker(kw="mock")
@mock.patch("rest.app.connection_factory.toggle_email_update",
             autospec=True)
def test_toggle_email_status_false(mock_toggle_email_update, global_data, **kwargs):
    kwargs["mock"].get("http://localhost:9092/kapacitor/v1/config/smtp/", json={"options": {"to": ["xzk@gmail.com"]}}, status_code=200)
    kwargs["mock"].post("http://localhost:9092/kapacitor/v1/config/smtp/", json={}, status_code=200)
    response = app.test_client().post(
        '/api/v1.0/toggle_email_status/',
        data=json.dumps({'emailid': "xzk@gmail.com", 'status':False}),
        headers={
            'x-access-token': global_data['token'],
            'Accept': 'application/json',
        },
        content_type='application/json',
    )

    assert response.status_code == 200
"""


@mock.patch("rest.app.connection_factory.get_ibofos_time_interval_from_db",
            return_value=4, autospec=True)
def test_get_ibofos_time_interval(
        mock_get_ibofos_time_interval_from_db,
        global_data):
    response = app.test_client().get(
        '/api/v1.0/get_ibofos_time_interval',
        headers={
            'x-access-token': global_data['token'],
            'Accept': 'application/json',
        },
        content_type='application/json',
    )

    data = (response.get_data(as_text=True))
    assert response.status_code == 200
    assert data == '4'


@mock.patch("rest.app.connection_factory.set_ibofos_time_interval_in_db",
            return_value=True, autospec=True)
def test_set_ibofos_time_interval(mock_toggle_email_update, global_data):
    response = app.test_client().post(
        '/api/v1.0/set_ibofos_time_interval',
        data=json.dumps({'timeinterval':'4'}),
        headers={
            'x-access-token': global_data['token'],
            'Accept': 'application/json',
        },
        content_type='application/json',
    )

    assert response.status_code == 200

@mock.patch("rest.app.connection_factory.set_ibofos_time_interval_in_db",
            return_value=False, autospec=True)
def test_set_ibofos_time_interval_failure(mock_toggle_email_update, global_data):
    response = app.test_client().post(
        '/api/v1.0/set_ibofos_time_interval',
        data=json.dumps({'timeinterval':'4'}),
        headers={
            'x-access-token': global_data['token'],
            'Accept': 'application/json',
        },
        content_type='application/json',
    )
    assert response.status_code == 500

def test_downloadLogs(global_data):
    response = app.test_client().get(
        '/api/v1.0/download_logs?start_date=2020-07-08T12:55:25.612Z&end_date=2020-07-08T12:55:25.612Z',
        headers={
            'x-access-token': global_data['token'],
            'Accept': 'application/json',
        },
        content_type='application/json',
    )
    assert response.status_code == 200


@requests_mock.Mocker(kw="mock")
@mock.patch("rest.app.connection_factory.find_email", return_value=False, autospec=True)
@mock.patch("rest.app.connection_factory.execute_insert_email_query", return_value=True, autospec=True)
@mock.patch("rest.app.connection_factory.execute_update_email_query", return_value=True, autospec=True)
def test_add_email(mock_find_email, mock_execute_insert_email_query, mock_execute_update_email_query, **kwargs):
    kwargs["mock"].post(INFLUXDB_URL, text='Success', status_code=204)
    kwargs["mock"].get("http://localhost:9092/kapacitor/v1/config/smtp/", json={"options": {"to": ["xyz@gmail.com"]}}, status_code=200)
    kwargs["mock"].post("http://localhost:9092/kapacitor/v1/config/smtp/", json={}, status_code=200)
    response = app.test_client().post(
        '/api/v1.0/update_email/',
        data=json.dumps({'email': "xyz@gmail.com", 'oldid': "xyz@gmail.com"}),
        content_type='application/json',
    )
    assert response.status_code == 200

@requests_mock.Mocker(kw="mock")
@mock.patch("rest.app.connection_factory.find_email", return_value=True, autospec=True)
@mock.patch("rest.app.connection_factory.execute_insert_email_query", return_value=True, autospec=True)
@mock.patch("rest.app.connection_factory.execute_update_email_query", return_value=True, autospec=True)
def test_add_email_with_update(mock_find_email, mock_execute_insert_email_query, mock_execute_update_email_query, **kwargs):
    kwargs["mock"].post(INFLUXDB_URL, text='Success', status_code=204)
    kwargs["mock"].get("http://localhost:9092/kapacitor/v1/config/smtp/", json={"options": {"to": ["xyz@gmail.com"]}}, status_code=200)
    kwargs["mock"].post("http://localhost:9092/kapacitor/v1/config/smtp/", json={}, status_code=200)
    response = app.test_client().post(
        '/api/v1.0/update_email/',
        data=json.dumps({'email': "xyz@gmail.com", 'oldid': "xyz@gmail.com"}),
        content_type='application/json',
    )
    assert response.status_code == 200


"""
@mock.patch("rest.app.connection_factory.find_email",
            return_value=True, autospec=True)
@mock.patch("rest.app.connection_factory.update_email_list", autospec=True)
@mock.patch("rest.app.Update_KapacitorList", autospec=True)
def test_update_email(
        mock_find_email,
        mock_update_email_list,
        mock_Update_KapacitorList):
    response = app.test_client().post(
        '/api/v1.0/update_email/',
        data=json.dumps({'email': "sss@gmail.com", 'active': 1, 'oldid': "ss@gmail.com"}),
        content_type='application/json',
    )
    data = (response.get_data(as_text=True))
    assert data == 'Updated'
"""

@requests_mock.Mocker(kw="mock")
def test_get_version(global_data, **kwargs):
    kwargs["mock"].post(INFLUXDB_URL, text='Success', status_code=204)
    response = app.test_client().get(
        '/api/v1.0/version',
        headers={
            'x-access-token': global_data['token'],
            'Accept': 'application/json',
        },
        content_type='application/json',
    )
    assert response.status_code == 200

@requests_mock.Mocker(kw="mock")
def test_log_collect_get(global_data, **kwargs):
    kwargs["mock"].post(INFLUXDB_URL, text='Success', status_code=204)
    response = app.test_client().get(
        '/api/v1.0/logger',
        headers={
            'x-access-token': global_data['token'],
            'Accept': 'application/json',
        },
        content_type='application/json',
    )
    assert response.status_code == 200

@requests_mock.Mocker(kw="mock")
@mock.patch("rest.app.log_to_influx", autospec=True)
def test_log_collect_post(mock_log_to_influx, global_data, **kwargs):
    kwargs["mock"].post(INFLUXDB_URL, text='Success', status_code=204)
    response = app.test_client().post(
        '/api/v1.0/logger',data=json.dumps({"logs": [{"tags": {"entity": "UI", "level": "info", "user": "admin"}}]}), headers={
            'x-access-token': global_data['token'],
            'Accept': 'application/json',
        },
        content_type='application/json',
    )
    assert response.status_code == 200

@requests_mock.Mocker(kw="mock")
@mock.patch("rest.app.log_to_influx", autospec=True)
def test_without_token(mock_log_to_influx, global_data, **kwargs):
    kwargs["mock"].post(INFLUXDB_URL, text='Success', status_code=204)
    response = app.test_client().get(
        '/api/v1.0/get_ibofos_time_interval', headers={
            'x-access-token': '',
            'Accept': 'application/json',
        },
        content_type='application/json',
    )
    assert response.status_code == 401

@requests_mock.Mocker(kw="mock")
@mock.patch("rest.app.log_to_influx", autospec=True)
def test_wrong_token(mock_log_to_influx, global_data, **kwargs):
    kwargs["mock"].post(INFLUXDB_URL, text='Success', status_code=204)
    response = app.test_client().get('/api/v1.0/get_ibofos_time_interval', headers={'x-access-token': 'wrong_token',
            'Accept': 'application/json',
        },
        content_type='application/json',
    )
    assert response.status_code == 401



