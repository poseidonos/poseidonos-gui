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

#from socketclient.socketclient import create_vol, delete_vol, list_vol, mount_vol
import rest.rest_api.dagent.ibofos as dagent
from bson import json_util

def create_volume(
        vol_name,
        arr_name,
        size,
        count,
        suffix,
        mount_vol,
        stop_on_error,
        maxbw=0,
        maxiops=0,
        minbw=0,
        miniops=0,
        subsystem="",
        iswalvol=False):
    create_vol_response = dagent.create_volume(
        vol_name,
        arr_name,
        size,
        count,
        suffix,
        mount_vol,
        stop_on_error,
        maxbw,
        maxiops,
        minbw,
        miniops,
        subsystem["subnqn"],subsystem["transport_type"],subsystem["transport_service_id"],subsystem["target_address"],
        iswalvol)
    if create_vol_response.status_code == 200:
        if count == 1 and mount_vol:
            res = None
            if "target_address" in subsystem and subsystem["target_address"] != "" and "transport_service_id" in subsystem and subsystem["transport_service_id"] != "":
                res = dagent.mount_volume_with_subsystem(
                    vol_name, arr_name, subsystem)
            elif "subnqn" in subsystem:
                res = dagent.mount_volume(
                    vol_name, arr_name, subsystem["subnqn"])
            if res is None:
                return json_util.dumps({})
            if res.status_code != 200:
                return res.json()
            if minbw == 0 and miniops == 0:
                request_body = {"param": {"array": arr_name,
                                          "minbw": minbw, "vol": [{"volumeName": vol_name}]}}
            elif minbw > 0:
                request_body = {"param": {"array": arr_name,
                                          "minbw": minbw, "vol": [{"volumeName": vol_name}]}}
            else:
                request_body = {"param": {"array": arr_name,
                                          "miniops": miniops,
                                          "vol": [{"volumeName": vol_name}]}}
            request_body["param"]["maxiops"] = maxiops
            request_body["param"]["maxbw"] = maxbw
            response = dagent.qos_create_volume_policies(request_body)
            response = response.json()
            if "result" in response and "status" in response["result"] and "code" in response[
                    "result"]["status"] and response["result"]["status"]["code"] != 0:
                create_vol_response = create_vol_response.json()
                if "result" in create_vol_response and "status" in create_vol_response["result"] and "posDescription" in create_vol_response["result"]["status"]:
                    if create_vol_response["result"]["status"]["posDescription"] == "NONE":
                        create_vol_response["result"]["status"]["posDescription"] = response["result"]["status"]["posDescription"] 
                    else:    
                        create_vol_response["result"]["status"]["posDescription"] += " "+response["result"]["status"]["posDescription"] 
                    create_vol_response["result"]["status"]["code"] = response["result"]["status"]["code"]
                return create_vol_response
            
    return create_vol_response.json()


"""def update_volume(data):
    update_vol_response = dagent.update_volume(data)
    return update_vol_response"""


def rename_volume(data):
    rename_vol_response = dagent.rename_volume(data)
    return rename_vol_response


def mount_volume(vol_name, array_name=dagent.array_names[0], subnqn=None):
    return dagent.mount_volume(vol_name, array_name, subnqn)


def unmount_volume(vol_name, array_name=dagent.array_names[0]):
    return dagent.unmount_volume(vol_name, array_name)


def delete_volume(vol, array_name):
    return dagent.delete_volume(vol, array_name)


def list_volume(arr_name):
    vols = dagent.list_volumes(arr_name)
    try:
        #print('*************volumes in rest_api****', vols.json())
        if vols.status_code == 200:
            vols = vols.json()
            if "data" in vols["result"] and "volumes" in vols["result"]["data"]:
                if vols["result"]["data"]["volumes"] is not None:
                    return vols["result"]["data"]["volumes"]
                else:
                    return []
            else:
                return []
        elif "data" in vols.json()["result"]:
            # print(vols.content)
            if "volumes" in vols["result"]["data"]:
                return vols["result"]["data"]["volumes"]
            else:
                return []
        # if not "data" in vols["result"] and "status" in vols["result"] and
        # vols["result"]["status"]["code"] == "200000":
        else:
            return []
    except Exception as e:
        print("Exception in list_volume()",e)
        return []
    # return list_vol()


def volume_info(arr_name, vol_name):
    vol = dagent.volume_info(arr_name, vol_name)
    try:
        if vol.status_code == 200:
            vol = vol.json()
            return vol['result']['data']
        else:
            return {}
    except BaseException:
        return {}


def get_max_vol_count():
    return dagent.max_vol_count()
