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

DESCRIPTION: <Contains Generator Functions for BMC Authentication container> *
@NAME : BMCAuthenticationSaga.js
@AUTHORS: Jay Sanghavi 
@Version : 1.0 *
@REVISION HISTORY
[21/02/2020] [Jay] : Prototyping..........////////////////////
*/

import axios from 'axios';
import { call, takeEvery, put } from 'redux-saga/effects';
import * as actionTypes from '../store/actions/actionTypes';
import * as actionCreators from '../store/actions/exportActionCreators';



export function* bmc_login(action) {
  try {
    const response = yield call(
      [axios, axios.post],
      '/api/v1.0/bmc_login/',
      action.payload
    );
    if (response.data) {
       localStorage.setItem('BMC_LoggedIn', true);
       // localStorage.setItem('userid', response.data.username);
       // localStorage.setItem('token', response.data.token);
        yield put(actionCreators.BMCSetIsLoggedIn());
        action.history.push('/Hardware/Overview');
      }
    } catch (error) {
        yield put(actionCreators.BMCSetLoginFailed());
        localStorage.setItem('BMC_LoggedIn', false);
  }
}


export function* BMCAuthenticationWatcher() {
  yield takeEvery(actionTypes.SAGA_BMC_LOGIN, bmc_login);
  
}
