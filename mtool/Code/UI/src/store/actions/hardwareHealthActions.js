/* -------------------------------------------------------------------------------------/
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

DESCRIPTION: <Contains actions for hardware container> *
@NAME : hardwareHealthActions.js
@AUTHORS: Jay Sanghavi 
@Version : 1.0 *
@REVISION HISTORY
[03/11/2019] [Jay] : Prototyping..........////////////////////
*/

import * as actionTypes from './actionTypes';

export const fetchSoftwareDetails = serverinfo => {
    return {
        type: actionTypes.HARDWARE_HEALTH_FETCH_SOFTWARE_DETAILS,
        serverinfo,
    };
};

export const fetchHardwareDetails = serverinfo => {
    return {
        type: actionTypes.HARDWARE_HEALTH_FETCH_HARDWARE_DETAILS,
        serverinfo,
    };
};

export const fetchNetworkDetails = serverinfo => {
    return {
        type: actionTypes.HARDWARE_HEALTH_FETCH_NETWORK_DETAILS,
        serverinfo,
    };
};
