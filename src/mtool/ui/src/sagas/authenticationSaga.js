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


export function* getConfig() {
  try {
    const response = yield call([axios, axios.get], '/api/v1/configure');
    if (response.status === 200 && response.data && response.data.isConfigured === true) {
      yield put(actionCreators.setIsConfigured(
        {
          isConfigured: true,
          telemetryIP: response.data.ip,
          telemetryPort: response.data.port
        }
      ));
    } else {
      yield put(actionCreators.setIsConfigured({ isConfigured: false }));
    }
  } catch (error) {
    yield put(actionCreators.setIsConfigured({ isConfigured: false }));
  }
}

export function* resetConfig() {
  try {
    yield put(actionCreators.setIsResettingConfig(true))
    const response = yield call([axios, axios.delete], '/api/v1/configure');
    if (response.status === 200) {
      yield put(actionCreators.setIsConfigured({ isConfigured: false }));
      yield put(actionCreators.setShowConfig(false));
    } else {
      yield put(actionCreators.setIsResetConfigFailed(true));
    }
    yield put(actionCreators.setIsResettingConfig(false));
  } catch (error) {
    yield put(actionCreators.setIsResettingConfig(false));
    yield put(actionCreators.setIsResetConfigFailed(true));
  }
}

export function* saveConfig(action) {
  try {
    yield put(actionCreators.setIsSavingConfig(true))
    const response = yield call(
      [axios, axios.post],
      '/api/v1/configure',
      action.payload
    );

    if (response.status === 200) {
      yield put(actionCreators.setIsConfigured(
        {
          isConfigured: true,
          telemetryIP: action.payload.telemetryIP,
          telemetryPort: action.payload.telemetryPort
        }));
      yield put(actionCreators.setShowConfig(false))
    } else {
      yield put(actionCreators.setconfigurationFailed())
    }
    yield put(actionCreators.setIsSavingConfig(false))
  } catch (error) {
    yield put(actionCreators.setconfigurationFailed())
    yield put(actionCreators.setIsSavingConfig(false))
  }
}

export function* login(action) {
  try {
    localStorage.setItem('BMC_LoggedIn', false); // Set bmc_isLoggedIn false once the user logs in again
    const response = yield call(
      [axios, axios.post],
      '/api/v1.0/login/',
      action.payload
    );
    if (response.data) {
      localStorage.setItem('isLoggedIn', true);
      localStorage.setItem('userid', response.data.username);
      localStorage.setItem('token', response.data.token);
      yield put(actionCreators.setIsLoggedIn());
      action.history.push('/dashboard');
    }
  } catch (error) {
    yield put(actionCreators.setLoginFailed());
    localStorage.setItem('isLoggedIn', false);
    localStorage.setItem('BMC_LoggedIn', false);
  }
}


export function* authenticationWatcher() {
  yield takeEvery(actionTypes.SAGA_CHECK_CONFIGURATION, getConfig);
  yield takeEvery(actionTypes.SAGA_RESET_CONFIGURATION, resetConfig);
  yield takeEvery(actionTypes.SAGA_CONFIGURE, saveConfig);
  yield takeEvery(actionTypes.SAGA_LOGIN, login);
}
