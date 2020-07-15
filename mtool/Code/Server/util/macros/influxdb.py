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


DESCRIPTION: <File description> * macros for influxdb
@NAME : influxdb.py
@AUTHORS: Palak Kapoor
@Version : 1.0 *
@REVISION HISTORY
[31/03/2020] [Palak] : Set time group 1s for 5m
*/
'''

mtool_db = "poseidon"

#values defined in create_retention_policy.py
infinite_rp = "autogen"
default_rp = "default_rp"
agg_rp = "agg_rp"

agg_time = ['7d', '30d']
