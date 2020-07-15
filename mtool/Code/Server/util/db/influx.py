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
@NAME : influx.py
@AUTHORS: Jay Hitesh Sanghavi 
@Version : 1.0 *
@REVISION HISTORY
[03/06/2019] [Jay] : Prototyping..........////////////////////
*/
'''

from influxdb import InfluxDBClient
import os
from util.com.common import get_hostname

from conf.configure import config
MTOOL_DB='poseidon'
IP='0.0.0.0'
PORT=8086

def get_db_name():
    db_name = config.get_option_content('database', 'db')

    if db_name in (None, ""):
        db_name = get_hostname()

    return db_name


def get_connection(db=MTOOL_DB,
                   ip=IP,
                   port=PORT):
    try:
        ip = os.environ.get('INFLUX_HOST',ip)
        #print('IP',ip)
        client = InfluxDBClient(host=ip, port=port, database=db , use_udp=True)
        return client
    except:
        print("Error in Influx.py get_connection()")


if __name__ == '__main__':
    connection = get_connection()
    print(connection.get_list_measurements())
