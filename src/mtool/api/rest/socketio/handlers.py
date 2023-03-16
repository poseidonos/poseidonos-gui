from flask import request
from flask_socketio import disconnect
from rest.socketio.socketio_init import socketIo
from rest.auth import check_authentication

old_result = ""

@socketIo.on("volume", namespace='/create')
def handleMsg(msg):
    res = check_authentication()
    if res:
        print("args", request.args)
    else:
        disconnect()
        raise ConnectionRefusedError('unauthorized user!')

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

@socketIo.on_error_default
def default_error_handler(e):
    print('Websocket error occured:')
    print(e)

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