/*
 *   BSD LICENSE
 *   Copyright (c) 2021 Samsung Electronics Corporation
 *   All rights reserved.
 *
 *   Redistribution and use in source and binary forms, with or without
 *   modification, are permitted provided that the following conditions
 *   are met:
 *
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in
 *       the documentation and/or other materials provided with the
 *       distribution.
 *     * Neither the name of Samsung Electronics Corporation nor the names of its
 *       contributors may be used to endorse or promote products derived
 *       from this software without specific prior written permission.
 *
 *   THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 *   "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 *   LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 *   A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 *   OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 *   SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 *   LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 *   DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 *   THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 *   (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 *   OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

import axios from "axios";
import { call, takeEvery, put } from "redux-saga/effects";
import * as actionTypes from "../store/actions/actionTypes";
import * as actionCreators from "../store/actions/exportActionCreators";
import { IP_REGEX } from "../utils/constants";

function hasResult(response) {
  return response.data && response.data.result;
}

function isResponseCodeSuccess(response) {
  return hasResult(response) &&
    response.data.result.status && response.data.result.status.code === 0;
}

function isResponseCodeFailure(response) {
  return hasResult(response) &&
    response.data.result.status && response.data.result.status.code !== 0;
}



export function* fetchSubsystems() {
  const alertDetails = {
    msg: "Unable to get subsytems!",
    type: "alert",
    title: "Fetch Subsystems",
  };
  try {
    yield put(actionCreators.startLoader("Fetching Subsystems"));
    const response = yield call([axios, axios.get], "/api/v1/subsystem/", {
      headers: {
        "x-access-token": localStorage.getItem("token"),
      },
    });
    const result = response.data;
    if (
      response.status === 200 &&
      isResponseCodeFailure(response)
    ) {
      yield put(
        actionCreators.showSubsystemAlert({
          type: "alert",
          title: "Fetch Subsystems",
          msg: "Unable to get Subsystems!",
          code: `Description: ${response.data.result && response.data.result.status
            ? `${response.data.result.status.description}`
            : ""
            }`,
        })
      );
    } else if (isResponseCodeSuccess(response)) {
      const subsystems = result.result.data.subsystemlist.map(subsystem => (
        {
          ...subsystem,
          subnqn: subsystem.nqn
        }
      ))
      yield put(actionCreators.getSubsystems(subsystems));
    } else {
      yield put(actionCreators.showSubsystemAlert({
        ...alertDetails,
        errorCode: `Description: ${response.data && response.data.result && response.data.result.status
          ? `${response.data.result.status.description}`
          : "Agent Communication Error"
          }`
      }));
    }
  } catch (error) {
    yield put(actionCreators.showSubsystemAlert({
      ...alertDetails,
      errorCode: `Agent Communication Error - ${error.message}`
    }));
  } finally {
    yield put(actionCreators.stopLoader());
  }
}

export function* deleteListener(action) {
  const alertDetails = {
    msg: "Failed to Delete Listener!",
    type: "alert",
    title: "Delete Listener",
  };
  /* if (!(IP_REGEX.test(action.payload.ip))) {
    yield put(
      actionCreators.showSubsystemAlert({
        msg: "Please provide a valid IP address",
        type: "alert",
        title: "Invalid IP",
      })
    );
    return;
  }*/
  
  console.log("action payload",action.payload)
  try {
    const response = yield call([axios, axios.delete], "/api/v1/listener/", {
      data: {
        ...action.payload
      },
      headers: {
        "x-access-token": localStorage.getItem("token"),
      },
    });
    console.log("Hereeeeee", response)
    if (
      response.status === 200 &&
      isResponseCodeFailure(response)
    ) {
      yield put(
        actionCreators.showSubsystemAlert({
          type: "alert",
          title: "Delete Listener",
          msg: "Failed to delete Listener!",
          code: `Description: ${response.data.result && response.data.result.status
            ? `${response.data.result.status.posDescription}`
            : ""
            }`,
        })
      );
    } else if (isResponseCodeSuccess(response)) {
      yield put(
        actionCreators.showSubsystemAlert({
          type: "info",
          title: "Delete Listener",
          msg: "Listener Deleted Successfully"
        })
      );

      yield fetchSubsystems();
    } else {
      yield put(actionCreators.showSubsystemAlert({
        ...alertDetails,
        errorCode: `Description: ${response.data && response.data.result && response.data.result.status
          ? `${response.data.result.status.posDescription}`
          : "Agent Communication Error"
          }`
      }));
    }
  } catch(error){
    console.log("In error",error)
  }finally{
    console.log("In finally")
  }
}
export function* addListener(action) {
  const alertDetails = {
    msg: "Failed to Add Listener!",
    type: "alert",
    title: "Add Listener",
  };
  if (!(IP_REGEX.test(action.payload.ip))) {
    yield put(
      actionCreators.showSubsystemAlert({
        msg: "Please provide a valid IP address",
        type: "alert",
        title: "Invalid IP",
      })
    );
    return;
  }
  try {
    yield put(actionCreators.startLoader("Adding Listener"));
    const response = yield call([axios, axios.post], "/api/v1/listener/", {
      name: action.payload.subnqn,
      transport_type: action.payload.type,
      target_address: action.payload.ip,
      transport_service_id: action.payload.port
    }, {
      headers: {
        "x-access-token": localStorage.getItem("token"),
      },
    });
    if (
      response.status === 200 &&
      isResponseCodeFailure(response)
    ) {
      yield put(
        actionCreators.showSubsystemAlert({
          type: "alert",
          title: "Add Listener",
          msg: "Failed to add Listener!",
          code: `Description: ${response.data.result && response.data.result.status
            ? `${response.data.result.status.posDescription}`
            : ""
            }`,
        })
      );
    } else if (isResponseCodeSuccess(response)) {
      yield put(
        actionCreators.showSubsystemAlert({
          type: "info",
          title: "Add Listener",
          msg: "Listener Added Successfully"
        })
      );

      yield fetchSubsystems();
    } else {
      yield put(actionCreators.showSubsystemAlert({
        ...alertDetails,
        errorCode: `Description: ${response.data && response.data.result && response.data.result.status
          ? `${response.data.result.status.posDescription}`
          : "Agent Communication Error"
          }`
      }));
    }
  } catch (error) {
    yield put(actionCreators.showSubsystemAlert({
      ...alertDetails,
      errorCode: `Agent Communication Error - ${error.message}`
    }));
  } finally {
    yield put(actionCreators.stopLoader());
  }
}

export function* createSubsystem(action) {
  const alertDetails = {
    msg: "Failed to create Subsytem!",
    type: "alert",
    title: "Create Subsystem",
  };
  try {
    yield put(actionCreators.startLoader("Creating Subsystems"));
    const response = yield call([axios, axios.post], "/api/v1/subsystem/", {
      ...action.payload
    }, {
      headers: {
        "x-access-token": localStorage.getItem("token"),
      },
    });
    if (
      response.status === 200 &&
      isResponseCodeFailure(response)
    ) {
      yield put(
        actionCreators.showSubsystemAlert({
          type: "alert",
          title: "Create Subsystem",
          msg: "Failed to create Subsystem!",
          code: `Description: ${response.data.result && response.data.result.status
            ? `${response.data.result.status.posDescription}`
            : ""
            }`,
        })
      );
    } else if (isResponseCodeSuccess(response)) {
      yield put(
        actionCreators.showSubsystemAlert({
          type: "info",
          title: "Create Subsystem",
          msg: "Subsystem Created Successfully"
        })
      );
    } else {
      yield put(actionCreators.showSubsystemAlert({
        ...alertDetails,
        errorCode: `Description: ${response.data && response.data.result && response.data.result.status
          ? `${response.data.result.status.posDescription}`
          : "Agent Communication Error"
          }`
      }));
    }
  } catch (error) {
    yield put(actionCreators.showSubsystemAlert({
      ...alertDetails,
      errorCode: `Agent Communication Error - ${error.message}`
    }));
  } finally {
    yield put(actionCreators.stopLoader());
    yield fetchSubsystems();
  }
}

export function* deleteSubsystem(action) {
  const alertDetails = {
    msg: "Failed to delete Subsytem!",
    type: "alert",
    title: "Delete Subsystem",
  };
  try {
    yield put(actionCreators.startLoader("Deleting Subsystems"));
    const response = yield call([axios, axios.delete], "/api/v1/subsystem/", {
      data: {
        ...action.payload
      },
      headers: {
        "x-access-token": localStorage.getItem("token"),
      },
    });
    if (
      response.status === 200 &&
      isResponseCodeFailure(response)
    ) {
      yield put(
        actionCreators.showSubsystemAlert({
          type: "alert",
          title: "Delete Subsystem",
          msg: "Failed to delete Subsystem!",
          code: `Description: ${response.data.result && response.data.result.status
            ? `${response.data.result.status.posDescription}`
            : ""
            }`,
        })
      );
    } else if (isResponseCodeSuccess(response)) {
      yield put(
        actionCreators.showSubsystemAlert({
          type: "info",
          title: "Delete Subsystem",
          msg: "Subsystem Deleted Successfully"
        })
      );
    } else {
      yield put(actionCreators.showSubsystemAlert({
        ...alertDetails,
        errorCode: `Description: ${response.data && response.data.result && response.data.result.status
          ? `${response.data.result.status.description}`
          : "Agent Communication Error"
          }`
      }));
    }
  } catch (error) {
    yield put(actionCreators.showSubsystemAlert({
      ...alertDetails,
      errorCode: `Agent Communication Error - ${error.message}`
    }));
  } finally {
    yield put(actionCreators.stopLoader());
    yield fetchSubsystems();
  }
}

export default function* subsystemWatcher() {
  yield takeEvery(actionTypes.SAGA_FETCH_SUBSYSTEMS, fetchSubsystems);
  yield takeEvery(actionTypes.SAGA_CREATE_SUBSYSTEM, createSubsystem);
  yield takeEvery(actionTypes.SAGA_DELETE_SUBSYSTEM, deleteSubsystem);
  yield takeEvery(actionTypes.SAGA_ADD_LISTENER, addListener);
  yield takeEvery(actionTypes.SAGA_DELETE_LISTENER, deleteListener);
}
