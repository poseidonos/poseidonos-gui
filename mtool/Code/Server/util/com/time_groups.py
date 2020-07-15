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
@NAME : time_groups.py
@AUTHORS: Jay Hitesh Sanghavi 
@Version : 1.0 *
@REVISION HISTORY
[03/06/2019] [Jay] : Prototyping..........////////////////////
[11/06/2019] [Aswin] : Set time group 1s for 5m
*/
'''

time_groups = {
    '1m': '1000ms',
    '5m': '428ms',
    '15m': '1285ms',
    '1h': '5142ms',
    '6h': '30857ms',
    '12h': '61714ms',
    '24h': '123428ms',
    '7d': '863999ms',
    '30d': '3702857ms'
}

time_groups_default = {
    '1m': '1s',
    '5m': '1s',
    '15m': '1m',
    '1h': '1m',
    '6h': '1m',
    '12h': '5m',
    '24h': '10m',
    '7d': '1h',
    '30d': '6h'

}
