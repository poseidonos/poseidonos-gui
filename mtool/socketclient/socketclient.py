'''
/*-------------------------------------------------------------------------------------/
                                                                                    /
/               COPYRIGHT (c) 2019 SAMSUNG ELECTRONICS CO., LTD.                      /
/                          ALL RIGHTS RESERVED                                        /
/                                                                                     /
/   Permission is hereby granted to licensees of Samsung Electronics Co., Ltd.        /
/   products to use or abstract this computer program for the sole purpose of         /
/   implementing a product based on Samsung Electronics Co., Ltd. products.           /
/   No other rights to reproduce, use, or disseminate this computer program,          /
/   whether in part or in whole, are granted.                                         /
/                                                                                     /
/   Samsung Electronics Co., Ltd. makes no representation or warranties with          /
/   respect to the performance of this computer program, and specifically disclaims   /
/   any responsibility for any damages, special or consequential, connected           /
/   with the use of this program.                                                     /
/                                                                                     /
/-------------------------------------------------------------------------------------/


DESCRIPTION: Interface to connect with iBOF OS through socket
@NAME : socketclient.py
@AUTHORS: Jay Hitesh Sanghavi
@Version : 1.0 *
@REVISION HISTORY
[03/06/2019] [Jay] : Prototyping..........////////////////////
[11/06/2019] [Aswin] : Volume mounted after creation
*/
'''

import socket
import json
import subprocess
import os
from util.socket.socketConnection import IBOFSocket, ibof_reconnect
import threading
import logging
from logging.handlers import RotatingFileHandler

lock = threading.Lock()


def scan_devices():
    scan_dev = {"command": "SCANDEVICE", "rid": "fromfakeclient"}
    logger = logging.getLogger(__name__)
    logger.error('%s', 'scanning  devices')
    cmd_result = send_command_to_socket(
        json.dumps(scan_dev).encode(
            encoding='UTF-8', errors='strict'))
    if "error" in cmd_result:
        return {"result": cmd_result["error"], "return": -1}
    else:
        logger.info('%s %s', 'INFO Scan Devices', json.dumps(cmd_result))
        return cmd_result


def get_devices():
    list_dev = {"command": "LISTDEVICE", "rid": "fromfakeclient"}
    logger = logging.getLogger(__name__)
    logger.info('%s', 'getting devices......')
    cmd_result = send_command_to_socket(
        json.dumps(list_dev).encode(
            encoding='UTF-8', errors='strict'))
    if "error" in cmd_result:
        logger.error('%s %s', 'ERROR', cmd_result)
        return {"result": cmd_result["error"], "return": -1}
    else:
        logger.info('%s %s', 'INFO get devices', json.dumps(cmd_result))
        return cmd_result


def create_array(level, spare_devices, devices, meta_devices):
    logger = logging.getLogger(__name__)
    logger.info('%s', 'create array......')
    array = {
        "command": "MOUNTARRAY",
        "rid": "fromfakeclient",
        "param": {
            "fttype": level,
            "buffer": meta_devices,
            "data": devices,
            "spare": spare_devices}}
    cmd_result = send_command_to_socket(
        json.dumps(array).encode(
            encoding='UTF-8', errors='strict'))
    if "error" in cmd_result:
        logger.error('%s %s', 'ERROR', cmd_result)
        return {"result": cmd_result["error"], "return": -1}
    else:
        logger.info('%s %s', 'INFO Create Array', json.dumps(cmd_result))
        return cmd_result


def delete_array(array_name):
    logger = logging.getLogger(__name__)
    logger.info('%s', 'delete array......')
    del_array = {
        "delete_arr": array_name
    }
    cmd_result = send_command_to_socket(
        json.dumps(del_array).encode(
            encoding='UTF-8', errors='strict'))
    if "error" in cmd_result:
        logger.error('%s %s', 'ERROR', cmd_result)
        return {"result": cmd_result["error"], "return": -1}
    else:
        logger.info('%s %s', 'INFO Delete Array', json.dumps(cmd_result))
        return cmd_result


def list_array():
    list_array = {
        "list_arr": "list_arr"
    }
    logger.info('%s', 'list array......')
    cmd_result = send_command_to_socket(
        json.dumps(list_array).encode(
            encoding='UTF-8', errors='strict'))
    if "error" in cmd_result:
        logger.error('%s %s', 'ERROR', cmd_result)
        return {"result": cmd_result["error"], "return": -1}
    else:
        logger.info('%s %s', 'INFO List Array', json.dumps(cmd_result))
        return cmd_result


def create_vol(name, size):
    logger = logging.getLogger(__name__)
    create_vol_cmd = {
        "command": "CREATEVOLUME",
        "rid": "fromfakeclient",
        "param": {
            "name": name,
            "size": size}}
    logger.info('%s', 'Create Volume......')
    cmd_result = send_command_to_socket(
        json.dumps(create_vol_cmd).encode(
            encoding='UTF-8', errors='strict'))
    if "error" in cmd_result:
        logger.error('%s %s', 'ERROR Create Volume', cmd_result)
        return {"result": cmd_result["error"], "return": -1}
    else:
        logger.info('%s', 'Mounting Volume......')
        mount_vol_res = mount_vol(name)
        print(mount_vol_res)
        logger.info('%s %s', 'INFO Create Volume', cmd_result)
        return cmd_result


def mount_vol(name):
    mount_vol_cmd = {
        "command": "MOUNTVOLUME",
        "rid": "fromfakeclient",
        "param": {
            "name": name}}
    logger.info('%s %s', 'Mounting  Volume: ', name)
    mount_cmd_result = send_command_to_socket(
        json.dumps(mount_vol_cmd).encode(
            encoding='UTF-8', errors='strict'))
    if "error" in mount_cmd_result:
        logger.error('%s %s', 'ERROR', mount_cmd_result)
        return {"result": mount_cmd_result["error"], "return": -1}
    else:
        try:
            script_path = os.path.expanduser(
                '/root/workspace/ibofos/script/mtool/nvmf_target.sh')
            print("Calling script after mounting")
            session = subprocess.Popen(
                ['sh', script_path], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
            stdout, stderr = session.communicate()
        except Exception as e:
            logger.error('%s %s', 'ERROR in executin nvmf_target.sh', e)
            print('Error in executing file')
        logger.info('%s %s', 'INFO Mount Volume', json.dumps(mount_cmd_result))
        return mount_cmd_result


def list_vol():
    logger = logging.getLogger(__name__)
    logger.info('%s', 'List  Volume...')
    list_vol_cmd = {"command": "LISTVOLUME", "rid": "fromfakeclient"}
    cmd_result = send_command_to_socket(
        json.dumps(list_vol_cmd).encode(
            encoding='UTF-8', errors='strict'))
    if "error" in cmd_result:
        logger.error('%s %s', 'ERROR', cmd_result)
        return {"result": cmd_result["error"], "return": -1}
    else:
        logger.info('%s %s', 'INFO List Volume', json.dumps(cmd_result))
        return cmd_result


def delete_vol(vol_name):
    logger = logging.getLogger(__name__)
    logger.info('%s', 'Delete  Volume...')
    del_vol_cmd = {
        "command": "DELETEVOLUME",
        "rid": "fromfakeclient",
        "param": {
            "name": vol_name}}
    unmount_vol_cmd = {
        "command": "UNMOUNTVOLUME",
        "rid": "fromfakeclient",
        "param": {
            "name": vol_name}}
    unmount_cmd_result = send_command_to_socket(
        json.dumps(unmount_vol_cmd).encode(
            encoding='UTF-8', errors='strict'))
    cmd_result = send_command_to_socket(
        json.dumps(del_vol_cmd).encode(
            encoding='UTF-8', errors='strict'))
    if "error" in cmd_result:
        logger.error('%s %s', 'ERROR', cmd_result)
        return {"result": cmd_result["error"], "return": -1}
    else:
        logger.info('%s %s', 'INFO Delete Volume', json.dumps(cmd_result))
        return cmd_result


def get_system_state():
    logger = logging.getLogger(__name__)
    logger.info('%s', 'Get system state...')
    sys_state = {"command": "SYSSTATE", "rid": "fromfakeclient"}
    cmd_result = send_command_to_socket(
        json.dumps(sys_state).encode(
            encoding='UTF-8', errors='strict'))
    if "error" in cmd_result:
        logger.error('%s %s', 'ERROR', cmd_result)
        return {"result": cmd_result["error"], "return": -1}
    else:
        logger.info('%s %s', 'INFO sysstate', json.dumps(cmd_result))
        return cmd_result


def send_command_to_socket(command, msglen=65536):
    lock.acquire()
    logger.info('%s', 'sending command to socket...')
    try:
        try:
            IBOFSocket.ibof_socket.sendall(command)
        except BaseException:
            logger.info(
                '%s', 'could not send command to socket. Trying to reconnect..')
            ibof_reconnect()
            IBOFSocket.ibof_socket.sendall(command)
        try:
            data = IBOFSocket.ibof_socket.recvmsg(msglen)
            res = str(data[0])[2:str(data[0]).find("\\x00")]
            logger.info('%s %s', 'INFO', res)
        except socket.error as e:
            logger.error("%s %s", "Socker ERROR", e)
            return {"error": "Connection to iBoF OS failed", "return": -1}
        try:
            jsondata = json.loads(res)
            return jsondata
        except BaseException:
            return {"error": "iBoF OS returned invalid data", "return": -1}
    except BaseException:
        logger.error('%s %s', "error", "Connection to iBoF OS failed")
        return {"error": "Connection to iBoF OS failed", "return": -1}
    finally:
        lock.release()


def get_device_details(name):
    device_details = {}
    device_list_cmd = subprocess.check_output(["nvme", "list", "-o", "json"])
    device_list = json.loads(device_list_cmd)
    for device in device_list['Devices']:
        if device['DevicePath'] == name:
            device_details['Device'] = device
    smart_status_cmd = subprocess.check_output(
        ["nvme", "smart-log", name, "-o", "json"])
    smart_status = json.loads(smart_status_cmd)
    device_details['SmartStatus'] = smart_status
    return device_details


handler = RotatingFileHandler(
    'log/ibof.log',
    maxBytes=1024 * 1024,
    backupCount=3)
logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)
logger.addHandler(handler)


# connect_socket()
#res = get_devices()
# print(res)
# sock.close()
'''
print(scan_devices())
print(get_devices())
print("Creating Array........")
arrays = list_array()
print(arrays)
count = 0
if arrays["return"] != -1:
    while count < arrays["num_arr"]:
        if arrays["arr" + str(count)] == "samsung":
            print("Array Exists")
            break
        count += 1
if arrays["return"] == -1 or count == arrays["num_arr"]:

#print(create_array())

print(create_array(1, [{"deviceName":"/dev/nvme3n1"}], [{"deviceName":"/dev/nvme2n1"},{"deviceName":"/dev/nvme1n1"},{"deviceName":"/dev/nvme0n1"}], [{"deviceName":"/dev/ram0"}]))

print(get_devices())
print("Array Created Succesfully")
#print(list_array())
print(create_vol("vol2", 1048576))
print(list_vol())
print(delete_vol("vol1"))
print(list_vol())

print(delete_array("samsung"))
print(list_array())
#time.sleep(20)
#print(list_array())
def close_connection():
    globals()
    sock.close()
'''
