import json
from flask import Blueprint, request, make_response
from rest.log import logger

log_bp = Blueprint('log', __name__)

@log_bp.route('/api/v1.0/logger', methods=['POST'])
def log_collect():
    body_unicode = request.data.decode('utf-8')
    if len(body_unicode) > 0:
        body = json.loads(body_unicode)
        try:
            logger.info(body)
        except Exception as e:
            print(e)
        return "Log written sucessfully"
    return make_response("Received null log value", 200)
