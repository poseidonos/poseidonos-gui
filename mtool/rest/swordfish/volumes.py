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


DESCRIPTION: This file contains the volume related functions for Swordfish APIs
@NAME : volumes.py
@AUTHORS: Aswin K K
@Version : 1.0
@REVISION HISTORY
[03/06/2019] [Aswin] : Added Volume List and Volume Details GET APIs
*/
'''
from rest.rest_api.volume.volume import list_volume
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
        self.base_url = "/redfish/v1/StorageServices/1/Volumes/"

    # Get the volume list
    # Return list of volumes in Swordfish Response format
    def get(self):
        try:
            res = list_volume()
            self.volumes_list["Members@odata.count"] = len(res)
            for vol in res:
                self.volumes_list["Members"].append({
                    "@odata.id": self.base_url + str(vol["id"])
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
                "IP": get_ip_address(),
                "Port": "NA",
                "NQN": "NA"
            }
        }

    # Get the volume details
    # Params:
    #       vol_id: Id of the volume
    # Return details the of specified volume in Swordfish Response format
    def get(self, vol_id):
        try:
            ibof_vols = list_volume()
            for vol in ibof_vols:
                print("Print:___",vol)
                if str(vol["id"]) == vol_id:
                    self.volume["Name"] = vol["name"]
                    self.volume["Id"] = vol["id"]
                    self.volume["Status"]["Oem"]["VolumeStatus"] = vol["status"]
                    self.volume["Capacity"]["Data"]["ConsumedBytes"] = float(vol["total"]) - float(vol["remain"])
                    self.volume["Capacity"]["Data"]["AllocatedBytes"] = float(vol["total"])
                    self.volume["Oem"]["MaxBandwidth"] = vol["maxbw"]
                    self.volume["Oem"]["MaxIOPS"] = vol["maxiops"]
                    self.volume["@odata.id"] = "/redfish/v1/StorageServices/1/Volumes/" + \
                        str(vol["id"])
                    return json_util.dumps(self.volume)
        except Exception as e:
            print("Exception in getting Volume Details", e)
            return json_util.dumps({})
