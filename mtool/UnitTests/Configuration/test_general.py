import pytest
from rest.app import app
from flask import json
from unittest import mock

token = ""


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


@mock.patch("rest.app.connection_factory.get_email_list",
            return_value=[], autospec=True)
def test_get_email_ids(mock_get_email_list, global_data):
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

# @mock.patch("rest.app.connection_factory.get_ibofos_time_interval_from_db",return_value=4,autospec=True)


def test_downloadLogs(global_data):
    response = app.test_client().get(
        '/api/v1.0/download_logs?start_date=2020-07-08T12:55:25.612Z&end_date=2020-07-08T12:55:25.612Z',
        headers={
            'x-access-token': global_data['token'],
            'Accept': 'application/json',
        },
        content_type='application/json',
    )


@mock.patch("rest.app.connection_factory.find_email",
            return_value=False, autospec=True)
@mock.patch("rest.app.connection_factory.insert_email", autospec=True)
def test_add_email(mock_find_email, mock_insert_email):
    response = app.test_client().post(
        '/api/v1.0/update_email/',
        data=json.dumps({'email': "xyz@gmail.com", 'oldid': "xyz@gmail.com"}),
        content_type='application/json',
    )
    data = (response.get_data(as_text=True))
    assert data == 'Updated'


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
