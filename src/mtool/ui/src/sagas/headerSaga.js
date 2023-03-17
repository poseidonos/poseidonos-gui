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
import * as actionTypes from "../store/actions/actionTypes";
import * as actionCreators from "../store/actions/exportActionCreators";


function* CallIsiBOFOSRunning(action) {
    try {
        yield put(actionCreators.setIsStatusCheckDone(false));
        const response = yield call([axios, axios.get], '/api/v1.0/get_Is_Ibof_OS_Running/', {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': localStorage.getItem('token'),
            },
        });
        if (response && response.status === 401) {
            action.payload.push('/');
            localStorage.setItem('isLoggedIn', false);
            localStorage.setItem('BMC_LoggedIn', false);
        }
        if (response && response.status === 500) {
            yield put(actionCreators.asyncIsiBOFOSRunning(false, "Not Running"));
        }
        const result = response.data;
        if (result)
            yield put(actionCreators.updateTimestamp(result.lastRunningTime));
        if (result && result.RESULT && result.RESULT.result && result.RESULT.result.status && result.RESULT.result.status.code === 0) {
            yield put(actionCreators.asyncIsiBOFOSRunning(true, "Running", result.state));
        }
        else if (result && result.code === "2804" && result.value !== "100") {
            if (result.timestamp !== "")
                yield put(actionCreators.updateTimestamp(result.timestamp));
            let percentage = ""
            if (result && result.value !== "") {
                percentage = `Rebuilding: ${result.value}%`;
                localStorage.setItem('Rebuilding_Value', result.value);
                yield put(actionCreators.asyncIsiBOFOSRunning(false, percentage));
            }
            else yield put(actionCreators.asyncIsiBOFOSRunning(false, "Rebuilding: Value Not Found"));
        }
        else yield put(actionCreators.asyncIsiBOFOSRunning(false, "Not Running"));
    }
    catch (e) {
        yield put(actionCreators.asyncIsiBOFOSRunning(false, "Not Running"));
        if (e.message.indexOf("401") >= 0) {
            localStorage.setItem("user", null);
            action.payload.resetIsLoggedIn();
            action.payload.push("/");
        }
    } finally {
        yield put(actionCreators.setIsStatusCheckDone(true));
    }

}

function* getPOSProperty() {
    try {
        const response = yield call([axios, axios.get], '/api/v1/pos/property', {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': localStorage.getItem('token'),
            },
        });
        if (response.status === 200) {
            yield put(actionCreators.setPOSProperty(response.data.result.data));
        }
    } catch (e) {
        // console.log(e)
    }
}

const getDescription = (id) => {
    let description = id;
    if (id === "addListener1" || id === "addListener2")
        description += ": added";
    else
        description += ": created";
    return description;
}

function* startIBOFOs() {
    yield put(actionCreators.setOperationsMessage([{ id: "ui", code: 200, description: "Starting Poseidon OS" }]));
    try {
        const response = yield call([axios, axios.get], '/api/v1.0/start_ibofos', {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': localStorage.getItem('token'),
            },
        });
        if (response.status === 200) {
            const responseStatus = response.data.result.status;
            const errorResponses = responseStatus.errorInfo ?
                responseStatus.errorInfo.errorResponses.map(er => {
                    if (er.eventName === "SUCCESS")
                        er.description = getDescription(er.id);
                    else 
                        er.description = `${er.id}: ${er.description}`;
                    return er;
                }) : [];
            yield put(actionCreators.setOperationsMessage([
                {
                    code: responseStatus.code,
                    id: "POS",
                    description: responseStatus.code === 0 ?
                        "POS started successfully" :
                        `${responseStatus.description || ""}. ${responseStatus.problem || ""} ${responseStatus.solution || ""}`
                },
                ...errorResponses
            ]));
        }
    } catch (e) {
        yield put(actionCreators.setOperationsMessage([{
            code: 500,
            id: "Server",
            description: `Error in Starting Poseidon OS: ${e}`
        }]));
    } finally {
        yield getPOSProperty();
    }
}


function* stopIBOFOs() {
    yield put(actionCreators.setOperationsMessage([{ id: "ui", code: 200, description: "Stopping Poseidon OS" }]));
    try {
        const response = yield call([axios, axios.get], '/api/v1.0/stop_ibofos', {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': localStorage.getItem('token'),
            },
        });
        if (response.status === 200) {
            const responseStatus = response.data;
            const errorResponses = responseStatus.errorInfo ?
                responseStatus.errorInfo.errorResponses : [];
            yield put(actionCreators.setOperationsMessage([
                {
                    code: responseStatus.code,
                    id: "POS",
                    description: responseStatus.code === 0 ?
                        "POS Stopped successfully" :
                        `${responseStatus.response || ""}. ${responseStatus.problem || ""} ${responseStatus.solution || ""}`
                },
                ...errorResponses
            ]));
        }
    } catch (e) {
        yield put(actionCreators.setOperationsMessage([{
            code: 500,
            id: "Server",
            description: `Error in Stopping Poseidon OS: ${e}`
        }]));
    }
}


function* resetIBOFOs() {
    yield put(actionCreators.setOperationsMessage("Resetting Poseidon OS"));
    try {
        const response = yield call([axios, axios.get], '/api/v1.0/cleanup', {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': localStorage.getItem('token'),
            },
        });
        if (response.status === 200) {
            yield put(actionCreators.setOperationsMessage("Poseidon OS Reset Successful"));
        }
    } catch (e) {
        yield put(actionCreators.setOperationsMessage("Error in Resetiing Poseidon OS: ", e));
    }
}

function* getPOSInfo() {
    try {
        const response = yield call([axios, axios.get], '/api/v1.0/pos/info', {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': localStorage.getItem('token'),
            },
        });
        if (response.status === 200) {
            yield put(actionCreators.setPOSInfo(response.data && response.data.result ?
                response.data.result.data : {}));
        }
    } catch (e) {
        // console.log(e)
    }
}

function* setPOSProperty(action) {
    yield put(actionCreators.setOperationsMessage([{
        id: "ui",
        code: 200,
        description: "Setting Poseidon OS Property"
    }]));
    try {
        const response = yield call([axios, axios.post], '/api/v1/pos/property', {
            property: action.payload
        }, {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': localStorage.getItem('token'),
            },
        });
        if (response.status === 200) {
            yield put(actionCreators.setOperationsMessage([{
                id: "POS",
                code: response.data.result.status.code,
                description: response.data.result.status.code === 0 ?
                    "Property Set Successfully" : response.data.result.status.description
            }]));
        }
    } catch (e) {
        yield put(actionCreators.setOperationsMessage([{
            code: 500,
            id: "Server",
            description: `Error in Setting PoseidonOS Property: ${e}`
        }]));

    } finally {
        yield getPOSProperty();
    }
}


export default function* headerWatcher() {
    yield takeEvery(actionTypes.SAGA_GET_IS_IBOF_OS_RUNNING, CallIsiBOFOSRunning);
    yield takeEvery(actionTypes.SAGA_START_IBOFOS, startIBOFOs);
    yield takeEvery(actionTypes.SAGA_STOP_IBOFOS, stopIBOFOs);
    yield takeEvery(actionTypes.SAGA_RESET_IBOFOS, resetIBOFOs);
    yield takeEvery(actionTypes.SAGA_GET_POS_INFO, getPOSInfo);
    yield takeEvery(actionTypes.SAGA_GET_POS_PROPERTY, getPOSProperty);
    yield takeEvery(actionTypes.SAGA_SET_POS_PROPERTY, setPOSProperty);
}
