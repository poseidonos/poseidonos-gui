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


DESCRIPTION: This file contains the handler functions for Swordfish APIs
@NAME : swordfish.py
@AUTHORS: Aswin K K 
@Version : 1.0
@REVISION HISTORY
[03/06/2019] [Aswin] : Added Volume Listing APIs
*/
'''
from flask import Blueprint
from rest.swordfish.volumes import Volume, VolumeCollection

swordfish_api = Blueprint('swordfish_api', __name__, template_folder='templates')

# Handler function for getting volume list
# Params: 
#       serviceId: Id of the storage service
# Returns a list of Volumes in Swordfish response format
@swordfish_api.route('/redfish/v1/StorageServices/<serviceId>/Volumes')
def get_volume_collection(serviceId):
    return VolumeCollection().get()

# Handler function for getting volume details
# Params: 
#       serviceId: Id of the storage service
#       volumeId: Id of the Volume
# Returns the details of a volume in Swordfish response format
@swordfish_api.route('/redfish/v1/StorageServices/<serviceId>/Volumes/<volumeId>')
def get_volume(serviceId, volumeId):
    return Volume().get(volumeId)
