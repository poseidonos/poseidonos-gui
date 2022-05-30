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
 *     * Neither the name of Samsung Electronics Corporation nor the names of its
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
import formatBytes from '../../utils/format-bytes';

export const initialState = {
    ssds: [],
    arrayname: "",
    arrayMap: {},
    config: {},
    volumes: [],
    volSpace: 0,
    metadisks: [],
    loading: false,
    alertOpen: false,
    alertType: 'alert',
    alertTitle: '',
    errorMsg: '',
    errorCode: '',
    alertLink: null,
    alertlinktext: null,
    arraySize: 0,
    maxVolumeCount: 256,
    volumeMap: {},
    createVolumeButton: false,
    totalVolSize: 0,
    storagedisks: [],
    sparedisks: [],
    writebufferdisks: [],
    metadiskpath: '',
    selectedRaid: {},
    slots: [],
    arrays: [],
    arrayExists: false,
    RAIDLevel: '',
    loadText: 'Loading...',
    mountStatus: 'OFFLINE',
    diskDetails: {
        DevicePath: 'NA',
        SerialNumber: 'NA',
        ModelNumber: 'NA',
        PhysicalSize: 'NA',
        UsedBytes: 'NA',
        Firmware: 'NA',
        critical_warning: 'NA',
        temperature: 'NA',
        avail_spare: 'NA',
        spare_thresh: 'NA',
        precent_used: 'NA',
        data_units_read: 'NA',
        data_units_written: 'NA',
        critical_comp_time: 'NA',
        warning_temp_time: 'NA',
        percent_used: 'NA',
    }
}

// const bytesToGB = (size) => {
//     return parseFloat(size / (1024 * 1024 * 1024), 10)
// }

const storageReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.FETCH_DEVICE_INFO:
            return {
                ...state,
                ssds: action.ssds,
                metadisks: action.metadisks
            }
        case actionTypes.STORAGE_SHOW_ALERT:
            return {
                ...state,
                alertOpen: true,
                ...action.payload,
                alertLink: action.payload.link,
                alertLinkText: action.payload.linkText
            }
        case actionTypes.FETCH_ARRAY_SIZE:
            return {
                ...state,
                // arraySize: action.payload.totalsize,
                // totalVolSize: action.payload.usedspace,
                // mountStatus: action.payload.mountStatus,
            }
        case actionTypes.FETCH_MAX_VOLUME_COUNT:
            return {
                ...state,
                maxVolumeCount: action.payload
            }
        case actionTypes.TOGGLE_CREATE_VOLUME_BUTTON:
            return {
                ...state,
                createVolumeButton: action.payload
            }
        case actionTypes.FETCH_ARRAY: {
            let arraySize = 0;
            let totalVolSize = 0;
            const arrayMap = {};
            for (let i = 0; i < action.payload.length; i += 1) {
                arraySize += action.payload[i].totalsize;
                totalVolSize += action.payload[i].usedspace;
                arrayMap[action.payload[i].arrayname] = {
                   ...state.arrayMap[action.payload[i].arrayname],
                   ...action.payload[i]
                }
            }
            let arrayname = state.arrayname && arrayMap[state.arrayname] ? state.arrayname : '';
            if (!arrayname && action.payload.length > 0) {
                arrayname = action.payload[0].arrayname;
            }
            return {
                ...state,
                arrays: action.payload,
                arrayMap,
                arrayname,
                arrayExists: true,
                arraySize,
                totalVolSize
            }
        }
	case actionTypes.CHANGE_WRITE_THROUGH: {
	    return {
		...state,
		arrayMap: {
			...state.arrayMap,
			[action.payload]: {
				...state.arrayMap[action.payload],
				writeThroughEnabled: !state.arrayMap[action.payload].writeThroughEnabled
			}
		}
	    }
	}
        case actionTypes.FETCH_CONFIG: {
            return {
                ...state,
                config: {
                    ...action.payload,
                    raidTypes: action.payload.raidTypes ? action.payload.raidTypes.map((type) => ({
                        value: type.raidType,
                        label: type.raidType,
                        ...type
                    })) : []
                },
                selectedRaid: action.payload.raidTypes &&
                    action.payload.raidTypes.length ? { ...action.payload.raidTypes[0] } : {}
            }
        }
        case actionTypes.SELECT_RAID: {
            return {
                ...state,
                selectedRaid: { ...action.payload }
            }
        }
        case actionTypes.SET_ARRAY:
            return {
                ...state,
                arrayname: action.payload
            }
        case actionTypes.SET_NO_ARRAY:
            return {
                ...state,
                arrayExists: false
            }
        case actionTypes.FETCH_VOLUMES: {
            return {
                ...state,
                ...action.payload,
            }
        }
        case actionTypes.CLEAR_VOLUMES: {
            return {
                ...state,
                volumes: [],
                volumeMap: {}
            }
        }
        case actionTypes.ADD_VOLUME: {
            let localMinType;
            if (action.volume.Oem.MinBandwidth === 0 && action.volume.Oem.MinIOPS === 0)
                localMinType = "";
            else if (action.volume.Oem.MinIOPS === 0)
                localMinType = "minbw"
            else
                localMinType = "miniops";

            if (Object.prototype.hasOwnProperty.call(state.volumeMap, action.volume.Id)) {
                const index = state.volumeMap[action.volume.Id];
                return {
                    ...state,
                    volumes: [
                        ...state.volumes.slice(0, index),
                        {
                            name: action.volume.Name,
                            id: action.volume.Id,
                            newName: action.volume.Name,
                            size: action.volume.Capacity.Data.AllocatedBytes,
                            usedspace: formatBytes(action.volume.Capacity.Data.ConsumedBytes),
                            miniops: action.volume.Oem.MinIOPS,
                            minbw: action.volume.Oem.MinBandwidth,
                            oldMiniops: action.volume.Oem.MinIOPS,
                            oldMinbw: action.volume.Oem.MinBandwidth,
                            maxiops: action.volume.Oem.MaxIOPS,
                            maxbw: action.volume.Oem.MaxBandwidth,
                            oldMaxiops: action.volume.Oem.MaxIOPS,
                            oldMaxbw: action.volume.Oem.MaxBandwidth,
                            status: action.volume.Status.Oem.VolumeStatus,
                            subnqn: action.volume.Oem.NQN,
                            uuid: action.volume.Oem.UUID,
                            url: action.volume["@odata.id"],
                            edit: false,
                            minType: localMinType,
                            resetType: "",
                        },
                        ...state.volumes.slice(index + 1)
                    ]
                }
            }
            const totalVolumes = state.volumes.length;
            return {
                ...state,
                volumes: [
                    ...state.volumes,
                    {
                        name: action.volume.Name,
                        newName: action.volume.Name,
                        id: action.volume.Id,
                        size: action.volume.Capacity.Data.AllocatedBytes,
                        usedspace: formatBytes(action.volume.Capacity.Data.ConsumedBytes),
                        miniops: action.volume.Oem.MinIOPS,
                        minbw: action.volume.Oem.MinBandwidth,
                        oldMiniops: action.volume.Oem.MinIOPS,
                        oldMinbw: action.volume.Oem.MinBandwidth,
                        maxiops: action.volume.Oem.MaxIOPS,
                        maxbw: action.volume.Oem.MaxBandwidth,
                        oldMaxiops: action.volume.Oem.MaxIOPS,
                        oldMaxbw: action.volume.Oem.MaxBandwidth,
                        status: action.volume.Status.Oem.VolumeStatus,
                        subnqn: action.volume.Oem.NQN,
                        uuid: action.volume.Oem.UUID,
                        url: action.volume["@odata.id"],
                        minType: localMinType,
                        resetType: "",
                    }
                ],
                volumeMap: {
                    ...state.volumeMap,
                    [action.volume.Id]: totalVolumes
                }
            }
        }
        case actionTypes.STORAGE_CLOSE_ALERT:
            return {
                ...state,
                alertOpen: false,
            }
        case actionTypes.EDIT_VOLUME: {
            const volumes = state.volumes.map((vol) => {
                return vol.id === action.payload.id ? {
                    ...vol,
                    edit: true
                } : {
                    ...vol,
                    edit: false
                };
            });
            return {
                ...state,
                volumes
            }
        }
        case actionTypes.CHANGE_VOLUME_FIELD: {
            const volumes = state.volumes.map((vol) => {
                return vol.id === action.payload.id ? {
                    ...vol,
                    [action.payload.name]: action.payload.value
                } /* istanbul ignore next */ : {
                    ...vol,
                };
            });
            return {
                ...state,
                volumes
            }
        }
        case actionTypes.CHANGE_MIN_TYPE: {
            const volumes = state.volumes.map((vol) => {
                return vol.id === action.payload.id ? {
                    ...vol,
                    minType: action.payload.minType
                } /* istanbul ignore next */ : {
                    ...vol,
                };
            });
            return {
                ...state,
                volumes
            }
        }
        case actionTypes.CHANGE_RESET_TYPE: {
            const volumes = state.volumes.map((vol) => {
                return vol.id === action.payload.id ? {
                    ...vol,
                    resetType: action.payload.resetType
                } /* istanbul ignore next */ : {
                    ...vol,
                };
            });
            return {
                ...state,
                volumes
            }
        }
        case actionTypes.STORAGE_START_LOADER:
            return {
                ...state,
                loading: true,
                loadText: action.payload
            }
        case actionTypes.GET_ARRAY_INFO: {
            return {
                ...state,
                arrayMap: {
                    ...state.arrayMap,
                    [action.payload.name]: {
                         ...state.arrayMap[action.payload.name],
                         rebuildProgress: action.payload.rebuilding_progress,
                         situation: action.payload.situation
                    }
                }
            }
}
        case actionTypes.STORAGE_STOP_LOADER:
            return {
                ...state,
                loading: false
            }
        case actionTypes.FETCH_DEVICE_DETAILS: {
            let details = {};
            for (let i = 0; i < state.ssds.length; i += 1) {
                /* istanbul ignore else */
                if (state.ssds[i].name === action.payload.name) {
                    details = state.ssds[i];
                    break;
                }
            }

            return {
                ...state,
                diskDetails: {
                    ...action.payload,
                    ...details
                }
            }
        }
        default:
            return state;
    }
}

export const arrayname = (state = { storageReducer: {} }) => state.storageReducer.arrayname
export const arrayMap = (state = { storageReducer: {} }) => state.storageReducer.arrayMap
export default storageReducer;
