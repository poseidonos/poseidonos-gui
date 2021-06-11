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
 *     * Neither the name of Intel Corporation nor the names of its
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

export function* getIbofOsLogs() {
  try {
    const response = yield call([axios, axios.get], `/api/v1.0/get_Ibof_OS_Logs/?ts=${Date.now()}`, {
      headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'x-access-token': localStorage.getItem('token'),
      }
  });

    const result = response.data;
    if (result) {
      const logList = [];
      result.forEach(log => {
        logList.push({
          ...log,
        });
      });
      yield put(actionCreators.getIbofOsLogs(logList));
    }
  } catch (error) {
    //  console.log(error);
  }
}

export function* setLiveLogsDb(action) {
  
  try {
     yield call(
      [axios, axios.post],
      '/api/v1.0/set_live_logs/',
      {"liveLogs":action.payload}, {
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'x-access-token': localStorage.getItem('token'),
        }
    }
    );
    yield put(actionCreators.setLiveLogs(action.payload));
  } catch (error) {
    yield put(actionCreators.setLiveLogs(action.payload));
  }
}

export function* getLiveLogsDb() {
  try {
    const response = yield call([axios, axios.get], `/api/v1.0/get_live_logs/?ts=${Date.now()}`, {
      headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'x-access-token': localStorage.getItem('token'),
      }
  });

    const result = response.data;
    if (result) {
      yield put(actionCreators.setLiveLogs(result));
    }
  } catch (error) {
     // console.log(error);
  }
}



export function* logManagementWatcher() {
    yield takeEvery(actionTypes.SAGA_GET_IBOFOS_LOGS, getIbofOsLogs);
    yield takeEvery(actionTypes.SAGA_SET_LIVE_LOGS_DB, setLiveLogsDb);
    yield takeEvery(actionTypes.SAGA_GET_LIVE_LOGS_DB, getLiveLogsDb);
  }
  
