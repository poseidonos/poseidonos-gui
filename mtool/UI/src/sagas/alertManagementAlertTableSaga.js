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


DESCRIPTION: <Contains Generator Functions for Alert Table component> *
@NAME : alertManagementAlertTableSaga.js
@AUTHORS: Jay Hitesh Sanghavi 
@Version : 1.0 *
@REVISION HISTORY
[03/06/2019] [Jay] : Prototyping..........////////////////////
*/
import axios from 'axios';
import { call, takeEvery} from 'redux-saga/effects';
import * as actionTypes from "../store/actions/actionTypes";
import {fetchAlertsInfo} from "./alertManagementSaga"

export function* updateAlertsInfo(action) {
    try {
        const response = yield call([axios, axios.post], '/api/v1.0/update_alerts/',action.newAlerts,{ 
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': localStorage.getItem('token'),
            },
        });
        const {status} = response;
        if (status === 200) {
            yield fetchAlertsInfo();
        }
    }
    catch (error) {
       ;
    }
}

export function* deleteAlertsInfo(action) {
    try {
        const response = yield call([axios, axios.post], '/api/v1.0/delete_alerts/',action.deleteAlerts,{ 
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': localStorage.getItem('token'),
            },
        });
        const {status} = response;
        if (status === 200) {
            yield fetchAlertsInfo();
        }
    }
    catch (error) {
       ;
    }
}


export function* toggleAlertsInfo(action) {
    try {
        const response = yield call([axios, axios.post], '/api/v1.0/toggle_alert_status/',action.toggleAlerts,{ 
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': localStorage.getItem('token'),
            },
        });
        const {status} = response;
        if (status === 200) {
            yield fetchAlertsInfo();
        }
    }
    catch (error) {
       ;
    }
}

export function* alertManagementAlertTableWatcher() {
    yield takeEvery(actionTypes.SAGA_ALERT_MANAGEMENT_UPDATE_ALERTS, updateAlertsInfo);
    yield takeEvery(actionTypes.SAGA_ALERT_MANAGEMENT_DELETE_ALERTS, deleteAlertsInfo);
    yield takeEvery(actionTypes.SAGA_ALERT_MANAGEMENT_TOGGLE_ALERTS, toggleAlertsInfo);
}
