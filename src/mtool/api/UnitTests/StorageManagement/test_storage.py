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
import os
import pytest
from rest.app import app
import requests_mock
import jwt
import datetime
from unittest import mock
from flask import json
from rest.app import make_block_aligned

json_token = jwt.encode({'_id': "test", 'exp': datetime.datetime.utcnow(
) + datetime.timedelta(minutes=60)}, app.config['SECRET_KEY'])
ip = os.environ.get('DAGENT_HOST', 'localhost')

DAGENT_URL = 'http://' + ip + ':3000'

INFLUXDB_URL = 'http://0.0.0.0:8086/write?db=poseidon&rp=autogen'
ARRAY_NAME = "POSArray"
ARRAY_LIST_URL = DAGENT_URL + '/api/ibofos/v1/arrays'


# duplicate code functions
device_json = '''{
        "name": "uram4",
                "num_blocks" : 16777216,
                "block_size" : 512,
                "dev_type" : "uram",
                "numa" : 0
}'''
header_json = {'x-access-token': json_token}
delete_json = '''{
                "volumes": [{"name": "vol1", "isMounted": true}]
                }'''
volume_json ={
            "result": {
                "status": {
                    "description": "FAILED",
                    "code": 10}},
            "info": {
                "state": "ACTIVE",
                "capacity": 12345678,
                "used": 0}}
success_json = {
            "result": {
                "status": {
                    "description": "SUCCESS",
                    "code": 0}}}

device_list_json = {"result": {"status": {"description": "SUCCESS"},
                                        "data": {"devicelist": [{"name": "uram0",
                                                                 "type": "NVRAM",
                                                                 "size": 12345,
                                                                 "modelNumber": "DEFG",
                                                                 "serialNumber": "SN",
                                                                 "address":"0000:68:00.0",
                                                                 "class":"SYSTEM",
                                                                 "isAvailable":True,
                                                                 "numa":"0",
                                                                 "arrayName" : ""},
                                                                {"name": "unvme-ns-0",
                                                                 "type": "SSD",
                                                                 "size": 12345,
                                                                 "modelNumber": "ABCD",
                                                                 "serialNumber": "SN",
                                                                 "address":"0000:68:00.0",
                                                                 "class":"SYSTEM",
                                                                 "isAvailable":True,
                                                                 "numa": "0",
                                                                 "arrayName": ""}]}},
                             "data": {"devicelist": [{"name": "unvme-ns-0",
                                                      "type": "NVRAM"}]}}

device_list = [
                        {
                            "name": "uram0",
                            "type": "BUFFER"
                        },
                        {
                            "name": "S439NA0MB02505      ",
                            "type": "DATA"
                        },
                        {
                            "name": "S439NA0MB02476      ",
                            "type": "DATA"
                        },
                        {
                            "name": "S439NA0MB02503      ",
                            "type": "DATA"
                        },
                        {
                            "name": "S439NA0MB02514      ",
                            "type": "DATA"
                        }
                    ]
volume_list_json = {
            "result": {
                "status": {
                    "description": "SUCCESS"},
                "data": {
                    "volumes": [
                        {
                            "name": "vol1",
                            "size": 1234567,
                            "total": 12345678,
                            "remain": 12345678},
							{
                            "name": "vol2",
                            "size": 1234567,
                            "total": 12345678,
                            "remain": 12345678}]}}}
ibof_system_json = {
            "result": {
                "status": {
                    "description": "SUCCESS",
                    "code": 0}},
            "info": {
                "state": "ACTIVE",
                "capacity": 12345678,
                "used": 0}}

ibof_json = {
    "rid": "1fce61cc-ba2e-4308-b1f9-a1f483ac701e",
    "lastSuccessTime": 1626166295,
    "result": {
        "status": {
            "module": "COMMON",
            "code": 0,
            "level": "INFO",
            "description": "Success",
            "posDescription": "Volume Qos Policy Create"
        }
    },
    "info": {
        "version": "pos-0.9.4"
    }
}
mount_json = {
    "rid": "56532969-a24c-4387-827a-c4107550ebb8",
    "lastSuccessTime": 1637046369,
    "result": {
        "status": {
            "module": "COMMON",
            "code": 0,
            "level": "INFO",
            "description": "Success",
            "posDescription": "volume-0is mounted successfully"
        }
    },
    "info": {
        "version": "v0.10.1"
    }}
scan_json = {'rid': 'c5f7fca4-d306-4bea-a288-412bd6cc7002', 'lastSuccessTime': 1606298101, 'result': {'status': {'module': 'COMMON', 'code': 0, 'level': 'INFO', 'description': 'Success'}}, 'info': {'capacity': 20323436278580, 'rebuildingProgress': '0', 'situation': 'NORMAL', 'state': 'NORMAL', 'used': 2199023255552}}
array_list_json= {
    "rid": "354220f5-60b5-4e27-ba44-e4b4b34434f3",
    "lastSuccessTime": 1621261763,
    "result": {
        "status": {
            "module": "COMMON",
            "code": 0,
            "level": "INFO",
            "description": "Success"
        },
        "data": {
            "arrayList": [
                {
                    "createDatetime": "2021-05-06 23:53:26 +0530",
                    "devicelist":device_list,
                    "name": "POSArray",
                    "status": "Mounted",
                    "updateDatetime": "2021-05-06 23:53:26 +0530"
                },
				{
                    "createDatetime": "2021-05-06 23:53:26 +0530",
                    "devicelist":device_list,
                    "name": "POSArray2",
                    "status": "Mounted",
                    "updateDatetime": "2021-05-06 23:53:26 +0530"
                }
            ]
        }
    },
    "info": {
        "capacity": 0,
        "rebuildingProgress": "0",
        "state": "EXIST_NORMAL",
        "used": 0
    }
}

dagent_json={
    "rid": "63fdc326-b718-4cf7-9cc3-ea9d619d2315",
    "lastSuccessTime": 1620717645,
    "result": {
        "status": {
            "module": "COMMON",
            "code": 0,
            "level": "INFO",
            "description": "Success"
        },
        "data": {
            "capacity": 0,
            "createDatetime": "2021-05-10 19:41:08 +0530",
            "devicelist": [
                {
                    "name": "uram0",
                    "type": "BUFFER"
                },
                {
                    "name": "unvme-ns-0",
                    "type": "DATA"
                },
                {
                    "name": "unvme-ns-1",
                    "type": "DATA"
                },
                {
                    "name": "unvme-ns-2",
                    "type": "DATA"
                },
                {
                    "name": "unvme-ns-3",
                    "type": "SPARE"
                }
            ],
            "name": "POSArray",
            "rebuildingProgress": "0",
            "situation": "DEFAULT",
            "state": "OFFLINE",
            "updateDatetime": "2021-05-10 19:41:08 +0530",
            "used": 0
        }
    },
    "info": {
        "version": "pos-0.8.0-alpha1"
    }
}

dagent_array_json = {
    "rid": "995a1344-4742-48a2-9ade-cbb437cd34ba",
    "lastSuccessTime": 1653565027,
    "result": {
        "status": {
            "module": "COMMON",
            "code": 0,
            "level": "INFO",
            "description": "Success",
            "posDescription": "list of volumes in POSArray"
        },
        "data": {
            "volumes": [
                {
                    "index": 0,
                    "maxbw": 0,
                    "maxiops": 0,
                    "minbw": 0,
                    "miniops": 0,
                    "name": "sanity-controller-create-single-no-capacity-44BD4FEE-6EA20B12",
                    "remain": 10737418240,
                    "status": "Mounted",
                    "total": 10737418240,
                    "uuid": "0018c5e7-f769-4eb4-b974-19f3a211da1d"
                },
                {
                    "index": 1,
                    "maxbw": 0,
                    "maxiops": 0,
                    "minbw": 0,
                    "miniops": 0,
                    "name": "sanity-controller-create-single-with-capacity-44BD4FEE-6EA20B12",
                    "remain": 10737418240,
                    "status": "Mounted",
                    "total": 10737418240,
                    "uuid": "ab583871-6640-48b7-a5da-8b9f7ec070f0"
                },
                {
                    "index": 2,
                    "maxbw": 0,
                    "maxiops": 0,
                    "minbw": 0,
                    "miniops": 0,
                    "name": "sanity-controller-create-twice-44BD4FEE-6EA20B12",
                    "remain": 10737418240,
                    "status": "Mounted",
                    "total": 10737418240,
                    "uuid": "6bc461af-e9fa-4d29-8db3-20f6c54ff787"
                }
            ]
        }
    },
    "info": {
        "version": "v0.11.0-rc4"
    }
}

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
    kwargs["mock"].get(DAGENT_URL + '/api/ibofos/v1/devices/all/scan',json =scan_json, status_code=200)
    kwargs["mock"].get(DAGENT_URL + '/api/ibofos/v1/devices',
                       json=device_list_json,
                       status_code=200)

    kwargs["mock"].get(ARRAY_LIST_URL,
                       json=array_list_json, status_code=200)

    kwargs["mock"].get(DAGENT_URL + '/api/ibofos/v1/array/POSArray',
                       json=dagent_json, status_code=200)
    response = app.test_client().get(
        '/api/v1.0/get_devices/',
        headers=header_json)

    data = json.loads(response.get_data(as_text=True))
    print("data :",data)
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
        headers=header_json)
    assert response.status_code == 200


@requests_mock.Mocker(kw="mock")
@mock.patch("rest.app.connection_factory.get_current_user",
            return_value="test", autospec=True)
def test_get_smart_info_failure(mock_get_current_user, **kwargs):
    kwargs["mock"].post(INFLUXDB_URL, text='Success', status_code=204)
    kwargs["mock"].get(DAGENT_URL + '/api/ibofos/v1/devices/unvme-ns-1/smart', status_code=200)
    response = app.test_client().get(
        '/api/v1.0/device/smart/unvme-ns-1',
        headers=header_json)
    assert response.status_code == 500


@requests_mock.Mocker(kw="mock")
@mock.patch("rest.app.connection_factory.get_current_user",
            return_value="test", autospec=True)
def test_get_volumes(mock_get_current_user, **kwargs):
    kwargs["mock"].post(INFLUXDB_URL, text='Success', status_code=204)
    kwargs["mock"].get(
        DAGENT_URL + '/api/ibofos/v1/volumelist/'+ARRAY_NAME,
        json=dagent_array_json, status_code=200)
    response = app.test_client().get(
        '/api/v1/'+ARRAY_NAME+'/get_volumes/',
        headers=header_json)

    #data = json.loads(response.get_data(as_text=True))
    assert response.status_code == 200

@requests_mock.Mocker(kw="mock")
@mock.patch("rest.app.connection_factory.get_current_user",
            return_value="test", autospec=True)
def test_get_all_volumes(mock_get_current_user, **kwargs):
    kwargs["mock"].post(INFLUXDB_URL, text='Success', status_code=204)

    kwargs["mock"].get(ARRAY_LIST_URL,
                       json=array_list_json, status_code=200)

    kwargs["mock"].get(
        DAGENT_URL + '/api/ibofos/v1/volumelist/'+ARRAY_NAME,
        json=dagent_array_json, status_code=200)

    response = app.test_client().get(
        '/api/v1/get_all_volumes/',
        headers=header_json)

    #data = json.loads(response.get_data(as_text=True))
    assert response.status_code == 200


@requests_mock.Mocker(kw="mock")
@mock.patch("rest.app.connection_factory.get_current_user",
            return_value="test", autospec=True)
def test_get_volumes_failure(mock_get_current_user, **kwargs):
    kwargs["mock"].post(INFLUXDB_URL, text='Success', status_code=204)
    kwargs["mock"].get(
        DAGENT_URL + '/api/ibofos/v1/volumes/'+ARRAY_NAME,
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
        '/api/v1/'+ARRAY_NAME+'/get_volumes/',
        headers=header_json)

    #data = json.loads(response.get_data(as_text=True))
    assert len(json.loads(response.data)) == 0
    kwargs["mock"].get(
        DAGENT_URL + '/api/ibofos/v1/volumes/'+ARRAY_NAME,
        json=None,
        status_code=500)
    response = app.test_client().get(
        '/api/v1/'+ARRAY_NAME+'/get_volumes/',
        headers=header_json)

    #data = json.loads(response.get_data(as_text=True))
    assert len(json.loads(response.data)) == 0


@requests_mock.Mocker(kw="mock")
@mock.patch("rest.app.connection_factory.get_current_user",
            return_value="test", autospec=True)
def test_get_available_storage(mock_get_current_user, **kwargs):
    kwargs["mock"].post(INFLUXDB_URL, text='Success', status_code=204)
    kwargs["mock"].get(
        DAGENT_URL + '/api/ibofos/v1/system',
        json=ibof_system_json,
        status_code=200)
    response = app.test_client().get(
        '/api/v1.0/available_storage/',
        headers=header_json)

    #data = json.loads(response.get_data(as_text=True))
    assert response.status_code == 200


@requests_mock.Mocker(kw="mock")
@mock.patch("rest.app.connection_factory.get_current_user",
            return_value="test", autospec=True)
def test_get_available_storage_failure(mock_get_current_user, **kwargs):
    kwargs["mock"].post(INFLUXDB_URL, text='Success', status_code=204)
    kwargs["mock"].get(
        DAGENT_URL + '/api/ibofos/v1/system',
        json=ibof_system_json,
        status_code=500)
    response = app.test_client().get(
        '/api/v1.0/available_storage/',
        headers=header_json)

    #data = json.loads(response.get_data(as_text=True))
    assert response.status_code == 200

    kwargs["mock"].get(
        DAGENT_URL + '/api/ibofos/v1/system',
        json=None, status_code=200)
    response = app.test_client().get(
        '/api/v1.0/available_storage/',
        headers=header_json)

    #data = json.loads(response.get_data(as_text=True))
    assert response.status_code == 500


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
        headers=header_json)

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
        headers=header_json)

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
        headers=header_json)

    #data = json.loads(response.get_data(as_text=True))
    print("response ",response)
    assert response.status_code == 500

@requests_mock.Mocker(kw="mock")
@mock.patch("rest.app.connection_factory.get_current_user",
            return_value="test", autospec=True)
def test_create_arrays(mock_get_current_user, **kwargs):
    kwargs["mock"].post(INFLUXDB_URL, text='Success', status_code=204)
    kwargs["mock"].get(
        DAGENT_URL +
        '/api/ibofos/v1/array/'+ARRAY_NAME,
        json={
    "result": {
        "status": {
            "module": "COMMON",
            "code": 0,
            "level": "INFO",
            "description": "Success"
        },
        "data": {
        }
    }},status_code=200)
    kwargs["mock"].post(
        DAGENT_URL +
        '/api/ibofos/v1/array',
        json=success_json,
        status_code=200)

    kwargs["mock"].post(
        DAGENT_URL +
        '/api/ibofos/v1/array/'+ARRAY_NAME+'/mount',
        json=success_json,
        status_code=200)
    response = app.test_client().post(
        '/api/v1.0/create_arrays/',
        data='''{
                "arrayname": "POSArray",
                "raidtype": 5,
                "spareDisks": ["unvmens-0"],
                "writeBufferDisk": [],
                "metaDisk": [],
                "storageDisks": ["unvme-ns-3", "unvme-ns-2", "unvme-ns-1"],
                "size": 12345678,
                "writeThroughModeEnabled":true
                }''',
        headers=header_json)

    print("response data ",response.data)
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
        headers=header_json)

    #data = json.loads(response.get_data(as_text=True))
    assert response.status_code == 500


"""
@requests_mock.Mocker(kw="mock")
@mock.patch("rest.app.connection_factory.get_current_user",
            return_value="test", autospec=True)
def test_get_arrays(mock_get_current_user, **kwargs):
    kwargs["mock"].post(INFLUXDB_URL, text='Success', status_code=204)
    kwargs["mock"].get(DAGENT_URL + '/api/ibofos/v1/devices/all/scan',json = scan_json, status_code=200)
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
        headers=header_json)

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
        '/api/ibofos/v1/volumes/vol1/mount/subsystem',
        json=mount_json,
        status_code=200)
    kwargs["mock"].post(
        DAGENT_URL + '/api/ibofos/v1/qos',
        json=ibof_json,status_code=200)

    kwargs["mock"].post(
        DAGENT_URL +
        '/api/ibofos/v1/volumes',
        json=success_json,
        status_code=200)
    response = app.test_client().post(
        '/api/v1.0/save-volume/',
        data='''{
                "name": "vol1",
                "arrayname":"POSArray",
                "size": 123,
                "maxbw": 100,
                "maxiops": 100,
                "miniops":15,
                "description": "Volume 1",
                "unit": "GB",
                "mount_vol": true,
                "stop_on_error": true,
                "count": 1,
                "suffix": 1,
                "subsystem": {"subnqn": "nqn.2019-04.ibof:subsystem1", "transport_type": "TCP", "transport_service_id": "1158", "target_address": "111.100.13.97"},
                "max_available_size": 1722281885696,
                "iswalvol":false
                }''',
        headers=header_json)

    data = json.loads(response.get_data(as_text=True))
    print("data>>>>>>>>>>>>>>>>>>>>>>>>>>> ",data )
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
                "subsystem": "nqn.2019-04.ibof:subsystem1",
                "max_available_size": 1722281885696
                }''',
        headers=header_json)

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
        json=success_json,
        status_code=200)

    kwargs["mock"].post( DAGENT_URL + '/api/ibofos/v1/volumes/vol1/mount/subsystem',
        json={"rid": "56532969-a24c-4387-827a-c4107550ebb8",
    "lastSuccessTime": 1637046369,
    "result": {
        "status": {
            "module": "COMMON",
            "code": 0,
            "level": "INFO",
            "description": "Success",
            "posDescription": "volume-0is mounted successfully"}
    },
    "info": {
        "version": "v0.10.1"
    }}, status_code=200)

    kwargs["mock"].post(
        DAGENT_URL + '/api/ibofos/v1/qos',
        json=ibof_json,status_code=200)

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
                "max_available_size": 1722281885696,
				"subsystem": {"subnqn": "nqn.2019-04.ibof:subsystem1", "transport_type": "TCP", "transport_service_id": "1158", "target_address": "111.100.13.97"},
                "iswalvol":false
                }''',
        headers=header_json)

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
        json= success_json,
        status_code=200)
    kwargs["mock"].post(
        DAGENT_URL +
        '/api/ibofos/v1/volumes/vol1/mount/subsystem',
        json=mount_json,
        status_code=200)

    kwargs["mock"].post(
        DAGENT_URL + '/api/ibofos/v1/qos',
        json=ibof_json,status_code=200)

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
                "max_available_size": 1722281885696,
                "subsystem": {"subnqn": "nqn.2019-04.ibof:subsystem1", "transport_type": "TCP", "transport_service_id": "1158", "target_address": "111.100.13.97"},
                "iswalvol":false
                }''',
        headers=header_json)

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
        json=success_json,
        status_code=200)
    kwargs["mock"].post(
        DAGENT_URL +
        '/api/ibofos/v1/volumes/vol1/mount/subsystem',
        json=mount_json,
        status_code=200)

    kwargs["mock"].post(
        DAGENT_URL + '/api/ibofos/v1/qos',
        json=ibof_json,status_code=200)

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
                "max_available_size": 1722281885696,
                "subsystem": {"subnqn": "nqn.2019-04.ibof:subsystem1", "transport_type": "TCP", "transport_service_id": "1158", "target_address": "111.100.13.97"},
                "iswalvol":false
                }''',
        headers=header_json)

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
        json = success_json,
        status_code=200)
    kwargs["mock"].post(
        DAGENT_URL +
        '/api/ibofos/v1/volumes/vol1/mount/subsystem',
        json=mount_json,
        status_code=200)
    kwargs["mock"].post(
        DAGENT_URL + '/api/ibofos/v1/qos',
        json=ibof_json,status_code=200)
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
                "max_available_size": 1722281885696,
                "subsystem": {"subnqn": "nqn.2019-04.ibof:subsystem1", "transport_type": "TCP", "transport_service_id": "1158", "target_address": "111.100.13.97"},
                "iswalvol":false
                }''',
        headers=header_json)

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
        json=success_json,
        status_code=200)
    response = app.test_client().post(
        '/api/v1.0/add_spare_device/',
        data='''{
                "name": "unvme-ns-3",
                "array" : "POSArray"
                }''',
        headers=header_json)

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
        headers=header_json)

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
        headers=header_json)

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
        headers=header_json)

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
        json=success_json,
        status_code=200)
    response = app.test_client().post(
        '/api/v1.0/remove_spare_device/',
        data='''{
                "name": "unvme-ns-3",
                "array": "POSArray"
                }''',
        headers=header_json)

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
        headers=header_json)

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
        headers=header_json)

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
        headers=header_json)

    #data = json.loads(response.get_data(as_text=True))
    assert response.status_code == 200


@requests_mock.Mocker(kw="mock")
@mock.patch("rest.app.connection_factory.get_current_user",
            return_value="test", autospec=True)
def test_delete_array(mock_get_current_user, **kwargs):
    kwargs["mock"].post(INFLUXDB_URL, text='Success', status_code=204)
    kwargs["mock"].delete(
        DAGENT_URL +
        '/api/ibofos/v1/array/POSArray/mount',
        json=success_json,
        status_code=200)
    kwargs["mock"].delete(
        DAGENT_URL +
        '/api/ibofos/v1/array/POSArray',
        json=success_json,
        status_code=200)

    response = app.test_client().post(
        '/api/v1.0/delete_array/POSArray',
        headers=header_json)
    print("data ",response.data)
    assert response.status_code == 200


@requests_mock.Mocker(kw="mock")
@mock.patch("rest.app.connection_factory.get_current_user",
            return_value="test", autospec=True)
def test_delete_array_failure(mock_get_current_user, **kwargs):
    kwargs["mock"].post(INFLUXDB_URL, text='Success', status_code=204)
    kwargs["mock"].delete(
        DAGENT_URL +
        '/api/ibofos/v1/array/POSArray/mount',
        json=success_json,
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
        headers=header_json)
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
        headers=header_json)
    assert response.status_code == 500

@requests_mock.Mocker(kw="mock")
@mock.patch("rest.app.connection_factory.get_current_user",
            return_value="test", autospec=True)
def test_delete_array_failure_2(mock_get_current_user, **kwargs):
    kwargs["mock"].post(INFLUXDB_URL, text='Success', status_code=204)
    kwargs["mock"].delete(
        DAGENT_URL +
        '/api/ibofos/v1/system/mount',
        json = success_json,
        status_code=200)
    kwargs["mock"].delete(
        DAGENT_URL +
        '/api/ibofos/v1/array/POSArray',
        json={},
        status_code=400)

    response = app.test_client().post(
        '/api/v1.0/delete_array/POSArray',
        headers=header_json)
    assert response.status_code == 500


@requests_mock.Mocker(kw="mock")
@mock.patch("rest.app.connection_factory.get_current_user",
            return_value="test", autospec=True)
def test_delete_volumes(mock_get_current_user, **kwargs):
    kwargs["mock"].post(INFLUXDB_URL, text='Success', status_code=204)
    kwargs["mock"].delete(
        DAGENT_URL + '/api/ibofos/v1/volumes/vol1',
        json=ibof_system_json,
        status_code=200)
    response = app.test_client().post(
        '/api/v1.0/delete_volumes/POSArray',
        data=delete_json,
        headers=header_json)

    assert response.status_code == 200


@requests_mock.Mocker(kw="mock")
@mock.patch("rest.app.connection_factory.get_current_user",
            return_value="test", autospec=True)
def test_delete_volumes_failure(mock_get_current_user, **kwargs):
    kwargs["mock"].post(INFLUXDB_URL, text='Success', status_code=204)
    kwargs["mock"].delete(
        DAGENT_URL + '/api/ibofos/v1/volumes/vol1',
        json= volume_json,
        status_code=500)
    response = app.test_client().post(
        '/api/v1.0/delete_volumes/POSArray',
        data=delete_json,
        headers=header_json)
    assert response.status_code == 500

    kwargs["mock"].delete(
        DAGENT_URL + '/api/ibofos/v1/volumes/vol1',
        json=None,
        status_code=500)
    response = app.test_client().post(
        '/api/v1.0/delete_volumes/POSArray',
        data=delete_json,
        headers=header_json)
    assert response.status_code == 500

@requests_mock.Mocker(kw="mock")
@mock.patch("rest.app.connection_factory.get_current_user",
            return_value="test", autospec=True)
def test_delete_volumes_failed(mock_get_current_user, **kwargs):
    kwargs["mock"].post(INFLUXDB_URL, text='Success', status_code=204)
    kwargs["mock"].delete(
        DAGENT_URL + '/api/ibofos/v1/volumes/vol1',
        json= volume_json,
        status_code=400)
    response = app.test_client().post(
        '/api/v1.0/delete_volumes/POSArray',
        data=delete_json,
        headers=header_json)

    #data = json.loads(response.get_data(as_text=True))
    assert response.status_code == 200

@requests_mock.Mocker(kw="mock")
@mock.patch("rest.app.connection_factory.get_current_user",
            return_value="test", autospec=True)
def test_update_volume_invalid_range(mock_get_current_user, **kwargs):
    kwargs["mock"].post(INFLUXDB_URL, text='Success', status_code=204)
    kwargs["mock"].post(
        DAGENT_URL + '/api/ibofos/v1/qos',
        json={
    "rid": "6d2b2055-064b-40f9-a5a9-9e905f26f9c3",
    "lastSuccessTime": 1626277436,
    "result": {
        "status": {
            "module": "VolumeManager",
            "code": 2080,
            "level": "Warning",
            "description": "Out of qos range",
            "posDescription": "Max IOPS Value outside allowed range",
            "problem": "A value less than the minimum applicable qos value was entered",
            "solution": "Check the minimum qos value that can be entered and try again."
        }
    },
    "info": {
        "version": "pos-0.9.4"
    }
},status_code=200)
    response = app.test_client().post(
        '/api/v1/qos',
        data='''{
        "array": "POSArray",
                "volumes":[{"volumeName":"vol1"}],
                "maxbw": 4,
        "maxiops":30
}''',
        headers=header_json)

    assert response.status_code == 200


@requests_mock.Mocker(kw="mock")
@mock.patch("rest.app.connection_factory.get_current_user",
            return_value="test", autospec=True)
def test_update_volume2(mock_get_current_user, **kwargs):
    kwargs["mock"].post(INFLUXDB_URL, text='Success', status_code=204)
    kwargs["mock"].post(
        DAGENT_URL + '/api/ibofos/v1/qos',
        json=ibof_json,status_code=200)
    response = app.test_client().post(
        '/api/v1/qos',
        data='''{
        "array": "POSArray",
		"volumes":[{"volumeName":"vol1"}],
		"maxbw": 40,
        "maxiops":30
}''',
        headers=header_json)

    #print("data ",response.data)
    assert response.status_code == 200


@requests_mock.Mocker(kw="mock")
@mock.patch("rest.app.connection_factory.get_current_user",
            return_value="test", autospec=True)
def test_rename_volume(mock_get_current_user, **kwargs):
    kwargs["mock"].post(INFLUXDB_URL, text='Success', status_code=204)
    kwargs["mock"].patch(
        DAGENT_URL + '/api/ibofos/v1/volumes/vol1',
        json=ibof_system_json,
        status_code=200)
    response = app.test_client().patch(
        '/api/v1.0/volumes/vol1',
        data='''{
            "param": {
                "name": "vol1",
                "newname": "vol"
                }
            }''',
        headers=header_json)

    assert response.status_code == 200

    response = app.test_client().patch(
        '/api/v1.0/volumes/vol1',
        data='''{
            "param": {
                "name": "vol2",
                "newname": "vol"
                }
            }''',
        headers=header_json)

    assert response.status_code == 500
    response = app.test_client().patch(
        '/api/v1.0/volumes/vol1',
        data='''{
            "param": {
                "newname": "vol"
                }
            }''',
        headers=header_json)

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
        headers=header_json)

    #data = json.loads(response.get_data(as_text=True))
    assert response.status_code == 500



@requests_mock.Mocker(kw="mock")
@mock.patch("rest.app.connection_factory.get_current_user",
            return_value="test", autospec=True)
def test_mount_volume(mock_get_current_user, **kwargs):
    kwargs["mock"].post(INFLUXDB_URL, text='Success', status_code=204)
    kwargs["mock"].post(
        DAGENT_URL + '/api/ibofos/v1/volumes/vol1/mount',
        json=ibof_system_json,
        status_code=200)
    response = app.test_client().post(
        '/api/v1.0/volume/mount',
        data='''{
                "name": "vol1"
                }''',
        headers=header_json)

    #data = json.loads(response.get_data(as_text=True))
    assert response.status_code == 200
    response = app.test_client().post(
        '/api/v1.0/volume/mount',
        data='''{
                "name": "vol1",
                }''',
        headers=header_json)

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
        headers=header_json)

    #data = json.loads(response.get_data(as_text=True))
    assert response.status_code == 500

@requests_mock.Mocker(kw="mock")
@mock.patch("rest.app.connection_factory.get_current_user",
            return_value="test", autospec=True)
def test_unmount_volume(mock_get_current_user, **kwargs):
    kwargs["mock"].post(INFLUXDB_URL, text='Success', status_code=204)
    kwargs["mock"].delete(
        DAGENT_URL + '/api/ibofos/v1/volumes/vol1/mount',
        json=ibof_system_json,
        status_code=200)
    response = app.test_client().delete(
        '/api/v1.0/volume/mount',
        data='''{
                "name": "vol1"
                }''',
        headers=header_json)

    #data = json.loads(response.get_data(as_text=True))
    assert response.status_code == 200
    response = app.test_client().delete(
        '/api/v1.0/volume/mount',
        data='''{
                "name": "vol1",
                }''',
        headers=header_json)
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
        headers=header_json)

    #data = json.loads(response.get_data(as_text=True))
    assert response.status_code == 500


@requests_mock.Mocker(kw="mock")
def test_list_devices(global_data, **kwargs):
    kwargs["mock"].post(INFLUXDB_URL, text='Success', status_code=204)
    kwargs["mock"].get(DAGENT_URL + '/api/ibofos/v1/devices',
                       json=device_list_json,
                       status_code=200)
    kwargs["mock"].get(DAGENT_URL + '/api/ibofos/v1/devices/all/scan',
                       json={"result": {"status": {"description": "SUCCESS"}}},
                       status_code=200)
    kwargs["mock"].get(ARRAY_LIST_URL,
                       json=array_list_json, status_code=200)

    kwargs["mock"].get(DAGENT_URL + '/api/ibofos/v1/array/POSArray',
                       json=dagent_json, status_code=200)

    response = app.test_client().get(
        '/api/v1.0/get_devices/',
        headers={
            'x-access-token': global_data['token'],
            'Accept': 'application/json',
        },
        content_type='application/json',
    )
    response = json.loads(response.data)
    assert len(response["devices"][0]) == 9

@requests_mock.Mocker(kw="mock")
def test_list_devices_failure(global_data, **kwargs):
    kwargs["mock"].post(INFLUXDB_URL, text='Success', status_code=204)
    kwargs["mock"].get(DAGENT_URL + '/api/ibofos/v1/devices',
                       json={"result": {"status": {"description": "NO DEVICE EXIST"},
                                        "data": {"devicelist": [{"name": "uram0",
                                                                 "type": "NVRAM",
                                                                 "size": 12345,
                                                                 "mn": "DEFG",
                                                                 "sn": "SN",
                                                                 "addr":"0000:68:00.0",
                                                                 "class":
                                                                 "SYSTEM",
                                                                 "isAvailable":True,
                                                                 "numa":
                                                                 "0",
                                                                 "arrayName" : ""},
                                                                {"name": "unvme-ns-0",
                                                                 "type": "SSD",
                                                                 "size": 12345,
                                                                 "mn": "ABCD",
                                                                 "sn": "SN!",
                                                                 "addr":"0000:68:00.0",
                                                                 "class":
                                                                 "SYSTEM",
                                                                 "isAvailable":True,
                                                                 "numa":
                                                                 "0",
                                                                 "arrayName" : ""}]}},
                             "data": {"devicelist": [{"name": "unvme-ns-0",
                                                      "type": "NVRAM"}]}},
                       status_code=200)
    kwargs["mock"].get(DAGENT_URL + '/api/ibofos/v1/devices/all/scan',json =scan_json, status_code=200)

    #output = list_devices()
    response = app.test_client().get(
        '/api/v1.0/get_devices/',
        headers={
            'x-access-token': global_data['token'],
            'Accept': 'application/json',
        },
        content_type='application/json',
    )
    assert response.status_code == 500
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
    kwargs["mock"].get(DAGENT_URL + '/api/ibofos/v1/volumelist/POSArray', json={ "result": {"status": { "description": "SUCCESS"}, "data": {
                    "volumes": [
                        {
                            "index":0,
                            "uuid": 0,
                            "status":"status",
                            "maxbw":123,
                            "maxiops":111,
                            "name": "vol1",
                            "size": 1234567,
                            "total": 12345678,
                            "remain": 12345678}]}}}, status_code=200)

    response = app.test_client().get('/redfish/v1/StorageServices/POSArray/Volumes/0',headers=header_json)

    assert response.status_code == 200

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

    response = app.test_client().get('/redfish/v1/StorageServices/0/Volumes',headers=header_json)

    assert response.status_code == 200
@requests_mock.Mocker(kw="mock")
def test_get_volume_collection_failure(**kwargs):
    kwargs["mock"].post(INFLUXDB_URL, text='Success', status_code=204)
    kwargs["mock"].get(DAGENT_URL + '/api/ibofos/v1/volumes',
                       status_code=200)

    response = app.test_client().get('/redfish/v1/StorageServices/0/Volumes',headers=header_json)

    assert response.status_code == 200

@requests_mock.Mocker(kw="mock")
def test_get_volume_failure(**kwargs):
    kwargs["mock"].post(INFLUXDB_URL, text='Success', status_code=204)
    kwargs["mock"].get(DAGENT_URL + '/api/ibofos/v1/volumelist/'+ARRAY_NAME,
                       status_code=200)

    response = app.test_client().get('/redfish/v1/StorageServices/'+ARRAY_NAME+'/Volumes/0',headers=header_json)
    assert response.status_code == 200


@requests_mock.Mocker(kw="mock")
def test_get_volume(**kwargs):
    kwargs["mock"].post(INFLUXDB_URL, text='Success', status_code=204)
    kwargs["mock"].get(DAGENT_URL + '/api/ibofos/v1/volumelist/POSArray', json={ "result": {"status": { "description": "SUCCESS"}, "data": {
                    "volumes": [
                        {
                            "id":0,
                            "index": 0,
                            "status":"status",
                            "maxbw":123,
                            "maxiops":111,
                            "name": "vol1",
                            "size": 1234567,
                            "total": 12345678,
                            "remain": 12345678
                        }
                    ]
                }
            }
        }, status_code=200)
    kwargs["mock"].get(DAGENT_URL + '/api/ibofos/v1/array/POSArray/volume/vol1', json={ "result": {"status": { "description": "SUCCESS"}, "data": {
                            "id":0,
                            "index": 0,
                            "status":"status",
                            "maxbw":123,
                            "minbw": 0,
                            "miniops": 0,
                            "maxiops":111,
                            "name": "vol1",
                            "size": 1234567,
                            "total": 12345678,
                            "remain": 12345678,
                            "subnqn": "nqn.123",
                            "uuid": "123"
                }
            }
        }, status_code=200)

    response = app.test_client().get('/redfish/v1/StorageServices/POSArray/Volumes/0',headers=header_json)
    assert response.status_code == 200

@requests_mock.Mocker(kw="mock")
def test_get_arrays_func(**kwargs):
    kwargs["mock"].post(INFLUXDB_URL, text='Success', status_code=204)
    kwargs["mock"].get(ARRAY_LIST_URL,
                       json=array_list_json, status_code=200)

    kwargs["mock"].get(DAGENT_URL + '/api/ibofos/v1/array/POSArray',
                       json={
    "rid": "120cd662-4b1b-4fd3-b807-e31b9b901450",
    "lastSuccessTime": 1653476200,
    "result": {
        "status": {
            "module": "COMMON",
            "code": 0,
            "level": "INFO",
            "description": "Success",
            "posDescription": "POSArray information"
        },
        "data": {
            "capacity": 13548474335232,
            "create_datetime": "2022-05-25 12:23:01 +0530",
            "data_raid": "RAID5",
            "devicelist": [
                {
                    "name": "uram1",
                    "type": "BUFFER"
                },
                {
                    "name": "unvme-ns-1",
                    "type": "DATA"
                },
                {
                    "name": "unvme-ns-2",
                    "type": "DATA"
                },
                {
                    "name": "unvme-ns-3",
                    "type": "DATA"
                }
            ],
            "gcMode": "none",
            "index": 0,
            "meta_raid": "RAID10",
            "name": "POSArray",
            "rebuilding_progress": 0,
            "situation": "NORMAL",
            "state": "NORMAL",
            "unique_id": 1495652515,
            "update_datetime": "2022-05-25 12:24:26 +0530",
            "used": 204013043712,
        }
    },
    "info": {
        "version": "v0.11.0-rc4"
    }
}, status_code=200)

    kwargs["mock"].get(
        DAGENT_URL + '/api/ibofos/v1/volumelist/'+ARRAY_NAME,
        json=volume_list_json,
        status_code=200)
    response = app.test_client().get('/api/v1/get_arrays/',headers=header_json)
    assert response.status_code == 200

@requests_mock.Mocker(kw="mock")
def test_get_arrays_func_failure(**kwargs):
    kwargs["mock"].post(INFLUXDB_URL, text='Success', status_code=204)
    kwargs["mock"].get(ARRAY_LIST_URL,
                       json=array_list_json, status_code=200)

    kwargs["mock"].get(DAGENT_URL + '/api/ibofos/v1/array/POSArray',
                       json=dagent_json, status_code=200)

    kwargs["mock"].get(
        DAGENT_URL + '/api/ibofos/v1/volumelist/'+ARRAY_NAME,
        json= volume_list_json,
        status_code=200)

    response = app.test_client().get('/api/v1/get_arrays/',headers=header_json)
    assert response.status_code == 200


@requests_mock.Mocker(kw="mock")
@mock.patch("rest.app.connection_factory.get_current_user",
            return_value="test", autospec=True)
def test_mount_ibofos(mock_get_current_user,**kwargs):
    kwargs["mock"].post(INFLUXDB_URL, text='Success', status_code=204)
    kwargs["mock"].post(
        DAGENT_URL +
        '/api/ibofos/v1/system/mount',
        json= success_json,
        status_code=200)

    response = app.test_client().post('/api/v1.0/ibofos/mount',headers=header_json)
    assert response.status_code == 200

@requests_mock.Mocker(kw="mock")
@mock.patch("rest.app.connection_factory.get_current_user",
            return_value="test", autospec=True)
def test_mount_ibofos_failure(mock_get_current_user,**kwargs):
    kwargs["mock"].post(INFLUXDB_URL, text='Success', status_code=204)
    kwargs["mock"].post(
        DAGENT_URL +
        '/api/ibofos/v1/system/mount',
        json=None,
        status_code=200)

    response = app.test_client().post('/api/v1.0/ibofos/mount',headers=header_json)
    assert response.status_code == 500
@requests_mock.Mocker(kw="mock")
@mock.patch("rest.app.connection_factory.get_current_user",
            return_value="test", autospec=True)
def test_unmount_ibofos(mock_get_current_user,**kwargs):
    kwargs["mock"].post(INFLUXDB_URL, text='Success', status_code=204)
    kwargs["mock"].delete(
        DAGENT_URL +
        '/api/ibofos/v1/system/mount',
        json=success_json,
        status_code=200)

    response = app.test_client().delete('/api/v1.0/ibofos/mount',headers=header_json)
    assert response.status_code == 200


@requests_mock.Mocker(kw="mock")
@mock.patch("rest.app.connection_factory.get_current_user",
            return_value="test", autospec=True)
def test_mount_array(mock_get_current_user,**kwargs):
    kwargs["mock"].post(INFLUXDB_URL, text='Success', status_code=204)
    kwargs["mock"].post(
        DAGENT_URL +
        '/api/ibofos/v1/array/'+ARRAY_NAME+'/mount',
        json=success_json,
        status_code=200)

    response = app.test_client().post('/api/v1/array/mount',data='{"array": "'+ARRAY_NAME+'"}',headers=header_json)
    assert response.status_code == 200


@requests_mock.Mocker(kw="mock")
@mock.patch("rest.app.connection_factory.get_current_user",
            return_value="test", autospec=True)
def test_mount_array_failure(mock_get_current_user,**kwargs):
    kwargs["mock"].post(INFLUXDB_URL, text='Success', status_code=204)
    kwargs["mock"].post(
        DAGENT_URL +
        '/api/ibofos/v1/array/'+ARRAY_NAME+'/mount',
        json=None,
        status_code=200)

    response = app.test_client().post('/api/v1/array/mount',data='{"array": "'+ARRAY_NAME+'"}',headers=header_json)
    assert response.status_code == 500


@requests_mock.Mocker(kw="mock")
@mock.patch("rest.app.connection_factory.get_current_user",
            return_value="test", autospec=True)
def test_unmount_array(mock_get_current_user,**kwargs):
    kwargs["mock"].post(INFLUXDB_URL, text='Success', status_code=204)
    kwargs["mock"].delete(
        DAGENT_URL +
        '/api/ibofos/v1/array/'+ARRAY_NAME+'/mount',
        json=success_json,
        status_code=200)

    response = app.test_client().delete('/api/v1/array/mount',data='{"array": "'+ARRAY_NAME+'"}',headers=header_json)
    assert response.status_code == 200

@requests_mock.Mocker(kw="mock")
@mock.patch("rest.app.connection_factory.get_current_user",
            return_value="test", autospec=True)
def test_unmount_array_failure(mock_get_current_user,**kwargs):
    kwargs["mock"].post(INFLUXDB_URL, text='Success', status_code=204)
    kwargs["mock"].delete(
        DAGENT_URL +
        '/api/ibofos/v1/array/'+ARRAY_NAME+'/mount',
        json=None,
        status_code=200)

    response = app.test_client().delete('/api/v1/array/mount',data='{"array": "'+ARRAY_NAME+'"}',headers=header_json)
    
    assert response.status_code == 500



@requests_mock.Mocker(kw="mock")
def test_createMultiVolumeCallback(**kwargs):
    kwargs["mock"].post(INFLUXDB_URL, text='Success', status_code=204)
    app.test_client().post(
        '/api/v1.0/multi_vol_response/',
        data='''{
                "MultiVolArray": [{"result":{"status":{"code":200,"description":"success"}}}],
                "Pass":1,
                "TotalCount":1
                }''',
        headers=header_json)

@requests_mock.Mocker(kw="mock")
@mock.patch("rest.app.connection_factory.get_current_user",
            return_value="test", autospec=True)
def test_create_uram_device(mock_get_current_user, **kwargs):
    kwargs["mock"].post(INFLUXDB_URL, text='Success', status_code=204)
    kwargs["mock"].post(DAGENT_URL + '/api/ibofos/v1/device',
                       json={
    "rid": "fb68cfb5-48b6-46b4-8439-54d4df0b7a64",
    "lastSuccessTime": 1653404955,
    "result": {
        "status": {
            "module": "COMMON",
            "code": 0,
            "level": "INFO",
            "description": "Success",
            "posDescription": "Device has been created"
        }
    },
    "info": {
        "version": "v0.11.0-rc4"
    }
}, status_code=200)
    response = app.test_client().post('/api/v1/device/',data=device_json, headers=header_json)
    assert response.status_code == 200

@requests_mock.Mocker(kw="mock")
@mock.patch("rest.app.connection_factory.get_current_user",
            return_value="test", autospec=True)
def test_create_uram_device_failure(mock_get_current_user, **kwargs):
    kwargs["mock"].post(INFLUXDB_URL, text='Success', status_code=204)
    kwargs["mock"].post(DAGENT_URL + '/api/ibofos/v1/device',
                       json={
    "rid": "d51ce059-3905-432c-af61-94ce69e0d893",
    "lastSuccessTime": 1653385251,
    "result": {
        "status": {
            "module": "",
            "code": 5526,
            "description": "",
            "posDescription": "Failed to create buffer device. Cannot allocate memory"
        }
    },
    "info": {
        "version": "v0.11.0-rc4"
    }
}, status_code=400)
    response = app.test_client().post('/api/v1/device/',data=device_json, headers=header_json)
    assert response.status_code == 200
                                                
@requests_mock.Mocker(kw="mock")
@mock.patch("rest.app.connection_factory.get_current_user",
            return_value="test", autospec=True)
def test_autocreate_array(mock_get_current_user, **kwargs):
    kwargs["mock"].post(INFLUXDB_URL, text='Success', status_code=204)
    kwargs["mock"].post(DAGENT_URL + '/api/ibofos/v1/autoarray',
                       json={
    "rid": "54b84f16-ab2a-4402-9b35-836e8d84ed65",
    "lastSuccessTime": 1653387104,
    "result": {
        "status": {
            "module": "COMMON",
            "code": 0,
            "level": "INFO",
            "description": "Success",
            "posDescription": "POSArray has been created successfully"
        }
    },
    "info": {
        "version": "v0.11.0-rc4"
    }
}, status_code=200)
    
    kwargs["mock"].post(
        DAGENT_URL +
        '/api/ibofos/v1/array/POSArray/mount',
        json=success_json,
        status_code=200)

    response = app.test_client().post('/api/v1/autoarray/',data='''{
    "name": "POSArray",
    "metaDisk": "uram0",
    "num_data": 3,
    "num_spare": 0,
    "raidtype":"RAID5",
    "writeThroughModeEnabled":true
}''', headers=header_json)
    assert response.status_code == 200

@requests_mock.Mocker(kw="mock")
@mock.patch("rest.app.connection_factory.get_current_user",
            return_value="test", autospec=True)
def test_qos_reset_policies(mock_get_current_user, **kwargs):
    kwargs["mock"].post(INFLUXDB_URL, text='Success', status_code=204)
    kwargs["mock"].post(DAGENT_URL + '/api/ibofos/v1/qos/reset',
                       json={
    "rid": "057226b1-97bd-4578-87a8-425a7fd52606",
    "lastSuccessTime": 1653477441,
    "result": {
        "status": {
            "module": "COMMON",
            "code": 0,
            "level": "INFO",
            "description": "Success",
            "posDescription": "Volume Qos Policy Reset"
        }
    },
    "info": {
        "version": "v0.11.0-rc4"
    }
}, status_code=200)
    response = app.test_client().post('/api/v1/qos/reset',data='''{
        "array": "{{arrayName}}",
		"volumes":[{"volumeName":"vol_arr1_0"}]

}''', headers=header_json)
    assert response.status_code == 200

@requests_mock.Mocker(kw="mock")
@mock.patch("rest.app.connection_factory.get_current_user",
            return_value="test", autospec=True)
def test_qos_policies(mock_get_current_user, **kwargs):
    kwargs["mock"].post(INFLUXDB_URL, text='Success', status_code=204)
    kwargs["mock"].post(DAGENT_URL + '/api/ibofos/v1/qos/policies',
                       json={
    "rid": "8e63c445-3b33-4c08-ac1b-5e80490bdb48",
    "lastSuccessTime": 1653477602,
    "result": {
        "status": {
            "module": "COMMON",
            "code": 0,
            "level": "INFO",
            "description": "Success",
            "posDescription": "List of Volume Policies in POSArray"
        },
        "data": {
            "arrayName": [
                {
                    "ArrayName": "POSArray"
                }
            ],
            "rebuildPolicy": [
                {
                    "rebuild": "highest"
                }
            ],
            "volumePolicies": [
                {
                    "id": 21,
                    "maxbw": 0,
                    "maxiops": 0,
                    "min_bw_guarantee": "No",
                    "min_iops_guarantee": "No",
                    "minbw": 0,
                    "miniops": 0,
                    "name": "vol"
                }
            ]
        }
    },
    "info": {
        "version": "v0.11.0-rc4"
    }
}, status_code=200)
    response = app.test_client().post('/api/v1/qos/policies',data='''{
        "array": "{{arrayName}}",
		"volumes":[{"volumeName":"vol"}]

}''', headers=header_json)
    assert response.status_code == 200

@requests_mock.Mocker(kw="mock")
@mock.patch("rest.app.connection_factory.get_current_user",
            return_value="test", autospec=True)
def test_rebuild_array_device(mock_get_current_user, **kwargs):
    kwargs["mock"].post(DAGENT_URL + '/api/ibofos/v1/array/POSArray/rebuild',
                       json={
                        "result": {
                            "status": {
                                "code": 0
                            }
                        }
                       },
                       status_code=200)
    response = app.test_client().post(
        '/api/v1.0/array/POSArray/rebuild',
        headers=header_json
    )

    assert response.status_code == 200

@requests_mock.Mocker(kw="mock")
@mock.patch("rest.app.connection_factory.get_current_user",
            return_value="test", autospec=True)
def test_replace_array_device(mock_get_current_user, **kwargs):
    kwargs["mock"].post(DAGENT_URL + '/api/ibofos/v1/array/POSArray/replace',
                       json={
                        "result": {
                            "status": {
                                "code": 0
                            }
                        }
                       },
                       status_code=200)
    response = app.test_client().post(
        '/api/v1/array/POSArray/replace',
        data=json.dumps({
            "device": "unvme-ns-0"
        }),
        headers=header_json
    )

    assert response.status_code == 200


@requests_mock.Mocker(kw="mock")
@mock.patch("rest.app.connection_factory.get_current_user",
            return_value="test", autospec=True)
def test_replace_array_device_error(mock_get_current_user, **kwargs):
    kwargs["mock"].post(DAGENT_URL + '/api/ibofos/v1/array/POSArray/replace',
                       status_code=500)
    response = app.test_client().post(
        '/api/v1/array/POSArray/replace',
        data=json.dumps({
            "device": "unvme-ns-0"
        }),
        headers=header_json
    )

    assert response.status_code == 500