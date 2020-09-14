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


DESCRIPTION: <Contains pure actions for Storage Management Page> *
@NAME : storageActions.js
@AUTHORS: Aswin K K
@Version : 1.0 *
@REVISION HISTORY
[21/08/2019] [Aswin] : Prototyping..........////////////////////
*/

import * as actionTypes from "./actionTypes";

export const clearVolumes = () => {
    return {
        type: actionTypes.CLEAR_VOLUMES
    }
}

export const addVolumeDetails = (volume) => {
    return {
        type:actionTypes.ADD_VOLUME,
        volume,
    };
}

export const fetchDevices = (disks) => {
    return {
        type:actionTypes.FETCH_DEVICE_INFO,
        ssds: disks.devices,
        metadisks: disks.metadevices
    };
}

export const fetchArray = (payload) => {
    return {
        type: actionTypes.FETCH_ARRAY,
        payload
    }
}

export const setNoArray = () => {
    return {
        type: actionTypes.SET_NO_ARRAY
    }
}

export const showStorageAlert = (payload) => {
    return {
        type: actionTypes.STORAGE_SHOW_ALERT,
        payload
    }
}

export const fetchArraySize = (payload) => {
    return {
        type: actionTypes.FETCH_ARRAY_SIZE,
        payload
    }
}

export const fetchMaxVolumeCount = (payload) => {
    return {
        type: actionTypes.FETCH_MAX_VOLUME_COUNT,
        payload
    }
}

export const toggleCreateVolumeButton= (payload) => {
    return {
        type: actionTypes.TOGGLE_CREATE_VOLUME_BUTTON,
        payload
    }
}

export const fetchStorageVolumes = (payload) => {
    return {
        type: actionTypes.FETCH_VOLUMES,
        payload
    }
}

export const startStorageLoader = (payload) => {
    return {
        type: actionTypes.STORAGE_START_LOADER,
        payload
    }
}

export const stopStorageLoader = () => {
    return {
        type: actionTypes.STORAGE_STOP_LOADER
    }
}

export const fetchDeviceDetails = (payload) => {
    return {
        type: actionTypes.FETCH_DEVICE_DETAILS,
        payload
    }
}