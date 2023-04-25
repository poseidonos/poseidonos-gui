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
import { call, takeEvery, put, select } from "redux-saga/effects";
import * as actionTypes from "../store/actions/actionTypes";
import * as actionCreators from "../store/actions/exportActionCreators";
import { arrayname } from "../store/reducers/storageReducer";
import { fetchSubsystems } from "./subsystemSaga";

const MINIOPS = "miniops"
const MINBW = "minbw"

function* fetchVolumeDetails(action) {
  try {
    const response = yield call([axios, axios.get], action.payload.url, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "x-access-token": localStorage.getItem("token"),
      },
    });
    /* istanbul ignore else */
    if (response.status === 200) {
      if ((yield select(arrayname)) === action.payload.array) {
        yield put(actionCreators.addVolumeDetails(response.data));
      }
    }
  } catch (e) {
    // console.log(e)
  }
}



function* fetchVolumes(action) {
  try {
    yield put(actionCreators.clearVolumes());
    yield put(actionCreators.startFetchingVolumes());
    const response = yield call(
      [axios, axios.get],
      `/redfish/v1/StorageServices/${action.payload.array}/Volumes`,
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "x-access-token": localStorage.getItem("token"),
        },
      }
    );
    /* istanbul ignore else */
    if (response.status === 200) {
      for (let i = response.data.Members.length - 1; i >= 0; i -= 1) {
        if ((yield select(arrayname)) === action.payload.array) {
          yield fetchVolumeDetails({
            payload: {
              url: response.data.Members[i]["@odata.id"],
              array: action.payload.array
            }
          });
        } else {
          break;
        }
      }
    } else {
      yield put(
        actionCreators.fetchStorageVolumes({ volumes: [], totalVolSize: 0 })
      );
    }
  } catch (e) {
    yield put(
      actionCreators.fetchStorageVolumes({ volumes: [], totalVolSize: 0 })
    );
  } finally {
    if (action.payload.callback) {
      action.payload.callback();
    }
    yield put(actionCreators.stopFetchingVolumes())
  }
}

function* fetchArray(action) {
  try {
    if (!action || !action.payload || !action.payload.noLoad) {
      yield put(actionCreators.startStorageLoader("Fetching Arrays"));
    }
    const response = yield call(
      [axios, axios.get],
      `/api/v1/get_arrays/?ts=${Date.now()}`,
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "x-access-token": localStorage.getItem("token"),
        },
      }
    );
    if (response.status === 200 && response.data) {
      yield put(actionCreators.fetchArray(response.data));
    } else if (response.status === 401) {
      action.payload.push("/login");
    } else {
      yield put(actionCreators.setNoArray());
    }
  } catch (e) {
    yield put(actionCreators.setNoArray());
  } finally {
    if (!action || !action.payload || !action.payload.noLoad) {
      yield select(arrayname);
      yield put(actionCreators.stopStorageLoader());
      yield fetchVolumes({ payload: { array: yield select(arrayname) } });
    }
  }
}

function* fetchArrayInfo(action) {
  try {
    yield put(actionCreators.setArrayInfoFetching(true));
    const response = yield call(
      [axios, axios.get],
      `/api/v1/array/${action.payload}/info?ts=${Date.now()}`,
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "x-access-token": localStorage.getItem("token"),
        },
      }
    );
    if (response.status === 200 && response.data) {
      yield put(actionCreators.fetchArrayDetails(response.data.result.data));
    } else if (response.status === 401) {
      action.payload.push("/login");
    }
  } catch (e) {
    // console.log(e);
  } finally {
    yield put(actionCreators.setArrayInfoFetching(false));
  }

}


function* fetchConfig() {
  try {
    const response = yield call(
      [axios, axios.get],
      `/api/v1/get_array_config/`,
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "x-access-token": localStorage.getItem("token"),
        },
      }
    );
    if (response.status === 200 && response.data) {
      yield put(actionCreators.fetchConfig(response.data));
    }
  } catch (e) {
    yield put(actionCreators.fetchConfig([]));
  }
}

function* fetchDevices(action) {
  const defaultResponse = {
    devices: [],
    metadevices: [],
  };
  let fetchDeviceSuccess = false;
  const alertDetails = {
    errorMsg: "Unable to get devices!",
    alertType: "alert",
    alertTitle: "Fetch Devices",
  };
  const isFetchingFirst = !action || !action.payload || !action.payload.noLoad;
  try {
    yield put(actionCreators.setDeviceFetching(true));
    if (isFetchingFirst) {
      yield put(actionCreators.startStorageLoader("Fetching Devices"));
    }
    const response = yield call([axios, axios.get], "/api/v1.0/get_devices/", {
      headers: {
        "x-access-token": localStorage.getItem("token"),
      },
    });
    const result = response.data;
    if (
      response.status === 200 &&
      response.data.result &&
      response.data.result.status.code !== 0
    ) {
      if (isFetchingFirst) {
        yield put(
          actionCreators.showStorageAlert({
            alertType: "alert",
            alertTitle: "Fetch Devices",
            errorMsg: "Unable to get devices!",
            errorCode: `Description: ${response.data.result && response.data.result.status
              ? `${response.data.result.status.description}`
              : ""
              }`,
          })
        );
      }
    } else if (result && typeof result !== "string" && result.return !== -1) {
      fetchDeviceSuccess = true;
      yield put(actionCreators.fetchDevices(result));
    } else {
      if (isFetchingFirst) {
        yield put(actionCreators.showStorageAlert({
          ...alertDetails,
          errorCode: `Description: ${response.data && response.data.result && response.data.result.status
            ? `${response.data.result.status.description}`
            : "Agent Communication Error"
            }`
        }));
      }
      yield put(actionCreators.fetchDevices(defaultResponse));
    }
  } catch (error) {
    if (isFetchingFirst) {
      yield put(actionCreators.showStorageAlert({
        ...alertDetails,
        errorCode: `Agent Communication Error - ${error.message}`
      }));
    }
    yield put(actionCreators.fetchDevices(defaultResponse));
  } finally {
    yield put(actionCreators.setDeviceFetching(false));
    if (!fetchDeviceSuccess) {
      yield put(actionCreators.stopStorageLoader());
    } else if (!action || !action.payload || !action.payload.noLoad) {
      yield put(actionCreators.stopStorageLoader());
      yield fetchArray();
    } else {
      yield fetchArray({ payload: { noLoad: true } });
    }
  }
}

function* fetchTransports() {
  try {
    yield put(actionCreators.startStorageLoader("Fetching Transport"));
    const response = yield call(
      [axios, axios.get],
      `/api/v1/transports/`,
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "x-access-token": localStorage.getItem("token"),
        },
      }
    );
    if (response.status === 200 && response.data) {
      yield put(actionCreators.fetchTransports(response.data));
    } else {
      yield put(
        actionCreators.showStorageAlert({
          alertType: "alert",
          alertTitle: "List Transport",
          errorMsg: "Unable to get tranports",
          errorCode: `Description: ${response.data.result && response.data.result.status
            ? `${response.data.result.status.problem}`
            : ""
            }`,
        })
      );
    }
  } catch (error) {
    yield put(
      actionCreators.showStorageAlert({
        alertType: "alert",
        alertTitle: "List Transport",
        errorMsg: "Unable to get tranports",
        errorCode: `Agent Communication error ${error.message ? (`: - ${error.message}`) : ''}`,
      })
    );
  } finally {
    yield put(actionCreators.stopStorageLoader())
  }
}

function* createTransport(action) {
  try {
    yield put(actionCreators.startLoader("Create Transport"))
    const response = yield call(
      [axios, axios.post],
      "/api/v1/transport/",
      {
        transport_type: action.payload.transportType,
        buf_cache_size: action.payload.bufCacheSize,
        num_shared_buf: action.payload.numSharedBuf
      },
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "x-access-token": localStorage.getItem("token"),
        },
      }
    );
    /* istanbul ignore else */
    if (response.status === 200) {
      if (response.data?.result?.status?.code === 0) {
        yield put(
          actionCreators.showStorageAlert({
            errorMsg: "Transport Creation Successful",
            alertTitle: "Create Transport",
            alertType: "info",
            errorCode: "",
          })
        );
        action.cleanup();
      } else {
        yield put(
          actionCreators.showStorageAlert({
            alertType: "alert",
            errorMsg: "Error while creating transport",
            errorCode: `Description:${response.data?.result?.status?.posDescription}`,
            alertTitle: "Create Transport",
          })
        );
      }
    } else {
      yield put(
        actionCreators.showStorageAlert({
          alertType: "alert",
          errorMsg: "Error while creating transport",
          errorCode:
            response.data && response.data.result
              ? response.data.result
              : "Transport Creation failed",
          alertTitle: "Create Transport",
        })
      );
    }
    yield fetchTransports();
  } catch (error) {
    yield put(
      actionCreators.showStorageAlert({
        alertType: "alert",
        errorMsg: "Error while creating transport",
        errorCode: `Agent Communication Error - ${error.message}`,
        alertTitle: "Create Transport",
      })
    );
  } finally {
    yield put(actionCreators.stopStorageLoader());
  }
}

function* createVolume(action) {
  try {
    const arrayName = yield select(arrayname)
    const requestAcceptedCode = 10202
    // for multi-volume creation
    if (action.payload.count < 2)
      yield put(actionCreators.startStorageLoader("Creating Volume"));
    yield put(actionCreators.toggleCreateVolumeButton(true));
    const response = yield call(
      [axios, axios.post],
      "/api/v1.0/save-volume/",
      {
        ...action.payload,
        array: arrayName,
      },
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "x-access-token": localStorage.getItem("token"),
        },
      }
    );

    /* istanbul ignore else */
    if (action.payload.count > 1) {
      if (response.status === 200) {
        // Create Multi-Volume request accepted and passed to POS
        if (response.data.result.status.code === requestAcceptedCode) {
          yield put(actionCreators.toggleAdvanceCreateVolumePopup(false));
          yield put(actionCreators.resetInputs());
        }
        // error code : 11050, volume count exceeds limit
        // error code : 11040, associated POS call failed
        else {
          yield put(
            actionCreators.showStorageAlert({
              alertType: "alert",
              alertTitle: "Create Volume",
              errorMsg: "Volume(s) creation failed",
              errorCode: `Description: ${response.data.result && response.data.result.status
                ? `${response.data.result.status.problem}`
                : ""
                }`,
            })
          );
          yield put(actionCreators.toggleCreateVolumeButton(false));
        }
      } else {
        yield put(
          actionCreators.showStorageAlert({
            alertType: "alert",
            alertTitle: "Create Volume",
            errorMsg: "Volume(s) creation failed",
            errorCode: ``,
          })
        );
        yield put(actionCreators.toggleCreateVolumeButton(false));
      }
    }
    // for single volume creation
    else if (response.status === 200) {
      yield put(actionCreators.toggleCreateVolumeButton(false));
      if (
        response.data.result?.status?.code === 2000
        || response.data.result?.status?.code === 0
      ) {
        const { errorInfo } = response.data.result.status;
        let isError = false;
        let errorCodeDescription = '';
        if (errorInfo?.errorResponses?.length > 0) {
          errorInfo.errorResponses.map(err => {
            errorCodeDescription += `${err.description}\n\n`;
            if (err.code !== 0)
              isError = true;
            return err;
          })
        }
        if (isError) {
          yield put(
            actionCreators.showStorageAlert({
              alertType: "alert",
              alertTitle: "Create Volume",
              errorMsg: "Volume is created with below errors",
              errorCode: errorCodeDescription,
            })
          );
        } else {
          yield put(
            actionCreators.showStorageAlert({
              alertType: "info",
              alertTitle: "Create Volume",
              errorMsg: "Volume(s) created successfully",
              errorCode: "",
            })
          );
        }
        yield put(actionCreators.toggleAdvanceCreateVolumePopup(false));
        yield put(actionCreators.resetInputs());
      } else if (response.data.result?.status?.code === 9011) {
        yield put(
          actionCreators.showStorageAlert({
            alertType: "partialError",
            alertTitle: "Create Volume",
            errorMsg: "Volume is created with below warnings",
            errorCode: `${response.data.result?.status?.posDescription}`,
          })
        );
        yield put(actionCreators.toggleAdvanceCreateVolumePopup(false));
        yield put(actionCreators.resetInputs());
      } else {
        yield put(
          actionCreators.showStorageAlert({
            alertType: "alert",
            alertTitle: "Create Volume",
            errorMsg: "Error while creating Volume",
            errorCode: `${response.data.result?.status?.description}
                      ${response.data.result?.status?.solution}`,
          })
        );
      }
      yield fetchVolumes({ payload: { array: arrayName } });
      yield fetchArray();
    } else {
      yield put(
        actionCreators.showStorageAlert({
          alertType: "alert",
          alertTitle: "Create Volume",
          errorMsg: "Volume(s) creation failed",
          errorCode: `Message from server: ${response.data ? response.data.result : ""
            }`,
        })
      );
      yield put(actionCreators.toggleCreateVolumeButton(false));
    }
  } catch (error) {
    yield put(
      actionCreators.showStorageAlert({
        alertType: "alert",
        alertTitle: "Create Volume",
        errorMsg: "Volume(s) creation failed",
        errorCode: `Agent Communication error ${error.message ? (`: - ${error.message}`) : ''}`,
      })
    );
    yield put(actionCreators.toggleCreateVolumeButton(false));
  } finally {
    yield fetchSubsystems();
    yield put(actionCreators.stopStorageLoader());
  }
}

function* resetQoS(action) {
  const volName = action.payload.name;
  const volUrl = action.payload.url;
  const arrayName = yield select(arrayname);
  try {
    yield put(actionCreators.startStorageLoader("Resetting Volume QoS"));
    const response = yield call(
      [axios, axios.post], '/api/v1/qos/reset', {
      array: arrayName,
      volumes: [{ volumeName: volName }]
    },
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "x-access-token": localStorage.getItem("token"),
        },
      }
    );
    if (response.status === 200) {
      yield put(
        actionCreators.showStorageAlert({
          alertType: "info",
          alertTitle: "Volume QoS Reset",
          errorMsg: "QoS Reset successfull",
          errorCode: "",
        })
      );
    }
  } catch (e) {
    yield put(
      actionCreators.showStorageAlert({
        alertType: "alert",
        alertTitle: "Volume QoS Reset",
        errorMsg: "Volume QoS Reset failed",
        errorCode: `Error Message: ${e ? e.message : ''}`,
      })
    );
  } finally {
    yield fetchVolumeDetails({
      payload: {
        url: volUrl,
        array: arrayName
      }
    });
    yield put(actionCreators.stopStorageLoader());
  }
}

function* renameVolume(action) {
  try {
    const arrayName = yield select(arrayname)
    const response = yield call(
      [axios, axios.patch],
      `/api/v1.0/volumes/${action.payload.name}`,
      {
        param: {
          name: action.payload.name,
          newname: action.payload.newName,
          array: arrayName,
        },
      },
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "x-access-token": localStorage.getItem("token"),
        },
      }
    );
    /* istanbul ignore else */
    if (response.status === 200) {
      if (
        response.data.result &&
        response.data.result.status &&
        (response.data.result.status.code === 2000 ||
          response.data.result.status.code === 0)
      ) {
        if (action.payload.noError) {
          yield put(
            actionCreators.showStorageAlert({
              alertType: "info",
              alertTitle: "Update Volume",
              errorMsg: `${action.payload.error}\nVolume Updated successfully`,
              errorCode: "",
            })
          );
        } else {
          yield put(
            actionCreators.showStorageAlert({
              alertType: "partialError",
              alertTitle: "Update Volume",
              errorMsg: "Volume Updation Succeeded partially",
              errorCode: action.payload.error,
            })
          );
        }
      } else if (action.payload.qosSame) {
        yield put(
          actionCreators.showStorageAlert({
            alertType: "alert",
            alertTitle: "Update Volume",
            errorMsg: "Volume Updation Failed",
            errorCode: `Error in Renaming volume: ${response.data.result && response.data.result.status
              ? `${response.data.result.status.description}`
              : ""
              }`
          })
        );
      } else if (action.payload.noError) {

        yield put(
          actionCreators.showStorageAlert({
            alertType: "partialError",
            alertTitle: "Update Volume",
            errorMsg: "Volume Updation Succeeded partially",
            errorCode: `${action.payload.error}\nError in Renaming volume: ${response.data.result && response.data.result.status
              ? `${response.data.result.status.description}`
              : ""
              }`
          })
        );

      } else {
        yield put(
          actionCreators.showStorageAlert({
            alertType: "partialError",
            alertTitle: "Update Volume",
            errorMsg: "Volume Updation failed",
            errorCode: `${action.payload.error}\nError in updating Volume name: ${response.data.result && response.data.result.status
              ? `${response.data.result.status.description}`
              : ""
              }`,
          })
        );
      }
    }
  } catch (error) {
    if (action.payload.noError) {
      yield put(
        actionCreators.showStorageAlert({
          alertType: "alert",
          alertTitle: "Update Volume Name",
          errorMsg: "Volume Name Updation failed",
          errorCode: `${action.payload.error}\nError in updating Volume name: ${error ? error.message : ''}`,
        })
      );
    } else {
      yield put(
        actionCreators.showStorageAlert({
          alertType: "alert",
          alertTitle: "Update Volume",
          errorMsg: "Volume Updation failed",
          errorCode: `${action.payload.error}\nError in updating Volume name: ${error ? error.message : ''}`,
        })
      );
    }
  }
}

function isValidQOS(iops, bw) {
  if (
    !(/^\d+$/.test(iops)) ||
    !(/^\d+$/.test(bw)) ||
    iops < 0 ||
    bw < 0 ||
    (bw % 1) !== 0 ||
    (iops % 1) !== 0) {
    return false;
  }
  return true;
}


function* updateVolume(action) {
  const arrayName = yield select(arrayname)
  try {
    yield put(actionCreators.startStorageLoader("Updating Volume"));
    if (!isValidQOS(action.payload.maxiops, action.payload.maxbw) || !isValidQOS(action.payload.miniops, action.payload.minbw)) {
      yield put(
        actionCreators.showStorageAlert({
          alertType: "alert",
          alertTitle: "Update Volume",
          errorMsg: "Please give valid values",
          errorCode: "",
        })
      );
      return;
    }
    if (
      action.payload.maxiops === action.payload.oldMaxiops &&
      action.payload.miniops === action.payload.oldMiniops &&
      action.payload.maxbw === action.payload.oldMaxbw &&
      action.payload.minbw === action.payload.oldMinbw
    ) {
      if (action.payload.name !== action.payload.newName) {
        yield renameVolume({
          payload: {
            name: action.payload.name,
            newName: action.payload.newName,
            array: arrayName,
            noError: true,
            error: "",
            qosSame: true
          },
        });
      }
      yield fetchVolumeDetails({
        payload: {
          url: action.payload.url,
          array: arrayName
        }
      });
      return;
    }

    let data = {
      maxiops: action.payload.maxiops,
      maxbw: action.payload.maxbw,
      volumes: [{ "volumeName": action.payload.name }],
      array: arrayName,
    };
    if (action.payload.minType === MINBW && action.payload.minbw !== action.payload.oldMinbw) {
      data = {
        maxiops: action.payload.maxiops,
        minbw: action.payload.minbw,
        maxbw: action.payload.maxbw,
        volumes: [{ "volumeName": action.payload.name }],
        array: arrayName,
      }
    }
    else if (action.payload.minType === MINIOPS && action.payload.miniops !== action.payload.oldMiniops) {
      data = {
        miniops: action.payload.miniops,
        maxiops: action.payload.maxiops,
        maxbw: action.payload.maxbw,
        volumes: [{ "volumeName": action.payload.name }],
        array: arrayName,
      }
    }
    const response = yield call(
      [axios, axios.post],
      "/api/v1/qos",
      data,
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "x-access-token": localStorage.getItem("token"),
        },
      }
    );
    /* istanbul ignore else */
    if (response.status === 200) {
      /* istanbul ignore else */
      if (
        response.data.result &&
        response.data.result.status &&
        (response.data.result.status.code === 2000 ||
          response.data.result.status.code === 0)
      ) {
        if (action.payload.newName !== action.payload.name) {
          yield renameVolume({
            payload: {
              name: action.payload.name,
              newName: action.payload.newName,
              array: arrayName,
              noError: true,
              error: "",
            },
          });
        } else {
          yield put(
            actionCreators.showStorageAlert({
              alertType: "info",
              alertTitle: "Update Volume",
              errorMsg: "Volume updated successfully",
              noError: true,
              errorCode: "",
            })
          );
        }
      } else if (action.payload.newName !== action.payload.name) {
        yield renameVolume({
          payload: {
            name: action.payload.name,
            newName: action.payload.newName,
            array: arrayName,
            error: `Max IOPS and Bandwidth update failed: ${response.data.result && response.data.result.status
              ? `${response.data.result.status.posDescription}`
              : ""
              }`
          },
        });
      } else {
        yield put(
          actionCreators.showStorageAlert({
            alertType: "alert",
            alertTitle: "Update Volume",
            errorMsg: "Volume Updation failed",
            errorCode: `Max IOPS and Bandwidth update failed: ${response.data.result && response.data.result.status
              ? `${response.data.result.status.posDescription}`
              : ""
              }`
          })
        );
      }
      yield fetchVolumeDetails({
        payload: {
          url: action.payload.url,
          array: arrayName
        }
      });
    } else if (action.payload.newName !== action.payload.name) {
      yield renameVolume({
        payload: {
          name: action.payload.name,
          newName: action.payload.newName,
          array: arrayName,
          error: `Max IOPS and Bandwidth update failed: ${response.data}\n`
        },
      });
    } else {
      yield put(
        actionCreators.showStorageAlert({
          alertType: "alert",
          alertTitle: "Update Volume",
          errorMsg: "Volume Updation failed",
          errorCode: `Max IOPS and Bandwidth update failed: ${response.data}\n`
        })
      );
    }
  } catch (error) {
    if (action.payload.newName !== action.payload.name) {
      yield renameVolume({
        payload: {
          name: action.payload.name,
          newName: action.payload.newName,
          array: arrayName,
          error: `Max IOPS and Bandwidth update failed: ${error ? error.message : ''}\n`
        },
      });
    } else {
      yield put(
        actionCreators.showStorageAlert({
          alertType: "alert",
          alertTitle: "Update Volume",
          errorMsg: "Volume Updation failed",
          errorCode: `Max IOPS and Bandwidth update failed: ${error ? error.message : ''}\n`
        })
      );
    }
  } finally {
    yield put(actionCreators.stopStorageLoader());
  }
}

function* resetAndUpdateVolume(action) {
  const isGreaterThanEqualTo = (param) => {
    if (typeof (param) === 'number') return false;
    const max = "18446744073709552";
    if (param.length < max.length) return false;
    if (param.length > max.length) return true;

    const max1 = max.substring(0, max.length - 1);
    const max2 = max.substring(max.length - 1);
    const param1 = param.substring(0, param.length - 1);
    const param2 = param.substring(param.length - 1);

    if (param1 < max1) return false;
    if (param1 > max1) return true;
    if (param2 < max2) return false;
    return true;
  }

  if ((action.payload.maxiops > 0 && action.payload.maxiops < 10) || isGreaterThanEqualTo(action.payload.maxiops)) {
    yield put(actionCreators.showStorageAlert({
      alertType: "alert",
      alertTitle: "Reset Volume",
      errorMsg: "Max IOPS should be in the range 10 ~ 18446744073709551. Please input 0, for no limit for qos or Maximum",
    }))
    return;
  }

  if ((action.payload.maxbw > 0 && action.payload.maxbw < 10) || action.payload.maxbw > 17592186044415) {
    yield put(actionCreators.showStorageAlert({
      alertType: "alert",
      alertTitle: "Reset Volume",
      errorMsg: "Max Bandwidth should be in the range 10 ~ 17592186044415. Please input 0, for no limit for qos or Maximum",
    }))
    return;
  }


  if (action.payload.resetType === "" || action.payload.minType === action.payload.resetType) {
    yield updateVolume({ payload: action.payload });
    return;
  }

  const arrayName = yield select(arrayname)
  try {
    yield put(actionCreators.startStorageLoader("Updating Volume"));

    const data = action.payload.resetType === "miniops" ? {
      maxiops: action.payload.oldMaxiops,
      maxbw: action.payload.oldMaxbw,
      miniops: 0,
      volumes: [{ "volumeName": action.payload.name }],
      array: arrayName,
    } : {
      maxiops: action.payload.oldMaxiops,
      maxbw: action.payload.oldMaxbw,
      minbw: 0,
      volumes: [{ "volumeName": action.payload.name }],
      array: arrayName,
    }

    const response = yield call(
      [axios, axios.post],
      "/api/v1/qos",
      data,
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "x-access-token": localStorage.getItem("token"),
        },
      }
    );

    if (response.status === 200 &&
      response.data.result &&
      response.data.result.status &&
      (response.data.result.status.code === 2000 ||
        response.data.result.status.code === 0)
    ) {

      yield updateVolume({ payload: action.payload });

    } else {
      yield put(
        actionCreators.showStorageAlert({
          alertType: "alert",
          alertTitle: "Reset Volume",
          errorMsg: "Volume Reseting failed",
          errorCode: `Min IOPS and Bandwidth reseting failed: ${response.data.result && response.data.result.status
            ? `${response.data.result.status.description}`
            : ""
            }`
        })
      );
    }
    yield fetchVolumeDetails({
      payload: {
        url: action.payload.url,
        array: arrayName
      }
    });
  } catch (error) {
    yield put(
      actionCreators.showStorageAlert({
        alertType: "alert",
        alertTitle: "Reset Volume",
        errorMsg: "Volume Reseting failed",
        errorCode: `Min IOPS and Bandwidth reseting failed: ${error ? error.message : ''}\n`
      })
    );
  } finally {
    yield put(actionCreators.stopStorageLoader());
  }
}

function* fetchMaxVolumeCount() {
  try {
    const response = yield call(
      [axios, axios.get],
      `/api/v1.0/max_volume_count/?ts=${Date.now()}`,
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "x-access-token": localStorage.getItem("token"),
        },
      }
    );
    /* istanbul ignore else */
    if (response.status === 200 && response.data) {
      yield put(actionCreators.fetchMaxVolumeCount(response.data));
    }
  } catch (e) {
    yield put(actionCreators.fetchMaxVolumeCount(256));
  }
}

function* deleteArray(action) {
  try {
    const arrayName = yield select(arrayname)
    yield put(actionCreators.startStorageLoader("Deleting Array"));
    const response = yield call(
      [axios, axios.post],
      `/api/v1.0/delete_array/${arrayName}`,
      {
        ...action.payload,
      },
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "x-access-token": localStorage.getItem("token"),
        },
      }
    );
    /* istanbul ignore else */
    if (response.status === 200) {
      if (response.data.return !== -1) {
        yield put(
          actionCreators.showStorageAlert({
            errorMsg: "Array Deleted successfully",
            alertTitle: "Delete Array",
            alertType: "info",
            errorCode: "",
          })
        );
      } else {
        yield put(
          actionCreators.showStorageAlert({
            alertType: "alert",
            errorMsg: "Error while Deleting Array",
            errorCode: `Description:${response.data.result.description}`,
            alertTitle: "Delete Array",
          })
        );
      }
    } else {
      yield put(
        actionCreators.showStorageAlert({
          alertType: "alert",
          errorMsg: "Error while Deleting Array",
          errorCode:
            response.data && response.data.result
              ? response.data.result
              : "Array deletion failed",
          alertTitle: "Delete Array",
        })
      );
    }
  } catch (error) {
    yield put(
      actionCreators.showStorageAlert({
        errorMsg: "Array deletion failed",
        alertType: "alert",
        alertTitle: "Delete Array",
        errorCode: `Agent Communication Error - ${error.message}`,
      })
    );
  } finally {
    yield fetchArray();
    yield put(actionCreators.stopStorageLoader());
  }
}

function* deleteVolumes(action) {
  try {
    const arrayName = yield select(arrayname)
    yield put(actionCreators.startStorageLoader("Deleting Volume(s)"));
    const response = yield call(
      [axios, axios.post],
      `/api/v1.0/delete_volumes/${arrayName}`,
      action.payload,
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "x-access-token": localStorage.getItem("token"),
        },
      }
    );
    /* istanbul ignore else */
    if (response.status === 200 && response.data) {
      if (response.data.return !== -1) {
        yield put(
          actionCreators.showStorageAlert({
            alertType: "info",
            alertTitle: "Delete Volume",
            errorMsg: `Total Volumes:${`${response.data.total}, Passed:${response.data.passed}, Failed:${response.data.failed}`}`,
            errorCode: "",
          })
        );
      } else {
        yield put(
          actionCreators.showStorageAlert({
            errorMsg: `Total Volumes:${`${response.data.total}, Passed:${response.data.passed}, Failed:${response.data.failed}`}`,
            // errorMsg: `Deletion failed for volume :  ${ response.data.vol_name}`,
            alertType: response.data.passed === 0 ? "alert" : "partialError",
            alertTitle: "Delete Volume",
            errorCode: response.data.description,
          })
        );
      }
    } else {
      yield put(
        actionCreators.showStorageAlert({
          errorMsg: "Volume deletion failed",
          alertType: "alert",
          alertTitle: "Delete Volume",
          errorCode: `Message from server:${response.data.result}`,
        })
      );
    }
  } catch (error) {
    yield put(
      actionCreators.showStorageAlert({
        errorMsg: "Volume deletion failed",
        alertType: "alert",
        alertTitle: "Delete Volume",
        errorCode: `Agent Communication Error - ${error.message}`,
      })
    );
  } finally {
    yield fetchVolumes({ payload: { array: yield select(arrayname) } });
    yield fetchSubsystems();
    yield put(actionCreators.stopStorageLoader());
  }
}

function* createArray(action) {
  try {
    yield put(actionCreators.startStorageLoader("Creating Array"));
    const response = yield call(
      [axios, axios.post],
      "/api/v1.0/create_arrays/",
      {
        ...action.payload,
      },
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "x-access-token": localStorage.getItem("token"),
        },
      }
    );
    /* istanbul ignore else */
    if (response.status === 200) {
      if (
        response.data.return !== -1 &&
        response.data.result.status.code === 0
      ) {
        yield put(
          actionCreators.showStorageAlert({
            errorMsg: "Array created successfully",
            alertTitle: "Create Array",
            alertType: "info",
            errorCode: "",
            link: `/storage/array/manage?array=${action.payload.arrayname}`,
            linkText: "Manage Array"
          })
        );
      } else {
        yield put(
          actionCreators.showStorageAlert({
            alertType: "alert",
            errorMsg: "Error in Array Creation",
            errorCode: `${response.data.result.status.description}. ${response.data.result.status.solution}`,
            alertTitle: "Create Array",
          })
        );
      }
    } else {
      yield put(
        actionCreators.showStorageAlert({
          alertType: "alert",
          errorMsg: "Error in Array Creation",
          errorCode:
            response.data && response.data.result
              ? response.data.result
              : "Array Creation failed",
          alertTitle: "Create Array",
        })
      );
    }
    yield fetchMaxVolumeCount();
  } catch (error) {
    yield put(
      actionCreators.showStorageAlert({
        alertType: "alert",
        errorMsg: error && error.response ? error.response.data : "Array Creation failed",
        errorCode: "",
        alertTitle: "Error in Array Creation"
      })
    );
  } finally {
    yield fetchDevices();
    yield fetchArray();
    yield put(actionCreators.stopStorageLoader());
  }
}

function* autoCreateArray(action) {
  try {
    const raidType = action.payload.selectedRaid;
    const autoArrayname = action.payload.array.arrayName;
    if (!autoArrayname) {
      yield put(
        actionCreators.showStorageAlert({
          alertType: "alert",
          errorMsg: "Please provide a name for the Array",
          errorCode: "",
          alertTitle: "Error in Array Creation"
        })
      );
      return;
    }
    if (Number(action.payload.array.storageDisks) < Number(raidType.minStorageDisks) ||
      Number(action.payload.array.spareDisks) < Number(raidType.minSpareDisks) ||
      Number(action.payload.array.storageDisks) > Number(raidType.maxStorageDisks) ||
      Number(action.payload.array.spareDisks) > Number(raidType.maxSpareDisks)) {
      yield put(
        actionCreators.showStorageAlert({
          alertType: "alert",
          errorMsg: "Number of Storage Disks and Spare Disks should fall within the conditions as per the selected RAID type",
          errorCode: "",
          alertTitle: "Error in Array Creation"
        })
      );
      return;
    }
    if (!action.payload.array.metaDisk ||
      !action.payload.array.metaDisk.length) {
      yield put(
        actionCreators.showStorageAlert({
          alertType: "alert",
          errorMsg: `Minimum 1 Write Buffer Path should be availabe for array creation`,
          errorCode: "",
          alertTitle: "Error in Array Creation"
        })
      );
      return;
    }
    if (action.payload.freeDisks <
      (Number(action.payload.array.storageDisks) + Number(action.payload.array.spareDisks))) {
      yield put(
        actionCreators.showStorageAlert({
          alertType: "alert",
          errorMsg: "Total number of disks available cannot satify the spare disk and storage disk requirement",
          errorCode: "",
          alertTitle: "Error in Array Creation"
        })
      );
      return;
    }
    yield put(actionCreators.startStorageLoader("Creating Array"));
    const response = yield call(
      [axios, axios.post],
      "/api/v1/autoarray/",
      {
        arrayname: autoArrayname,
        raidtype: action.payload.array.raidtype,
        metaDisk: action.payload.array.metaDisk,
        num_data: Number(action.payload.array.storageDisks),
        num_spare: Number(action.payload.array.spareDisks),
        writeThroughModeEnabled: action.payload.array.writeThroughMode
      },
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "x-access-token": localStorage.getItem("token"),
        },
      }
    );
    /* istanbul ignore else */
    if (response.status === 200) {
      if (
        response.data.return !== -1 &&
        response.data.result.status.code === 0
      ) {
        yield put(
          actionCreators.showStorageAlert({
            errorMsg: "Array created successfully",
            alertTitle: "Create Array",
            alertType: "info",
            errorCode: "",
            link: `/storage/array/manage?array=${autoArrayname}`,
            linkText: "Manage Array"
          })
        );
      } else {
        yield put(
          actionCreators.showStorageAlert({
            alertType: "alert",
            errorMsg: "Error in Array Creation",
            errorCode: `${response.data.result.status.description}. ${response.data.result.status.solution}`,
            alertTitle: "Create Array",
          })
        );
      }
    } else {
      yield put(
        actionCreators.showStorageAlert({
          alertType: "alert",
          errorMsg: "Error in Array Creation",
          errorCode:
            response.data && response.data.result
              ? response.data.result
              : "Array Creation failed",
          alertTitle: "Create Array",
        })
      );
    }
    yield fetchDevices();
    yield fetchArray();
  } catch (error) {
    yield put(
      actionCreators.showStorageAlert({
        alertType: "alert",
        errorMsg: error && error.response ? error.response.data : "Array Creation failed",
        errorCode: "",
        alertTitle: "Error in Array Creation"
      })
    );
  } finally {
    yield put(actionCreators.stopStorageLoader());
  }
}

function* rebuildArray(action) {
  try {
    yield put(actionCreators.startStorageLoader("Starting Array rebuild"));
    const response = yield call(
      [axios, axios.post],
      `/api/v1.0/array/${action.payload}/rebuild`,
      {},
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "x-access-token": localStorage.getItem("token"),
        },
      }
    );
    /* istanbul ignore else */
    if (response.status === 200) {
      if (response.data.result.status.code !== 0) {
        yield put(
          actionCreators.showStorageAlert({
            alertType: "alert",
            errorMsg: "Error while Starting Rebuild Operation",
            errorCode: `${response.data.result.status.description}\n${response.data.result.status.cause}\n${response.data.result.status.solution}`,
            alertTitle: "Array Rebuild",
          })
        );
      } else {
        yield put(
          actionCreators.showStorageAlert({
            alertType: "info",
            errorMsg: "Rebuild Started Successfully",
            alertTitle: "Array Rebuild",
          })
        );
      }
    }
  } catch (error) {
    yield put(
      actionCreators.showStorageAlert({
        alertType: "alert",
        errorMsg: "Error while Staring Rebuild Operation",
        errorCode: `Agent Communication Error - ${error.message}`,
        alertTitle: "Array Rebuild",
      })
    );
  } finally {
    yield put(actionCreators.stopStorageLoader());
  }
}

function* addSpareDisk(action) {
  try {
    const arrayName = yield select(arrayname)
    yield put(actionCreators.startStorageLoader("Adding Spare Device"));
    const response = yield call(
      [axios, axios.post],
      "/api/v1.0/add_spare_device/",
      {
        name: action.payload.name,
        array: arrayName,
      },
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "x-access-token": localStorage.getItem("token"),
        },
      }
    );
    /* istanbul ignore else */
    if (response.status === 200) {
      if (response.data.return !== -1) {
        yield put(
          actionCreators.showStorageAlert({
            errorMsg: "Spare Device Added successfully",
            alertTitle: "Add Spare Device",
            alertType: "info",
            errorCode: "",
          })
        );
      } else {
        yield put(
          actionCreators.showStorageAlert({
            alertType: "alert",
            errorMsg: "Error while Adding Spare Device",
            errorCode:
              response.data && response.data.result && response.data.result.description
                ? response.data.result.description
                : "Adding Spare Device Failed",
            alertTitle: "Add Spare Device",
          })
        );
      }
    } else {
      yield put(
        actionCreators.showStorageAlert({
          alertType: "alert",
          errorMsg: "Error while Adding Spare Device",
          errorCode:
            response.data && response.data.result
              ? response.data.result
              : "Adding Spare Device Failed",
          alertTitle: "Add Spare Device",
        })
      );
    }
  } catch (error) {
    yield put(
      actionCreators.showStorageAlert({
        alertType: "alert",
        errorMsg: "Error while Adding Spare Device",
        errorCode: `Agent Communication Error - ${error.message}`,
        alertTitle: "Add Spare Device",
      })
    );
  } finally {
    yield put(actionCreators.stopStorageLoader());
    yield fetchDevices();
  }
}

function* createDisk(action) {
  try {
    yield put(actionCreators.startStorageLoader("Creating Disk"));
    const response = yield call(
      [axios, axios.post],
      "/api/v1/device/",
      {
        ...action.payload
      },
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "x-access-token": localStorage.getItem("token"),
        },
      }
    );
    /* istanbul ignore else */
    if (response.status === 200) {
      if (response.data?.result?.status?.code === 0) {
        yield put(
          actionCreators.showStorageAlert({
            errorMsg: "Disk Creation Successful",
            alertTitle: "Create Disk",
            alertType: "info",
            errorCode: "",
          })
        );
        action.cleanup();
      } else {
        yield put(
          actionCreators.showStorageAlert({
            alertType: "alert",
            errorMsg: "Error while creating disk",
            errorCode: `Description:${response.data?.result?.status?.posDescription}`,
            alertTitle: "Create Disk",
          })
        );
      }
    } else {
      yield put(
        actionCreators.showStorageAlert({
          alertType: "alert",
          errorMsg: "Error while Creating Disk",
          errorCode:
            response.data && response.data.result
              ? response.data.result
              : "Disk Creation failed",
          alertTitle: "Create Disk",
        })
      );
    }
    yield fetchDevices();
  } catch (error) {
    yield put(
      actionCreators.showStorageAlert({
        alertType: "alert",
        errorMsg: "Error while Creating Disk",
        errorCode: `Agent Communication Error - ${error.message}`,
        alertTitle: "Create Disk",
      })
    );
  } finally {
    yield put(actionCreators.stopStorageLoader());
  }
}

function* removeSpareDisk(action) {
  try {
    const arrayName = yield select(arrayname)
    yield put(actionCreators.startStorageLoader("Removing Spare Device"));
    const response = yield call(
      [axios, axios.post],
      "/api/v1.0/remove_spare_device/",
      {
        name: action.payload.name,
        array: arrayName,
      },
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "x-access-token": localStorage.getItem("token"),
        },
      }
    );
    /* istanbul ignore else */
    if (response.status === 200) {
      if (response.data.return !== -1) {
        yield put(
          actionCreators.showStorageAlert({
            errorMsg: "Spare Device Removed successfully",
            alertTitle: "Remove Spare Device",
            alertType: "info",
            errorCode: "",
          })
        );
      } else {
        yield put(
          actionCreators.showStorageAlert({
            alertType: "alert",
            errorMsg: "Error while Removing Spare Device",
            errorCode: `Description:${response.data.result.description}`,
            alertTitle: "Remove Spare Device",
          })
        );
      }
    } else {
      yield put(
        actionCreators.showStorageAlert({
          alertType: "alert",
          errorMsg: "Error while Removing Spare Device",
          errorCode:
            response.data && response.data.result
              ? response.data.result
              : "Removing Spare Device failed",
          alertTitle: "Remove Spare Device",
        })
      );
    }
  } catch (error) {
    yield put(
      actionCreators.showStorageAlert({
        alertType: "alert",
        errorMsg: "Error while Removing Spare Device",
        errorCode: `Agent Communication Error - ${error.message}`,
        alertTitle: "Remove Spare Device",
      })
    );
  } finally {
    yield put(actionCreators.stopStorageLoader());
    yield fetchDevices();
  }
}

function* replaceDevice(action) {
  try {
    const arrayName = yield select(arrayname)
    yield put(actionCreators.startStorageLoader("Replacing Device"));
    const response = yield call(
      [axios, axios.post],
      `/api/v1/array/${arrayName}/replace`,
      {
        device: action.payload.name
      },
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "x-access-token": localStorage.getItem("token"),
        },
      }
    );
    /* istanbul ignore else */
    if (response.status === 200) {
      if (response.data.return !== -1) {
        yield put(
          actionCreators.showStorageAlert({
            errorMsg: "Replacing Array Device successfully",
            alertTitle: "Replace Array Device",
            alertType: "info",
            errorCode: "",
          })
        );
      } else {
        yield put(
          actionCreators.showStorageAlert({
            alertType: "alert",
            errorMsg: "Error while Replacing Array Device",
            errorCode: `Description:${response.data.result.description}`,
            alertTitle: "Replace Array Device",
          })
        );
      }
    } else {
      yield put(
        actionCreators.showStorageAlert({
          alertType: "alert",
          errorMsg: "Error while Removing Spare Device",
          errorCode:
            response.data && response.data.result
              ? response.data.result
              : "Removing Spare Device failed",
          alertTitle: "Remove Spare Device",
        })
      );
    }
  } catch (error) {
    yield put(
      actionCreators.showStorageAlert({
        alertType: "alert",
        errorMsg: "Error while Replacing Array Device",
        errorCode: `Agent Communication Error - ${error.message}`,
        alertTitle: "Replace Array Device",
      })
    );
  } finally {
    yield put(actionCreators.stopStorageLoader());
    yield fetchDevices();
  }
}

function* changeVolumeMountStatus(action) {
  let message = "Mount";
  const arrayName = yield select(arrayname)
  try {
    let response = {};
    if (action.payload.status === "Mounted") {
      message = "Unmount";
      yield put(actionCreators.startStorageLoader("Unmounting Volume"));
      response = yield call([axios, axios.delete], "/api/v1.0/volume/mount", {
        data: {
          name: action.payload.name,
          array: arrayName,
        },
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "x-access-token": localStorage.getItem("token"),
        },
      });
    } else {
      yield put(actionCreators.startStorageLoader("Mounting Volume"));
      response = yield call(
        [axios, axios.post],
        "/api/v1.0/volume/mount",
        {
          name: action.payload.name,
          array: arrayName,
          subnqn: action.payload.subsystem
        },
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "x-access-token": localStorage.getItem("token"),
          },
        }
      );
    }
    /* istanbul ignore else */
    if (response.status === 200) {
      /* istanbul ignore else */
      if (response.data && response.data.result.status.code === 0) {
        yield put(
          actionCreators.showStorageAlert({
            errorMsg: `Volume ${message}ed Successfully`,
            alertTitle: `${message}ing Volume`,
            alertType: "info",
            errorCode: "",
          })
        );
      } else {
        yield put(
          actionCreators.showStorageAlert({
            alertType: "alert",
            errorMsg: `Error while ${message}ing Volume`,
            errorCode: `Description:${response.data.result.status.description}`,
            alertTitle: `${message}ing Volume`,
          })
        );
      }
    } else {
      yield put(
        actionCreators.showStorageAlert({
          alertType: "alert",
          errorMsg: `Error while ${message}ing Volume`,
          errorCode:
            response.data && response.data.result
              ? response.data.result
              : `${message}ing Volume failed`,
          alertTitle: `${message}ing Volume`,
        })
      );
    }
  } catch (error) {
    yield put(
      actionCreators.showStorageAlert({
        alertType: "alert",
        errorMsg: `Error while ${message}ing Volume`,
        errorCode: `Agent Communication Error - ${error.message}`,
        alertTitle: `${message}ing Volume`,
      })
    );
  } finally {
    yield fetchVolumeDetails({
      payload: {
        url: action.payload.url,
        array: arrayName
      }
    });
    yield fetchSubsystems();
    yield put(actionCreators.stopStorageLoader());
  }
}

function* unmountPOS() {
  const message = "Unmount";
  try {
    let response = {};
    yield put(actionCreators.startStorageLoader("Unmounting Array"));
    response = yield call([axios, axios.delete], "/api/v1/array/mount", {
      data: {
        array: yield select(arrayname),
      },
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "x-access-token": localStorage.getItem("token"),
      },
    });
    /* istanbul ignore else */
    if (response.status === 200) {
      /* istanbul ignore else */
      if (response.data && response.data.result.status.code === 0) {
        yield put(
          actionCreators.showStorageAlert({
            errorMsg: `Array ${message}ed Successfully`,
            alertTitle: `${message}ing Array`,
            alertType: "info",
            errorCode: "",
          })
        );
      } else {
        yield put(
          actionCreators.showStorageAlert({
            alertType: "alert",
            errorMsg: `Error while ${message}ing Array`,
            errorCode: `Description:${response.data.result.status.description}`,
            alertTitle: `${message}ing Array`,
          })
        );
      }
    } else {
      yield put(
        actionCreators.showStorageAlert({
          alertType: "alert",
          errorMsg: `Error while ${message}ing Array`,
          errorCode:
            response.data && response.data.result
              ? response.data.result
              : `${message}ing Array failed`,
          alertTitle: `${message}ing Array`,
        })
      );
    }
  } catch (error) {
    yield put(
      actionCreators.showStorageAlert({
        alertType: "alert",
        errorMsg: `Error while ${message}ing Array`,
        errorCode: `Agent Communication Error - ${error.message}`,
        alertTitle: `${message}ing Array`,
      })
    );
  } finally {
    yield fetchArray();
    yield put(actionCreators.stopStorageLoader());
  }
}

function* mountPOS(action) {
  const message = "Mount";
  try {
    let response = {};
    yield put(actionCreators.startStorageLoader("Mounting Array"));
    response = yield call([axios, axios.post], "/api/v1/array/mount", {
      ...action.payload
    }, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "x-access-token": localStorage.getItem("token"),
      },
    });
    /* istanbul ignore else */
    if (response.status === 200) {
      if (response.data && response.data.result.status.code === 0) {
        yield put(
          actionCreators.showStorageAlert({
            errorMsg: `Array ${message}ed Successfully`,
            alertTitle: `${message}ing Array`,
            alertType: "info",
            errorCode: "",
          })
        );
      } else {
        yield put(
          actionCreators.showStorageAlert({
            alertType: "alert",
            errorMsg: `Error while ${message}ing Array`,
            errorCode: `Description:${response.data.result.status.description}`,
            alertTitle: `${message}ing Array`,
          })
        );
      }
    } else {
      yield put(
        actionCreators.showStorageAlert({
          alertType: "alert",
          errorMsg: `Error while ${message}ing Array`,
          errorCode:
            response.data && response.data.result
              ? response.data.result
              : `${message}ing Array failed`,
          alertTitle: `${message}ing Array`,
        })
      );
    }
  } catch (error) {
    yield put(
      actionCreators.showStorageAlert({
        alertType: "alert",
        errorMsg: `Error while ${message}ing Array`,
        errorCode: `Agent Communication Error - ${error.message}`,
        alertTitle: `${message}ing Array`,
      })
    );
  } finally {
    yield fetchVolumes({ payload: { array: yield select(arrayname) } });
    yield fetchArray();
    yield put(actionCreators.stopStorageLoader());
  }
}

function* fetchDeviceDetails(action) {
  const defaultDiskDetails = {
    available_spare: "NA",
    available_spare_space: "NA",
    available_spare_threshold: "NA",
    contoller_busy_time: "NA",
    critical_temperature_time: "NA",
    current_temperature: "NA",
    data_units_read: "NA",
    data_units_written: "NA",
    device_reliability: "NA",
    host_read_commands: "NA",
    host_write_commands: "NA",
    life_percentage_used: "NA",
    lifetime_error_log_entries: "NA",
    power_cycles: "NA",
    power_on_hours: "NA",
    read_only: "NA",
    temperature: "NA",
    unrecoverable_media_errors: "NA",
    unsafe_shutdowns: "NA",
    volatile_memory_backup: "NA",
    warning_temperature_time: "NA",
    name: action.payload.name,
  };
  try {
    const response = yield call(
      [axios, axios.get],
      `/api/v1.0/device/smart/${action.payload.name}?ts=${Date.now()}`,
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "x-access-token": localStorage.getItem("token"),
        },
      }
    );
    /* istanbul ignore else */
    if (response.status === 200 && response.data) {
      if (
        response.data.result.status.code === 0 ||
        response.data.result.status.code === 200
      ) {
        yield put(
          actionCreators.fetchDeviceDetails({
            ...response.data.result.data,
            name: action.payload.name,
          })
        );
      } else {
        yield put(
          actionCreators.showStorageAlert({
            alertType: "alert",
            errorMsg: "Error while Fetching Device SMART info",
            errorCode: `Description:${response.data.result.status.description}`,
            alertTitle: "Smart Info",
          })
        );
        yield put(actionCreators.fetchDeviceDetails(defaultDiskDetails));
      }
    } else {
      yield put(
        actionCreators.showStorageAlert({
          alertType: "alert",
          errorMsg: "Error while Fetching Device SMART info",
          errorCode: `Description: UI or Agent Error`,
          alertTitle: "Smart Info",
        })
      );
      yield put(actionCreators.fetchDeviceDetails(defaultDiskDetails));
    }
  } catch (error) {
    yield put(
      actionCreators.showStorageAlert({
        alertType: "alert",
        errorMsg: "Error while Fetching Device SMART info",
        errorCode: `Agent Communication Error - ${error.message}`,
        alertTitle: "Smart Info",
      })
    );
    yield put(actionCreators.fetchDeviceDetails(defaultDiskDetails));
  }
}

export default function* storageWatcher() {
  yield takeEvery(actionTypes.SAGA_FETCH_DEVICE_INFO, fetchDevices);
  yield takeEvery(actionTypes.SAGA_FETCH_TRANSPORT_INFO, fetchTransports);
  yield takeEvery(actionTypes.SAGA_CREATE_TRANSPORT, createTransport);
  yield takeEvery(actionTypes.SAGA_SAVE_VOLUME, createVolume);
  yield takeEvery(actionTypes.SAGA_FETCH_ARRAY, fetchArray);
  yield takeEvery(actionTypes.SAGA_GET_ARRAY_INFO, fetchArrayInfo);
  yield takeEvery(actionTypes.SAGA_FETCH_CONFIG, fetchConfig);
  yield takeEvery(actionTypes.SAGA_DELETE_ARRAY, deleteArray);
  yield takeEvery(actionTypes.SAGA_FETCH_VOLUMES, fetchVolumes);
  yield takeEvery(actionTypes.SAGA_DELETE_VOLUMES, deleteVolumes);
  yield takeEvery(actionTypes.SAGA_CREATE_ARRAY, createArray);
  yield takeEvery(actionTypes.SAGA_AUTO_CREATE_ARRAY, autoCreateArray);
  yield takeEvery(actionTypes.SAGA_FETCH_DEVICE_DETAILS, fetchDeviceDetails);
  yield takeEvery(actionTypes.SAGA_UPDATE_VOLUME, updateVolume);
  yield takeEvery(actionTypes.SAGA_RESET_AND_UPDATE_VOLUME, resetAndUpdateVolume);
  yield takeEvery(actionTypes.SAGA_CREATE_DISK, createDisk);
  // yield takeEvery(actionTypes.SAGA_ATTACH_DISK, attachDisk);
  // yield takeEvery(actionTypes.SAGA_DETACH_DISK, detachDisk);
  yield takeEvery(actionTypes.SAGA_ADD_SPARE_DISK, addSpareDisk);
  yield takeEvery(actionTypes.SAGA_RESET_VOLUME_QOS, resetQoS);

  yield takeEvery(actionTypes.SAGA_REMOVE_SPARE_DISK, removeSpareDisk);
  yield takeEvery(actionTypes.SAGA_REPLACE_DEVICE, replaceDevice);
  yield takeEvery(actionTypes.SAGA_FETCH_MAX_VOLUME_COUNT, fetchMaxVolumeCount);
  yield takeEvery(
    actionTypes.SAGA_VOLUME_MOUNT_CHANGE,
    changeVolumeMountStatus
  );
  yield takeEvery(actionTypes.SAGA_UNMOUNT_POS, unmountPOS);
  yield takeEvery(actionTypes.SAGA_MOUNT_POS, mountPOS);
  yield takeEvery(actionTypes.SAGA_REBUILD_ARRAY, rebuildArray);
}
