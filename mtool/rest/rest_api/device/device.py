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


DESCRIPTION: <File description> *
@NAME : device.py
@AUTHORS: Jay Hitesh Sanghavi
@Version : 1.0 *
@REVISION HISTORY
[03/06/2019] [Jay] : Prototyping..........////////////////////
*/
'''

#from socketclient.socketclient import get_devices, scan_devices, get_device_details

# from dagent.ibofos import *
from rest.rest_api.dagent.ibofos import scan_devices, get_devices, get_smart_info


def list_devices():
    #scan_dev = scan_devices()
    # if scan_dev.status_code != 200:
    #    return scan_dev
    scan_dev = scan_devices()
    print("scan_dev >>>",scan_dev.json())
    devices = get_devices()
    devices = devices.json()
    print("devices>>>",devices)
    if "return" in devices and devices["return"] == -1:
        return devices
    """elif ("result" in devices and devices["result"]["status"]["description"] == "NO DEVICE EXIST") or \
        ("result" in devices and "data" in devices["result"] and len(devices["result"]["data"]["devicelist"]) == 0) or \
            ("result" in devices and not("data" in devices)):
        scan_dev = scan_devices()
        if scan_dev.status_code != 200:
            return scan_dev
        else:
    """
    devices = get_devices()
    if devices.status_code != 200:
        return devices
    devices = devices.json()
    res = {
        'devices': [],
        'metadevices': []
    }
    print("devices i>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>     ???  ",devices)
    if "result" in devices and "data" in devices["result"] and "devicelist" in devices["result"]["data"]:
        for device in devices["result"]["data"]["devicelist"]:
            if device["type"] == 'NVRAM':  # and device["class"] !=  'SYSTEM':
                res['metadevices'].append(device["name"])
            elif device["type"] == 'SSD':  # and device["class"] !=  'SYSTEM':
                res['devices'].append({
                    "name": device["name"],
                    "size": device["size"],
                    "addr": device["addr"],
                    "class": device["class"],
                    "mn": device["mn"],
                    "sn": device["sn"],
                    "isAvailable":True,
                    "numa": device["numa"],
                    "arrayName" : ""
                })
    else:
        print("DDDDDDDDDDDDDDDDDDD else        DDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD ")
    return res

"""
def list_meta_devices():
    devices = get_devices()
    if "return" in devices and devices["return"] == -1:
        return devices
    elif "result" in devices and len(devices["result"]["data"]["devicelist"]) == 0:
        scan_dev = scan_devices()
        if "return" in scan_dev and scan_dev["return"] == -1:
            return scan_dev
        else:
            devices = get_devices()
            if "return" in devices and devices["return"] == -1:
                return devices
    res = []
    device_dict = {}
    for device in devices["result"]["data"]["devicelist"]:
        if "ram" in device["deviceName"]:
            dev = device["deviceName"].split()
            if dev[0] not in device_dict:
                res.append(dev[0])
            device_dict[dev[0]] = True
    return res
"""

def get_disk_details(name):
    details = get_smart_info(name)
    return details
