import json
import rest.rest_api.dagent.ibofos as dagent
from flask import Blueprint, make_response, request
from itertools import chain
from rest.auth import token_required
from rest.rest_api.device.device import list_devices, get_disk_details
from rest.rest_api.array.array import arr_info
from util.com.common import toJson

device_bp = Blueprint('device', __name__)

# Get Devices
@device_bp.route('/api/v1.0/get_devices/', methods=['GET'])
@token_required
def getDevices(current_user):
    devices = list_devices()
    if(not isinstance(devices, dict)):
        if devices.status_code != 200:
            return toJson(devices.json())
        devices = devices.json()
    arrays = dagent.list_arrays()
    arrays = arrays.json()
    if "data" in arrays["result"] and "arrayList" in arrays["result"]["data"]:
        arrays = arrays["result"]["data"]["arrayList"]
    else:
        return toJson(devices)
    if not isinstance(arrays, list):
        return toJson(devices)
    for array in arrays:
        a_info = arr_info(array["name"])
        try:
            if a_info.status_code == 200:
                a_info = a_info.json()
                for device in chain(
                        devices["devices"],
                        devices["metadevices"]):
                    for arr_dev in a_info["result"]["data"]["devicelist"]:
                        if arr_dev["name"] == device["name"]:
                            device["isAvailable"] = False
                            device["arrayName"] = array["name"]
                            if "displayMsg" in device:
                                device["displayMsg"] = device["name"] + \
                                    " (used by " + array["name"] + ")"
                                device["trimmedDisplayMsg"] = device["name"] + \
                                    " (used)"
                            break
        except Exception as e:
            print("Exception in array_info() in /api/v1.0/get_devices/ ", e)
    return toJson(devices)

# Get Device Details
@device_bp.route('/api/v1.0/device/smart/<name>', methods=['GET'])
@token_required
def getDeviceDetails(current_user, name):
    device_details = get_disk_details(name)
    try:
        return toJson(device_details.json())
    except BaseException:
        res = "Unable to get SMART info"
        return make_response(res, 500)

# Create device
@device_bp.route('/api/v1/device/', methods=['POST'])
@token_required
def create_device(current_user):
    body_unicode = request.data.decode('utf-8')
    body = json.loads(body_unicode)
    name = body.get('name')
    num_blocks = body.get('num_blocks')
    block_size = body.get('block_size')
    dev_type = body.get('dev_type')
    numa = body.get('numa')
    try:
        resp = dagent.create_device(
            name, num_blocks, block_size, dev_type, numa)
        if resp is not None:
            resp = resp.json()
            return toJson(resp)
        else:
            return toJson({})
    except Exception as e:
        print("Exception in creating device " + e)
        return make_response("Error creating Device: " + e, 500)