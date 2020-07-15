import axios from 'axios';
import { call, takeEvery, put } from 'redux-saga/effects';
import * as actionTypes from '../store/actions/actionTypes';
import * as actionCreators from '../store/actions/exportActionCreators';



export function* login(action) {
  try {
    localStorage.setItem('BMC_LoggedIn', false); // Set bmc_isLoggedIn false once the user logs in again
    const response = yield call(
      [axios, axios.post],
      '/api/v1.0/login/',
      action.payload
    );  
    if (response.data) {
        localStorage.setItem('isLoggedIn', true);
        localStorage.setItem('userid', response.data.username);
        localStorage.setItem('token', response.data.token);
        yield put(actionCreators.setIsLoggedIn());
        action.history.push('/dashboard');
      }
    } catch (error) {
        yield put(actionCreators.setLoginFailed());
        localStorage.setItem('isLoggedIn', false);
        localStorage.setItem('BMC_LoggedIn', false);
  }
}


export function* authenticationWatcher() {
  yield takeEvery(actionTypes.SAGA_LOGIN, login);
  
}
