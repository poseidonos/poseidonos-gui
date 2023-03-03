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
import { call, takeEvery } from 'redux-saga/effects';
import * as actionTypes from "../store/actions/actionTypes";
import * as actionCreators from "../store/actions/exportActionCreators";
import { fetchUsersInfo } from "./userManagementSaga"

export function* updateUsersInfo(action) {
    try {
        const response = yield call([axios, axios.post], '/api/v1.0/update_user/', {
            ...action.newUsers,
            oldid: action.newUsers._id
        }, {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': localStorage.getItem('token'),
            },
        });
        const { status } = response;
       
        /* istanbul ignore else */
        if (status === 200) {
            yield fetchUsersInfo();
        }
    }
    catch (error) {
        yield actionCreators.openAlertBox({
            alerttitle: 'Update User',
            alertOpen: true,
            alertdescription: 'User updation failed',
            alerttype: 'alert',
            istypealert: false,
        });
    }
}

export function* deleteUsersInfo(action) {
    try {
        const response = yield call([axios, axios.post], '/api/v1.0/delete_users/', action.deleteUsers, {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': localStorage.getItem('token'),
            },
        });
        const { status } = response;
        /* istanbul ignore else */
        if (status === 200) {
            yield fetchUsersInfo();
        }
    }
    catch (error) {
        yield actionCreators.openAlertBox({
            alerttitle: 'Delete User',
            alertOpen: true,
            alertdescription: 'User deletion failed',
            alerttype: 'alert',
            istypealert: false,
        });
    }
}

export function* userManagementUserTableWatcher() {
    yield takeEvery(actionTypes.SAGA_USER_MANAGEMENT_UPDATE_USERS, updateUsersInfo);
    yield takeEvery(actionTypes.SAGA_USER_MANAGEMENT_DELETE_USERS, deleteUsersInfo);
}
