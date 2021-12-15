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
import { call, takeEvery,put } from 'redux-saga/effects';
import * as actionTypes from "../store/actions/actionTypes";
import { fetchUsersInfo } from "./userManagementSaga"
import * as actionCreators from "../store/actions/exportActionCreators"

export function* addNewUsersInfo(action) {
    try {
        const response = yield call([axios, axios.post], '/api/v1.0/add_new_user/', action.addNewUser, {
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
            yield put(actionCreators.openAlertBox({
                alertOpen: true,
                istypealert: true,
                alerttype: 'info',
                alerttitle: 'Add New User',
                alertdescription: 'User added successfully',
            }));
        }
    }
    catch (error) {
        if (error.response.status === 400)
            yield put(actionCreators.openAlertBox({
                alertOpen: true,
                istypealert: true,
                alerttype: 'alert',
                alerttitle: 'Add New User',
                alertdescription: error.response.data,
            }));
        else
        yield put(actionCreators.openAlertBox({
            alertOpen: true,
            istypealert: true,
            alerttype: 'alert',
            alerttitle: 'Add New User',
            alertdescription: 'Error in adding User',
        }));
    }
}

export function* userManagementAddNewUsersWatcher() {
    yield takeEvery(actionTypes.SAGA_USER_MANAGEMENT_ADD_NEW_USERS, addNewUsersInfo);
}
