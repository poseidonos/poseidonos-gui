import pytest
from rest.exceptions import InvalidUsage
from rest.rest_api.array.array import list_arr
from rest.rest_api.dagent.ibofos import get_system_state, get_dagent_state, load_array, list_array
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
    print("Token :",login_data['token'])

    return {'token': login_data['token']}
def test_to_dict():
    obj = InvalidUsage("test_message")
    output = obj.to_dict()
    print(" output ",output["message"])
    assert output["message"] == "test_message"

def test_list_arr():
    output = list_arr()
    assert output.status_code == 200
def test_get_system_state():
    output = get_system_state()
    assert output.status_code == 200
def test_get_dagent_state():
    get_dagent_state()
    #assert output.status_code == 200
def test_load_array():
    output = load_array("test")
    assert output == True
def test_array_exists():
    output = load_array("test")
    assert output == True
def test_list_array():
    output = list_array("test")
    assert output.status_code == 200

