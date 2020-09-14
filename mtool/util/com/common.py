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
@NAME : common.py
@AUTHORS: Jay Hitesh Sanghavi
@Version : 1.0 *
@REVISION HISTORY
[03/06/2019] [Jay] : Prototyping..........////////////////////
*/
'''

import socket


"""
def check_ip_policy(ip=None):
    if not isinstance(ip, str):
        return -1

    # IPV4
    if len(ip) > 15:
        return -2

    rule = "^((25[0-5]|2[0-4]\\d|[01]?\\d\\d?)($|(?!\\.$)\\.)){4}$"

    if re.match(rule, ip):
        return 0
    else:
        return -3
"""
"""
def get_localtime():
    ts = time.strftime('%Y-%m-%d %H:%M:%S',
                       time.localtime(time.time()))
    return ts
"""

def get_hostname():
    print('here', socket.gethostname())
    return socket.gethostname()

"""
def get_ip_by_name():
    return socket.gethostbyname(socket.gethostname())
"""

def get_ip_address():
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        return s.getsockname()[0]
    except socket.error:
        return None
