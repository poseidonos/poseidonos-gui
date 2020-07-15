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


DESCRIPTION: <Contains Generator Functions for User Management container> *
@NAME : userManagementSaga.js
@AUTHORS: Jay Hitesh Sanghavi 
@Version : 1.0 *
@REVISION HISTORY
[03/06/2019] [Jay] : Prototyping..........////////////////////
*/
import axios from 'axios';
import { call, takeEvery, put,cancelled } from 'redux-saga/effects';
import * as actionTypes from "../store/actions/actionTypes";
import * as actionCreators from "../store/actions/exportActionCreators";

export function* fetchUsersInfo() {
    try {
        const response = yield call([axios, axios.get], '/api/v1.0/get_users/',{headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'x-access-token': localStorage.getItem('token'),
          }});
        const result = response.data;
        if (result) {
            yield put(actionCreators.fetchUsersInfo(result));
        }
        else yield put(actionCreators.fetchUsersInfo([]));
    }
    catch (error) {
       yield put(actionCreators.fetchUsersInfo([]));
    }
    finally {
        if(yield cancelled())
        {
            yield put(actionCreators.fetchUsersInfo([]));
        }
    }
}


export function* userManagementContainerWatcher() {
    yield takeEvery(actionTypes.SAGA_USER_MANAGEMENT_FETCH_USERS,fetchUsersInfo);
}
