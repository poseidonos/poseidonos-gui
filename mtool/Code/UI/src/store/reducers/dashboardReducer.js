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


DESCRIPTION: <Contains reducer function for dashboard page> *
@NAME : dashboardReducer.js
@AUTHORS: Jay Hitesh Sanghavi 
@Version : 1.0 *
@REVISION HISTORY
[03/06/2019] [Jay] : Prototyping..........////////////////////
*/

import * as actionTypes from "../actions/actionTypes"

const initialState = {
    volumes: [],
    alerts: [],
    ibofs: ['None'],
    unusedSpace: 100,
    used: 0,
    unused: 100,
    read_iops: 0,
    write_iops: 0,
    bw: 0,
    fetchingAlerts: false,
    ip: '0.0.0.0',
    mac: 'NA',
    host: '',
    arraySize: 0
}


const dashboardReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.ENABLE_FETCHING_ALERTS:
            return {
                ...state,
                fetchingAlerts: action.fetchingAlerts,
            };
        case actionTypes.FETCH_VOLUME_INFO:
            return {
                ...state,
                volumes: action.volumes,
            };
        case actionTypes.FETCH_ALERTS_INFO:
            return {
                ...state,
                alerts: action.alerts,
            };
        case actionTypes.FETCH_STORAGE_INFO:
            return {
                ...state,
                unusedSpace:action.unusedSpace,
                used:action.used,
                unused:action.unused,
                arraySize:action.arraySize
            };
        case actionTypes.FETCH_PERFORMANCE_INFO:
            return {
                ...state,
                read_iops: action.read_iops,
                write_iops:action.write_iops,
                bw:action.bw
            };
        case actionTypes.FETCH_IPANDMAC_INFO:
            return {
                ...state,
                ip:action.ip,
                mac:action.mac,
                host:action.host
            };
        default:
            return state;
    }
};

export default dashboardReducer;