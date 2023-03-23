import rest.rest_api.dagent.ibofos as dagent
from flask import Blueprint, make_response, jsonify
from rest.auth import token_required

transport_bp = Blueprint('transport', __name__)

# Get Transports
@transport_bp.route('/api/v1.0/transports/', methods=['GET'])
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
@transport_bp.route('/api/v1.0/transport/', methods=["POST"])
@token_required
def createTransport(current_user):
    return make_response('Transport Created', 200)