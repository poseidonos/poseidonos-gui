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
@NAME : array.py
@AUTHORS: Jay Hitesh Sanghavi
@Version : 1.0 *
@REVISION HISTORY
[03/06/2019] [Jay] : Prototyping..........////////////////////
*/
'''

#from socketclient.socketclient import scan_devices, create_array, list_array
from rest.rest_api.dagent.ibofos import array_names, create_array, array_status, array_info, array_exists


def create_arr(name, raidtype, spare, devices, metadevice):
    return create_array(name, raidtype, spare, devices, metadevice)

def get_arr_status():
    return array_status()

def check_arr_exists(arrayname):
    return array_exists(arrayname)

def arr_info(array_name):
    # scan_devices()
    return  array_info(array_name)
    # if arrays["num_arr"] > 0:
    #     get_array_stats()
    # retur
