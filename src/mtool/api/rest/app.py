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
#from rest.rest_api.logmanager.logmanager import download_logs
from util.com.common import get_ip_address, get_hostname
from rest.rest_api.telemetry.telemetry import set_telemetry_configuration, reset_telemetry_configuration, check_telemetry_endpoint
#from rest.rest_api.logmanager.logmanager import get_bmc_logs
#from rest.rest_api.logmanager.logmanager import get_ibofos_logs
#from rest.rest_api.rebuildStatus.rebuildStatus import get_rebuilding_status
from rest.rest_api.perf.system_perf import get_agg_volumes_perf, get_telemetry_properties, set_telemetry_properties, get_all_hardware_health
from flask_socketio import SocketIO, disconnect
from flask import Flask, abort, request, jsonify, make_response
#import rest.rest_api.dagent.bmc as BMC_agent
import rest.rest_api.dagent.ibofos as dagent
from time import strftime
#from dateutil import parser
import datetime
import jwt
import uuid
from base64 import b64encode
import re
import traceback
import json
import os
import eventlet
from rest.blueprints.home import home_bp
from rest.blueprints.pos import pos_bp
from rest.blueprints.device import device_bp
from rest.blueprints.array import array_bp
from rest.blueprints.storage import storage_bp
from rest.blueprints.disk import disk_bp
from rest.blueprints.volume import volume_bp
from rest.db import connection_factory
from rest.auth import token_required
from rest.log import logger
from util.com.common import toJson

eventlet.monkey_patch()

# Serve React App
app = Flask(__name__, static_folder='./public')

app.register_blueprint(swordfish_api)
app.config['SECRET_KEY'] = 'ibofalltheway'
app.config['MONGODB_URL'] = 'mongodb://localhost:27017/ibof'


threshold = 0.9
old_result = ""

alertFields = {'cpu': "usage_user", 'mem': 'used_percent'}

app.register_blueprint(home_bp)
app.register_blueprint(pos_bp)
app.register_blueprint(device_bp)
app.register_blueprint(array_bp)
app.register_blueprint(storage_bp)
app.register_blueprint(disk_bp)
app.register_blueprint(volume_bp)

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

@app.route('/api/v1/telemetry', methods=['POST'])
@token_required
def start_telemetry(current_user):
    response = dagent.start_telemetry()
    return toJson(response.json())

@app.route('/api/v1/telemetry', methods=['DELETE'])
@token_required
def stop_telemetry(current_user):
    response = dagent.stop_telemetry()
    return toJson(response.json())

@app.route('/api/v1/telemetry/properties', methods=['POST'])
@token_required
def set_telemetry_props(current_user):
    body_unicode = request.data.decode('utf-8')
    body = json.loads(body_unicode)
    response = set_telemetry_properties(body)
    return toJson(response.json())

@app.route('/api/v1/telemetry/properties', methods=['GET'])
@token_required
def get_telemetry_props(current_user):
    return toJson(get_telemetry_properties())

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
    max_namespaces = body.get('maxNamespaces')
    allow_any_host = body.get('allowAnyHost')
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
            if subsystem["subtype"] == "NVMe" and "namespaces" in subsystem:
                namespaces = subsystem["namespaces"]
                if len(namespaces) > 0:
                    arrayname = "_".join(
                        namespaces[0]["bdevName"].split("_")[2:])
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



def validate_email(email):
    regex = "(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|\"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*\")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])"
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

@app.route('/api/v1/configure', methods=['DELETE'])
def reset_telemetry_config():
    try:
        connection_factory.delete_telemetery_url()
        return reset_telemetry_configuration()
    except Exception as e:
        return make_response('Could not reset Telemetry URL'+str(e), 500)

@app.route('/api/v1/checktelemetry', methods=['GET'])
@token_required
def check_telemetry(current_user):
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

@app.route('/api/v1/perf/all', methods=['GET'])
def get_current_iops():
    try:
        received_telemetry = connection_factory.get_telemetery_url()
        if received_telemetry is None or len(received_telemetry) == 0:
            return make_response('Telemetry URL is not configured', 500)
        ip = received_telemetry[0]
        port= received_telemetry[1]
        res = get_agg_volumes_perf(ip, port)
        return jsonify(res)
    except Exception as e:
        return make_response('Could not get performance metrics'+str(e), 500)

@app.route('/api/v1/get_hardware_health', methods=['GET'])
@token_required
def get_hardware_health(current_user):
    try:
        received_telemetry = connection_factory.get_telemetery_url()
        if received_telemetry is None or len(received_telemetry) == 0:
            return make_response('Telemetry URL is not configured', 500)
        ip = received_telemetry[0]
        port= received_telemetry[1]
        res = get_all_hardware_health(ip, port)
        return jsonify(res)
    except Exception as e:
        return make_response('Could not get hardware health metrics'+str(e), 500)

@app.errorhandler(InvalidUsage)
def handle_invalid_usage(error):
    response = jsonify(error.to_dict())
    response.status_code = error.status_code
    return response

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
            if entry["result"]["status"]["description"] == "":
                description += entry["result"]["status"]["posDescription"]
            else:
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


if __name__ == '__main__':
    #bmc_thread = threading.Thread(target=activate_bmc_thread)
    # bmc_thread.start()
    #power_thread = threading.Thread(target=activate_power_thread)
    # power_thread.start()

    socketIo.run(
        app,
        host='0.0.0.0',
        debug=False,
        use_reloader=False,
        port=5000)
