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
import { call, takeEvery, put} from 'redux-saga/effects';
import * as actionTypes from "../store/actions/actionTypes";
import * as actionCreators from '../store/actions/exportActionCreators';
import {fetchAlertsInfo} from "./alertManagementSaga"

export function* updateAlertsInfo(action) {
    try {
        const response = yield call([axios, axios.post], '/api/v1.0/update_alerts/',action.newAlerts,{ 
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': localStorage.getItem('token'),
            },
        });
        const {status} = response;
        if (status === 200) {
            const payload = {
                alertOpen: true,
                istypealert: true,
                alerttype: 'info',
                alerttitle: 'Update Alert',
                alertdescription: 'Alert Updated Successfully',
              };
            yield fetchAlertsInfo();
            yield put(actionCreators.openAlertBox(payload));
           
        }
    }
    catch (error) {
        const payload = {
            alertOpen: true,
            istypealert: true,
            alerttype: 'alert',
            alerttitle: 'Update Alert',
            alertdescription: 'Failed to Update the Alert',
          };
          yield put(actionCreators.openAlertBox(payload));
    }
}

export function* deleteAlertsInfo(action) {
    try {
        const response = yield call([axios, axios.post], '/api/v1.0/delete_alerts/',action.deleteAlerts,{ 
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': localStorage.getItem('token'),
            },
        });
        const {status} = response;
        if (status === 200) {
            const payload = {
                alertOpen: true,
                istypealert: true,
                alerttype: 'info',
                alerttitle: 'Delete Alert',
                alertdescription: 'Alert Deleted Successfully',
              };
            yield fetchAlertsInfo();
            yield put(actionCreators.openAlertBox(payload));
        }
    }
    catch (error) {
        const payload = {
            alertOpen: true,
            istypealert: true,
            alerttype: 'alert',
            alerttitle: 'Delete Alert',
            alertdescription: 'Failed to Delete the Alert',
          };
          yield put(actionCreators.openAlertBox(payload));
    }
}


export function* toggleAlertsInfo(action) {
    try {
        const response = yield call([axios, axios.post], '/api/v1.0/toggle_alert_status/',action.toggleAlerts,{ 
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': localStorage.getItem('token'),
            },
        });
        const {status} = response;
        if (status === 200) {
            yield fetchAlertsInfo();
        }
    }
    catch (error) {
        const payload = {
            alertOpen: true,
            istypealert: true,
            alerttype: 'alert',
            alerttitle: 'Toggle Alert Status',
            alertdescription: 'Failed to Toggle the Alert Status',
          };
          yield put(actionCreators.openAlertBox(payload));
    }
}

export function* alertManagementAlertTableWatcher() {
    yield takeEvery(actionTypes.SAGA_ALERT_MANAGEMENT_UPDATE_ALERTS, updateAlertsInfo);
    yield takeEvery(actionTypes.SAGA_ALERT_MANAGEMENT_DELETE_ALERTS, deleteAlertsInfo);
    yield takeEvery(actionTypes.SAGA_ALERT_MANAGEMENT_TOGGLE_ALERTS, toggleAlertsInfo);
}
