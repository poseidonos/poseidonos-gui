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
@NAME : hardwareOverviewReducer.js
@AUTHORS: Jay Sanghavi 
@Version : 1.0 *
@REVISION HISTORY
[03/11/2019] [Jay] : Prototyping..........////////////////////
*/

import * as actionTypes from "../actions/actionTypes"

const initialState = {
    chassis_front_list: [],
    chassis_rear_list: [],
    model: '',
    manufacturer: '',
    servermac: '',
    serverip: '',
    firmwareversion: '',
    serialno: '',
    hostname: '',
    powerconsumption: 'Refreshing',
    powercap: 'Refreshing',
    powerstatus: 'Refreshing',
}

const hardwareOverviewReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.HARDWARE_OVERVIEW_FETCH_SERVER_INFORMATION:
            return {
                ...state,
                model: action.serverinfo.model,
                manufacturer: action.serverinfo.manufacturer,
                servermac: action.serverinfo.mac,
                serverip: action.serverinfo.ip,
                firmwareversion: action.serverinfo.firmwareversion,
                serialno: action.serverinfo.serialno,
                hostname: action.serverinfo.host,
            };
        case actionTypes.HARDWARE_OVERVIEW_FETCH_POWER_INFORMATION: {
            let powerstatus = '';
            if (action.powerinfo.powerstatus === "On") {
                powerstatus = 'Power On';
            } else {
                powerstatus = action.powerinfo.powerstatus;
            }
            return {
                ...state,
                powerconsumption: action.powerinfo.powerconsumption,
                powercap: action.powerinfo.powercap,
                powerstatus,
            };
        }
        case actionTypes.HARDWARE_OVERVIEW_FETCH_CHASSIS_FRONT_INFORMATION:
            return {
                ...state,
                chassis_front_list: action.frontinfo,
            };
        case actionTypes.HARDWARE_OVERVIEW_FETCH_CHASSIS_REAR_INFORMATION:
            return {
                ...state,
                chassis_rear_list:  action.rearinfo.rear_info
            };
        default:
            return state;
    }
};

export default hardwareOverviewReducer;