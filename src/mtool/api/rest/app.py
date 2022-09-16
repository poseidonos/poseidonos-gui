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


#!/usr/bin/python
from rest.swordfish.handler import swordfish_api
#from rest.rest_api.alerts.system_alerts import get_alert_categories_from_influxdb
from rest.exceptions import InvalidUsage
from util.com.time_groups import time_groups
from rest.rest_api.volume.volume import create_volume, delete_volume, list_volume, rename_volume, get_max_vol_count, mount_volume, unmount_volume
#from rest.rest_api.logmanager.logmanager import download_logs
from rest.rest_api.array.array import create_arr, arr_info, get_arr_status
from util.com.common import get_ip_address, get_hostname
from rest.rest_api.system.system import fetch_system_state
from rest.rest_api.device.device import list_devices, get_disk_details
from rest.rest_api.health_status.health_status import process_response, get_overall_health
from rest.rest_api.telemetry.telemetry import set_telemetry_configuration, check_telemetry_endpoint
#from rest.rest_api.logmanager.logmanager import get_bmc_logs
#from rest.rest_api.logmanager.logmanager import get_ibofos_logs
#from rest.rest_api.rebuildStatus.rebuildStatus import get_rebuilding_status
from rest.rest_api.perf.system_perf import get_user_cpu_usage, get_user_memory_usage, get_disk_read_iops, get_disk_write_iops, get_disk_read_bw, get_disk_write_bw, get_disk_latency, get_disk_read_latency, \
    get_agg_volumes_perf, get_disk_write_latency
from flask_socketio import SocketIO, disconnect
from flask import Flask, abort, request, jsonify, send_from_directory, make_response
#import rest.rest_api.dagent.bmc as BMC_agent
import rest.rest_api.dagent.ibofos as dagent
from util.db.database_handler import DBConnection, DBType
from util.log.influx_handler import InfluxHandler
from util.log.ui_logger import log_to_influx
import time
from time import strftime
import logging
from logging.handlers import RotatingFileHandler
#from dateutil import parser
import datetime
import jwt
import uuid
from base64 import b64encode
import re
from functools import wraps
from bson import json_util
import traceback
import json
import threading
import os
import eventlet
import math
from itertools import chain

eventlet.monkey_patch()

BLOCK_SIZE = 1024 * 1024
BYTE_FACTOR = 1000


# Connect to MongoDB first. PyMODM supports all URI options supported by
# PyMongo. Make sure also to specify a database in the connection string:


app = Flask(__name__, static_folder='./public')

app.register_blueprint(swordfish_api)
app.config['SECRET_KEY'] = 'ibofalltheway'
app.config['MONGODB_URL'] = 'mongodb://localhost:27017/ibof'

handler = RotatingFileHandler(
    'public/log/mtool.log',
    maxBytes=1024 * 1024,
    backupCount=3)
logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)
logger.addHandler(handler)
logger.addHandler(InfluxHandler())


connection_obj = DBConnection()
connection_factory = connection_obj.get_db_connection(
    DBType.SQLite)  # SQLite/MongoDB
connection_factory.connect_database()
connection_factory.create_default_database()

MACRO_OFFLINE_STATE = "OFFLINE"
threshold = 0.9
old_result = ""

alertFields = {'cpu': "usage_user", 'mem': 'used_percent'}


class IBOF_OS_Running:
    Is_Ibof_Os_Running_Flag = False


class Run_Only_Once:
    OnlyOnceFlag = True


def toJson(data):
  #  print("tojson :",json_util.dumps(data))
    return json_util.dumps(data)


"""
alerts = [
    'CPU Utilization',
    'Temperature Threshold',
    'Memory Utilization',
    'Critical Warning']
"""

# Serve React App


@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    #print('path debug', os.path.join(os.getcwd(),"public/" + path))
    if path != "" and os.path.exists("public/" + path):
        print('path debug in if', path)
        print(os.path.exists("public/" + path))
        return send_from_directory(os.getcwd() + '/public', path)
    else:
        print('path debig in else', path)
        if "api/v1" in path:
            return make_response("Invalid url", 404)
        return send_from_directory(os.getcwd() + '/public', 'index.html')


@app.after_request
def after_request(response):
    """ Logging after every request. """
    # This avoids the duplication of registry in the log,
    # since that 500 is already logged via @app.errorhandler.
    ts = strftime('[%Y-%b-%d %H:%M]')
    logger.error('%s %s %s %s %s %s',
                 ts,
                 request.remote_addr,
                 request.method,
                 request.scheme,
                 request.full_path,
                 response.status)
    return response


@app.errorhandler(Exception)
def exceptions(e):
    print(e)
    # Logging after every Exception
    ts = strftime('[%Y-%b-%d %H:%M]')
    tb = traceback.format_exc()
    logger.error('%s %s %s %s %s 5xx INTERNAL SERVER ERROR\n%s%s',
                 ts,
                 request.remote_addr,
                 request.method,
                 request.scheme,
                 request.full_path,
                 "",
                 tb)
    return "Internal Server Error", 500


def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if 'x-access-token' in request.headers:
            token = request.headers['x-access-token']
            #print('token ',token)
        if not token:
            return jsonify({'message': 'Token is missing'}), 401
        # jwt to see if tokens if valid
        try:
            data = jwt.decode(token, app.config['SECRET_KEY'])
            #print("data in token_required(): ", data)
            current_user = connection_factory.get_current_user(data['_id'])
            #print("current_user in token_required() ", current_user)
        except BaseException:
            return jsonify({'message': 'Token is invalid'}), 401
        return f(current_user, *args, **kwargs)
    return decorated


@app.route('/api/v1.0/version', methods=['GET'])
def get_version():
    package_json_path = os.path.abspath(
        os.path.join(
            os.path.dirname(__file__),
            "../../ui/package.json"))
    with open(package_json_path, encoding="utf-8") as f:
        data = json.load(f)
        return toJson({"version": data["version"]})


@app.route('/api/v1.0/logger', methods=['POST'])
def log_collect():
    body_unicode = request.data.decode('utf-8')
    if len(body_unicode) > 0:
        body = json.loads(body_unicode)
        try:
            log_to_influx(body)
        except Exception as e:
            print(e)
        return "Log written sucessfully"
    return make_response("Received null log value", 200)


def get_ibof_os_status():
    return IBOF_OS_Running.Is_Ibof_Os_Running_Flag


@app.route('/api/v1.0/pos/info', methods=['GET'])
@token_required
def get_pos_info(current_user):
    return toJson(dagent.get_pos_info().json())


@app.route('/api/v1.0/start_ibofos', methods=['GET'])
@token_required
def start_ibofos(current_user):
    """
    Start IBOF os application. The path is given for demo&kntf server
    :param current_user:
    :return: status
    """
    #body_unicode = request.data.decode('utf-8')
    #body = json.loads(body_unicode)
    #script_path = body['path']
    is_ibofos_running()
    if(get_ibof_os_status()):
        return jsonify({"response": "POS is Already Running...", "code": -1})
    res = dagent.start_ibofos()
    res = res.json()
    return jsonify(res)


"""    if res.status_code == 200:
        res = res.json()
        if res["result"]["status"]["code"] == 0:
            description = res["result"]["status"]["description"]
            return jsonify({"response": description})
    else:
        res = res.json()
        if ("result" in res and "status" in res["result"]):
            description = res["result"]["status"]["description"]
            description += ", Error Code:"
            description += str(res["result"]["status"]["code"])
            return jsonify({"response": description})

    return jsonify({"response": "unable to start POS"})
"""

# Delete Array


@app.route('/api/v1.0/delete_array/<name>', methods=['POST'])
@token_required
def delete_array(current_user, name):
    print("in delete array")
    res = dagent.delete_array(name)
    return_msg = {}
    if res.status_code == 200:
        res = res.json()
        if res["result"]["status"]["code"] == 0:
            return toJson(res)
    else:
        res = res.json()
        if ("result" in res and "status" in res["result"]):
            return_msg["result"] = res["result"]["status"]
            return_msg["return"] = -1
            return toJson(return_msg)
    res = "unable to delete array"
    return make_response(res, 500)


@app.route('/api/v1.0/stop_ibofos', methods=['GET'])
@token_required
def stop_ibofos(current_user):
    """
    Start IBOF os application. The path is given for demo&kntf server
    :param current_user:
    :return: status
    """
    print("current_user:", current_user)
    is_ibofos_running()
    if(IBOF_OS_Running.Is_Ibof_Os_Running_Flag == False):
        return jsonify({"response": "POS has already stopped...", "code": -1})
    res = dagent.stop_ibofos()
    try:
        if res.status_code == 200:
            res = res.json()
            if res["result"]["status"]["code"] == 0:
                description = res["result"]["status"]["description"]
                return jsonify({"response": description, "code": 0})
        else:
            res = res.json()
            if ("result" in res and "status" in res["result"]):
                description = res["result"]["status"]["description"]
                description += ", Error Code:"
                description += str(res["result"]["status"]["code"])
                return jsonify({"response": description,
                                "code": res["result"]["status"]["code"]})
            return jsonify({"response": "unable to stop ibofos", "code": -1})
    except BaseException:
        return jsonify({"response": "unable to stop ibofos", "code": -1})


"""
@app.route('/api/v1.0/run_ibof_os_command/', methods=['POST'])
@token_required
def run_shell_file(current_user):
    body_unicode = request.data.decode('utf-8')
    body = json.loads(body_unicode)
    script_path = body['path']
    print("running shell file....")
    session = subprocess.Popen(
        ['sh', script_path], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    stdout, stderr = session.communicate()
    if stderr:
        return jsonify({"response": stderr.decode('ascii'), "code": -1})
        # raise Exception("Error " + str(stderr))
    else:
        return jsonify({"response": stdout.decode('ascii'), "code": 0})
"""


@app.route('/api/v1.0/get_Is_Ibof_OS_Running/')
@token_required
def is_ibofos_running(current_user="admin"):
    """
    Checks if ibofos is running
    :return:
    """
    #processName = 'ibofos'
    # if checkIfProcessRunning(processName) == True:
    #    return jsonify({"status":True})
    # elif checkIfProcessRunning(processName) == False:
    #    return jsonify({"status":False})
    #print(strftime("%a, %d %b %Y %X"))
    # print(gmtime())
    # print(time.ctime())
    # print(datetime.datetime.now())
    timestamp = code = level = value = ""
    state = ""
    situation = ""
    """response = get_rebuilding_status()
    print("get_rebuilding_status RESPONSE", response)
    if(response != "error"):
        res = list(response.get_points())
        if res:
            response = res[0]['last']
            # print(response)
            response = response.translate({ord('['): None})
            split_string = re.split(r'[]]', response)
            timestamp = split_string[0]
            code = split_string[1]
            level = split_string[2]
            value = split_string[3].strip()
            #timestamp = datetime.datetime.strptime(timestamp, "%Y%m%d%H%M%S")
            #timestamp = timestamp.strftime("%a, %d %b %Y %I:%M:%S %p %Z") + strftime("%Z")
            timestamp = time.strftime(
                "%a, %d %b %Y %H:%M:%S %Z",
                time.localtime(
                    int(timestamp)))
        #print(timestamp,code, level, value)
    """
    lastRunningTime = ""
    try:
        #col = db['iBOFOS_Timestamp']
        response = fetch_system_state()
        #print("response 1 :",response,type(response))
        response = response.json()
        #print("response 2 : ",response.json())
        if 'lastSuccessTime' in response and response['lastSuccessTime'] != 0:
            lastRunningTime = datetime.datetime.fromtimestamp(
                response['lastSuccessTime']).strftime("%a, %d %b %Y %I:%M:%S %p %Z")
        if('result' in response and 'status' in response['result'] and 'code' in response['result']['status'] and response['result']['status']['code'] == 0):
            timestamp = connection_factory.get_prev_time_stamp()
            #lastRunningTime = strftime("%a, %d %b %Y %I:%M:%S %p %Z")
            if not timestamp:
                connection_factory.insert_time_stamp(lastRunningTime)
            else:
                connection_factory.update_time_stamp(lastRunningTime)
            IBOF_OS_Running.Is_Ibof_Os_Running_Flag = True
            #response = {"result": {"data": {"type": "NORMAL"}}}
        else:
            timestampvalue = connection_factory.get_prev_time_stamp()
            if not timestampvalue:
                lastRunningTime = ""
            else:
                lastRunningTime = timestampvalue
            IBOF_OS_Running.Is_Ibof_Os_Running_Flag = False
        if('result' in response and 'data' in response['result']):
            state = response['result']['data']['state']
            situation = response['result']['data']['situation']
    except BaseException:
        return toJson({"RESULT": response,
                       "lastRunningTime": lastRunningTime,
                       "timestamp": timestamp,
                       "code": code,
                       "level": level,
                       "state": state,
                       "situation": situation,
                       "value": value})
    return toJson({"RESULT": response,
                   "lastRunningTime": lastRunningTime,
                   "timestamp": timestamp,
                   "code": code,
                   "level": level,
                   "state": state,
                   "situation": situation,
                   "value": value})


"""
@app.route('/api/v1.0/get_Ibof_OS_Logs/')
def ibofos_logs():
    #print("Palak: get logs")
    data = []
    try:
        timestamp = code = level = value = description = ""
        response, count = get_ibofos_logs()
        entries = list(count.get_points(measurement='rebuilding_status'))
        print("entries is", entries[0]['count'])
        res = list(response.get_points())
        #print("Response1", res)
        if res:
            for x in range(0, 100):
                description = ""
                response = res[x]['value']
                #print("Response2", response)
                response = response.translate({ord('['): None})
                #print("Response3", response)
                split_string = re.split(r'[]]', response)
                #print("Response4", response)
                #print("split string", split_string)
                if len(split_string) >= 3:
                    timestamp = split_string[0]
                    code = split_string[1]
                    level = split_string[2]
                    value = split_string[3].strip()
                    #timestamp = datetime.datetime.strptime(timestamp, "%Y%m%d%H%M%S")
                    #timestamp = timestamp.strftime("%a, %d %b %Y %I:%M:%S %p %Z") + strftime("%Z")
                    timestamp = time.strftime(
                        "%a, %d %b %Y %H:%M:%S %Z", time.localtime(
                            int(timestamp)))
                    if code in statusList.keys():
                        description = statusList[code]

                    #print(timestamp,code, level, value, description)
                    data.append({"timestamp": timestamp,
                                 "code": code,
                                 "level": level,
                                 "value": value,
                                 "source": "Poseidon OS",
                                 "description": description,
                                 "entries": entries[0]['count']})
    except BaseException:
        # return toJson([{"timestamp": timestamp, "code":code, "level":level,
        # "value":value}])
        return toJson(data)
    finally:
        return toJson(data)
        # return toJson([{"timestamp": timestamp, "code":code, "level":level,
        # "value":value}])



@app.route('/api/v1.0/get_Bmc_Logs/')
def bmc_logs():

    page = request.args.get('page', type=str)
    per_page = request.args.get('per_page', default=10, type=str)
    filterSubQuery = request.args.get('filterSubQuery', type=str)
    filter_applied = request.args.get('filter_applied', type=str)
    resp = []
    source_filter_array = []
    entryType_filter_array = []
    severity_filter_array = []
    entries = 0
    result = {"resp": resp,
              "count": entries,
              "page": 0,
              "source_filter_array": source_filter_array,
              "entryType_filter_array": entryType_filter_array,
              "severity_filter_array": severity_filter_array,
              }
    try:
        source = entryType = severity = description = timestamp = ""
        response, count, source_filter, entryType_filter, severity_filter = get_bmc_logs(
            page, per_page, filterSubQuery)
        source_filter = list(source_filter.get_points())
        entryType_filter = list(entryType_filter.get_points())
        severity_filter = list(severity_filter.get_points())

        for data in source_filter:
            value = data['distinct']
            source_filter_array.append(value)

        for data in entryType_filter:
            value = data['distinct']
            entryType_filter_array.append(value)

        for data in severity_filter:
            value = data['distinct']
            severity_filter_array.append(value)

        total_count = list(count.get_points(measurement='bmc_logs'))
        for data in list(response.get_points()):
            for _ in data.keys():
                timestamp = data['Timestamp']
                source = data['Source']
                entryType = data['EntryType']
                severity = data['Severity']
                description = data['Description']
            resp.append({"timestamp": timestamp,
                         "source": source,
                         "entryType": entryType,
                         "severity": severity,
                         "description": description})
        entries = total_count[0]['count']
        page_int = int(page, 10)
        if(filter_applied == "yes"):
            page_int = 0
        result = {"resp": resp,
                  "count": entries,
                  "page": page_int,
                  "source_filter_array": source_filter_array,
                  "entryType_filter_array": entryType_filter_array,
                  "severity_filter_array": severity_filter_array,
                  }
    except BaseException:
        return toJson(result)
"""

"""
@app.route('/api/v1.0/get_alert_info', methods=['GET'])
def get_alert_info():
    try:
        allAlerts = get_alerts_from_influx()
        alertData = list(allAlerts.get_points())
        for x in alertData:
            datetime_obj = parser.parse(x['time'])
            readable = datetime_obj.strftime(
                "%a, %d %b %Y %H:%M:%S %Z")  # %Y-%m-%d %H:%M:%S')
            x['time'] = readable
            x['duration'] = int(x['duration']) / 1000000000
            x['value'] = round(x['value'], 3)
        return jsonify({'alerts': alertData})
    except BaseException:
        return jsonify({'alerts': alertData})

'''
@app.route('/api/v1.0/get_alert_types/', methods=['GET'])
@token_required
def get_alert_categories(current_user):
    #To get the alert subcategories, uncomment the following line
    #alertCategories = get_alert_categories_new()

    alertCategories = get_alert_categories_from_influxdb()
    return jsonify({'alert_types': alertCategories})
'''


@app.route('/api/v1.0/available_memory', methods=['GET'])
def get_available_mem():
    res = get_available()
    val = list(res.get_points())
    print(val)
    return jsonify(val)
"""


@app.route('/api/v1.0/available_storage/', methods=['GET'])
@token_required
def get_storage_details(current_user):
    # array = db['array'].find_one({})

    res = get_arr_status()
    val = [{}]
    if res.status_code == 200:
        res = res.json()
        if res["info"]["state"] and res["info"]["state"].upper(
        ) != MACRO_OFFLINE_STATE:
            val[0]["arraySize"] = int(res["info"]["capacity"])
            val[0]["usedSpace"] = int(res["info"]["used"])
        else:
            val[0]['arraySize'] = 0
            val[0]['usedSpace'] = 0
        val[0]['mountStatus'] = res["info"]["state"].upper()
    else:
        val[0]['arraySize'] = 0
        val[0]['usedSpace'] = 0
        val[0]['mountStatus'] = MACRO_OFFLINE_STATE

    print(val)
    return jsonify(val)


@app.route('/api/v1.0/usage_user/<time_interval>', methods=['GET'])
def get_user_cpu_use(time_interval):
    if time_interval not in time_groups.keys():
        raise InvalidUsage(
            'Use time from 1m,5m,15m,1h,6h,12h,24h,7d,30d',
            status_code=404)
    try:
        res = get_user_cpu_usage(time_interval)
        return jsonify(res["result"]["data"])
    except Exception as e:
        print(e)
        return jsonify([])


def get_read_iops(time_interval, arr_id, vol_id):
    if time_interval not in time_groups.keys():
        raise InvalidUsage(
            'Use time from 1m,5m,15m,1h,6h,12h,24h,7d,30d',
            status_code=404)
    try:
        res = get_disk_read_iops(time_interval, arr_id, vol_id)
        return jsonify({"res": res["result"]["data"]})
    except Exception as e:
        print(e)
        return jsonify({"res": []})


@app.route('/api/v1/readiops/arrays', methods=['GET'])
def get_array_read_iops():
    params = request.args.to_dict()
    arr_ids = params["arrayids"]
    time_interval = params["time"]
    return get_read_iops(time_interval, arr_ids, "")


@app.route('/api/v1/readiops/arrays/volumes', methods=['GET'])
def get_volume_read_iops():
    params = request.args.to_dict()
    arr_ids = params["arrayids"]
    vol_ids = params["volumeids"]
    time_interval = params["time"]
    return get_read_iops(time_interval, arr_ids, vol_ids)


def get_write_iops(time_interval, arr_id, vol_id):
    if time_interval not in time_groups.keys():
        raise InvalidUsage(
            'Use time from 1m,5m,15m,1h,6h,12h,24h,7d,30d',
            status_code=404)
    try:
        res = get_disk_write_iops(time_interval, arr_id, vol_id)
        return jsonify({"res": res["result"]["data"]})
    except Exception as e:
        print(e)
        return jsonify({"res": []})


@app.route('/api/v1/writeiops/arrays', methods=['GET'])
def get_array_write_iops():
    params = request.args.to_dict()
    arr_ids = params["arrayids"]
    time_interval = params["time"]
    return get_write_iops(time_interval, arr_ids, "")


@app.route('/api/v1/writeiops/arrays/volumes', methods=['GET'])
def get_volume_write_iops():
    params = request.args.to_dict()
    arr_ids = params["arrayids"]
    vol_ids = params["volumeids"]
    time_interval = params["time"]
    return get_write_iops(time_interval, arr_ids, vol_ids)


def get_latency(time_interval, arr_ids, vol_ids):
    if time_interval not in time_groups.keys():
        raise InvalidUsage(
            'Use time from 1m,5m,15m,1h,6h,12h,24h,7d,30d',
            status_code=404)
    try:
        res = get_disk_latency(time_interval, arr_ids, vol_ids)
        return jsonify({"res": res["result"]["data"]})
    except Exception as e:
        print(e)
        return jsonify({"res": []})


@app.route('/api/v1/latency/arrays', methods=['GET'])
def get_array_latency():
    params = request.args.to_dict()
    arr_ids = params["arrayids"]
    time_interval = params["time"]
    return get_latency(time_interval, arr_ids, "")


@app.route('/api/v1/latency/arrays/volumes', methods=['GET'])
def get_volume_latency():
    params = request.args.to_dict()
    arr_ids = params["arrayids"]
    vol_ids = params["volumeids"]
    time_interval = params["time"]
    return get_latency(time_interval, arr_ids, vol_ids)


def get_read_latency(time_interval, arr_ids, vol_ids):
    if time_interval not in time_groups.keys():
        raise InvalidUsage(
            'Use time from 1m,5m,15m,1h,6h,12h,24h,7d,30d',
            status_code=404)
    try:
        res = get_disk_read_latency(time_interval, arr_ids, vol_ids)
        return jsonify({"res": res["result"]["data"]})
    except Exception as e:
        print(e)
        return jsonify({"res": []})


def get_write_latency(time_interval, arr_ids, vol_ids):
    if time_interval not in time_groups.keys():
        raise InvalidUsage(
            'Use time from 1m,5m,15m,1h,6h,12h,24h,7d,30d',
            status_code=404)
    try:
        res = get_disk_write_latency(time_interval, arr_ids, vol_ids)
        return jsonify({"res": res["result"]["data"]})
    except Exception as e:
        print(e)
        return jsonify({"res": []})


@app.route('/api/v1/readlatency/arrays', methods=['GET'])
def get_array_read_latency():
    params = request.args.to_dict()
    arr_ids = params["arrayids"]
    time_interval = params["time"]
    return get_read_latency(time_interval, arr_ids, "")


@app.route('/api/v1/readlatency/arrays/volumes', methods=['GET'])
def get_volume_read_latency():
    params = request.args.to_dict()
    arr_ids = params["arrayids"]
    vol_ids = params["volumeids"]
    time_interval = params["time"]
    return get_read_latency(time_interval, arr_ids, vol_ids)


@app.route('/api/v1/writelatency/arrays', methods=['GET'])
def get_array_write_latency():
    params = request.args.to_dict()
    arr_ids = params["arrayids"]
    time_interval = params["time"]
    return get_write_latency(time_interval, arr_ids, "")


@app.route('/api/v1/writelatency/arrays/volumes', methods=['GET'])
def get_volume_write_latency():
    params = request.args.to_dict()
    arr_ids = params["arrayids"]
    vol_ids = params["volumeids"]
    time_interval = params["time"]
    return get_write_latency(time_interval, arr_ids, vol_ids)


@app.route('/api/v1/perf/all', methods=['GET'])
def get_current_iops():
    try:
        received_telemetry = connection_factory.get_telemetery_url()
        ip = received_telemetry[0]
        port= received_telemetry[1]
        res = get_agg_volumes_perf(ip, port)
        return jsonify(res)
    except Exception as e:
        return make_response('Could not get performance metrics'+str(e), 500)
'''
    ### below code can be used if we get array ids from list_arrays API"
    arrays = dagent.list_arrays()
    arrays = arrays.json()
    if "data" in arrays["result"] and "arrayList" in arrays["result"]["data"]:
        arrays = arrays["result"]["data"]["arrayList"]
        index = []
        for array in arrays:
            index.append(array["index"])
        array_ids = ",".join(map(str,index))
        res = get_agg_volumes_perf(array_ids)
        return jsonify(res)
    else:
        return jsonify({"res": []})
'''


def get_read_bw(time_interval, arr_id, vol_id):
    if time_interval not in time_groups.keys():
        raise InvalidUsage(
            'Use time from 1m,5m,15m,1h,6h,12h,24h,7d,30d',
            status_code=404)
    try:
        res = get_disk_read_bw(time_interval, arr_id, vol_id)
        return jsonify({"res": res["result"]["data"]})
    except Exception as e:
        print(e)
        return jsonify({"res": []})


@app.route('/api/v1/readbw/arrays', methods=['GET'])
def get_array_read_bw():
    params = request.args.to_dict()
    arr_ids = params["arrayids"]
    time_interval = params["time"]
    return get_read_bw(time_interval, arr_ids, "")


@app.route('/api/v1/readbw/arrays/volumes', methods=['GET'])
def get_volume_read_bw():
    params = request.args.to_dict()
    arr_ids = params["arrayids"]
    vol_ids = params["volumeids"]
    time_interval = params["time"]
    return get_read_bw(time_interval, arr_ids, vol_ids)


def get_write_bw(time_interval, arr_id, vol_id):
    if time_interval not in time_groups.keys():
        raise InvalidUsage(
            'Use time from 1m,5m,15m,1h,6h,12h,24h,7d,30d',
            status_code=404)
    try:
        res = get_disk_write_bw(time_interval, arr_id, vol_id)
        return jsonify({"res": res["result"]["data"]})
    except Exception as e:
        print(e)
        return jsonify({"res": []})


@app.route('/api/v1/writebw/arrays', methods=['GET'])
def get_array_write_bw():
    params = request.args.to_dict()
    arr_ids = params["arrayids"]
    time_interval = params["time"]
    return get_write_bw(time_interval, arr_ids, "")


@app.route('/api/v1/writebw/arrays/volumes', methods=['GET'])
def get_volume_write_bw():
    params = request.args.to_dict()
    arr_ids = params["arrayids"]
    vol_ids = params["volumeids"]
    time_interval = params["time"]
    return get_write_bw(time_interval, arr_ids, vol_ids)


"""
def trigger_email(serverip, serverport, emailid):
    print("Inside Trigger")
    if(("@samsung.com" in emailid) == False):
        print("Cannot Send an Email")
        return
    # names, emails = get_contacts('/home/test/EmailList.txt') # read contacts
    #message_template = read_template('/home/test/Message.txt')
    # set up the SMTP server
    s = smtplib.SMTP(serverip, serverport, None, 1)
    # s.starttls()
    #s.login(MY_ADDRESS, PASSWORD)
    # For each contact, send the email:

    msg = MIMEMultipart()       # create a message

    # add in the actual person name to the message template
    #message = message_template.substitute(PERSON_NAME=name.title())
    message = "QoS Parameters: Temperature Threshold Crossed, Memory Utilization Crossed, Drive is going down...MAYDAYMAYDAY"
    # Prints out the message body for our sake

    # setup the parameters of the message
    msg['From'] = "your_email@company_xyz.com"
    msg['To'] = emailid
    msg['Subject'] = "iBOF Emergency Alerts"

    # add in the message body
    msg.attach(MIMEText(message, 'plain'))

    # send the message via the server set up earlier.
    s.send_message(msg)
    del msg

    # Terminate the SMTP session and close the connection
    s.quit()


@app.route('/api/v1.0/test_smtpserver/', methods=['POST'])
def test_smtpserver():

    body_unicode = request.data.decode('utf-8')
    body = json.loads(body_unicode)
    serverip = body['smtpserverip']
    serverport = body['smtpserverport']
    smtpusername = body['smtpusername']
    smtppassword = ''
    smtpfromemail = body['smtpfromemail']
    print(serverip)
    print(serverport)
    if('smtppassword' in body):
        smtppassword = body['smtppassword']
    try:
        s = smtplib.SMTP(serverip, serverport, None, 1)
        s.quit()
        tasks = {}
        if('smtppassword' in body):
            tasks = {
               "set": {
               "enabled": True,
               "host": serverip,
               "port": serverport,
               "from": smtpfromemail,
               "username": smtpusername,
               "password": smtppassword
            }}
        else:
            tasks = {
               "set": {
               "enabled": True,
               "host": serverip,
               "port": serverport,
               "from": smtpfromemail,
               "username": smtpusername,
            }}
        r = requests.post(
        url="http://localhost:9092/kapacitor/v1/config/smtp/",
        data=toJson(tasks))

        # Some kapacitor APIs return code 204 for success
        if(r.status_code != 204 and r.status_code != 200):
            return abort(404)
        return 'SMTP Server is Working'
    except BaseException as e:
        print("exceptttt",e)
        return abort(404)

@app.route('/api/v1.0/delete_smtp_details/', methods=['POST'])
def delete_smtp_details():
    try:
        tasks = {
        "delete": [
            "enabled",
            "host",
            "port",
            "from",
            "username",
            "password"
        ]
        }
        r = requests.post(
            url="http://localhost:9092/kapacitor/v1/config/smtp/",
            data=toJson(tasks))
        if(r.status_code != 204 and r.status_code != 200):
            return abort(404)
        return 'SMTP Configuration Deleted Successfully'
    except BaseException as e:
        print(e)
        return abort(404)

@app.route('/api/v1.0/get_smtp_details/', methods=['GET'])
def get_smtp_details():
    print("in get smtp details")
    try:
        r = requests.get(
        url="http://localhost:9092/kapacitor/v1/config/smtp/")
        data = r.json()
        print("dataaaa",data)
        print("smtp detailsaaaaa",data['options'])
        if(r.status_code != 204 and r.status_code != 200):
            return abort(404)
        elif (data['options']['enabled'] == False):
            return abort(404)
        else:
            smtpserverip = data['options']['host']
            smtpserverport = data['options']['port']
            smtpfromemail = data['options']['from']
            smtpusername = data['options']['username']
            isPasswordSet = data['options']['password']
            return jsonify({"smtpserverip": smtpserverip, "smtpserverport":smtpserverport, "smtpfromemail":smtpfromemail,"smtpusername":smtpusername, "isPasswordSet":isPasswordSet})
    except BaseException as e:
        print(e)
        return abort(404)

@app.route('/api/v1.0/get_email_ids/', methods=['GET'])
def get_email_ids():
    email_list = connection_factory.get_email_list()
    return toJson(email_list)


@app.route('/api/v1.0/get_smtp_server_details/', methods=['GET'])
def get_smtp_server_details():
    return toJson(connection_factory.get_smtp_details())


@app.route('/api/v1.0/update_email/', methods=['POST'])
def update_email():
    body_unicode = request.data.decode('utf-8')
    body = json.loads(body_unicode)

    oldid = body['oldid']
    email = body['email']
    print("in update_email() ", oldid, email)
    result = None
    found = connection_factory.find_email(oldid)
    if not found:
        result =  connection_factory.insert_email(oldid, email)
    else:
        result = connection_factory.update_email_list(oldid, email)
    return result


@app.route('/api/v1.0/delete_emailids/', methods=['POST'])
def delete_emailids():
    body_unicode = request.data.decode('utf-8')
    body = json.loads(body_unicode)
    ids = body['ids']
    result = None
    for email_id in ids:
        result = connection_factory.delete_emailids_list(email_id)
    return result


@app.route('/api/v1.0/send_email/', methods=['POST'])
def send_email():
    body_unicode = request.data.decode('utf-8')
    body = json.loads(body_unicode)
    ids = body['ids']
    serverip = body['smtpserverip']
    serverport = body['smtpserverport']
    for email_id in ids:
        trigger_email(serverip, serverport, email_id)
    return 'Success'


@app.route('/api/v1.0/toggle_email_status/', methods=['POST'])
def toggle_email_status():
    body_unicode = request.data.decode('utf-8')
    body = json.loads(body_unicode)
    email_id = body['emailid']
    status = body['status']
    result = connection_factory.toggle_email_update(status, email_id)
    print("result toggle",result)
    return result
"""


# Get Devices
@app.route('/api/v1/array/<array_name>/info', methods=['GET'])
@token_required
def get_array_info(current_user, array_name):
    array_info = arr_info(array_name)
    array_info = array_info.json()
    return toJson(array_info)


@app.route('/api/v1.0/get_devices/', methods=['GET'])
@token_required
def getDevices(current_user):
    devices = list_devices()
    if(not isinstance(devices, dict)):
        devices = devices.json()
    arrays = dagent.list_arrays()
    arrays = arrays.json()
    if "data" in arrays["result"] and "arrayList" in arrays["result"]["data"]:
        arrays = arrays["result"]["data"]["arrayList"]
    else:
        return toJson(devices)
    if not isinstance(arrays, list):
        return toJson(devices)
    for array in arrays:
        a_info = arr_info(array["name"])
        try:
            if a_info.status_code == 200:
                a_info = a_info.json()
                for device in chain(
                        devices["devices"],
                        devices["metadevices"]):
                    for arr_dev in a_info["result"]["data"]["devicelist"]:
                        if arr_dev["name"] == device["name"]:
                            device["isAvailable"] = False
                            device["arrayName"] = array["name"]
                            if "displayMsg" in device:
                                device["displayMsg"] = device["name"] + \
                                    " (used by " + array["name"] + ")"
                                device["trimmedDisplayMsg"] = device["name"] + \
                                    " (used)"
                            break
        except Exception as e:
            print("Exception in array_info() in /api/v1.0/get_devices/ ", e)
    return toJson(devices)


# Add Spare Disk
@app.route('/api/v1.0/add_spare_device/', methods=['POST'])
@token_required
def addSpareDisk(current_user):
    body_unicode = request.data.decode('utf-8')
    body = json.loads(body_unicode)
    name = body['name']
    arrayname = body.get('array')
    res = dagent.add_spare_disk(name, arrayname)
    return_msg = {}

    if res.status_code == 200:
        res = res.json()
        if res["result"]["status"]["code"] == 0:
            return toJson(res)
    else:
        res = res.json()
        if ("result" in res and "status" in res["result"]):
            return_msg["result"] = res["result"]["status"]
            return_msg["return"] = -1
            return toJson(return_msg)

    res = "unable to add a spare device"
    return make_response(res, 500)

# Remove Spare Disk


@app.route('/api/v1.0/remove_spare_device/', methods=['POST'])
@token_required
def removeSpareDisk(current_user):
    body_unicode = request.data.decode('utf-8')
    body = json.loads(body_unicode)
    name = body['name']
    arrayname = body.get('array')
    return_msg = {}
    res = dagent.remove_spare_disk(name, arrayname)
    if res.status_code == 200:
        res = res.json()
        if res["result"]["status"]["code"] == 0:
            return toJson(res)
    else:
        print("spare error", res.json())
        res = res.json()
        if ("result" in res and "status" in res["result"]):
            return_msg["result"] = res["result"]["status"]
            return_msg["return"] = -1
            return toJson(return_msg)

    res = "unable to remove spare device"
    return make_response(res, 500)


# Get Device Details
@app.route('/api/v1.0/device/smart/<name>', methods=['GET'])
@token_required
def getDeviceDetails(current_user, name):
    device_details = get_disk_details(name)
    try:
        return toJson(device_details.json())
    except BaseException:
        res = "Unable to get SMART info"
        return make_response(res, 500)

# create transport


@app.route('/api/v1/transport/', methods=['POST'])
@token_required
def create_transport(current_user):
    body_unicode = request.data.decode('utf-8')
    body = json.loads(body_unicode)
    transport_type = body.get('transport_type')
    buf_cache_size = body.get('buf_cache_size')
    num_shared_buf = body.get('num_shared_buf')
    try:
        resp = dagent.create_trans(
            transport_type,
            buf_cache_size,
            num_shared_buf)
        if resp is not None:
            resp = resp.json()
            return toJson(resp)
        else:
            return toJson({})
    except Exception as e:
        print("Exception in creating transport " + e)
        return abort(404)

# create subsystem


@app.route('/api/v1/subsystem/', methods=['POST'])
@token_required
def create_subsystem(current_user):
    body_unicode = request.data.decode('utf-8')
    body = json.loads(body_unicode)
    name = body.get('name')
    serial_num = body.get('sn')
    model_num = body.get('mn')
    max_namespaces = body.get('max_namespaces')
    allow_any_host = body.get('allow_any_host')
    try:
        resp = dagent.create_subsystem(
            name,
            serial_num,
            model_num,
            max_namespaces,
            allow_any_host)
        if resp is not None:
            resp = resp.json()
            return toJson(resp)
        else:
            return toJson({})
    except Exception as e:
        print("Exception in creating subsystem " + e)
        return abort(404)

# add listener


@app.route('/api/v1/listener/', methods=['POST'])
@token_required
def add_listener(current_user):
    body_unicode = request.data.decode('utf-8')
    body = json.loads(body_unicode)
    name = body.get('name')
    transport_type = body.get('transport_type')
    target_address = body.get('target_address')
    transport_service_id = body.get('transport_service_id')
    try:
        resp = dagent.add_listener(
            name,
            transport_type,
            target_address,
            transport_service_id)
        if resp is not None:
            resp = resp.json()
            return toJson(resp)
        else:
            return toJson({})
    except Exception as e:
        print("Exception in adding listener " + e)
        return abort(404)

# list subsystem


@app.route('/api/v1/subsystem/', methods=['GET'])
@token_required
def list_subsystem(current_user):
    try:
        resp = dagent.list_subsystem()
        resp = resp.json()
        for subsystem in resp["result"]["data"]["subsystemlist"]:
            if subsystem["subtype"] == "NVMe":
                namespaces = subsystem["namespaces"] if "namespaces" in subsystem else [
                ]
                if len(namespaces) > 0:
                    arrayname = "_".join(
                        namespaces[0]["bdev_name"].split("_")[2:])
                    subsystem["array"] = arrayname
        return toJson(resp)
    except Exception as e:
        print("Exception in list subsystem " + e)
        return abort(404)

# delete susbsystem


@app.route('/api/v1/subsystem/', methods=['DELETE'])
@token_required
def delete_subsystem(current_user):
    body_unicode = request.data.decode('utf-8')
    body = json.loads(body_unicode)
    name = body.get('name')
    try:
        resp = dagent.delete_subsystem(name)
        if resp is not None:
            resp = resp.json()
            return toJson(resp)
        else:
            return toJson({})
    except Exception as e:
        print("Exception in deleting subsystem " + e)
        return abort(404)
# create device


@app.route('/api/v1/device/', methods=['POST'])
@token_required
def create_device(current_user):
    body_unicode = request.data.decode('utf-8')
    body = json.loads(body_unicode)
    name = body.get('name')
    num_blocks = body.get('num_blocks')
    block_size = body.get('block_size')
    dev_type = body.get('dev_type')
    numa = body.get('numa')
    try:
        resp = dagent.create_device(
            name, num_blocks, block_size, dev_type, numa)
        if resp is not None:
            resp = resp.json()
            return toJson(resp)
        else:
            return toJson({})
    except Exception as e:
        print("Exception in creating device " + e)
        return make_response("Error creating Device: " + e, 500)


# auto create array
@app.route('/api/v1/autoarray/', methods=['POST'])
@token_required
def auto_create_array(current_user):
    body_unicode = request.data.decode('utf-8')
    body = json.loads(body_unicode)
    arrayname = body.get('arrayname')
    raidtype = body['raidtype']
    metaDisk = body["metaDisk"]
    num_data = body['num_data']
    num_spare = body['num_spare']
    write_through = body['writeThroughModeEnabled']
    if arrayname is None:
        arrayname = dagent.array_names[0]
    try:
        array_create = dagent.auto_create_array(
            arrayname, raidtype, num_spare, num_data, [{"deviceName": metaDisk}], write_through)
        if array_create is not None:
            array_create = array_create.json()
            return toJson(array_create)
        else:
            return toJson({})
    except Exception as e:
        print("Exception in creating array: " + e)
        return abort(404)

# Create Array


@app.route('/api/v1.0/create_arrays/', methods=['POST'])
@token_required
def create_arrays(current_user):
    body_unicode = request.data.decode('utf-8')
    body = json.loads(body_unicode)
    #_id = body['_id']
    arrayname = body.get('arrayname')
    # print(arrayname)
    raidtype = body['raidtype']
    spareDisks = body['spareDisks']
    # print('spareDisks',spareDisks)
    #writeBufferDisk = body['writeBufferDisk']
    metaDisk = body["metaDisk"]
    storageDisks = body['storageDisks']
    #totalsize = len(storageDisks)
    write_through = body['writeThroughModeEnabled']

    try:
        """a_info = arr_info(arrayname)
        if a_info.status_code == 200:
            a_info = a_info.json()
            if "name" in a_info["result"]["data"] and a_info["result"]["data"]["name"] == arrayname:
                return make_response(arrayname+' already exists', 400)"""
        array_create = create_arr(arrayname, raidtype, spareDisks, storageDisks, [
            {"deviceName": metaDisk}], write_through)
        array_create = array_create.json()
        return toJson(array_create)
    except Exception as e:
        print("Exception in creating array: " + e)
        return abort(404)


@app.route('/api/v1/get_array_config/', methods=['GET'])
@token_required
def get_array_config(current_user):
    return toJson({
        "raidTypes":
        [
            {
                "raidType": "RAID0",
                "minStorageDisks": 2,
                "maxStorageDisks": 32,
                "minSpareDisks": 0,
                "maxSpareDisks": 0,
            },
            {
                "raidType": "RAID5",
                "minStorageDisks": 3,
                "maxStorageDisks": 32,
                "minSpareDisks": 0,
                "maxSpareDisks": 29,
            },
            {
                "raidType": "RAID10",
                "minStorageDisks": 2,
                "maxStorageDisks": 32,
                "minSpareDisks": 0,
                "maxSpareDisks": 29,
            },
            {
                "raidType": "NONE",
                "minStorageDisks": 1,
                "maxStorageDisks": 1,
                "minSpareDisks": 0,
                "maxSpareDisks": 0,
            },
        ],
        "totalDisks": 32,
    })


def get_mod_array(array):
    _array = {}
    _array["RAIDLevel"] = array["result"]["data"]["dataRaid"]
    _array["storagedisks"] = []
    _array["writebufferdisks"] = []
    _array["sparedisks"] = []
    _array["metadiskpath"] = []
    _array["totalsize"] = 0
    _array["usedspace"] = 0
    _array["index"] = array["result"]["data"]["index"]
    for device in array["result"]["data"]["devicelist"]:
        if device["type"] == "DATA":
            _array["storagedisks"].append({"deviceName": device["name"]})
        if device["type"] == "BUFFER":
            _array["metadiskpath"].append({"deviceName": device["name"]})
        if device["type"] == "SPARE":
            _array["sparedisks"].append({"deviceName": device["name"]})
    return _array

# Fetch all arrays


@app.route('/api/v1/get_arrays/', methods=['GET'])
@token_required
def get_arrays(current_user):
    #res = check_arr_exists(dagent.array_names[0])
    #print("result from get array",res)
    arrays = dagent.list_arrays()
    arrays = arrays.json()
    if "data" in arrays["result"] and "arrayList" in arrays["result"]["data"]:
        arrays = arrays["result"]["data"]["arrayList"]
    else:
        return toJson([])
    if not isinstance(arrays, list):
        return toJson([])
    arrays_info = []
    for array in arrays:
        a_info = arr_info(array["name"])
        try:
            if a_info.status_code == 200:
                vol_list = list_volume(array["name"])
                a_info = a_info.json()
                res = a_info
                # convert to format expected by UI
                a_info = get_mod_array(a_info)
                a_info['totalsize'] = int(res["result"]["data"]["capacity"])
                a_info['usedspace'] = int(res["result"]["data"]["used"])
                a_info['volumecount'] = len(vol_list)
                a_info["arrayname"] = res["result"]["data"]["name"]
                a_info["status"] = array["status"]
                a_info["situation"] = res["result"]["data"]["situation"]
                a_info["state"] = res["result"]["data"]["state"]
                a_info["writeThroughEnabled"] = res["result"]["data"]["writeThroughEnabled"]
                a_info["rebuildingprogress"] = res["result"]["data"]["rebuildingProgress"]
                arrays_info.append(a_info)
        except Exception as e:
            print("Exception in /api/v1/get_arrays/ API:", e)
            return toJson([])
    return jsonify(arrays_info)


@app.route('/api/v1/array/mount', methods=['POST'])
def mount_arr():
    try:
        body_unicode = request.data.decode('utf-8')
        body = json.loads(body_unicode)
        write_through = False
        try:
            write_through = body.get("writeThrough")
        except BaseException:
            write_through = False
        mount_array_res = dagent.mount_array(body.get("array"), write_through)
        return toJson(mount_array_res.json())
    except Exception as e:
        print("In exception mount_arr(): ", e)
        return make_response('Could not mount array', 500)


@app.route('/api/v1/array/mount', methods=['DELETE'])
def unmount_arr():
    try:
        body_unicode = request.data.decode('utf-8')
        body = json.loads(body_unicode)
        unmount_array_res = dagent.unmount_array(body.get("array"))
        return toJson(unmount_array_res.json())
    except Exception as e:
        print("In exception unmount_arr(): ", e)
        return make_response('Could not Unmount array', 500)


@app.route('/api/v1/qos', methods=['POST'])
def qos_create_policies():
    try:
        body_unicode = request.data.decode('utf-8')
        body = json.loads(body_unicode)
        #vol_names = body.get("volumes")
        body['vol'] = body.pop('volumes')
        if "maxbw" in body:
            body["maxbw"] = int(body["maxbw"])
        if "minbw" in body:
            body["minbw"] = int(body["minbw"])
        if "maxiops" in body:
            body["maxiops"] = int(body["maxiops"])
        if "miniops" in body:
            body["miniops"] = int(body["miniops"])
        request_body = {
            "param": body
        }
        range_message = "Please enter valid range: \nValid range for IO =  10 - 18446744073709551 KIOPS\nValid range for BW = 10 - 17592186044415 MB/s"
        response = dagent.qos_create_volume_policies(request_body)
        response = response.json()
        if "result" in response and "status" in response["result"] and "code" in response[
                "result"]["status"] and response["result"]["status"]["code"] == 2080:
            if "description" in response["result"]["status"]:
                response["result"]["status"]["description"] += " " + \
                    range_message
        return toJson(response)
    except Exception as e:
        print("In exception qos_create_policies(): ", e)
        return make_response('Could not create volume policies', 500)


@app.route('/api/v1/qos/reset', methods=['POST'])
def qos_reset_policies():
    try:
        body_unicode = request.data.decode('utf-8')
        body = json.loads(body_unicode)
        array_name = body.get("array")
        vol_names = body.get("volumes")
        request_body = {
            "param": {
                "array": array_name,
                "vol": vol_names
            }
        }
        response = dagent.qos_reset_volume_policies(request_body)
        return toJson(response.json())
    except Exception as e:
        print("In exception qos_reset_volume_policies(): ", e)
        return make_response('Could not reset volume policies', 500)


@app.route('/api/v1/qos/policies', methods=['POST'])
def qos_policies():
    try:
        body_unicode = request.data.decode('utf-8')
        body = json.loads(body_unicode)
        array_name = body.get("array")
        vol_names = body.get("volumes")
        request_body = {
            "param": {
                "array": array_name,
                "vol": vol_names
            }
        }
        response = dagent.qos_list_volume_policies(request_body)
        return toJson(response.json())
    except Exception as e:
        print("In exception qos_list_volume_policies(): ", e)
        return make_response('Could not get volume policies', 500)


def validate_email(email):
    regex = "^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$"
    if(re.search(regex, email)):
        return True
    else:
        return False


def validate_username(username):
    regex = "^(?=.{2,15}$)[A-Za-z0-9]+(?:[ _-][A-Za-z0-9]+)*$"
    if(re.search(regex, username)):
        return True
    else:
        return False


def validate_phone_number(phone_number):
    regex = "^\+(?:[0-9] ?){6,14}[0-9]$"
    if(re.search(regex, phone_number)):
        return True
    else:
        return False


@app.route('/api/v1.0/add_new_user/', methods=['POST'])
@token_required
def add_new_user(current_user):
    body_unicode = request.data.decode('utf-8')
    body = json.loads(body_unicode)
    username = body['username']
    password = body['password']
    if not validate_username(username):
        return make_response("Username Should follow the below rules\nAlphanumeric characters only\n2-15 characters\nUnderscore and hyphens and spaces (but not in beginning or end)\nCannot be two underscores, two hypens or two spaces in a row\ne.g. ab, a-b-c, ab-cd, etc\nIncorrect: _abc, abc_, a__b, a--b, etc\n", 400)
    if len(username) < 2 or len(username) > 15:
        return make_response(
            "Username length should be between 2-15 characters", 400)
    if len(password) < 8 or len(password) > 64:
        return make_response(
            "Password length should be between 8-64 characters", 400)
    #hashed_password = generate_password_hash(password, method='sha256')
    role = body['user_role']
    mobilenumber = body['mobilenumber']
    if not validate_phone_number(mobilenumber):
        return make_response("Please provide a valid Phone Number", 400)
    email = body['emailid']
    if not validate_email(email):
        return make_response("Please Enter a Valid Email ID", 400)
    if not connection_factory.check_user_id_exist(username):
        return make_response("User Already Exists", 400)
    if not connection_factory.check_email_exist(email):
        return make_response("Email Already Exists", 400)
    result = connection_factory.add_new_user_in_db(
        username,
        password,
        email,
        mobilenumber,
        role,
        True,
        "Create,Edit,View",
        4,
        True)
    if result:
        return jsonify({"message": "NEW USER CREATED"})
    else:
        message = "Could Not Created User"
        return make_response(message, 400)
# To Do - 1. Check if username exists in DB. If yes, return failure.
# 2. Hash the password using bcrypt library
# 3. Add all the user values in DB


@app.route('/api/v1.0/get_ibofos_time_interval', methods=['GET'])
@token_required
def get_ibofos_time_interval(current_user):
    #_id = current_user["_id"]
    _id = current_user
    timeInterval = connection_factory.get_ibofos_time_interval_from_db(_id)
    if not timeInterval:
        return abort(404)
    else:
        return toJson(timeInterval)


@app.route('/api/v1.0/set_ibofos_time_interval', methods=['POST'])
@token_required
def set_ibofos_time_interval(current_user):
    #_id = current_user["_id"]
    _id = current_user
    body_unicode = request.data.decode('utf-8')
    body = json.loads(body_unicode)
    timeinterval = body['timeinterval']
    timeinterval = int(timeinterval)
    if connection_factory.set_ibofos_time_interval_in_db(_id, timeinterval):
        return jsonify({"message": "Time Interval updated"})
    else:
        return abort(404)


@app.route('/api/v1.0/get_users/', methods=['GET'])
@token_required
def get_users(current_user):
    usersList = connection_factory.get_users_from_db()
    #usersList = [{"_id": "user_b", "password": "123", "privileges": "Create,Edit,View", "role": "Admin", "email": "your_email@company_xyz.com", "phone_number": "+82 999 9999 999", "active": "True"}, {"_id": "user_a", "password": "123", "privileges": "Create,Edit,View", "role": "Admin", "email": "your_email@company_xyz.com", "phone_number": "+82 999 9999 999", "active": "True"}, {"_id": "user_c", "password": "123", "privileges": "Create,Edit,View", "role": "Admin", "email": "user_c@user.com", "phone_number": "+82 555 5555 5555", "active": "True", "ibofostimeinterval": "4", "livedata": "yes"}, {"_id": "admin", "password": "admin", "email": "admin@corp.com", "phone_number": "xxxxxxxxxx", "role": "admin", "active": "True", "privileges": "Create, Read, Edit, Delete", "ibofostimeinterval": 4, "livedata": "True", "_cls": "util.db.model.User"}]
    #print("userList ", usersList)
    #print("userList ", toJson(usersList))
    if not usersList:
        return jsonify({'message': 'no users found'})
    else:
        return toJson(usersList)


"""
@app.route('/api/v1.0/toggle_status/', methods=['POST'])
def toggle_status():
    body_unicode = request.data.decode('utf-8')
    body = json.loads(body_unicode)
    user_id = body['userid']
    status = body['status']
    print(" in app.py toggle_status() ", user_id, status)
    if user_id != "admin":
        if connection_factory.toggle_status_from_db(user_id, status):
            return jsonify({"message": "User status changed"})
        else:
            return jsonify({"message": "User status could not changed"})
    else:
        return jsonify({"message": "User status changed"})
"""


@app.route('/api/v1.0/update_user/', methods=['POST'])
def update_user():
    body_unicode = request.data.decode('utf-8')
    body = json.loads(body_unicode)
    _id = body['_id']
    oldid = body['oldid']
    email = body['email']
    if not validate_email(email):
        return make_response("Please Enter a Valid Email ID", 400)
    phone_number = body['phone_number']
    if not validate_phone_number(phone_number):
        return make_response("Please provide a valid Phone Number", 400)
    if connection_factory.update_user_in_db(_id, email, phone_number, oldid):
        return jsonify({"message": "User updated"})
    else:
        return jsonify({"message": "Could not update user"})


@app.route('/api/v1.0/update_password/', methods=['POST'])
def update_password():
    body_unicode = request.data.decode('utf-8')
    body = json.loads(body_unicode)
    _id = body['userid']
    old_password = body['oldPassword']
    new_password = body['newPassword']
    if len(new_password) < 8 or len(new_password) > 64:
        return make_response(
            "Password length should be between 8-64 characters", 400)
    if old_password == new_password:
        return make_response(
            "New Password cannot be same as old password", 400)
    if connection_factory.update_password_in_db(
            _id, old_password, new_password) == False:
        return abort(404)
    else:
        return jsonify({"message": "Password changed"})


@app.route('/api/v1.0/delete_users/', methods=['POST'])
@token_required
def delete_users(current_user):
    body_unicode = request.data.decode('utf-8')
    body = json.loads(body_unicode)
    ids = body['ids']
    print("ids : ", ids)
    connection_factory.delete_users_in_db(ids)
    return jsonify({"message": "Users deleted"})


@app.route('/api/v1.0/login/', methods=['POST'])
def login():
    body_unicode = request.data.decode('utf-8')
    print("cameeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee in login")
    print(request.authorization)

    body = json.loads(body_unicode)
    username = body['username']
    password = body['password']
    print('username', username, '\n', 'password', password)
    print("re.compile: ", re.compile(username, re.IGNORECASE))
    print("col ")
    received_username = connection_factory.match_username_from_db(
        username, password)
    print("received_username:", received_username)
    if not received_username:
        received_username = connection_factory.match_email_from_db(
            username, password)
    if not received_username:
        print("not username")
        return make_response('Could not verify', 401)
    print('printing the username')
    print("username: ", received_username)
    auth = 'Basic %s' % b64encode(
        bytes(
            username + ':' + password,
            "utf-8")).decode("ascii")
    print("auth:", auth)
    token = jwt.encode({'_id': received_username, 'exp': datetime.datetime.utcnow(
    ) + datetime.timedelta(minutes=1440)}, app.config['SECRET_KEY'])
    print(token)
    return jsonify({'token': token.decode('UTF-8'),
                    'Authorization': auth,
                    'username': received_username})


"""
@app.route('/api/v1.0/bmc_login/', methods=['POST'])
def bmc_login():
    body_unicode = request.data.decode('utf-8')
    #print("came in login")
    # print(request.authorization)

    body = json.loads(body_unicode)
    username = body['username']
    password = body['password']
    print('username', username, '\n', 'password', password)
    #col = db['user']
    # print("col")
    #user = col.find_one({"_id": re.compile(username, re.IGNORECASE), "password":password, "active": True})
    # if not user:
    #    user = col.find_one({"email": re.compile(username, re.IGNORECASE), "password":password, "active": True})
    # if not user:
    # print("not user")
    # return make_response('Could not verify',401)
    #print('printing the user')
    #print (user)
    auth = 'Basic %s' % b64encode(
        bytes(
            username + ':' + password,
            "utf-8")).decode("ascii")
    print(auth)
    #token = jwt.encode({'_id':user['_id'], 'exp':datetime.datetime.utcnow() + datetime.timedelta(minutes=60)},app.config['SECRET_KEY'])
    # print(token)
    validation = BMC_agent.check_bmc_login(auth)
    if(validation):
        return jsonify({'Login': validation, })
    return jsonify({'Login': validation, }), 401
"""


@app.route('/api/v1.0/get_ip_and_mac', methods=['GET'])
def getIpAndMac():
    """
    fetches ip and mac of the system
    :return:
    """
    try:
        ip = get_ip_address()
        mac = ':'.join(re.findall('..', '%012x' % uuid.getnode()))
        host = get_hostname()
        if ip is None and mac == '':
            return make_response('Could not get ip and mac', 500)
        else:
            lastUpdatedTime = datetime.datetime.now().strftime("%a, %d %b %Y %I:%M:%S %p %Z")
            return jsonify({"ip": ip, "mac": mac, "host": host, "timestamp": lastUpdatedTime})
    except BaseException:
        return make_response('Could not get ip and mac', 500)


# POS expects the volume size to be block aligned
def make_block_aligned(size):
    """
    Example:
    size = 8.13 GB
    size = floor( 8.13 * 1000 * 1000 * 1000) =  floor(8130000000) = 8130000000
    floor(8130000000 / (1024 * 1024)) * (1024 * 1024) = 7753 * (1024 * 1024) = 8129609728 → Pass to POS
    """

    size = math.floor(size)
    aligned_size = (math.floor(size / BLOCK_SIZE) * BLOCK_SIZE)
    return aligned_size


@app.route('/api/v1.0/save-volume/', methods=['POST'])
def saveVolume():
    body_unicode = request.data.decode('utf-8')
    body = json.loads(body_unicode)
    # ifOldName=body['old']
    try:
        volume_name = body['name']
        vol_size = float(body['size'])
        minbw = 0
        if 'minbw' in body:
            minbw = body['minbw']
        maxbw = body['maxbw']
        array_name = body.get('array')
        maxiops = int(body['maxiops'])
        miniops = 0
        if 'miniops' in body:
            miniops = body['miniops']
        unit = body['unit'].upper()
        mount_vol = body['mount_vol']
        stop_on_error = body['stop_on_error']
        count = body['count']
        subsystem = body['subsystem']
        suffix = body['suffix']
        max_available_size = body['max_available_size']
        iswalvol = body['iswalvol']
    except Exception as e:
        print("Exception Occured in Save Volume")
        print(e)
        return make_response('Required fields are missing: ' + e, 400)

    if array_name is None:
        array_name = dagent.array_names[0]

    if (vol_size == 0):
        size = int(max_available_size)
    else:
        if unit == "GB":
            size = vol_size * BYTE_FACTOR * BYTE_FACTOR * BYTE_FACTOR
        elif unit == 'TB':
            size = vol_size * BYTE_FACTOR * BYTE_FACTOR * BYTE_FACTOR * BYTE_FACTOR
        elif unit == 'PB':
            size = vol_size * BYTE_FACTOR * BYTE_FACTOR * \
                BYTE_FACTOR * BYTE_FACTOR * BYTE_FACTOR
        else:
            # default case assuming the unit is TB
            size = vol_size * BYTE_FACTOR * BYTE_FACTOR * BYTE_FACTOR * BYTE_FACTOR
    size = make_block_aligned(size)

    create_vol_res = create_volume(
        volume_name,
        array_name,
        int(size),
        int(count),
        int(suffix),
        mount_vol,
        stop_on_error,
        int(maxbw),
        int(maxiops),
        int(minbw),
        int(miniops),
        subsystem,
        iswalvol)

    # print("print save volllll", toJson(create_vol_res.json())
    return toJson(create_vol_res)


"""

@app.route('/api/v1.0/save-volume/', methods=['POST'])
def saveVolume():
    body_unicode = request.data.decode('utf-8')
    body = json.loads(body_unicode)
    print("save volumeeeeeeeeeeeeeeee")
    #ifOldName=body['old']
    print('----------vol body---', body)
    volume_name = body['name']
    vol_size = body['size']
    maxbw = body['maxbw']
    maxiops = body['maxiops']
    description = body['description']
    unit = body['unit']
    arrayname = 'ibofArray'
    mount_vol = body['mount_vol']
    stop_on_error = body['stop_on_error_checkbox']
    max_available_size = body['max_available_size']
    print("vol size",int(vol_size))
    if (int(vol_size) == 0):
        print("size is", int(max_available_size))
        size = int(max_available_size)
    elif unit== "GB":
        size=int(vol_size) * 1024 * 1024 * 1024
    else:
        size=int(vol_size)* 1024 * 1024 * 1024 * 1024
    create_vol_res = create_volume(volume_name, int(size), int(maxbw), int(maxiops))
    #if create_vol_res.status_code != 200:
    return toJson(create_vol_res.json())
    #if ("return" in create_vol_res and create_vol_res["return"] == -1) or create_vol_res["result"]["status"]["code"] != "200000":
    # IP="107.123.123"
    # portno =0
    # subnqn="NA"
    # try:
    #     col = db['volume']
    #     volume = col.find_one({"name": volume_name})
    #     if  not volume:
    #         agr = [{'$group': { '_id':None,'UsedSpace': {'$sum': '$usedspace'},'TotalSize': {'$sum': '$totalsize'}}}]
    #         val = list(db.array.aggregate(agr))
    #         # Arraysize in in pages and each page is 4 kb
    #         if (val[0]['TotalSize']*4*1024 - val[0]['UsedSpace']) < float(size):
    #             return abort(404)
    #         print(size)
    #         db.array.update_one({"_id":arrayname},{"$set":{"usedspace": val[0]['UsedSpace'] + size}})
    #         IP = get_ip_address()
    #         #while(1):
    #         #    IP=generateRandomIPAddress(4)
    #         #    found=col.find_one({"ip": IP})
    #         #    if not found:
    #         #       break;
    #         while(1):
    #             portno = randint(1000, 9999)
    #             found = col.find_one({"port": portno})
    #             if not found:
    #                 break
    #         #while(1):
    #         #    subnqn=''.join(random.choice(string.ascii_uppercase + string.digits) for _ in range(10))
    #         #    found = col.find_one({"subnqn": subnqn})
    #         #    if not found:
    #         #        break;
    #         c = db['counters'].find_one({"_id": "volume"})
    #         c = c['count']
    #         col.insert_one({'name':volume_name ,'size':vol_size, 'unit':unit,'usedspace':0,'description':description, 'ip':IP ,'port': portno,'subnqn':subnqn,'status':"Active",'accesscount':0,'vol_id':c})
    #         db.counters.update_one({"_id": "volume"}, {"$inc":{"count": 1}})
    #     else:
    #         return abort(404)
    #     return toJson({'return': 0, 'result': "Volume Created Successfully"})
    # except:
    #     print("Operation could not be performed by the db error")
    #     return abort(404)

"""

'''
@app.route('/api/v1.0/update-volume/', methods=['PUT'])
@token_required
def updateVolume(current_user):
    body_unicode = request.data.decode('utf-8')
    body = json.loads(body_unicode)
    update_vol_res = update_volume(body)
    return toJson(update_vol_res.json())
'''


@app.route('/api/v1.0/volumes/<volume_name>', methods=['PATCH'])
@token_required
def renameVolume(current_user, volume_name):
    try:
        body_unicode = request.data.decode('utf-8')
        body = json.loads(body_unicode)
        if volume_name != body["param"]["name"]:
            return make_response('URL param not matching with body param', 500)
    except BaseException:
        return make_response('Invalid Parameters received', 500)
    rename_vol_res = rename_volume(body)
    return toJson(rename_vol_res.json())


@app.route('/api/v1.0/volume/mount', methods=['POST'])
def mountVolume():
    try:
        body_unicode = request.data.decode('utf-8')
        body = json.loads(body_unicode)
        mount_vol_res = mount_volume(
            body["name"],
            body.get("array"),
            body.get("subnqn"))
        return toJson(mount_vol_res.json())
    except Exception as e:
        print("In exception mountVolume(): ", e)
        return make_response('Could not mount Volume', 500)


@app.route('/api/v1.0/volume/mount', methods=['DELETE'])
def unmountVolume():
    try:
        body_unicode = request.data.decode('utf-8')
        body = json.loads(body_unicode)
        unmount_vol_res = unmount_volume(body["name"], body.get("array"))
        return toJson(unmount_vol_res.json())
    except Exception as e:
        print("In exception unmountVolume(): ", e)
        return make_response('Could not Unmount Volume', 500)


@app.route('/api/v1.0/ibofos/mount', methods=['POST'])
def mountPOS():
    try:
        mount_ibofos_res = dagent.mount_ibofos()
        return toJson(mount_ibofos_res.json())
    except Exception as e:
        print("In exception mountPOS(): ", e)
        return make_response('Could not mount POS', 500)


@app.route('/api/v1.0/ibofos/mount', methods=['DELETE'])
@token_required
def unmountPOS(current_user):
    try:
        unmount_ibofos_res = dagent.unmount_ibofos()
        return toJson(unmount_ibofos_res.json())
    except Exception as e:
        print("In exception unmountPOS(): ", e)
        return make_response('Could not unmount POS', 500)


@app.route('/api/v1.0/delete_volumes/<name>', methods=['POST'])
def deleteVolumes(name):
    body_unicode = request.data.decode('utf-8')
    body = json.loads(body_unicode)
    vols = list(body['volumes'])
    total = len(vols)
    passed = 0
    fail = 0
    description = ""
    print("dellll vol arrayname is", name)
    # arrays=db.array.find()
    # arrayname=arrays[0]['_id']
    # print(arrayname)
    arrayname = name
    deleted_vols = []
    return_msg = {"result": "Success"}
    for vol in vols:
        del_vol_cmd = delete_volume(vol, arrayname)
        if del_vol_cmd.status_code == 200:
            passed = passed + 1
            deleted_vols.append(vol)
            return_msg["result"] = del_vol_cmd.json(
            )["result"]["status"]["description"]

        elif del_vol_cmd.status_code == 500:
            fail = fail + 1
            return_msg["result"] = del_vol_cmd.json()["error"]
            description += vol["name"] + ": "
            description += del_vol_cmd.json()["error"]
            description += "\n"

        else:
            fail = fail + 1
            del_vol_cmd = del_vol_cmd.json()
            if ("result" in del_vol_cmd and "status" in del_vol_cmd["result"]):
                description += vol["name"] + ":"
                description += del_vol_cmd["result"]["status"]["description"]
                description += ", Error code: "
                description += str(del_vol_cmd["result"]["status"]["code"])
                description += "\n"

                return_msg["result"] = del_vol_cmd["result"]["status"]
                return_msg["vol_name"] = vol["name"]
    # try:
    #    col = db['volume']
    #    col.delete_many({'name':{'$in':deleted_vols}})
    #    usedspace=0
    #    found = db.volume.count()
    #    if not found:
    #        usedspace=0
    #    else:
    #        agr = [{'$group': {'_id': None, 'UsedSpace': {'$sum': '$size'}}}]
    #        val = list(db.volume.aggregate(agr))
    #        usedspace=val[0]['UsedSpace']
    #    print(usedspace)
    #   db.array.update_one({"_id": arrayname}, {"$set": {"usedspace": usedspace}})
    # except pymongo.error.OperationFailure as e:
    #    print("Operation could not be performed by the db error", e)
    if fail == 0:
        return_msg["return"] = 0
    else:
        return_msg["return"] = -1

    return_msg["total"] = total
    return_msg["passed"] = passed
    return_msg["failed"] = fail
    return_msg["description"] = description
    return toJson(return_msg)


@app.route('/api/v1.0/max_volume_count/', methods=['GET'])
def getMaxVolCount():
    print("Get max vol count")
    res = get_max_vol_count()
    max_vol_count = 256

    if(res.status_code == 200):
        res = res.json()
        max_vol_count = res["result"]["data"]["count"]
    return jsonify(max_vol_count)


@app.route('/api/v1/<array_name>/get_volumes/', methods=['GET'])
def getVolumes(array_name):
    volumes = list_volume(array_name)
    for vol in volumes:
        if "maxiops" in vol:
            vol["maxiops"] = int(vol["maxiops"])
    return toJson(volumes)


@app.route('/api/v1/get_all_volumes/', methods=['GET'])
def get_all_volumes():
    volumes_list = {}
    try:
        arrays = dagent.list_arrays()
        arrays = arrays.json()
        if "data" in arrays["result"] and "arrayList" in arrays["result"]["data"]:
            arrays = arrays["result"]["data"]["arrayList"]
        else:
            return toJson([])
        for array in arrays:
            volumes = list_volume(array["name"])
            volumes_list[array["name"]] = volumes
    except Exception as e:
        print("Exception in /api/v1/get_all_volumes/ ", e)
    return toJson(volumes_list)


@app.route('/api/v1/pos/property', methods=['GET'])
def get_pos_property():
    try:
        pos_property = dagent.get_pos_property()
        pos_property = pos_property.json()
        return toJson(pos_property)
    except Exception as e:
        print(e)
        return make_response('Could not get POS Property', 500)


@app.route('/api/v1/pos/property', methods=['POST'])
def set_pos_property():
    try:
        body_unicode = request.data.decode('utf-8')
        body = json.loads(body_unicode)
        pos_property = body["property"]
        pos_property_response = dagent.set_pos_property(pos_property)
        pos_property_response = pos_property_response.json()
        return toJson(pos_property_response)
    except Exception as e:
        return make_response('Could not set POS Property '+str(e), 500)

# Telemetry Related APIS
@app.route('/api/v1/configure', methods=['GET'])
def get_telemetry_config():
    try:
        received_telemetry = connection_factory.get_telemetery_url()
        if received_telemetry is None or len(received_telemetry) == 0:
            return jsonify({'isConfigured': False})
        return jsonify({
            'isConfigured': True,
            'ip': received_telemetry[0],
            'port': received_telemetry[1]
            })
    except Exception as e:
        return make_response('Could not get Telemetry URL'+str(e), 500)

@app.route('/api/v1/configure', methods=['POST'])
def set_telemetry_config():
    try:
        body_unicode = request.data.decode('utf-8')
        body = json.loads(body_unicode)
        ip = body["telemetryIP"]
        port = body["telemetryPort"]
        response = set_telemetry_configuration(ip, port)
        if response.response[0].decode('UTF-8') == "success":
            connection_factory.update_telemetry_url(ip,port)
        return response
    except Exception as e:
        return make_response('Could not configure Telemetry URL'+str(e), 500)

@app.route('/api/v1/checktelemetry', methods=['GET'])
def check_telemetry():
    try:
        received_telemetry = connection_factory.get_telemetery_url()
        if received_telemetry is None or len(received_telemetry) == 0:
            return make_response('Telemetry URL is not configured', 500)
        ip = received_telemetry[0]
        port= received_telemetry[1]
        res = check_telemetry_endpoint(ip, port)
        return res
    except Exception as e:
        return make_response('Prometheus DB is not running'+str(e), 500)

'''
<pre>{&apos;alertName&apos;: &apos;sdfsdf&apos;, &apos;alertType&apos;: &apos;&apos;, &apos;alertCondition&apos;: &apos;Greater Than&apos;, &apos;alertRange&apos;: &apos;7&apos;, &apos;description&apos;: &apos;sdfgsee eee&apos;}
</pre>
'''

'''
@app.route('/api/v1.0/add_alert/', methods=['POST'])
@token_required
def addAlert(current_user):
    """
    create an alert through kapacitor and make the entry in database.
    :param current_user:
    :return:
    """
    body_unicode = request.data.decode('utf-8')
    body = json.loads(body_unicode)
    #print(body)
    alertName = body['alertName']
    alertCondition = body['alertCondition']
    alertRange = body['alertRange']
    description = body['description']
    alertCluster = body['alertCluster']

    alertType = ""
    alertSubCluster = ""

    alertField = alertFields[alertCluster]
    result = connection_factory.add_alert_in_db(
                alertName,
                alertCluster,
                alertSubCluster,
                alertType,
                alertCondition,
                alertField,
                description,
                alertRange,
                True)
    return result

@app.route('/api/v1.0/get_alerts/', methods=['GET'])
def get_alerts():
    """
    fetch the alerts from the DB
    :return:
    """
    alerts = connection_factory.get_alerts_from_db()
    print("alerts :", alerts)
    if not alerts:
        return jsonify({'message': 'no alerts found'})
    else:
        return toJson(alerts)


@app.route('/api/v1.0/alert', methods=['POST'])
def alertHandler():
    #print("alert handler called")
    #body_unicode = request.data.decode('utf-8')
    #body = json.loads(body_unicode)
    allAlerts = get_alerts()
    # print(list(allAlerts.get_points()))
    return jsonify(list(allAlerts.get_points()))


@app.route('/api/v1.0/delete_alerts/', methods=['POST'])
@token_required
def delete_alerts(current_user):
    """
    Deletes the given alert from kapacitor and the DB
    :param current_user:
    :return: response status
    """
    body_unicode = request.data.decode('utf-8')
    body = json.loads(body_unicode)
    ids = body['ids']
    for alert_id in ids:
        result = connection_factory.delete_alerts_in_db(alert_id)
    return result


@app.route('/api/v1.0/update_alerts/', methods=['POST'])
@token_required
def update_alerts(current_user):
    """
    Api endpoint to update an existing alert.
    :param current_user:
    :return: http response with status code
    """
    body_unicode = request.data.decode('utf-8')
    body = json.loads(body_unicode)
    alertName = body['alertName']
    alertCondition = body['alertCondition']
    alertRange = body['alertRange']
    description = body['description']
    alertCluster = body['alertCluster']

    alertType = ""
    alertSubCluster = ""

    alertField = alertFields[alertCluster]
    result = connection_factory.update_alerts_in_db(
                alertName,
                alertCluster,
                alertSubCluster,
                alertType,
                alertCondition,
                alertField,
                description,
                alertRange)
    return result


@app.route('/api/v1.0/toggle_alert_status/', methods=['POST'])
@token_required
def toggle_alert_status(current_user):
    """
    Toggle the state of a given alert
    :param current_user: token for maintaining the session
    :return: status wether the alert is successfully changed or not
    """
    body_unicode = request.data.decode('utf-8')
    body = json.loads(body_unicode)
    print(body)
    alertName = body['alertName']
    status = body['status']
    result = connection_factory.toggle_alert_status_in_db(alertName, status)
    return result

@app.route('/api/v1.0/download_logs', methods=['GET'])
def downloadLogs():
    print(request.args)
    startdate = request.args.get('start_date')
    enddate = request.args.get('end_date')
    return download_logs(startdate, enddate)


@app.route('/api/v1.0/set_live_logs/', methods=['POST'])
@token_required
def set_live_logs(current_user):
    """
    update the live log flag in db
    :return:
    """
    print("set_live_logs palak")
    try:
        body_unicode = request.data.decode('utf-8')
        body = json.loads(body_unicode)
        print(
            " in set_live_logs",
            body,
            body['liveLogs'],
            type(
                body['liveLogs']))
        connection_factory.set_live_logs_in_db(body['liveLogs'], current_user)
    except Exception as e:
        print(e)
    return "Success"


@app.route('/api/v1.0/get_live_logs/', methods=['GET'])
@token_required
def get_live_logs(current_user):
    """
    update the live log flag in db
    :return:
    """
    print("get_live_logs palak", current_user)
    livedata = "yes"
    try:
        result = connection_factory.get_live_logs_from_db(current_user)
        print("result ", result, type(result))
        if result:
            livedata = "yes"
        else:
            livedata = "no"
    except Exception as e:
        print(e)
    print("returning", livedata)
    return jsonify(livedata)
'''


@app.errorhandler(InvalidUsage)
def handle_invalid_usage(error):
    response = jsonify(error.to_dict())
    response.status_code = error.status_code
    return response


# BMC Rest APIs
'''
@app.route('/api/v1.0/get_server_info/', methods=['GET'])
@token_required
def getServerInfo(current_user):

    try:
        return BMC_agent.get_server_info()
    except BaseException:
        return make_response('Could not get server info', 500)


@app.route('/api/v1.0/get_power_info/', methods=['GET'])
@token_required
def getPowerInfo(current_user):

    try:
        return BMC_agent.get_power_info()
    except BaseException:
        return make_response('Could not get power info', 500)


@app.route('/api/v1.0/get_chassis_front_info/', methods=['GET'])
@token_required
def getChassisFrontInfo(current_user):

    try:
        return BMC_agent.get_chassis_front_info()
    except BaseException:
        return make_response('Could not chassis front info', 500)

"""
@app.route('/api/v1.0/get_chassis_rear_info/', methods=['GET'])
@token_required
def getChassisRearInfo(current_user):

    try:
        return BMC_agent.get_chassis_rear_info()
    except BaseException:
        return make_response('Could not get chassis rear info', 500)
"""


@app.route('/api/v1.0/power_on_system/', methods=['POST'])
@token_required
def powerOnSystem(current_user):  # Power On

    try:
        return BMC_agent.power_on_system()
    except BaseException:
        return make_response('Could not power on system', 500)


@app.route('/api/v1.0/reboot_system/', methods=['POST'])
@token_required
def rebootSystem(current_user):
    try:
        return BMC_agent.reboot_system()  # os.system("reboot");
    except BaseException:
        return make_response('Could not reboot system', 500)


@app.route('/api/v1.0/shutdown_system/', methods=['POST'])
@token_required
def shutdownSystem(current_user):

    try:
        return BMC_agent.shutdown_system()  # os.system("shutdown now -h");
    except BaseException:
        return make_response('Could not shutdown system', 500)

@app.route('/api/v1.0/force_shutdown_system/', methods=['POST'])
@token_required
def forceShutdownSystem(current_user):

    try:
        return BMC_agent.force_shutdown_system()
    except BaseException:
        return make_response('Could not shutdown system', 500)


@app.route('/api/v1.0/get_power_sensor_info/', methods=['GET'])
@token_required
def getPowerSensorInfo(current_user):

    try:
        return BMC_agent.get_power_sensor_info()
    except BaseException:
        return make_response('Could not get power sensor info', 500)

@app.route('/api/v1.0/get_fan_sensor_info/', methods=['GET'])
@token_required
def getFanSensorInfo(current_user):
    try:
        return BMC_agent.get_fan_sensor_info()
    except BaseException:
        return make_response('Could not get fan sensor info', 500)

@app.route('/api/v1.0/get_temperature_sensor_info/', methods=['GET'])
@token_required
def getTemperatureSensorInfo(current_user):
    try:
        return BMC_agent.get_temperature_sensor_info()
    except BaseException:
        return make_response('Could not get temperature sensor info', 500)

@app.route('/api/v1.0/get_software_health/', methods=['GET'])
@token_required
def getSoftwareHealth(current_user):
    try:
        service = [{"mgmt_service": "OK", "data_service": "OK"}]
        return jsonify({"software_health": service})
    except BaseException:
        return make_response('Could not get software health', 500)

@app.route('/api/v1.0/get_hardware_health/', methods=['GET'])
@token_required
def getHardwareHealth(current_user):
    try:
        cpu, power, fans, memory, temperature = "OK", "OK", "OK", "OK", "OK"
        res = BMC_agent.get_power_sensor_info()
        res = res.data
        res = json.loads(res)
        power_arr = res['power_sensor_info']
        for i in range(0, len(power_arr)):
            if power_arr[i]['Status']['Health'] != "OK":
                power = "NOT_OK"
                break
            else:
                power = "OK"
        res = BMC_agent.get_fan_sensor_info()
        res = res.data
        res = json.loads(res)
        fan_arr = res['fan_sensor_info']
        for i in range(0, len(fan_arr)):
            if fan_arr[i]['Status']['Health'] != "OK":
                fans = "NOT_OK"
                break
            else:
                fans = "OK"

        res = BMC_agent.get_temperature_sensor_info()
        res = res.data
        res = json.loads(res)
        temp_arr = res['temperature_sensor_info']
        for i in range(0, len(temp_arr)):
            if temp_arr[i]['Status']['Health'] != "OK":
                temperature = "NOT_OK"
                break
            else:
                temperature = "OK"
        hardware_health = [{"cpu": cpu,
                            "memory": memory,
                            "power": power,
                            "fans": fans,
                            "temperature": temperature}]
        return jsonify({"hardware_health": hardware_health})
    except BaseException:
        return make_response('Could not get hardware health', 500)


@app.route('/api/v1.0/get_network_health/', methods=['GET'])
@token_required
def getNetworkHealth(current_user):
    try:
        network = [{"mgmt_network": "OK",
                    "client_network": "OK",
                    "storage_fabric": "OK"}]
        return jsonify({"network_health": network})
    except BaseException:
        return make_response('Could not get network health', 500)



@app.route('/api/v1.0/get_input_power_variation/<time>', methods=['GET'])
def fetch_power_variation(time):
    # print(time)
    if time not in time_groups.keys():
        raise InvalidUsage(
            'Use time from 1m,5m,15m,1h,6h,12h,24h,7d,30d',
            status_code=404)
    res = get_input_power_variation(time)
    return jsonify(res)



@app.route('/api/v1.0/get_power_summary/', methods=['GET'])
@token_required
def getPowerSummary(current_user):
    try:
        return BMC_agent.getPowerSummary()
    except BaseException:
        return make_response('Could not get network health', 500)


@app.route('/api/v1.0/set_current_power_mode/', methods=['POST'])
@token_required
def setCurrentPowerMode(current_user):
    try:
        body_unicode = request.data.decode('utf-8')
        body = json.loads(body_unicode)
        # print(body)
        new_power_mode = body['newpowermode']
        return BMC_agent.setCurrentPowerMode(new_power_mode)
        # BMC_agent.shutdown_system()
    except BaseException:
        return make_response('Could not update the value', 500)


@app.route('/api/v1.0/update_current_power_state/', methods=['POST'])
@token_required
def changeCurrentPowerState(current_user):
    try:
        body_unicode = request.data.decode('utf-8')
        body = json.loads(body_unicode)
        drive_index = body['@odata.id']
        drive_index = drive_index[-1]
        power_state = body['PowerState']
        return BMC_agent.changeCurrentPowerState(
            int(drive_index), int(power_state))
    except BaseException:
        return make_response('Could not update the value', 500)
# @app.before_first_request
def activate_bmc_thread():
    while True:
        with app.app_context():
            if Run_Only_Once.OnlyOnceFlag:
                BMC_agent.get_basic_redfish_url()
                Run_Only_Once.OnlyOnceFlag = False
            BMC_agent.fetch_bmc_logs()
            # BMC_agent.get_power_sensor_info();
            time.sleep(5)


def activate_power_thread():
    while True:
        with app.app_context():
            BMC_agent.get_power_sensor_info()
            time.sleep(180)


# app.host='localhost'
#app.debug = True
# app.use_reloader=False
# app.port=5010
# app.Threaded=True
'''

socketIo = SocketIO(app, cors_allowed_origins="*", async_mode='eventlet')

# authenticate the client for websocket connection


def check_authentication():
    token = None
    if 'x-access-token' in request.args:
        token = request.args['x-access-token']
    if not token:
        return False
    try:
        data = jwt.decode(token, app.config['SECRET_KEY'])
        current_user = connection_factory.get_current_user(data['_id'])
        print("current user", current_user)
        print("authorized user connected")
    except BaseException:
        return False
    return True


@socketIo.on("volume", namespace='/create')
def handleMsg(msg):
    res = check_authentication()
    if res:
        print("args", request.args)
    else:
        disconnect()
        raise ConnectionRefusedError('unauthorized user!')


# connect handler for websocket
@socketIo.on("connect", namespace='/create_vol')
def handleCreateVolConn():
    token = None
    if 'x-access-token' in request.args:
        token = request.args['x-access-token']
    if not token:
        raise ConnectionRefusedError('unauthorized')
    res = check_authentication()
    if not res:
        raise ConnectionRefusedError('unauthorized user!')

# callback function for multi-volume creation response from DAgent


@app.route('/api/v1.0/multi_vol_response/', methods=['POST'])
def createMultiVolumeCallback():
    body_unicode = request.data.decode('utf-8')
    body = json.loads(body_unicode)
    description = ""
    errorResponses = []
    errorCode = 0
    respList = body['MultiVolArray']
    for entry in respList:
        if entry["result"]["status"]["code"] != 0:
            description += entry["result"]["status"]["description"]
            if len(description) > 0:
                description += "\n"
        if "errorInfo" in entry["result"]["status"]:
            if len(errorResponses) == 0:
                if "errorCode" in entry["result"]["status"]["errorInfo"] and entry["result"]["status"]["errorInfo"]["errorCode"] == 1:
                    errorCode = 1
                    errorResponses = entry["result"]["status"]["errorInfo"]["errorResponses"]
    qosResp = respList[len(respList)-1]
    if qosResp["result"]["status"]["code"] != 0:
        errorCode = 1
    passed = body['Pass']
    total_count = body['TotalCount']
    socketIo.emit('create_multi_volume',
                  {'pass': passed,
                   'total_count': total_count,
                   'description': description,'errorCode':errorCode,'errorResponses':errorResponses},
                  namespace='/create_vol')
    return "ok", 200


@socketIo.on_error_default
def default_error_handler(e):
    print('Websocket error occured:')
    print(e)


def getHealthStatus():
    try:
        response = {}
        statuses = []
        res = get_user_cpu_usage("1m")
        cpu_result = process_response(
            res, "cpu", "cpuUsagePercent", "cpu-status", "CPU UTIL")
        if len(cpu_result) > 0:
            statuses.append(cpu_result)
        res = get_user_memory_usage("15m")
        mem_result = process_response(
            res,
            "memory",
            "memoryUsagePercent",
            "mem-status",
            "MEMORY UTIL")
        if len(mem_result) > 0:
            statuses.append(mem_result)
        health_list = []
        for i in range(0, len(statuses)):
            health_list.append(statuses[i]["isHealthy"])
        health_result = get_overall_health(health_list)
        response["isHealthy"] = health_result
        response["statuses"] = statuses
        return response
    except Exception as e:
        print("In Health Status Exception: ", e)
        return make_response('Could not get health status', 500)


@app.route('/api/v1.0/cleanup/', methods=['GET'])
@token_required
def do_cleanup(current_user):
    try:
        os.system("./scripts/cleanup.sh > /dev/null 2>&1")
        return jsonify({"response": "Success"})
    except Exception as e:
        print("In do_cleanup() Exception: ", e)
        return make_response('Could not cleanup', 500)

# connect handler for websocket


@socketIo.on("connect", namespace='/health_status')
def handleHealthStatusConn():
    global old_result
    token = None
    if 'x-access-token' in request.args:
        token = request.args['x-access-token']
    if not token:
        raise ConnectionRefusedError('unauthorized')
    res = check_authentication()
    if not res:
        raise ConnectionRefusedError('unauthorized user!')
    else:
        old_result = ""


@socketIo.on('disconnect', namespace='/health_status')
def disconnectHealthStatusSocket():
    print("Health status websocket client disconnected!")


def compare_result(prev_result, curr_result):
    if prev_result == "":
        return True
    else:
        try:
            if abs(
                float(
                    prev_result["statuses"][0]["value"]) -
                float(
                    curr_result["statuses"][0]["value"])) > threshold:
                return True
            elif abs(float(prev_result["statuses"][1]["value"]) - float(curr_result["statuses"][1]["value"])) > threshold:
                return True
            elif abs(float(prev_result["statuses"][2]["value"]) - float(curr_result["statuses"][2]["value"])) > threshold:
                return True
            return False
        except BaseException:
            return False


def send_health_status_data():
    global old_result
    try:
        while True:
            result = getHealthStatus()
            if compare_result(old_result, result):
                old_result = result
                socketIo.emit(
                    'health_status_response',
                    result,
                    namespace='/health_status')
                #print("!!!! >>>>>>>>>>>>>>>>>>>>>>>>>>>>>   Data sent <<<<<<<<<<<<<<<<<<<<<<<<<< !!!!", threading.currentThread().ident)
                time.sleep(2)
    except Exception as e:
        print("Exception in health status polling: ", e)


if __name__ == '__main__':
    #bmc_thread = threading.Thread(target=activate_bmc_thread)
    # bmc_thread.start()
    #power_thread = threading.Thread(target=activate_power_thread)
    # power_thread.start()

    health_status_thread = threading.Thread(
        target=send_health_status_data, args=())
    health_status_thread.start()

    socketIo.run(
        app,
        host='0.0.0.0',
        debug=False,
        use_reloader=False,
        port=5000)
