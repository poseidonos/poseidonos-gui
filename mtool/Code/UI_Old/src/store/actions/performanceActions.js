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


DESCRIPTION: <Contains pure actions for Performance Container> *
@NAME : performanceActions.js
@AUTHORS: Aswin K K 
@Version : 1.0 *
@REVISION HISTORY
[27/08/2019] [Aswin] : Prototyping..........////////////////////
*/
import * as actionTypes from "./actionTypes";

export const fetchDiskUsed = (diskUsed) => {
    return {
        type: actionTypes.FETCH_DISK_USED,
        diskUsed
    }
}

export const fetchDiskWrite = (diskWrite) => {
    return {
        type: actionTypes.FETCH_DISK_WRITE,
        diskWrite
    }
}

export const fetchCpuUsage = (cpuUsage) => {
    return {
        type: actionTypes.FETCH_CPU_USAGE,
        cpuUsage
    }
}

export const fetchReadBandwidth = (bw) => {
    return {
        type: actionTypes.FETCH_READ_BANDWIDTH,
        bw
    }
}

export const fetchWriteBandwidth = (bw) => {
    return {
        type: actionTypes.FETCH_WRITE_BANDWIDTH,
        bw
    }
}

export const fetchReadIops = (iops) => {
    return {
        type: actionTypes.FETCH_READ_IOPS,
        iops
    }
}

export const fetchWriteIops = (iops) => {
    return {
        type: actionTypes.FETCH_WRITE_IOPS,
        iops
    }
}

export const fetchLatency = (latency) => {
    return {
        type: actionTypes.FETCH_LATENCY,
        latency
    }
}

export const fetchInputPowerVariation = (watts) => {
    return {
        type: actionTypes.FETCH_INPUT_POWER_VARIATION,
        watts
    }
}

export const fetchVolReadBandwidth = (payload) => {
    return {
        type: actionTypes.FETCH_VOL_READ_BW,
        bw: payload.values,
        level: payload.level,
        name: payload.name,
        maxiops: payload.maxiops,
        maxbw: payload.maxbw
    }
}

export const fetchVolWriteBandwidth = (payload) => {
    return {
        type: actionTypes.FETCH_VOL_WRITE_BW,
        bw: payload.values,
        level: payload.level,
        name: payload.name,
        maxiops: payload.maxiops,
        maxbw: payload.maxbw
    }
}

export const fetchVolReadIops = (payload) => {
    return {
        type: actionTypes.FETCH_VOL_READ_IOPS,
        iops: payload.values,
        level: payload.level,
        name: payload.name,
        maxiops: payload.maxiops,
        maxbw: payload.maxiops
    }
}

export const fetchVolWriteIops = (payload) => {
    return {
        type: actionTypes.FETCH_VOL_WRITE_IOPS,
        iops: payload.values,
        level: payload.level,
        name: payload.name,
        maxiops: payload.maxiops,
        maxbw: payload.maxiops
    }
}

export const fetchVolLatency = (payload) => {
    return {
        type: actionTypes.FETCH_VOL_LATENCY,
        latency: payload.values,
        level: payload.level,
        name: payload.name,
        maxiops: payload.maxiops,
        maxbw: payload.maxiops
    }
}