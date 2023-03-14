import jwt
from functools import wraps
from flask import request, jsonify, current_app
from rest.db import connection_factory

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
            data = jwt.decode(token, current_app.config['SECRET_KEY'])
            #print("data in token_required(): ", data)
            current_user = connection_factory.get_current_user(data['_id'])
            #print("current_user in token_required() ", current_user)
        except BaseException:
            return jsonify({'message': 'Token is invalid'}), 401
        return f(current_user, *args, **kwargs)
    return decorated