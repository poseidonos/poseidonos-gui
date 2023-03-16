from flask import Blueprint, make_response, jsonify
from rest.db import connection_factory
from rest.rest_api.perf.system_perf import get_agg_volumes_perf

performance_bp = Blueprint('performance', __name__)

@performance_bp.route('/api/v1/perf/all', methods=['GET'])
def get_current_iops():
    try:
        received_telemetry = connection_factory.get_telemetery_url()
        if received_telemetry is None or len(received_telemetry) == 0:
            return make_response('Telemetry URL is not configured', 500)
        ip = received_telemetry[0]
        port= received_telemetry[1]
        res = get_agg_volumes_perf(ip, port)
        return jsonify(res)
    except Exception as e:
        return make_response('Could not get performance metrics'+str(e), 500)
