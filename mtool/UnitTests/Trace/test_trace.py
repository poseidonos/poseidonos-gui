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


@mock.patch("rest.app.connection_factory.set_live_logs_in_db", autospec=True)
# def test_set_live_logs(mock_set_live_logs_in_db):
def test_set_live_logs(mock_set_live_logs_in_db, global_data):
    response = app.test_client().post(
        '/api/v1.0/set_live_logs/',
        headers={'x-access-token': global_data['token'], 'Accept': 'application/json', },
        data=json.dumps({'livelogs': "no"}),
        content_type='application/json',
    )

    data = (response.get_data(as_text=True))
    #assert response.status_code == 200
    assert data == "Success"


@mock.patch("rest.app.connection_factory.get_live_logs_from_db",
            return_value=True, autospec=True)
def test_get_live_logs(mock_get_live_logs_from_db, global_data):
    response = app.test_client().get(
        '/api/v1.0/get_live_logs/',
        headers={
            'x-access-token': global_data['token'],
            'Accept': 'application/json',
        },
        content_type='application/json',
    )
    
    assert response.status_code == 200


@mock.patch("rest.app.connection_factory.get_live_logs_from_db",
            return_value=False, autospec=True)
def test_get_live_logs_no(mock_get_live_logs_from_db, global_data):
    response = app.test_client().get(
        '/api/v1.0/get_live_logs/',
        headers={
            'x-access-token': global_data['token'],
            'Accept': 'application/json',
        },
        content_type='application/json',
    )

    #data = (response.get_data(as_text=True))
    assert response.status_code == 200


def test_ibofos_logs(global_data):
    response = app.test_client().get(
        '/api/v1.0/get_Ibof_OS_Logs/',
        headers={
            'x-access-token': global_data['token'],
            'Accept': 'application/json',
        },
        content_type='application/json',
    )

    #data = (response.get_data(as_text=True))
    assert response.status_code == 200
