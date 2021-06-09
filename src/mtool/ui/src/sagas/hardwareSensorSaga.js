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
@NAME : hardwareSensorSaga.js
@AUTHORS: Jay Sanghavi 
@Version : 1.0 *
@REVISION HISTORY
[03/11/2019] [Jay] : Prototyping..........////////////////////
*/

import axios from 'axios';
import { call, takeEvery, put } from 'redux-saga/effects';
import * as actionTypes from '../store/actions/actionTypes';
import * as actionCreators from '../store/actions/exportActionCreators';

export function* fetchPowerSensorInfo() {
    try {
        // yield put(actionCreators.startLoader('Fetching BMC Information'));
        const response = yield call([axios, axios.get], '/api/v1.0/get_power_sensor_info/', {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': localStorage.getItem('token'),
            }
        });
        yield put(actionCreators.stopLoader());
        const result = response.data;
        if (result) {
            yield put(actionCreators.fetchPowerSensorInfo(result.power_sensor_info));
        }
    } catch (error) {
        yield put(actionCreators.stopLoader());
        yield put(actionCreators.fetchPowerSensorInfo([]));
    }
    finally {
        ;
    }
}

export function* fetchFanSensorInfo() {
    
    try {
        yield put(actionCreators.startLoader('Fetching BMC Information'));
        const response = yield call([axios, axios.get], '/api/v1.0/get_fan_sensor_info/', {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': localStorage.getItem('token'),
            }
        });
        yield put(actionCreators.stopLoader());
        const result = response.data;
        if (result) {
            yield put(actionCreators.fetchFanSensorInfo(result.fan_sensor_info));
        }
    } catch (error) {
        yield put(actionCreators.stopLoader());
        yield put(actionCreators.fetchFanSensorInfo([]));
    }
    finally {
        ;
    }
}

export function* fetchTemperatureSensorInfo() {
    try {
        yield put(actionCreators.startLoader('Fetching BMC Information'));
        const response = yield call([axios, axios.get], '/api/v1.0/get_temperature_sensor_info/', {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': localStorage.getItem('token'),
            }
        });
        yield put(actionCreators.stopLoader());
        const result = response.data;
        if (result) {
            yield put(actionCreators.fetchTemperatureSensorInfo(result.temperature_sensor_info));
        }
    } catch (error) {
        yield put(actionCreators.stopLoader());
        yield put(actionCreators.fetchTemperatureSensorInfo([]));
    }
    finally {
        ;
    }
}

export function* hardwareSensorWatcher() {
    yield takeEvery(actionTypes.SAGA_HARDWARE_SENSORS_FETCH_POWER_SENSOR_INFORMATION, fetchPowerSensorInfo);
    yield takeEvery(actionTypes.SAGA_HARDWARE_SENSORS_FETCH_FAN_SENSOR_INFORMATION, fetchFanSensorInfo);
    yield takeEvery(actionTypes.SAGA_HARDWARE_SENSORS_FETCH_TEMPERATURE_SENSOR_INFORMATION, fetchTemperatureSensorInfo);

}
