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
 *     * Neither the name of Intel Corporation nor the names of its
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
import { call, takeEvery, put, cancelled } from "redux-saga/effects";
import { format as d3Format } from "d3-format";
import * as actionTypes from "../store/actions/actionTypes";
import * as actionCreators from "../store/actions/exportActionCreators";
import { formatNanoSeconds } from "../utils/format-bytes";
import { BYTE_FACTOR } from "../utils/constants";

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
          Math.round((result.bw_read / (BYTE_FACTOR * BYTE_FACTOR)) * 100) / 100,
          Math.round((result.bw_write / (BYTE_FACTOR * BYTE_FACTOR)) * 100) / 100,
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
