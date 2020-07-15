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
@NAME : model.py
@AUTHORS: Jay Hitesh Sanghavi 
@Version : 1.0 *
@REVISION HISTORY
[03/06/2019] [Jay] : Prototyping..........////////////////////
[11/06/2019] [Aswin] : Added Counters model
*/
'''


from pymodm import fields, MongoModel



# class UserDoc():
#     user_name = String
#     pass_word = String



class User(MongoModel):
    # Use 'username' as the '_id' field in MongoDB.
    username = fields.CharField(primary_key=True)
    password = fields.CharField()
    email = fields.EmailField()
    phone_number = fields.CharField()
    role = fields.CharField()
    active = fields.BooleanField()
    privileges = fields.CharField()
    ibofostimeinterval = fields.IntegerField()
    livedata = fields.BooleanField()
    #print("In user func() ->>> ",username,password,email,phone_number,role,active,privileges,ibofostimeinterval,livedata)
class emaillist(MongoModel):
    # Use 'email' as the '_id' field in MongoDB.
    moderator = fields.EmailField(primary_key=True)
    email = fields.EmailField()
    active = fields.BooleanField()
    
class smtpdetails(MongoModel):
    # Use 'IP' as the '_id' field in MongoDB.
    serverip = fields.CharField(primary_key=True)
    serverport = fields.CharField()

class ibofdetails(MongoModel):
    # Use 'IP' as the '_id' field in MongoDB.
    Slotno = fields.CharField(primary_key=True)
    Type = fields.CharField()
    Size = fields.CharField()
    Product_ID = fields.CharField()
    ModelNo = fields.CharField()
    WWN = fields.CharField()
    FWversion = fields.CharField()
    Blink = fields.BooleanField()
    Attach = fields.BooleanField()

class array(MongoModel):
    # Use 'arrayname' as the '_id' field in MongoDB.
    arrayname = fields.CharField(primary_key=True)
    RAIDLevel = fields.CharField()
    slots = fields.ListField()
    totalsize = fields.FloatField()
    usedspace = fields.FloatField()
    corrupted = fields.ListField()

class Counters(MongoModel):
    _id = fields.CharField(primary_key=True)
    count = fields.IntegerField()
