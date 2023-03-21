from flask import Blueprint, jsonify
from rest.auth import token_required
from rest.rest_api.array.array import get_arr_status

storage_bp = Blueprint('storage', __name__)

MACRO_OFFLINE_STATE = "OFFLINE"

# Available Storage
@storage_bp.route('/api/v1.0/available_storage/', methods=['GET'])
@token_required
def get_storage_details(current_user):
    res = get_arr_status()
    val = [{}]
    if res.status_code == 200:
        res = res.json()
        if res["info"]["state"] and res["info"]["state"].upper(
        ) != MACRO_OFFLINE_STATE:
            val[0]["arraySize"] = int(res["info"]["capacity"])
            val[0]["usedSpace"] = int(res["info"]["used"])
        else:
            val[0]['arraySize'] = 0
            val[0]['usedSpace'] = 0
        val[0]['mountStatus'] = res["info"]["state"].upper()
    else:
        val[0]['arraySize'] = 0
        val[0]['usedSpace'] = 0
        val[0]['mountStatus'] = MACRO_OFFLINE_STATE
    print(val)
    return jsonify(val)
