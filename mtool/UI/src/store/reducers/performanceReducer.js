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


DESCRIPTION: <Contains reducer function for Performance Component> *
@NAME : performanceeReducer.js
@AUTHORS: Aswin K K
@Version : 1.0 *
@REVISION HISTORY
[28/08/2019] [Jay] : Prototyping..........////////////////////
*/

import * as actionTypes from "../actions/actionTypes";

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
        yLabel: 'KIOPS',
        values: [],
        loaded: false,
        name: 'Read IOPS',
    },
    writeIOPS: {
        yLabel: 'KIOPS',
        values: [],
        loaded: false,
        name: 'Write IOPS',
    },
    readBandwidth: {
        yLabel: 'Bandwidth (MB/s)',
        values: [],
        loaded: false,
        name: 'Read Bandwidth',
    },
    writeBandwidth: {
        yLabel: 'Bandwidth (MB/s)',
        values: [],
        loaded: false,
        name: 'Write Bandwidth',
    },
    latency:{
        yLabel: 'Latency (ns)',
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
                    values: action.cpuUsage
                }
            }
        case actionTypes.FETCH_READ_BANDWIDTH:
            return {
                ...state,
                readBandwidth: {
                    ...state.readBandwidth,
                    values: action.bw
                }
            }
        case actionTypes.FETCH_WRITE_BANDWIDTH:
            return {
                ...state,
                writeBandwidth: {
                    ...state.writeBandwidth,
                    values: action.bw
                }
            }
        case actionTypes.FETCH_LATENCY:
            return {
                ...state,
                latency: {
                    ...state.latency,
                    values: action.latency
                }
            }
        case actionTypes.FETCH_READ_IOPS: {
            return {
                ...state,
                readIOPS: {
                    ...state.readIOPS,
                    values: action.iops
                }
            }
        }
        case actionTypes.FETCH_WRITE_IOPS: {
            return {
                ...state,
                writeIOPS: {
                    ...state.writeIOPS,
                    values: action.iops
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
                            yLabel: 'Bandwidth (MB/s)',
                            values: action.bw,
                            name: `Read Bandwidth ${action.name}`,
                            maxiops: action.maxiops !== 0 ? action.maxiops /* istanbul ignore next */: null,
                            maxbw: action.maxbw !== 0 ? action.maxbw /* istanbul ignore next */: null
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
                            yLabel: 'Bandwidth (MB/s)',
                            values: action.bw,
                            name: `Write Bandwidth ${action.name}`,
                            maxiops: action.maxiops !== 0 ? action.maxiops /* istanbul ignore next */: null,
                            maxbw: action.maxbw !== 0 ? action.maxbw /* istanbul ignore next */: null
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
                            yLabel: 'KIOPS',
                            values: action.iops,
                            name: `Read IOPS ${action.name}`,
                            maxiops: action.maxiops !== 0 ? action.maxiops /* istanbul ignore next */: null,
                            maxbw: action.maxbw !== 0 ? action.maxbw /* istanbul ignore next */: null
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
                            yLabel: 'KIOPS',
                            values: action.iops,
                            name: `Write IOPS ${action.name}`,
                            maxiops: action.maxiops !== 0 ? action.maxiops /* istanbul ignore next */: null,
                            maxbw: action.maxbw !== 0 ? action.maxbw /* istanbul ignore next */: null
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
                            yLabel: 'Latency (ns)',
                            values: action.latency,
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