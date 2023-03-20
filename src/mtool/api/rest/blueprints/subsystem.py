import json
import rest.rest_api.dagent.ibofos as dagent
from flask import Blueprint, request, abort
from rest.auth import token_required
from util.com.common import toJson

subsystem_bp = Blueprint('subsystem', __name__)

# create subsystem
@subsystem_bp.route('/api/v1/subsystem/', methods=['POST'])
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

# list subsystem
@subsystem_bp.route('/api/v1/subsystem/', methods=['GET'])
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
@subsystem_bp.route('/api/v1/subsystem/', methods=['DELETE'])
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

# create transport
@subsystem_bp.route('/api/v1/transport/', methods=['POST'])
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

# add listener
@subsystem_bp.route('/api/v1/listener/', methods=['POST'])
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