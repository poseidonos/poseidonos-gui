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


const data = [{
    category: 'Common',
    fields: [{
        label: 'Process Uptime Second',
        field: 'uptime_sec',
        isSet: false
    }]
}, {
    category: 'Device',
    fields: [{
        label: 'Bandwidth',
        field: 'bandwidth_device',
        isSet: false
    }, {
        label: 'Capacity',
        field: 'capacity_device',
        isSet: false
    }]
}, {
    category: 'Disk',
    fields: [{
        label: 'Soft Media Error Lower',
        field: 'soft_media_error_lower',
        isSet: false
    }, {
        label: 'Soft Media Error Upper',
        field: 'soft_media_error_upper',
        isSet: false
    }, {
        label: 'Power Cycle Error Lower',
        field: 'power_cycle_error_lower',
        isSet: false
    }, {
        label: 'Power Cycle Error Upper',
        field: 'power_cycle_error_upper',
        isSet: false
    }, {
        label: 'Power On Hour Lower',
        field: 'power_on_hour_lower',
        isSet: false
    }, {
        label: 'Power On Hour Upper',
        field: 'power_on_hour_upper',
        isSet: false
    }, {
        label: 'Unsafe Shutdowns Lower',
        field: 'unsafe_shutdowns_lower',
        isSet: false
    }, {
        label: 'Unsafe Shutdowns Upper',
        field: 'unsafe_shutdowns_upper',
        isSet: false
    }, {
        label: 'Temperature',
        field: 'temperature',
        isSet: false
    }, {
        label: 'Available Spare',
        field: 'available_spare',
        isSet: false
    }, {
        label: 'Available Spare Threshold',
        field: 'available_spare_threshold',
        isSet: false
    }, {
        label: 'Percentage Used',
        field: 'percentage used',
        isSet: false
    }, {
        label: 'Controller Busy Time Lower',
        field: 'controller_busy_time_lower',
        isSet: false
    }, {
        label: 'Controller Busy Time Upper',
        field: 'controller_busy_time_upper',
        isSet: false
    }, {
        label: 'Warning Temperature Time',
        field: 'warning_temperature_time',
        isSet: false
    }, {
        label: 'Critical Temperature Time',
        field: 'critical_temperature_time',
        isSet: false
    }]
}, {
    category: 'Host',
    fields: [{
        label: 'Host Read IOPS',
        field: 'read_iops_host',
        isSet: false
    }, {
        label: 'Host Read Bytes per Second',
        field: 'read_bytes_per_sec_host',
        isSet: false
    }, {
        label: 'Host Write IOPS',
        field: 'write_iops_host',
        isSet: false
    }, {
        label: 'Host Write Bytes per Second',
        field: 'write_bytes_per_sec_host',
        isSet: false
    }]
}, {
    category: 'Port',
    fields: [{
        label: 'Port Read IOPS',
        field: 'read_iops_port',
        isSet: false
    }, {
        label: 'Port Read Bytes per Second',
        field: 'read_bytes_per_sec_port',
        isSet: false
    }, {
        label: 'Port Write IOPS',
        field: 'write_iops_port',
        isSet: false
    }, {
        label: 'Port Write Bytes per Second',
        field: 'write_bytes_per_sec_port',
        isSet: false
    }]
}, {
    category: 'Array',
    fields: [{
        label: 'Array Capacity',
        field: 'capacity_array',
        isSet: false
    }, {
        label: 'Used Array',
        field: 'used_array',
        isSet: false
    }, {
        label: 'Array State',
        field: 'state_array',
        isSet: false
    }, {
        label: 'Array Status',
        field: 'array_status',
        isSet: false
    }, {
        label: 'Array Total Capacity',
        field: 'array_capacity_total',
        isSet: false
    }, {
        label: 'Array Capacity Used',
        field: 'array_capacity_used',
        isSet: false
    }]
}, {
    category: 'Volume',
    fields: [{
        label: 'Volume Capacity',
        field: 'capacity_volume',
        isSet: false
    }, {
        label: 'Volume Used',
        field: 'used_volume',
        isSet: false
    }, {
        label: 'Volume State',
        field: 'state_volume',
        isSet: false
    }, {
        label: 'Read Latency',
        field: 'read_latency',
        isSet: false
    }, {
        label: 'Write Latency',
        field: 'write_latency',
        isSet: false
    }, {
        label: 'Average Latency',
        field: 'average_latency',
        isSet: false
    }, {
        label: 'Reads Per Second',
        field: 'number_of_reads_per_sec',
        isSet: false
    }, {
        label: 'Writes Per Second',
        field: 'number_of_writes_per_sec'    ,
        isSet: false
    }, {
        label: 'IO Requests Per Second',
        field: 'number_of_io_reqs_per_sec',
        isSet: false
    }, {
        label: 'Read Bytes Per Second',
        field: 'number_of_read_bytes_per_sec',
        isSet: false
    }, {
        label: 'Write Bytes Per Second',
        field: 'number_of_write_bytes_per_sec',
        isSet: false
    }, {
        label: 'Average IO Size',
        field: 'average_io_size',
        isSet: false
    }, {
        label: 'Read IOPS',
        field: 'iops_read',
        isSet: false
    }, {
        label: 'Write IOPS',
        field: 'iops_write',
        isSet: false
    }, {
        label: 'IOPS',
        field: 'iops',
        isSet: false
    }]
}]

export function* fetchTelemetryProperties() {
    try {
        // const response = yield call([axios, axios.get], 'api/v1/telemetry/properties', {
        //     headers: {
        //       "x-access-token": localStorage.getItem("token"),
        //     },
        //   });
        // const result = response.data;
        // if(result) {
            // yield put(actionCreators.setTelemetryProperties(result.properties));
            yield put(actionCreators.setTelemetryProperties(data));
            // yield put(actionCreators.setTelemetryStatus(result.status));
            yield put(actionCreators.setTelemetryStatus(true));
        // }
    } catch (e) {
        yield put(actionCreators.setTelemetryStatus(false));
    }
}

export function* setTelemetryProperties(action) {
    try {
        yield put(actionCreators.startLoader("Starting Telemetry"));
        const response = yield call([axios, axios.post],
            'api/v1/telemetry/properties',
            action.payload, {
                headers: {
                "x-access-token": localStorage.getItem("token"),
                },
            }
        );
        const result = response.data;
        if(result) {
            yield put(actionCreators.setTelemetryProperties(result.properties));
            yield put(actionCreators.setTelemetryStatus(result.status));
        }
    } catch (e) {
        yield put(actionCreators.setTelemetryStatus(false));
    } finally {
        yield put(actionCreators.stopLoader());
    }
}

export function* startTelemetry() {
    try {
        const response = yield call([axios, axios.post], 'api/v1/telemetry', {}, {
            headers: {
              "x-access-token": localStorage.getItem("token"),
            },
          });
        const result = response.data;
        if(result) {
            yield put(actionCreators.setTelemetryStatus(true));
        }
    } catch (e) {
        yield put(actionCreators.setTelemetryStatus(false));
    }
}

export function* stopTelemetry() {
    try {
        const response = yield call([axios, axios.delete], 'api/v1/telemetry', {
            headers: {
              "x-access-token": localStorage.getItem("token"),
            },
          });
        const result = response.data;
        if(result) {
            yield put(actionCreators.setTelemetryStatus(false));
        }
    } catch (e) {
        yield put(actionCreators.setTelemetryStatus(false));
    }
}

export function* telemetryWatcher() {
    yield takeEvery(actionTypes.SAGA_FETCH_TELEMETRY_PROPERTIES, fetchTelemetryProperties);
    yield takeEvery(actionTypes.SAGA_START_TELEMETRY, startTelemetry);
    yield takeEvery(actionTypes.SAGA_STOP_TELEMETRY, stopTelemetry);
    yield takeEvery(actionTypes.SAGA_SAVE_TELEMETRY_CONFIG, setTelemetryProperties);
}