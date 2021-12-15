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

"""
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
"""
