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

export function* fetchChassisFrontInfo() {
    try {
        const response = yield call([axios, axios.get], '/api/v1.0/get_chassis_front_info/', {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': localStorage.getItem('token'),
            }
        });
        const result = response.data;
        if (result) {
            yield put(actionCreators.fetchChassisFrontInfo(result.front_info));
        }
    } catch (error) {
        yield put(actionCreators.openAlertBox({
            alertOpen: true,
            istypealert: true,
            alerttype: 'alert',
            alerttitle: 'Hardware',
            alertdescription: 'Unable to retrieve data',
        }));
        yield put(actionCreators.fetchChassisFrontInfo([]));
    }
    finally {
        ;
    }
}

/*
export function* fetchChassisRearInfo() {
    try {
        const response = yield call([axios, axios.get], '/api/v1.0/get_chassis_rear_info/', {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': localStorage.getItem('token'),
            }
        });

        const result = response.data;
        if (result) {
            const chassisList = [];
            result.forEach(chassis => {
                chassisList.push({
                    ...chassis,
                });
            });
            yield put(actionCreators.fetchChassisRearInfo(chassisList));
        }
    } catch (error) {
        yield put(actionCreators.fetchChassisRearInfo([]));
    }
}
*/

export function* fetchServerInfo() {
    try {
        const response = yield call([axios, axios.get], '/api/v1.0/get_server_info/', {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': localStorage.getItem('token'),
            }
        });
        const result = response.data;
        if (result) {
            yield put(actionCreators.fetchServerInfo(result));
        }
    } catch (error) {
        yield put(actionCreators.fetchServerInfo({model:'',manufacturer:'',mac:'',ip:'',firmwareversion:'',serialno:'',host:'',}));
    }
}

export function* fetchPowerInfo() {
    try {
        // if(action.param == null || action.param != "doNotStartLoader")
        //     yield put(actionCreators.startLoader('Fetching BMC Information'));

        const response = yield call([axios, axios.get], '/api/v1.0/get_power_info/', {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': localStorage.getItem('token'),
            }
        });
        yield put(actionCreators.stopLoader());
        const result = response.data;
        if (result) {
            yield put(actionCreators.fetchPowerInfo(result));
        }
    } catch (error) {
        yield put(actionCreators.stopLoader());
        yield put(actionCreators.fetchPowerInfo({powerconsumption:'',powercap:'',powerstatus:'Off'}));
    }
}


export function* rebootSystem() {
    try {
        const response = yield call([axios, axios.post], '/api/v1.0/reboot_system/', {
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
                alerttitle: 'Reboot System',
                alertdescription: 'System Reboot Successful',
            }));
        }
        else if (response === 400) {
            yield put(actionCreators.openAlertBox({
                alertOpen: true,
                istypealert: true,
                alerttype: 'alert',
                alerttitle: 'Reboot System',
                alertdescription: 'System Reboot Failed',
            }));
        } else {
            yield put(actionCreators.openAlertBox({
                alertOpen: true,
                istypealert: true,
                alerttype: 'alert',
                alerttitle: 'Reboot System',
                alertdescription: 'System Reboot Failed',
            }));
            yield put(actionCreators.fetchChassisFrontInfo([]));
            yield put(actionCreators.fetchPowerInfo({powerconsumption:'',powercap:'',powerstatus:'Off'}));
            yield put(actionCreators.fetchServerInfo({model:'',manufacturer:'',mac:'',ip:'',firmwareversion:'',serialno:'',host:'',}));
        }
    }
    catch (error) {
        yield put(actionCreators.openAlertBox({
            alertOpen: true,
            istypealert: true,
            alerttype: 'alert',
            alerttitle: 'Reboot System',
            alertdescription: 'System Reboot Failed',
        }));
    }
}

export function* shutdownSystem() {
    try {
        const response = yield call([axios, axios.post], '/api/v1.0/shutdown_system/', {
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
                alerttitle: 'Shutdown System',
                alertdescription: 'System Shutdown Successful',
            }));
        }
        else if (response === 400)
            yield put(actionCreators.openAlertBox({
                alertOpen: true,
                istypealert: true,
                alerttype: 'alert',
                alerttitle: 'Shutdown System',
                alertdescription: 'System Shutdown Failed',
            }));
        else
            yield put(actionCreators.openAlertBox({
                alertOpen: true,
                istypealert: true,
                alerttype: 'alert',
                alerttitle: 'Shutdown System',
                alertdescription: 'System Shutdown Failed',
            }));
    }
    catch (error) {
        yield put(actionCreators.openAlertBox({
            alertOpen: true,
            istypealert: true,
            alerttype: 'alert',
            alerttitle: 'Shutdown System',
            alertdescription: 'System Shutdown Failed',
        }));
    }
}

export function* powerOnSystem() {
    try {
        const response = yield call([axios, axios.post], '/api/v1.0/power_on_system/', {
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
                alerttitle: 'Power On System',
                alertdescription: 'Power On Successful',
            }));
        }
        else if (response === 400)
            yield put(actionCreators.openAlertBox({
                alertOpen: true,
                istypealert: true,
                alerttype: 'alert',
                alerttitle: 'Power On System',
                alertdescription: 'Power On Failed',
            }));
        else
            yield put(actionCreators.openAlertBox({
                alertOpen: true,
                istypealert: true,
                alerttype: 'alert',
                alerttitle: 'Power On System',
                alertdescription: 'Power On Failed',
            }));
    }
    catch (error) {
        yield put(actionCreators.openAlertBox({
            alertOpen: true,
            istypealert: true,
            alerttype: 'alert',
            alerttitle: 'Power On System',
            alertdescription: 'Power On Failed',
        }));;
    }
}

export function* forceShutdownSystem() {
    try {
        const response = yield call([axios, axios.post], '/api/v1.0/force_shutdown_system/', {
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
                alerttitle: 'Shutdown System',
                alertdescription: 'System Shutdown Successful',
            }));
        }
        else if (response === 400)
            yield put(actionCreators.openAlertBox({
                alertOpen: true,
                istypealert: true,
                alerttype: 'alert',
                alerttitle: 'Shutdown System',
                alertdescription: 'System Shutdown Failed',
            }));
        else
            yield put(actionCreators.openAlertBox({
                alertOpen: true,
                istypealert: true,
                alerttype: 'alert',
                alerttitle: 'Shutdown System',
                alertdescription: 'System Shutdown Failed',
            }));
    }
    catch (error) {
        yield put(actionCreators.openAlertBox({
            alertOpen: true,
            istypealert: true,
            alerttype: 'alert',
            alerttitle: 'Shutdown System',
            alertdescription: 'System Shutdown Failed',
        }));
    }
}

export function* hardwareOverviewWatcher() {
    yield takeEvery(actionTypes.SAGA_HARDWARE_OVERVIEW_FETCH_SERVER_INFORMATION, fetchServerInfo);
    yield takeEvery(actionTypes.SAGA_HARDWARE_OVERVIEW_FETCH_POWER_INFORMATION, fetchPowerInfo);
    yield takeEvery(actionTypes.SAGA_HARDWARE_OVERVIEW_FETCH_CHASSIS_FRONT_INFORMATION, fetchChassisFrontInfo);
//    yield takeEvery(actionTypes.SAGA_HARDWARE_OVERVIEW_FETCH_CHASSIS_REAR_INFORMATION, fetchChassisRearInfo);
    yield takeEvery(actionTypes.SAGA_HARDWARE_OVERVIEW_REBOOT_SYSTEM, rebootSystem);
    yield takeEvery(actionTypes.SAGA_HARDWARE_OVERVIEW_SHUTDOWN_SYSTEM, shutdownSystem);
    yield takeEvery(actionTypes.SAGA_HARDWARE_OVERVIEW_FORCE_SHUTDOWN_SYSTEM, forceShutdownSystem);
    yield takeEvery(actionTypes.SAGA_HARDWARE_OVERVIEW_POWER_ON_SYSTEM, powerOnSystem);

}
