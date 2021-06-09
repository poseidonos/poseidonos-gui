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


@mock.patch("rest.app.connection_factory.add_new_user_in_db",
            return_value=True, autospec=True)
def test_add_new_user(mock_add_new_user_in_db, global_data):
    response = app.test_client().post('/api/v1.0/add_new_user/',
                                      headers={'x-access-token': global_data['token'],
                                               'Accept': 'application/json',
                                               },
                                      data=json.dumps({"username": "abc",
                                                       "password": "asd",
                                                       "confirmpassword": "asd",
                                                       "user_role": "Admin",
                                                       "mobilenumber": "+82 565 4646 4564",
                                                       "emailid": "sd@asd.ccc",
                                                       "phone_number": "+82",
                                                       "error": ""}),
                                      content_type='application/json',
                                      )
    data = json.loads(response.get_data(as_text=True))
    assert response.status_code == 200
    print("DATAAA", data, data['message'])


@mock.patch("rest.app.connection_factory.get_users_from_db",
            return_value=['admin'], autospec=True)
def test_get_users(mock_get_users_from_db, global_data):
    #print("token val",token)
    response = app.test_client().get(
        '/api/v1.0/get_users/',
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


@mock.patch("rest.app.connection_factory.update_user_in_db",
            return_value=True, autospec=True)
def test_update_users(mock_update_user_in_db, global_data):
    response = app.test_client().post('/api/v1.0/update_user/',
                                      headers={'x-access-token': global_data['token'],
                                               'Accept': 'application/json',
                                               },
                                      data=json.dumps({"_id": "abc",
                                                       "password": "asd",
                                                       "email": "sd@asd.cccb",
                                                       "phone_number": "+82",
                                                       "role": "Admin",
                                                       "active": 1,
                                                       "privileges": "Create,Edit,View",
                                                       "ibofostimeinterval": 4,
                                                       "livedata": 1,
                                                       "selected": False,
                                                       "edit": False,
                                                       "oldid": "abc"}),
                                      content_type='application/json',
                                      )
    data = response.get_data(as_text=True)
    assert response.status_code == 200
    print("DATAAA", data)


@mock.patch("rest.app.connection_factory.delete_users_in_db",
            return_value=False, autospec=True)
def test_delete_users(mock_delete_users_in_db, global_data):
    response = app.test_client().post(
        '/api/v1.0/delete_users/',
        headers={'x-access-token': global_data['token'], 'Accept': 'application/json', },
        data=json.dumps({"ids": ["abc"]}),
        content_type='application/json',
    )
    data = response.get_data(as_text=True)
    assert response.status_code == 200
    print("DATAAA", data)



@mock.patch("rest.app.connection_factory.toggle_status_from_db",
            return_value=True, autospec=True)
def test_toggle_user_status(mock_toggle_status_from_db, global_data):
    response = app.test_client().post(
        '/api/v1.0/toggle_status/',
        headers={'x-access-token': global_data['token'], 'Accept': 'application/json', },
        data=json.dumps({"userid": "xyz@gmail.com", 'status':False}),
        content_type='application/json',
    )
    data = response.get_data(as_text=True)
    assert response.status_code == 200
    print("DATAAA", data)



@mock.patch("rest.app.connection_factory.toggle_status_from_db",
            return_value=False, autospec=True)
def test_toggle_user_status_failure(mock_toggle_status_from_db, global_data):
    response = app.test_client().post(
        '/api/v1.0/toggle_status/',
        headers={'x-access-token': global_data['token'], 'Accept': 'application/json', },
        data=json.dumps({"userid": "xyz@gmail.com", 'status':False}),
        content_type='application/json',
    )
    assert response.status_code == 200


@mock.patch("rest.app.connection_factory.toggle_status_from_db",
            return_value=False, autospec=True)
def test_toggle_admin_status_failure(mock_toggle_status_from_db, global_data):
    response = app.test_client().post(
        '/api/v1.0/toggle_status/',
        headers={'x-access-token': global_data['token'], 'Accept': 'application/json', },
        data=json.dumps({"userid": "admin", 'status':False}),
        content_type='application/json',
    )
    assert response.status_code == 200


@mock.patch("rest.app.connection_factory.update_password_in_db",
            return_value=True, autospec=True)
def test_update_password(mock_update_password_in_db, global_data):
    response = app.test_client().post(
        '/api/v1.0/update_password/',
        headers={'x-access-token': global_data['token'], 'Accept': 'application/json', },
        data=json.dumps({"userid": "admin", 'oldPassword':'sss', 'newPassword':'hhh'}),
        content_type='application/json',
    )
    assert response.status_code == 200


@mock.patch("rest.app.connection_factory.update_password_in_db",
            return_value=False, autospec=True)
def test_update_password_failure(mock_update_password_in_db, global_data):
    response = app.test_client().post(
        '/api/v1.0/update_password/',
        headers={'x-access-token': global_data['token'], 'Accept': 'application/json', },
        data=json.dumps({"userid": "admin", 'oldPassword':'sss', 'newPassword':'hhh'}),
        content_type='application/json',
    )
    assert response.status_code == 500


if __name__ == '__main__':
    print("main")
