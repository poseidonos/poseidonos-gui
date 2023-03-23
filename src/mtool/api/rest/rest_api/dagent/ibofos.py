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
import requests
import uuid
import time
import json
from flask import make_response
import logging
from logging.handlers import RotatingFileHandler

ip = os.environ.get('DAGENT_HOST', 'localhost')
port = '3000'

array_names = ['POSArray', 'POSArray2']
DAGENT_URL = 'http://' + ip + ':' + port
BASE_PATH = 'api/ibofos'
BASIC_AUTH_TOKEN = 'Basic YWRtaW46YWRtaW4='
VERSION = 'v1'

BASE_URL = DAGENT_URL +'/' +BASE_PATH +'/' + VERSION +'/' 

connect_timeout = 30
read_timeout = 2400
system_info_connect_timeout = 10
start_pos_connect_timeout = 300
start_pos_read_timeout = 900
def get_headers(
        auth=BASIC_AUTH_TOKEN,
        content_type="application/json"):
    return {"X-Request-Id": str(uuid.uuid4()),
            "Accept": content_type,
            "Authorization": auth,
            "ts": str(int(time.time()))}


def make_failure_response(desc='unable to perform the task', code=500):
    return make_response(json.dumps({"error": desc}), code)


def send_command_to_dagent(req_type, url, headers, timeout=None, data=None):
    retry_count = 0
    response = None
    try:
        while(1):
            #print("sending request to dagent ",url)
            if(req_type == "GET"):
                response = requests.get(
                    url=url, headers=headers, timeout=timeout)
            elif(req_type == "POST"):
                response = requests.post(
                    url=url, headers=headers, timeout=timeout, data=data)
            elif(req_type == "DELETE"):
                response = requests.delete(
                    url=url, headers=headers, timeout=timeout, data=data)
            elif(req_type == "PUT"):
                response = requests.put(
                    url=url, headers=headers, timeout=timeout, data=data)
            elif(req_type == "PATCH"):
                response = requests.patch(
                    url=url, headers=headers, timeout=timeout, data=data)
            retry_count = retry_count + 1
            if(((response.status_code == 200 or response.status_code == 207) and response['result'] and response['result']['status'] and response['result']['status']['code'] and response['result']['status']['code'] != '12000')):
                return response
            if response.status_code == 202 or response.status_code == 503:
                retry_count = 5
            if(retry_count >= 1): # Removing retry logic as D-Agent has locks implemented
                return response
            time.sleep(1)
    except BaseException:
        return response


def get_system_state(auth=BASIC_AUTH_TOKEN):
    logger = logging.getLogger(__name__)
    logger.info('%s', 'Get system state...')
    try:
        url = DAGENT_URL + '/' + BASE_PATH + '/' + VERSION + '/' + 'system'
        headers={"X-Request-Id": str(uuid.uuid4()), "Accept": "application/json", "Authorization": auth, "ts": str(int(time.time()))}
        timeout = (system_info_connect_timeout,read_timeout)
        response = requests.get(url=url, headers=headers, timeout=timeout)
        return response
    except Exception as err:
        print(f'Other error occurred in get_system_state : {err}', err)
    return {"result": "could not get the system state", "return": -1}


"""
def get_dagent_state(auth=BASIC_AUTH_TOKEN):
    req_headers = get_headers(auth)
    try:
        response = send_command_to_dagent(
            "GET",
            url=DAGENT_URL +
            '/api/dagent/v1/ping',
            headers=req_headers,
            timeout=(
                connect_timeout,
                read_timeout))
        #print("--------------RESPONSE-------------")
        response = response.json()
        #print(response['result']['status']['code'])
        #print("--------------RESPONSE-------------")
        return response
    except Exception as err:
        print(f'Other error occurred: {err}')
"""


def start_ibofos(auth=BASIC_AUTH_TOKEN):
    logger = logging.getLogger(__name__)
    logger.info('%s', 'Sending command to D-Agent to start ibofos...')
    req_headers = get_headers(auth)
    try:
        response = send_command_to_dagent(
            "POST",
            url=DAGENT_URL + '/' + BASE_PATH + '/' + VERSION + '/' + 'system',
            headers=req_headers,
            timeout=(start_pos_connect_timeout,start_pos_read_timeout))
        # print("---------------RESPONSE---------------")
        #print(response.status_code, response.json())
        # array_exists(array_names[0])
        return response
    except Exception as err:
        print(f'Other error occurred start_ibofos: {err}')

    return make_failure_response('Could not get ibofos to start...', 500)


def stop_ibofos(auth=BASIC_AUTH_TOKEN):
    logger = logging.getLogger(__name__)
    logger.info('%s', 'Sending command to D-Agent to stop ibofos...')
    req_headers = get_headers(auth)
    try:
        response = send_command_to_dagent(
            "DELETE",
            url=DAGENT_URL + '/' + BASE_PATH + '/' + VERSION + '/' + 'system',
            headers=req_headers,
            timeout=(
                connect_timeout,
                read_timeout))
        # print("---------------RESPONSE---------------")
        #print(response.status_code, response.json())
        return response
    except Exception as err:
        print(f'Other error occurred: {err}')
    # finally:
        # return 'Could not get ibofos to stop... 500'
    return make_failure_response('Could not get ibofos to stop...', 500)


def get_pos_info(auth=BASIC_AUTH_TOKEN):
    req_headers = get_headers(auth)
    try:
        response = send_command_to_dagent(
            "GET",
            url=DAGENT_URL + '/' + BASE_PATH + '/' + VERSION + '/' + 'system',
            headers=req_headers,
            timeout=(
                connect_timeout,
                read_timeout))
        return response.json()
    except Exception as err:
        print(f'Error in getting POS Info: {err}')
    return make_failure_response('Could not get POS info...', 500)


"""
def exit_system(auth=BASIC_AUTH_TOKEN):
    logger = logging.getLogger(__name__)
    logger.info('%s', 'Sending command to D-Agent to exit ibofos...')
    req_headers = get_headers(auth)
    try:
        response = send_command_to_dagent(
            "DELETE",
            url=DAGENT_URL +
            '/api/ibofos/v1/system/exitibofos',
            headers=req_headers,
            timeout=(
                connect_timeout,
                read_timeout))
        #print("---------------RESPONSE---------------")
        #print(response.status_code, response.json())
        return response
    except Exception as err:
        print(f'Other error occurred: {err}')
    # finally:
        # return 'Could not get ibofos to stop... 500'
    return make_failure_response('Could not get ibofos to exit...', 500)
"""


def scan_devices(auth=BASIC_AUTH_TOKEN):
    logger = logging.getLogger(__name__)
    logger.info('%s', 'Sending command to D-Agent to scan devices...')
    req_headers = get_headers(auth)
    try:
        response = send_command_to_dagent(
            "GET",
            url= BASE_URL +
            'devices/all/scan',
            headers=req_headers,
            timeout=(
                connect_timeout,
                read_timeout))
        # print("---------------RESPONSE---------------",response.json())
        return response
    except Exception as err:
        print(f'Other error occurred: {err}',err)
    return make_failure_response(
        'Could not get ibofos to scan devices...', 500)


def get_devices(auth=BASIC_AUTH_TOKEN):
    logger = logging.getLogger(__name__)
    logger.info('%s', 'Sending command to D-Agent to list devices ...')
    req_headers = get_headers(auth)
    try:
        response = send_command_to_dagent(
            "GET",
            url=DAGENT_URL + '/' + BASE_PATH + '/' + VERSION + '/' + 'devices',
            headers=req_headers,
            timeout=(
                connect_timeout,
                read_timeout))
        #print("---------------RESPONSE get devices---------------")
        #print(response.status_code, response.json())
        return response
    except Exception as err:
        print(f'Other error occurred: {err}',err)
    return make_failure_response(
        'Could not get ibofos to scan devices...', 500)


def get_smart_info(name, auth=BASIC_AUTH_TOKEN):
    logger = logging.getLogger(__name__)
    logger.info('%s', 'Sending command to D-Agent to list devices ...')
    req_headers = get_headers(auth)
    try:
        response = send_command_to_dagent(
            "GET",
            url= BASE_URL +
            'devices/' +
            name +
            '/smart',
            headers=req_headers,
            timeout=(
                connect_timeout,
                read_timeout))
        # print("---------------RESPONSE---------------")
        #print(response.status_code, response.json())
        return response
    except Exception as err:
        print(f'Other error occurred: {err}')
    return make_failure_response(
        'Could not get ibofos to scan devices...', 500)


def delete_array(name, auth=BASIC_AUTH_TOKEN):
    logger = logging.getLogger(__name__)
    logger.info('%s', 'Sending command to D-Agent to delete array...')
    req_headers = get_headers(auth)
    try:
        response = send_command_to_dagent(
            "DELETE",
            url= BASE_URL +
            'array/' +
            name,
            headers=req_headers,
            timeout=(
                connect_timeout,
                read_timeout))
        # print("---------------RESPONSE---------------")
        #print(response.status_code, response.json())
        return response
    except Exception as err:
        print(f'Other error occurred: {err}')
    return make_failure_response(
        'Could not get ibofos to get array status...', 500)


def array_status(auth=BASIC_AUTH_TOKEN):
    logger = logging.getLogger(__name__)
    logger.info('%s', 'Sending command to D-Agent to get array status...')
    req_headers = get_headers(auth)
    try:
        response = send_command_to_dagent(
            "GET",
            url=DAGENT_URL + '/' + BASE_PATH + '/' + VERSION + '/' + 'system',
            headers=req_headers,
            timeout=(
                connect_timeout,
                read_timeout))
        # print("---------------RESPONSE---------------")
        #print(response.status_code, response.json())
        return response
    except Exception as err:
        print(f'Other error occurred: {err}')
    return make_failure_response(
        'Could not get ibofos to get array status...', 500)


'''
def array_exists(arrayname=array_names[0],auth=BASIC_AUTH_TOKEN):
    #print("in array exists")
    logger = logging.getLogger(__name__)
    logger.info('%s', 'Sending command to D-Agent to get array status...')
    req_headers = get_headers(auth)
    try:
        scan_devices()

        response = send_command_to_dagent(
            "GET",
            url=DAGENT_URL + '/' + BASE_PATH + '/' + VERSION + '/'+ 'array/' + arrayname + '/load',
            headers=req_headers,
            timeout=(
                connect_timeout,
                read_timeout))


        if (response.status_code == 200):
            response = send_command_to_dagent(
            "POST",
            url=DAGENT_URL + '/' + BASE_PATH + '/' + VERSION + '/'+ 'system/mount',
            headers=req_headers,
            timeout=(
                connect_timeout,
                read_timeout)
            )
            return True
        else:
            return False

    except Exception as e:
        print("exception in exists: " + str(e))
        return False
'''


def add_listener(
        name,
        transport_type,
        target_address,
        transport_service_id,
        auth=BASIC_AUTH_TOKEN):
    logger = logging.getLogger(__name__)
    logger.info('%s', 'Sending command to D-Agent to add listener api ...')
    req_headers = get_headers(auth)
    request_body = {
        "param": {
            "subnqn": name,
            "transportType": transport_type,
            "targetAddress": target_address,
            "transportServiceId": transport_service_id}}
    request_body = json.dumps(request_body)
    try:
        response = send_command_to_dagent(
            "POST",
            url= BASE_URL +
            'listener',
            headers=req_headers,
            timeout=(
                connect_timeout,
                read_timeout),
            data=request_body)
        return response
    except Exception as err:
        print(f'Other error occurred: {err}')
    return make_failure_response(
        'Could not get ibofos to add listener...', 500)


def create_subsystem(
        name,
        serial_num,
        model_num,
        max_namespaces,
        allow_any_host,
        auth=BASIC_AUTH_TOKEN):
    logger = logging.getLogger(__name__)
    logger.info('%s', 'Sending command to D-Agent to create subsystem api ...')
    req_headers = get_headers(auth)
    request_body = {
        "param": {
            "nqn": name,
            "serialNumber": serial_num,
            "modelNumber": model_num,
            "maxNamespaces": max_namespaces,
            "allowAnyHost": allow_any_host}}
    request_body = json.dumps(request_body)
    try:
        response = send_command_to_dagent(
            "POST",
            url= BASE_URL +
            'subsystem',
            headers=req_headers,
            timeout=(
                connect_timeout,
                read_timeout),
            data=request_body)
        return response
    except Exception as err:
        print(f'Other error occurred: {err}')
    return make_failure_response(
        'Could not get ibofos to create subsystem...', 500)


def list_subsystem(auth=BASIC_AUTH_TOKEN):
    logger = logging.getLogger(__name__)
    logger.info('%s', 'Sending command to D-Agent to list subsystem api ...')
    req_headers = get_headers(auth)
    try:
        response = send_command_to_dagent(
            "GET",
            url= BASE_URL +
            'subsystem',
            headers=req_headers,
            timeout=(
                connect_timeout,
                read_timeout))
        return response
    except Exception as err:
        print(f'Other error occurred: {err}')
    return make_failure_response(
        'Could not get ibofos to list subsystem...', 500)


def delete_subsystem(name, auth=BASIC_AUTH_TOKEN):
    logger = logging.getLogger(__name__)
    logger.info('%s', 'Sending command to D-Agent to delete subsystem api ...')
    req_headers = get_headers(auth)
    request_body = {
        "param": {
            "subnqn": name}}
    request_body = json.dumps(request_body)
    try:
        response = send_command_to_dagent(
            "DELETE",
            url= BASE_URL +
            'subsystem',
            headers=req_headers,
            timeout=(
                connect_timeout,
                read_timeout),
            data=request_body)
        return response
    except Exception as err:
        print(f'Other error occurred: {err}')
    return make_failure_response(
        'Could not get ibofos to delete subsystem...', 500)


def create_device(
        name,
        num_blocks,
        block_size,
        dev_type,
        numa,
        auth=BASIC_AUTH_TOKEN):
    logger = logging.getLogger(__name__)
    logger.info(
        '%s',
        'Sending command to D-Agent to create uram device  api ...')
    req_headers = get_headers(auth)
    request_body = {
        "param": {
            "name": name,
            "numBlocks": num_blocks,
            "blockSize": block_size,
            "devType": dev_type,
            "numa": numa}}
    request_body = json.dumps(request_body)
    try:
        response = send_command_to_dagent(
            "POST",
            url=DAGENT_URL + '/' + BASE_PATH + '/' + VERSION + '/' + 'device',
            headers=req_headers,
            timeout=(
                connect_timeout,
                read_timeout),
            data=request_body)
        return response
    except Exception as err:
        print(f'Other error occurred: {err}')
    return make_failure_response(
        'Could not get ibofos to create uram device...', 500)


def create_trans(
        transport_type,
        buf_cache_size,
        num_shared_buf,
        auth=BASIC_AUTH_TOKEN):
    logger = logging.getLogger(__name__)
    logger.info('%s', 'Sending command to D-Agent to create transport api ...')
    req_headers = get_headers(auth)
    request_body = {
        "param": {
            "transport_type": transport_type,
            "buf_cache_size": buf_cache_size,
            "num_shared_buf": num_shared_buf}}
    request_body = json.dumps(request_body)
    try:
        response = send_command_to_dagent(
            "POST",
            url= BASE_URL +
            'transport',
            headers=req_headers,
            timeout=(
                connect_timeout,
                read_timeout),
            data=request_body)
        return response
    except Exception as err:
        print(f'Other error occurred: {err}')
    return make_failure_response(
        'Could not get ibofos to create transport...', 500)


def auto_create_array(
        arrayname,
        raidtype,
        num_spare,
        num_data,
        meta_devices,
        write_through,
        auth=BASIC_AUTH_TOKEN):
    logger = logging.getLogger(__name__)
    logger.info(
        '%s',
        'Sending command to D-Agent to auto create array using mount api ...')
    req_headers = get_headers(auth)
    request_body = {
        "param": {
            "name": arrayname,
            "raidtype": raidtype,
            "buffer": meta_devices,
            "numData": num_data,
            "numSpare": num_spare}}
    request_body = json.dumps(request_body)
    try:
        response = send_command_to_dagent(
            "POST",
            url= BASE_URL +
            'autoarray',
            headers=req_headers,
            timeout=(
                connect_timeout,
                read_timeout),
            data=request_body)
        if response.status_code != 200:
            return response
        response = mount_array(arrayname, write_through)
        return response
    except Exception as err:
        print(f'Other error occurred: {err}')
    return make_failure_response(
        'Could not get ibofos to auto create array...', 500)


def create_array(
        name,
        raidtype,
        spare_devices,
        data_devices,
        meta_devices,
        write_through,
        auth=BASIC_AUTH_TOKEN):
    logger = logging.getLogger(__name__)
    logger.info(
        '%s',
        'Sending command to D-Agent to create array using mount api...')
    req_headers = get_headers(auth)
    request_body = {
        "param": {
            "name": name,
            "raidtype": raidtype,
            "buffer": meta_devices,
            "data": data_devices,
            "spare": spare_devices}}
    request_body = json.dumps(request_body)
    try:
        #print("request body create array ", request_body)
        response = send_command_to_dagent(
            "POST",
            url=DAGENT_URL + '/' + BASE_PATH + '/' + VERSION + '/' + 'array',
            headers=req_headers,
            timeout=(
                connect_timeout,
                read_timeout),
            data=request_body)
        if response.status_code != 200:
            return response
        response = mount_array(name, write_through)
        # print("---------------RESPONSE---------------")
        #print(response.status_code, response.json())
        return response
    except Exception as err:
        print(f'Other error occurred: {err}',err)
    return make_failure_response(
        'Could not get ibofos to create array...', 500)

def rebuild_array(arrayname, auth=BASIC_AUTH_TOKEN):
    logger = logging.getLogger(__name__)
    logger.info(
        '%s',
        'Sending command to D-Agent to rebuild array using rebuild array api ...')
    req_headers = get_headers(auth)
    try:
        response = send_command_to_dagent(
            "POST",
            url= BASE_URL +
            'array'+'/'+arrayname+'/'+'rebuild',
            headers=req_headers,
            timeout=(
                connect_timeout,
                read_timeout),
            data=None)
        return response
    except Exception as err:
        print(f'Other error occurred: {err}',err)
    return make_failure_response(
        'Could not get ibofos to rebuild array...', 500)


def mount_array(arrayname, write_through=False, auth=BASIC_AUTH_TOKEN):
    req_headers = get_headers(auth)
    request_body = {
        "param": {
            "array": arrayname,
            "enableWriteThrough": write_through
        }
    }
    request_body = json.dumps(request_body)
    try:
        response = send_command_to_dagent(
            "POST",
            url= BASE_URL +
            'array/' +
            arrayname +
            '/mount',
            headers=req_headers,
            timeout=(
                connect_timeout,
                read_timeout),
            data=request_body)
        # print("---------------RESPONSE---------------")
        #print(response.status_code , response.json())
        return response
    except Exception as err:
        print(f'Other error occurred: {err}',err)
    return make_failure_response(
        'Could not mount array.', 500)


def unmount_array(arrayname, auth=BASIC_AUTH_TOKEN):
    req_headers = get_headers(auth)
    request_body = {
        "param": {
            "array": arrayname
        }
    }
    request_body = json.dumps(request_body)
    try:
        response = send_command_to_dagent(
            "DELETE",
            url= BASE_URL +
            'array/' +
            arrayname +
            '/mount',
            headers=req_headers,
            timeout=(
                connect_timeout,
                read_timeout),
            data=request_body)
        # print("---------------RESPONSE---------------")
        #print(response.status_code, response.json())
        return response
    except Exception as err:
        print(f'Other error occurred: {err}',err)
    return make_failure_response(
        'Could not unmount array', 500)


def qos_create_volume_policies(request_body, auth=BASIC_AUTH_TOKEN):
    req_headers = get_headers(auth)
    request_body = json.dumps(request_body)
    try:
        response = send_command_to_dagent(
            "POST",
            url=DAGENT_URL + '/' + BASE_PATH + '/' + VERSION + '/qos',
            headers=req_headers,
            timeout=(
                connect_timeout,
                read_timeout),
            data=request_body)
        # print("---------------RESPONSE---------------")
        #print(response.status_code, response.json())
        return response
    except Exception as err:
        print(f'Other error occurred: {err}')
    return make_failure_response(
        'Could not create qos policies', 500)


def qos_reset_volume_policies(request_body, auth=BASIC_AUTH_TOKEN):
    req_headers = get_headers(auth)
    request_body = json.dumps(request_body)
    try:
        response = send_command_to_dagent(
            "POST",
            url=DAGENT_URL + '/' + BASE_PATH + '/' + VERSION + '/qos/reset',
            headers=req_headers,
            timeout=(
                connect_timeout,
                read_timeout),
            data=request_body)
        # print("---------------RESPONSE---------------")
        #print(response.status_code, response.json())
        return response
    except Exception as err:
        print(f'Other error occurred: {err}')
    return make_failure_response(
        'Could not reset qos policies', 500)


def qos_list_volume_policies(request_body, auth=BASIC_AUTH_TOKEN):
    req_headers = get_headers(auth)
    request_body = json.dumps(request_body)
    try:
        response = send_command_to_dagent(
            "POST",
            url=DAGENT_URL + '/' + BASE_PATH + '/' + VERSION + '/qos/policies',
            headers=req_headers,
            timeout=(
                connect_timeout,
                read_timeout),
            data=request_body)
        # print("---------------RESPONSE---------------")
        #print(response.status_code, response.json())
        return response
    except Exception as err:
        print(f'Other error occurred: {err}')
    return make_failure_response(
        'Could not get qos policies', 500)


def array_info(array_name, auth=BASIC_AUTH_TOKEN):
    logger = logging.getLogger(__name__)
    logger.info('%s', 'Sending command to D-Agent to get list array...')
    req_headers = get_headers(auth)
    try:
        response = send_command_to_dagent(
            "GET",
            url= BASE_URL +
            'array/' +
            array_name,
            headers=req_headers,
            timeout=(
                connect_timeout,
                read_timeout))
        # print("---------------RESPONSE---------------",response.json())
        return response
    except Exception as err:
        print(f'Other error occurred: {err}')
    return make_failure_response(
        'Could not get ibofos to get list array...', 500)


def get_pos_property(auth=BASIC_AUTH_TOKEN):
    logger = logging.getLogger(__name__)
    logger.info('%s', 'Sending command to D-Agent to get POS property ...')
    req_headers = get_headers(auth)
    try:
        response = send_command_to_dagent(
            "GET",
            url= BASE_URL +
            'system/property',
            headers=req_headers,
            timeout=(
                connect_timeout,
                read_timeout))
        return response
    except Exception as err:
        print(f'Other error occurred: {err}')
    return make_failure_response(
        'Could not get ibofos to get list array...', 500)


def set_pos_property(pos_property, auth=BASIC_AUTH_TOKEN):
    logger = logging.getLogger(__name__)
    logger.info('%s', 'Sending command to D-Agent to set POS property ...')
    req_headers = get_headers(auth)
    request_body = {
        "param": {
            "level": pos_property,
        }
    }
    request_body = json.dumps(request_body)
    try:
        response = send_command_to_dagent(
            "POST",
            url= BASE_URL +
            'system/property',
            headers=req_headers,
            timeout=(
                connect_timeout,
                read_timeout),
            data=request_body)
        return response
    except Exception as err:
        print(f'Other error occurred: {err}')
    return make_failure_response(
        'Could not get ibofos to get list array...', 500)


def list_arrays(auth=BASIC_AUTH_TOKEN):
    logger = logging.getLogger(__name__)
    logger.info('%s', 'Sending command to D-Agent to get list arrays...')
    req_headers = get_headers(auth)
    try:
        response = send_command_to_dagent(
            "GET",
            url=DAGENT_URL + '/' + BASE_PATH + '/' + VERSION + '/' + 'arrays',
            headers=req_headers,
            timeout=(
                connect_timeout,
                read_timeout))
        # print("---------------RESPONSE---------------",response.json())
        return response
    except Exception as err:
        print(f'Other error occurred: {err}')
    return make_failure_response(
        'Could not get ibofos to get list array...', 500)

def start_telemetry(auth=BASIC_AUTH_TOKEN):
    logger = logging.getLogger(__name__)
    logger.info('%s', 'Sending command to D-Agent to start telemetry...')
    req_headers = get_headers(auth)
    try:
        response = send_command_to_dagent(
            "POST",
            url=DAGENT_URL + '/' + BASE_PATH + '/' + VERSION + '/' + 'telemetry',
            headers=req_headers,
            timeout=(
                connect_timeout,
                read_timeout))
        return response
    except Exception as err:
        print(f'Other error occurred: {err}')
    return make_failure_response(
        'Could not start telemetry...', 500)

def stop_telemetry(auth=BASIC_AUTH_TOKEN):
    logger = logging.getLogger(__name__)
    logger.info('%s', 'Sending command to D-Agent to stop telemetry...')
    req_headers = get_headers(auth)
    try:
        response = send_command_to_dagent(
            "DELETE",
            url=DAGENT_URL + '/' + BASE_PATH + '/' + VERSION + '/' + 'telemetry',
            headers=req_headers,
            timeout=(
                connect_timeout,
                read_timeout))
        return response
    except Exception as err:
        print(f'Other error occurred: {err}')
    return make_failure_response(
        'Could not stop telemetry...', 500)

def get_telemetry_properties(auth=BASIC_AUTH_TOKEN):
    logger = logging.getLogger(__name__)
    logger.info('%s', 'Sending command to D-Agent to start telemetry...')
    req_headers = get_headers(auth)
    try:
        response = send_command_to_dagent(
            "GET",
            url=DAGENT_URL + '/' + BASE_PATH + '/' + VERSION + '/' + 'telemetry/properties',
            headers=req_headers,
            timeout=(
                connect_timeout,
                read_timeout))
        return response.json()
    except Exception as err:
        print(f'Other error occurred: {err}')
    return make_failure_response(
        'Could not get telemetry properties...', 500)


def set_telemetry_properties(params, auth=BASIC_AUTH_TOKEN):
    logger = logging.getLogger(__name__)
    logger.info('%s', 'Sending command to D-Agent to start telemetry...')
    req_headers = get_headers(auth)
    try:
        response = send_command_to_dagent(
            "POST",
            url=DAGENT_URL + '/' + BASE_PATH + '/' + VERSION + '/' + 'telemetry/properties',
            headers=req_headers,
            timeout=(
                connect_timeout,
                read_timeout),
            data=json.dumps(params))
        return response
    except Exception as err:
        print(f'Other error occurred: {err}')
    return make_failure_response(
        'Could not set telemetry properties...', 500)

def create_volume(
        name,
        arrayname,
        size,
        count,
        suffix,
        mount_all,
        stop_on_error,
        maxbw=0,
        maxiops=0,
        minbw=0,
        miniops=0,
        subnqn="",
        transport_type="", transport_service_id="", target_address="", iswalvol=False,
        auth=BASIC_AUTH_TOKEN):
    req_headers = get_headers(auth)
    request_body = {
        "param": {
            "name": name,
            "array": arrayname,
            "size": size,
            "maxbw": maxbw,
            "maxiops": maxiops,
            "minbw": minbw,
            "miniops": miniops,
            "totalcount": count,
            "stoponerror": stop_on_error,
            "namesuffix": suffix,
            "mountall": mount_all,
            "iswalvol":iswalvol,
            "subnqn": subnqn,
            "transport_type":transport_type,"transport_service_id":transport_service_id,"target_address":target_address}}

    request_body = json.dumps(request_body)
    try:
        response = send_command_to_dagent(
            "POST",
            url=DAGENT_URL + '/' + BASE_PATH + '/' + VERSION + '/' + 'volumes',
            headers=req_headers,
            timeout=(
                connect_timeout,
                read_timeout),
            data=request_body)
        # print("---------------RESPONSE---------------",response.json())
        return response
    except Exception as err:
        print(f'Other error occurred: {err}')
    return make_failure_response(
        'Could not get ibofos to scan devices...', 500)


'''
def update_volume(params, auth=BASIC_AUTH_TOKEN):
    req_headers = get_headers(auth)
    request_body = {"param": params}
    request_body = json.dumps(request_body)
    #print(request_body)
    try:
        response = send_command_to_dagent(
            "PATCH",
            url=DAGENT_URL + '/' + BASE_PATH + '/' + VERSION + '/' + 'volumes/' + params["name"] + '/qos',
            headers=req_headers,
            timeout=(
                connect_timeout,
                read_timeout),
            data=request_body)
        #print("---------------RESPONSE---------------")
        #print(response.status_code, response.json())
        return response
    except Exception as err:
        print(f'Other error occurred: {err}')
    return make_failure_response(
        'Could not get ibofos to scan devices...', 500)
'''


def rename_volume(params, auth=BASIC_AUTH_TOKEN):
    req_headers = get_headers(auth)
    request_body = json.dumps(params)
    try:
        response = send_command_to_dagent(
            "PATCH",
            url= BASE_URL +
            'volumes/' +
            params["param"]["name"],
            headers=req_headers,
            timeout=(
                connect_timeout,
                read_timeout),
            data=request_body)
        #print("---------------RENAME RESPONSE---------------")
        #print(response.status_code, response.json())
        return response
    except Exception as err:
        print(f'Other error occurred: {err}')
    return make_failure_response(
        'Error response from Agent while renaming volume...', 500)


def mount_volume(name, arrayname, subnqn, auth=BASIC_AUTH_TOKEN):
    req_headers = get_headers(auth)
    request_body = {
        "param": {
            "array": arrayname,
            "subnqn": subnqn
        }
    }
    request_body = json.dumps(request_body)
    # print(request_body)
    try:
        response = send_command_to_dagent(
            "POST",
            url= BASE_URL +
            'volumes/' +
            name +
            '/mount',
            headers=req_headers,
            timeout=(
                connect_timeout,
                read_timeout),
            data=request_body)
        # print("---------------RESPONSE---------------")
        #print(response.status_code , response.json())
        return response
    except Exception as err:
        print(f'Other error occurred: {err}')
    return make_failure_response(
        'Could not get ibofos to scan devices...', 500)


def mount_volume_with_subsystem(
        name,
        arrayname,
        subsystem,
        auth=BASIC_AUTH_TOKEN):
    req_headers = get_headers(auth)
    param = subsystem.copy()
    param["array"] = arrayname
    request_body = {
        "param": param
    }
    request_body = json.dumps(request_body)
    try:
        response = send_command_to_dagent(
            "POST",
            url= BASE_URL+
            'volumes/' +
            name +
            '/mount/subsystem',
            headers=req_headers,
            timeout=(
                connect_timeout,
                read_timeout),
            data=request_body)
        print(
            "url :",
            BASE_URL +
            'volumes/' +
            name +
            '/mount/subsystem')
        print("---------------RESPONSE---------------")
        print("response", response)
        print(response.status_code, response.json())
        return response
    except Exception as err:
        print(f'Other error occurred: {err}')
    return make_failure_response(
        'Could not get ibofos to scan devices...', 500)


def unmount_volume(name, arrayname, auth=BASIC_AUTH_TOKEN):
    req_headers = get_headers(auth)
    request_body = {
        "param": {
            "array": arrayname
        }
    }
    request_body = json.dumps(request_body)
    # print(request_body)
    try:
        response = send_command_to_dagent(
            "DELETE",
            url= BASE_URL +
            'volumes/' +
            name +
            '/mount',
            headers=req_headers,
            timeout=(
                connect_timeout,
                read_timeout),
            data=request_body)
        # print("---------------RESPONSE---------------")
        #print(response.status_code, response.json())
        return response
    except Exception as err:
        print(f'Other error occurred: {err}')
    return make_failure_response(
        'Could not get ibofos to unmount volumes...', 500)


def mount_ibofos(auth=BASIC_AUTH_TOKEN):
    req_headers = get_headers(auth)

    try:
        method = 'system/mount'
        response = send_command_to_dagent(
            "POST",
            url=DAGENT_URL + '/' + BASE_PATH + '/' + VERSION + '/' + method,
            headers=req_headers,
            timeout=(
                connect_timeout,
                read_timeout))

        # print("---------------RESPONSE---------------")
        #print(response.status_code , response.json())
        return response
    except Exception as err:
        print(f'Other error occurred: {err}')
    return make_failure_response(
        'Could not mount POS...', 500)


def unmount_ibofos(auth=BASIC_AUTH_TOKEN):
    req_headers = get_headers(auth)

    try:
        method = 'system/mount'
        response = send_command_to_dagent(
            "DELETE",
            url=DAGENT_URL + '/' + BASE_PATH + '/' + VERSION + '/' + method,
            headers=req_headers,
            timeout=(
                connect_timeout,
                read_timeout))

        # print("---------------RESPONSE---------------",response.json())
        return response
    except Exception as err:
        print(f'Other error occurred: {err}')
    return make_failure_response(
        'Could not unmount POS...', 500)


def list_volumes(array_name, auth=BASIC_AUTH_TOKEN):
    req_headers = get_headers(auth)
    try:
        response = send_command_to_dagent(
            "GET",
            url= BASE_URL +
            'volumelist/' +
            array_name,
            headers=req_headers,
            timeout=(
                connect_timeout,
                read_timeout))
        # print("---------------RESPONSE---------------")
        #print(response.status_code , response.json())
        return response
    except Exception as err:
        print(f'Other error occurred: {err}')
    return make_failure_response(
        'Could not get ibofos to list volumes...', 500)


def volume_info(array_name, volume_name, auth=BASIC_AUTH_TOKEN):
    req_headers = get_headers(auth)
    try:
        response = send_command_to_dagent(
            "GET",
            url=DAGENT_URL +
            '/' +
            BASE_PATH +
            '/' +
            VERSION +
            '/array/' +
            array_name +
            '/volume/' +
            volume_name,
            headers=req_headers,
            timeout=(
                connect_timeout,
                read_timeout))
        return response
    except Exception as err:
        print(f'Other error occurred: {err}')
    return make_failure_response(
        'Could not get ibofos to list volumes...', 500)


def delete_volume(vol, arrayname, auth=BASIC_AUTH_TOKEN):
    req_headers = get_headers(auth)
    name = vol["name"]
    request_body = {
        "param": {
            "name": name,
            "array": arrayname
        }
    }
    request_body = json.dumps(request_body)

    try:
        if "isMounted" in vol and vol["isMounted"]:
            send_command_to_dagent(
                "DELETE",
                url=DAGENT_URL +
                '/' +
                BASE_PATH +
                '/' +
                VERSION +
                '/' +
                'volumes/' +
                name +
                '/mount',
                headers=req_headers,
                timeout=(
                    connect_timeout,
                    read_timeout),
                data=request_body)

        response = send_command_to_dagent(
            "DELETE",
            url= BASE_URL+
            'volumes/' +
            name,
            headers=req_headers,
            timeout=(
                connect_timeout,
                read_timeout),
            data=request_body)
        # print("---------------RESPONSE---------------")
        #print(response.status_code, response.json())
        return response
    except Exception as err:
        print(f'Other error occurred: {err}')
    return make_failure_response(
        'Could not get ibofos to delete volumes...', 500)


def max_vol_count(auth=BASIC_AUTH_TOKEN):
    req_headers = get_headers(auth)
    try:
        response = send_command_to_dagent(
            "GET",
            url= BASE_URL +
            'volumes/maxcount',
            headers=req_headers,
            timeout=(
                connect_timeout,
                read_timeout))
        # print("---------------RESPONSE---------------")
        #print(response.status_code, response.json())
        return response
    except Exception as err:
        print(f'Other error occurred: {err}')
    return make_failure_response(
        'Could not get max vol count from POS...', 500)


def add_spare_disk(name, arrayname=array_names[0], auth=BASIC_AUTH_TOKEN):
    req_headers = get_headers(auth)
    request_body = {
        "param": {
            "spare": [
                {
                    "deviceName": name,
                }
            ]
        }
    }
    request_body = json.dumps(request_body)
    # print(request_body)
    try:
        response = send_command_to_dagent(
            "POST",
            url=DAGENT_URL + '/' +
            BASE_PATH + '/' + VERSION + '/array/' + arrayname + '/devices',
            headers=req_headers,
            timeout=(
                connect_timeout,
                read_timeout),
            data=request_body)
        # print("---------------RESPONSE---------------")
        #print(response.status_code, response.json())
        return response
    except Exception as err:
        print(f'Other error occurred: {err}')
    return make_failure_response(
        'Could not get POS to add a spare disk...', 500)


def remove_spare_disk(name, arrayname=array_names[0], auth=BASIC_AUTH_TOKEN):
    req_headers = get_headers(auth)
    try:
        response = send_command_to_dagent(
            "DELETE",
            url=DAGENT_URL +
            '/' +
            BASE_PATH +
            '/' +
            VERSION +
            '/array/' +
            arrayname +
            '/devices/' +
            name,
            headers=req_headers,
            timeout=(
                connect_timeout,
                read_timeout))
        # print("---------------RESPONSE---------------")
        #print(response.status_code, response.json())
        return response
    except Exception as err:
        print(f'Other error occurred: {err}')
    return make_failure_response(
        'Could not get POS to remove spare disk...', 500)


def replace_array_device(array_name, device, auth=BASIC_AUTH_TOKEN):
    req_headers = get_headers(auth)
    request_body = {
        "param": {
            "device": device
        }
    }
    request_body = json.dumps(request_body)
    try:
        response = send_command_to_dagent(
            "POST",
            url=BASE_URL +
            'array/' +
            array_name +
            '/replace',
            headers=req_headers,
            timeout=(
                connect_timeout,
                read_timeout),
            data=request_body)
        return response
    except Exception as err:
        print(f'Other error occurred: {err}')
    return make_failure_response(
        'Could not replace array device.', 500)

"""
def report_test(auth=BASIC_AUTH_TOKEN):
    # •Report file directory : /etc/ibofos/report
    req_headers = get_headers(auth)
    try:
        response = send_command_to_dagent(
            "POST",
            url=DAGENT_URL +
            '/api/ibofos/v1/test/report',
            headers=req_headers,
            timeout=(
                connect_timeout,
                read_timeout))
        #print("---------------RESPONSE---------------")
        #print(response.status_code, response.json())
    except Exception as err:
        print(f'Other error occurred: {err}')
"""

handler = RotatingFileHandler(
    'log/ibof.log',
    maxBytes=1024 * 1024,
    backupCount=3)
log_handler = logging.getLogger(__name__)
log_handler.setLevel(logging.INFO)
log_handler.addHandler(handler)
