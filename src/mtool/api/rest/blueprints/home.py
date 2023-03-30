import os
from flask import Blueprint, send_from_directory, make_response

home_bp = Blueprint('home', __name__)

@home_bp.route('/', defaults={'path': ''})
@home_bp.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists("public/" + path):
        return send_from_directory(os.getcwd() + '/public', path)
    else:
        if "api/v1" in path:
            return make_response("Invalid url", 404)
        return send_from_directory(os.getcwd() + '/public', 'index.html')