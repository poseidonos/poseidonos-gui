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
@NAME : hardwarePowerManagementSaga.js
@AUTHORS: Jay Sanghavi 
@Version : 1.0 *
@REVISION HISTORY
[03/11/2019] [Jay] : Prototyping..........////////////////////
*/

import axios from 'axios';
import { call, takeEvery, put } from 'redux-saga/effects';
import * as actionTypes from '../store/actions/actionTypes';
import * as actionCreators from '../store/actions/exportActionCreators';
import {fetchChassisFrontInfo} from './hardwareOverviewSaga'

export function* fetchPowerSummary() {
    try {
        const response = yield call([axios, axios.get], '/api/v1.0/get_power_summary/', {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': localStorage.getItem('token'),
            }
        });

        const result = response.data;
        if (result) {
            yield put(actionCreators.fetchPowerSummary(result)); // Get Current Power Mode
            if(result.currentpowermode && result.currentpowermode === "Manual")
                yield fetchChassisFrontInfo();
        }
    } catch (error) {
        yield put(actionCreators.fetchPowerSummary({}));
    }
    finally {
        ;
    }
}


export function* setCurrentPowerMode(action) {
    try {
        const response = yield call([axios, axios.post], '/api/v1.0/set_current_power_mode/', action.param, {
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
                alerttitle: 'Power Mode',
                alertdescription: 'Power Mode Changed Successfully',
            }));
        }
        else if (response === 400)
            yield put(actionCreators.openAlertBox({
                alertOpen: true,
                istypealert: true,
                alerttype: 'alert',
                alerttitle: 'Power Mode',
                alertdescription: "Couldn't Change Power Mode",
            }));
        else
            yield put(actionCreators.openAlertBox({
                alertOpen: true,
                istypealert: true,
                alerttype: 'alert',
                alerttitle: 'Power Mode',
                alertdescription: "Couldn't Change Power Mode",
            }));
            yield fetchPowerSummary();
    }
    catch (error) {
        ;
    }
}


export function* changeCurrentPowerState(action) {
    try {
        const response = yield call([axios, axios.post], '/api/v1.0/update_current_power_state/', action.param, {
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
                alerttitle: 'Power State',
                alertdescription: 'Power State Change is in progress. The table should automatically update the new power state after sometime',
            }));
        }
        else if (response === 400)
            yield put(actionCreators.openAlertBox({
                alertOpen: true,
                istypealert: true,
                alerttype: 'alert',
                alerttitle: 'Power State',
                alertdescription: "Couldn't Change Power State",
            }));
        else
            yield put(actionCreators.openAlertBox({
                alertOpen: true,
                istypealert: true,
                alerttype: 'alert',
                alerttitle: 'Power State',
                alertdescription: "Couldn't Change Power State",
            }));
            // (yield fetchChassisFrontInfo());
            setTimeout(yield fetchChassisFrontInfo(),2500);
            setTimeout(yield fetchChassisFrontInfo(),2500);
    }
    catch (error) {
        yield fetchChassisFrontInfo();
        yield put(actionCreators.openAlertBox({
            alertOpen: true,
            istypealert: true,
            alerttype: 'alert',
            alerttitle: 'Power State',
            alertdescription: "Couldn't Change Power State",
        }));
    }
}

export function* hardwarePowerManagementWatcher() {
    yield takeEvery(actionTypes.SAGA_HARDWARE_POWER_MANAGEMENT_FETCH_POWER_SUMMARY_INFORMATION, fetchPowerSummary);
    yield takeEvery(actionTypes.SAGA_HARDWARE_POWER_MANAGEMENT_SET_CURRENT_POWER_MODE, setCurrentPowerMode);
    yield takeEvery(actionTypes.SAGA_HARDWARE_POWER_MANAGEMENT_CHANGE_CURRENT_POWER_STATE,changeCurrentPowerState);
}
