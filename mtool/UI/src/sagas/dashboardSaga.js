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


DESCRIPTION: <Contains Generator Functions for Dashboard component> *
@NAME : dashboardSaga.js
@AUTHORS: Jay Hitesh Sanghavi 
@Version : 1.0 *
@REVISION HISTORY
[03/06/2019] [Jay] : Prototyping..........////////////////////
*/
import axios from "axios";
import { call, takeEvery, put, cancelled } from "redux-saga/effects";
import { format as d3Format } from "d3-format";
import * as actionTypes from "../store/actions/actionTypes";
import * as actionCreators from "../store/actions/exportActionCreators";
import { formatNanoSeconds } from "../utils/format-bytes";

export function* fetchVolumeInfo() {
  try {
    const response = yield call([axios, axios.get], "/api/v1/get_all_volumes/", {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "x-access-token": localStorage.getItem("token"),
      },
    });

    const result = response.data;
    /* istanbul ignore else */
    if (result && !result.message) {
      yield put(actionCreators.fetchVolumes(result));
    }
    yield put(actionCreators.enableFetchingAlerts(false));
  } catch (error) {
    const defaultResponse = [];
    yield put(actionCreators.fetchVolumes(defaultResponse));
    yield put(actionCreators.enableFetchingAlerts(false));
  } finally {
    if (yield cancelled()) {
      const defaultResponse = [];
      yield put(actionCreators.fetchVolumes(defaultResponse));
      yield put(actionCreators.enableFetchingAlerts(false));
    }
  }
}

export function* fetchAlertsInfo() {
  try {
    const response = yield call(
      [axios, axios.get],
      "/api/v1.0/get_alert_info",
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "x-access-token": localStorage.getItem("token"),
        },
      }
    );

    const result = response.data;
    /* istanbul ignore else */
    if (result) {
      yield put(actionCreators.fetchAlerts(result.alerts));
    }
  } catch (error) {
    // console.log(error);
  }
}

function* fetchStorageInfo() {
  try {
    const response = yield call(
      [axios, axios.get],
      `/api/v1.0/available_storage/?ts=${Date.now()}`,
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "x-access-token": localStorage.getItem("token"),
        },
      }
    );

    const result = response.data;
    /* istanbul ignore else */
    if (result) {
      let arraySize = 0;
      result.forEach((array) => {
        arraySize += array.arraySize
      });
      yield put(
        actionCreators.fetchStorage(
          arraySize
        )
      );
    }
  } catch (error) {
    // console.log(error);
  }
}

function* fetchPerformanceInfo() {
  try {
    const response = yield call(
      [axios, axios.get],
      `/api/v1/perf/all?ts=${Date.now()}`,
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "x-access-token": localStorage.getItem("token"),
        },
      }
    );

    const result = response.data;

    /* istanbul ignore else */
    if (result) {
      yield put(
        actionCreators.fetchPerformance(
          d3Format(".1s")(result.iops_read),
          d3Format(".1s")(result.iops_write),
          Math.round((result.bw_read / (1024 * 1024)) * 100) / 100,
          Math.round((result.bw_write / (1024 * 1024)) * 100) / 100,
          formatNanoSeconds(Math.round(result.latency))
        )
      );
    }
  } catch (error) {
    // console.log(error);
  }
}

function* fetchIpAndMacInfo() {
  try {
    const response = yield call(
      [axios, axios.get],
      "/api/v1.0/get_ip_and_mac",
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "x-access-token": localStorage.getItem("token"),
        },
      }
    );

    const result = response.data;
    /* istanbul ignore else */
    if (result) {
      yield put(
        actionCreators.fetchIpAndMac(result.ip, result.mac, result.host)
      );
    }
  } catch (error) {
    // console.log(error);
  }
}

export function* dashboardWatcher() {
  yield takeEvery(actionTypes.SAGA_FETCH_VOLUME_INFO, fetchVolumeInfo);
  yield takeEvery(actionTypes.SAGA_FETCH_ALERTS_INFO, fetchAlertsInfo);
  yield takeEvery(actionTypes.SAGA_FETCH_STORAGE_INFO, fetchStorageInfo);
  yield takeEvery(
    actionTypes.SAGA_FETCH_PERFORMANCE_INFO,
    fetchPerformanceInfo
  );
  yield takeEvery(actionTypes.SAGA_FETCH_IPANDMAC_INFO, fetchIpAndMacInfo);
  // console.log("This is async operation");
}
