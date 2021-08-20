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
# print(OBJECT.get_email_list())


def test_get_current_user():
    assert OBJECT.get_current_user("admin") == "admin"
    result = OBJECT.get_prev_time_stamp()
    if not result:
        assert OBJECT.insert_time_stamp(TIME_STAMP) is None
    else:
        assert OBJECT.update_time_stamp(TIME_STAMP) is None
    result = OBJECT.get_prev_time_stamp()
    if not result:
        assert OBJECT.insert_time_stamp(TIME_STAMP) is None
    else:
        assert OBJECT.update_time_stamp(TIME_STAMP) is None
    assert OBJECT.insert_smtp_ip("107.102.11.25", "8888") is None
    OBJECT.get_email_list()


def check_email_exist_in_list(email):
    for i in range(0, len(EMAIL_LIST)):
        if EMAIL_LIST[i]['email'] == email:
            return True
    return False

"""
def test_email_func():
    for i in range(0, len(EMAIL_LIST)):
        email = EMAIL_LIST[i]['email']
        print("Email:i before ",email)
        result = OBJECT.find_email(email)
        result = False
        if not result:
            print("email 1 :",email)
            print("insert ",OBJECT.insert_email(email,email))
            assert OBJECT.insert_email(email,email) is None
    OBJECT.get_email_list()
    OBJECT.get_smtp_details()
    #assert OBJECT.get_email_list() == email_list
"""

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


def test_toggle_status_from_db():
    assert OBJECT.toggle_status_from_db(USER_LIST[0]["_id"], False)
    assert OBJECT.toggle_status_from_db(USER_LIST[0]["_id"], True)

"""
def test_update_user_in_db():
    global USER_LIST
    assert OBJECT.update_user_in_db(
        "aaaaaaaa",
        "aaa@aaa.com",
        "1231231230",
        USER_LIST[1]["_id"])
    USER_LIST[1]["_id"] = "aaaaaaaa"
    USER_LIST[1]["email"] = "aaa@aaa.com"
    USER_LIST[1]["phone_number"] = "1231231230"
    assert OBJECT.update_user_in_db(
        "dddddddd",
        "ddd@ddd.com",
        "1231200000",
        USER_LIST[2]["_id"])
    USER_LIST[2]["_id"] = "dddddddd"
    USER_LIST[2]["email"] = "ddd@ddd.com"
    USER_LIST[2]["phone_number"] = "1231200000"
    test_get_users()
"""

def test_update_password():
    global USER_LIST
    assert OBJECT.update_password_in_db(
        USER_LIST[1]["_id"], USER_LIST[1]["password"], "456")
    assert OBJECT.update_password_in_db(
        USER_LIST[2]["_id"], USER_LIST[2]["password"], "456")
    USER_LIST[1]["password"] = "456"
    USER_LIST[2]["password"] = "456"
    test_get_users()

"""
def test_add_alert_in_db():
    for i in range(0, len(ALERT_LIST)):
        assert OBJECT.add_alert_in_db(
            ALERT_LIST[i]["alertName"],
            ALERT_LIST[i]["alertCluster"],
            ALERT_LIST[i]["alertSubCluster"],
            ALERT_LIST[i]["alertType"],
            ALERT_LIST[i]["alertCondition"],
            ALERT_LIST[i]["alertField"],
            ALERT_LIST[i]["description"],
            ALERT_LIST[i]["alertRange"],
            ALERT_LIST[i]["active"]) is None

def test_get_alerts_from_db():
    assert OBJECT.get_alerts_from_db() == ALERT_LIST

def test_delete_alerts_in_db():
    assert OBJECT.delete_alerts_in_db(ALERT_LIST[0]["alertName"]) is None
    assert OBJECT.delete_alerts_in_db(ALERT_LIST[1]["alertName"]) is None
    del ALERT_LIST[0]
    del ALERT_LIST[0]
    test_get_alerts_from_db()

def test_update_alerts_in_db():  # alertName,description,alertRange,alertCondition
    global ALERT_LIST
    assert OBJECT.update_alerts_in_db(
        ALERT_LIST[0]["alertName"], "des1", "13", "Equal to")
    assert OBJECT.update_alerts_in_db(
        ALERT_LIST[1]["alertName"], "des2", "14", "Equal to")
    assert OBJECT.update_alerts_in_db(
        ALERT_LIST[2]["alertName"], "des3", "15", "Equal to")
    ALERT_LIST[0]["description"] = "des1"
    ALERT_LIST[0]["alertRange"] = "13"
    ALERT_LIST[0]["alertCondition"] = "Equal to"

    ALERT_LIST[1]["description"] = "des2"
    ALERT_LIST[1]["alertRange"] = "14"
    ALERT_LIST[1]["alertCondition"] = "Equal to"

    ALERT_LIST[2]["description"] = "des3"
    ALERT_LIST[2]["alertRange"] = "15"
    ALERT_LIST[2]["alertCondition"] = "Equal to"
    # test_get_alerts_from_db()

def test_toggle_alert_status_in_db():
    global ALERT_LIST
    assert OBJECT.toggle_alert_status_in_db(ALERT_LIST[0]["alertName"], False)
    assert OBJECT.toggle_alert_status_in_db(ALERT_LIST[1]["alertName"], True)
    assert OBJECT.toggle_alert_status_in_db(ALERT_LIST[2]["alertName"], True)
    ALERT_LIST[0]["active"] = False
    ALERT_LIST[1]["active"] = True
    ALERT_LIST[2]["active"] = True
    test_get_alerts_from_db()
"""

def test_set_live_logs_in_db():
    global USER_LIST
    assert OBJECT.set_live_logs_in_db(False, USER_LIST[1]["_id"]) is None
    assert OBJECT.set_live_logs_in_db(False, USER_LIST[2]["_id"]) is None
    assert OBJECT.set_live_logs_in_db(False, USER_LIST[3]["_id"]) is None
    USER_LIST[1]["livedata"] = False
    USER_LIST[2]["livedata"] = False
    USER_LIST[3]["livedata"] = False
    test_get_users()


def test_get_live_logs_from_db():
    assert OBJECT.get_live_logs_from_db(
        USER_LIST[0]["_id"]) == USER_LIST[0]["livedata"]
    assert OBJECT.get_live_logs_from_db(
        USER_LIST[1]["_id"]) == USER_LIST[1]["livedata"]
    assert OBJECT.get_live_logs_from_db(
        USER_LIST[2]["_id"]) == USER_LIST[2]["livedata"]
    assert OBJECT.get_live_logs_from_db(
        USER_LIST[3]["_id"]) == USER_LIST[3]["livedata"]
    assert OBJECT.get_live_logs_from_db(
        USER_LIST[4]["_id"]) == USER_LIST[4]["livedata"]


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


def test_get_ibofos_time_interval_from_db():
    assert OBJECT.get_ibofos_time_interval_from_db(
        USER_LIST[0]["_id"]) == USER_LIST[0]["ibofostimeinterval"]
    assert OBJECT.get_ibofos_time_interval_from_db(
        USER_LIST[1]["_id"]) == USER_LIST[1]["ibofostimeinterval"]
    assert OBJECT.get_ibofos_time_interval_from_db(
        USER_LIST[2]["_id"]) == USER_LIST[2]["ibofostimeinterval"]


def test_set_ibofos_time_interval_in_db():
    assert OBJECT.set_ibofos_time_interval_in_db(USER_LIST[1]["_id"], 5)
    assert OBJECT.set_ibofos_time_interval_in_db(USER_LIST[2]["_id"], 6)
    assert OBJECT.set_ibofos_time_interval_in_db(USER_LIST[3]["_id"], 7)
    assert OBJECT.set_ibofos_time_interval_in_db(USER_LIST[4]["_id"], 8)


#OBJECT.update_email_list("abc@abc.com", "xyz@xyz.com")
"""
test_get_current_user()
test_email_func()
test_add_new_user()
test_delete_users()
test_get_users()
test_toggle_status_from_db()
test_update_user_in_db()
test_update_password()
test_add_alert_in_db()
test_get_alerts_from_db()
test_delete_alerts_in_db()
test_update_alerts_in_db()
test_toggle_alert_status_in_db()
test_set_live_logs_in_db()
test_get_live_logs_from_db()
test_match_username_from_db()
test_match_email_from_db()
test_get_ibofos_time_interval_from_db()
test_set_ibofos_time_interval_in_db()
"""
