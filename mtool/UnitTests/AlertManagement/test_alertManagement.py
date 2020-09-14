"""
import pytest
# sys.path.append(os.path.abspath('/usr/local/lib/python3.8/dist-packages/'))
# sys.path.append(os.path.abspath('/usr/local/lib/python3.6/dist-packages/'))
# sys.path.append(os.path.abspath('/home/ibof08/Palak/ibofmgmt/Code/Server/'))
from rest.app import app
from flask import json
from unittest import mock
import requests_mock
from rest.rest_api.alerts.system_alerts import KAPACITOR_URL

token = ""


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
    return {'token': login_data['token']}

@requests_mock.Mocker(kw="mock")
@mock.patch("rest.app.connection_factory.add_alert_in_db",
            return_value=False, autospec=True)
def test_add_new_alert(mock_add_alert_in_db, global_data, **kwargs):
    kwargs["mock"].post(KAPACITOR_URL + "/tasks", json={}, status_code=200)
    response = app.test_client().post('/api/v1.0/add_alert/',
                                      headers={'x-access-token': global_data['token'],
                                               'Accept': 'application/json',
                                               },
                                      data=json.dumps({"alertName": "TESTNEWALERT1",
                                                       "alertField": "usage_system",
                                                       "alertCluster": "cpu",
                                                       "alertSubCluster": "cpu ",
                                                       "alertType": "cpu-total",
                                                       "alertCondition": "Less Than",
                                                       "alertRange": "80",
                                                       "description": ""}),
                                      content_type='application/json',
                                      )
    #data = json.loads(response.get_data(as_text=True))
    assert response.status_code == 200
    #print("DATAAA", data, data['message'])


@mock.patch("rest.app.connection_factory.get_alerts_from_db",
            return_value=[], autospec=True)
def test_get_alerts(mock_get_alerts_from_db, global_data):
    #print("token val",token)
    response = app.test_client().get(
        '/api/v1.0/get_alerts/',
        headers={
            'x-access-token': global_data['token'],
            'Accept': 'application/json',
        },
        content_type='application/json',
    )
    data = json.loads(response.get_data(as_text=True))
    assert response.status_code == 200
    print("DATAAA", data, len(data))
    assert len(data) >= 0

@requests_mock.Mocker(kw="mock")
@mock.patch("rest.app.connection_factory.delete_alerts_in_db",
            return_value=True, autospec=True)
def test_delete_new_alert(mock_delete_alerts_in_db, global_data, **kwargs):
    kwargs["mock"].delete(KAPACITOR_URL + "/tasks/TESTNEWALERT1", json={}, status_code=200)
    response = app.test_client().post(
        '/api/v1.0/delete_alerts/',
        headers={'x-access-token': global_data['token'], 'Accept': 'application/json', },
        data=json.dumps({"ids": ["TESTNEWALERT1"]}),
        content_type='application/json',
    )
    data = response.get_data(as_text=True)
    assert response.status_code == 200
    print("DATAAA", data)


@mock.patch("rest.app.connection_factory.toggle_alert_status_in_db",
            return_value=True, autospec=True)
def test_toggle_alert_status_failure(mock_toggle_alert_status_in_db, global_data):
    response = app.test_client().post(
        '/api/v1.0/toggle_alert_status/',
        headers={'x-access-token': global_data['token'], 'Accept': 'application/json', },
        data=json.dumps({"alertName": "new", 'status':True}),
        content_type='application/json',
    )
    assert response.status_code == 500


@mock.patch("rest.app.connection_factory.toggle_alert_status_in_db",
            return_value=True, autospec=True)
@mock.patch("rest.app.toggle_in_kapacitor",
        return_value={'status_code':200}, autospec=True)
def test_toggle_alert_status(mock_toggle_alert_status_in_db,mock_toggle_in_kapacitor, global_data):
    response = app.test_client().post(
        '/api/v1.0/toggle_alert_status/',
        headers={'x-access-token': global_data['token'], 'Accept': 'application/json', },
        data=json.dumps({"alertName": "new", 'status':True}),
        content_type='application/json',
    )
    assert response.status_code == 500

@mock.patch("rest.app.connection_factory.toggle_alert_status_in_db",
            return_value=False, autospec=True)
@mock.patch("rest.app.toggle_in_kapacitor",
        return_value={'status_code':200}, autospec=True)
def test_toggle_alert_status_db_failure(mock_toggle_alert_status_in_db,mock_toggle_in_kapacitor, global_data):
    response = app.test_client().post(
        '/api/v1.0/toggle_alert_status/',
        headers={'x-access-token': global_data['token'], 'Accept': 'application/json', },
        data=json.dumps({"alertName": "new", 'status':True}),
        content_type='application/json',
    )
    assert response.status_code == 500

def test_get_alert_types(global_data):
    response = app.test_client().get(
        '/api/v1.0/get_alert_types/',
        headers={
            'x-access-token': global_data['token'],
            'Accept': 'application/json',
        },
        content_type='application/json',
    )
    print("OK")
    data = json.loads(response.get_data(as_text=True))
    assert response.status_code == 200
    assert len(data['alert_types']) >= 0

# @mock.patch("rest.app.connection_factory.update_alerts_in_db", return_value=False, autospec=True)


def test_update_alerts(global_data):
    response = app.test_client().post('/api/v1.0/update_alerts/',
                                      headers={'x-access-token': global_data['token'],
                                               'Accept': 'application/json',
                                               },
                                      data=json.dumps({"alertName": "TESTNEWALERT1",
                                                       "alertCluster": "cpu",
                                                       "alertSubCluster": "cpu",
                                                       "alertType": "cpu-total",
                                                       "alertCondition": "Not Equal To",
                                                       "alertField": "usage_system",
                                                       "description": "TEST1Samsple",
                                                       "alertRange": "67",
                                                       }),
                                      content_type='application/json',
                                      )
    data = response.get_data(as_text=True)
    #assert response.status_code == 200
    print("DATAAA", data)


if __name__ == '__main__':
    print("main")

"""
