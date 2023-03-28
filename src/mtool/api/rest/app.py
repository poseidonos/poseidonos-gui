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
from rest.exceptions import InvalidUsage
from flask import Flask, request, jsonify
from time import strftime
import traceback
import eventlet
from rest.blueprints.array import array_bp
from rest.blueprints.auth import auth_bp
from rest.blueprints.device import device_bp
from rest.blueprints.disk import disk_bp
from rest.blueprints.hardware import hardware_bp
from rest.blueprints.home import home_bp
from rest.blueprints.log import log_bp
from rest.blueprints.performance import performance_bp
from rest.blueprints.pos import pos_bp
from rest.blueprints.storage import storage_bp
from rest.blueprints.subsystem import subsystem_bp
from rest.blueprints.telemetry import telemetry_bp
from rest.blueprints.transport import transport_bp
from rest.blueprints.user import user_bp
from rest.blueprints.volume import volume_bp
from rest.log import logger
from rest.socketio.socketio_init import init_socketio, socketIo
from rest.swordfish.handler import swordfish_api

eventlet.monkey_patch()

# Serve React App
app = Flask(__name__, static_folder='./public')

init_socketio(app)

app.config['SECRET_KEY'] = 'ibofalltheway'

app.register_blueprint(swordfish_api)
app.register_blueprint(array_bp)
app.register_blueprint(auth_bp)
app.register_blueprint(device_bp)
app.register_blueprint(disk_bp)
app.register_blueprint(hardware_bp)
app.register_blueprint(home_bp)
app.register_blueprint(log_bp)
app.register_blueprint(performance_bp)
app.register_blueprint(pos_bp)
app.register_blueprint(storage_bp)
app.register_blueprint(subsystem_bp)
app.register_blueprint(telemetry_bp)
app.register_blueprint(transport_bp)
app.register_blueprint(user_bp)
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

@app.errorhandler(InvalidUsage)
def handle_invalid_usage(error):
    response = jsonify(error.to_dict())
    response.status_code = error.status_code
    return response

if __name__ == '__main__':
    socketIo.run(
        app,
        host='0.0.0.0',
        debug=False,
        use_reloader=False,
        port=5005)