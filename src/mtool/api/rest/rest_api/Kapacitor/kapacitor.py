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
 *     * Neither the name of Intel Corporation nor the names of its
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
