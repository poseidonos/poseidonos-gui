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
import json
from bson import json_util
from flask import  abort, make_response


def toJson(data):
    return json_util.dumps(data)

def Get_Kapacitor_Entries():
    print("Inside Kapacitor Entries")
    r = requests.get(url="http://localhost:9092/kapacitor/v1/config/smtp/")
    data = r.json()
    kapacitorlist = data['options']['to']
    print("Gettttttt Kapacitor LIST", kapacitorlist)
    # print(r.text,r.content,r.status_code,"TEXT")
    if(r.status_code != 204 and r.status_code != 200):
        return abort(404)
    return kapacitorlist
"""
def Get_Email_IDs_From_Kapacitor():
    result = requests.get(url="http://localhost:9092/kapacitor/v1/config/smtp/")
    data = result.json()
    try:
        if(result.status_code == 200):
            emailList = data['options']['to']
            return emailList
        else:
            return None
    except Exception as e:
        return None
"""
def Update_KapacitorList(oldid=None, email=None, updateflag=0):
    try:
        result = requests.get(url="http://localhost:9092/kapacitor/v1/config/smtp/")
        data = result.json()
        kapacitorlist = data['options']['to']
        print("OLD ID", oldid, "New ID", email)
        print("Kapacitor LIST", kapacitorlist)
        if kapacitorlist is None:
            kapacitorlist = []
        if(oldid is not None and oldid in kapacitorlist):
            kapacitorlist.remove(oldid)
        kapacitorlist.append(email)
        tasks = {
            "set": {
            "enabled": True,
            "to": kapacitorlist
            }
       }
        result = requests.post(
            url="http://localhost:9092/kapacitor/v1/config/smtp/",
            data=toJson(tasks))
        print("response:",result.json())
        if(result.status_code != 200 and result.status_code != 204):
            return make_response(json.dumps({"description": "Failed to Update the Email List"}), 500)
        else:
            return make_response(json.dumps({"description": "Success"}), 200)
    except BaseException as e:
        print("exception in updating email ids in kapacitor",e)
        return make_response(json.dumps({"description": "Failed to Update the Email List"}), 500)

def Delete_MultipleID_From_KapacitorList(ids, singleIdFlag=False):
    print("Delete Email IDs")
    try:
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
        result = requests.post(
            url="http://localhost:9092/kapacitor/v1/config/smtp/",
            data=toJson(tasks))
        print("response:",result.json())
        if(result.status_code != 200 and result.status_code != 204):
            return make_response(json.dumps({"description": "Failed to Delete Email ID"}), 500)
        else:    
            return make_response(json.dumps({"description": "Email ID Deleted Successfully"}), 200)
    except BaseException as e:
        print("exception in deleting email ids from kapacitor",e)
        return make_response(json.dumps({"description": "Failed to Delete Email ID"}), 500)
