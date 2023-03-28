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

export const fetchTransports = (transports) => {
    return {
        type:actionTypes.FETCH_TRANSPORT_INFO,
        transports
    };
}

export const fetchArray = (payload) => {
    return {
        type: actionTypes.FETCH_ARRAY,
        payload
    }
}

export const startFetchingVolumes = () => {
    return {
        type: actionTypes.START_FETCHING_VOLUMES
    }
}

export const stopFetchingVolumes = () => {
    return {
        type: actionTypes.STOP_FETCHING_VOLUMES
    }
}

export const fetchConfig = (payload) => {
    return {
        type: actionTypes.FETCH_CONFIG,
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

export const fetchArrayDetails = (payload) => {
    return {
        type: actionTypes.GET_ARRAY_INFO,
        payload
    }
}

export const setDeviceFetching = (payload) => {
    return {
        type: actionTypes.SET_DEVICE_FETCHING,
        payload
    }
}

export const setTransportFetching = (payload) => {
    return {
        type: actionTypes.SET_TRANSPORT_FETCHING,
        payload
    }
}

export const setArrayInfoFetching = (payload) => {
    return {
        type: actionTypes.SET_ARRAY_INFO_FETCHING,
        payload
    }
}
