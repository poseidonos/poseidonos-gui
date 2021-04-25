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


DESCRIPTION: <Contains Generator Functions for Performance component> *
@NAME : performanceSaga.js
@AUTHORS: Aswin K K 
@Version : 1.0 *
@REVISION HISTORY
[27/08/2019] [Aswin K K] : Prototyping..........////////////////////
*/

import axios from "axios";
import { call, takeEvery, put, cancelled } from "redux-saga/effects";
import * as actionTypes from "../store/actions/actionTypes";
import * as actionCreators from "../store/actions/exportActionCreators";

function extractValues(data) {
    if (data.length === 0) {
        data.push({
            value: 0,
            bw: 0,
            iops: 0,
            latency: 0,
            time: (new Date()).getTime() * 1e6
        });
        data.push({
            value: 0,
            bw: 0,
            iops: 0,
            latency: 0,
            time: (new Date(Date.now() - 10000)) * 1e6
        });
    }
    return data;
}

// function* fetchDiskUsed(action) {
//     try {
//         const response = yield call([axios, axios.get], `/api/v1.0/disk_used_percent/${action.payload.time}/array`);

//         const result = response.data;
//         if (result && !result.message) {
//             const values = [];
//             result.forEach((r) => {
//                 if (r.used_percent !== null) {
//                     values.push({
//                         value: r.used_percent,
//                         time: r.time
//                     })
//                 }
//             });
//             yield put(actionCreators.fetchDiskUsed(result));
//         } else {
//             yield put(actionCreators.fetchDiskUsed([]));
//         }
//     }
//     catch (error) {
//         yield put(actionCreators.fetchDiskUsed([]));
//     }
//     finally {
//         if (yield cancelled()) {
//             yield put(actionCreators.fetchDiskUsed([]));
//         }
//     }
// }

// function* fetchDiskWrite(action) {
//     try {
//         const response = yield call([axios, axios.get], `/api/v1.0/disk_write_mbps/${action.payload.time}/array`);

//         const result = response.data;
//         if (result && !result.message) {
//             const values = [];
//             result.forEach((r) => {
//                 if (r.write_megabytes_per_second !== null) {
//                     values.push({
//                         value: r.write_megabytes_per_second,
//                         time: r.time
//                     })
//                 }
//             });
//             yield put(actionCreators.fetchDiskWrite(values));
//         } else {
//             yield put(actionCreators.fetchDiskWrite([]));
//         }
//     }
//     catch (error) {
//         yield put(actionCreators.fetchDiskWrite([]));
//     }
//     finally {
//         if (yield cancelled()) {
//             yield put(actionCreators.fetchDiskWrite([]));
//         }
//     }
// }

// export function* fetchInputPowerVariation(action) {
//     try {
//       const response = yield call(
//         [axios, axios.get],
//         `/api/v1.0/get_input_power_variation/${action.payload.time}`
//       );
//       const result = response.data;
//       if (result && !result.message) {
//         yield put(actionCreators.fetchInputPowerVariation(extractValues(result.res)));
//       } else {
//         yield put(actionCreators.fetchInputPowerVariation([]));
//       }
//     } catch (error) {
//       yield put(actionCreators.fetchInputPowerVariation([]));
//     } finally {
//       if (yield cancelled()) {
//         yield put(actionCreators.fetchInputPowerVariation([]));
//       }
//     }
//   }

export function* fetchCpuUsage(action) {
    // console.log("fetchCpuUsage")
    try {
        const response = yield call(
            [axios, axios.get],
            `/api/v1.0/usage_user/${action.payload.time}`
        );
        const result = response.data;

        /* istanbul ignore else */
        if (result && !result.message) {
            const values = [];
            result.forEach(r => {
                /* istanbul ignore else */
                if (r.cpuUsagePercent !== null) {
                    values.push({
                        value: r.cpuUsagePercent,
                        time: r.time
                    });
                }
            });
            yield put(actionCreators.fetchCpuUsage(values));
        } else {
            yield put(actionCreators.fetchCpuUsage([]));
        }
    } catch (error) {
        yield put(actionCreators.fetchCpuUsage([]));
    } finally {
        /* istanbul ignore if */
        if (yield cancelled()) {
            yield put(actionCreators.fetchCpuUsage([]));
        }
    }
}

export function* fetchReadBandwidth(action) {
    try {
        let endpoint = "/api/v1/readbw/arrays";
        if(action.payload.volume === null) {
            endpoint += `?arrayids=${action.payload.array}&time=${action.payload.time}`;
        } else {
            endpoint += `/volumes?arrayids=${action.payload.array}&volumeids=${action.payload.volume}&time=${action.payload.time}`
        }
        const response = yield call(
            [axios, axios.get],
            endpoint
        );

        const result = response.data;
        /* istanbul ignore else */
        if (result && !result.message) {
            if (action.payload.level === "array") {
                yield put(actionCreators.fetchReadBandwidth(extractValues(result.res)));
            } else {
                yield put(actionCreators.fetchVolReadBandwidth({ values: extractValues(result.res), ...action.payload }));
            }
        } else if (action.payload.level === "array") {
            yield put(actionCreators.fetchReadBandwidth([]));
        } else {
            yield put(actionCreators.fetchVolReadBandwidth({ values: [], ...action.payload }));
        }
    }
    catch (error) {
        if (action.payload.level === "array") {
            yield put(actionCreators.fetchReadBandwidth([]));
        } else {
            yield put(actionCreators.fetchVolReadBandwidth({ values: [], ...action.payload }));
        }
    }
    finally {
         /* istanbul ignore if */
        if (yield cancelled()) {
            if (action.payload.level === "array") {
                yield put(actionCreators.fetchReadBandwidth([]));
            } else {
                yield put(actionCreators.fetchVolReadBandwidth({ values: [], ...action.payload }));
            }
        }
    }
}

function* fetchWriteBandwidth(action) {
    try {

        let endpoint = "/api/v1/writebw/arrays";
        if(action.payload.volume === null) {
            endpoint += `?arrayids=${action.payload.array}&time=${action.payload.time}`;
        } else {
            endpoint += `/volumes?arrayids=${action.payload.array}&volumeids=${action.payload.volume}&time=${action.payload.time}`
        }
        const response = yield call([axios, axios.get], endpoint);

        const result = response.data;
        /* istanbul ignore else */
        if (result && !result.message) {
            if (action.payload.level === "array") {
                yield put(actionCreators.fetchWriteBandwidth(extractValues(result.res)));
            } else {
                yield put(actionCreators.fetchVolWriteBandwidth({ values: extractValues(result.res), ...action.payload }));
            }
        }
        else if (action.payload.level === "array") {
            yield put(actionCreators.fetchWriteBandwidth([]));
        } else {
            yield put(actionCreators.fetchVolWriteBandwidth({ values: [], ...action.payload }))
        }
    }
    catch (error) {
        if (action.payload.level === "array") {
            yield put(actionCreators.fetchWriteBandwidth([]));
        } else {
            yield put(actionCreators.fetchVolWriteBandwidth({ values: [], ...action.payload }))
        }
    }
    finally {
         /* istanbul ignore if */
        if (yield cancelled()) {
            if (action.payload.level === "array") {
                yield put(actionCreators.fetchWriteBandwidth([]));
            } else {
                yield put(actionCreators.fetchVolWriteBandwidth({ values: [], ...action.payload }))
            }
        }
    }
}

export function* fetchReadIops(action) {
    try {
        let endpoint = "/api/v1/readiops/arrays";
        if(action.payload.volume === null) {
            endpoint += `?arrayids=${action.payload.array}&time=${action.payload.time}`;
        } else {
            endpoint += `/volumes?arrayids=${action.payload.array}&volumeids=${action.payload.volume}&time=${action.payload.time}`
        }
        const response = yield call(
            [axios, axios.get],
            endpoint
        );

        const result = response.data;
        /* istanbul ignore else */
        if (result && !result.message) {
            if (action.payload.level === "array") {
                yield put(actionCreators.fetchReadIops(extractValues(result.res)));
            } else {
                yield put(actionCreators.fetchVolReadIops({ values: extractValues(result.res), ...action.payload }));
            }
        } else if (action.payload.level === "array") {
            yield put(actionCreators.fetchReadIops([]));
        } else {
            yield put(actionCreators.fetchVolReadIops({ values: [], ...action.payload }))
        }
    }
    catch (error) {
        if (action.payload.level === "array") {
            yield put(actionCreators.fetchReadIops([]));
        } else {
            yield put(actionCreators.fetchVolReadIops({ values: [], ...action.payload }))
        }
    }
    finally {
         /* istanbul ignore if */
        if (yield cancelled()) {
            if (action.payload.level === "array") {
                yield put(actionCreators.fetchReadIops([]));
            } else {
                yield put(actionCreators.fetchVolReadIops({ values: [], ...action.payload }))
            }
        }
    }
}

export function* fetchWriteIops(action) {
    try {
        let endpoint = "/api/v1/writeiops/arrays";
        if(action.payload.volume === null) {
            endpoint += `?arrayids=${action.payload.array}&time=${action.payload.time}`;
        } else {
            endpoint += `/volumes?arrayids=${action.payload.array}&volumeids=${action.payload.volume}&time=${action.payload.time}`
        }
        const response = yield call(
            [axios, axios.get],
            endpoint
        );

        const result = response.data;
        /* istanbul ignore else */
        if (result && !result.message) {
            if (action.payload.level === "array") {
                yield put(actionCreators.fetchWriteIops(extractValues(result.res)));
            } else {
                yield put(actionCreators.fetchVolWriteIops({ values: extractValues(result.res), ...action.payload }));
            }
        } else if (action.payload.level === "array") {
            yield put(actionCreators.fetchWriteIops([]));
        } else {
            yield put(actionCreators.fetchVolWriteIops({ values: [], ...action.payload }))
        }
    }
    catch (error) {
        if (action.payload.level === "array") {
            yield put(actionCreators.fetchWriteIops([]));
        } else {
            yield put(actionCreators.fetchVolWriteIops({ values: [], ...action.payload }))
        }
    }
    finally {
         /* istanbul ignore if */
        if (yield cancelled()) {
            if (action.payload.level === "array") {
                yield put(actionCreators.fetchWriteIops([]));
            } else {
                yield put(actionCreators.fetchVolWriteIops({ values: [], ...action.payload }))
            }
        }
    }
}


export function* fetchLatency(action) {
    try {
        let endpoint = "/api/v1/latency/arrays";
        if(action.payload.volume === null) {
            endpoint += `?arrayids=${action.payload.array}&time=${action.payload.time}`;
        } else {
            endpoint += `/volumes?arrayids=${action.payload.array}&volumeids=${action.payload.volume}&time=${action.payload.time}`
        }
        const response = yield call(
            [axios, axios.get],
            endpoint
        );

        const result = response.data;
        /* istanbul ignore else */
        if (result && !result.message) {
            if (action.payload.level === "array") {
                yield put(actionCreators.fetchLatency(extractValues(result.res)));
            } else {
                yield put(actionCreators.fetchVolLatency({ values: extractValues(result.res), ...action.payload }));
            }
        }
        else if (action.payload.level === "array") {
            yield put(actionCreators.fetchLatency([]));
        } else {
            yield put(actionCreators.fetchVolLatency({ values: [], ...action.payload }))
        }
    }
    catch (error) {
        if (action.payload.level === "array") {
            yield put(actionCreators.fetchLatency([]));
        } else {
            yield put(actionCreators.fetchVolLatency({ values: [], ...action.payload }))
        }
    }
    finally {
         /* istanbul ignore if */
        if (yield cancelled()) {
            if (action.payload.level === "array") {
                yield put(actionCreators.fetchLatency([]));
            } else {
                yield put(actionCreators.fetchVolLatency({ values: [], ...action.payload }))
            }
        }
    }
}


export default function* performanceWatcher() {
    // yield takeEvery(actionTypes.SAGA_FETCH_DISK_USED, fetchDiskUsed);
    // yield takeEvery(actionTypes.SAGA_FETCH_DISK_WRITE, fetchDiskWrite);
    yield takeEvery(actionTypes.SAGA_FETCH_CPU_USAGE, fetchCpuUsage);
    yield takeEvery(actionTypes.SAGA_FETCH_READ_BANDWIDTH, fetchReadBandwidth);
    yield takeEvery(actionTypes.SAGA_FETCH_WRITE_BANDWIDTH, fetchWriteBandwidth);
    yield takeEvery(actionTypes.SAGA_FETCH_READ_IOPS, fetchReadIops);
    yield takeEvery(actionTypes.SAGA_FETCH_WRITE_IOPS, fetchWriteIops);
    yield takeEvery(actionTypes.SAGA_FETCH_LATENCY, fetchLatency);
    //   yield takeEvery(actionTypes.SAGA_FETCH_INPUT_POWER_VARIATION, fetchInputPowerVariation);
}
