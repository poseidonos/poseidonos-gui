import json
import re
from flask import Blueprint, jsonify, make_response, request, abort
from rest.auth import token_required
from rest.db import connection_factory
from util.com.common import toJson

user_bp = Blueprint('user', __name__)

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

# Add User
@user_bp.route('/api/v1.0/add_new_user/', methods=['POST'])
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

# Get Users
@user_bp.route('/api/v1.0/get_users/', methods=['GET'])
@token_required
def get_users(current_user):
    usersList = connection_factory.get_users_from_db()
    if not usersList:
        return jsonify({'message': 'no users found'})
    else:
        return toJson(usersList)

# Update User
@user_bp.route('/api/v1.0/update_user/', methods=['POST'])
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

# Update Password
@user_bp.route('/api/v1.0/update_password/', methods=['POST'])
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

# Delete Users
@user_bp.route('/api/v1.0/delete_users/', methods=['POST'])
@token_required
def delete_users(current_user):
    body_unicode = request.data.decode('utf-8')
    body = json.loads(body_unicode)
    ids = body['ids']
    print("ids : ", ids)
    connection_factory.delete_users_in_db(ids)
    return jsonify({"message": "Users deleted"})

