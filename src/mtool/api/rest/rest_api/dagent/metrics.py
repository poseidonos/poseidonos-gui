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
 *     * Neither the name of Intel Corporation nor the names of its
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

from requests.exceptions import HTTPError
from rest.rest_api.dagent.ibofos import get_headers, send_command_to_dagent, DAGENT_URL, BASIC_AUTH_TOKEN, connect_timeout, read_timeout

METRIC_PATH = '/api/metric/v1'
ARRAY_PATH = DAGENT_URL + METRIC_PATH + '/{}/arrays?arrayids={}&time={}'
VOLUME_PATH = DAGENT_URL + METRIC_PATH + '/{}/arrays/volumes?arrayids={}&volumeids={}&time={}'

def get_cpu_usage(time, auth = BASIC_AUTH_TOKEN):
    req_headers = get_headers(auth)
    try:
        #print("Sending command to dagent")
        response = send_command_to_dagent("GET",url=DAGENT_URL + METRIC_PATH + '/cpu/' + time, \
        headers= req_headers,timeout=(connect_timeout,read_timeout))
        #print("--------------RESPONSE-------------")
        response = response.json()
        #print("--------------RESPONSE-------------")
        return response
    except HTTPError as http_err:
        print(f'HTTP error occurred: {http_err}')
    except Exception as err:
        print(f'Other error occurred: {err}')
def get_memory_usage(time, auth = BASIC_AUTH_TOKEN):
    req_headers = get_headers(auth)
    try:
        #print("Sending command to dagent")
        response = send_command_to_dagent("GET",url=DAGENT_URL + METRIC_PATH + '/memory/' + time, \
        headers= req_headers,timeout=(connect_timeout,read_timeout))
        #print("--------------RESPONSE-------------")
        response = response.json()
        #print("--------------RESPONSE-------------")
        return response
    except HTTPError as http_err:
        print(f'HTTP error occurred: {http_err}')
    except Exception as err:
        print(f'Other error occurred: {err}')


def get_read_iops(time, arr_ids, auth = BASIC_AUTH_TOKEN):
    req_headers = get_headers(auth)
    try:
        #print("Sending command to dagent")
        PATH = ARRAY_PATH.format("readiops",arr_ids,time)
        response = send_command_to_dagent("GET",url = PATH, headers= req_headers,timeout=(connect_timeout,read_timeout))
        #print("--------------RESPONSE-------------")
        response = response.json()
        #print("--------------RESPONSE-------------")
        return response
    except HTTPError as http_err:
        print(f'HTTP error occurred: {http_err}')
    except Exception as err:
        print(f'Other error occurred: {err}')

def get_vol_read_iops(time, arr_ids, vol_ids, auth = BASIC_AUTH_TOKEN):
    req_headers = get_headers(auth)
    try:
        #print("Sending command to dagent")
        PATH = VOLUME_PATH.format("readiops",arr_ids,vol_ids,time)
        response = send_command_to_dagent("GET",url = PATH, headers= req_headers,timeout=(connect_timeout,read_timeout))
        #print("--------------RESPONSE-------------")
        response = response.json()
        #print("--------------RESPONSE-------------")
        return response
    except HTTPError as http_err:
        print(f'HTTP error occurred: {http_err}')
    except Exception as err:
        print(f'Other error occurred: {err}')

def get_write_iops(time, arr_ids, auth = BASIC_AUTH_TOKEN):
    req_headers = get_headers(auth)
    try:
        #print("Sending command to dagent")
        PATH = ARRAY_PATH.format("writeiops",arr_ids,time)
        response = send_command_to_dagent("GET",url = PATH, headers= req_headers,timeout=(connect_timeout,read_timeout))
        #print("--------------RESPONSE-------------")
        response = response.json()
        #print("--------------RESPONSE-------------")
        return response
    except HTTPError as http_err:
        print(f'HTTP error occurred: {http_err}')
    except Exception as err:
        print(f'Other error occurred: {err}')

def get_vol_write_iops(time, arr_ids, vol_ids, auth = BASIC_AUTH_TOKEN):
    req_headers = get_headers(auth)
    try:
        #print("Sending command to dagent")
        PATH = VOLUME_PATH.format("writeiops", arr_ids,vol_ids,time)
        response = send_command_to_dagent("GET",url = PATH, headers= req_headers,timeout=(connect_timeout,read_timeout))
        #print("--------------RESPONSE-------------")
        response = response.json()
        #print("--------------RESPONSE-------------")
        return response
    except HTTPError as http_err:
        print(f'HTTP error occurred: {http_err}')
    except Exception as err:
        print(f'Other error occurred: {err}')

def get_read_bw(time, arr_ids, auth = BASIC_AUTH_TOKEN):
    req_headers = get_headers(auth)
    try:
        #print("Sending command to dagent")
        PATH = ARRAY_PATH.format("readbw",arr_ids,time)
        response = send_command_to_dagent("GET",url = PATH, headers= req_headers,timeout=(connect_timeout,read_timeout))
        #print("--------------RESPONSE-------------")
        #print(response)
        response = response.json()
        #print("--------------RESPONSE-------------")
        return response
    except HTTPError as http_err:
        print(f'HTTP error occurred: {http_err}')
    except Exception as err:
        print(f'Other error occurred: {err}')

def get_vol_read_bw(time, arr_ids, vol_ids, auth = BASIC_AUTH_TOKEN):
    req_headers = get_headers(auth)
    try:
        #print("Sending command to dagent")
        PATH = VOLUME_PATH.format("readbw",arr_ids,vol_ids,time)
        response = send_command_to_dagent("GET",url = PATH, headers= req_headers,timeout=(connect_timeout,read_timeout))
        #print("--------------RESPONSE-------------")
        #print(response)
        response = response.json()
        #print("--------------RESPONSE-------------")
        return response
    except HTTPError as http_err:
        print(f'HTTP error occurred: {http_err}')
    except Exception as err:
        print(f'Other error occurred: {err}')

def get_write_bw(time, arr_ids, auth = BASIC_AUTH_TOKEN):
    req_headers = get_headers(auth)
    try:
        #print("Sending command to dagent")
        PATH = ARRAY_PATH.format("writebw",arr_ids,time)
        response = send_command_to_dagent("GET",url = PATH, headers= req_headers,timeout=(connect_timeout,read_timeout))
        #print("--------------RESPONSE-------------")
        response = response.json()
        #print("--------------RESPONSE-------------")
        return response
    except HTTPError as http_err:
        print(f'HTTP error occurred: {http_err}')
    except Exception as err:
        print(f'Other error occurred: {err}')

def get_vol_write_bw(time, arr_ids, vol_ids, auth = BASIC_AUTH_TOKEN):
    req_headers = get_headers(auth)
    try:
        #print("Sending command to dagent")
        PATH = VOLUME_PATH.format("writebw",arr_ids,vol_ids,time)
        response = send_command_to_dagent("GET",url = PATH, headers= req_headers,timeout=(connect_timeout,read_timeout))
        #print("--------------RESPONSE-------------")
        response = response.json()
        #print("--------------RESPONSE-------------")
        return response
    except HTTPError as http_err:
        print(f'HTTP error occurred: {http_err}')
    except Exception as err:
        print(f'Other error occurred: {err}')

def get_latency(time, arr_ids, auth = BASIC_AUTH_TOKEN):
    req_headers = get_headers(auth)
    try:
        #print("Sending command to dagent")
        PATH = ARRAY_PATH.format("writelatency",arr_ids,time)
        response = send_command_to_dagent("GET",url = PATH, headers= req_headers,timeout=(connect_timeout,read_timeout))
        #print("--------------RESPONSE-------------")
        response = response.json()
        #print("--------------RESPONSE-------------")
        return response
    except HTTPError as http_err:
        print(f'HTTP error occurred: {http_err}')
    except Exception as err:
        print(f'Other error occurred: {err}')

def get_read_latency(time, arr_ids, auth = BASIC_AUTH_TOKEN):
    req_headers = get_headers(auth)
    try:
        #print("Sending command to dagent")
        PATH = ARRAY_PATH.format("readlatency",arr_ids,time)
        response = send_command_to_dagent("GET",url = PATH, headers= req_headers,timeout=(connect_timeout,read_timeout))
        #print("--------------RESPONSE-------------")
        response = response.json()
        #print("--------------RESPONSE-------------")
        return response
    except HTTPError as http_err:
        print(f'HTTP error occurred: {http_err}')
    except Exception as err:
        print(f'Other error occurred: {err}')

def get_vol_latency(time, arr_ids, vol_ids, auth = BASIC_AUTH_TOKEN):
    req_headers = get_headers(auth)
    try:
        #print("Sending command to dagent")
        PATH = VOLUME_PATH.format("writelatency",arr_ids,vol_ids,time)
        response = send_command_to_dagent("GET",url = PATH, headers= req_headers,timeout=(connect_timeout,read_timeout))
        #print("--------------RESPONSE-------------")
        response = response.json()
        #print("--------------RESPONSE-------------")
        return response
    except HTTPError as http_err:
        print(f'HTTP error occurred: {http_err}')
    except Exception as err:
        print(f'Other error occurred: {err}')

def get_vol_read_latency(time, arr_ids, vol_ids, auth = BASIC_AUTH_TOKEN):
    req_headers = get_headers(auth)
    try:
        #print("Sending command to dagent")
        PATH = VOLUME_PATH.format("readlatency",arr_ids,vol_ids,time)
        response = send_command_to_dagent("GET",url = PATH, headers= req_headers,timeout=(connect_timeout,read_timeout))
        #print("--------------RESPONSE-------------")
        response = response.json()
        #print("--------------RESPONSE-------------")
        return response
    except HTTPError as http_err:
        print(f'HTTP error occurred: {http_err}')
    except Exception as err:
        print(f'Other error occurred: {err}')

def get_write_latency(time, arr_ids, auth = BASIC_AUTH_TOKEN):
    req_headers = get_headers(auth)
    try:
        #print("Sending command to dagent")
        PATH = ARRAY_PATH.format("writelatency",arr_ids,time)
        response = send_command_to_dagent("GET",url = PATH, headers= req_headers,timeout=(connect_timeout,read_timeout))
        #print("--------------RESPONSE-------------")
        response = response.json()
        #print("--------------RESPONSE-------------")
        return response
    except HTTPError as http_err:
        print(f'HTTP error occurred: {http_err}')
    except Exception as err:
        print(f'Other error occurred: {err}')

def get_vol_write_latency(time, arr_ids, vol_ids, auth = BASIC_AUTH_TOKEN):
    req_headers = get_headers(auth)
    try:
        #print("Sending command to dagent")
        PATH = VOLUME_PATH.format("writelatency",arr_ids,vol_ids,time)
        response = send_command_to_dagent("GET",url = PATH, headers= req_headers,timeout=(connect_timeout,read_timeout))
        #print("--------------RESPONSE-------------")
        response = response.json()
        #print("--------------RESPONSE-------------")
        return response
    except HTTPError as http_err:
        print(f'HTTP error occurred: {http_err}')
    except Exception as err:
        print(f'Other error occurred: {err}')
