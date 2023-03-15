'''
/*
 *   BSD LICENSE
 *   Copyright (c) 2021 Samsung Electronics Corporation
 *   All rights reserved.
 *
 *   Redistribution and use in source and binary forms, with or without
 *   modification, are permitted provided that the following conditions
 *   are met:
 *
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in
 *       the documentation and/or other materials provided with the
 *       distribution.
 *     * Neither the name of Samsung Electronics Corporation nor the names of its
 *       contributors may be used to endorse or promote products derived
 *       from this software without specific prior written permission.
 *
 *   THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 *   "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 *   LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 *   A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 *   OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 *   SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 *   LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 *   DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 *   THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 *   (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 *   OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
 '''
import pytest
# sys.path.append(os.path.abspath('/usr/local/lib/python3.8/dist-packages/'))
# sys.path.append(os.path.abspath('/usr/local/lib/python3.6/dist-packages/'))
# sys.path.append(os.path.abspath('/home/ibof08/Palak/ibofmgmt/Code/Server/'))
from rest.app import app
from flask import json
from unittest import mock

token = ""

data_json = {"_id": "abc",
        "password": "asd",
        "email": "sd@.cccb",
        "phone_number": "+829899875673",
        "role": "Admin",
        "active": 1,
        "privileges": "Create,Edit,View",
        "ibofostimeinterval": 4,
        "livedata": 1,
        "selected": False,
        "edit": False,
        "oldid": "abc"}

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
                                                       "password": "asd123456",
                                                       "confirmpassword":
                                                       "asd123456",
                                                       "user_role": "Admin",
                                                       "mobilenumber": "+8256546464564",
                                                       "emailid": "asd@asd.ccc",
                                                       "phone_number":"+829999999900",
                                                       "error": ""}),
                                      content_type='application/json',
                                      )
    assert response.status_code == 200
    #print("DATAAA", data)

@mock.patch("rest.app.connection_factory.add_new_user_in_db",
            return_value=True, autospec=True)
def test_add_new_user_failure_invalid_phone(mock_add_new_user_in_db, global_data):
    response = app.test_client().post('/api/v1.0/add_new_user/',
                                      headers={'x-access-token': global_data['token'],
                                               'Accept': 'application/json',
                                               },
                                      data=json.dumps({"username": "abc",
                                                       "password": "asd123456",
                                                       "confirmpassword": "asd",
                                                       "user_role": "Admin",
                                                       "mobilenumber": "+82 565 4",
                                                       "emailid": "sd@asd.ccc",
                                                       "phone_number": "+82",
                                                       "error": ""}),
                                      content_type='application/json',
                                      )
    assert response.status_code == 400

@mock.patch("rest.app.connection_factory.add_new_user_in_db",
            return_value=True, autospec=True)
def test_add_new_user_failure_invalid_email(mock_add_new_user_in_db, global_data):
    response = app.test_client().post('/api/v1.0/add_new_user/',
                                      headers={'x-access-token': global_data['token'],
                                               'Accept': 'application/json',
                                               },
                                      data=json.dumps({"username": "abc",
                                                       "password": "asd123456",
                                                       "confirmpassword": "asd",
                                                       "user_role": "Admin",
                                                       "mobilenumber": "+82565123114",
                                                       "emailid": "sdas.ccc",
                                                       "phone_number": "+82",
                                                       "error": ""}),
                                      content_type='application/json',
                                      )
    assert response.status_code == 400


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
                                                       "email": "asd@asd.ccc",
                                                       "phone_number": "+829878765677",
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
    print("DATAAA", data)
    assert response.status_code == 200

@mock.patch("rest.app.connection_factory.update_user_in_db",
            return_value=True, autospec=True)
def test_update_users_failure_phone(mock_update_user_in_db, global_data):
    response = app.test_client().post('/api/v1.0/update_user/',
                                      headers={'x-access-token': global_data['token'],
                                               'Accept': 'application/json',
                                               },
                                      data=json.dumps(data_json),
                                      content_type='application/json',
                                      )
    data = response.get_data(as_text=True)
    print("DATAAA", data)
    assert response.status_code == 400

@mock.patch("rest.app.connection_factory.update_user_in_db",
            return_value=True, autospec=True)
def test_update_users_failure_email(mock_update_user_in_db, global_data):
    response = app.test_client().post('/api/v1.0/update_user/',
                                      headers={'x-access-token': global_data['token'],
                                               'Accept': 'application/json',
                                               },
                                      data=json.dumps(data_json),
                                      content_type='application/json',
                                      )
    data = response.get_data(as_text=True)
    print("DATAAA", data)
    assert response.status_code == 400


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


'''
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


'''
'''
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
'''

@mock.patch("rest.app.connection_factory.update_password_in_db",
            return_value=True, autospec=True)
def test_update_password(mock_update_password_in_db, global_data):
    response = app.test_client().post(
        '/api/v1.0/update_password/',
        headers={'x-access-token': global_data['token'], 'Accept': 'application/json', },
        data=json.dumps({"userid": "admin", 'oldPassword':'sss@1234', 'newPassword':'hhh@1234'}),
        content_type='application/json',
    )
    assert response.status_code == 200


@mock.patch("rest.app.connection_factory.update_password_in_db",
            return_value=False, autospec=True)
def test_update_password_failure(mock_update_password_in_db, global_data):
    response = app.test_client().post(
        '/api/v1.0/update_password/',
        headers={'x-access-token': global_data['token'], 'Accept': 'application/json', },
        data=json.dumps({"userid": "admin", 'oldPassword':'sss@1234', 'newPassword':'hhh@1234'}),
        content_type='application/json',
    )
    assert response.status_code == 500

@mock.patch("rest.app.connection_factory.update_password_in_db",
            return_value=True, autospec=True)
def test_update_password_failure2(mock_update_password_in_db, global_data):
    response = app.test_client().post(
        '/api/v1.0/update_password/',
        headers={'x-access-token': global_data['token'], 'Accept': 'application/json', },
        data=json.dumps({"userid": "admin", 'oldPassword':'sss@1234', 'newPassword':'sss@1234'}),
        content_type='application/json',
    )
    assert response.status_code == 400


if __name__ == '__main__':
    print("main")
