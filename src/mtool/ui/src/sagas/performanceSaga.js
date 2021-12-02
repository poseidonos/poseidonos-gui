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
import { call, takeEvery, put, cancelled, select } from "redux-saga/effects";
import * as actionTypes from "../store/actions/actionTypes";
import * as actionCreators from "../store/actions/exportActionCreators";
import { arrayMap } from "../store/reducers/storageReducer";

function extractValues(data) {
    if (data.length === 0) {
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

function getTimeStamp(period) {
    switch(period) {
	    case "1m":
	          return {
			  startTime: (new Date(Date.now() - 60000)) * 1e6,
			  endTime: Date.now() * 1e6
		  }
	    case "5m":
	          return {
                          startTime: (new Date(Date.now() - 300000)) * 1e6,
                          endTime: Date.now() * 1e6
                  }
	    case "15m":
                  return {
                          startTime: (new Date(Date.now() - 900000)) * 1e6,
                          endTime: Date.now() * 1e6
                  }
	    case "1h":
                  return {
                          startTime: (new Date(Date.now() - 3600000)) * 1e6,
                          endTime: Date.now() * 1e6
                  }
	    case "6h":
                  return {
                          startTime: (new Date(Date.now() - 1800000)) * 1e6,
                          endTime: Date.now() * 1e6
                  }
	    case "12h":
                  return {
                          startTime: (new Date(Date.now() - 3600000)) * 1e6,
                          endTime: Date.now() * 1e6
                  }
	    case "1d":
                  return {
                          startTime: (new Date(Date.now() - 7200000)) * 1e6,
                          endTime: Date.now() * 1e6
                  }
	    case "7d":
                  return {
                          startTime: (new Date(Date.now() - 50400000)) * 1e6,
                          endTime: Date.now() * 1e6
                  }
	    case "30d":
                  return {
                          startTime: (new Date(Date.now() - 216000000)) * 1e6,
                          endTime: Date.now() * 1e6
                  }
	    default:
	          return {
                          startTime: (new Date(Date.now() - 300000)) * 1e6,
                          endTime: Date.now() * 1e6
                  }
    }
}

function getArrayId(arrayName, arrMap) {
  let arrayId = -1;
  if(arrMap && arrMap[arrayName]) {
    arrayId = arrMap[arrayName].index;
  }
  return arrayId;
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
//         yield put(actionCreators.fetchInputPowerVariation(extractValues(result.res[0])));
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
    try {
        const response = yield call(
            [axios, axios.get],
            `/api/v1.0/usage_user/${action.payload.time}`
        );
        const result = response.data;

        /* istanbul ignore else */
        if (result && !result.message && result.length) {
            const values = [];
            result[0].forEach(r => {
                /* istanbul ignore else */
                if (r.cpuUsagePercent !== null) {
                    values.push({
                        value: r.cpuUsagePercent,
                        time: r.time
                    });
                }
            });
            yield put(actionCreators.fetchCpuUsage(values, result[1][0]));
        } else {
            yield put(actionCreators.fetchCpuUsage([], {}));
        }
    } catch (error) {
        yield put(actionCreators.fetchCpuUsage([], {}));
    } finally {
        /* istanbul ignore if */
        if (yield cancelled()) {
            yield put(actionCreators.fetchCpuUsage([], {}));
        }
    }
}

export function* fetchReadBandwidth(action) {
    try {
        let endpoint = "/api/v1/readbw/arrays";
        const arrayId = getArrayId(action.payload.array, yield select(arrayMap));
        if(action.payload.volume === null) {
            endpoint += `?arrayids=${arrayId}&time=${action.payload.time}`;
        } else {
            endpoint += `/volumes?arrayids=${arrayId}&volumeids=${action.payload.volume}&time=${action.payload.time}`
        }
        const response = yield call(
            [axios, axios.get],
            endpoint
        );
        const result = response.data;
        /* istanbul ignore else */
        if (result && !result.message) {
            if (action.payload.level === "array") {
                yield put(actionCreators.fetchReadBandwidth(extractValues(result.res[0]), result.res[1][0]));
            } else {
		let timestamp = getTimeStamp(action.payload.time);
		const volMap = {};
		for(let i = 0; i < result.res.length; i += 1) {
		    const vol = result.res[i];
                    if(vol.length && vol[0].volumeid !== undefined) {
		        volMap[vol[0].volumeid] = true;
		        yield put(actionCreators.fetchVolReadBandwidth({ values: extractValues(vol[0].data[0]), ...vol[0].data[1][0], 
			    level: vol[0].volumeid,
			    ...action.payload.vols[vol[0].volumeid]
		        }));
			timestamp = vol[0].data[1][0];
		    }
		}
                const volIds = `${action.payload.volume}`.split(",");
                for(let i = 0; i < volIds.length; i += 1 ) {
                        const volid = volIds[i];
			if(!volMap[volid]) {
				yield put(actionCreators.fetchVolReadBandwidth({ values: [{bw: 0, time: timestamp.startTime}], 
                                level: volid,
				...timestamp,
                                ...action.payload.vols[volid]
                                }));
			}
		}
	    }
        } else if (action.payload.level === "array") {
            yield put(actionCreators.fetchReadBandwidth([], {}));
        } else {
            yield put(actionCreators.fetchVolReadBandwidth({ values: [], ...action.payload }));
        }
    }
    catch (error) {
        if (action.payload.level === "array") {
            yield put(actionCreators.fetchReadBandwidth([], {}));
        } else {
            yield put(actionCreators.fetchVolReadBandwidth({ values: [], ...action.payload }));
        }
    }
    finally {
         /* istanbul ignore if */
        if (yield cancelled()) {
            if (action.payload.level === "array") {
                yield put(actionCreators.fetchReadBandwidth([], {}));
            } else {
                yield put(actionCreators.fetchVolReadBandwidth({ values: [], ...action.payload }));
            }
        }
    }
}

function* fetchWriteBandwidth(action) {
    try {
        let endpoint = "/api/v1/writebw/arrays";
        const arrayId = getArrayId(action.payload.array, yield select(arrayMap));
        if(action.payload.volume === null) {
            endpoint += `?arrayids=${arrayId}&time=${action.payload.time}`;
        } else {
            endpoint += `/volumes?arrayids=${arrayId}&volumeids=${action.payload.volume}&time=${action.payload.time}`
        }
        const response = yield call([axios, axios.get], endpoint);

        const result = response.data;
        /* istanbul ignore else */
        if (result && !result.message) {
            if (action.payload.level === "array") {
                yield put(actionCreators.fetchWriteBandwidth(extractValues(result.res[0]), result.res[1][0]));
            } else {
                let timestamp = getTimeStamp(action.payload.time);
		const volMap = {};
                for(let i = 0; i < result.res.length; i += 1) {
                    const vol = result.res[i];
                    if(vol.length && vol[0].volumeid !== undefined) {
                        volMap[vol[0].volumeid] = true;
                        yield put(actionCreators.fetchVolWriteBandwidth({ values: extractValues(vol[0].data[0]), ...vol[0].data[1][0],
                            level: vol[0].volumeid,
                            ...action.payload.vols[vol[0].volumeid]
                        }));
			timestamp = vol[0].data[1][0];
		    }
		}
                const volIds = `${action.payload.volume}`.split(",");
                for(let i = 0; i < volIds.length; i += 1) {
                        const volid = volIds[i];
                        if(!volMap[volid]) {
                                yield put(actionCreators.fetchVolWriteBandwidth({ values: [{bw: 0, time: timestamp.startTime}],
                                level: volid,
				...timestamp,
                                ...action.payload.vols[volid]
                                }));
                        }
                }
            }
        }
        else if (action.payload.level === "array") {
            yield put(actionCreators.fetchWriteBandwidth([], {}));
        } else {
            yield put(actionCreators.fetchVolWriteBandwidth({ values: [], ...action.payload }))
        }
    }
    catch (error) {
        if (action.payload.level === "array") {
            yield put(actionCreators.fetchWriteBandwidth([], {}));
        } else {
            yield put(actionCreators.fetchVolWriteBandwidth({ values: [], ...action.payload }))
        }
    }
    finally {
         /* istanbul ignore if */
        if (yield cancelled()) {
            if (action.payload.level === "array") {
                yield put(actionCreators.fetchWriteBandwidth([], {}));
            } else {
                yield put(actionCreators.fetchVolWriteBandwidth({ values: [], ...action.payload }))
            }
        }
    }
}

export function* fetchReadIops(action) {
    try {
        let endpoint = "/api/v1/readiops/arrays";
        const arrayId = getArrayId(action.payload.array, yield select(arrayMap));
        if(action.payload.volume === null) {
            endpoint += `?arrayids=${arrayId}&time=${action.payload.time}`;
        } else {
            endpoint += `/volumes?arrayids=${arrayId}&volumeids=${action.payload.volume}&time=${action.payload.time}`
        }
        const response = yield call(
            [axios, axios.get],
            endpoint
        );

        const result = response.data;
        /* istanbul ignore else */
        if (result && !result.message) {
            if (action.payload.level === "array") {
                yield put(actionCreators.fetchReadIops(extractValues(result.res[0]), result.res[1][0]));
            } else {
                let timestamp = getTimeStamp(action.payload.time);
                const volMap = {};
                for(let i = 0; i < result.res.length; i += 1) {
                    const vol = result.res[i];
                    if(vol.length && vol[0].volumeid !== undefined) {
                        volMap[vol[0].volumeid] = true;
                        yield put(actionCreators.fetchVolReadIops({ values: extractValues(vol[0].data[0]), ...vol[0].data[1][0],
                            level: vol[0].volumeid,
                            ...action.payload.vols[vol[0].volumeid]
                        }));
			timestamp = vol[0].data[1][0];
		    }
		}
                const volIds = `${action.payload.volume}`.split(",");
                for(let i = 0; i < volIds.length; i += 1) {
                        const volid = volIds[i];
                        if(!volMap[volid]) {
                                yield put(actionCreators.fetchVolReadIops({ values: [{iops: 0, time: timestamp.startTime}],
                                level: volid,
				...timestamp,
                                ...action.payload.vols[volid]
                                }));
                        }
                }
            }
        } else if (action.payload.level === "array") {
            yield put(actionCreators.fetchReadIops([], {}));
        } else {
            yield put(actionCreators.fetchVolReadIops({ values: [], ...action.payload }))
        }
    }
    catch (error) {
        if (action.payload.level === "array") {
            yield put(actionCreators.fetchReadIops([], {}));
        } else {
            yield put(actionCreators.fetchVolReadIops({ values: [], ...action.payload }))
        }
    }
    finally {
         /* istanbul ignore if */
        if (yield cancelled()) {
            if (action.payload.level === "array") {
                yield put(actionCreators.fetchReadIops([], {}));
            } else {
                yield put(actionCreators.fetchVolReadIops({ values: [], ...action.payload }))
            }
        }
    }
}

export function* fetchWriteIops(action) {
    try {
        let endpoint = "/api/v1/writeiops/arrays";
        const arrayId = getArrayId(action.payload.array, yield select(arrayMap));
        if(action.payload.volume === null) {
            endpoint += `?arrayids=${arrayId}&time=${action.payload.time}`;
        } else {
            endpoint += `/volumes?arrayids=${arrayId}&volumeids=${action.payload.volume}&time=${action.payload.time}`
        }
        const response = yield call(
            [axios, axios.get],
            endpoint
        );

        const result = response.data;
        /* istanbul ignore else */
        if (result && !result.message) {
            if (action.payload.level === "array") {
                yield put(actionCreators.fetchWriteIops(extractValues(result.res[0]), result.res[1][0]));
            } else {
                let timestamp = getTimeStamp(action.payload.time);
		const volMap = {};
                for(let i = 0; i < result.res.length; i += 1) {
                    const vol = result.res[i];
                    if(vol.length && vol[0].volumeid !== undefined) {
		        volMap[vol[0].volumeid] = true;
                        yield put(actionCreators.fetchVolWriteIops({ values: extractValues(vol[0].data[0]), ...vol[0].data[1][0],
                            level: vol[0].volumeid,
                            ...action.payload.vols[vol[0].volumeid]
                        }));
			timestamp = vol[0].data[1][0];
		    }
                }
                const volIds = `${action.payload.volume}`.split(",");
                for(let i = 0; i < volIds.length; i += 1) {
                        const volid = volIds[i];
                        if(!volMap[volid]) {
                                yield put(actionCreators.fetchVolWriteIops({ values: [{iops: 0, time: timestamp.startTime}],
                                level: volid,
				...timestamp,
                                ...action.payload.vols[volid]
                                }));
                        }
                }
            }
        } else if (action.payload.level === "array") {
            yield put(actionCreators.fetchWriteIops([], {}));
        } else {
            yield put(actionCreators.fetchVolWriteIops({ values: [], ...action.payload }))
        }
    }
    catch (error) {
        if (action.payload.level === "array") {
            yield put(actionCreators.fetchWriteIops([], {}));
        } else {
            yield put(actionCreators.fetchVolWriteIops({ values: [], ...action.payload }))
        }
    }
    finally {
         /* istanbul ignore if */
        if (yield cancelled()) {
            if (action.payload.level === "array") {
                yield put(actionCreators.fetchWriteIops([], {}));
            } else {
                yield put(actionCreators.fetchVolWriteIops({ values: [], ...action.payload }))
            }
        }
    }
}

export function* fetchWriteLatency(action) {
    try {
        let endpoint = "/api/v1/writelatency/arrays";
        const arrayId = getArrayId(action.payload.array, yield select(arrayMap));
        if(action.payload.volume === null) {
            endpoint += `?arrayids=${arrayId}&time=${action.payload.time}`;
        } else {
            endpoint += `/volumes?arrayids=${arrayId}&volumeids=${action.payload.volume}&time=${action.payload.time}`
        }
        const response = yield call(
            [axios, axios.get],
            endpoint
        );

        const result = response.data;
        /* istanbul ignore else */
        if (result && !result.message) {
            if (action.payload.level === "array") {
                yield put(actionCreators.fetchWriteLatency(extractValues(result.res[0]), result.res[1][0]));
            } else {
                let timestamp = getTimeStamp(action.payload.time);
		const volMap = {};
                for(let i = 0; i < result.res.length; i += 1) {
                    const vol = result.res[i];
		    if(vol.length && vol[0].volumeid !== undefined) {
		       volMap[vol[0].volumeid] = true;
                       yield put(actionCreators.fetchVolWriteLatency({ values: extractValues(vol[0].data[0]), ...vol[0].data[1][0],
                          level: vol[0].volumeid,
                          ...action.payload.vols[vol[0].volumeid]
                       }));
		       timestamp = vol[0].data[1][0];
		    }
                }
                const volIds = `${action.payload.volume}`.split(",");
                for(let i = 0; i < volIds.length; i += 1) {
                        const volid = volIds[i];
                        if(!volMap[volid]) {
                                yield put(actionCreators.fetchVolWriteLatency({ values: [{latency: 0, time: timestamp.startTime}],
                                level: volid,
				...timestamp,
                                ...action.payload.vols[volid]
                                }));
                        }
                }
            }
        }
        else if (action.payload.level === "array") {
            yield put(actionCreators.fetchWriteLatency([], {}));
        } else {
            yield put(actionCreators.fetchVolWriteLatency({ values: [], ...action.payload }))
        }
    }
    catch (error) {
        if (action.payload.level === "array") {
            yield put(actionCreators.fetchWriteLatency([], {}));
        } else {
            yield put(actionCreators.fetchVolWriteLatency({ values: [], ...action.payload }))
        }
    }
    finally {
         /* istanbul ignore if */
        if (yield cancelled()) {
            if (action.payload.level === "array") {
                yield put(actionCreators.fetchWriteLatency([], {}));
            } else {
                yield put(actionCreators.fetchVolWriteLatency({ values: [], ...action.payload }))
            }
        }
    }
}

export function* fetchReadLatency(action) {
    try {
        let endpoint = "/api/v1/readlatency/arrays";
        const arrayId = getArrayId(action.payload.array, yield select(arrayMap));
        if(action.payload.volume === null) {
            endpoint += `?arrayids=${arrayId}&time=${action.payload.time}`;
        } else {
            endpoint += `/volumes?arrayids=${arrayId}&volumeids=${action.payload.volume}&time=${action.payload.time}`
        }
        const response = yield call(
            [axios, axios.get],
            endpoint
        );

        const result = response.data;
        /* istanbul ignore else */
        if (result && !result.message) {
            if (action.payload.level === "array") {
                yield put(actionCreators.fetchReadLatency(extractValues(result.res[0]), result.res[1][0]));
            } else {
                let timestamp = getTimeStamp(action.payload.time);
		const volMap = {};
                for(let i = 0; i < result.res.length; i += 1) {
                    const vol = result.res[i];
		    if(vol.length && vol[0].volumeid !== undefined) {
		    volMap[vol[0].volumeid] = true;
                    yield put(actionCreators.fetchVolReadLatency({ values: extractValues(vol[0].data[0]), ...vol[0].data[1][0],
                        level: vol[0].volumeid,
                        ...action.payload.vols[vol[0].volumeid]
                    }));
		    timestamp = vol[0].data[1][0];
		    }
                }
		const volIds = `${action.payload.volume}`.split(",");
                for(let i = 0; i < volIds.length; i += 1) {
			const volid = volIds[i];
                        if(!volMap[volid]) {
                                yield put(actionCreators.fetchVolReadLatency({ values: [{latency: 0, time: timestamp.startTime}],
                                level: volid,
				...timestamp,
                                ...action.payload.vols[volid]
                                }));
                        }
                }
            }
        }
        else if (action.payload.level === "array") {
            yield put(actionCreators.fetchReadLatency([], {}));
        } else {
            yield put(actionCreators.fetchVolReadLatency({ values: [], ...action.payload }))
        }
    }
    catch (error) {
        if (action.payload.level === "array") {
            yield put(actionCreators.fetchReadLatency([], {}));
        } else {
            yield put(actionCreators.fetchVolReadLatency({ values: [], ...action.payload }))
        }
    }
    finally {
         /* istanbul ignore if */
        if (yield cancelled()) {
            if (action.payload.level === "array") {
                yield put(actionCreators.fetchReadLatency([], {}));
            } else {
                yield put(actionCreators.fetchVolReadLatency({ values: [], ...action.payload }))
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
    yield takeEvery(actionTypes.SAGA_FETCH_READ_LATENCY, fetchReadLatency);
    yield takeEvery(actionTypes.SAGA_FETCH_WRITE_LATENCY, fetchWriteLatency);
    //   yield takeEvery(actionTypes.SAGA_FETCH_INPUT_POWER_VARIATION, fetchInputPowerVariation);
}
