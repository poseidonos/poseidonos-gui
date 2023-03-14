import os
import datetime
from flask import Blueprint, make_response, request, jsonify
from rest.auth import token_required
from util.com.common import toJson
from rest.log import logger
import rest.rest_api.dagent.ibofos as dagent
import json
from rest.rest_api.system.system import fetch_system_state
from rest.db import connection_factory

pos_bp = Blueprint('pos', __name__)

class IBOF_OS_Running:
    Is_Ibof_Os_Running_Flag = False

@pos_bp.route('/api/v1.0/version', methods=['GET'])
def get_version():
    package_json_path = os.path.abspath(
        os.path.join(
            os.path.dirname(__file__),
            "../../../ui/package.json"))
    with open(package_json_path, encoding="utf-8") as f:
        data = json.load(f)
        return toJson({"version": data["version"]})


@pos_bp.route('/api/v1.0/logger', methods=['POST'])
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


def get_ibof_os_status():
    return IBOF_OS_Running.Is_Ibof_Os_Running_Flag

@pos_bp.route('/api/v1.0/pos/info', methods=['GET'])
@token_required
def get_pos_info(current_user):
    return toJson(dagent.get_pos_info())

@pos_bp.route('/api/v1.0/start_ibofos', methods=['GET'])
@token_required
def start_ibofos(current_user):
    """
    Start IBOF os pos_bplication. The path is given for demo&kntf server
    :param current_user:
    :return: status
    """
    res = dagent.start_ibofos()
    res = res.json()
    return jsonify(res)

@pos_bp.route('/api/v1.0/get_Is_Ibof_OS_Running/')
@token_required
def is_ibofos_running(current_user="admin"):
    """
    Checks if ibofos is running
    :return:
    """
    timestamp = code = level = value = ""
    state = ""
    situation = ""
    lastRunningTime = ""
    try:
        response = fetch_system_state()
        response = response.json()
        if 'lastSuccessTime' in response and response['lastSuccessTime'] != 0:
            lastRunningTime = datetime.datetime.fromtimestamp(
                response['lastSuccessTime']).strftime("%a, %d %b %Y %I:%M:%S %p %Z")
        if('result' in response and 'status' in response['result'] and 'code' in response['result']['status'] and response['result']['status']['code'] == 0):
            timestamp = connection_factory.get_prev_time_stamp()
            if not timestamp:
                connection_factory.insert_time_stamp(lastRunningTime)
            else:
                connection_factory.update_time_stamp(lastRunningTime)
            IBOF_OS_Running.Is_Ibof_Os_Running_Flag = True
        else:
            timestampvalue = connection_factory.get_prev_time_stamp()
            if not timestampvalue:
                lastRunningTime = ""
            else:
                lastRunningTime = timestampvalue
            IBOF_OS_Running.Is_Ibof_Os_Running_Flag = False
        if('result' in response and 'data' in response['result']):
            state = response['result']['data']['state']
            situation = response['result']['data']['situation']
    except BaseException:
        return toJson({"RESULT": response,
                       "lastRunningTime": lastRunningTime,
                       "timestamp": timestamp,
                       "code": code,
                       "level": level,
                       "state": state,
                       "situation": situation,
                       "value": value})
    return toJson({"RESULT": response,
                   "lastRunningTime": lastRunningTime,
                   "timestamp": timestamp,
                   "code": code,
                   "level": level,
                   "state": state,
                   "situation": situation,
                   "value": value})


@pos_bp.route('/api/v1.0/stop_ibofos', methods=['GET'])
@token_required
def stop_ibofos(current_user):
    """
    Start IBOF os application. The path is given for demo&kntf server
    :param current_user:
    :return: status
    """
    res = dagent.stop_ibofos()
    try:
        if res.status_code == 200:
            res = res.json()
            if res["result"]["status"]["code"] == 0:
                return jsonify({"response": "POS stopped successfully", "code": 0})
        else:
            res = res.json()
            if ("result" in res and "status" in res["result"]):
                description = res["result"]["status"]["description"]
                description += " "
                description += str(res["result"]["status"]["cause"])
                return jsonify({"response": description, "code": res["result"]["status"]["code"]})
    except BaseException:
        pass
    return jsonify({"response": "unable to stop POS", "code": -1})