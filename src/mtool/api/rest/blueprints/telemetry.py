import json
import rest.rest_api.dagent.ibofos as dagent
from flask import Blueprint, jsonify, make_response, request
from rest.auth import token_required
from rest.db import connection_factory
from rest.rest_api.telemetry.telemetry import set_telemetry_configuration, reset_telemetry_configuration, check_telemetry_endpoint
from rest.rest_api.perf.system_perf import get_telemetry_properties, set_telemetry_properties
from util.com.common import toJson

telemetry_bp = Blueprint('telemetry', __name__)

# Get Telemetry Configuration
@telemetry_bp.route('/api/v1/configure', methods=['GET'])
def get_telemetry_config():
    try:
        received_telemetry = connection_factory.get_telemetery_url()
        if received_telemetry is None or len(received_telemetry) == 0:
            return jsonify({'isConfigured': False})
        return jsonify({
            'isConfigured': True,
            'ip': received_telemetry[0],
            'port': received_telemetry[1]
            })
    except Exception:
        return make_response('Could not get Telemetry URL', 500)

# Configure Telemetry
@telemetry_bp.route('/api/v1/configure', methods=['POST'])
def set_telemetry_config():
    try:
        body_unicode = request.data.decode('utf-8')
        body = json.loads(body_unicode)
        ip = body["telemetryIP"]
        port = body["telemetryPort"]
        response = set_telemetry_configuration(ip, port)
        if response.response[0].decode('UTF-8') == "success":
            connection_factory.update_telemetry_url(ip,port)
        return response
    except Exception:
        return make_response('Could not configure Telemetry URL', 500)

# Reset Telemetry Config
@telemetry_bp.route('/api/v1/configure', methods=['DELETE'])
def reset_telemetry_config():
    try:
        connection_factory.delete_telemetery_url()
        return reset_telemetry_configuration()
    except Exception:
        return make_response('Could not reset Telemetry URL', 500)

# Check Telemetry Endpoint
@telemetry_bp.route('/api/v1/checktelemetry', methods=['GET'])
@token_required
def check_telemetry(current_user):
    try:
        received_telemetry = connection_factory.get_telemetery_url()
        if received_telemetry is None or len(received_telemetry) == 0:
            return make_response('Telemetry URL is not configured', 500)
        ip = received_telemetry[0]
        port= received_telemetry[1]
        res = check_telemetry_endpoint(ip, port)
        return res
    except Exception:
        return make_response('Prometheus DB is not running', 500)

# Start Telemetry
@telemetry_bp.route('/api/v1/telemetry', methods=['POST'])
@token_required
def start_telemetry(current_user):
    response = dagent.start_telemetry()
    return toJson(response.json())

# Stop Telemetry
@telemetry_bp.route('/api/v1/telemetry', methods=['DELETE'])
@token_required
def stop_telemetry(current_user):
    response = dagent.stop_telemetry()
    return toJson(response.json())

# Set Telemetry Properties
@telemetry_bp.route('/api/v1/telemetry/properties', methods=['POST'])
@token_required
def set_telemetry_props(current_user):
    body_unicode = request.data.decode('utf-8')
    body = json.loads(body_unicode)
    response = set_telemetry_properties(body)
    return toJson(response.json())

# Get Telemetry Properties
@telemetry_bp.route('/api/v1/telemetry/properties', methods=['GET'])
@token_required
def get_telemetry_props(current_user):
    return toJson(get_telemetry_properties())
