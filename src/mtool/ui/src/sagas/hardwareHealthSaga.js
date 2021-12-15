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

import axios from 'axios';
import { call, takeEvery, put } from 'redux-saga/effects';
import * as actionTypes from '../store/actions/actionTypes';
import * as actionCreators from '../store/actions/exportActionCreators';

export function* fetchSoftwareDetails() {
    try {
        const response = yield call([axios, axios.get], '/api/v1.0/get_software_health/', {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': localStorage.getItem('token'),
            }
        });

        const result = response.data;
        if (result) {
            yield put(actionCreators.fetchSoftwareDetails(result.software_health));
        }
    } catch (error) {
        yield put(actionCreators.fetchSoftwareDetails([]));
    }
    finally {
        ;
    }
}

export function* fetchHardwareDetails() {
    
    try {
        // yield put(actionCreators.startLoader('Fetching BMC Information'));
        const response = yield call([axios, axios.get], '/api/v1.0/get_hardware_health/', {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': localStorage.getItem('token'),
            }
        });
        yield put(actionCreators.stopLoader());
        const result = response.data;
        if (result) {
            yield put(actionCreators.fetchHardwareDetails(result.hardware_health));
        }
    } catch (error) {
        yield put(actionCreators.stopLoader());
        yield put(actionCreators.fetchHardwareDetails([]));
    }
    finally {
        yield put(actionCreators.stopLoader());
        ;
    }
}

export function* fetchNetworkDetails() {
    try {
        const response = yield call([axios, axios.get], '/api/v1.0/get_network_health/', {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': localStorage.getItem('token'),
            }
        });

        const result = response.data;
        if (result) {
            yield put(actionCreators.fetchNetworkDetails(result.network_health));
        }
    } catch (error) {
        yield put(actionCreators.fetchNetworkDetails([]));
    }
    finally {
        ;
    }
}

export function* hardwareHealthWatcher() {
    yield takeEvery(actionTypes.SAGA_HARDWARE_HEALTH_FETCH_SOFTWARE_DETAILS, fetchSoftwareDetails);
    yield takeEvery(actionTypes.SAGA_HARDWARE_HEALTH_FETCH_HARDWARE_DETAILS, fetchHardwareDetails);
    yield takeEvery(actionTypes.SAGA_HARDWARE_HEALTH_FETCH_NETWORK_DETAILS, fetchNetworkDetails);

}
