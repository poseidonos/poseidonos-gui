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


DESCRIPTION: <Contains Generator Functions for User Table component> *
@NAME : userManagementUserTableSaga.js
@AUTHORS: Jay Hitesh Sanghavi 
@Version : 1.0 *
@REVISION HISTORY
[03/06/2019] [Jay] : Prototyping..........////////////////////
*/
import axios from 'axios';
import { call, takeEvery } from 'redux-saga/effects';
import * as actionTypes from "../store/actions/actionTypes";
import * as actionCreators from "../store/actions/exportActionCreators";
import { fetchUsersInfo } from "./userManagementSaga"

export function* updateUsersInfo(action) {
    try {
        const response = yield call([axios, axios.post], '/api/v1.0/update_user/', action.newUsers, {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': localStorage.getItem('token'),
            },
        });
        const { status } = response;
        if (status === 200) {
            yield fetchUsersInfo();
        }
        else yield actionCreators.openAlertBox({
            alerttitle: 'Update User',
            alertOpen: true,
            alertdescription: 'User updation failed',
            alerttype: 'alert',
            istypealert: false,
        });
    }
    catch (error) {
        ;
    }
}

export function* deleteUsersInfo(action) {
    try {
        const response = yield call([axios, axios.post], '/api/v1.0/delete_users/', action.deleteUsers, {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': localStorage.getItem('token'),
            },
        });
        const { status } = response;
        if (status !== 200) {
            yield actionCreators.openAlertBox({
                alerttitle: 'Delete User',
                alertOpen: true,
                alertdescription: 'User deletion failed',
                alerttype: 'alert',
                istypealert: false,
            });
        }
        else if (status === 200)
            yield fetchUsersInfo();
    }
    catch (error) {
        ;
    }
}


export function* toggleUsersInfo(action) {
    try {
        const response = yield call([axios, axios.post], '/api/v1.0/toggle_status/', action.toggleUsers, {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': localStorage.getItem('token'),
            },
        });
        const { status } = response;
        if (status === 200) {
            yield fetchUsersInfo();
        }
        else yield actionCreators.openAlertBox({
            alerttitle: 'Toggle User',
            alertOpen: true,
            alertdescription: 'Admin Cannot be Deactivated',
            alerttype: 'alert',
            istypealert: false,
        });
    }
    catch (error) {
        ;
    }
}

export function* userManagementUserTableWatcher() {
    yield takeEvery(actionTypes.SAGA_USER_MANAGEMENT_UPDATE_USERS, updateUsersInfo);
    yield takeEvery(actionTypes.SAGA_USER_MANAGEMENT_DELETE_USERS, deleteUsersInfo);
    yield takeEvery(actionTypes.SAGA_USER_MANAGEMENT_TOGGLE_USERS, toggleUsersInfo);
}
