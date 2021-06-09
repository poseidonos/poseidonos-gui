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


DESCRIPTION: <Contains Generator Functions for Add New User component> *
@NAME : userManagementAddNewUsersSaga.js
@AUTHORS: Jay Hitesh Sanghavi
@Version : 1.0 *
@REVISION HISTORY
[03/06/2019] [Jay] : Prototyping..........////////////////////
*/
import axios from 'axios';
import { call, takeEvery,put } from 'redux-saga/effects';
import * as actionTypes from "../store/actions/actionTypes";
import { fetchUsersInfo } from "./userManagementSaga"
import * as actionCreators from "../store/actions/exportActionCreators"

export function* addNewUsersInfo(action) {
    try {
        const response = yield call([axios, axios.post], '/api/v1.0/add_new_user/', action.addNewUser, {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': localStorage.getItem('token'),
            },
        });
        const { status } = response;
        
         /* istanbul ignore else */
        if (status === 200) {
            yield fetchUsersInfo();
            yield put(actionCreators.openAlertBox({
                alertOpen: true,
                istypealert: true,
                alerttype: 'info',
                alerttitle: 'Add New User',
                alertdescription: 'User added successfully',
            }));
        }
    }
    catch (error) {
        if (error.response.status === 400) {
            yield put(actionCreators.openAlertBox({
                alertOpen: true,
                istypealert: true,
                alerttype: 'alert',
                alerttitle: 'Add New User',
                alertdescription: 'User already exists',
            }));
        }
        else
        yield put(actionCreators.openAlertBox({
            alertOpen: true,
            istypealert: true,
            alerttype: 'alert',
            alerttitle: 'Add New User',
            alertdescription: 'Error in adding User',
        }));
    }
}

export function* userManagementAddNewUsersWatcher() {
    yield takeEvery(actionTypes.SAGA_USER_MANAGEMENT_ADD_NEW_USERS, addNewUsersInfo);
}
