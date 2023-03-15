
from flask_socketio import SocketIO

socketIo = SocketIO();

def init_socketio(app):
    socketIo.init_app(app, cors_allowed_origins="*", async_mode='eventlet')
    return socketIo