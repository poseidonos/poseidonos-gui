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
import { call, takeEvery, put, cancelled } from "redux-saga/effects";
import { format as d3Format } from "d3-format";
import * as actionTypes from "../store/actions/actionTypes";
import * as actionCreators from "../store/actions/exportActionCreators";
import formatBytes, { formatNanoSeconds } from "../utils/format-bytes";


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

/*
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
    if (result) {
      yield put(actionCreators.fetchAlerts(result.alerts));
    }
  } catch (error) {
    // console.log(error);
  }
}
*/


export function* fetchCheckTelemetry() {
  try {
    const response = yield call(
      [axios, axios.get],
      '/api/v1/checktelemetry',
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "x-access-token": localStorage.getItem("token"),
        },
      }
    );
    if (response.status === 200 && response.data) {
      if (response.data.isTelemetryEndpointUp === true)
        yield put(actionCreators.setShowTelemetryNotRunning(false, ""));
      if (response.data.isTelemetryEndpointUp === false)
        yield put(actionCreators.setShowTelemetryNotRunning(true, "Telemetry is not running, please restart telemetry"));
    } else
      yield put(actionCreators.setShowTelemetryNotRunning(true, "PrometheusDB might not be running. Please Check"));
  } catch (error) {
    yield put(actionCreators.setShowTelemetryNotRunning(true, "Please check and configure Telemetry Url"));
  }
}

function* fetchPerformanceInfo() {
  try {
    const response = yield call(
      [axios, axios.get],
      `/api/v1/perf/all`,
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
          result.iops_read ? d3Format(".2s")(result.iops_read) : 0,
          result.iops_write ? d3Format(".2s")(result.iops_write) : 0,
          result.bw_read ? formatBytes(Math.round(result.bw_read), 0) : 0,
          result.bw_write ? formatBytes(Math.round(result.bw_write), 0) : 0,
          result.latency_read ? formatNanoSeconds(Math.round(result.latency_read)) : 0,
          result.latency_write ? formatNanoSeconds(Math.round(result.latency_write)) : 0
        )
      );
    }
  } catch (error) {
    // console.log(error);
  }
}

function* fetchHardwareHealth() {
  try {
    const response = yield call(
      [axios, axios.get],
      `/api/v1/get_hardware_health`,
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
    if (response.status === 200 && result && result.devices?.length > 0) {
      yield put(
        actionCreators.fetchHardwareHealth(result)
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
        actionCreators.fetchIpAndMac(result.ip, result.mac, result.host, result.timestamp)
      );
    }
  } catch (error) {
    // console.log(error);
  }
}

export function* dashboardWatcher() {
  yield takeEvery(actionTypes.SAGA_FETCH_CHECK_TELEMETRY, fetchCheckTelemetry);
  yield takeEvery(actionTypes.SAGA_FETCH_VOLUME_INFO, fetchVolumeInfo);
  // yield takeEvery(actionTypes.SAGA_FETCH_ALERTS_INFO, fetchAlertsInfo);
  yield takeEvery(actionTypes.SAGA_FETCH_PERFORMANCE_INFO, fetchPerformanceInfo);
  yield takeEvery(actionTypes.SAGA_FETCH_HARDWARE_HEALTH, fetchHardwareHealth);
  yield takeEvery(actionTypes.SAGA_FETCH_IPANDMAC_INFO, fetchIpAndMacInfo);
  // console.log("This is async operation");
}
