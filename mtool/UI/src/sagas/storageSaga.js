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


DESCRIPTION: <Contains Generator Functions for Storage Management component> *
@NAME : storageSaga.js
@AUTHORS: Aswin K K 
@Version : 1.0 *
@REVISION HISTORY
[21/08/2019] [Aswin K K] : Prototyping..........////////////////////
*/

import axios from "axios";
import { call, takeEvery, put, select } from "redux-saga/effects";
import * as actionTypes from "../store/actions/actionTypes";
import * as actionCreators from "../store/actions/exportActionCreators";
import {arrayname} from "../store/reducers/storageReducer";


function* fetchArraySize() {
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
    /* istanbul ignore else */
    if (response.status === 200 && response.data) {
      yield put(
        actionCreators.fetchArraySize({
          totalsize: response.data[0].arraySize,
          usedspace: response.data[0].usedSpace,
          mountStatus: response.data[0].mountStatus,
        })
      );
    } else {
      yield put(actionCreators.fetchArraySize({ totalsize: 0, usedsize: 0, mountStatus: 'OFFLINE' }));
    }
  } catch (e) {
    yield put(actionCreators.fetchArraySize({ totalsize: 0, usedsize: 0, mountStatus: 'OFFLINE' }));
  }
}

function* fetchVolumeDetails(action) {
  try {
    const response = yield call([axios, axios.get], action.payload, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "x-access-token": localStorage.getItem("token"),
      },
    });
    /* istanbul ignore else */
    if (response.status === 200) {
      yield put(actionCreators.addVolumeDetails(response.data));
    }
  } catch (e) {
    // console.log(e)
  }
}

function* fetchVolumes(action) {
  try {
    yield put(actionCreators.clearVolumes());
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
        yield fetchVolumeDetails({
          payload: response.data.Members[i]["@odata.id"],
        });
      }
      yield fetchArraySize();
    } else {
      yield put(
        actionCreators.fetchStorageVolumes({ volumes: [], totalVolSize: 0 })
      );
    }
  } catch (e) {
    yield put(
      actionCreators.fetchStorageVolumes({ volumes: [], totalVolSize: 0 })
    );
  }
}

function* fetchArray(action) {
  try {
    yield put(actionCreators.startStorageLoader("Fetching Arrays"));
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
      yield fetchArraySize();
    } else if (response.status === 401) {
      action.payload.push("/login");
    } else {
      yield put(actionCreators.setNoArray());
    }
  } catch (e) {
    yield put(actionCreators.setNoArray());
  } finally {
    yield select(arrayname);
    yield put(actionCreators.stopStorageLoader());
    yield fetchVolumes({payload: {array: yield select(arrayname)}});
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
    yield put(actionCreators.fetchConfig({raidTypes: []}));
  }
}

function* fetchDevices() {
  const defaultResponse = {
    devices: [],
    metadevices: [],
  };
  const alertDetails = {
    errorMsg: "Unable to get devices!",
    alertType: "alert",
    alertTitle: "Fetch Devices",
  };
  try {
    yield put(actionCreators.startStorageLoader("Fetching Devices"));
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
      yield put(
        actionCreators.showStorageAlert({
          alertType: "alert",
          alertTitle: "Fetch Devices",
          errorMsg: "Unable to get devices!",
          errorCode: `Description: ${
            response.data.result && response.data.result.status
              ? `${response.data.result.status.description}, Error code:${response.data.result.status.code}`
              : ""
          }`,
        })
      );
    } else if (result && typeof result !== "string" && result.return !== -1) {
      yield put(actionCreators.fetchDevices(result));
    } else {
      yield put(actionCreators.showStorageAlert({
        ...alertDetails,
        errorCode: `Description: ${
          response.data && response.data.result && response.data.result.status
            ? `${response.data.result.status.description}, Error code:${response.data.result.status.code}`
            : "Agent Communication Error"
        }`
      }));
      yield put(actionCreators.fetchDevices(defaultResponse));
    }
  } catch (error) {
    
    yield put(actionCreators.showStorageAlert({
      ...alertDetails,
      errorCode: `Agent Communication Error - ${error.message}`
    }));
    yield put(actionCreators.fetchDevices(defaultResponse));
  } finally {
    yield fetchArray();
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
        if(response.data.result.status.code === requestAcceptedCode){
          yield put(actionCreators.toggleCreateVolumeButton(true));
        }
        // error code : 11050, volume count exceeds limit
        // error code : 11040, associated POS call failed
        else{
          yield put(
            actionCreators.showStorageAlert({
              alertType: "alert",
              alertTitle: "Create Volume",
              errorMsg: "Volume(s) creation failed",
              errorCode: `Description: ${
                response.data.result && response.data.result.status
                  ? `${response.data.result.status.problem} , Error code:${response.data.result.status.code}`
                  : ""
              }`,
            })
          );
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
      }
    }
    // for single volume creation
    else if (response.status === 200) {
      if (
        response.data.result &&
        response.data.result.status &&
        (response.data.result.status.code === 2000 ||
          response.data.result.status.code === 0)
      ) {
        yield put(
          actionCreators.showStorageAlert({
            alertType: "info",
            alertTitle: "Create Volume",
            errorMsg: "Volume(s) created successfully",
            errorCode: "",
          })
        );
      } else {
        yield put(
          actionCreators.showStorageAlert({
            alertType: "alert",
            alertTitle: "Create Volume",
            errorMsg: "Volume(s) creation failed",
            errorCode: `Description: ${
              response.data.result && response.data.result.status
                ? `${response.data.result.status.description}, Error code:${response.data.result.status.code}`
                : ""
            }`,
          })
        );
      }
      yield fetchVolumes({payload: {array: arrayName}});
      yield fetchArray();
    } else {
      yield put(
        actionCreators.showStorageAlert({
          alertType: "alert",
          alertTitle: "Create Volume",
          errorMsg: "Volume(s) creation failed",
          errorCode: `Message from server: ${
            response.data ? response.data.result : ""
          }`,
        })
      );
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
  } finally {
    yield put(actionCreators.stopStorageLoader());
  }
}
/* function* createVolume(action) {
    let vol_successful = 0
    try {
        let count
        let prefix = action.payload.name
        
        yield put(actionCreators.toggleCreateVolumeButton(true));

        console.log("payloaddd",action.payload)
        for (count = 1; count <= action.payload.count; count++) {
            if (action.payload.count != 1) {
                action.payload.name = prefix + "_" + action.payload.suffix.toString()
                action.payload.suffix++
            }
            const response = yield call([axios, axios.post], '/api/v1.0/save-volume/', {
                ...action.payload
            }, {
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'x-access-token': localStorage.getItem('token'),
                }
            })

            if (response.status === 200) {
                if (response.data.result && response.data.result.status && (response.data.result.status.code === 2000 || response.data.result.status.code === 0)) {
                    vol_successful++
                }
            }
            if (action.payload.stop_on_error === true) {
                if (response.status === 200) {
                    if (response.data.result && response.data.result.status && (response.data.result.status.code === 2000 || response.data.result.status.code === 0))
                        continue;
                    else
                        break;
                }
                else if (yield cancelled() || response.status !== 200) {
                    break;
                }
            }
        }
    }
    catch (error) {
        yield put(actionCreators.showStorageAlert({
            alertType: 'alert',
            alertTitle: 'Create Volume',
            errorMsg: 'Volume(s) creation failed',
            errorCode: ``
        }))
    } finally {
        if (yield cancelled()) {
            yield put(actionCreators.showStorageAlert({
                alertType: 'alert',
                alertTitle: 'Create Volume',
                errorMsg: 'Volume(s) creation failed',
                errorCode: ``
            }))
        }
        else {
            let alert_type = vol_successful === 0 ? 'alert' : 'info'
            let error_msg
            if(vol_successful == action.payload.count)
            {
                if(action.payload.count === 1)
                    error_msg = 'Volume created successfully'
                else
                    error_msg = 'Status: ' + vol_successful + ' volumes created successfully'
            }
            else
            {
                if(action.payload.count === 1)
                    error_msg = 'Volume creation failed'
                else
                    error_msg = 'Status: ' + vol_successful + "/" + action.payload.count + ' volume(s) created successfully'
            }

            yield put(actionCreators.showStorageAlert({
                alertType: alert_type,
                alertTitle: 'Create Volume',
                errorMsg: error_msg,
                errorCode: '',
            }));
        }
        yield put(actionCreators.toggleCreateVolumeButton(false));
        yield fetchVolumes();
    }
}
*/

// function* createVolume(action) {
//     try {
//         yield put(actionCreators.startStorageLoader('Creating Volume'));
//         const response = yield call([axios, axios.post], '/api/v1.0/save-volume/', {
//             ...action.payload
//         }, {
//             headers: {
//                 Accept: 'application/json',
//                 'Content-Type': 'application/json',
//                 'x-access-token': localStorage.getItem('token'),
//             }
//         });
//         if (response.status === 200) {
//             if (response.data.result && response.data.result.status && (response.data.result.status.code === 2000 || response.data.result.status.code === 0)) {
//                 yield put(actionCreators.showStorageAlert({
//                     alertType: 'info',
//                     alertTitle: 'Create Volume',
//                     errorMsg: 'Volume(s) created successfully',
//                     errorCode: '',
//                 }));
//             } else {
//                 yield put(actionCreators.showStorageAlert({
//                     alertType: 'alert',
//                     alertTitle: 'Create Volume',
//                     errorMsg: 'Volume(s) creation failed',
//                     errorCode: `Message from server: ${response.data.result && response.data.result.status ? response.data.result.status.description : ''}`
//                 }))
//             }
//             yield fetchVolumes();
//         } else {
//             yield put(actionCreators.showStorageAlert({
//                 alertType: 'alert',
//                 alertTitle: 'Create Volume',
//                 errorMsg: 'Volume(s) creation failed',
//                 errorCode: `Message from server: ${response.data ? response.data.result : ''}`
//             }))
//         }
//     } catch (error) {
//         yield put(actionCreators.showStorageAlert({
//             alertType: 'alert',
//             alertTitle: 'Create Volume',
//             errorMsg: 'Volume(s) creation failed',
//             errorCode: ``
//         }))
//     } finally {
//         if (yield cancelled()) {
//             yield put(actionCreators.showStorageAlert({
//                 alertType: 'alert',
//                 alertTitle: 'Create Volume',
//                 errorMsg: 'Volume(s) creation failed',
//                 errorCode: ``
//             }))
//         }
//         yield put(actionCreators.stopStorageLoader());
//     }

// }

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
        if (action.payload.error === "") {
          yield put(
            actionCreators.showStorageAlert({
              alertType: "info",
              alertTitle: "Update Volume",
              errorMsg: "Volume Updated successfully",
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
      } else if (action.payload.error === "") {

          yield put(
            actionCreators.showStorageAlert({
              alertType: "partialError",
              alertTitle: "Update Volume",
              errorMsg: "Volume Updation Succeeded partially",
              errorCode: `Error in Renaming volume: ${
                response.data.result && response.data.result.status
                  ? `${response.data.result.status.description}, Error code:${response.data.result.status.code}`
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
            errorCode: `${action.payload.error}\nError in updating Volume name: ${
              response.data.result && response.data.result.status
                ? `${response.data.result.status.description}, Error code:${response.data.result.status.code}`
                : ""
            }`,
          })
        );
        }
    }
  } catch (error) {
    if (action.payload.error === "") {
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

function* updateVolume(action) {
  const arrayName = yield select(arrayname)
  try {
    yield put(actionCreators.startStorageLoader("Updating Volume"));
    if (
      action.payload.maxiops < 0 ||
      action.payload.maxbw < 0 ||
      (action.payload.maxiops > 0 && action.payload.maxiops < 10)
    ) {
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
    const data = {
      maxiops: parseInt(action.payload.maxiops, 10),
      maxbw: parseInt(action.payload.maxbw, 10),
      name: action.payload.name,
      array: arrayName,
    };
    const response = yield call(
      [axios, axios.put],
      "/api/v1.0/update-volume/",
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
              error: ""
            },
          });
        } else {
          yield put(
            actionCreators.showStorageAlert({
              alertType: "info",
              alertTitle: "Update Volume",
              errorMsg: "Volume Updated successfully",
              errorCode: "",
            })
          );
        }
      } else {
        yield renameVolume({
          payload: {
            name: action.payload.name,
            newName: action.payload.newName,
            array: arrayName,
            error: `Max IOPS and Bandwidth update failed: ${
              response.data.result && response.data.result.status
                ? `${response.data.result.status.description}, Error code:${response.data.result.status.code}`
                : ""
            }`
          },
        });
      }
      yield fetchVolumeDetails({ payload: action.payload.url });
    } else {
      yield renameVolume({
        payload: {
          name: action.payload.name,
          newName: action.payload.newName,
          array: arrayName,
          error: `Max IOPS and Bandwidth update failed: ${
            response.data}, Error code:${response.status}\n`
        },
      });
    }
  } catch (error) {
    yield renameVolume({
      payload: {
        name: action.payload.name,
        newName: action.payload.newName,
        array: arrayName,
        error: `Max IOPS and Bandwidth update failed: ${error ? error.message : ''}\n`
      },
    });
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
            errorCode: `Description:${response.data.result.description}, Error Code:${response.data.result.code}`,
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
            // errorCode: `Description:${`${response.data.result.description }, Error Code:${ response.data.result.code}`}`,
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
    yield fetchVolumes({payload: {array: yield select(arrayname)}});
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
            errorCode: `Description:${response.data.result.status.description}, Error Code: ${response.data.result.status.code}`,
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
        errorMsg: "Error in Array Creation",
        errorCode: "",
        alertTitle: `Agent Communication Error - ${error.message}`,
      })
    );
  } finally {
    yield fetchDevices();
    yield fetchArray();
    yield put(actionCreators.stopStorageLoader());
  }
}

// function* attachDisk(action) {
//     try {
//         yield put(actionCreators.startStorageLoader('Attaching Device'));
//         const response = yield call([axios, axios.post], '/api/v1.0/attach_device/', {
//             name: action.payload.name
//         }, {
//             headers: {
//                 Accept: 'application/json',
//                 'Content-Type': 'application/json',
//                 'x-access-token': localStorage.getItem('token'),
//             }
//         });
//         if (response.status === 200 && response.data.return !== -1) {
//             yield put(actionCreators.showStorageAlert({
//                 errorMsg: 'Device Attached successfully',
//                 alertTitle: 'Attach Device',
//                 alertType: 'info',
//                 errorCode: '',
//             }));
//         } else {
//             yield put(actionCreators.showStorageAlert({
//                 alertType: 'alert',
//                 errorMsg: 'Error while Attaching Device',
//                 errorCode: response.data && response.data.result ?
//                     response.data.result :
//                     'Device Attaching failed',
//                 alertTitle: 'Device Attach'
//             }));
//         }
//         yield fetchArray();
//     } catch (e) {
//         yield put(actionCreators.showStorageAlert({
//             alertType: 'alert',
//             errorMsg: 'Error in Attaching Device',
//             errorCode: '',
//             alertTitle: 'Attach Device'
//         }))
//     } finally {
//         if (yield cancelled()) {
//             yield put(actionCreators.showStorageAlert({
//                 alertType: 'alert',
//                 errorMsg: 'Error in Attaching Device',
//                 errorCode: '',
//                 alertTitle: 'Attach Device'
//             }))
//         }
//         yield put(actionCreators.stopStorageLoader());
//     }
// }

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
            errorCode: `Description:${response.data.result.description}, Error Code:${response.data.result.code}`,
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
    yield fetchArray();
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
  }
}

// function* detachDisk(action) {
//     try {
//         yield put(actionCreators.startStorageLoader('Detaching Device'));
//         const response = yield call([axios, axios.post], '/api/v1.0/detach_device/', {
//             name: action.payload.name
//         }, {
//             headers: {
//                 Accept: 'application/json',
//                 'Content-Type': 'application/json',
//                 'x-access-token': localStorage.getItem('token'),
//             }
//         });
//         if (response.status === 200 && response.data.return !== -1) {
//             yield put(actionCreators.showStorageAlert({
//                 errorMsg: 'Device Detached successfully',
//                 alertTitle: 'Detach Device',
//                 alertType: 'info',
//                 errorCode: '',
//             }));
//         } else {
//             yield put(actionCreators.showStorageAlert({
//                 alertType: 'alert',
//                 errorMsg: 'Error while Detaching Device',
//                 errorCode: response.data && response.data.result ?
//                     response.data.result :
//                     'Device Detaching failed',
//                 alertTitle: 'Device Detach'
//             }));
//         }
//         yield fetchArray();
//     } catch (e) {
//         yield put(actionCreators.showStorageAlert({
//             alertType: 'alert',
//             errorMsg: 'Error in Detaching Device',
//             errorCode: '',
//             alertTitle: 'Detach Device'
//         }))
//     } finally {
//         if (yield cancelled()) {
//             yield put(actionCreators.showStorageAlert({
//                 alertType: 'alert',
//                 errorMsg: 'Error in Detaching Device',
//                 errorCode: '',
//                 alertTitle: 'Detach Device'
//             }))
//         }
//         yield put(actionCreators.stopStorageLoader());
//     }
// }

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
            errorCode: `Description:${response.data.result.description}, Error Code:${response.data.result.code}`,
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
    yield fetchArray();
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
  }
}

function* changeVolumeMountStatus(action) {
  let message = "Mount";
  try {
    const arrayName = yield select(arrayname)
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
            errorCode: `Description:${response.data.result.status.description}, Error Code:${response.data.result.status.code}`,
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
    yield fetchVolumeDetails({ payload: action.payload.url });
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
            errorCode: `Description:${response.data.result.status.description}, Error Code:${response.data.result.status.code}`,
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
    yield fetchArraySize();
    yield fetchArray();
    yield put(actionCreators.stopStorageLoader());
  }
}

function* mountPOS() {
  const message = "Mount";
  try {
    let response = {};
      yield put(actionCreators.startStorageLoader("Mounting Array"));
      response = yield call([axios, axios.post], "/api/v1/array/mount", {
        array: yield select(arrayname),
      },{
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
            errorCode: `Description:${response.data.result.status.description}, Error Code:${response.data.result.status.code}`,
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
    yield fetchVolumes({payload: {array: yield select(arrayname)}});
    yield fetchArray();
    yield fetchArraySize();
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
            errorCode: `Description:${response.data.result.status.description}, Error Code:${response.data.result.status.code}`,
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
          errorCode: `Description: UI or Agent Error, Error Code:${response.status}`,
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
  yield takeEvery(actionTypes.SAGA_SAVE_VOLUME, createVolume);
  yield takeEvery(actionTypes.SAGA_FETCH_ARRAY_SIZE, fetchArraySize);
  yield takeEvery(actionTypes.SAGA_FETCH_ARRAY, fetchArray);
  yield takeEvery(actionTypes.SAGA_FETCH_CONFIG, fetchConfig);
  yield takeEvery(actionTypes.SAGA_DELETE_ARRAY, deleteArray);
  yield takeEvery(actionTypes.SAGA_FETCH_VOLUMES, fetchVolumes);
  yield takeEvery(actionTypes.SAGA_DELETE_VOLUMES, deleteVolumes);
  yield takeEvery(actionTypes.SAGA_CREATE_ARRAY, createArray);
  yield takeEvery(actionTypes.SAGA_FETCH_DEVICE_DETAILS, fetchDeviceDetails);
  yield takeEvery(actionTypes.SAGA_UPDATE_VOLUME, updateVolume);
  // yield takeEvery(actionTypes.SAGA_ATTACH_DISK, attachDisk);
  // yield takeEvery(actionTypes.SAGA_DETACH_DISK, detachDisk);
  yield takeEvery(actionTypes.SAGA_ADD_SPARE_DISK, addSpareDisk);
  yield takeEvery(actionTypes.SAGA_REMOVE_SPARE_DISK, removeSpareDisk);
  yield takeEvery(actionTypes.SAGA_FETCH_MAX_VOLUME_COUNT, fetchMaxVolumeCount);
  yield takeEvery(
    actionTypes.SAGA_VOLUME_MOUNT_CHANGE,
    changeVolumeMountStatus
  );
  yield takeEvery(actionTypes.SAGA_UNMOUNT_POS, unmountPOS);
  yield takeEvery(actionTypes.SAGA_MOUNT_POS, mountPOS);
}
