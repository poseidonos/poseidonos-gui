from flask import Blueprint, make_response, jsonify
from rest.auth import token_required
from rest.db import connection_factory
from rest.rest_api.perf.system_perf import get_all_hardware_health

hardware_bp = Blueprint('hardware', __name__)

@hardware_bp.route('/api/v1/get_hardware_health', methods=['GET'])
@token_required
def get_hardware_health(current_user):
    try:
        received_telemetry = connection_factory.get_telemetery_url()
        if received_telemetry is None or len(received_telemetry) == 0:
            return make_response('Telemetry URL is not configured', 500)
        ip = received_telemetry[0]
        port= received_telemetry[1]
        res = get_all_hardware_health(ip, port)
        return jsonify(res)
    except Exception:
        return make_response('Could not get hardware health metrics', 500)
