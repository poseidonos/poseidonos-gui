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
import {fetchChassisFrontInfo} from './hardwareOverviewSaga'

export function* fetchPowerSummary() {
    try {
        const response = yield call([axios, axios.get], '/api/v1.0/get_power_summary/', {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': localStorage.getItem('token'),
            }
        });

        const result = response.data;
        if (result) {
            yield put(actionCreators.fetchPowerSummary(result)); // Get Current Power Mode
            if(result.currentpowermode && result.currentpowermode === "Manual")
                yield fetchChassisFrontInfo();
        }
    } catch (error) {
        yield put(actionCreators.fetchPowerSummary({}));
    }
    finally {
        ;
    }
}

/*
export function* setCurrentPowerMode(action) {
    try {
        const response = yield call([axios, axios.post], '/api/v1.0/set_current_power_mode/', action.param, {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': localStorage.getItem('token'),
            },
        });

        const { status } = response;
        if (status === 200) {
            yield put(actionCreators.openAlertBox({
                alertOpen: true,
                istypealert: true,
                alerttype: 'info',
                alerttitle: 'Power Mode',
                alertdescription: 'Power Mode Changed Successfully',
            }));
        }
        else if (response === 400)
            yield put(actionCreators.openAlertBox({
                alertOpen: true,
                istypealert: true,
                alerttype: 'alert',
                alerttitle: 'Power Mode',
                alertdescription: "Couldn't Change Power Mode",
            }));
        else
            yield put(actionCreators.openAlertBox({
                alertOpen: true,
                istypealert: true,
                alerttype: 'alert',
                alerttitle: 'Power Mode',
                alertdescription: "Couldn't Change Power Mode",
            }));
            yield fetchPowerSummary();
    }
    catch (error) {
        ;
    }
}
*/

export function* changeCurrentPowerState(action) {
    try {
        const response = yield call([axios, axios.post], '/api/v1.0/update_current_power_state/', action.param, {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': localStorage.getItem('token'),
            },
        });

        const { status } = response;
        if (status === 200) {
            yield put(actionCreators.openAlertBox({
                alertOpen: true,
                istypealert: true,
                alerttype: 'info',
                alerttitle: 'Power State',
                alertdescription: 'Power State Change is in progress. The table should automatically update the new power state after sometime',
            }));
        }
        else if (response === 400)
            yield put(actionCreators.openAlertBox({
                alertOpen: true,
                istypealert: true,
                alerttype: 'alert',
                alerttitle: 'Power State',
                alertdescription: "Couldn't Change Power State",
            }));
        else
            yield put(actionCreators.openAlertBox({
                alertOpen: true,
                istypealert: true,
                alerttype: 'alert',
                alerttitle: 'Power State',
                alertdescription: "Couldn't Change Power State",
            }));
            // (yield fetchChassisFrontInfo());
            setTimeout(yield fetchChassisFrontInfo(),2500);
            setTimeout(yield fetchChassisFrontInfo(),2500);
    }
    catch (error) {
        yield fetchChassisFrontInfo();
        yield put(actionCreators.openAlertBox({
            alertOpen: true,
            istypealert: true,
            alerttype: 'alert',
            alerttitle: 'Power State',
            alertdescription: "Couldn't Change Power State",
        }));
    }
}

export function* hardwarePowerManagementWatcher() {
    yield takeEvery(actionTypes.SAGA_HARDWARE_POWER_MANAGEMENT_FETCH_POWER_SUMMARY_INFORMATION, fetchPowerSummary);
    // yield takeEvery(actionTypes.SAGA_HARDWARE_POWER_MANAGEMENT_SET_CURRENT_POWER_MODE, setCurrentPowerMode);
    yield takeEvery(actionTypes.SAGA_HARDWARE_POWER_MANAGEMENT_CHANGE_CURRENT_POWER_STATE,changeCurrentPowerState);
}
