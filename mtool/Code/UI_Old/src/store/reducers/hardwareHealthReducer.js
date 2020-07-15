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

DESCRIPTION: <Contains reducer Functions for hardware container> *
@NAME : hardwareHealthReducer.js
@AUTHORS: Jay Sanghavi 
@Version : 1.0 *
@REVISION HISTORY
[03/11/2019] [Jay] : Prototyping..........////////////////////
*/

import * as actionTypes from "../actions/actionTypes"

const initialState = {
    network_health: [],
    software_health: [],
    hardware_health:[],
}

const hardwareHealthReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.HARDWARE_HEALTH_FETCH_SOFTWARE_DETAILS:
            return {
                ...state,
                software_health:action.serverinfo,
            };
            case actionTypes.HARDWARE_HEALTH_FETCH_HARDWARE_DETAILS:
                return {
                    ...state,
                    hardware_health:action.serverinfo,
                };
                case actionTypes.HARDWARE_HEALTH_FETCH_NETWORK_DETAILS:
            return {
                ...state,
                network_health:action.serverinfo,
            };
        default:
            return state;
    }
};

export default hardwareHealthReducer;