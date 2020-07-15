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


DESCRIPTION: <Contains Generator Functions for Alert Management container> *
@NAME : alertManagementSaga.js
@AUTHORS: Jay Hitesh Sanghavi 
@Version : 1.0 *
@REVISION HISTORY
[03/06/2019] [Jay] : Prototyping..........////////////////////
*/
import axios from 'axios';
import { call, takeEvery, put,cancelled } from 'redux-saga/effects';
import * as actionTypes from "../store/actions/actionTypes";
import * as actionCreators from "../store/actions/exportActionCreators";

export function* fetchAlertsInfo() {
    try {
        const response = yield call([axios, axios.get], '/api/v1.0/get_alerts/', {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': localStorage.getItem('token'),
            },
        });
        const result = response.data;
        if (result) {
            yield put(actionCreators.fetchAlertsInfo(result));
        }
        else yield put(actionCreators.fetchAlertsInfo([]));
    }
    catch (error) {
       yield put(actionCreators.fetchAlertsInfo([]));
    }
    finally {
        if(yield cancelled())
        {
            yield put(actionCreators.fetchAlertsInfo([]));
        }
    }
}

export function* fetchAlertsTypeInfo() {
    try {
        const response = yield call([axios, axios.get], "/api/v1.0/get_alert_types/",{headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'x-access-token': localStorage.getItem('token'),
          }});
        const result = response.data;
        if (result.alert_types) {
            yield put(actionCreators.fetchAlertsType(result.alert_types));
        }
    }
    catch (error) {
        ;
    }
}


export function* alertManagementContainerWatcher() {
    yield takeEvery(actionTypes.SAGA_ALERT_MANAGEMENT_FETCH_ALERTS, fetchAlertsInfo);
    yield takeEvery(actionTypes.SAGA_ALERT_MANAGEMENT_FETCH_ALERTS_TYPE, fetchAlertsTypeInfo);
}
