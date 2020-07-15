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

DESCRIPTION: <Contains Generator Functions for Configuration container> *
@NAME : logManagementSaga.js
@AUTHORS: Palak Kapoor 
@Version : 1.0 *
@REVISION HISTORY
[08/22/2019] [Palak] : Prototyping..........////////////////////
*/

import axios from 'axios';
import { call, takeEvery, put } from 'redux-saga/effects';
import * as actionTypes from '../store/actions/actionTypes';
import * as actionCreators from '../store/actions/exportActionCreators';

export function* getIbofOsLogs() {
  try {
    const response = yield call([axios, axios.get], `/api/v1.0/get_Ibof_OS_Logs/?ts=${Date.now()}`, {
      headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'x-access-token': localStorage.getItem('token'),
      }
  });

    const result = response.data;
    if (result) {
      const logList = [];
      result.forEach(log => {
        logList.push({
          ...log,
        });
      });
      yield put(actionCreators.getIbofOsLogs(logList));
    }
  } catch (error) {
    //  console.log(error);
  }
}

export function* setLiveLogsDb(action) {
  console.log("calling set live logs\n",action.payload);
  
  try {
     yield call(
      [axios, axios.post],
      '/api/v1.0/set_live_logs/',
      {"liveLogs":action.payload}, {
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'x-access-token': localStorage.getItem('token'),
        }
    }
    );
    yield put(actionCreators.setLiveLogs(action.payload));
  } catch (error) {
    yield put(actionCreators.setLiveLogs(action.payload));
  }
}

export function* getLiveLogsDb() {
  console.log("getLiveLogsDb")
  try {
    const response = yield call([axios, axios.get], `/api/v1.0/get_live_logs/?ts=${Date.now()}`, {
      headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'x-access-token': localStorage.getItem('token'),
      }
  });

    const result = response.data;
    console.log("livedata response",response.data)
    if (result) {
      yield put(actionCreators.setLiveLogs(result));
    }
  } catch (error) {
     console.log(error);
  }
}



export function* logManagementWatcher() {
    yield takeEvery(actionTypes.SAGA_GET_IBOFOS_LOGS, getIbofOsLogs);
    yield takeEvery(actionTypes.SAGA_SET_LIVE_LOGS_DB, setLiveLogsDb);
    yield takeEvery(actionTypes.SAGA_GET_LIVE_LOGS_DB, getLiveLogsDb);
  }
  