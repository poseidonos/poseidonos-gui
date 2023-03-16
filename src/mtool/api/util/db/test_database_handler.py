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
 
from database_handler import DBConnection,DBType
#import database_handler
import os
from generate_data import  EMAIL_LIST, USER_LIST

os.system('rm ibof.db')

CONNECTION_OBJ = DBConnection()
OBJECT = CONNECTION_OBJ.get_db_connection(DBType.SQLite)  # SQLite/MongoDB
OBJECT.connect_database()
OBJECT.create_default_database()


TIME_STAMP = "Fri, 12 Feb 2020 02:14:42 PM IST"

def check_email_exist_in_list(email):
    for i in range(0, len(EMAIL_LIST)):
        if EMAIL_LIST[i]['email'] == email:
            return True
    return False

def test_add_new_user():
    for i in range(1, len(USER_LIST)):
        assert OBJECT.add_new_user_in_db(
            USER_LIST[i]["_id"],
            USER_LIST[i]["password"],
            USER_LIST[i]["email"],
            USER_LIST[i]["phone_number"],
            USER_LIST[i]["role"],
            USER_LIST[i]["active"],
            USER_LIST[i]["privileges"],
            USER_LIST[i]["ibofostimeinterval"],
            USER_LIST[i]["livedata"])


def test_delete_users():
    for i in range(1, len(USER_LIST)):
        assert OBJECT.delete_users_in_db([USER_LIST[i]["_id"]]) is None
    test_add_new_user()


def compare_user_list(list1, list2):
    if len(list1) != len(list2):
        return False
    else:
        for json1, json2 in zip(list1, list2):
            if json1['_id'] != json2['_id'] and json1['password'] != json2['password'] and json1['email'] != json2['email'] and json1['phone_number'] != json2['phone_number'] and json1['role'] != json2[
                    'role'] and json1['active'] != json2['active'] and json1['privileges'] != json2['privileges'] and json1['ibofostimeinterval'] != json2['ibofostimeinterval'] and json1['livedata'] != json2['livedata']:
                return False
        return True


def test_get_users():
    list_from_db = OBJECT.get_users_from_db()
    #print("in compare ",list_from_db,USER_LIST,compare_user_list(list_from_db,USER_LIST))
    #print("in compare ",compare_user_list(list_from_db,USER_LIST))
    assert compare_user_list(list_from_db, USER_LIST)
    #assert OBJECT.get_users_from_db() == USER_LIST


def test_update_password():
    assert OBJECT.update_password_in_db(
        USER_LIST[1]["_id"], USER_LIST[1]["password"], "456")
    assert OBJECT.update_password_in_db(
        USER_LIST[2]["_id"], USER_LIST[2]["password"], "456")
    USER_LIST[1]["password"] = "456"
    USER_LIST[2]["password"] = "456"
    test_get_users()

def test_match_username_from_db():
    assert OBJECT.match_username_from_db(
        USER_LIST[0]["_id"],
        USER_LIST[0]["password"]) == USER_LIST[0]["_id"]
    assert OBJECT.match_username_from_db(
        USER_LIST[1]["_id"],
        USER_LIST[1]["password"]) == USER_LIST[1]["_id"]
    assert OBJECT.match_username_from_db(
        USER_LIST[2]["_id"],
        USER_LIST[2]["password"]) == USER_LIST[2]["_id"]
    assert OBJECT.match_username_from_db(
        USER_LIST[3]["_id"],
        USER_LIST[3]["password"]) == USER_LIST[3]["_id"]
    assert OBJECT.match_username_from_db(
        USER_LIST[2]["_id"], "wrongvalue") == ""
    assert OBJECT.match_username_from_db(
        USER_LIST[3]["_id"], "wrongvalue") == ""


def test_match_email_from_db():
    assert OBJECT.match_email_from_db(
        USER_LIST[0]["email"],
        USER_LIST[0]["password"]) == USER_LIST[0]["_id"]
    assert OBJECT.match_email_from_db(
        USER_LIST[1]["email"],
        USER_LIST[1]["password"]) == USER_LIST[1]["_id"]
    assert OBJECT.match_email_from_db(
        USER_LIST[2]["email"],
        USER_LIST[2]["password"]) == USER_LIST[2]["_id"]
    assert OBJECT.match_email_from_db(
        USER_LIST[3]["email"],
        USER_LIST[3]["password"]) == USER_LIST[3]["_id"]
    assert OBJECT.match_email_from_db(
        USER_LIST[2]["email"], "wrongvalue") == ""
    assert OBJECT.match_email_from_db(
        USER_LIST[3]["email"], "wrongvalue") == ""