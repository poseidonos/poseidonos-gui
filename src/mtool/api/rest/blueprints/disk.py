import json
import rest.rest_api.dagent.ibofos as dagent
from flask import Blueprint, make_response, request
from rest.auth import token_required
from util.com.common import toJson

disk_bp = Blueprint('disk', __name__)

# Add Spare Disk
@disk_bp.route('/api/v1.0/add_spare_device/', methods=['POST'])
@token_required
def addSpareDisk(current_user):
    body_unicode = request.data.decode('utf-8')
    body = json.loads(body_unicode)
    name = body['name']
    arrayname = body.get('array')
    res = dagent.add_spare_disk(name, arrayname)
    return_msg = {}
    if res.status_code == 200:
        res = res.json()
        if res["result"]["status"]["code"] == 0:
            return toJson(res)
    else:
        res = res.json()
        if ("result" in res and "status" in res["result"]):
            return_msg["result"] = res["result"]["status"]
            return_msg["return"] = -1
            return toJson(return_msg)
    res = "unable to add a spare device"
    return make_response(res, 500)

# Remove Spare Disk
@disk_bp.route('/api/v1.0/remove_spare_device/', methods=['POST'])
@token_required
def removeSpareDisk(current_user):
    body_unicode = request.data.decode('utf-8')
    body = json.loads(body_unicode)
    name = body['name']
    arrayname = body.get('array')
    return_msg = {}
    res = dagent.remove_spare_disk(name, arrayname)
    if res.status_code == 200:
        res = res.json()
        if res["result"]["status"]["code"] == 0:
            return toJson(res)
    else:
        print("spare error", res.json())
        res = res.json()
        if ("result" in res and "status" in res["result"]):
            return_msg["result"] = res["result"]["status"]
            return_msg["return"] = -1
            return toJson(return_msg)
    res = "unable to remove spare device"
    return make_response(res, 500)

# Replace Array Disk
@disk_bp.route('/api/v1/array/<array_name>/replace', methods=['POST'])
def replace_arr_device(array_name):
    try:
        body_unicode = request.data.decode('utf-8')
        body = json.loads(body_unicode)
        device = body['device']
        return_msg = {}
        res = dagent.replace_array_device(array_name, device)
        if res.status_code == 200:
            res = res.json()
            if res["result"]["status"]["code"] == 0:
                return toJson(res)
        else:
            res = res.json()
            if ("result" in res and "status" in res["result"]):
                return_msg["result"] = res["result"]["status"]
                return_msg["return"] = -1
                return toJson(return_msg)
        res = "unable to replace array device"
        return make_response(res, 500)
    except Exception as e:
        print("Exception in Replace array device: " + e)
        return make_response('Could not replace array device', 500)
 