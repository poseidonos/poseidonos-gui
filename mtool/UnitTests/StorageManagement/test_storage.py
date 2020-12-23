import os
import pytest
from rest.app import app
import requests_mock
import jwt
import datetime
from unittest import mock
from flask import json
from rest.rest_api.device.device import list_devices
from rest.app import make_block_aligned

json_token = jwt.encode({'_id': "test", 'exp': datetime.datetime.utcnow(
) + datetime.timedelta(minutes=60)}, app.config['SECRET_KEY'])
ip = os.environ.get('DAGENT_HOST', 'localhost')

DAGENT_URL = 'http://' + ip + ':3000'

INFLUXDB_URL = 'http://0.0.0.0:8086/write?db=poseidon&rp=autogen'

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


@requests_mock.Mocker(kw="mock")
@mock.patch("rest.app.connection_factory.get_current_user",
            return_value="test", autospec=True)
def test_get_devices(mock_get_current_user, **kwargs):
    kwargs["mock"].post(INFLUXDB_URL, text='Success', status_code=204)
    kwargs["mock"].get(DAGENT_URL + '/api/ibofos/v1/devices',
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
def test_get_smart_info(mock_get_current_user, **kwargs):
    kwargs["mock"].post(INFLUXDB_URL, text='Success', status_code=204)
    kwargs["mock"].get(DAGENT_URL + '/api/ibofos/v1/devices/unvme-ns-1/smart',
                       json={"result": {"status": {"description": "SUCCESS"},
                                        "data": {"temp": "120C"}}},
                       status_code=200)
    response = app.test_client().get(
        '/api/v1.0/device/smart/unvme-ns-1',
        headers={'x-access-token': json_token})
    assert response.status_code == 200


@requests_mock.Mocker(kw="mock")
@mock.patch("rest.app.connection_factory.get_current_user",
            return_value="test", autospec=True)
def test_get_smart_info_failure(mock_get_current_user, **kwargs):
    kwargs["mock"].post(INFLUXDB_URL, text='Success', status_code=204)
    kwargs["mock"].get(DAGENT_URL + '/api/ibofos/v1/devices/unvme-ns-1/smart', status_code=200)
    response = app.test_client().get(
        '/api/v1.0/device/smart/unvme-ns-1',
        headers={'x-access-token': json_token})
    assert response.status_code == 500


@requests_mock.Mocker(kw="mock")
@mock.patch("rest.app.connection_factory.get_current_user",
            return_value="test", autospec=True)
def test_get_volumes(mock_get_current_user, **kwargs):
    kwargs["mock"].post(INFLUXDB_URL, text='Success', status_code=204)
    kwargs["mock"].get(
        DAGENT_URL + '/api/ibofos/v1/volumes',
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
def test_get_volumes_failure(mock_get_current_user, **kwargs):
    kwargs["mock"].post(INFLUXDB_URL, text='Success', status_code=204)
    kwargs["mock"].get(
        DAGENT_URL + '/api/ibofos/v1/volumes',
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
        status_code=500)
    response = app.test_client().get(
        '/api/v1.0/get_volumes/',
        headers={'x-access-token': json_token})

    #data = json.loads(response.get_data(as_text=True))
    assert response.status_code == 500
    kwargs["mock"].get(
        DAGENT_URL + '/api/ibofos/v1/volumes',
        json=None,
        status_code=500)
    response = app.test_client().get(
        '/api/v1.0/get_volumes/',
        headers={'x-access-token': json_token})

    #data = json.loads(response.get_data(as_text=True))
    assert response.status_code == 500


@requests_mock.Mocker(kw="mock")
@mock.patch("rest.app.connection_factory.get_current_user",
            return_value="test", autospec=True)
def test_get_available_storage(mock_get_current_user, **kwargs):
    kwargs["mock"].post(INFLUXDB_URL, text='Success', status_code=204)
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
def test_get_available_storage_failure(mock_get_current_user, **kwargs):
    kwargs["mock"].post(INFLUXDB_URL, text='Success', status_code=204)
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
        status_code=500)
    response = app.test_client().get(
        '/api/v1.0/available_storage/',
        headers={'x-access-token': json_token})

    #data = json.loads(response.get_data(as_text=True))
    assert response.status_code == 200

    kwargs["mock"].get(
        DAGENT_URL + '/api/ibofos/v1/system',
        json=None, status_code=200)
    response = app.test_client().get(
        '/api/v1.0/available_storage/',
        headers={'x-access-token': json_token})

    #data = json.loads(response.get_data(as_text=True))
    assert response.status_code == 200


@requests_mock.Mocker(kw="mock")
@mock.patch("rest.app.connection_factory.get_current_user",
            return_value="test", autospec=True)
def test_get_available_storage_failurei_2(mock_get_current_user, **kwargs):
    kwargs["mock"].post(INFLUXDB_URL, text='Success', status_code=204)
    kwargs["mock"].get(
        DAGENT_URL + '/api/ibofos/v1/system',
        json={
            "result": {
                "status": {
                    "description": "SUCCESS",
                    "code": 0}},
            "info": {
                "state": "",
                "capacity": 0,
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
    kwargs["mock"].post(INFLUXDB_URL, text='Success', status_code=204)
    kwargs["mock"].get(
        DAGENT_URL +
        '/api/ibofos/v1/volumes/maxcount',
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
def test_get_volume_count_failure(mock_get_current_user, **kwargs):
    kwargs["mock"].post(INFLUXDB_URL, text='Success', status_code=204)
    kwargs["mock"].get(
        DAGENT_URL +
        '/api/ibofos/v1/volumes/maxcount',
        json=None,
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
    kwargs["mock"].post(INFLUXDB_URL, text='Success', status_code=204)
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
                "name": "POSArray",
                "raidtype": 5,
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
def test_create_arrays_failure(mock_get_current_user, **kwargs):
    kwargs["mock"].post(INFLUXDB_URL, text='Success', status_code=204)
    kwargs["mock"].get(
        DAGENT_URL +
        '/api/ibofos/v1/system',
        json=None, status_code=200)
    kwargs["mock"].post(
        DAGENT_URL +
        '/api/ibofos/v1/array',
        json=None,
        status_code=200)
    kwargs["mock"].post(
        DAGENT_URL +
        '/api/ibofos/v1/system/mount',
        json=None,
        status_code=200)
    response = app.test_client().post(
        '/api/v1.0/create_arrays/',
        data='''{
                "name": "POSArray",
                "raidtype": 5,
                "spareDisks": ["unvmens-0"],
                "writeBufferDisk": [],
                "metaDisk": [],
                "storageDisks": ["unvme-ns-3", "unvme-ns-2", "unvme-ns-1"],
                "size": 12345678
                }''',
        headers={'x-access-token': json_token})

    #data = json.loads(response.get_data(as_text=True))
    assert response.status_code == 500


"""
@requests_mock.Mocker(kw="mock")
@mock.patch("rest.app.connection_factory.get_current_user",
            return_value="test", autospec=True)
def test_get_arrays(mock_get_current_user, **kwargs):
    kwargs["mock"].post(INFLUXDB_URL, text='Success', status_code=204)
    kwargs["mock"].get(DAGENT_URL + '/api/ibofos/v1/devices/all/scan',json = {'rid': 'c5f7fca4-d306-4bea-a288-412bd6cc7002', 'lastSuccessTime': 1606298101, 'result': {'status': {'module': 'COMMON', 'code': 0, 'level': 'INFO', 'description': 'Success'}}, 'info': {'capacity': 20323436278580, 'rebuildingProgress': '0', 'situation': 'NORMAL', 'state': 'NORMAL', 'used': 2199023255552}}, status_code=200)
    kwargs["mock"].get(DAGENT_URL + '/api/ibofos/v1/devices/all/scan',json = {'rid': '104e2c46-89b3-433d-8f6a-b4f7fa176c27', 'lastSuccessTime': 1606298716, 'result': {'status': {'module': 'COMMON', 'code': 0, 'level': 'INFO', 'description': 'Success'}}, 'info': {'capacity': 20323436278580, 'rebuildingProgress': '0', 'situation': 'NORMAL', 'state': 'NORMAL', 'used': 2199023255552}}, status_code=200)
	
    kwargs["mock"].get(DAGENT_URL + '/api/ibofos/v1/array/POSArray/load',json = {'rid': '99b9626b-ca23-4f0e-86bd-643fa4cb8a1c', 'lastSuccessTime': 1606298720, 'result': {'status': {'module': 'Array', 'code': 2500, 'level': 'ERROR', 'description': 'Array is alreday mounted.'}}, 'info': {'capacity': 20323436278580, 'rebuildingProgress': '0', 'situation': 'NORMAL', 'state': 'NORMAL', 'used': 2199023255552}}, status_code=200)
	
    kwargs["mock"].get(DAGENT_URL + '/api/ibofos/v1/array/',json = {'rid': 'c88db904-79d5-4cc3-9d78-0389af9b6ea8', 'lastSuccessTime': 1606298720, 'result': {'status': {'module': 'COMMON', 'code': 0, 'level': 'INFO', 'description': 'Success'}, 'data': {'devicelist': [{'name': 'uram0', 'type': 'BUFFER'}, {'name': 'unvme-ns-0', 'type': 'DATA'}, {'name': 'unvme-ns-1', 'type': 'DATA'}, {'name': 'unvme-ns-2', 'type': 'DATA'}, {'name': 'unvme-ns-3', 'type': 'DATA'}]}}, 'info': {'capacity': 20323436278580, 'rebuildingProgress': '0', 'situation': 'NORMAL', 'state': 'NORMAL', 'used': 2199023255552}}, status_code=200)


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
"""

@requests_mock.Mocker(kw="mock")
@mock.patch("rest.app.connection_factory.get_current_user",
            return_value="test", autospec=True)
def test_create_volumes(mock_get_current_user, **kwargs):
    kwargs["mock"].post(INFLUXDB_URL, text='Success', status_code=204)
    kwargs["mock"].post(
        DAGENT_URL +
        '/api/ibofos/v1/volumes',
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
                "suffix": 1,
                "max_available_size": 1722281885696
                }''',
        headers={'x-access-token': json_token})

    #data = json.loads(response.get_data(as_text=True))
    assert response.status_code == 200


@requests_mock.Mocker(kw="mock")
@mock.patch("rest.app.connection_factory.get_current_user",
            return_value="test", autospec=True)
def test_create_volumes_failure(mock_get_current_user, **kwargs):
    kwargs["mock"].post(INFLUXDB_URL, text='Success', status_code=204)
    kwargs["mock"].post(
        DAGENT_URL +
        '/api/ibofos/v1/volumes',
        json=None,
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
                "suffix": 1,
                "max_available_size": 1722281885696
                }''',
        headers={'x-access-token': json_token})

    #data = json.loads(response.get_data(as_text=True))
    assert response.status_code == 500


@requests_mock.Mocker(kw="mock")
@mock.patch("rest.app.connection_factory.get_current_user",
            return_value="test", autospec=True)
def test_create_volumes_max_size(mock_get_current_user, **kwargs):
    kwargs["mock"].post(INFLUXDB_URL, text='Success', status_code=204)
    kwargs["mock"].post(
        DAGENT_URL +
        '/api/ibofos/v1/volumes',
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
                "size": 0,
                "maxbw": 100,
                "maxiops": 100,
                "description": "Volume 1",
                "unit": "GB",
                "mount_vol": true,
                "stop_on_error": true,
                "count": 1,
                "suffix": 1,
                "max_available_size": 1722281885696
                }''',
        headers={'x-access-token': json_token})

    #data = json.loads(response.get_data(as_text=True))
    assert response.status_code == 200

@requests_mock.Mocker(kw="mock")
@mock.patch("rest.app.connection_factory.get_current_user",
            return_value="test", autospec=True)
def test_create_volumes_tb(mock_get_current_user, **kwargs):
    kwargs["mock"].post(INFLUXDB_URL, text='Success', status_code=204)
    kwargs["mock"].post(
        DAGENT_URL +
        '/api/ibofos/v1/volumes',
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
                "size": 1.572,
                "maxbw": 100,
                "maxiops": 100,
                "description": "Volume 1",
                "unit": "TB",
                "mount_vol": true,
                "stop_on_error": true,
                "count": 1,
                "suffix": 1,
                "max_available_size": 1722281885696
                }''',
        headers={'x-access-token': json_token})

    #data = json.loads(response.get_data(as_text=True))
    assert response.status_code == 200

@requests_mock.Mocker(kw="mock")
@mock.patch("rest.app.connection_factory.get_current_user",
            return_value="test", autospec=True)
def test_create_volumes_pb(mock_get_current_user, **kwargs):
    kwargs["mock"].post(INFLUXDB_URL, text='Success', status_code=204)
    kwargs["mock"].post(
        DAGENT_URL +
        '/api/ibofos/v1/volumes',
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
                "unit": "pb",
                "mount_vol": true,
                "stop_on_error": true,
                "count": 1,
                "suffix": 1,
                "max_available_size": 1722281885696
                }''',
        headers={'x-access-token': json_token})

    #data = json.loads(response.get_data(as_text=True))
    assert response.status_code == 200

@requests_mock.Mocker(kw="mock")
@mock.patch("rest.app.connection_factory.get_current_user",
            return_value="test", autospec=True)
def test_create_volumes_default_unit(mock_get_current_user, **kwargs):
    kwargs["mock"].post(INFLUXDB_URL, text='Success', status_code=204)
    kwargs["mock"].post(
        DAGENT_URL +
        '/api/ibofos/v1/volumes',
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
                "size": 10,
                "maxbw": 100,
                "maxiops": 100,
                "description": "Volume 1",
                "unit": "ZB",
                "mount_vol": true,
                "stop_on_error": true,
                "count": 1,
                "suffix": 1,
                "max_available_size": 1722281885696
                }''',
        headers={'x-access-token': json_token})

    #data = json.loads(response.get_data(as_text=True))
    assert response.status_code == 200


def test_make_block_aligned():
    size = make_block_aligned(8729521029.12) #8.13 GB
    assert size == 8729395200

    size = make_block_aligned(1722281885696)
    assert size == 1722281885696  #8 GB


@requests_mock.Mocker(kw="mock")
@mock.patch("rest.app.connection_factory.get_current_user",
            return_value="test", autospec=True)
def test_add_spare(mock_get_current_user, **kwargs):
    kwargs["mock"].post(INFLUXDB_URL, text='Success', status_code=204)
    kwargs["mock"].post(
        DAGENT_URL +
        '/api/ibofos/v1/array/POSArray/devices',
        json={
            "result": {
                "status": {
                    "description": "SUCCESS",
                    "code": 0}}},
        status_code=200)
    response = app.test_client().post(
        '/api/v1.0/add_spare_device/',
        data='''{
                "name": "unvme-ns-3",
                "array" : "POSArray"
                }''',
        headers={'x-access-token': json_token})

    #data = json.loads(response.get_data(as_text=True))
    assert response.status_code == 200

@requests_mock.Mocker(kw="mock")
@mock.patch("rest.app.connection_factory.get_current_user",
            return_value="test", autospec=True)
def test_add_spare_failure(mock_get_current_user, **kwargs):
    kwargs["mock"].post(INFLUXDB_URL, text='Success', status_code=204)
    kwargs["mock"].post(
        DAGENT_URL +
        '/api/ibofos/v1/array/POSArray/devices',
        json={
            "result": {}},
        status_code=500)
    response = app.test_client().post(
        '/api/v1.0/add_spare_device/',
        data='''{
                "name": "unvme-ns-3",
                "array" : "POSArray"
                }''',
        headers={'x-access-token': json_token})

    #data = json.loads(response.get_data(as_text=True))
    assert response.status_code == 500


@requests_mock.Mocker(kw="mock")
@mock.patch("rest.app.connection_factory.get_current_user",
            return_value="test", autospec=True)
def test_add_spare_failure_2(mock_get_current_user, **kwargs):
    kwargs["mock"].post(INFLUXDB_URL, text='Success', status_code=204)
    kwargs["mock"].post(
        DAGENT_URL +
        '/api/ibofos/v1/array/POSArray/devices',
        json={
            "result": {
                "status": {
                    "description": "FAILED",
                    "code": 10}}},
        status_code=400)
    response = app.test_client().post(
        '/api/v1.0/add_spare_device/',
        data='''{
                "name": "unvme-ns-3",
                "array": "POSArray"
                }''',
        headers={'x-access-token': json_token})

    #data = json.loads(response.get_data(as_text=True))
    assert response.status_code == 200

    kwargs["mock"].post(
        DAGENT_URL +
        '/api/ibofos/v1/array/POSArray/devices',
        json=None,
        status_code=400)
    response = app.test_client().post(
        '/api/v1.0/add_spare_device/',
        data='''{
                "name": "unvme-ns-3",
                "array": "POSArray"
                }''',
        headers={'x-access-token': json_token})

    #data = json.loads(response.get_data(as_text=True))
    assert response.status_code == 500

@requests_mock.Mocker(kw="mock")
@mock.patch("rest.app.connection_factory.get_current_user",
            return_value="test", autospec=True)
def test_remove_spare(mock_get_current_user, **kwargs):
    kwargs["mock"].post(INFLUXDB_URL, text='Success', status_code=204)
    kwargs["mock"].delete(
        DAGENT_URL +
        '/api/ibofos/v1/array/POSArray/devices/unvme-ns-3',
        json={
            "result": {
                "status": {
                    "description": "SUCCESS",
                    "code": 0}}},
        status_code=200)
    response = app.test_client().post(
        '/api/v1.0/remove_spare_device/',
        data='''{
                "name": "unvme-ns-3",
                "array": "POSArray"
                }''',
        headers={'x-access-token': json_token})

    #data = json.loads(response.get_data(as_text=True))
    assert response.status_code == 200

@requests_mock.Mocker(kw="mock")
@mock.patch("rest.app.connection_factory.get_current_user",
            return_value="test", autospec=True)
def test_remove_spare_failure(mock_get_current_user, **kwargs):
    kwargs["mock"].post(INFLUXDB_URL, text='Success', status_code=204)
    kwargs["mock"].delete(
        DAGENT_URL +
        '/api/ibofos/v1/array/POSArray/devices/unvme-ns-3',
        json={
            "result": {}},
        status_code=500)
    response = app.test_client().post(
        '/api/v1.0/remove_spare_device/',
        data='''{
                "name": "unvme-ns-3",
                "array": "POSArray"
                }''',
        headers={'x-access-token': json_token})

    #data = json.loads(response.get_data(as_text=True))
    assert response.status_code == 500

    kwargs["mock"].delete(
        DAGENT_URL +
        '/api/ibofos/v1/array/POSArray/devices/unvme-ns-3',
        json=None,
        status_code=500)
    response = app.test_client().post(
        '/api/v1.0/remove_spare_device/',
        data='''{
                "name": "unvme-ns-3",
                "array": "POSArray"
                }''',
        headers={'x-access-token': json_token})

    #data = json.loads(response.get_data(as_text=True))
    assert response.status_code == 500


@requests_mock.Mocker(kw="mock")
@mock.patch("rest.app.connection_factory.get_current_user",
            return_value="test", autospec=True)
def test_remove_spare_failure_2(mock_get_current_user, **kwargs):
    kwargs["mock"].post(INFLUXDB_URL, text='Success', status_code=204)
    kwargs["mock"].delete(
        DAGENT_URL +
        '/api/ibofos/v1/array/POSArray/devices/unvme-ns-3',
        json={
            "result": {
                "status": {
                    "description": "FAILED",
                    "code": 10}}},
        status_code=400)
    response = app.test_client().post(
        '/api/v1.0/remove_spare_device/',
        data='''{
                "name": "unvme-ns-3",
                "array":"POSArray"
                }''',
        headers={'x-access-token': json_token})

    #data = json.loads(response.get_data(as_text=True))
    assert response.status_code == 200


@requests_mock.Mocker(kw="mock")
@mock.patch("rest.app.connection_factory.get_current_user",
            return_value="test", autospec=True)
def test_delete_array(mock_get_current_user, **kwargs):
    kwargs["mock"].post(INFLUXDB_URL, text='Success', status_code=204)
    kwargs["mock"].delete(
        DAGENT_URL +
        '/api/ibofos/v1/system/mount',
        json={
            "result": {
                "status": {
                    "description": "SUCCESS",
                    "code": 0}}},
        status_code=200)
    kwargs["mock"].delete(
        DAGENT_URL +
        '/api/ibofos/v1/array/POSArray',
        json={
            "result": {
                "status": {
                    "description": "SUCCESS",
                    "code": 0}}},
        status_code=200)

    response = app.test_client().post(
        '/api/v1.0/delete_array/POSArray',
        headers={'x-access-token': json_token})
    assert response.status_code == 200


@requests_mock.Mocker(kw="mock")
@mock.patch("rest.app.connection_factory.get_current_user",
            return_value="test", autospec=True)
def test_delete_array_failure(mock_get_current_user, **kwargs):
    kwargs["mock"].post(INFLUXDB_URL, text='Success', status_code=204)
    kwargs["mock"].delete(
        DAGENT_URL +
        '/api/ibofos/v1/system/mount',
        json={
            "result": {
                "status": {
                    "description": "SUCCESS",
                    "code": 0}}},
        status_code=200)
    kwargs["mock"].delete(
        DAGENT_URL +
        '/api/ibofos/v1/array/POSArray',
        json={
            "result": {
                "status": {
                    "description": "FAIL",
                    "code": 0}}},
        status_code=400)

    response = app.test_client().post(
        '/api/v1.0/delete_array/POSArray',
        headers={'x-access-token': json_token})
    assert response.status_code == 200
    kwargs["mock"].delete(
        DAGENT_URL +
        '/api/ibofos/v1/system/mount',
        json=None,
        status_code=200)
    kwargs["mock"].delete(
        DAGENT_URL +
        '/api/ibofos/v1/array/POSArray',
        json=None,
        status_code=400)

    response = app.test_client().post(
        '/api/v1.0/delete_array/POSArray',
        headers={'x-access-token': json_token})
    assert response.status_code == 500

@requests_mock.Mocker(kw="mock")
@mock.patch("rest.app.connection_factory.get_current_user",
            return_value="test", autospec=True)
def test_delete_array_failure_2(mock_get_current_user, **kwargs):
    kwargs["mock"].post(INFLUXDB_URL, text='Success', status_code=204)
    kwargs["mock"].delete(
        DAGENT_URL +
        '/api/ibofos/v1/system/mount',
        json={
            "result": {
                "status": {
                    "description": "SUCCESS",
                    "code": 0}}},
        status_code=200)
    kwargs["mock"].delete(
        DAGENT_URL +
        '/api/ibofos/v1/array/POSArray',
        json={},
        status_code=400)

    response = app.test_client().post(
        '/api/v1.0/delete_array/POSArray',
        headers={'x-access-token': json_token})
    assert response.status_code == 500


@requests_mock.Mocker(kw="mock")
@mock.patch("rest.app.connection_factory.get_current_user",
            return_value="test", autospec=True)
def test_delete_volumes(mock_get_current_user, **kwargs):
    kwargs["mock"].post(INFLUXDB_URL, text='Success', status_code=204)
    kwargs["mock"].delete(
        DAGENT_URL + '/api/ibofos/v1/volumes/vol1',
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
        '/api/v1.0/delete_volumes/POSArray',
        data='''{
                "volumes": ["vol1"]
                }''',
        headers={'x-access-token': json_token})

    #data = json.loads(response.get_data(as_text=True))
    assert response.status_code == 200


@requests_mock.Mocker(kw="mock")
@mock.patch("rest.app.connection_factory.get_current_user",
            return_value="test", autospec=True)
def test_delete_volumes_failure(mock_get_current_user, **kwargs):
    kwargs["mock"].post(INFLUXDB_URL, text='Success', status_code=204)
    kwargs["mock"].delete(
        DAGENT_URL + '/api/ibofos/v1/volumes/vol1',
        json={
            "result": {
                "status": {
                    "description": "FAILED",
                    "code": 10}},
            "info": {
                "state": "ACTIVE",
                "capacity": 12345678,
                "used": 0}},
        status_code=500)
    response = app.test_client().post(
        '/api/v1.0/delete_volumes/POSArray',
        data='''{
                "volumes": ["vol1"]
                }''',
        headers={'x-access-token': json_token})
    assert response.status_code == 500

    kwargs["mock"].delete(
        DAGENT_URL + '/api/ibofos/v1/volumes/vol1',
        json=None,
        status_code=500)
    response = app.test_client().post(
        '/api/v1.0/delete_volumes/POSArray',
        data='''{
                "volumes": ["vol1"]
                }''',
        headers={'x-access-token': json_token})
    assert response.status_code == 500

@requests_mock.Mocker(kw="mock")
@mock.patch("rest.app.connection_factory.get_current_user",
            return_value="test", autospec=True)
def test_delete_volumes_failed(mock_get_current_user, **kwargs):
    kwargs["mock"].post(INFLUXDB_URL, text='Success', status_code=204)
    kwargs["mock"].delete(
        DAGENT_URL + '/api/ibofos/v1/volumes/vol1',
        json={
            "result": {
                "status": {
                    "description": "FAILED",
                    "code": 10}},
            "info": {
                "state": "ACTIVE",
                "capacity": 12345678,
                "used": 0}},
        status_code=400)
    response = app.test_client().post(
        '/api/v1.0/delete_volumes/POSArray',
        data='''{
                "volumes": ["vol1"]
                }''',
        headers={'x-access-token': json_token})

    #data = json.loads(response.get_data(as_text=True))
    assert response.status_code == 200


@requests_mock.Mocker(kw="mock")
@mock.patch("rest.app.connection_factory.get_current_user",
            return_value="test", autospec=True)
def test_update_volume(mock_get_current_user, **kwargs):
    kwargs["mock"].post(INFLUXDB_URL, text='Success', status_code=204)
    kwargs["mock"].patch(
        DAGENT_URL + '/api/ibofos/v1/volumes/vol1/qos',
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

    kwargs["mock"].patch(
        DAGENT_URL + '/api/ibofos/v1/volumes/vol1/qos',
        json=None,
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
    assert response.status_code == 500


@requests_mock.Mocker(kw="mock")
@mock.patch("rest.app.connection_factory.get_current_user",
            return_value="test", autospec=True)
def test_rename_volume(mock_get_current_user, **kwargs):
    kwargs["mock"].post(INFLUXDB_URL, text='Success', status_code=204)
    kwargs["mock"].patch(
        DAGENT_URL + '/api/ibofos/v1/volumes/vol1',
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
    response = app.test_client().patch(
        '/api/v1.0/volumes/vol1',
        data='''{
            "param": {
                "name": "vol1",
                "newname": "vol"
                }
            }''',
        headers={'x-access-token': json_token})

    assert response.status_code == 200

    response = app.test_client().patch(
        '/api/v1.0/volumes/vol1',
        data='''{
            "param": {
                "name": "vol2",
                "newname": "vol"
                }
            }''',
        headers={'x-access-token': json_token})

    assert response.status_code == 500
    response = app.test_client().patch(
        '/api/v1.0/volumes/vol1',
        data='''{
            "param": {
                "newname": "vol"
                }
            }''',
        headers={'x-access-token': json_token})

    assert response.status_code == 500
    kwargs["mock"].patch(
        DAGENT_URL + '/api/ibofos/v1/volumes/vol1',
        status_code=400)
    response = app.test_client().patch(
        '/api/v1.0/volumes/vol1',
        data='''{
            "param": {
                "name": "vol1",
                "newname": "vol"
                }
            }''',
        headers={'x-access-token': json_token})

    #data = json.loads(response.get_data(as_text=True))
    assert response.status_code == 500



@requests_mock.Mocker(kw="mock")
@mock.patch("rest.app.connection_factory.get_current_user",
            return_value="test", autospec=True)
def test_mount_volume(mock_get_current_user, **kwargs):
    kwargs["mock"].post(INFLUXDB_URL, text='Success', status_code=204)
    kwargs["mock"].post(
        DAGENT_URL + '/api/ibofos/v1/volumes/vol1/mount',
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
        '/api/v1.0/volume/mount',
        data='''{
                "name": "vol1"
                }''',
        headers={'x-access-token': json_token})

    #data = json.loads(response.get_data(as_text=True))
    assert response.status_code == 200
    response = app.test_client().post(
        '/api/v1.0/volume/mount',
        data='''{
                "name": "vol1",
                }''',
        headers={'x-access-token': json_token})

    #data = json.loads(response.get_data(as_text=True))
    assert response.status_code == 500

    kwargs["mock"].post(
        DAGENT_URL + '/api/ibofos/v1/volumes/vol1/mount',
        json=None,
        status_code=200)
    response = app.test_client().post(
        '/api/v1.0/volume/mount',
        data='''{
                "name": "vol1"
                }''',
        headers={'x-access-token': json_token})

    #data = json.loads(response.get_data(as_text=True))
    assert response.status_code == 500

@requests_mock.Mocker(kw="mock")
@mock.patch("rest.app.connection_factory.get_current_user",
            return_value="test", autospec=True)
def test_unmount_volume(mock_get_current_user, **kwargs):
    kwargs["mock"].post(INFLUXDB_URL, text='Success', status_code=204)
    kwargs["mock"].delete(
        DAGENT_URL + '/api/ibofos/v1/volumes/vol1/mount',
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
    response = app.test_client().delete(
        '/api/v1.0/volume/mount',
        data='''{
                "name": "vol1"
                }''',
        headers={'x-access-token': json_token})

    #data = json.loads(response.get_data(as_text=True))
    assert response.status_code == 200
    response = app.test_client().delete(
        '/api/v1.0/volume/mount',
        data='''{
                "name": "vol1",
                }''',
        headers={'x-access-token': json_token})
    assert response.status_code == 500
    kwargs["mock"].delete(
        DAGENT_URL + '/api/ibofos/v1/volumes/vol1/mount',
        json=None,
        status_code=200)
    response = app.test_client().delete(
        '/api/v1.0/volume/mount',
        data='''{
                "name": "vol1"
                }''',
        headers={'x-access-token': json_token})

    #data = json.loads(response.get_data(as_text=True))
    assert response.status_code == 500


@requests_mock.Mocker(kw="mock")
def test_list_devices(global_data, **kwargs):
    kwargs["mock"].post(INFLUXDB_URL, text='Success', status_code=204)
    kwargs["mock"].get(DAGENT_URL + '/api/ibofos/v1/devices',
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
    output = list_devices()
    response = app.test_client().get(
        '/api/v1.0/get_devices/',
        headers={
            'x-access-token': global_data['token'],
            'Accept': 'application/json',
        },
        content_type='application/json',
    )
    assert len(str(output)) == len(response.data.decode('utf-8'))

@requests_mock.Mocker(kw="mock")
def test_list_devices_failure(global_data, **kwargs):
    kwargs["mock"].post(INFLUXDB_URL, text='Success', status_code=204)
    kwargs["mock"].get(DAGENT_URL + '/api/ibofos/v1/devices',
                       json={"result": {"status": {"description": "NO DEVICE EXIST"},
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
    kwargs["mock"].get(DAGENT_URL + '/api/ibofos/v1/devices/all/scan',json = {'rid': 'c5f7fca4-d306-4bea-a288-412bd6cc7002', 'lastSuccessTime': 1606298101, 'result': {'status': {'module': 'COMMON', 'code': 0, 'level': 'INFO', 'description': 'Success'}}, 'info': {'capacity': 20323436278580, 'rebuildingProgress': '0', 'situation': 'NORMAL', 'state': 'NORMAL', 'used': 2199023255552}}, status_code=200)

    #output = list_devices()
    response = app.test_client().get(
        '/api/v1.0/get_devices/',
        headers={
            'x-access-token': global_data['token'],
            'Accept': 'application/json',
        },
        content_type='application/json',
    )
    assert response.status_code == 200
    kwargs["mock"].get(DAGENT_URL + '/api/ibofos/v1/devices', json=None, status_code=200)
    kwargs["mock"].get(DAGENT_URL + '/api/ibofos/v1/devices/all/scan',json = None, status_code=200)

    response = app.test_client().get(
        '/api/v1.0/get_devices/',
        headers={
            'x-access-token': global_data['token'],
            'Accept': 'application/json',
        },
        content_type='application/json',
    )
    assert response.status_code == 500



@requests_mock.Mocker(kw="mock")
def test_get_volume_collection(**kwargs):
    kwargs["mock"].post(INFLUXDB_URL, text='Success', status_code=204)
    kwargs["mock"].get(DAGENT_URL + '/api/ibofos/v1/volumes', json={ "result": {"status": { "description": "SUCCESS"}, "data": {
                    "volumes": [
                        {
                            "id":0,
                            "status":"status",
                            "maxbw":123,
                            "maxiops":111,
                            "name": "vol1",
                            "size": 1234567,
                            "total": 12345678,
                            "remain": 12345678}]}}}, status_code=200)

    response = app.test_client().get('/redfish/v1/StorageServices/0/Volumes',headers={'x-access-token': json_token})

    assert response.status_code == 200
@requests_mock.Mocker(kw="mock")
def test_get_volume_collection_failure(**kwargs):
    kwargs["mock"].post(INFLUXDB_URL, text='Success', status_code=204)
    kwargs["mock"].get(DAGENT_URL + '/api/ibofos/v1/volumes',
                       status_code=200)

    response = app.test_client().get('/redfish/v1/StorageServices/0/Volumes',headers={'x-access-token': json_token})

    assert response.status_code == 200

@requests_mock.Mocker(kw="mock")
def test_get_volume_failure(**kwargs):
    kwargs["mock"].post(INFLUXDB_URL, text='Success', status_code=204)
    kwargs["mock"].get(DAGENT_URL + '/api/ibofos/v1/volumes',
                       status_code=200)

    response = app.test_client().get('/redfish/v1/StorageServices/0/Volumes/0',headers={'x-access-token': json_token})

    assert response.status_code == 200


@requests_mock.Mocker(kw="mock")
def test_get_volume(**kwargs):
    kwargs["mock"].post(INFLUXDB_URL, text='Success', status_code=204)
    kwargs["mock"].get(DAGENT_URL + '/api/ibofos/v1/volumes', json={ "result": {"status": { "description": "SUCCESS"}, "data": {
                    "volumes": [
                        {
                            "id":0,
                            "status":"status",
                            "maxbw":123,
                            "maxiops":111,
                            "name": "vol1",
                            "size": 1234567,
                            "total": 12345678,
                            "remain": 12345678}]}}}, status_code=200)

    response = app.test_client().get('/redfish/v1/StorageServices/0/Volumes/0',headers={'x-access-token': json_token})

    assert response.status_code == 200

@requests_mock.Mocker(kw="mock")
def test_get_arrays_func(**kwargs):
    kwargs["mock"].post(INFLUXDB_URL, text='Success', status_code=204)
    kwargs["mock"].get(DAGENT_URL + '/api/ibofos/v1/array/POSArray/devices',json = {'rid': 'd0f6fff2-9544-486d-95b4-d2f084af98a9', 'lastSuccessTime': 1606294961, 'result': {'status': {'module': 'COMMON', 'code': 0, 'level': 'INFO', 'description': 'Success'}, 'data': {'devicelist': [{'name': 'uram0', 'type': 'BUFFER'}, {'name': 'unvme-ns-0', 'type': 'DATA'}, {'name': 'unvme-ns-1', 'type': 'DATA'}, {'name': 'unvme-ns-2', 'type': 'DATA'}, {'name': 'unvme-ns-3', 'type': 'DATA'}]}}, 'info': {'capacity': 20323436278580, 'rebuildingProgress': '0', 'situation': 'NORMAL', 'state': 'NORMAL', 'used': 2199023255552}}, status_code=200)

    response = app.test_client().get('/api/v1.0/get_arrays/',headers={'x-access-token': json_token})
    assert response.status_code == 200

@requests_mock.Mocker(kw="mock")
def test_get_arrays_func_failure(**kwargs):
    kwargs["mock"].post(INFLUXDB_URL, text='Success', status_code=204)
    kwargs["mock"].get(DAGENT_URL + '/api/ibofos/v1/array/POSArray/devices',json = None, status_code=200)

    response = app.test_client().get('/api/v1.0/get_arrays/',headers={'x-access-token': json_token})
    assert response.status_code == 200


@requests_mock.Mocker(kw="mock")
@mock.patch("rest.app.connection_factory.get_current_user",
            return_value="test", autospec=True)
def test_mount_array(mock_get_current_user,**kwargs):
    kwargs["mock"].post(INFLUXDB_URL, text='Success', status_code=204)
    kwargs["mock"].post(
        DAGENT_URL +
        '/api/ibofos/v1/system/mount',
        json={
            "result": {
                "status": {
                    "description": "SUCCESS",
                    "code": 0}}},
        status_code=200)

    response = app.test_client().post('/api/v1.0/ibofos/mount',headers={'x-access-token': json_token})
    assert response.status_code == 200

@requests_mock.Mocker(kw="mock")
@mock.patch("rest.app.connection_factory.get_current_user",
            return_value="test", autospec=True)
def test_mount_array_failure(mock_get_current_user,**kwargs):
    kwargs["mock"].post(INFLUXDB_URL, text='Success', status_code=204)
    kwargs["mock"].post(
        DAGENT_URL +
        '/api/ibofos/v1/system/mount',
        json=None,
        status_code=200)

    response = app.test_client().post('/api/v1.0/ibofos/mount',headers={'x-access-token': json_token})
    assert response.status_code == 500


@requests_mock.Mocker(kw="mock")
@mock.patch("rest.app.connection_factory.get_current_user",
            return_value="test", autospec=True)
def test_unmount_array(mock_get_current_user,**kwargs):
    kwargs["mock"].post(INFLUXDB_URL, text='Success', status_code=204)
    kwargs["mock"].delete(
        DAGENT_URL +
        '/api/ibofos/v1/system/mount',
        json={
            "result": {
                "status": {
                    "description": "SUCCESS",
                    "code": 0}}},
        status_code=200)

    response = app.test_client().delete('/api/v1.0/ibofos/mount',headers={'x-access-token': json_token})
    assert response.status_code == 200

@requests_mock.Mocker(kw="mock")
@mock.patch("rest.app.connection_factory.get_current_user",
            return_value="test", autospec=True)
def test_unmount_array_failure(mock_get_current_user,**kwargs):
    kwargs["mock"].post(INFLUXDB_URL, text='Success', status_code=204)
    kwargs["mock"].delete(
        DAGENT_URL +
        '/api/ibofos/v1/system/mount',
        json=None,
        status_code=200)

    response = app.test_client().delete('/api/v1.0/ibofos/mount',headers={'x-access-token': json_token})
    assert response.status_code == 500
