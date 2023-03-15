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
#from rest.rest_api.logmanager.logmanager import get_bmc_logs
#from rest.rest_api.logmanager.logmanager import get_ibofos_logs
#from rest.rest_api.rebuildStatus.rebuildStatus import get_rebuilding_status
from rest.rest_api.perf.system_perf import get_agg_volumes_perf, get_all_hardware_health
from flask import Flask, abort, request, jsonify, make_response
#import rest.rest_api.dagent.bmc as BMC_agent
import rest.rest_api.dagent.ibofos as dagent
from time import strftime
#from dateutil import parser
import datetime
import jwt
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
from rest.blueprints.telemetry import telemetry_bp
from rest.blueprints.subsystem import subsystem_bp
from rest.blueprints.user import user_bp
from rest.db import connection_factory
from rest.auth import token_required
from rest.log import logger
from rest.socketio.socketio_init import init_socketio, socketIo
from util.com.common import toJson

eventlet.monkey_patch()

# Serve React App
app = Flask(__name__, static_folder='./public')

init_socketio(app)

old_result = ""

app.config['SECRET_KEY'] = 'ibofalltheway'
app.config['MONGODB_URL'] = 'mongodb://localhost:27017/ibof'

app.register_blueprint(swordfish_api)
app.register_blueprint(home_bp)
app.register_blueprint(pos_bp)
app.register_blueprint(device_bp)
app.register_blueprint(array_bp)
app.register_blueprint(storage_bp)
app.register_blueprint(disk_bp)
app.register_blueprint(volume_bp)
app.register_blueprint(telemetry_bp)
app.register_blueprint(subsystem_bp)
app.register_blueprint(user_bp)

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

@app.errorhandler(InvalidUsage)
def handle_invalid_usage(error):
    response = jsonify(error.to_dict())
    response.status_code = error.status_code
    return response

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

# Get POS-GUI Version
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
            logger.info(body)
        except Exception as e:
            print(e)
        return "Log written sucessfully"
    return make_response("Received null log value", 200)

@app.route('/api/v1.0/cleanup/', methods=['GET'])
@token_required
def do_cleanup(current_user):
    try:
        os.system("./scripts/cleanup.sh > /dev/null 2>&1")
        return jsonify({"response": "Success"})
    except Exception as e:
        print("In do_cleanup() Exception: ", e)
        return make_response('Could not cleanup', 500)

if __name__ == '__main__':
    socketIo.run(
        app,
        host='0.0.0.0',
        debug=False,
        use_reloader=False,
        port=5000)
