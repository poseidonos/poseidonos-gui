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

import axios from "axios";
import { call, takeEvery, put } from "redux-saga/effects";
import * as actionTypes from "../store/actions/actionTypes";
import * as actionCreators from "../store/actions/exportActionCreators";

export function* fetchTelemetryProperties() {
    try {
        const response = yield call([axios, axios.get], '/api/v1/telemetry/properties', {
            headers: {
                "x-access-token": localStorage.getItem("token"),
            },
        });
        const result = response.data;
        if (result) {
            yield put(actionCreators.setTelemetryProperties(result.properties));
            yield put(actionCreators.setTelemetryStatus(result.status));
        }
    } catch (e) {
        yield put(actionCreators.setTelemetryStatus(false));
    }
}

export function* setTelemetryProperties(action) {
    try {
        yield put(actionCreators.startLoader("Setting Telemetry Properties"));
        const response = yield call([axios, axios.post],
            '/api/v1/telemetry/properties',
            action.payload, {
            headers: {
                "x-access-token": localStorage.getItem("token"),
            },
        }
        );
        const result = response.data;
        if (!result?.result?.status?.code) {
            yield put(actionCreators.openTelemetryAlert({
                title: "Set Telemetry Properties",
                open: true,
                errorMsg: "Telemetry Properties saved succesfully",
                type: "info"
            }))
        }
    } catch (e) {
        yield put(actionCreators.openTelemetryAlert({
            title: "Set Telemetry Properties",
            open: true,
            errorMsg: "Failed to Set Telemetry Properties",
            type: "alert"
        }))
    } finally {
        yield fetchTelemetryProperties();
        yield put(actionCreators.stopLoader());
    }
}

export function* startTelemetry() {
    try {
        yield put(actionCreators.startLoader("Starting Telemetry"));
        const response = yield call([axios, axios.post], '/api/v1/telemetry', {}, {
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                "x-access-token": localStorage.getItem("token"),
            },
        });
        const result = response.data;
        if (!result?.result?.status?.code) {
            yield put(actionCreators.setTelemetryStatus(true));
        }
    } catch (e) {
        yield put(actionCreators.openTelemetryAlert({
            title: "Start Telemetry",
            open: true,
            errorMsg: "Failed to Start Telemetry",
            type: "alert"
        }))
    } finally {
        yield fetchTelemetryProperties();
        yield put(actionCreators.stopLoader());
    }
}

export function* stopTelemetry() {
    yield put(actionCreators.startLoader("Stopping Telemetry"));
    try {
        const response = yield call([axios, axios.delete], '/api/v1/telemetry', {
            headers: {
                "x-access-token": localStorage.getItem("token"),
            },
        });
        const result = response.data;
        if (!result?.result?.status?.code) {
            yield put(actionCreators.setTelemetryStatus(false));
        }
    } catch (e) {
        yield put(actionCreators.openTelemetryAlert({
            title: "Stop Telemetry",
            open: true,
            errorMsg: "Failed to Stop Telemetry",
            type: "alert"
        }));
    } finally {
        yield fetchTelemetryProperties();
        yield put(actionCreators.stopLoader());
    }
}

export function* telemetryWatcher() {
    yield takeEvery(actionTypes.SAGA_FETCH_TELEMETRY_PROPERTIES, fetchTelemetryProperties);
    yield takeEvery(actionTypes.SAGA_START_TELEMETRY, startTelemetry);
    yield takeEvery(actionTypes.SAGA_STOP_TELEMETRY, stopTelemetry);
    yield takeEvery(actionTypes.SAGA_SAVE_TELEMETRY_CONFIG, setTelemetryProperties);
}
