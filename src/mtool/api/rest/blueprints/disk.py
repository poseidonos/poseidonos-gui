import json
import rest.rest_api.dagent.ibofos as dagent
from flask import Blueprint, make_response, request
from rest.auth import token_required
from util.com.common import getResponse

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
    res_json = getResponse(res)
    if res_json != None:
        return res_json
    return make_response("unable to add a spare device", 500)

# Remove Spare Disk
@disk_bp.route('/api/v1.0/remove_spare_device/', methods=['POST'])
@token_required
def removeSpareDisk(current_user):
    body_unicode = request.data.decode('utf-8')
    body = json.loads(body_unicode)
    name = body['name']
    arrayname = body.get('array')
    res = dagent.remove_spare_disk(name, arrayname)
    res_json = getResponse(res)
    if res_json != None:
        return res_json
    return make_response("unable to remove spare device", 500)

# Replace Array Disk
@disk_bp.route('/api/v1/array/<array_name>/replace', methods=['POST'])
def replace_arr_device(array_name):
    try:
        body_unicode = request.data.decode('utf-8')
        body = json.loads(body_unicode)
        device = body['device']
        res = dagent.replace_array_device(array_name, device)
        res_json = getResponse(res)
        if res_json != None:
            return res_json
        return make_response("unable to replace array device", 500)
    except Exception as e:
        print("Exception in Replace array device: " + e)
        return make_response('Could not replace array device', 500)
 