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
from rest.rest_api.volume.volume import list_volume, volume_info
from bson import json_util
from util.com.common import get_ip_address


class VolumeCollection():
    def __init__(self):
        self.volumes_list = {
            "@odata.type": "#VolumeCollection_1_0_0.VolumeCollection",
            "Name": "Volumes",
            "Members@odata.count": 0,
            "@odata.id": "/redfish/v1/StorageServices/1/Volumes",
            "@odata.context": "/redfish/v1/$metadata#VolumeCollection.VolumeCollection",
            "Members": [],
            "Permissions": [
                    {"Read": "True"},
                    {"Write": "True"}
            ]
        }
        self.base_url = "/redfish/v1/StorageServices/{}/Volumes/"

    # Get the volume list
    # Return list of volumes in Swordfish Response format
    def get(self, array_name):
        try:
            res = list_volume(array_name)
            self.volumes_list["Members@odata.count"] = len(res)
            url = self.base_url.format(array_name)
            for vol in res:
                self.volumes_list["Members"].append({
                    "@odata.id": url + str(vol["index"])
                })
            return json_util.dumps(self.volumes_list)
        except Exception as e:
            print("Exception in listing Volumes", e)
            return json_util.dumps([])


class Volume():
    def __init__(self):
        self.volume = {
            "@odata.context": "redfish/v1/$metadata#Volume.Volume",
            "@odata.type": "#Volume_1_0_0.Volume",
            "Name": "",
            "Id": "",
            "Description": "",
            "Status": {
                  "Health": "OK",
                  "Oem": {
                      "VolumeStatus": True
                  }
            },
            "AccessCapabilities": [
                "Read",
                "Write",
                "Append",
                "Streaming"
            ],
            "BlockSizeBytes": 512,
            "Capacity": {
                "Data": {
                    "ConsumedBytes": 0,
                    "AllocatedBytes": 0
                }
            },
            "Oem": {
                "MaxBandwidth": 0,
                "MaxIOPS": 0,
                "MinIOPS": 0,
                "MinBandwidth": 0,
                "IP": get_ip_address(),
                "Port": "NA",
                "NQN": "NA",
                "UUID": ""
            }
        }
        self.base_url = "/redfish/v1/StorageServices/{}/Volumes/"
    # Get the volume details
    # Params:
    #       vol_id: Id of the volume
    # Return details the of specified volume in Swordfish Response format
    def get(self, vol_id, array_name):
        try:
            ibof_vols = list_volume(array_name)
            url = self.base_url.format(array_name)
            for ibof_vol in ibof_vols:
                if str(ibof_vol["index"]) == vol_id:
                    vol = volume_info(array_name, ibof_vol["name"])
                    self.volume["Name"] = vol["name"]
                    self.volume["Id"] = vol_id
                    self.volume["Status"]["Oem"]["VolumeStatus"] = vol["status"]
                    if "remain" in vol:
                        self.volume["Capacity"]["Data"]["ConsumedBytes"] = float(vol["total"]) - float(vol["remain"])
                    self.volume["Capacity"]["Data"]["AllocatedBytes"] = float(vol["total"])
                    self.volume["Oem"]["MaxBandwidth"] = vol["maxbw"]
                    self.volume["Oem"]["MaxIOPS"] = vol["maxiops"]
                    if "subnqn" in vol:
                        self.volume["Oem"]["NQN"] = vol["subnqn"]
                    self.volume["Oem"]["UUID"] = vol["uuid"]
                    self.volume["Oem"]["MinBandwidth"] = vol["minbw"]
                    self.volume["Oem"]["MinIOPS"] = vol["miniops"]
                    self.volume["@odata.id"] = url + str(vol_id)
                    return json_util.dumps(self.volume)
            return json_util.dumps({})
        except Exception as e:
            print("Exception in getting Volume Details", e)
            return json_util.dumps({})
