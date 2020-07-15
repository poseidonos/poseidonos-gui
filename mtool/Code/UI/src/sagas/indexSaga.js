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


DESCRIPTION: <Root Index file for running Sagas> *
@NAME : indexSaga.js
@AUTHORS: Jay Hitesh Sanghavi 
@Version : 1.0 *
@REVISION HISTORY
[03/06/2019] [Jay] : Prototyping..........////////////////////
*/

import { all } from 'redux-saga/effects';
import headerWatcher from "./headerSaga"
import {dashboardWatcher} from "./dashboardSaga"
import {configurationsettingWatcher} from "./configurationsettingSaga"
import {logManagementWatcher} from "./logManagementSaga"
import {alertManagementContainerWatcher} from "./alertManagementSaga"
import {alertManagementAlertTableWatcher} from "./alertManagementAlertTableSaga"
import {alertManagementAddNewAlertsWatcher} from "./alertManagementAddNewAlertsSaga"
import {authenticationWatcher} from "./authenticationSaga"
import {userManagementContainerWatcher} from "./userManagementSaga"
import {userManagementUserTableWatcher} from "./userManagementUserTableSaga"
import {userManagementAddNewUsersWatcher} from "./userManagementAddNewUsersSaga"
import storageWatcher from "./storageSaga";
import performanceWatcher from './performanceSaga';
import {hardwareOverviewWatcher} from './hardwareOverviewSaga'
import {hardwareSensorWatcher} from './hardwareSensorSaga'
import {hardwareHealthWatcher} from './hardwareHealthSaga'
import {hardwarePowerManagementWatcher} from './hardwarePowerManagementSaga'
import {BMCAuthenticationWatcher} from './BMCAuthenticationSaga'

export default function* rootSaga() {
    yield all([
        headerWatcher(),
        dashboardWatcher(),
        configurationsettingWatcher(),
        logManagementWatcher(),
        alertManagementContainerWatcher(),
        alertManagementAlertTableWatcher(),
        alertManagementAddNewAlertsWatcher(),
        storageWatcher(),
        performanceWatcher(),
        authenticationWatcher(),
        userManagementContainerWatcher(),
        userManagementUserTableWatcher(),
        userManagementAddNewUsersWatcher(),
        hardwareOverviewWatcher(),
        hardwareSensorWatcher(),
        hardwareHealthWatcher(),
        hardwarePowerManagementWatcher(),
        BMCAuthenticationWatcher(),
    ]);
}