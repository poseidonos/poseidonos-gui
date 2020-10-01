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
    readIOPS: 0,
    writeIOPS: 0,
    readBW: 0,
    writeBW: 0,
    latency: 0,
    fetchingAlerts: false,
    ip: '0.0.0.0',
    mac: 'NA',
    host: '',
    arraySize: 0,
    memoryUsage: 0,
    cpuUsage: 0,
    latencyVal: 0,
    latencyPer: 0,
    cpuArcsLength:[0.5, 0.2, 0.3],
    memoryArcsLength:[0.5, 0.2, 0.3],
    latencyArcsLength:[0.5, 0.2, 0.3],
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
                readIOPS: action.readIOPS,
                writeIOPS:action.writeIOPS,
                readBW:action.readBW,
                writeBW: action.writeBW,
                latency: action.latency
            };
        case actionTypes.FETCH_IPANDMAC_INFO:
            return {
                ...state,
                ip:action.ip,
                mac:action.mac,
                host:action.host
            };
        case actionTypes.FETCH_HEALTH_STATUS:
                return {
                    ...state,
                    cpuUsage: action.cpuUsage,
                    memoryUsage: action.memoryUsage,
                    latencyVal: action.latencyVal,
                    latencyPer: action.latencyPer,
                    cpuArcsLength: action.cpuArcsLength,
                    memoryArcsLength: action.memoryArcsLength,
                    latencyArcsLength: action.latencyArcsLength,
            };
        default:
            return state;
    }
};

export default dashboardReducer;