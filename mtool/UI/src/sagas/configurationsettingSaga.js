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

DESCRIPTION: <Contains Generator Functions for Configuration container> *
@NAME : configurationsettingSaga.js
@AUTHORS: Palak Kapoor 
@Version : 1.0 *
@REVISION HISTORY
[08/22/2019] [Palak] : Prototyping..........////////////////////
*/

import axios from 'axios';
import { call, takeEvery, put } from 'redux-saga/effects';
import * as actionTypes from '../store/actions/actionTypes';
import * as actionCreators from '../store/actions/exportActionCreators';

export function* fetchEmailList() {
  try {
    const response = yield call([axios, axios.get], '/api/v1.0/get_email_ids/', {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'x-access-token': localStorage.getItem('token'),
      }
    });

    const result = response.data;
    const emailList = [];
    /* istanbul ignore else */
    if (result) {
      result.forEach(email => {
        emailList.push({
          ...email,
          selected: false,
          edit: false,
        });
      });
    }
    yield put(actionCreators.fetchEmailList(emailList));
  } catch (error) {
    ;
  }
}

export function* updateEmail(action) {
  try {
    const response = yield call(
      [axios, axios.post],
      '/api/v1.0/update_email/',
      action.payload, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'x-access-token': localStorage.getItem('token'),
      }
    }
    );
    const { status } = response;
     /* istanbul ignore else */
    if (status === 200) {
      yield fetchEmailList();
    }
  } catch (error) {
    //  console.log(error);
  }
}

export function* toggleActiveStatus(action) {
  try {
    yield call(
      [axios, axios.post],
      '/api/v1.0/toggle_email_status/',
      action.payload, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'x-access-token': localStorage.getItem('token'),
      }
    }
    );
    yield fetchEmailList();
  } catch (error) {
    yield fetchEmailList();
  }
}

export function* deleteEmailIds(action) {
  try {
    const response = yield call(
      [axios, axios.post],
      '/api/v1.0/delete_emailids/',
      action.payload, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'x-access-token': localStorage.getItem('token'),
      }
    }
    );
    const { status } = response;
     /* istanbul ignore else */
    if (status === 200) {
      const payload = {
        alertOpen: true,
        istypealert: true,
        alerttype: 'info',
        alerttitle: 'Delete Email',
        alertdescription: 'Email ID deleted successfully',
      };
      yield put(actionCreators.setAlertBox(payload));
      yield fetchEmailList();
    }
  } catch (error) {
    const payload = {
      alertOpen: true,
      istypealert: true,
      alerttype: 'alert',
      alerttitle: 'Delete Email',
      alertdescription: 'Error in deleting email id',
    };
    yield put(actionCreators.setAlertBox(payload));
  }
}

// export function* sendEmail(action) {
//   try {
//     const response = yield call(
//       [axios, axios.post],
//       '/api/v1.0/send_email/',
//       action.payload, {
//       headers: {
//         Accept: 'application/json',
//         'Content-Type': 'application/json',
//         'x-access-token': localStorage.getItem('token'),
//       }
//     }
//     );
//     const { status } = response;
//     document.getElementsByTagName('body')[0].style.cursor = 'default';

//     if (status === 200) {
//       const payload = {
//         alertOpen: true,
//         istypealert: true,
//         alerttype: 'info',
//         alerttitle: 'Send Email',
//         alertdescription: 'Email sent successfully',
//       };
//       yield put(actionCreators.setAlertBox(payload));
//     }
//   } catch (error) {
//     document.getElementsByTagName('body')[0].style.cursor = 'default';
//     const payload = {
//       alertOpen: true,
//       istypealert: true,
//       alerttype: 'alert',
//       alerttitle: 'Send Email',
//       alertdescription: 'Email sending failed',
//     };
//     yield put(actionCreators.setAlertBox(payload));
//   }
// }

export function* testEmail(action) {
  try {
    const response = yield call(
      [axios, axios.post],
      '/api/v1.0/test_smtpserver/',
      action.payload, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'x-access-token': localStorage.getItem('token'),
      }
    }
    );
    const { status } = response;
    document.getElementsByTagName('body')[0].style.cursor = 'default';
     /* istanbul ignore else */
    if (status === 200) {
      yield put(actionCreators.changeSmtpServer());
      const payload = {
        alertOpen: true,
        istypealert: true,
        alerttype: 'info',
        alerttitle: 'Test SMTP Server',
        alertdescription: 'SMTP server is working',
      };
      yield put(actionCreators.setAlertBox(payload));
    }
  } catch (error) {
    document.getElementsByTagName('body')[0].style.cursor = 'default';
    const payload = {
      alertOpen: true,
      istypealert: true,
      alerttype: 'alert',
      alerttitle: 'Test SMTP Server',
      alertdescription: 'SMTP server is not working',
    };
    yield put(actionCreators.setAlertBox(payload));
  }
}

function* downloadLogs(action) {
  try {
    const response = yield call(
      [axios, axios.get],
      '/api/v1.0/download_logs', {
      headers: {
        'x-access-token': localStorage.getItem('token'),
      },
      params: action.payload,
      responseType: 'blob'
    }
    );
    const { status } = response;
    if (status === 200) {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'log.zip');
      // 3. Append to html page
      document.body.appendChild(link);
      // 4. Force download
      link.click();
      // 5. Clean up and remove the link
      link.parentNode.removeChild(link);
    }
  } catch (error) {
    ;
  }
}

export function* getIbofOSTimeInterval() {
  try {
    const response = yield call([axios, axios.get], '/api/v1.0/get_ibofos_time_interval', {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'x-access-token': localStorage.getItem('token'),
      }
    });

    const result = response.data;
      /* istanbul ignore else */
    if (result) {
      yield put(actionCreators.setIbofOSTimeInterval(result));
    }
    else yield put(actionCreators.setIbofOSTimeInterval(4)); // Default Value should be 4 seconds
  } catch (error) {
    ;
  }
}

export function* setIbofOSTimeInterval(action) {
  try {
    yield call(
      [axios, axios.post],
      '/api/v1.0/set_ibofos_time_interval',
      action.payload, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'x-access-token': localStorage.getItem('token'),
      }
    }
    );
    yield getIbofOSTimeInterval();
  } catch (error) {
    yield getIbofOSTimeInterval();
  }
}

export function* configurationsettingWatcher() {
  yield takeEvery(actionTypes.SAGA_FETCH_EMAIL_LIST, fetchEmailList);
  yield takeEvery(actionTypes.SAGA_UPDATE_EMAIL, updateEmail);
  yield takeEvery(actionTypes.SAGA_TOGGLE_ACTIVE_STATUS, toggleActiveStatus);
  // yield takeEvery(actionTypes.SAGA_SEND_EMAIL, sendEmail);
  yield takeEvery(actionTypes.SAGA_TEST_EMAIL, testEmail);
  yield takeEvery(actionTypes.SAGA_DELETE_EMAIL_IDS, deleteEmailIds);
  yield takeEvery(actionTypes.SAGA_DOWNLOAD_LOGS, downloadLogs);
  yield takeEvery(actionTypes.SAGA_GET_IBOFOS_TIME_INTERVAL, getIbofOSTimeInterval);
  yield takeEvery(actionTypes.SAGA_SET_IBOFOS_TIME_INTERVAL, setIbofOSTimeInterval)
}
