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


DESCRIPTION: <Contains Generator Functions for header component> *
@NAME : headerSaga.js
@AUTHORS: Jay Hitesh Sanghavi 
@Version : 1.0 *
@REVISION HISTORY
[03/06/2019] [Jay] : Prototyping..........////////////////////
*/
import axios from 'axios';
import { call, takeEvery, put } from 'redux-saga/effects';
import * as actionTypes from "../store/actions/actionTypes";
import * as actionCreators from "../store/actions/exportActionCreators";


function* CallIsiBOFOSRunning(action) {
    try {
        const response = yield call([axios, axios.get], '/api/v1.0/get_Is_Ibof_OS_Running/',{ 
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': localStorage.getItem('token'),
            },
        });
        /* istanbul ignore if */
        if(response && response.status === 401) {
            action.payload.push('/');
            localStorage.setItem('isLoggedIn',false);
            localStorage.setItem('BMC_LoggedIn',false);
        }
        /* istanbul ignore if */
        if (response && response.status === 500) {
            yield put(actionCreators.asyncIsiBOFOSRunning(false, "Not Running"));
        }
        const result = response.data;
         /* istanbul ignore else */
        if (result)
            yield put(actionCreators.updateTimestamp(result.lastRunningTime));
        if (result && result.RESULT && result.RESULT.result && result.RESULT.result.status && result.RESULT.result.status.code === 0) {
            yield put(actionCreators.asyncIsiBOFOSRunning(true, "Running"));
        }
        else if (result && result.code === "2804" && result.value !== "100") {
            if(result.timestamp !== "")
                yield put(actionCreators.updateTimestamp(result.timestamp));
            let percentage = ""
            if (result && result.value !== "") {
                percentage = `Rebuilding: ${result.value}%`;
                localStorage.setItem('Rebuilding_Value', result.value);
                yield put(actionCreators.asyncIsiBOFOSRunning(false, percentage));
            }
            else yield put(actionCreators.asyncIsiBOFOSRunning(false, "Rebuilding: Value Not Found"));
        }
        else yield put(actionCreators.asyncIsiBOFOSRunning(false, "Not Running"));
    }
    catch (e) {
        yield put(actionCreators.asyncIsiBOFOSRunning(false, "Not Running"));
        if(e.message.indexOf("401") >= 0) {
            localStorage.setItem("user", null);
            action.payload.resetIsLoggedIn();
            action.payload.push("/");
        }
    }

}

export default function* headerWatcher() {
    yield takeEvery(actionTypes.SAGA_GET_IS_IBOF_OS_RUNNING, CallIsiBOFOSRunning);
}
