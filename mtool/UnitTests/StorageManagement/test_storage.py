import sys
import os

from rest.app import app
from flask import json
import requests_mock
import jwt
import datetime
from unittest import mock

json_token = jwt.encode({'_id': "test", 'exp': datetime.datetime.utcnow(
) + datetime.timedelta(minutes=60)}, app.config['SECRET_KEY'])
ip = os.environ.get('DAGENT_HOST', 'localhost')

DAGENT_URL = 'http://' + ip + ':3000'


@requests_mock.Mocker(kw="mock")
@mock.patch("rest.app.connection_factory.get_current_user",
            return_value="test", autospec=True)
def test_get_devices(mock_get_current_user, **kwargs):
    kwargs["mock"].get(DAGENT_URL + '/api/ibofos/v1/device',
                       json={"result": {"status": {"description": "SUCCESS"},
                                        "data": {"devicelist": [{"name": "uram0",
                                                                 "type": "NVRAM",
                                                                 "size": 12345,
                                                                 "mn": "DEFG",
                                                                 "sn": "SN"},
                                                                {"name": "unvme-ns-0",
                                                                 "type": "SSD",
                                                                 "size": 12345,
                                                                 "mn": "ABCD",
                                                                 "sn": "SN!"}]}},
                             "data": {"devicelist": [{"name": "unvme-ns-0",
                                                      "type": "NVRAM"}]}},
                       status_code=200)
    response = app.test_client().get(
        '/api/v1.0/get_devices/',
        headers={'x-access-token': json_token})

    #data = json.loads(response.get_data(as_text=True))
    assert response.status_code == 200


@requests_mock.Mocker(kw="mock")
@mock.patch("rest.app.connection_factory.get_current_user",
            return_value="test", autospec=True)
def test_get_volumes(mock_get_current_user, **kwargs):
    kwargs["mock"].get(
        DAGENT_URL + '/api/ibofos/v1/volume',
        json={
            "result": {
                "status": {
                    "description": "SUCCESS"},
                "data": {
                    "volumes": [
                        {
                            "name": "vol1",
                            "size": 1234567,
                            "total": 12345678,
                            "remain": 12345678}]}}},
        status_code=200)
    response = app.test_client().get(
        '/api/v1.0/get_volumes/',
        headers={'x-access-token': json_token})

    #data = json.loads(response.get_data(as_text=True))
    assert response.status_code == 200


@requests_mock.Mocker(kw="mock")
@mock.patch("rest.app.connection_factory.get_current_user",
            return_value="test", autospec=True)
def test_get_volumes(mock_get_current_user, **kwargs):
    kwargs["mock"].get(
        DAGENT_URL + '/api/ibofos/v1/system',
        json={
            "result": {
                "status": {
                    "description": "SUCCESS",
                    "code": 0}},
            "info": {
                "state": "ACTIVE",
                "capacity": 12345678,
                "used": 0}},
        status_code=200)
    response = app.test_client().get(
        '/api/v1.0/available_storage/',
        headers={'x-access-token': json_token})

    #data = json.loads(response.get_data(as_text=True))
    assert response.status_code == 200


@requests_mock.Mocker(kw="mock")
@mock.patch("rest.app.connection_factory.get_current_user",
            return_value="test", autospec=True)
def test_get_volume_count(mock_get_current_user, **kwargs):
    kwargs["mock"].get(
        DAGENT_URL +
        '/api/ibofos/v1/volume/maxcount',
        json={
            "result": {
                "status": {
                    "description": "SUCCESS"},
                "data": {
                    "count": 256}}},
        status_code=200)
    response = app.test_client().get(
        '/api/v1.0/max_volume_count/',
        headers={'x-access-token': json_token})

    #data = json.loads(response.get_data(as_text=True))
    assert response.status_code == 200


@requests_mock.Mocker(kw="mock")
@mock.patch("rest.app.connection_factory.get_current_user",
            return_value="test", autospec=True)
def test_create_arrays(mock_get_current_user, **kwargs):
    kwargs["mock"].get(
        DAGENT_URL +
        '/api/ibofos/v1/system',
        json={
            "result": {
                "status": {
                    "description": "SUCCESS",
                    "code": 0}},
            "info": {
                "state": "OFFLINE"}},
        status_code=200)
    kwargs["mock"].post(
        DAGENT_URL +
        '/api/ibofos/v1/array',
        json={
            "result": {
                "status": {
                    "description": "SUCCESS",
                    "code": 0}}},
        status_code=200)
    kwargs["mock"].post(
        DAGENT_URL +
        '/api/ibofos/v1/system/mount',
        json={
            "result": {
                "status": {
                    "description": "SUCCESS",
                    "code": 0}}},
        status_code=200)
    response = app.test_client().post(
        '/api/v1.0/create_arrays/',
        data='''{
                "RAIDLevel": 0,
                "spareDisks": ["unvmens-0"],
                "writeBufferDisk": [],
                "metaDisk": [],
                "storageDisks": ["unvme-ns-3", "unvme-ns-2", "unvme-ns-1"],
                "size": 12345678
                }''',
        headers={'x-access-token': json_token})

    #data = json.loads(response.get_data(as_text=True))
    assert response.status_code == 200


@requests_mock.Mocker(kw="mock")
@mock.patch("rest.app.connection_factory.get_current_user",
            return_value="test", autospec=True)
def test_get_arrays(mock_get_current_user, **kwargs):
    kwargs["mock"].get(
        DAGENT_URL + '/api/ibofos/v1/system',
        json={
            "result": {
                "status": {
                    "description": "SUCCESS",
                    "code": 0}},
            "info": {
                "state": "ACTIVE",
                "capacity": 12345678,
                "used": 0}},
        status_code=200)
    kwargs["mock"].get(DAGENT_URL + '/api/ibofos/v1/array/device',
                       json={"result": {"status": {"description": "SUCCESS",
                                                   "code": 0},
                                        "data": {"devicelist": [{"name": "unvme-ns-0",
                                                                 "type": "DATA"},
                                                                {"name": "unvme-ns-1",
                                                                 "type": "DATA"},
                                                                {"name": "unvme-ns-2",
                                                                 "type": "DATA"},
                                                                {"name": "unvme-ns-3",
                                                                 "type": "SPARE"},
                                                                {"name": "uram0",
                                                                 "type": "BUFFER"}],
                                                 "size": 12345678}},
                             "info": {"capacity": 12345678,
                                      "used": 0}},
                       status_code=200)
    response = app.test_client().get(
        '/api/v1.0/get_arrays/',
        headers={'x-access-token': json_token})

    #data = json.loads(response.get_data(as_text=True))
    assert response.status_code == 200


@requests_mock.Mocker(kw="mock")
@mock.patch("rest.app.connection_factory.get_current_user",
            return_value="test", autospec=True)
def test_create_volumes(mock_get_current_user, **kwargs):
    kwargs["mock"].post(
        DAGENT_URL +
        '/api/ibofos/v1/volume',
        json={
            "result": {
                "status": {
                    "description": "SUCCESS",
                    "code": 0}}},
        status_code=200)
    response = app.test_client().post(
        '/api/v1.0/save-volume/',
        data='''{
                "name": "vol1",
                "size": 123,
                "maxbw": 100,
                "maxiops": 100,
                "description": "Volume 1",
                "unit": "GB",
                "mount_vol": true,
                "stop_on_error": true,
                "count": 1,
                "suffix": 1
                }''',
        headers={'x-access-token': json_token})

    #data = json.loads(response.get_data(as_text=True))
    assert response.status_code == 200


@requests_mock.Mocker(kw="mock")
@mock.patch("rest.app.connection_factory.get_current_user",
            return_value="test", autospec=True)
def test_add_spare(mock_get_current_user, **kwargs):
    kwargs["mock"].post(
        DAGENT_URL +
        '/api/ibofos/v1/device',
        json={
            "result": {
                "status": {
                    "description": "SUCCESS",
                    "code": 0}}},
        status_code=200)
    response = app.test_client().post(
        '/api/v1.0/add_spare_device/',
        data='''{
                "name": "unvme-ns-3"
                }''',
        headers={'x-access-token': json_token})

    #data = json.loads(response.get_data(as_text=True))
    assert response.status_code == 200


@requests_mock.Mocker(kw="mock")
@mock.patch("rest.app.connection_factory.get_current_user",
            return_value="test", autospec=True)
def test_remove_spare(mock_get_current_user, **kwargs):
    kwargs["mock"].delete(
        DAGENT_URL +
        '/api/ibofos/v1/device',
        json={
            "result": {
                "status": {
                    "description": "SUCCESS",
                    "code": 0}}},
        status_code=200)
    response = app.test_client().post(
        '/api/v1.0/remove_spare_device/',
        data='''{
                "name": "unvme-ns-3"
                }''',
        headers={'x-access-token': json_token})

    #data = json.loads(response.get_data(as_text=True))
    assert response.status_code == 200


@requests_mock.Mocker(kw="mock")
@mock.patch("rest.app.connection_factory.get_current_user",
            return_value="test", autospec=True)
def test_delete_volumes(mock_get_current_user, **kwargs):
    kwargs["mock"].delete(
        DAGENT_URL + '/api/ibofos/v1/volume',
        json={
            "result": {
                "status": {
                    "description": "SUCCESS",
                    "code": 0}},
            "info": {
                "state": "ACTIVE",
                "capacity": 12345678,
                "used": 0}},
        status_code=200)
    response = app.test_client().post(
        '/api/v1.0/delete_volumes',
        data='''{
                "volumes": ["vol1", "vol2"]
                }''',
        headers={'x-access-token': json_token})

    #data = json.loads(response.get_data(as_text=True))
    assert response.status_code == 200


@requests_mock.Mocker(kw="mock")
@mock.patch("rest.app.connection_factory.get_current_user",
            return_value="test", autospec=True)
def test_update_volume(mock_get_current_user, **kwargs):
    kwargs["mock"].put(
        DAGENT_URL + '/api/ibofos/v1/volume',
        json={
            "result": {
                "status": {
                    "description": "SUCCESS",
                    "code": 0}},
            "info": {
                "state": "ACTIVE",
                "capacity": 12345678,
                "used": 0}},
        status_code=200)
    response = app.test_client().put(
        '/api/v1.0/update-volume/',
        data='''{
                "name": "vol1",
                "maxbw": 20,
                "maxiops": 20
                }''',
        headers={'x-access-token': json_token})

    #data = json.loads(response.get_data(as_text=True))
    assert response.status_code == 200
