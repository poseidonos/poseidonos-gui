# Samsung Poseidon metrics collecting plugin for Ganglia
#
# This file must be added to the path /usr/lib/ganglia/python_modules/poseidon.py
# The configuration file poseidon.conf should be added to /etc/ganglia/conf.d/
#
# This program collects the following metrics from Poseidon and provides it to Ganglia
#    1. Total Size - Total size available for volume creation
#    2. Used Size - Size used by volumes

import uuid
import time
import os
import requests

ip = os.environ.get('DAGENT_HOST','localhost');
connect_timeout=5
read_timeout=5

DAGENT_URL='http://'+ip+':3000/mtool'

def send_command_to_dagent(req_type,url,headers,timeout = None, data = None):
    """
    Sends the given command to DAgent

    This function sends a command to DAgent using REST protocol and returns the response received
    """
    retry_count = 0
    response = None
    try:
        while(1):
            if(req_type == "GET"):
                response = requests.get(url=url,headers=headers,timeout=timeout)
            elif(req_type == "POST"):
                response = requests.post(url=url,headers=headers,timeout=timeout,data=data)
            elif(req_type == "DELETE"):
                response = requests.delete(url=url,headers=headers,timeout=timeout,data=data)
            elif(req_type == "PUT"):
                response = requests.put(url=url,headers=headers,timeout=timeout,data=data)
            retry_count = retry_count + 1
            if(response.status_code == 200 and response['result'] and response['result']['status'] and response['result']['status']['code'] and response['result']['status']['code'] != '12000'):
                return response
            if(retry_count>=5):
                return response
    except Exception as err:
        return response

def get_headers(auth = 'Basic YWRtaW46YWRtaW4=' , content_type = "application/json"):
    """
    Get the headers to be passed to DAgent
    """
    return {"X-Request-Id" : str(uuid.uuid4()), "Accept": content_type, "Authorization":auth \
        , "ts" : str(int(time.time())) }

def pos_handler(name):
    """
    The main handler of the plugin

    This function sends a  DAgent request to fetch volume details and
    it returns the total size or used size based on the name parameter
    """
    print("POS Handler called")
    req_headers = get_headers('Basic YWRtaW46YWRtaW4=')
    response = send_command_to_dagent("GET",url=DAGENT_URL + '/api/ibofos/v1/volume', \
    headers = req_headers, timeout=(connect_timeout,read_timeout))
    res = response.json()
    if "info" in res and "used" in res["info"]:
        if name == "used_size":
            print(res["info"]["used"])
            return res["info"]["used"]
        else:
            print(res["info"]["capacity"])
            return res["info"]["capacity"]


def metric_init(params):
    """
    Plugin Initialization Function

    This function is used to initialize the plugin.
    It returns a list of descriptors which provides details of the data captured
    """
    d1 = {'name': 'used_size',
        'call_back': pos_handler,
        'time_max': 90,
        'value_type': 'float',
        'units': '',
        'slope': 'both',
        'format': '%f',
        'description': 'Poseidon Used Size',
        'groups': 'poseidon'}
    d2 = {'name': 'total_size',
        'call_back': pos_handler,
        'time_max': 90,
        'value_type': 'float',
        'units': '',
        'slope': 'both',
        'format': '%f',
        'description': 'Poseidon Total Size',
        'groups': 'poseidon'}

    descriptors = [d1, d2]
    print("POS INIT", descriptors)
    return descriptors

def metric_cleanup():
    '''Clean up the metric module.'''
    pass
