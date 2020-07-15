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
@NAME : kapacitor.py
@AUTHORS: Jay Hitesh Sanghavi
@Version : 1.0 *
@REVISION HISTORY
[03/06/2019] [Jay] : Prototyping..........////////////////////
*/
'''

import requests
from bson import json_util
from flask import Flask, abort


def toJson(data):
    return json_util.dumps(data)


def Get_Kapacitor_Entries():
    print("Inside Kapacitor Entries")
    r = requests.get(url="http://localhost:9092/kapacitor/v1/config/smtp/")
    data = r.json()
    kapacitorlist = data['options']['to']
    print("Kapacitor LIST", kapacitorlist)
    # print(r.text,r.content,r.status_code,"TEXT")
    if(r.status_code != 204 and r.status_code != 200):
        return abort(404)
    return kapacitorlist


def Update_KapacitorList(oldid=None, email=None, updateflag=0):
    r = requests.get(url="http://localhost:9092/kapacitor/v1/config/smtp/")
    data = r.json()
    kapacitorlist = data['options']['to']
    print("OLD ID", oldid, "New ID", email)
    print("Kapacitor LIST", kapacitorlist)
    if kapacitorlist is None:
        kapacitorlist = []
    if(updateflag):
        kapacitorlist.remove(oldid)
    kapacitorlist.append(email)
    tasks = {
        "set": {
            "to": kapacitorlist
        }
    }
    r = requests.post(
        url="http://localhost:9092/kapacitor/v1/config/smtp/",
        data=toJson(tasks))
    print(r.text, r.content, r.status_code, "TEXT")
    Get_Kapacitor_Entries()
    if(r.status_code != 204 and r.status_code != 200):
        return abort(404)
    return 'Success'


def Delete_MultipleID_From_KapacitorList(ids, singleIdFlag=False):
    print("delete ids", ids)
    kapacitorlist = Get_Kapacitor_Entries()
    if(singleIdFlag):
        kapacitorlist.remove(ids)
    else:
        for _id in ids:
            kapacitorlist.remove(_id)
    tasks = {
        "set": {
            "to": kapacitorlist
        }
    }
    r = requests.post(
        url="http://localhost:9092/kapacitor/v1/config/smtp/",
        data=toJson(tasks))
    abc = Get_Kapacitor_Entries()
    if(r.status_code != 204 and r.status_code != 200):
        return abort(404)
    return 'Success'
