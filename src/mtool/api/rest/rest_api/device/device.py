'''
/*
 *   BSD LICENSE
 *   Copyright (c) 2021 Samsung Electronics Corporation
 *   All rights reserved.
 *
 *   Redistribution and use in source and binary forms, with or without
 *   modification, are permitted provided that the following conditions
 *   are met:
 *
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in
 *       the documentation and/or other materials provided with the
 *       distribution.
 *     * Neither the name of Samsung Electronics Corporation nor the names of its
 *       contributors may be used to endorse or promote products derived
 *       from this software without specific prior written permission.
 *
 *   THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 *   "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 *   LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 *   A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 *   OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 *   SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 *   LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 *   DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 *   THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 *   (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 *   OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
 '''

#from socketclient.socketclient import get_devices, scan_devices, get_device_details

# from dagent.ibofos import *
from rest.rest_api.dagent.ibofos import get_devices, get_smart_info, scan_devices


def list_devices():
    #scan_dev = scan_devices()
    # if scan_dev.status_code != 200:
    #    return scan_dev
    scan = scan_devices()
    if scan.status_code != 200:
        return scan
    devices = get_devices()
    devices = devices.json()
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
    if "result" in devices and "data" in devices["result"] and "devicelist" in devices["result"]["data"]:
        for device in devices["result"]["data"]["devicelist"]:
            if device["type"] == 'NVRAM':  # and device["class"] !=  'SYSTEM':
                meta_device = {"name":device["name"], "isAvailable":True,"arrayName":"","displayMsg":device["name"],"trimmedDisplayMsg":device["name"]}
                res['metadevices'].append(meta_device)
            elif device["type"] == 'SSD':  # and device["class"] !=  'SYSTEM':
                res['devices'].append({
                    "name": device["name"],
                    "size": device["size"],
                    "addr": device["address"],
                    "class": device["class"],
                    "mn": device["modelNumber"],
                    "sn": device["serialNumber"],
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
