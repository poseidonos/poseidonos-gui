'''
/*-------------------------------------------------------------------------------------/
                                                                                    /
/               COPYRIGHT (c) 2019 SAMSUNG ELECTRONICS CO., LTD.                      /
/                          ALL RIGHTS RESERVED                                        /
/                                                                                     /
/   Permission is hereby granted to licensees of Samsung Electronics Co., Ltd.        /
/   products to use or abstract this computer program for the sole purpose of         /
/   implementing a product based on Samsung Electronics Co., Ltd. products.           /
/   No other rights to reproduce, use, or disseminate this computer program,          /
/   whether in part or in whole, are granted.                                         / 
/                                                                                     /
/   Samsung Electronics Co., Ltd. makes no representation or warranties with          /
/   respect to the performance of this computer program, and specifically disclaims   /
/   any responsibility for any damages, special or consequential, connected           /
/   with the use of this program.                                                     /
/                                                                                     /
/-------------------------------------------------------------------------------------/


DESCRIPTION: <File description> *
@NAME : array.py
@AUTHORS: Jay Hitesh Sanghavi 
@Version : 1.0 *
@REVISION HISTORY
[03/06/2019] [Jay] : Prototyping..........////////////////////
*/
'''

from requests.exceptions import HTTPError
from rest.rest_api.dagent.ibofos import get_headers, send_command_to_dagent, DAGENT_URL, BASIC_AUTH_TOKEN, connect_timeout, read_timeout

METRIC_PATH = '/api/metric/v1'

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


def get_read_iops(time, auth = BASIC_AUTH_TOKEN):
    req_headers = get_headers(auth)
    try:
        #print("Sending command to dagent")
        response = send_command_to_dagent("GET",url=DAGENT_URL + METRIC_PATH + '/readiops/' + time, \
        headers= req_headers,timeout=(connect_timeout,read_timeout))
        #print("--------------RESPONSE-------------")
        response = response.json()
        #print("--------------RESPONSE-------------")
        return response
    except HTTPError as http_err:
        print(f'HTTP error occurred: {http_err}')
    except Exception as err:
        print(f'Other error occurred: {err}')

def get_vol_read_iops(time, level, auth = BASIC_AUTH_TOKEN):
    req_headers = get_headers(auth)
    try:
        #print("Sending command to dagent")
        response = send_command_to_dagent("GET",url=DAGENT_URL + METRIC_PATH + '/volumes/' + level + '/readiops/' + time, \
        headers= req_headers,timeout=(connect_timeout,read_timeout))
        #print("--------------RESPONSE-------------")
        response = response.json()
        #print("--------------RESPONSE-------------")
        return response
    except HTTPError as http_err:
        print(f'HTTP error occurred: {http_err}')
    except Exception as err:
        print(f'Other error occurred: {err}')

def get_write_iops(time, auth = BASIC_AUTH_TOKEN):
    req_headers = get_headers(auth)
    try:
        #print("Sending command to dagent")
        response = send_command_to_dagent("GET",url=DAGENT_URL + METRIC_PATH + '/writeiops/' + time, \
        headers= req_headers,timeout=(connect_timeout,read_timeout))
        #print("--------------RESPONSE-------------")
        response = response.json()
        #print("--------------RESPONSE-------------")
        return response
    except HTTPError as http_err:
        print(f'HTTP error occurred: {http_err}')
    except Exception as err:
        print(f'Other error occurred: {err}')

def get_vol_write_iops(time, level, auth = BASIC_AUTH_TOKEN):
    req_headers = get_headers(auth)
    try:
        #print("Sending command to dagent")
        response = send_command_to_dagent("GET",url=DAGENT_URL + METRIC_PATH + '/volumes/' + level + '/writeiops/' + time, \
        headers= req_headers,timeout=(connect_timeout,read_timeout))
        #print("--------------RESPONSE-------------")
        response = response.json()
        #print("--------------RESPONSE-------------")
        return response
    except HTTPError as http_err:
        print(f'HTTP error occurred: {http_err}')
    except Exception as err:
        print(f'Other error occurred: {err}')

def get_read_bw(time, auth = BASIC_AUTH_TOKEN):
    req_headers = get_headers(auth)
    try:
        #print("Sending command to dagent")
        response = send_command_to_dagent("GET",url=DAGENT_URL + METRIC_PATH + '/readbw/' + time, \
        headers= req_headers,timeout=(connect_timeout,read_timeout))
        #print("--------------RESPONSE-------------")
        #print(response)
        response = response.json()
        #print("--------------RESPONSE-------------")
        return response
    except HTTPError as http_err:
        print(f'HTTP error occurred: {http_err}')
    except Exception as err:
        print(f'Other error occurred: {err}')

def get_vol_read_bw(time, level, auth = BASIC_AUTH_TOKEN):
    req_headers = get_headers(auth)
    try:
        #print("Sending command to dagent")
        response = send_command_to_dagent("GET",url=DAGENT_URL + METRIC_PATH + '/volumes/' + level + '/readbw/' + time, \
        headers= req_headers,timeout=(connect_timeout,read_timeout))
        #print("--------------RESPONSE-------------")
        #print(DAGENT_URL + '/api/metric/v1/readbw/volumes/' + level + '/' + time)
        #print(response)
        response = response.json()
        #print("--------------RESPONSE-------------")
        return response
    except HTTPError as http_err:
        print(f'HTTP error occurred: {http_err}')
    except Exception as err:
        print(f'Other error occurred: {err}')

def get_write_bw(time, auth = BASIC_AUTH_TOKEN):
    req_headers = get_headers(auth)
    try:
        #print("Sending command to dagent")
        response = send_command_to_dagent("GET",url=DAGENT_URL + METRIC_PATH + '/writebw/' + time, \
        headers= req_headers,timeout=(connect_timeout,read_timeout))
        #print("--------------RESPONSE-------------")
        response = response.json()
        #print("--------------RESPONSE-------------")
        return response
    except HTTPError as http_err:
        print(f'HTTP error occurred: {http_err}')
    except Exception as err:
        print(f'Other error occurred: {err}')

def get_vol_write_bw(time, level, auth = BASIC_AUTH_TOKEN):
    req_headers = get_headers(auth)
    try:
        #print("Sending command to dagent")
        response = send_command_to_dagent("GET",url=DAGENT_URL + METRIC_PATH + '/volumes/' + level + '/writebw/' + time, \
        headers= req_headers,timeout=(connect_timeout,read_timeout))
        #print("--------------RESPONSE-------------")
        response = response.json()
        #print("--------------RESPONSE-------------")
        return response
    except HTTPError as http_err:
        print(f'HTTP error occurred: {http_err}')
    except Exception as err:
        print(f'Other error occurred: {err}')

def get_latency(time, auth = BASIC_AUTH_TOKEN):
    req_headers = get_headers(auth)
    try:
        #print("Sending command to dagent")
        response = send_command_to_dagent("GET",url=DAGENT_URL + METRIC_PATH + '/latency/' + time, \
        headers= req_headers,timeout=(connect_timeout,read_timeout))
        #print("--------------RESPONSE-------------")
        response = response.json()
        #print("--------------RESPONSE-------------")
        return response
    except HTTPError as http_err:
        print(f'HTTP error occurred: {http_err}')
    except Exception as err:
        print(f'Other error occurred: {err}')

def get_vol_latency(time, level, auth = BASIC_AUTH_TOKEN):
    req_headers = get_headers(auth)
    try:
        #print("Sending command to dagent")
        response = send_command_to_dagent("GET",url=DAGENT_URL + METRIC_PATH + '/volumes/' + level + '/latency/' + time, \
        headers= req_headers,timeout=(connect_timeout,read_timeout))
        #print("--------------RESPONSE-------------")
        response = response.json()
        #print("--------------RESPONSE-------------")
        return response
    except HTTPError as http_err:
        print(f'HTTP error occurred: {http_err}')
    except Exception as err:
        print(f'Other error occurred: {err}')

