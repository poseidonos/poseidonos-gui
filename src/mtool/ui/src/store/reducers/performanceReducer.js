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

import * as actionTypes from "../actions/actionTypes";
import { BYTE_FACTOR } from "../../utils/constants";

export const initialState = {
    cpuUsage: {
        yLabel: 'CPU Usage (Percentage)',
        values: [],
        loaded: false,
        name: 'CPU Usage',
    },
    diskWrite: {
        yLabel: 'Write (MB/S)',
        values: [],
        loaded: false,
        name: 'Host Storage Write',
    },
    diskUsed: {
        yLabel: 'Used (percentage)',
        values: [],
        loaded: false,
        name: 'Host Storage Usage',
    },
    readIOPS: {
        yLabel: 'IOPS',
        values: [],
        loaded: false,
        name: 'Read IOPS',
    },
    writeIOPS: {
        yLabel: 'IOPS',
        values: [],
        loaded: false,
        name: 'Write IOPS',
    },
    readBandwidth: {
        yLabel: 'Bandwidth (Bytes/s)',
        values: [],
        loaded: false,
        name: 'Read Bandwidth',
    },
    writeBandwidth: {
        yLabel: 'Bandwidth (Bytes/s)',
        values: [],
        loaded: false,
        name: 'Write Bandwidth',
    },
    latency:{
        yLabel: 'Latency (ms)',
        values: [],
        loaded: false,
        name: 'Latency',
    },
    power_usage: {
        yLabel: 'Watts (W)',
        values: [],
        loaded: false,
        name: 'Input Power',
    },
    vols: {}
}

const performanceReducer = (state = initialState, action) => {
    switch (action.type) {
        // case actionTypes.FETCH_DISK_USED:
        //     return {
        //         ...state,
        //         diskUsed: {
        //             ...state.diskUsed,
        //             values: action.diskUser
        //         }
        //     }
        // case actionTypes.FETCH_DISK_WRITE:
        //     return {
        //         ...state,
        //         diskWrite: {
        //             ...state.diskWrite,
        //             values: action.diskWrite
        //         }
        //     }
        case actionTypes.FETCH_CPU_USAGE:
            return {
                ...state,
                cpuUsage: {
                    ...state.cpuUsage,
                    values: action.cpuUsage,
                    startTime: action.interval.startTime,
                    endTime: action.interval.endTime
                }
            }
        case actionTypes.FETCH_READ_BANDWIDTH:
            return {
                ...state,
                readBandwidth: {
                    ...state.readBandwidth,
                    values: action.bw,
                    startTime: action.interval.startTime,
                    endTime: action.interval.endTime
                }
            }
        case actionTypes.FETCH_WRITE_BANDWIDTH:
            return {
                ...state,
                writeBandwidth: {
                    ...state.writeBandwidth,
                    values: action.bw,
                    startTime: action.interval.startTime,
                    endTime: action.interval.endTime
                }
            }
        case actionTypes.FETCH_LATENCY:
            return {
                ...state,
                latency: {
                    ...state.latency,
                    values: action.latency,
                    startTime: action.interval.startTime,
                    endTime: action.interval.endTime
                }
            }
        case actionTypes.FETCH_READ_IOPS: {
            return {
                ...state,
                readIOPS: {
                    ...state.readIOPS,
                    values: action.iops,
                    startTime: action.interval.startTime,
                    endTime: action.interval.endTime
                }
            }
        }
        case actionTypes.FETCH_WRITE_IOPS: {
            return {
                ...state,
                writeIOPS: {
                    ...state.writeIOPS,
                    values: action.iops,
                    startTime: action.interval.startTime,
                    endTime: action.interval.endTime
                }
            }
        }
        /* istanbul ignore next */
        case actionTypes.FETCH_INPUT_POWER_VARIATION:
            return {
                ...state,
                power_usage: {
                    ...state.power_usage,
                    values: action.watts
                }
            }
        case actionTypes.FETCH_VOL_READ_BW:
            return {
                ...state,
                vols: {
                    ...state.vols,
                    [action.level]: {
                        ...state.vols[action.level],
                        readBandwidth: {
                            yLabel: 'Bandwidth (Bytes/s)',
                            values: action.bw,
                            startTime: action.startTime,
                            endTime: action.endTime,
                            name: `Read Bandwidth ${action.name}`,
                            maxiops: action.maxiops !== 0 ? action.maxiops * 1000 /* istanbul ignore next */: null,
                            maxbw: action.maxbw !== 0 ? action.maxbw * BYTE_FACTOR * BYTE_FACTOR /* istanbul ignore next */: null
                        }
                    }
                }
            }
        case actionTypes.FETCH_VOL_WRITE_BW:
            return {
                ...state,
                vols: {
                    ...state.vols,
                    [action.level]: {
                        ...state.vols[action.level],
                        writeBandwidth: {
                            yLabel: 'Bandwidth (Bytes/s)',
                            values: action.bw,
                            startTime: action.startTime,
                            endTime: action.endTime,
                            name: `Write Bandwidth ${action.name}`,
                            maxiops: action.maxiops !== 0 ? action.maxiops * 1000/* istanbul ignore next */: null,
                            maxbw: action.maxbw !== 0 ? action.maxbw * BYTE_FACTOR * BYTE_FACTOR /* istanbul ignore next */: null
                        }
                    }
                }
            }
        case actionTypes.FETCH_VOL_READ_IOPS: {
            return {
                ...state,
                vols: {
                    ...state.vols,
                    [action.level]: {
                        ...state.vols[action.level],
                        readIOPS: {
                            yLabel: 'IOPS',
                            values: action.iops,
                            startTime: action.startTime,
                            endTime: action.endTime,
                            name: `Read IOPS ${action.name}`,
                            maxiops: action.maxiops !== 0 ? action.maxiops * 1000 /* istanbul ignore next */: null,
                            maxbw: action.maxbw !== 0 ? action.maxbw * BYTE_FACTOR * BYTE_FACTOR /* istanbul ignore next */: null
                        }
                    }
                }
            }
        }
        case actionTypes.FETCH_VOL_WRITE_IOPS: {
            return {
                ...state,
                vols: {
                    ...state.vols,
                    [action.level]: {
                        ...state.vols[action.level],
                        writeIOPS: {
                            yLabel: 'IOPS',
                            values: action.iops,
                            startTime: action.startTime,
                            endTime: action.endTime,
                            name: `Write IOPS ${action.name}`,
                            maxiops: action.maxiops !== 0 ? action.maxiops * 1000/* istanbul ignore next */: null,
                            maxbw: action.maxbw !== 0 ? action.maxbw * BYTE_FACTOR * BYTE_FACTOR /* istanbul ignore next */: null
                        }
                    }
                }
            }
        }
        case actionTypes.FETCH_VOL_LATENCY: {
            return {
                ...state,
                vols: {
                    ...state.vols,
                    [action.level]: {
                        ...state.vols[action.level],
                        latency: {
                            yLabel: 'Latency (ms)',
                            values: action.latency,
                            startTime: action.startTime,
                            endTime: action.endTime,
                            name: `Latency ${action.name}`,
                           // maxiops: action.maxiops !== 0 ? action.maxiops: null,
                           // maxbw: action.maxbw !== 0 ? action.maxbw : null
                        }
                    }
                }
            }
        }
        case actionTypes.RESET_PERF_STATE: {
            return {
                ...initialState
            }
        }
        default:
            return state;
    }
}

export default performanceReducer;