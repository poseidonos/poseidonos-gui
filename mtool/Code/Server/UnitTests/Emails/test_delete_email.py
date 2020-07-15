import pytest
# sys.path.append(os.path.abspath('/usr/local/lib/python3.8/dist-packages/'))
# sys.path.append(os.path.abspath('/usr/local/lib/python3.6/dist-packages/'))
# sys.path.append(os.path.abspath('/home/ibof08/Palak/ibofmgmt/Code/Server/'))
from rest.app import app
from flask import json
from unittest import mock

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


@mock.patch(
    "rest.app.connection_factory.delete_emailids_list",
    return_value=True,
    autospec=True)


def test_delete_emailids(mock_delete_emailids_list, global_data):
    response = app.test_client().post(
        '/api/v1.0/delete_emailids/',
        headers={'x-access-token': global_data['token'], 'Accept': 'application/json', },
        data=json.dumps({'ids' : ["test@test.com", "abc@abc.com"]}),
        content_type='application/json',
    )
    #data = (response.get_data(as_text=True))
    #assert response.status_code == 200
    #print("DATAAA", data)


@mock.patch(
    "rest.app.connection_factory.toggle_email_update",
    return_value=True,
    autospec=True)


def test_toggle_email_status(mock_toggle_email_update, global_data):
    response = app.test_client().post(
        '/api/v1.0/toggle_email_status/',
        headers={'x-access-token': global_data['token'], 'Accept': 'application/json', },
        data=json.dumps({"email": "test@test.com", "status": True}),
        content_type='application/json',
    )
    #data = (response.get_data(as_text=True))
    #assert response.status_code == 200
    #print("DATAAA", data)
