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
 
import enum
import sqlite3
#import re
#from flask import make_response
import os
#from rest.rest_api.Kapacitor.kapacitor import Delete_MultipleID_From_KapacitorList, Update_KapacitorList
#from rest.rest_api.alerts.system_alerts import create_kapacitor_alert, update_in_kapacitor, delete_alert_from_kapacitor, toggle_in_kapacitor

"""
try:
    import pymongo
    from pymongo import MongoClient
    from pymodm import connect
    from util.db.model import User
except BaseException:
    pass
"""
# below 3 lines will be part of app.py/any code to connect db and do db
# operations
"""
conFactory = get_DB_CONNECTION(DBType.SQLite) #SQLite,MongoDB
conFactory.connect_database()
conFactory.create_default_database()
"""

DB_CONNECTION = ""
SQLITE_DB_PATH = os.getcwd() + "/"
DB_NAME = "ibof.db"
TELEMETRY_TABLE = "telemetry"
USER_TABLE = "user"
EMAILLIST_TABLE = "emaillist"
COUNTERS_TABLE = "counters"
SMTP_TABLE = "smtpdetails"
IBOFOS_TIMESTAMP_TABLE = "iBOFOS_Timestamp"
USER_ALERTS_TABLE = "user_alerts"
MONGODB_DB_NAME = "ibof"
MONGODB_URL = "mongodb://localhost:27017/"
USER_TABLE_COLUMNS = (
    "_id",
    "password",
    "email",
    "phone_number",
    "role",
    "active",
    "privileges",
    "ibofostimeinterval",
    "livedata")
USER_TABLE_DEFAULTS_VALUES = (
    "admin",
    "admin",
    "admin@corp.com",
    "xxxxxxxxxx",
    "admin",
    True,
    "Create, Read, Edit, Delete",
    4,
    True)
USER_TABLE_DEFAULT_QUERY = "INSERT INTO " + USER_TABLE + " (" + USER_TABLE_COLUMNS[0] + "," + USER_TABLE_COLUMNS[1] + "," + USER_TABLE_COLUMNS[2] + "," + USER_TABLE_COLUMNS[3] + \
    "," + USER_TABLE_COLUMNS[4] + "," + USER_TABLE_COLUMNS[5] + "," + USER_TABLE_COLUMNS[6] + "," + USER_TABLE_COLUMNS[7] + "," + USER_TABLE_COLUMNS[8] + ") VALUES(?,?,?,?,?,?,?,?,?)"


USER_ALERTS_TABLE_COLUMNS = (
    "alertName",
    "alertCluster",
    "alertSubCluster",
    "alertType",
    "alertCondition",
    "alertField",
    "description",
    "alertRange",
    "active")

TELEMETRY_TABLE_QUERY = "CREATE TABLE IF NOT EXISTS " + TELEMETRY_TABLE + " (ip text,port text);"

USER_TABLE_QUERY = "CREATE TABLE IF NOT EXISTS " + USER_TABLE + " (" + USER_TABLE_COLUMNS[0] + " text," + USER_TABLE_COLUMNS[1] + " text," + USER_TABLE_COLUMNS[2] + " text," + USER_TABLE_COLUMNS[3] + \
    " text," + USER_TABLE_COLUMNS[4] + " text," + USER_TABLE_COLUMNS[5] + " bool," + USER_TABLE_COLUMNS[6] + " text," + USER_TABLE_COLUMNS[7] + " integer," + USER_TABLE_COLUMNS[8] + " bool);"
USER_ALERTS_TABLE_QUERY = "CREATE TABLE IF NOT EXISTS " + USER_ALERTS_TABLE + " (" + USER_ALERTS_TABLE_COLUMNS[0] + " text," + USER_ALERTS_TABLE_COLUMNS[1] + " text," + USER_ALERTS_TABLE_COLUMNS[2] + " text," + USER_ALERTS_TABLE_COLUMNS[
    3] + " text," + USER_ALERTS_TABLE_COLUMNS[4] + " text," + USER_ALERTS_TABLE_COLUMNS[5] + " text," + USER_ALERTS_TABLE_COLUMNS[6] + " text," + USER_ALERTS_TABLE_COLUMNS[7] + " text," + USER_ALERTS_TABLE_COLUMNS[8] + " bool);"

SMTP_TABLE_QUERY = "CREATE TABLE IF NOT EXISTS " + \
    SMTP_TABLE + " (_id text,serverip text,serverport text);"
EMAILLIST_TABLE_QUERY = "CREATE TABLE IF NOT EXISTS " + \
    EMAILLIST_TABLE + " (email text,active bool);"
COUNTERS_TABLE_QUERY = "CREATE TABLE IF NOT EXISTS " + \
    COUNTERS_TABLE + " (_id text,counter integer);"
TIMESTAMP_TABLE_QUERY = "CREATE TABLE IF NOT EXISTS " + \
    IBOFOS_TIMESTAMP_TABLE + " (_id text,lastRunningTime text);"

TELEMETRY_QUERY = "SELECT * FROM " + TELEMETRY_TABLE
INSERT_TELEMETRY_QUERY = "INSERT INTO " + TELEMETRY_TABLE + " (ip,port) VALUES(?,?)"
UPDATE_TELEMETRY_QUERY = "UPDATE " + TELEMETRY_TABLE + \
    " SET ip = ?, port = ?"
DELETE_TELEMETRY_QUERY = "DELETE FROM " + TELEMETRY_TABLE
USER_QUERY = "SELECT _id FROM " + \
    USER_TABLE + " WHERE lower(_id) = ? and password = ?"
DEFAULT_USER_QUERY = "SELECT _id FROM " + USER_TABLE
PREV_TIME_QUERY = "SELECT _id,lastRunningTime FROM " + \
    IBOFOS_TIMESTAMP_TABLE + " WHERE _id=?"
INSERT_TIME_QUERY = "INSERT INTO " + IBOFOS_TIMESTAMP_TABLE + \
    " (_id,lastRunningTime) VALUES(?,?)"
UPDATE_TIME_QUERY = "UPDATE " + IBOFOS_TIMESTAMP_TABLE + \
    " SET lastRunningTime = ? where _id = 'TIMESTAMP'"
SELECT_SMTP_QUERY = "SELECT _id FROM " + SMTP_TABLE + " WHERE lower(_id)=?"
INSERT_SMTP_IP_QUERY = "INSERT INTO " + SMTP_TABLE + \
    " (_id,serverip,serverport) VALUES(?,?,?)"
UPDATE_SMTP_QUERY = "UPDATE " + SMTP_TABLE + \
    " SET _id = ?, serverip = ?, serverport = ? where lower(_id) = ?"
EMAILLIST_QUERY = "SELECT * FROM " + EMAILLIST_TABLE
SMTP_QUERY = "SELECT * FROM " + SMTP_TABLE
FIND_EMAIL_QUERY = "SELECT email FROM " + EMAILLIST_TABLE + " WHERE lower(email) = ?"
INSERT_EMAIL_QUERY = "INSERT INTO " + \
    EMAILLIST_TABLE + " (email,active) VALUES(?,?)"
UPDATE_EMAIL_QUERY = "UPDATE " + EMAILLIST_TABLE + " SET email = ? where lower(email) = ?"
SELECT_EMAIL_QUERY = "SELECT email FROM " + EMAILLIST_TABLE + " WHERE lower(email)=?"
DELETE_EMAIL_QUERY = "DELETE FROM " + EMAILLIST_TABLE + " WHERE lower(email)=?"
TOGGLE_EMAIL_UPDATE_QUERY = "UPDATE " + \
    EMAILLIST_TABLE + " SET active = ? where lower(email) = ?"
ADD_USER_QUERY = "INSERT INTO " + USER_TABLE + " " + \
    str(USER_TABLE_COLUMNS) + " VALUES(?,?,?,?,?,?,?,?,?)"
IBOFOS_TIME_INTERVAL_QUERY = "SELECT ibofostimeinterval FROM " + \
    USER_TABLE + " WHERE lower(_id) = ? LIMIT 1"
SET_IBOFOS_TIME_INTERVAL_QUERY = "UPDATE " + USER_TABLE + \
    " SET ibofostimeinterval = ? where lower(_id) = ?"
DELETE_USER_QUERY = "DELETE FROM " + USER_TABLE + " WHERE lower(_id)=?"
USERS_QUERY = "SELECT * FROM " + USER_TABLE
CHECK_USER_QUERY = "SELECT _id FROM " + USER_TABLE + " WHERE lower(_id) = ?"
CHECK_EMAIL_QUERY = "SELECT _id FROM " + USER_TABLE + " WHERE lower(email) = ?"
TOGGLE_STATUS_UPDATE_QUERY = "UPDATE " + \
    USER_TABLE + " SET active = ? where lower(_id) = ?"
UPDATE_USER_QUERY = "UPDATE " + USER_TABLE + \
    " SET _id = ?, email = ?, phone_number = ? where lower(_id) = ?"
SELECT_PASSWORD_QUERY = "SELECT _id FROM " + \
    USER_TABLE + " WHERE lower(_id) = ? and password = ?"
UPDATE_PASSWORD_QUERY = "UPDATE " + USER_TABLE + " SET password = ? where lower(_id) = ?"
ADD_ALERT_QUERY = "INSERT INTO " + USER_ALERTS_TABLE + " " + \
    str(USER_ALERTS_TABLE_COLUMNS) + " VALUES(?,?,?,?,?,?,?,?,?)"
GET_ALERTS_QUERY = "SELECT * FROM " + USER_ALERTS_TABLE
DELETE_ALERT_QUERY = "DELETE FROM " + USER_ALERTS_TABLE + " WHERE alertName=?"
SELECT_ALERT_QUERY = "SELECT alertName FROM " + \
    USER_ALERTS_TABLE + " WHERE alertName = ?"
UPDATE_ALERT_QUERY = "UPDATE " + USER_ALERTS_TABLE + \
    " SET description = ?, alertRange = ?, alertCondition = ? where alertName = ?"
TOGGLE_ALERT_STATUS_QUERY = "SELECT alertName FROM " + \
    USER_ALERTS_TABLE + " WHERE alertName = ? "
UPDATE_TOGGLE_ALERT_QUERY = "UPDATE " + \
    USER_ALERTS_TABLE + " SET active = ? where alertName = ?"
UPDATE_LIVELOG_STATUS_QUERY = "UPDATE " + \
    USER_TABLE + " SET livedata = ? where lower(_id) = ?"
SELECT_LIVELOG_STATUS_QUERY = "SELECT livedata FROM " + \
    USER_TABLE + " WHERE lower(_id) = ? LIMIT 1"
MATCH_USERNAME_QUERY = "SELECT _id FROM " + USER_TABLE + \
    " WHERE lower(_id) = ? and password = ? and active = 1 LIMIT 1"
MATCH_EMAIL_QUERY = "SELECT _id FROM " + USER_TABLE + \
    " WHERE lower(email) = ? and password = ? and active = 1 LIMIT 1"


class SQLiteConnection:
    def connect_database(self):
        global DB_CONNECTION
        connection = None
        try:
            connection = sqlite3.connect(
                SQLITE_DB_PATH + DB_NAME,
                check_same_thread=False)
        except sqlite3.Error as sqlite_ex:
            print("Exception in database connection" + sqlite_ex)
        except Exception as ex:
            print("Exception in database connection" + ex)
        DB_CONNECTION = connection

    def create_default_database(self):
        cur = DB_CONNECTION.cursor()
        cur.execute(TELEMETRY_TABLE_QUERY)
        cur.execute(USER_TABLE_QUERY)
        cur.execute(EMAILLIST_TABLE_QUERY)
        cur.execute(COUNTERS_TABLE_QUERY)
        cur.execute(TIMESTAMP_TABLE_QUERY)
        cur.execute(USER_ALERTS_TABLE_QUERY)
        cur.execute(SMTP_TABLE_QUERY)
        cur = DB_CONNECTION.cursor()
        is_user_table_exist = None
        try:
            cur.execute(DEFAULT_USER_QUERY)
            is_user_table_exist = cur.fetchone()
        except BaseException:
            pass
        if is_user_table_exist is None:
            cur.execute(USER_TABLE_DEFAULT_QUERY, USER_TABLE_DEFAULTS_VALUES)
        DB_CONNECTION.commit()

    def get_telemetery_url(self):
        cur = DB_CONNECTION.cursor()
        cur.execute(TELEMETRY_QUERY)
        rows = cur.fetchone()
        return rows

    def update_telemetry_url(self, ip, port):
        cur = DB_CONNECTION.cursor()
        cur.execute(TELEMETRY_QUERY)
        rows = cur.fetchone()
        if rows is None or len(rows) == 0:
            cur.execute(INSERT_TELEMETRY_QUERY, (ip, port))
        else:
            cur.execute(UPDATE_TELEMETRY_QUERY, (ip, port))
        DB_CONNECTION.commit()

    def delete_telemetery_url(self):
        cur = DB_CONNECTION.cursor()
        cur.execute(DELETE_TELEMETRY_QUERY)
        DB_CONNECTION.commit()

    def get_current_user(self, username):
        cur = DB_CONNECTION.cursor()
        cur.execute(USER_QUERY, (username, "admin"))
        rows = cur.fetchone()
        if rows is None or len(rows) == 0:
            return False
        return rows[0]

    def get_prev_time_stamp(self):
        cur = DB_CONNECTION.cursor()
        cur.execute(PREV_TIME_QUERY, ('TIMESTAMP',))
        rows = cur.fetchone()
        if rows is None or len(rows) == 0:
            return False
        return rows[1]

    def insert_time_stamp(self, last_running_time):
        cur = DB_CONNECTION.cursor()
        cur.execute(INSERT_TIME_QUERY, ('TIMESTAMP', last_running_time))
        DB_CONNECTION.commit()

    def update_time_stamp(self, last_running_time):
        cur = DB_CONNECTION.cursor()
        cur.execute(UPDATE_TIME_QUERY, (last_running_time,))
        DB_CONNECTION.commit()

    def check_user_id_exist(self,username):
        cur = DB_CONNECTION.cursor()
        cur.execute(CHECK_USER_QUERY, (username.lower(),))
        rows = cur.fetchall()
        if rows is None or len(rows) == 0:
            return True
        else:
            return False
    def check_email_exist(self,email):
        cur = DB_CONNECTION.cursor()
        cur.execute(CHECK_EMAIL_QUERY, (email.lower(),))
        rows = cur.fetchall()
        if rows is None or len(rows) == 0:
            return True
        else:
            return False
    def add_new_user_in_db(
            self,
            username,
            password,
            email,
            phone_number,
            role,
            active,
            privileges,
            ibofostimeinterval,
            livedata):
        cur = DB_CONNECTION.cursor()
        cur.execute(ADD_USER_QUERY,
                (username,
                 password,
                 email,
                 phone_number,
                 role,
                 active,
                 privileges,
                 ibofostimeinterval,
                 livedata))
        DB_CONNECTION.commit()
        return True

    def get_ibofos_time_interval_from_db(self, username):
        cur = DB_CONNECTION.cursor()
        cur.execute(IBOFOS_TIME_INTERVAL_QUERY, (username.lower(),))
        rows = cur.fetchone()
        if rows is None or len(rows) == 0:
            return False
        return rows[0]

    def set_ibofos_time_interval_in_db(self, username, timeinterval):
        cur = DB_CONNECTION.cursor()
        cur.execute(SET_IBOFOS_TIME_INTERVAL_QUERY,
                    (str(timeinterval), username.lower()))
        DB_CONNECTION.commit()
        return True

    def delete_users_in_db(self, username_list):
        cur = DB_CONNECTION.cursor()
        for username in username_list:
            if username != "admin":
                cur.execute(DELETE_USER_QUERY, (username.lower(),))
        DB_CONNECTION.commit()

    def get_users_from_db(self):
        cur = DB_CONNECTION.cursor()
        cur.execute(USERS_QUERY)
        rows = cur.fetchall()
        if rows is None or len(rows) == 0:
            return False
        else:
            return self.tupple_to_json(rows, USER_TABLE_COLUMNS)

    def update_user_in_db(self, username, email, phone_number, old_username):
        cur = DB_CONNECTION.cursor()
        cur.execute(UPDATE_USER_QUERY, (username, email.lower(), phone_number, old_username.lower()))
        DB_CONNECTION.commit()
        return True

    def update_password_in_db(self, username, old_password, new_password):
        cur = DB_CONNECTION.cursor()
        cur.execute(SELECT_PASSWORD_QUERY, (username.lower(), old_password))
        rows = cur.fetchone()
        if rows is None or len(rows) == 0:
            return False
        cur = DB_CONNECTION.cursor()
        cur.execute(UPDATE_PASSWORD_QUERY, (new_password, username.lower()))
        DB_CONNECTION.commit()
        return True

    def tupple_to_json(self, my_tuple, my_list):
        json_array = []
        for row in my_tuple:
            temp_json = {}
            for field, column in zip(row, my_list):
                temp_json[column] = field
            json_array.append(temp_json)
        return json_array


    def match_username_from_db(self, username, password):
        cur = DB_CONNECTION.cursor()
        cur.execute(MATCH_USERNAME_QUERY, (username.lower(), password))
        rows = cur.fetchone()
        # print("match::",rows)
        if rows is None or len(rows) == 0:
            return ""
        else:
            return rows[0]

    def match_email_from_db(self, email, password):
        cur = DB_CONNECTION.cursor()
        cur.execute(MATCH_EMAIL_QUERY, (email.lower(), password))
        rows = cur.fetchone()
        if rows is None or len(rows) == 0:
            return ""
        else:
            return rows[0]


"""
class MongoDBConnection:
    def connect_database(self):
        global DB_CONNECTION
        client = pymongo.MongoClient(MONGODB_URL)
        DB_CONNECTION = client[MONGODB_DB_NAME]
    def create_default_database(self):
        connect(MONGODB_URL+MONGODB_DB_NAME)
        admin = User(USER_TABLE_DEFAULTS_VALUES[0],USER_TABLE_DEFAULTS_VALUES[1],USER_TABLE_DEFAULTS_VALUES[2],USER_TABLE_DEFAULTS_VALUES[3],USER_TABLE_DEFAULTS_VALUES[4],USER_TABLE_DEFAULTS_VALUES[5],USER_TABLE_DEFAULTS_VALUES[6],USER_TABLE_DEFAULTS_VALUES[7],USER_TABLE_DEFAULTS_VALUES[8]).save()
    def get_current_user(self,username):
        col = DB_CONNECTION[USER_TABLE]
        current_user = col.find_one({"_id": username})
        #print("get_current_user ",current_user)
        return current_user['_id']
    def get_prev_time_stamp(self):##
        col = DB_CONNECTION[IBOFOS_TIMESTAMP_TABLE]
        timestamp = col.find_one({"_id":"TIMESTAMP"})
        #print('lastRunningTime' in timestamp:)
        if timestamp is None:
            return False
        if 'lastRunningTime' in timestamp:
            return timestamp['lastRunningTime']
        else:
            print(" in else ")
            return False
    def insert_time_stamp(self,lastRunningTime):##
        col = DB_CONNECTION[IBOFOS_TIMESTAMP_TABLE]
        col.insert_one({"_id": "TIMESTAMP", "lastRunningTime": lastRunningTime})
    def update_time_stamp(self,lastRunningTime):##
        col = DB_CONNECTION[IBOFOS_TIMESTAMP_TABLE]
        col.update_one({"_id": "TIMESTAMP"}, {"$set": {"lastRunningTime": lastRunningTime}})
    def insert_smtp_ip(self,serverip,serverport):#
        col = DB_CONNECTION['smtpdetails']
        found = col.find_one({"_id": serverip})
        if not found:
            col.insert_one({"_id":serverip,"serverip":serverip,"serverport": serverport})
    def get_email_list(self):
        col = DB_CONNECTION[EMAILLIST_TABLE]
        emailids = col.find()
        return emailids
    def get_smtp_details(self):
        col = DB_CONNECTION['smtpdetails']
        serverdetails = col.find()
        return serverdetails
    def find_email(self,oldid):
        col = DB_CONNECTION[EMAILLIST_TABLE]
        found = col.find_one({"email": oldid})
        if found == None:
            return False
        else:
            return True
    def insert_email(self,email):
        col = DB_CONNECTION[EMAILLIST_TABLE]
        col.insert_one({"email": email,"active":True})
    def update_email_list(self,oldid,email):
        col = DB_CONNECTION['emaillist']
        col.update_one({"email": oldid},{"$set": {"email": email}})
    def delete_emailids_list(self,email_id):
        col = DB_CONNECTION[EMAILLIST_TABLE]
        toggle = col.find_one({"email":email_id})
        user = col.delete_one({"email":email_id})
        if (toggle['active'] == True):
            return True
        else:
            return False
    def toggle_email_update(self,status,email_id):#
        col = DB_CONNECTION[EMAILLIST_TABLE]
        col.update_one({"email": email_id},{"$set": {"active": status}})
    def update_counters_in_db(self):#
        DB_CONNECTION.counters.update_one({"_id": "volume"}, {"$set":{"count": 0}})
    def add_new_user_in_db(self,username,password,email,phone_number,role,active,privileges,ibofostimeinterval,livedata):
        col = DB_CONNECTION[USER_TABLE]
        col.insert_one({"_id":username, "password":password, "privileges": privileges, "role":role,"email":email,"phone_number":phone_number, "active": active, "ibofostimeinterval": ibofostimeinterval, "livedata": livedata})
    def get_ibofos_time_interval_from_db(self,username):##
        try:
            col = DB_CONNECTION[USER_TABLE]
            user = col.find_one({"_id": username,})
            if not user:
                return False
            else:
                return user["ibofostimeinterval"]
        except:
            return False
    def set_ibofos_time_interval_in_db(self,username,timeinterval):##
        col = DB_CONNECTION[USER_TABLE]
        user = col.find_one({"_id": username,})
        if not user:
            return False
        col.update_one({"_id": username},{"$set": {"ibofostimeinterval": timeinterval}})
        return True
    def get_users_from_db(self):
        print(" in get_users_from_db")
        col = DB_CONNECTION[USER_TABLE]
        users = col.find()
        #print("users: ",users)
        if not users:
            return False
        else:
            return users
    def toggle_status_from_db(self,userid,status):
        try:
            col = DB_CONNECTION[USER_TABLE]
            col.update_one({"_id": userid},{"$set": {"active": status}})
            return True
        except:
            return False
    def update_user_in_db(self,username,email,phone_number,old_username):
        try:
            col = DB_CONNECTION[USER_TABLE]
            col.update_one({"_id": old_username},{"$set": {"_id": username, "email": email, "phone_number": phone_number}})
            return True
        except:
            return False
    def update_password_in_db(self,username,old_password,new_password):
        col = DB_CONNECTION[USER_TABLE]
        user = col.find_one({"_id": username, "password": old_password})
        if not user:
            return False
        else:
            col.update_one({"_id": username},{"$set": {"password": new_password}})
            return True
    def delete_users_in_db(self,username_list):
        col = DB_CONNECTION[USER_TABLE]
        for username in username_list:
            if username != "admin":
                col.delete_one({"_id":username})
    def add_alert_in_db(self,alertName,alertCluster,alertSubCluster,alertType,alertCondition,alertField,description,alertRange,active):
        col = DB_CONNECTION[USER_ALERTS_TABLE]
        active = True
        col.insert_one({ "alertName": alertName, "alertCluster": alertCluster, "alertSubCluster": alertSubCluster,  "alertType": alertType, "alertCondition": alertCondition, "alertField":alertField,  "description": description,
                 "alertRange": alertRange, "active":active})
    def get_alerts_from_db(self):
        col = DB_CONNECTION[USER_ALERTS_TABLE]
        alerts = col.find()
        if not alerts:
            return False
        else:
            return alerts
    def delete_alerts_in_db(self,alertName):
        col = DB_CONNECTION[USER_ALERTS_TABLE]
        col.delete_one({"alertName": alertName})
    def update_alerts_in_db(self,alertName,description,alertRange,alertCondition):
        alerts = DB_CONNECTION[USER_ALERTS_TABLE]
        alert = alerts.find_one({'alertName': alertName})
        if not alert:
            return False
        else:
            alerts.update_one({"alertName": alertName}, {"$set": {"description": description, "alertRange":alertRange, "alertCondition":alertCondition}})
            return True
    def toggle_alert_status_in_db(self,alertName,status):#
        alerts = DB_CONNECTION[USER_ALERTS_TABLE]
        alert = alerts.find_one({'alertName':alertName})
        if not alert:
            return False
        else:
            alerts.update_one({"alertName": alertName}, {"$set": {"active": status}})
            return True
    def set_live_logs_in_db(self,data,username):##
        col = DB_CONNECTION[USER_TABLE]
        col.update_one({"_id":username},{"$set": {"livedata":data}})
    def get_live_logs_from_db(self,username):##
        col = DB_CONNECTION[USER_TABLE]
        user = col.find_one({"_id":username})
        return user
    def match_username_from_db(self,username,password):
        col = DB_CONNECTION[USER_TABLE]
        user = col.find_one({"_id": re.compile(username, re.IGNORECASE), "password":password, "active": True})
        return user['_id']
    def match_email_from_db(self,username,password):
        col = DB_CONNECTION[USER_TABLE]
        user = col.find_one({"email": re.compile(username, re.IGNORECASE), "password":password, "active": True})
        return user['_id']
"""

class DBType(enum.Enum):
    SQLite = 1
    MongoDB = 2


class DBConnection():
    def get_db_connection(self, db_type):
        if db_type == DBType.SQLite:
            return SQLiteConnection()
        #elif db_type == DBType.MongoDB:
        #    return MongoDBConnection()



