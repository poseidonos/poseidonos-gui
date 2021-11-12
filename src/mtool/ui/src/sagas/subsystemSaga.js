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

import axios from "axios";
import { call, takeEvery, put } from "redux-saga/effects";
import * as actionTypes from "../store/actions/actionTypes";
import * as actionCreators from "../store/actions/exportActionCreators";

function* fetchSubsystems() {
    const alertDetails = {
        errorMsg: "Unable to get subsytems!",
        alertType: "alert",
        alertTitle: "Fetch Subsystems",
    };
    try {
      yield put(actionCreators.startLoader("Fetching Subsystems"));
      const response = yield call([axios, axios.get], "/api/v1/subsystem/", {
        headers: {
          "x-access-token": localStorage.getItem("token"),
        },
      });
      const result = response.data;
      if (
        response.status === 200 &&
        response.data.result &&
        response.data.result.status.code !== 0
      ) {
        yield put(
          actionCreators.showSubsystemAlert({
            alertType: "alert",
            alertTitle: "Fetch Subsystems",
            errorMsg: "Unable to get Subsystems!",
            errorCode: `Description: ${response.data.result && response.data.result.status
                ? `${response.data.result.status.description}, Error code:${response.data.result.status.code}`
                : ""
              }`,
          })
        );
      } else if (result && response.data.result.status.code === 0) {
        yield put(actionCreators.getSubsystems(result.result.data.subsystemlist));
      } else {
        yield put(actionCreators.showSubsystemAlert({
          ...alertDetails,
          errorCode: `Description: ${response.data && response.data.result && response.data.result.status
              ? `${response.data.result.status.description}, Error code:${response.data.result.status.code}`
              : "Agent Communication Error"
            }`
        }));
      }
    } catch (error) {
      yield put(actionCreators.showSubsystemAlert({
        ...alertDetails,
        errorCode: `Agent Communication Error - ${error.message}`
      }));
    } finally {
      yield put(actionCreators.stopLoader());
    }
}


export default function* subsystemWatcher() {
    yield takeEvery(actionTypes.SAGA_FETCH_SUBSYSTEMS, fetchSubsystems);
}
