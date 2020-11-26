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
@NAME : app.py
@AUTHORS: Jay Hitesh Sanghavi
@Version : 1.0 *
@REVISION HISTORY
[03/06/2019] [Jay] : Prototyping..........////////////////////
*/
'''


#!/usr/bin/python
from rest.swordfish.handler import swordfish_api
from rest.rest_api.alerts.system_alerts import get_alert_categories_from_influxdb, create_kapacitor_alert, update_in_kapacitor, delete_alert_from_kapacitor, toggle_in_kapacitor
from rest.exceptions import InvalidUsage
from util.com.time_groups import time_groups
from rest.rest_api.volume.volume import create_volume, delete_volume, list_volume, rename_volume, update_volume, get_max_vol_count, mount_volume, unmount_volume
from rest.rest_api.logmanager.logmanager import download_logs
from rest.rest_api.array.array import create_arr, list_arr, get_arr_status, check_arr_exists
from util.com.common import get_ip_address, get_hostname
from rest.rest_api.system.system import fetch_system_state
from rest.rest_api.device.device import list_devices, get_disk_details
from rest.rest_api.health_status.health_status import process_response, get_overall_health, set_max_latency
#from rest.rest_api.logmanager.logmanager import get_bmc_logs
#from rest.rest_api.logmanager.logmanager import get_ibofos_logs
from rest.rest_api.rebuildStatus.rebuildStatus import get_rebuilding_status
from rest.rest_api.perf.system_perf import get_user_cpu_usage, get_user_memory_usage, get_latency_usage, get_diskio_mbps, get_total_processes,  \
    get_total_disk_used_percent, get_disk_read_iops, get_disk_write_iops, get_disk_read_bw, get_disk_write_bw, get_disk_latency, \
    get_disk_current_perf, get_input_power_variation 
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
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
#from dateutil import parser
import smtplib
import datetime
import jwt
from werkzeug.security import generate_password_hash
import uuid
from base64 import b64encode
import re
from functools import wraps
from bson import json_util
import traceback
import requests
import json
import threading
import os
import eventlet
import math
eventlet.monkey_patch()

BLOCK_SIZE = 1024 * 1024


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

alertFields = {'cpu' : "usage_user", 'mem' : 'used_percent'}

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
            print("data in token_required(): ", data)
            current_user = connection_factory.get_current_user(data['_id'])
            print("current_user in token_required() ", current_user)
        except BaseException:
            return jsonify({'message': 'Token is invalid'}), 401
        return f(current_user, *args, **kwargs)
    return decorated

@app.route('/api/v1.0/version', methods=['GET'])
def get_version():
    package_json_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "../UI/package.json"))
    with open(package_json_path) as f:
        data = json.load(f)
        return toJson({"version": data["version"]})



@app.route('/api/v1.0/logger', methods=['POST'])
def log_collect():
    body_unicode = request.data.decode('utf-8')
    body=json.loads(body_unicode)
    try:
        log_to_influx(body)
    except Exception as e:
        print(e)
    return "Log written sucessfully"


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
    if(IBOF_OS_Running.Is_Ibof_Os_Running_Flag):
        return jsonify({"response": "POS is Already Running...", "code": -1})
    res = dagent.start_ibofos()

    if res.status_code == 200:
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
    if(IBOF_OS_Running.Is_Ibof_Os_Running_Flag == False):
        return jsonify({"response": "POS has already stopped...", "code": -1})
    res = dagent.stop_ibofos()

    if res.status_code == 200:
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
def is_ibofos_running(current_user):
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
    response = get_rebuilding_status()
    print("RESPONSE", response)
    if(response != "error"):
        res = list(response.get_points())
        # print(res)
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
    lastRunningTime = ""
    try:
        #col = db['iBOFOS_Timestamp']
        response = fetch_system_state()
        response = response.json()
        if 'lastSuccessTime' in response and response['lastSuccessTime'] != 0:
            lastRunningTime = datetime.datetime.fromtimestamp(
                response['lastSuccessTime']).strftime("%a, %d %b %Y %I:%M:%S %p %Z")
        if('result' in response and 'status' in response['result'] and 'code' in response['result']['status'] and response['result']['status']['code'] == 0):
            IBOF_OS_Running.Is_Ibof_Os_Running_Flag = True
        else:
            IBOF_OS_Running.Is_Ibof_Os_Running_Flag = False
    except BaseException:
        return toJson({"RESULT": response,
                       "lastRunningTime": lastRunningTime,
                       "timestamp": timestamp,
                       "code": code,
                       "level": level,
                       "value": value})
    return toJson({"RESULT": response,
                   "lastRunningTime": lastRunningTime,
                   "timestamp": timestamp,
                   "code": code,
                   "level": level,
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
"""

"""
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
"""

@app.route('/api/v1.0/get_alert_types/', methods=['GET'])
@token_required
def get_alert_categories(current_user):
    #To get the alert subcategories, uncomment the following line
    #alertCategories = get_alert_categories_new()   

    alertCategories = get_alert_categories_from_influxdb() 
    return jsonify({'alert_types': alertCategories})
"""
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


@app.route('/api/v1.0/disk_write_mbps/<time_interval>/<level>',
           methods=['GET'])
def get_user_disk_write_mbps(time_interval, level):
    if time_interval not in time_groups.keys():
        raise InvalidUsage(
            'Use time from 1m,5m,15m,1h,6h,12h,24h,7d,30d',
            status_code=404)
    res = get_diskio_mbps(time_interval, level)
    val = list(res.get_points())
    # print(val)
    return jsonify(val)


@app.route('/api/v1.0/total_processes/<time_interval>', methods=['GET'])
def get_user_total_processes(time_interval):
    if time_interval not in time_groups.keys():
        raise InvalidUsage(
            'Use time from 1m,5m,15m,1h,6h,12h,24h,7d,30d',
            status_code=404)
    res = get_total_processes(time_interval)
    val = list(res.get_points())
    return jsonify(val)


@app.route('/api/v1.0/disk_used_percent/<time_interval>/<level>',
           methods=['GET'])
def get_user_total_disk_used_percent(time_interval, level):
    if time_interval not in time_groups.keys():
        raise InvalidUsage(
            'Use time from 1m,5m,15m,1h,6h,12h,24h,7d,30d',
            status_code=404)
    res = get_total_disk_used_percent(time_interval, level)
    val = list(res.get_points())
    return jsonify(val)


@app.route('/api/v1.0/iops_read/<time_interval>/<level>', methods=['GET'])
def get_read_iops(time_interval, level):
    if time_interval not in time_groups.keys():
        raise InvalidUsage(
            'Use time from 1m,5m,15m,1h,6h,12h,24h,7d,30d',
            status_code=404)
    try:
        res = get_disk_read_iops(time_interval, level)
        return jsonify({"res": res["result"]["data"]})
    except Exception as e:
        print(e)
        return jsonify({"res": []})


@app.route('/api/v1.0/iops_write/<time_interval>/<level>', methods=['GET'])
def get_write_iops(time_interval, level):
    if time_interval not in time_groups.keys():
        raise InvalidUsage(
            'Use time from 1m,5m,15m,1h,6h,12h,24h,7d,30d',
            status_code=404)
    try:
        res = get_disk_write_iops(time_interval, level)
        return jsonify({"res": res["result"]["data"]})
    except Exception as e:
        print(e)
        return jsonify({"res": []})


@app.route('/api/v1.0/latency/<time_interval>/<level>', methods=['GET'])
def get_latency(time_interval, level):
    if time_interval not in time_groups.keys():
        raise InvalidUsage(
            'Use time from 1m,5m,15m,1h,6h,12h,24h,7d,30d',
            status_code=404)
    try:
        res = get_disk_latency(time_interval, level)
        return jsonify({"res": res["result"]["data"]})
    except Exception as e:
        print(e)
        return jsonify({"res": []})


@app.route('/api/v1.0/perf/all', methods=['GET'])
def get_current_iops():
    res = get_disk_current_perf()
    return jsonify(res)


@app.route('/api/v1.0/bw_read/<time_interval>/<level>', methods=['GET'])
def get_read_bw(time_interval, level):
    if time_interval not in time_groups.keys():
        raise InvalidUsage(
            'Use time from 1m,5m,15m,1h,6h,12h,24h,7d,30d',
            status_code=404)
    try:
        res = get_disk_read_bw(time_interval, level)
        return jsonify({"res": res["result"]["data"]})
    except Exception as e:
        print(e)
        return jsonify({"res": []})


@app.route('/api/v1.0/bw_write/<time_interval>/<level>', methods=['GET'])
def get_write_bw(time_interval, level):
    if time_interval not in time_groups.keys():
        raise InvalidUsage(
            'Use time from 1m,5m,15m,1h,6h,12h,24h,7d,30d',
            status_code=404)
    try:
        res = get_disk_write_bw(time_interval, level)
        return jsonify({"res": res["result"]["data"]})
    except Exception as e:
        print(e)
        return jsonify({"res": []})


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
    msg['From'] = "iBOF@samsung.com"
    msg['To'] = emailid
    msg['Subject'] = "iBOF Emergency Alerts"

    # add in the message body
    msg.attach(MIMEText(message, 'plain'))

    # send the message via the server set up earlier.
    s.send_message(msg)
    del msg

    # Terminate the SMTP session and close the connection
    s.quit()
"""

@app.route('/api/v1.0/test_smtpserver/', methods=['POST'])
def test_smtpserver():

    body_unicode = request.data.decode('utf-8')
    body = json.loads(body_unicode)
    serverip = body['smtpserverip']
    serverport = body['smtpserverport']
    smtpusername = body['smtpusername']
    smtppassword = body['smtppassword']
    smtpfromemail = body['smtpfromemail']
    print(serverip)
    print(serverport)
    try:
        s = smtplib.SMTP(serverip, serverport, None, 1)
        s.quit()
        tasks = {
           "set": {
               "enabled": True,
               "host": serverip,
               "port": serverport,
               "from": smtpfromemail,
               "username": smtpusername,
               "password": smtppassword
        }
      }
        r = requests.post(
        url="http://localhost:9092/kapacitor/v1/config/smtp/",
        data=toJson(tasks))
        if(r.status_code != 204 and r.status_code != 200):
            return abort(404)
        return 'SMTP Server is Working'
    except:
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
    except:
       return abort(404)

@app.route('/api/v1.0/get_smtp_details/', methods=['GET'])
def get_smtp_details():
    try:
        r = requests.get(
        url="http://localhost:9092/kapacitor/v1/config/smtp/")
        data = r.json() 
        if(r.status_code != 204 and r.status_code != 200):
            return abort(404)
        else:
            return jsonify({"smtpserverip": data['options']['host'], "smtpserverport":data['options']['port']})
    except:
        return abort(404)

@app.route('/api/v1.0/get_email_ids/', methods=['GET'])
def get_email_ids():
    email_list = connection_factory.get_email_list()
    return toJson(email_list)
 
"""
@app.route('/api/v1.0/get_smtp_server_details/', methods=['GET'])
def get_smtp_server_details():
    return toJson(connection_factory.get_smtp_details())
"""

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

"""
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
"""

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
    if(status):
        Update_KapacitorList(None, email_id)
    else:
        Delete_MultipleID_From_KapacitorList(email_id, True)
    return 'Updated'
    """

# Get Devices


@app.route('/api/v1.0/get_devices/', methods=['GET'])
@token_required
def getDevices(current_user):
    devices = list_devices()

    if(isinstance(devices, dict)):
        return toJson(devices)

    devices = devices.json()
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
    totalsize = len(storageDisks)

    if totalsize < 3:
        return abort(404)
    if arrayname is None:
        arrayname = dagent.array_names[0]

    print('storageDisks: ', storageDisks)
    print('metaDisk: ', metaDisk)

    # check if array exists
    found = False
    res = check_arr_exists(arrayname)
    #print("res from get array",res)

    if res:
        found = True

    if not found:
        print("going in create array")
        array_create = create_arr(arrayname, raidtype, spareDisks, storageDisks, [
                                  {"deviceName": metaDisk}])
        array_create = array_create.json()
        #   col.insert_one({ "_id": arrayname,"RAIDLevel": RAIDLevel,"storagedisks":storageDisks,"sparedisks":spareDisks,"writebufferdisks":writeBufferDisk,"metadiskpath":metaDisk,"totalsize":arraySize,"usedspace":0})
        # connection_factory.update_counters_in_db()
        return toJson(array_create)
    else:
        print('came in else of found')
        return abort(404)


def get_mod_array(array):
    _array = {}
    _array["arrayname"] = dagent.array_names[0]
    _array["RAIDLevel"] = "5"
    _array["storagedisks"] = []
    _array["writebufferdisks"] = []
    _array["sparedisks"] = []
    _array["metadiskpath"] = []
    _array["totalsize"] = 0
    _array["usedspace"] = 0
    for device in array["result"]["data"]["devicelist"]:
        if device["type"] == "DATA":
            _array["storagedisks"].append({"deviceName": device["name"]})
        if device["type"] == "BUFFER":
            _array["metadiskpath"].append({"deviceName": device["name"]})
        if device["type"] == "SPARE":
            _array["sparedisks"].append({"deviceName": device["name"]})
    return _array

# Fetch all arrays


@app.route('/api/v1.0/get_arrays/', methods=['GET'])
@token_required
def get_arrays(current_user):
    res = check_arr_exists(dagent.array_names[0])
    #print("result from get array",res)

    array_list = list_arr()

    try:
        if array_list.status_code == 200:
            array = array_list.json()
            res = array
            # convert to format expected by UI
            array = get_mod_array(array)
            array['totalsize'] = int(res["info"]["capacity"])
            array['usedspace'] = int(res["info"]["used"])
            return jsonify([array])

        return toJson([])
    except BaseException:
        return toJson([])



@app.route('/api/v1.0/add_new_user/', methods=['POST'])
@token_required
def add_new_user(current_user):
    body_unicode = request.data.decode('utf-8')
    body = json.loads(body_unicode)
    username = body['username']
    password = body['password']
    hashed_password = generate_password_hash(password, method='sha256')
    role = body['user_role']
    mobilenumber = body['mobilenumber']
    email = body['emailid']
    print('username', username, '\n', 'password', hashed_password)
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
        message = "User Already Exists"
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
    print(" in get_users()", connection_factory)
    usersList = connection_factory.get_users_from_db()
    #usersList = [{"_id": "user_b", "password": "123", "privileges": "Create,Edit,View", "role": "Admin", "email": "user@samsung.com", "phone_number": "+82 999 9999 999", "active": "True"}, {"_id": "user_a", "password": "123", "privileges": "Create,Edit,View", "role": "Admin", "email": "user@samsung.com", "phone_number": "+82 999 9999 999", "active": "True"}, {"_id": "user_c", "password": "123", "privileges": "Create,Edit,View", "role": "Admin", "email": "user_c@user.com", "phone_number": "+82 555 5555 5555", "active": "True", "ibofostimeinterval": "4", "livedata": "yes"}, {"_id": "admin", "password": "admin", "email": "admin@corp.com", "phone_number": "xxxxxxxxxx", "role": "admin", "active": "True", "privileges": "Create, Read, Edit, Delete", "ibofostimeinterval": 4, "livedata": "True", "_cls": "util.db.model.User"}]
    #print("userList ", usersList)
    #print("userList ", toJson(usersList))
    if not usersList:
        return jsonify({'message': 'no users found'})
    else:
        print(" inelse .. ")
        return toJson(usersList)


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


@app.route('/api/v1.0/update_user/', methods=['POST'])
def update_user():
    body_unicode = request.data.decode('utf-8')
    body = json.loads(body_unicode)
    _id = body['_id']
    oldid = body['oldid']
    email = body['email']
    phone_number = body['phone_number']
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
    ) + datetime.timedelta(minutes=60)}, app.config['SECRET_KEY'])
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
    print("herepp")
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
            return jsonify({"ip": ip, "mac": mac, "host": host})
    except BaseException:
        return make_response('Could not get ip and mac', 500)


# POS expects the volume size to be block aligned
def make_block_aligned(size):
    """
    Example:
    size = 8.13 GB
    size = floor( 8.13 * 1024 * 1024 * 1024) =  floor(8729521029.12) = 8729521029
    floor(8729521029 / (1024 * 1024)) * (1024 * 1024) = 8325* (1024 * 1024) = 8729395200 → Pass to POS
    """

    size = math.floor(size)
    aligned_size = (math.floor(size / BLOCK_SIZE) * BLOCK_SIZE)
    return aligned_size


@app.route('/api/v1.0/save-volume/', methods=['POST'])
def saveVolume():
    body_unicode = request.data.decode('utf-8')
    body = json.loads(body_unicode)
    print("save volume")
    # ifOldName=body['old']
    print('----------body---', body)
    volume_name = body['name']
    vol_size = float(body['size'])
    maxbw = body['maxbw']
    array_name = body.get('array')
    maxiops = body['maxiops']
    unit = body['unit'].upper()
    mount_vol = body['mount_vol']
    stop_on_error = body['stop_on_error']
    count = body['count']
    suffix = body['suffix']
    max_available_size = body['max_available_size']

    if array_name is None:
        array_name = dagent.array_names[0]

    if (vol_size == 0):
        size = int(max_available_size)
    else:
        if unit == "GB":
            size = vol_size * 1024 * 1024 * 1024
        elif unit == 'TB':
            size = vol_size * 1024 * 1024 * 1024 * 1024
        elif unit == 'PB':
            size = vol_size * 1024 * 1024 * 1024 * 1024 * 1024
        else:
            # default case assuming the unit is TB
            size = vol_size * 1024 * 1024 * 1024 * 1024
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
        int(maxiops))

    # print("print save volllll", toJson(create_vol_res.json())
    return toJson(create_vol_res.json())


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


@app.route('/api/v1.0/update-volume/', methods=['PUT'])
@token_required
def updateVolume(current_user):
    body_unicode = request.data.decode('utf-8')
    body = json.loads(body_unicode)
    update_vol_res = update_volume(body)
    return toJson(update_vol_res.json())


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
        mount_vol_res = mount_volume(body["name"], body.get("array"))
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
            description += vol + ": "
            description += del_vol_cmd.json()["error"]
            description += "\n"

        else:
            fail = fail + 1
            del_vol_cmd = del_vol_cmd.json()
            if ("result" in del_vol_cmd and "status" in del_vol_cmd["result"]):
                description += vol + ":"
                description += del_vol_cmd["result"]["status"]["description"]
                description += ", Error code: "
                description += str(del_vol_cmd["result"]["status"]["code"])
                description += "\n"

                return_msg["result"] = del_vol_cmd["result"]["status"]
                return_msg["vol_name"] = vol
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


@app.route('/api/v1.0/get_volumes/', methods=['GET'])
def getVolumes():
    print('came here in get vols')
    # col = db['volume']
    # arrays=db.array.find()
    # if not arrays:
    #    return jsonify([])
    # arrayname=arrays[0]['_id']
    #volumes = col.find()
    volumes = list_volume()
    # if not volumes:
    #     return jsonify({'message': 'no volumes found'})
    ip = get_ip_address()
    for vol in volumes:
        #     db_vol = col.find_one({'name': vol['name']})
        #     if db_vol:
        #         vol['ip'] = db_vol['ip']
        #         vol['port'] = db_vol['port']
        #         vol['subnqn'] = 'NA'
        #         vol['description'] = db_vol['description']
        #         vol['status'] = db_vol['status']
        #         vol['size'] = db_vol['size']
        #         vol['unit'] = db_vol['unit']
        #         vol['vol_id'] = db_vol['vol_id']
        #         vol['usedspace'] = 'NA'
        #     else:
        vol['ip'] = ip
        vol['port'] = 'NA'
        vol['subnqn'] = 'NA'
        vol['description'] = ''
        vol['unit'] = 'GB'
        vol['size'] = float(vol['total']) / (1024 * 1024 * 1024)
        vol['usedspace'] = (float(vol['total']) - float(vol['remain'])) / \
            (1024 * 1024 * 1024)
    # print(vols)
    return toJson(volumes)


'''
<pre>{&apos;alertName&apos;: &apos;sdfsdf&apos;, &apos;alertType&apos;: &apos;&apos;, &apos;alertCondition&apos;: &apos;Greater Than&apos;, &apos;alertRange&apos;: &apos;7&apos;, &apos;description&apos;: &apos;sdfgsee eee&apos;}
</pre>
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

'''
@app.route('/api/v1.0/alert', methods=['POST'])
def alertHandler():
    #print("alert handler called")
    #body_unicode = request.data.decode('utf-8')
    #body = json.loads(body_unicode)
    allAlerts = get_alerts()
    # print(list(allAlerts.get_points()))
    return jsonify(list(allAlerts.get_points()))
'''

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


@app.errorhandler(InvalidUsage)
def handle_invalid_usage(error):
    response = jsonify(error.to_dict())
    response.status_code = error.status_code
    return response


# BMC Rest APIs
"""
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

@app.route('/api/v1.0/get_chassis_rear_info/', methods=['GET'])
@token_required
def getChassisRearInfo(current_user):

    try:
        return BMC_agent.get_chassis_rear_info()
    except BaseException:
        return make_response('Could not get chassis rear info', 500)



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
"""

# app.host='localhost'
#app.debug = True
# app.use_reloader=False
# app.port=5010
# app.Threaded=True


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

    for entry in body['MultiVolArray']:
        if entry["result"]["status"]["code"] != 0:
            description += entry["result"]["status"]["description"]
            description += "\n"

    passed = body['Pass']
    total_count = body['TotalCount']
    socketIo.emit('create_multi_volume',
                  {'pass': passed,
                   'total_count': total_count,
                   'description': description},
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
        cpu_result = process_response(res, "cpu", "cpuUsagePercent", "cpu-status","CPU UTILIZATION")
        if len(cpu_result) > 0:
            statuses.append(cpu_result)
        res = get_user_memory_usage("15m")
        mem_result = process_response(res, "memory", "memoryUsagePercent", "mem-status","MEMORY UTILIZATION")
        if len(mem_result) > 0:
            statuses.append(mem_result)
        res = get_latency_usage("15m")
        set_max_latency(res, "latency")
        res = get_latency_usage("")
        latency_result = process_response(res, "latency", "latency", "lat-status","LATENCY")
        if len(latency_result) > 0:
            statuses.append(latency_result)
        health_list = []
        for i in range(0,len(statuses)):
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
def disconnect():
    print("Health status websocket client disconnected!")
def compare_result(prev_result,curr_result):
    if prev_result == "":
        return True
    else:
        try:
            if abs(float(prev_result["statuses"][0]["value"]) - float(curr_result["statuses"][0]["value"])) > threshold :
                return True
            elif abs(float(prev_result["statuses"][1]["value"]) - float(curr_result["statuses"][1]["value"])) > threshold :
                return True
            elif abs(float(prev_result["statuses"][2]["value"]) - float(curr_result["statuses"][2]["value"])) > threshold :
                return True
            return False
        except Exception as e:
            print("In health status comparision exception: ",e)
            return False

def send_health_status_data():
    global old_result
    try:
        while True:
            result = getHealthStatus()
            if compare_result(old_result,result):
                old_result = result
                socketIo.emit('health_status_response', result, namespace='/health_status')
                #print("!!!! >>>>>>>>>>>>>>>>>>>>>>>>>>>>>   Data sent <<<<<<<<<<<<<<<<<<<<<<<<<< !!!!", threading.currentThread().ident)
            time.sleep(2)
    except Exception as e:
        print("Exception in health status polling: ",e)



if __name__ == '__main__':
    #bmc_thread = threading.Thread(target=activate_bmc_thread)
    #bmc_thread.start()
    #power_thread = threading.Thread(target=activate_power_thread)
    #power_thread.start()

    #app.run(host='0.0.0.0', debug=True,use_reloader=False, port=5010, threaded=True)
    health_status_thread = threading.Thread(target=send_health_status_data, args=())
    health_status_thread.start()

    socketIo.run(
        app,
        host='0.0.0.0',
        debug=False,
        use_reloader=False,
        port=5000)
