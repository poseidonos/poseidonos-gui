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
@NAME : volume.py
@AUTHORS: Jay Hitesh Sanghavi
@Version : 1.0 *
@REVISION HISTORY
[03/06/2019] [Jay] : Prototyping..........////////////////////
*/
'''

#from socketclient.socketclient import create_vol, delete_vol, list_vol, mount_vol
import rest.rest_api.dagent.ibofos as dagent


def create_volume(
        vol_name,
        arr_name,
        size,
        count,
        suffix,
        mount_vol,
        stop_on_error,
        maxbw=0,
        maxiops=0):
    create_vol_response = dagent.create_volume(
        vol_name,
        arr_name,
        size,
        count,
        suffix,
        mount_vol,
        stop_on_error,
        maxbw,
        maxiops)
    if create_vol_response.status_code == 200:
        if count == 1 and mount_vol:
            dagent.mount_volume(vol_name, arr_name)
    return create_vol_response


def update_volume(data):
    update_vol_response = dagent.update_volume(data)
    return update_vol_response

def rename_volume(data):
    rename_vol_response = dagent.rename_volume(data)
    return rename_vol_response

def mount_volume(vol_name, array_name = dagent.array_names[0]):
    return dagent.mount_volume(vol_name, array_name)


def unmount_volume(vol_name, array_name = dagent.array_names[0]):
    return dagent.unmount_volume(vol_name, array_name)


def delete_volume(vol_name, array_name):
    return dagent.delete_volume(vol_name, array_name)


def list_volume(arr_name):
    vols = dagent.list_volumes(arr_name)
    try:
        #print('*************volumes in rest_api****', vols.json())
        if vols.status_code == 200:
            vols = vols.json()
            return vols['result']['data']['volumes']
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
        return []
    # return list_vol()


def get_max_vol_count():
    return dagent.max_vol_count()
