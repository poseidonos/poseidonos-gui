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
@NAME : hardwareHealthSaga.js
@AUTHORS: Jay Sanghavi 
@Version : 1.0 *
@REVISION HISTORY
[03/11/2019] [Jay] : Prototyping..........////////////////////
*/

import axios from 'axios';
import { call, takeEvery, put } from 'redux-saga/effects';
import * as actionTypes from '../store/actions/actionTypes';
import * as actionCreators from '../store/actions/exportActionCreators';

export function* fetchSoftwareDetails() {
    try {
        const response = yield call([axios, axios.get], '/api/v1.0/get_software_health/', {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': localStorage.getItem('token'),
            }
        });

        const result = response.data;
        if (result) {
            yield put(actionCreators.fetchSoftwareDetails(result.software_health));
        }
    } catch (error) {
        yield put(actionCreators.fetchSoftwareDetails([]));
    }
    finally {
        ;
    }
}

export function* fetchHardwareDetails() {
    
    try {
        // yield put(actionCreators.startLoader('Fetching BMC Information'));
        const response = yield call([axios, axios.get], '/api/v1.0/get_hardware_health/', {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': localStorage.getItem('token'),
            }
        });
        yield put(actionCreators.stopLoader());
        const result = response.data;
        if (result) {
            yield put(actionCreators.fetchHardwareDetails(result.hardware_health));
        }
    } catch (error) {
        yield put(actionCreators.stopLoader());
        yield put(actionCreators.fetchHardwareDetails([]));
    }
    finally {
        yield put(actionCreators.stopLoader());
        ;
    }
}

export function* fetchNetworkDetails() {
    try {
        const response = yield call([axios, axios.get], '/api/v1.0/get_network_health/', {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': localStorage.getItem('token'),
            }
        });

        const result = response.data;
        if (result) {
            yield put(actionCreators.fetchNetworkDetails(result.network_health));
        }
    } catch (error) {
        yield put(actionCreators.fetchNetworkDetails([]));
    }
    finally {
        ;
    }
}

export function* hardwareHealthWatcher() {
    yield takeEvery(actionTypes.SAGA_HARDWARE_HEALTH_FETCH_SOFTWARE_DETAILS, fetchSoftwareDetails);
    yield takeEvery(actionTypes.SAGA_HARDWARE_HEALTH_FETCH_HARDWARE_DETAILS, fetchHardwareDetails);
    yield takeEvery(actionTypes.SAGA_HARDWARE_HEALTH_FETCH_NETWORK_DETAILS, fetchNetworkDetails);

}
