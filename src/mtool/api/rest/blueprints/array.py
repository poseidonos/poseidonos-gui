import json
import rest.rest_api.dagent.ibofos as dagent
from flask import Blueprint, make_response, request, jsonify, abort
from rest.auth import token_required
from rest.rest_api.array.array import create_arr, arr_info
from rest.rest_api.volume.volume import list_volume
from util.com.common import toJson, getResponse

array_bp = Blueprint('array', __name__)

# Get Array Config
@array_bp.route('/api/v1/get_array_config/', methods=['GET'])
@token_required
def get_array_config(current_user):
    return toJson({
        "raidTypes":
        [
            {
                "raidType": "RAID0",
                "minStorageDisks": 2,
                "maxStorageDisks": 32,
                "minSpareDisks": 0,
                "maxSpareDisks": 0,
            },
            {
                "raidType": "RAID5",
                "minStorageDisks": 3,
                "maxStorageDisks": 32,
                "minSpareDisks": 0,
                "maxSpareDisks": 29,
            },
            {
                "raidType": "RAID6",
                "minStorageDisks": 4,
                "maxStorageDisks": 32,
                "minSpareDisks": 0,
                "maxSpareDisks": 28,
            },
            {
                "raidType": "RAID10",
                "minStorageDisks": 2,
                "maxStorageDisks": 32,
                "minSpareDisks": 0,
                "maxSpareDisks": 29,
            },
            {
                "raidType": "NONE",
                "minStorageDisks": 1,
                "maxStorageDisks": 1,
                "minSpareDisks": 0,
                "maxSpareDisks": 0,
            },
        ],
        "totalDisks": 32,
    })

def get_mod_array(array):
    _array = {}
    _array["RAIDLevel"] = array["result"]["data"]["dataRaid"]
    _array["storagedisks"] = []
    _array["writebufferdisks"] = []
    _array["sparedisks"] = []
    _array["metadiskpath"] = []
    _array["totalsize"] = 0
    _array["usedspace"] = 0
    _array["index"] = array["result"]["data"]["uniqueId"]
    for device in array["result"]["data"]["devicelist"]:
        if device["type"] == "DATA":
            _array["storagedisks"].append({"deviceName": device["name"]})
        if device["type"] == "BUFFER":
            _array["metadiskpath"].append({"deviceName": device["name"]})
        if device["type"] == "SPARE":
            _array["sparedisks"].append({"deviceName": device["name"]})
    return _array

# Fetch all arrays
@array_bp.route('/api/v1/get_arrays/', methods=['GET'])
@token_required
def get_arrays(current_user):
    arrays = dagent.list_arrays().json()
    if "data" in arrays["result"] and "arrayList" in arrays["result"]["data"]:
        arrays = arrays["result"]["data"]["arrayList"]
    else:
        return toJson([])
    if not isinstance(arrays, list):
        return toJson([])
    arrays_info = []
    for array in arrays:
        a_info = arr_info(array["name"])
        try:
            if a_info.status_code == 200:
                vol_list = list_volume(array["name"])
                a_info = a_info.json()
                res = a_info
                # convert to format expected by UI
                a_info = get_mod_array(a_info)
                a_info['totalsize'] = int(res["result"]["data"]["capacity"])
                if "used" in res["result"]["data"]:
                    a_info['usedspace'] = int(res["result"]["data"]["used"])
                a_info['volumecount'] = len(vol_list)
                a_info["arrayname"] = res["result"]["data"]["name"]
                a_info["status"] = array["status"]
                a_info["situation"] = res["result"]["data"]["situation"]
                a_info["state"] = res["result"]["data"]["state"]
                if "writeThroughEnabled" in res["result"]["data"]:
                    a_info["writeThroughEnabled"] = res["result"]["data"]["writeThroughEnabled"]
                else:
                    a_info["writeThroughEnabled"] = False
                a_info["rebuildingprogress"] = res["result"]["data"]["rebuildingProgress"]
                arrays_info.append(a_info)
        except Exception as e:
            print("Exception in /api/v1/get_arrays/ API:", e)
            return toJson([])
    return jsonify(arrays_info)

# Array Info
@array_bp.route('/api/v1/array/<array_name>/info', methods=['GET'])
@token_required
def get_array_info(current_user, array_name):
    array_info = arr_info(array_name)
    array_info = array_info.json()
    return toJson(array_info)
    
# Create Array
@array_bp.route('/api/v1.0/create_arrays/', methods=['POST'])
@token_required
def create_arrays(current_user):
    body_unicode = request.data.decode('utf-8')
    body = json.loads(body_unicode)
    arrayname = body.get('arrayname')
    raidtype = body['raidtype']
    spareDisks = body['spareDisks']
    metaDisk = body["metaDisk"]
    storageDisks = body['storageDisks']
    write_through = body['writeThroughModeEnabled']
    try:
        array_create = create_arr(arrayname, raidtype, spareDisks, storageDisks, [
            {"deviceName": metaDisk}], write_through)
        array_create = array_create.json()
        return toJson(array_create)
    except Exception as e:
        print("Exception in creating array: " + e)
        return abort(404)

# Delete Array
@array_bp.route('/api/v1.0/delete_array/<name>', methods=['POST'])
@token_required
def delete_array(current_user, name):
    print("in delete array")
    res = dagent.delete_array(name)
    res_json = getResponse(res)
    if res_json != None:
        return res_json
    return make_response("unable to delete array", 500)

# Mount Array
@array_bp.route('/api/v1/array/mount', methods=['POST'])
def mount_arr():
    try:
        body_unicode = request.data.decode('utf-8')
        body = json.loads(body_unicode)
        write_through = False
        try:
            write_through = body.get("writeThrough")
        except BaseException:
            write_through = False
        mount_array_res = dagent.mount_array(body.get("array"), write_through)
        return toJson(mount_array_res.json())
    except Exception as e:
        print("In exception mount_arr(): ", e)
        return make_response('Could not mount array', 500)

# Unmount Array
@array_bp.route('/api/v1/array/mount', methods=['DELETE'])
def unmount_arr():
    try:
        body_unicode = request.data.decode('utf-8')
        body = json.loads(body_unicode)
        unmount_array_res = dagent.unmount_array(body.get("array"))
        return toJson(unmount_array_res.json())
    except Exception as e:
        print("In exception unmount_arr(): ", e)
        return make_response('Could not Unmount array', 500)

# auto create array
@array_bp.route('/api/v1/autoarray/', methods=['POST'])
@token_required
def auto_create_array(current_user):
    body_unicode = request.data.decode('utf-8')
    body = json.loads(body_unicode)
    arrayname = body.get('arrayname')
    raidtype = body['raidtype']
    metaDisk = body["metaDisk"]
    num_data = body['num_data']
    num_spare = body['num_spare']
    write_through = body['writeThroughModeEnabled']
    if arrayname is None:
        arrayname = dagent.array_names[0]
    try:
        array_create = dagent.auto_create_array(
            arrayname, raidtype, num_spare, num_data, [{"deviceName": metaDisk}], write_through)
        if array_create is not None:
            array_create = array_create.json()
            return toJson(array_create)
        else:
            return toJson({})
    except Exception as e:
        print("Exception in creating array: " + e)
        return abort(404)

# rebuild Array
@array_bp.route('/api/v1.0/array/<array_name>/rebuild', methods=['POST'])
@token_required
def rebuild_array(current_user, array_name):
    res = dagent.rebuild_array(array_name)
    res = res.json()
    return toJson(res)