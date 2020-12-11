/* -------------------------------------------------------------------------------------/
                                                                                    /
/               COPYRIGHT (c) 2019 SAMSUNG ELECTRONICS CO., LTD.                      /
/                          ALL RIGHTS RESERVED                                        /
/                                                                                     /
/   Permission is hereby granted to licensees of Samsung Electronics Co., Ltd.        /
/   products to use or abstract this computer program for the sole purpose of         /
/   implementing a product based on Samsung Electronics Co., Ltd. products.           /
/   No other rights to reproduce, use, or disseminate this computer program,          /
/   whether in part or in whole, are granted.                                         / 
/                                                                                     /
/   Samsung Electronics Co., Ltd. makes no representation or warranties with          /
/   respect to the performance of this computer program, and specifically disclaims   /
/   any responsibility for any damages, special or consequential, connected           /
/   with the use of this program.                                                     /
/                                                                                     /
/-------------------------------------------------------------------------------------/

DESCRIPTION: <Contains Generator Functions for hardware container> *
@NAME : hardwareOverviewSaga.js
@AUTHORS: Jay Sanghavi 
@Version : 1.0 *
@REVISION HISTORY
[03/11/2019] [Jay] : Prototyping..........////////////////////
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
        else if (response === 400)
            yield put(actionCreators.openAlertBox({
                alertOpen: true,
                istypealert: true,
                alerttype: 'alert',
                alerttitle: 'Reboot System',
                alertdescription: 'System Reboot Failed',
            }));
        else
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
    yield takeEvery(actionTypes.SAGA_HARDWARE_OVERVIEW_FETCH_CHASSIS_REAR_INFORMATION, fetchChassisRearInfo);
    yield takeEvery(actionTypes.SAGA_HARDWARE_OVERVIEW_REBOOT_SYSTEM, rebootSystem);
    yield takeEvery(actionTypes.SAGA_HARDWARE_OVERVIEW_SHUTDOWN_SYSTEM, shutdownSystem);
    yield takeEvery(actionTypes.SAGA_HARDWARE_OVERVIEW_FORCE_SHUTDOWN_SYSTEM, forceShutdownSystem);
    yield takeEvery(actionTypes.SAGA_HARDWARE_OVERVIEW_POWER_ON_SYSTEM, powerOnSystem);

}
