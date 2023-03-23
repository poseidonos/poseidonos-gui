import json
import math
import rest.rest_api.dagent.ibofos as dagent
from flask import Blueprint, make_response, request, jsonify
from rest.auth import token_required
from rest.socketio.socketio_init import socketIo
from rest.rest_api.volume.volume import create_volume, delete_volume, list_volume, rename_volume, get_max_vol_count, mount_volume, unmount_volume
from util.com.common import toJson

volume_bp = Blueprint('volume', __name__)

BYTE_FACTOR = 1024
BLOCK_SIZE = 1024 * 1024

# POS expects the volume size to be block aligned
def make_block_aligned(size):
    """
    Example:
    size = 8.13 GB
    size = floor( 8.13 * 1000 * 1000 * 1000) =  floor(8130000000) = 8130000000
    floor(8130000000 / (1024 * 1024)) * (1024 * 1024) = 7753 * (1024 * 1024) = 8129609728 → Pass to POS
    """

    size = math.floor(size)
    aligned_size = (math.floor(size / BLOCK_SIZE) * BLOCK_SIZE)
    return aligned_size

# Create QOS
@volume_bp.route('/api/v1/qos', methods=['POST'])
def qos_create_policies():
    try:
        body_unicode = request.data.decode('utf-8')
        body = json.loads(body_unicode)
        body['vol'] = body.pop('volumes')
        if "maxbw" in body:
            body["maxbw"] = int(body["maxbw"])
        if "minbw" in body:
            body["minbw"] = int(body["minbw"])
        if "maxiops" in body:
            body["maxiops"] = int(body["maxiops"])
        if "miniops" in body:
            body["miniops"] = int(body["miniops"])
        request_body = {
            "param": body
        }
        range_message = "Please enter valid range: \nValid range for IO =  10 - 18446744073709551 KIOPS\nValid range for BW = 10 - 17592186044415 MB/s"
        response = dagent.qos_create_volume_policies(request_body)
        response = response.json()
        if "result" in response and "status" in response["result"] and "code" in response[
                "result"]["status"] and response["result"]["status"]["code"] == 2080:
            if "description" in response["result"]["status"]:
                response["result"]["status"]["description"] += " " + \
                    range_message
        return toJson(response)
    except Exception as e:
        print("In exception qos_create_policies(): ", e)
        return make_response('Could not create volume policies', 500)

def get_request_body(request):
    body_unicode = request.data.decode('utf-8')
    body = json.loads(body_unicode)
    array_name = body.get("array")
    vol_names = body.get("volumes")
    return {
        "param": {
            "array": array_name,
            "vol": vol_names
        }
    }

# Reset QOS
@volume_bp.route('/api/v1/qos/reset', methods=['POST'])
def qos_reset_policies():
    try:
        request_body = get_request_body(request)
        response = dagent.qos_reset_volume_policies(request_body)
        return toJson(response.json())
    except Exception as e:
        print("In exception qos_reset_volume_policies(): ", e)
        return make_response('Could not reset volume policies', 500)

@volume_bp.route('/api/v1/qos/policies', methods=['POST'])
def qos_policies():
    try:
        request_body = get_request_body(request)
        response = dagent.qos_list_volume_policies(request_body)
        return toJson(response.json())
    except Exception as e:
        print("In exception qos_list_volume_policies(): ", e)
        return make_response('Could not get volume policies', 500)
    
# Save Volume
@volume_bp.route('/api/v1.0/save-volume/', methods=['POST'])
def saveVolume():
    body_unicode = request.data.decode('utf-8')
    body = json.loads(body_unicode)
    try:
        volume_name = body['name']
        vol_size = float(body['size'])
        minbw = 0
        if 'minbw' in body:
            minbw = body['minbw']
        maxbw = body['maxbw']
        array_name = body.get('array')
        maxiops = int(body['maxiops'])
        miniops = 0
        if 'miniops' in body:
            miniops = body['miniops']
        unit = body['unit'].upper()
        mount_vol = body['mount_vol']
        stop_on_error = body['stop_on_error']
        count = body['count']
        subsystem = body['subsystem']
        suffix = body['suffix']
        max_available_size = body['max_available_size']
        iswalvol = False
        if 'iswalvol' in body:
            iswalvol = body['iswalvol']
    except Exception as e:
        print("Exception Occured in Save Volume")
        print(e)
        return make_response('Required fields are missing: ' + e, 400)

    if array_name is None:
        array_name = dagent.array_names[0]

    if (vol_size == 0):
        size = int(max_available_size)
    else:
        if unit == "MB":
            size = vol_size * BYTE_FACTOR * BYTE_FACTOR
        elif unit == "GB":
            size = vol_size * BYTE_FACTOR * BYTE_FACTOR * BYTE_FACTOR
        elif unit == 'TB':
            size = vol_size * BYTE_FACTOR * BYTE_FACTOR * BYTE_FACTOR * BYTE_FACTOR
        elif unit == 'PB':
            size = vol_size * BYTE_FACTOR * BYTE_FACTOR * \
                BYTE_FACTOR * BYTE_FACTOR * BYTE_FACTOR
        else:
            # default case assuming the unit is TB
            size = vol_size * BYTE_FACTOR * BYTE_FACTOR * BYTE_FACTOR * BYTE_FACTOR
    size = make_block_aligned(size)

    create_vol_res = create_volume(
        volume_name,
        array_name,
        int(size),
        int(count),
        int(suffix),
        mount_vol,
        stop_on_error,
        int(maxbw),
        int(maxiops),
        int(minbw),
        int(miniops),
        subsystem,
        iswalvol)
    return toJson(create_vol_res)

# Rename Volume
@volume_bp.route('/api/v1.0/volumes/<volume_name>', methods=['PATCH'])
@token_required
def renameVolume(current_user, volume_name):
    try:
        body_unicode = request.data.decode('utf-8')
        body = json.loads(body_unicode)
        if volume_name != body["param"]["name"]:
            return make_response('URL param not matching with body param', 500)
    except BaseException:
        return make_response('Invalid Parameters received', 500)
    rename_vol_res = rename_volume(body)
    return toJson(rename_vol_res.json())

# Mount Volume
@volume_bp.route('/api/v1.0/volume/mount', methods=['POST'])
def mountVolume():
    try:
        body_unicode = request.data.decode('utf-8')
        body = json.loads(body_unicode)
        mount_vol_res = mount_volume(
            body["name"],
            body.get("array"),
            body.get("subnqn"))
        return toJson(mount_vol_res.json())
    except Exception as e:
        print("In exception mountVolume(): ", e)
        return make_response('Could not mount Volume', 500)

# Unmount Volume
@volume_bp.route('/api/v1.0/volume/mount', methods=['DELETE'])
def unmountVolume():
    try:
        body_unicode = request.data.decode('utf-8')
        body = json.loads(body_unicode)
        unmount_vol_res = unmount_volume(body["name"], body.get("array"))
        return toJson(unmount_vol_res.json())
    except Exception as e:
        print("In exception unmountVolume(): ", e)
        return make_response('Could not Unmount Volume', 500)

# Delete Volume
@volume_bp.route('/api/v1.0/delete_volumes/<name>', methods=['POST'])
def deleteVolumes(name):
    body_unicode = request.data.decode('utf-8')
    body = json.loads(body_unicode)
    vols = list(body['volumes'])
    total = len(vols)
    passed = 0
    fail = 0
    description = ""
    arrayname = name
    deleted_vols = []
    return_msg = {"result": "Success"}
    for vol in vols:
        del_vol_cmd = delete_volume(vol, arrayname)
        if del_vol_cmd.status_code == 200:
            passed = passed + 1
            deleted_vols.append(vol)
            return_msg["result"] = del_vol_cmd.json(
            )["result"]["status"]["description"]
        elif del_vol_cmd.status_code == 500:
            fail = fail + 1
            return_msg["result"] = del_vol_cmd.json()["error"]
            description += vol["name"] + ": "
            description += del_vol_cmd.json()["error"]
            description += "\n"
        else:
            fail = fail + 1
            del_vol_cmd = del_vol_cmd.json()
            if ("result" in del_vol_cmd and "status" in del_vol_cmd["result"]):
                description += vol["name"] + ":"
                description += del_vol_cmd["result"]["status"]["description"]
                description += ", Error code: "
                description += str(del_vol_cmd["result"]["status"]["code"])
                description += "\n"
                return_msg["result"] = del_vol_cmd["result"]["status"]
                return_msg["vol_name"] = vol["name"]
    if fail == 0:
        return_msg["return"] = 0
    else:
        return_msg["return"] = -1
    return_msg["total"] = total
    return_msg["passed"] = passed
    return_msg["failed"] = fail
    return_msg["description"] = description
    return toJson(return_msg)

# Max Volume Count
@volume_bp.route('/api/v1.0/max_volume_count/', methods=['GET'])
def getMaxVolCount():
    print("Get max vol count")
    res = get_max_vol_count()
    max_vol_count = 256
    if(res.status_code == 200):
        res = res.json()
        max_vol_count = res["result"]["data"]["count"]
    return jsonify(max_vol_count)

# Get All volumes
@volume_bp.route('/api/v1/get_all_volumes/', methods=['GET'])
def get_all_volumes():
    volumes_list = {}
    try:
        arrays = dagent.list_arrays().json()
        if "data" in arrays["result"] and "arrayList" in arrays["result"]["data"]:
            arrays = arrays.json()
            arrays = arrays["result"]["data"]["arrayList"]
        else:
            return toJson([])
        for array in arrays:
            volumes = list_volume(array["name"])
            volumes_list[array["name"]] = volumes
    except Exception as e:
        print("Exception in /api/v1/get_all_volumes/ ", e)
    return toJson(volumes_list)

# Get All Array Volumes 
@volume_bp.route('/api/v1/<array_name>/get_volumes/', methods=['GET'])
def getVolumes(array_name):
    volumes = list_volume(array_name)
    for vol in volumes:
        if "maxiops" in vol:
            vol["maxiops"] = int(vol["maxiops"])
    return toJson(volumes)

# callback function for multi-volume creation response from DAgent
@volume_bp.route('/api/v1.0/multi_vol_response/', methods=['POST'])
def createMultiVolumeCallback():
    body_unicode = request.data.decode('utf-8')
    body = json.loads(body_unicode)
    description = ""
    errorResponses = []
    errorCode = 0
    respList = body['MultiVolArray']
    for entry in respList:
        if entry["result"]["status"]["code"] != 0:
            if entry["result"]["status"]["description"] == "":
                description += entry["result"]["status"]["posDescription"]
            else:
                description += entry["result"]["status"]["description"]
            if len(description) > 0:
                description += "\n"
        if "errorInfo" in entry["result"]["status"]:
            if len(errorResponses) == 0:
                if "errorCode" in entry["result"]["status"]["errorInfo"] and entry["result"]["status"]["errorInfo"]["errorCode"] == 1:
                    errorCode = 1
                    errorResponses = entry["result"]["status"]["errorInfo"]["errorResponses"]
    qosResp = respList[len(respList)-1]
    if qosResp["result"]["status"]["code"] != 0:
        errorCode = 1
    passed = body['Pass']
    total_count = body['TotalCount']
    socketIo.emit('create_multi_volume',
                  {'pass': passed,
                   'total_count': total_count,
                   'description': description,'errorCode':errorCode,'errorResponses':errorResponses},
                  namespace='/create_vol')
    return "ok", 200
