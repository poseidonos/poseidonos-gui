import json
import rest.rest_api.dagent.ibofos as dagent
from flask import Blueprint, make_response, jsonify, request, abort
from rest.auth import token_required
from util.com.common import toJson

transport_bp = Blueprint('transport', __name__)

# Get Transports
@transport_bp.route('/api/v1/transports/', methods=['GET'])
@token_required
def getTransports(current_user):
    transports = []
    try:
        response = dagent.list_transport().json()
        if "data" in response["result"] and "transportlist" in response["result"]["data"]:
            transports = response["result"]["data"]["transportlist"]
    except Exception as err:
        return make_response("Unable to fetch transports" + str(err),500)
    return jsonify(transports)

# Create Transport
@transport_bp.route('/api/v1/transport/', methods=['POST'])
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