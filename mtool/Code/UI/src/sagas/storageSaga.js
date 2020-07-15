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

import axios from 'axios';
import { call, takeEvery, put, cancelled } from 'redux-saga/effects';
import * as actionTypes from "../store/actions/actionTypes";
import * as actionCreators from "../store/actions/exportActionCreators";


function* fetchArraySize() {
    try {
        const response = yield call([axios, axios.get], `/api/v1.0/available_storage/?ts=${Date.now()}`, {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': localStorage.getItem('token'),
            }
        });
        if (response.status === 200 && response.data) {
            yield put(actionCreators.fetchArraySize(response.data[0].arraySize));
        } else {
            yield put(actionCreators.fetchArraySize(0));
        }
    } catch (e) {
        yield put(actionCreators.fetchArraySize(0));
    } finally {
        if (yield cancelled()) {
            yield put(actionCreators.fetchArraySize(0));
        }
    }
}


function* fetchVolumeDetails(action) {
    try {
        const response = yield call([axios, axios.get], action.payload, {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': localStorage.getItem('token'),
            }
        });

        if (response.status === 200) {
            yield put(actionCreators.addVolumeDetails(response.data))
        }
    } catch(e) {
        // console.log(e)
    }
}

function* fetchVolumes() {
    try {
        yield put(actionCreators.clearVolumes())
        const response = yield call([axios, axios.get], '/redfish/v1/StorageServices/1/Volumes', {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': localStorage.getItem('token'),
            }
        });
        if (response.status === 200) {
            for(let i = 0; i < response.data.Members.length; i += 1) {
                yield fetchVolumeDetails({payload: response.data.Members[i]["@odata.id"]})
            }
            yield fetchArraySize();
        } else {
            yield put(actionCreators.fetchStorageVolumes({ volumes: [], totalVolSize: 0 }));
        }
    } catch (e) {
        yield put(actionCreators.fetchStorageVolumes({ volumes: [], totalVolSize: 0 }));
    } finally {
        if (yield cancelled()) {
            yield put(actionCreators.fetchStorageVolumes({ volumes: [], totalVolSize: 0 }));
        }
    }
}

function* fetchArray(action) {
    try {
        yield put(actionCreators.startStorageLoader('Fetching Devices'));
        const response = yield call([axios, axios.get], `/api/v1.0/get_arrays/?ts=${Date.now()}`, {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': localStorage.getItem('token'),
            }
        });
        if (response.status === 200 && response.data && response.data.length > 0) {
            yield put(actionCreators.fetchArray(response.data[0]));
            yield fetchArraySize();
        } else if (response.status === 401) {
            action.payload.push("/login");
        } else {
            yield put(actionCreators.setNoArray());
        }
    } catch (e) {
        yield put(actionCreators.setNoArray());
    } finally {
        if (yield cancelled()) {
            yield put(actionCreators.setNoArray());
        }
        yield put(actionCreators.stopStorageLoader());
        yield fetchVolumes();
    }
}


function* fetchDevices() {
    const defaultResponse = {
        devices: [],
        metadevices: []
    }
    const alertDetails = {
        errorMsg: 'Unable to get devices!',
        alertType: 'alert',
        alertTitle: 'Fetch Devices'
    };
    try {
        yield put(actionCreators.startStorageLoader('Fetching Devices'));
        const response = yield call([axios, axios.get], '/api/v1.0/get_devices/', {
            headers: {
                'x-access-token': localStorage.getItem('token'),
            }
        });
        const result = response.data;
        if (response.status === 200 && response.data.result && response.data.result.status.code !== 0) {
            yield put(actionCreators.showStorageAlert({
                alertType: 'alert',
                alertTitle: 'Fetch Devices',
                errorMsg: 'Unable to get devices!',
                errorCode: `Description: ${response.data.result && response.data.result.status ? `${response.data.result.status.description }, Error code:${ response.data.result.status.code}` : ''}`
            }))
        }
        else if (result && typeof (result) !== "string" && result.return !== -1) {
            yield put(actionCreators.fetchDevices(result));
        }

        else if (result.status === 401) {
            // console.log('401 status');
        } else {
            yield put(actionCreators.showStorageAlert(alertDetails))
            yield put(actionCreators.fetchDevices(defaultResponse));
        }
    } catch (error) {
        yield put(actionCreators.showStorageAlert(alertDetails));
        yield put(actionCreators.fetchDevices(defaultResponse));
    } finally {
        if (yield cancelled()) {
            yield put(actionCreators.showStorageAlert(alertDetails));
            yield put(actionCreators.fetchDevices(defaultResponse));
        }
        yield fetchArray();
        yield put(actionCreators.stopStorageLoader());
    }
}


function* createVolume(action) {
    try {
        // for multi-volume creation
        if (action.payload.count < 2)
            yield put(actionCreators.startStorageLoader('Creating Volume'));
        const response = yield call([axios, axios.post], '/api/v1.0/save-volume/', {
            ...action.payload
        }, {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': localStorage.getItem('token'),
            }
        });

        console.log("Volume Createddd!!!!!!!!!!!!!!!!", response, action.payload);
        if (action.payload.count > 1) {
            if (response.status === 200) {
                yield put(actionCreators.toggleCreateVolumeButton(true));
            }
            else {
                yield put(actionCreators.showStorageAlert({
                    alertType: 'alert',
                    alertTitle: 'Create Volume',
                    errorMsg: 'Volume(s) creation failed',
                    errorCode: ``
                }))
            }
        }
        // for single volume creation
        else if (response.status === 200) {
                console.log(response.data.result.status.code)
                if (response.data.result && response.data.result.status && (response.data.result.status.code === 2000 || response.data.result.status.code === 0)) {
                    console.log(" Create volume successfull");
                    yield put(actionCreators.showStorageAlert({
                        alertType: 'info',
                        alertTitle: 'Create Volume',
                        errorMsg: 'Volume(s) created successfully',
                        errorCode: '',
                    }));
                } else {
                    yield put(actionCreators.showStorageAlert({
                        alertType: 'alert',
                        alertTitle: 'Create Volume',
                        errorMsg: 'Volume(s) creation failed',
                        errorCode: `Description: ${response.data.result && response.data.result.status ? `${response.data.result.status.description }, Error code:${ response.data.result.status.code}` : ''}`
                    }))
                }
                yield fetchVolumes();
            } else {
                yield put(actionCreators.showStorageAlert({
                    alertType: 'alert',
                    alertTitle: 'Create Volume',
                    errorMsg: 'Volume(s) creation failed',
                    errorCode: `Message from server: ${response.data ? response.data.result : ''}`
                }))
            }

    } catch (error) {
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

function* updateVolume(action) {
    try {
        yield put(actionCreators.startStorageLoader('Updating Volume'));
        if (action.payload.maxiops < 0 || action.payload.maxbw < 0 ||
            (action.payload.maxiops > 0 && action.payload.maxiops < 10)) {
            yield put(actionCreators.showStorageAlert({
                alertType: 'alert',
                alertTitle: 'Update Volume',
                errorMsg: 'Please give valid values',
                errorCode: ''
            }));
            return;
        }
        const data = {
            maxiops: parseInt(action.payload.maxiops,10),
            maxbw: parseInt(action.payload.maxbw,10),
            name: action.payload.name
        }
        const response = yield call([axios, axios.put], '/api/v1.0/update-volume/', data, {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': localStorage.getItem('token'),
            }
        });
        if (response.status === 200) {
            if (response.data.result && response.data.result.status && (response.data.result.status.code === 2000 || response.data.result.status.code === 0)) {
                yield put(actionCreators.showStorageAlert({
                    alertType: 'info',
                    alertTitle: 'Update Volume',
                    errorMsg: 'Volume Updated successfully',
                    errorCode: '',
                }));
            } else {
                yield put(actionCreators.showStorageAlert({
                    alertType: 'alert',
                    alertTitle: 'Update Volume',
                    errorMsg: 'Volume Updation failed',
                    errorCode: `Description: ${response.data.result && response.data.result.status ? `${response.data.result.status.description }, Error code:${ response.data.result.status.code}` : ''}`

                }))
            }
            yield fetchVolumes();
        } else {
            yield put(actionCreators.showStorageAlert({
                alertType: 'alert',
                alertTitle: 'Update Volume',
                errorMsg: 'Volume Updation failed',
                errorCode: `Message from server: ${response.data ? response.data.result : ''}`
            }))
        }
    } catch (error) {
        yield put(actionCreators.showStorageAlert({
            alertType: 'alert',
            alertTitle: 'Update Volume',
            errorMsg: 'Volume Updation failed',
            errorCode: ``
        }))
    } finally {
        if (yield cancelled()) {
            yield put(actionCreators.showStorageAlert({
                alertType: 'alert',
                alertTitle: 'Update Volume',
                errorMsg: 'Volume Updation failed',
                errorCode: ``
            }))
        }
        yield put(actionCreators.stopStorageLoader());
    }
}

function* fetchMaxVolumeCount() {
    try {
        const response = yield call([axios, axios.get], `/api/v1.0/max_volume_count/?ts=${Date.now()}`, {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': localStorage.getItem('token'),
            }
        });
        if (response.status === 200 && response.data) {
            yield put(actionCreators.fetchMaxVolumeCount(response.data));
        }
    }
    catch (e) {
        yield put(actionCreators.fetchMaxVolumeCount(256));
    } finally {
        if (yield cancelled()) {
            yield put(actionCreators.fetchMaxVolumeCount(256));
        }
    }
}


function* deleteArray(action) {
    try {
        yield put(actionCreators.startStorageLoader('Deleting Array'));
        const response = yield call([axios, axios.post], '/api/v1.0/delete_array/', {
            ...action.payload
        }, {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': localStorage.getItem('token'),
            }
        });
        if (response.status === 200 && response.data && response.data.return !== -1) {
            yield put(actionCreators.showStorageAlert({
                alertType: 'info',
                alertTitle: 'Delete Array',
                errorMsg: 'Array deleted successfully',
                errorCode: '',
            }))
        } else {
            yield put(actionCreators.showStorageAlert({
                errorMsg: 'Array deletion failed',
                alertType: 'alert',
                alertTitle: 'Delete Array',
                errorCode: `Message from server: ${response.data.result}`
            }));
        }
        yield fetchArray();
    } catch (e) {
        yield put(actionCreators.showStorageAlert({
            errorMsg: 'Array deletion failed',
            alertType: 'alert',
            alertTitle: 'Delete Array',
            errorCode: ''
        }));
    } finally {
        if (yield cancelled()) {
            yield put(actionCreators.showStorageAlert({
                errorMsg: 'Array deletion failed',
                alertType: 'alert',
                alertTitle: 'Delete Array',
                errorCode: ``
            }));
        }
        yield put(actionCreators.stopStorageLoader());
    }
}


function* deleteVolumes(action) {
    try {
        yield put(actionCreators.startStorageLoader('Deleting Volume(s)'));
        const response = yield call([axios, axios.post], '/api/v1.0/delete_volumes', action.payload, {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': localStorage.getItem('token'),
            }
        });
        if (response.status === 200 && response.data) {
            if (response.data.return !== -1) {
                yield put(actionCreators.showStorageAlert({
                    alertType: 'info',
                    alertTitle: 'Delete Volume',
                    errorMsg: 'Volume(s) deleted successfully',
                    errorCode: '',
                }));
            }
            else {
                yield put(actionCreators.showStorageAlert({
                    errorMsg: `Deletion failed for volume :  ${ response.data.vol_name}`,
                    alertType: 'alert',
                    alertTitle: 'Delete Volume',
                    errorCode: `Description:${`${response.data.result.description }, Error Code:${ response.data.result.code}`}`,
                }));
            }
        } else {
            yield put(actionCreators.showStorageAlert({
                errorMsg: 'Volume deletion failed',
                alertType: 'alert',
                alertTitle: 'Delete Volume',
                errorCode: `Message from server:${response.data.result}`,
            }));
        }
        yield fetchVolumes();
    } catch (e) {
        yield put(actionCreators.showStorageAlert({
            errorMsg: 'Volume deletion failed',
            alertType: 'alert',
            alertTitle: 'Delete Volume',
            errorCode: ''
        }));
    } finally {
        if (yield cancelled()) {
            yield put(actionCreators.showStorageAlert({
                errorMsg: 'Volume deletion failed',
                alertType: 'alert',
                alertTitle: 'Delete Volume',
                errorCode: ''
            }));
        }
        yield put(actionCreators.stopStorageLoader());
    }

}

function* createArray(action) {
    try {
        yield put(actionCreators.startStorageLoader('Creating Array'));
        const response = yield call([axios, axios.post], '/api/v1.0/create_arrays/', {
            ...action.payload
        }, {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': localStorage.getItem('token'),
            }
        });
        if (response.status === 200) {
            if (response.data.return !== -1 && response.data.result.status.code === 0 ) {
                yield put(actionCreators.showStorageAlert({
                    errorMsg: 'Array created successfully',
                    alertTitle: 'Create Array',
                    alertType: 'info',
                    errorCode: '',
                }));
            }
            else {
                yield put(actionCreators.showStorageAlert({
                    alertType: 'alert',
                    errorMsg: 'Error in Array Creation',
                    errorCode: `Description:${ response.data.result.status.description }, Error Code: ${ response.data.result.status.code}`,
                    alertTitle: 'Create Array'
                }));
            }

        } else {
            yield put(actionCreators.showStorageAlert({
                alertType: 'alert',
                errorMsg: 'Error in Array Creation',
                errorCode: response.data && response.data.result ?
                    response.data.result :
                    'Array Creation failed',
                alertTitle: 'Create Array'
            }));
        }
        yield fetchArray();
        yield fetchMaxVolumeCount();
    } catch (e) {
        yield put(actionCreators.showStorageAlert({
            alertType: 'alert',
            errorMsg: 'Error in Array Creation',
            errorCode: '',
            alertTitle: 'Create Array'
        }))
    } finally {
        if (yield cancelled()) {
            yield put(actionCreators.showStorageAlert({
                alertType: 'alert',
                errorMsg: 'Error in Array Creation',
                errorCode: '',
                alertTitle: 'Create Array'
            }))
        }
        yield put(actionCreators.stopStorageLoader());
    }
}

function* attachDisk(action) {
    try {
        yield put(actionCreators.startStorageLoader('Attaching Device'));
        const response = yield call([axios, axios.post], '/api/v1.0/attach_device/', {
            name: action.payload.name
        }, {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': localStorage.getItem('token'),
            }
        });
        if (response.status === 200 && response.data.return !== -1) {
            yield put(actionCreators.showStorageAlert({
                errorMsg: 'Device Attached successfully',
                alertTitle: 'Attach Device',
                alertType: 'info',
                errorCode: '',
            }));
        } else {
            yield put(actionCreators.showStorageAlert({
                alertType: 'alert',
                errorMsg: 'Error while Attaching Device',
                errorCode: response.data && response.data.result ?
                    response.data.result :
                    'Device Attaching failed',
                alertTitle: 'Device Attach'
            }));
        }
        yield fetchArray();
    } catch (e) {
        yield put(actionCreators.showStorageAlert({
            alertType: 'alert',
            errorMsg: 'Error in Attaching Device',
            errorCode: '',
            alertTitle: 'Attach Device'
        }))
    } finally {
        if (yield cancelled()) {
            yield put(actionCreators.showStorageAlert({
                alertType: 'alert',
                errorMsg: 'Error in Attaching Device',
                errorCode: '',
                alertTitle: 'Attach Device'
            }))
        }
        yield put(actionCreators.stopStorageLoader());
    }
}

function* addSpareDisk(action) {
    try {
        yield put(actionCreators.startStorageLoader('Adding Spare Device'));
        const response = yield call([axios, axios.post], '/api/v1.0/add_spare_device/', {
            name: action.payload.name
        }, {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': localStorage.getItem('token'),
            }
        });
        if (response.status === 200) {
            if (response.data.return !== -1) {
                yield put(actionCreators.showStorageAlert({
                    errorMsg: 'Spare Device Added successfully',
                    alertTitle: 'Add Spare Device',
                    alertType: 'info',
                    errorCode: '',
                }));
            }
            else {
                yield put(actionCreators.showStorageAlert({
                    alertType: 'alert',
                    errorMsg: 'Error while Adding Spare Device',
                    errorCode: `Description:${ response.data.result.description }, Error Code:${ response.data.result.code}`,
                    alertTitle: 'Add Spare Device'
                }));
            }
        } else {
            yield put(actionCreators.showStorageAlert({
                alertType: 'alert',
                errorMsg: 'Error while Adding Spare Device',
                errorCode: response.data && response.data.result ?
                    response.data.result :
                    'Adding Spare Device Failed',
                alertTitle: 'Add Spare Device'
            }));
        }
        yield fetchArray();
    } catch (e) {
        yield put(actionCreators.showStorageAlert({
            alertType: 'alert',
            errorMsg: 'Error while Adding Spare Device',
            errorCode: '',
            alertTitle: 'Add Spare Device'
        }))
    } finally {
        if (yield cancelled()) {
            yield put(actionCreators.showStorageAlert({
                alertType: 'alert',
                errorMsg: 'Error while Adding Spare Device',
                errorCode: '',
                alertTitle: 'Add Spare Device'
            }))
        }
        yield put(actionCreators.stopStorageLoader());
    }
}


function* detachDisk(action) {
    try {
        yield put(actionCreators.startStorageLoader('Detaching Device'));
        const response = yield call([axios, axios.post], '/api/v1.0/detach_device/', {
            name: action.payload.name
        }, {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': localStorage.getItem('token'),
            }
        });
        if (response.status === 200 && response.data.return !== -1) {
            yield put(actionCreators.showStorageAlert({
                errorMsg: 'Device Detached successfully',
                alertTitle: 'Detach Device',
                alertType: 'info',
                errorCode: '',
            }));
        } else {
            yield put(actionCreators.showStorageAlert({
                alertType: 'alert',
                errorMsg: 'Error while Detaching Device',
                errorCode: response.data && response.data.result ?
                    response.data.result :
                    'Device Detaching failed',
                alertTitle: 'Device Detach'
            }));
        }
        yield fetchArray();
    } catch (e) {
        yield put(actionCreators.showStorageAlert({
            alertType: 'alert',
            errorMsg: 'Error in Detaching Device',
            errorCode: '',
            alertTitle: 'Detach Device'
        }))
    } finally {
        if (yield cancelled()) {
            yield put(actionCreators.showStorageAlert({
                alertType: 'alert',
                errorMsg: 'Error in Detaching Device',
                errorCode: '',
                alertTitle: 'Detach Device'
            }))
        }
        yield put(actionCreators.stopStorageLoader());
    }
}


function* removeSpareDisk(action) {
    try {
        yield put(actionCreators.startStorageLoader('Removing Spare Device'));
        const response = yield call([axios, axios.post], '/api/v1.0/remove_spare_device/', {
            name: action.payload.name
        }, {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': localStorage.getItem('token'),
            }
        });
        if (response.status === 200) {
            if (response.data.return !== -1) {
                yield put(actionCreators.showStorageAlert({
                    errorMsg: 'Spare Device Removed successfully',
                    alertTitle: 'Remove Spare Device',
                    alertType: 'info',
                    errorCode: '',
                }));
            }
            else {
                yield put(actionCreators.showStorageAlert({
                    alertType: 'alert',
                    errorMsg: 'Error while Removing Spare Device',
                    errorCode: `Description:${ response.data.result.description }, Error Code:${ response.data.result.code}`,
                    alertTitle: 'Remove Spare Device'
                }));
            }
        } else {
            yield put(actionCreators.showStorageAlert({
                alertType: 'alert',
                errorMsg: 'Error while Removing Spare Device',
                errorCode: response.data && response.data.result ?
                    response.data.result :
                    'Removing Spare Device failed',
                alertTitle: 'Remove Spare Device'
            }));
        }
        yield fetchArray();
    } catch (e) {
        yield put(actionCreators.showStorageAlert({
            alertType: 'alert',
            errorMsg: 'Error while Removing Spare Device',
            errorCode: '',
            alertTitle: 'Remove Spare Device'
        }))
    } finally {
        if (yield cancelled()) {
            yield put(actionCreators.showStorageAlert({
                alertType: 'alert',
                errorMsg: 'Error while Removing Spare Device',
                errorCode: '',
                alertTitle: 'Remove Spare Device'
            }))
        }
        yield put(actionCreators.stopStorageLoader());
    }
}



function* fetchDeviceDetails(action) {
    const defaultDiskDetails = {
        DevicePath: 'NA',
        SerialNumber: 'NA',
        ModelNumber: 'NA',
        PhysicalSize: 'NA',
        UsedBytes: 'NA',
        Firmware: 'NA',
        critical_warning: 'NA',
        temperature: 'NA',
        avail_spare: 'NA',
        spare_thresh: 'NA',
        precent_used: 'NA',
        data_units_read: 'NA',
        data_units_written: 'NA',
        critical_comp_time: 'NA',
        warning_temp_time: 'NA',
        percent_used: 'NA',
    }
    try {
        const response = yield call([axios, axios.post], '/api/v1.0/get_device_details/', action.payload, {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': localStorage.getItem('token'),
            }
        });
        if (response.status === 200 && response.data) {
            yield put(actionCreators.fetchDeviceDetails({
                ...response.data.Device,
                ...response.data.smartStatus
            }));
        } else {
            yield put(actionCreators.fetchDeviceDetails(defaultDiskDetails));
        }
    } catch (e) {
        yield put(actionCreators.fetchDeviceDetails(defaultDiskDetails));
    }


}

export default function* storageWatcher() {
    yield takeEvery(actionTypes.SAGA_FETCH_DEVICE_INFO, fetchDevices);
    yield takeEvery(actionTypes.SAGA_SAVE_VOLUME, createVolume);
    yield takeEvery(actionTypes.SAGA_FETCH_ARRAY_SIZE, fetchArraySize);
    yield takeEvery(actionTypes.SAGA_FETCH_ARRAY, fetchArray);
    yield takeEvery(actionTypes.SAGA_DELETE_ARRAY, deleteArray);
    yield takeEvery(actionTypes.SAGA_FETCH_VOLUMES, fetchVolumes);
    yield takeEvery(actionTypes.SAGA_DELETE_VOLUMES, deleteVolumes);
    yield takeEvery(actionTypes.SAGA_CREATE_ARRAY, createArray);
    yield takeEvery(actionTypes.SAGA_FETCH_DEVICE_DETAILS, fetchDeviceDetails);
    yield takeEvery(actionTypes.SAGA_UPDATE_VOLUME, updateVolume);
    yield takeEvery(actionTypes.SAGA_ATTACH_DISK, attachDisk);
    yield takeEvery(actionTypes.SAGA_DETACH_DISK, detachDisk);
    yield takeEvery(actionTypes.SAGA_ADD_SPARE_DISK, addSpareDisk);
    yield takeEvery(actionTypes.SAGA_REMOVE_SPARE_DISK, removeSpareDisk);
    yield takeEvery(actionTypes.SAGA_FETCH_MAX_VOLUME_COUNT, fetchMaxVolumeCount);
}
