/*
 *   BSD LICENSE
 *   Copyright (c) 2021 Samsung Electronics Corporation
 *   All rights reserved.
 *
 *   Redistribution and use in source and binary forms, with or without
 *   modification, are permitted provided that the following conditions
 *   are met:
 *
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in
 *       the documentation and/or other materials provided with the
 *       distribution.
 *     * Neither the name of Intel Corporation nor the names of its
 *       contributors may be used to endorse or promote products derived
 *       from this software without specific prior written permission.
 *
 *   THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 *   "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 *   LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 *   A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 *   OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 *   SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 *   LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 *   DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 *   THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 *   (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 *   OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

import * as actionTypes from "./actionTypes";

// export const fetchDiskUsed = (diskUsed) => {
//     return {
//         type: actionTypes.FETCH_DISK_USED,
//         diskUsed
//     }
// }

// export const fetchDiskWrite = (diskWrite) => {
//     return {
//         type: actionTypes.FETCH_DISK_WRITE,
//         diskWrite
//     }
// }

export const fetchCpuUsage = (cpuUsage, interval) => {
    return {
        type: actionTypes.FETCH_CPU_USAGE,
        cpuUsage,
        interval
    }
}

export const fetchReadBandwidth = (bw, interval) => {
    return {
        type: actionTypes.FETCH_READ_BANDWIDTH,
        bw,
        interval
    }
}

export const fetchWriteBandwidth = (bw, interval) => {
    return {
        type: actionTypes.FETCH_WRITE_BANDWIDTH,
        bw,
        interval
    }
}

export const fetchReadIops = (iops, interval) => {
    return {
        type: actionTypes.FETCH_READ_IOPS,
        iops,
        interval
    }
}

export const fetchWriteIops = (iops, interval) => {
    return {
        type: actionTypes.FETCH_WRITE_IOPS,
        iops,
        interval
    }
}

export const fetchReadLatency = (latency, interval) => {
    return {
        type: actionTypes.FETCH_READ_LATENCY,
        latency,
        interval
    }
}

export const fetchWriteLatency = (latency, interval) => {
    return {
        type: actionTypes.FETCH_WRITE_LATENCY,
        latency,
        interval
    }
}

// export const fetchInputPowerVariation = (watts) => {
//     return {
//         type: actionTypes.FETCH_INPUT_POWER_VARIATION,
//         watts
//     }
// }

export const fetchVolReadBandwidth = (payload) => {
console.log(payload)
    return {
        type: actionTypes.FETCH_VOL_READ_BW,
        bw: payload.values,
        level: payload.level,
        name: payload.name,
        maxiops: payload.maxiops,
        maxbw: payload.maxbw,
        startTime: payload.startTime,
        endTime: payload.endTime
    }
}

export const fetchVolWriteBandwidth = (payload) => {
    return {
        type: actionTypes.FETCH_VOL_WRITE_BW,
        bw: payload.values,
        level: payload.level,
        name: payload.name,
        maxiops: payload.maxiops,
        maxbw: payload.maxbw,
        startTime: payload.startTime,
        endTime: payload.endTime
    }
}

export const fetchVolReadIops = (payload) => {
    return {
        type: actionTypes.FETCH_VOL_READ_IOPS,
        iops: payload.values,
        level: payload.level,
        name: payload.name,
        maxiops: payload.maxiops,
        maxbw: payload.maxiops,
        startTime: payload.startTime,
        endTime: payload.endTime
    }
}

export const fetchVolWriteIops = (payload) => {
    return {
        type: actionTypes.FETCH_VOL_WRITE_IOPS,
        iops: payload.values,
        level: payload.level,
        name: payload.name,
        maxiops: payload.maxiops,
        maxbw: payload.maxiops,
        startTime: payload.startTime,
        endTime: payload.endTime
    }
}

export const fetchVolReadLatency = (payload) => {
    return {
        type: actionTypes.FETCH_VOL_READ_LATENCY,
        latency: payload.values,
        level: payload.level,
        name: payload.name,
        maxiops: payload.maxiops,
        maxbw: payload.maxiops,
        startTime: payload.startTime,
        endTime: payload.endTime
    }
}

export const fetchVolWriteLatency = (payload) => {
    return {
        type: actionTypes.FETCH_VOL_WRITE_LATENCY,
        latency: payload.values,
        level: payload.level,
        name: payload.name,
        maxiops: payload.maxiops,
        maxbw: payload.maxiops,
        startTime: payload.startTime,
        endTime: payload.endTime
    }
}

