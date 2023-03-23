import rest.rest_api.dagent.ibofos as dagent
from flask import Blueprint, make_response
from rest.auth import token_required
from rest.rest_api.transport.transport import list_transport

transport_bp = Blueprint('transport', __name__)

# Get Transports
@transport_bp.route('/api/v1.0/transports/', methods=['GET'])
@token_required
def getTransports(current_user):
    return list_transport

# Create Transport
@transport_bp.route('/api/v1.0/transport', method=["POST"])
@token_required
def createTransport(current_user):
    return make_response('Transport Created', 200)