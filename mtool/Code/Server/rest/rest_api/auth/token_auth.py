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
@NAME : token_auth.py
@AUTHORS: Jay Hitesh Sanghavi
@Version : 1.0 *
@REVISION HISTORY
[03/06/2019] [Jay] : Prototyping..........////////////////////
*/
'''

import copy
from flask import Flask, abort, request, jsonify, g, url_for
from flask.ext.restful import Resource
from passlib.apps import custom_app_context as pwd_context
from functools import wraps
from itsdangerous import (
    TimedJSONWebSignatureSerializer as TimedSerializer,
    JSONWebSignatureSerializer as Serializer,
    BadSignature,
    SignatureExpired)

ACCESS_TOKEN_SECRET_KEY = 'the quick brown fox jumps over the lazy dog'
REFRESH_TOKEN_SECRET_KEY = 'the quick brown fox jumps over the lazy dog, the quick brown fox jumps over the lazy dog'

ACCESS_TOKEN_EXPIRE_SECONDS = 10000000

ACCESS_TOKEN_SERIALIZER = TimedSerializer(
    ACCESS_TOKEN_SECRET_KEY,
    expires_in=ACCESS_TOKEN_EXPIRE_SECONDS)
REFRESH_TOKEN_SERIALIZER = Serializer(REFRESH_TOKEN_SECRET_KEY)

AUTHENTICATION_ERRCODE = {
    'INVALID_USERNAME_OR_PASSWORD':
        {'code': 4001, 'message': "Invalid username or password"},
    'INVALID_REFRESH_TOKEN':
        {'code': 4002, 'message': "Invalid refresh token"},
    'AUTHENTICATION_REQUIRED':
        {'code': 4003, 'message': "Authentication required"},
    'INVALID_AUTHORIAZTION_HEADER':
        {'code': 4004, 'message': "Invalid authoriaztion header"},
    'AUTHENTICATION_TOKEN_EXPIRED':
        {'code': 4005, 'message': "Authorization token expired"},
    'INVALID_AUTHENTICATION_TOKEN':
        {'code': 4006, 'message': "Invalid authoriaztion token"},
    'USER_DOES_NOT_EXIST':
        {'code': 4007, 'message': "User does not exist"},
}


def gen_access_token(username):
    payload = {'username': username}
    access_token = ACCESS_TOKEN_SERIALIZER.dumps(payload)

    return access_token


def gen_refresh_token(username):
    payload = {'username': username}
    refresh_token = REFRESH_TOKEN_SERIALIZER.dumps(payload)

    return refresh_token


def verify_token(token, token_type='access_token'):
    username = None
    serializer = None

    if 'access_token' == token_type:
        serializer = ACCESS_TOKEN_SERIALIZER
    elif 'refresh_token' == token_type:
        serializer = REFRESH_TOKEN_SERIALIZER

    if not serializer:
        return user

    payload = serializer.loads(token)

    user_obj = UserDoc.objects(user_name=payload['username']).first()
    if user_obj:
        username = user_obj.user_name

    return username


def verify_password(username, password):
    # first try to authenticate by token
    valid = None

    if username:
        # try to authenticate with username/password
        user_obj = UserDoc.objects(user_name=username).first()
        if user_obj:
            username = user_obj.user_name

            valid = False
            password_hash = user_obj.pass_word
            if pwd_context.verify(password, password_hash):
                valid = True

    return valid


def auth_token_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'OPTIONS' != request.method:
            auth_header = request.headers.get('Authorization')
            if not auth_header:
                result = copy.deepcopy(
                    AUTHENTICATION_ERRCODE['AUTHENTICATION_REQUIRED'])
                return result, 401

            auth_header_content = auth_header.split()

            if 2 != len(
                    auth_header_content) or 'Token' != auth_header_content[0]:
                result = copy.deepcopy(
                    AUTHENTICATION_ERRCODE['INVALID_AUTHORIAZTION_HEADER'])
                return result, 401

            token = auth_header_content[1]

            user = None
            try:
                user = verify_token(token, 'access_token')
            except SignatureExpired:
                result = copy.deepcopy(
                    AUTHENTICATION_ERRCODE['AUTHENTICATION_TOKEN_EXPIRED'])
                return result, 401
            except BadSignature:
                result = copy.deepcopy(
                    AUTHENTICATION_ERRCODE['INVALID_AUTHENTICATION_TOKEN'])
                return result, 401
            if not user:
                result = copy.deepcopy(
                    AUTHENTICATION_ERRCODE['INVALID_AUTHENTICATION_TOKEN'])
                return result, 401

        return f(*args, **kwargs)

    return decorated_function


class AuthUser(Resource):
    def post(self):
        username = request.form['username']
        password = request.form['password']
        if username is None or password is None:
            # missing arguments
            abort(400)

        user_obj = UserDoc.objects(user_name=username).first()
        if user_obj:
            # existing user
            abort(400)

        password_hash = pwd_context.encrypt(password)

        UserDoc(user_name=username, pass_word=password_hash).save()
        result = copy.deepcopy(ERRCODE['SUCCESS'])
        result['data'] = {'username': username}
        return result, 201


class Token(Resource):
    def post(self):
        username = request.form['username']
        password = request.form['password']

        valid = verify_password(username, password)

        if valid is None:
            result = copy.deepcopy(
                AUTHENTICATION_ERRCODE['USER_DOES_NOT_EXIST'])
        elif valid:
            access_token = gen_access_token(username)
            refresh_token = gen_refresh_token(username)

            result = copy.deepcopy(ERRCODE['SUCCESS'])
            result['data'] = {
                'access_token': access_token,
                'refresh_token': refresh_token}
        else:
            result = copy.deepcopy(
                AUTHENTICATION_ERRCODE['INVALID_USERNAME_OR_PASSWORD'])

        return result, 200

    @auth_token_required
    def get(self):
        token = request.headers.get('Authorization').split()[1]
        serializer = ACCESS_TOKEN_SERIALIZER
        username = serializer.loads(token)

        result = copy.deepcopy(ERRCODE['SUCCESS'])
        result['data'] = username

        return result, 200

    def put(self):
        result = copy.deepcopy(AUTHENTICATION_ERRCODE['INVALID_REFRESH_TOKEN'])

        if not request.form:
            return result, 200

        refresh_token = request.form['refresh_token']

        username = None
        try:
            username = verify_token(refresh_token, 'refresh_token')
        except BaseException:
            return result, 200

        if not username:
            return result, 200

        access_token = gen_access_token(username)

        result = copy.deepcopy(ERRCODE['SUCCESS'])
        result['data'] = {'access_token': access_token}
        return result, 200


class AuthResource(Resource):
    @auth_token_required
    def get(self):
        return jsonify({'data': 'Hello, you are welcome!'})
