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


DESCRIPTION: <Contains reducer function for Storage Management Component> *
@NAME : storageReducer.js
@AUTHORS: Aswin K K
@Version : 1.0 *
@REVISION HISTORY
[03/06/2019] [Jay] : Prototyping..........////////////////////
*/

import * as actionTypes from "../actions/actionTypes";
import formatBytes from '../../utils/format-bytes';

export const initialState = {
    ssds: [],
    arrayname: "",
    volumes: [],
    metadisks: [],
    loading: false,
    alertOpen: false,
    alertType: 'alert',
    alertTitle: '',
    errorMsg: '',
    errorCode: '',
    arraySize: 0,
    maxVolumeCount: 256,
    volumeMap: {},
    createVolumeButton: false,
    totalVolSize: 0,
    storagedisks: [],
    sparedisks: [],
    writebufferdisks: [],
    metadiskpath: '',
    slots: [],
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
                ...action.payload
            }
        case actionTypes.FETCH_ARRAY_SIZE:
            return {
                ...state,
                arraySize: action.payload.totalsize,
                totalVolSize: action.payload.usedspace,
                mountStatus: action.payload.mountStatus,
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
        case actionTypes.FETCH_ARRAY:
            return {
                ...state,
                ...action.payload,
                arrayExists: true,
                arraySize: action.payload.totalsize,
                totalVolSize: action.payload.usedspace
            }
        case actionTypes.SET_NO_ARRAY:
            return {
                ...state,
                arrayExists: false
            }
        case actionTypes.FETCH_VOLUMES: {
            return {
                ...state,
                ...action.payload
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
                            size: formatBytes(action.volume.Capacity.Data.AllocatedBytes),
                            usedspace: formatBytes(action.volume.Capacity.Data.ConsumedBytes),
                            maxiops: action.volume.Oem.MaxIOPS,
                            maxbw: action.volume.Oem.MaxBandwidth,
                            status: action.volume.Status.Oem.VolumeStatus,
                            url: action.volume["@odata.id"],
                            edit: false
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
                        size: formatBytes(action.volume.Capacity.Data.AllocatedBytes),
                        usedspace: formatBytes(action.volume.Capacity.Data.ConsumedBytes),
                        maxiops: action.volume.Oem.MaxIOPS,
                        maxbw: action.volume.Oem.MaxBandwidth,
                        status: action.volume.Status.Oem.VolumeStatus,
                        url: action.volume["@odata.id"]
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
                } /* istanbul ignore next */: {
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

export const arrayname = (state = {storageReducer:{}}) => state.storageReducer.arrayname
export default storageReducer;
