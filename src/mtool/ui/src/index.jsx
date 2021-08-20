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

import {Provider} from 'react-redux'
import {createStore,combineReducers,applyMiddleware,compose} from 'redux'
import createSagaMiddleware from 'redux-saga'
import {BrowserRouter} from 'react-router-dom';
import 'react-app-polyfill/ie9';
import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import 'core-js/es/array';
import 'core-js/es/object';
import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import 'core-js/es/array/find';
import 'core-js/es/array/includes';
import 'core-js/es/number/is-nan';
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n";
import App from './App';
import './index.css';
import log from './utils/log/log';
import * as serviceWorker from './serviceWorker';
import headerReducer from "./store/reducers/headerReducer";
import storageReducer from "./store/reducers/storageReducer";
import dashboardReducer from "./store/reducers/dashboardReducer";
import headerLanguageReducer from "./store/reducers/headerLanguageReducer";
import configurationsettingReducer from "./store/reducers/configurationsettingReducer";
import logManagementReducer from "./store/reducers/logManagementReducer";
import alertManagementReducer from "./store/reducers/alertManagementReducer";
import performanceReducer from "./store/reducers/performanceReducer";
import authenticationReducer from "./store/reducers/authenticationReducer";
import BMCAuthenticationReducer from "./store/reducers/BMCAuthenticationReducer";
import userManagementReducer from "./store/reducers/userManagementReducer";
import hardwareOverviewReducer from "./store/reducers/hardwareOverviewReducer";
import hardwareSensorReducer from "./store/reducers/hardwareSensorReducer";
import hardwareHealthReducer from "./store/reducers/hardwareHealthReducer";
import hardwarePowerManagementReducer from "./store/reducers/hardwarePowerManagementReducer";
import waitLoaderReducer from "./store/reducers/waitLoaderReducer"
import rootSaga from "./sagas/indexSaga";

// Add a request interceptor
axios.interceptors.request.use((config) => {
    log.info(`Request: ${config.method} ${config.url}`);
    return config;
  }, (error) => {
    log.error(`Request: ${error.request.config.method} ${error.request.config.url} ${error.request.status}`);
    return Promise.reject(error);
  });

// Add a response interceptor
axios.interceptors.response.use((response) => {
    // Any status code that lie within the range of 2xx cause this function to trigger
    log.info(`Response: ${response.config.method} ${response.config.url} ${response.status}`);
    return response;
  }, (error) => {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    log.error(`Response: ${error.response.config.method} ${error.response.config.url} ${error.response.status}`);
    return Promise.reject(error);
  });


const sagaMiddleware = createSagaMiddleware();
// Start-For Debugging Purpose Only
// const logger = store => next => action => {
//     console.log("Dispatching...",action);
//     const result = next(action);
//     console.log("Middleware next state",store.getState());
//     return result;
// }
// End
const rootReducers = combineReducers({
    dashboardReducer,
    headerReducer,
    headerLanguageReducer,
    configurationsettingReducer,
    alertManagementReducer,
    storageReducer,
    performanceReducer,
    authenticationReducer,
    userManagementReducer,
    logManagementReducer,
    hardwareOverviewReducer,
    hardwareSensorReducer,
    hardwareHealthReducer,
    hardwarePowerManagementReducer,
    waitLoaderReducer,
    BMCAuthenticationReducer
});
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(rootReducers,composeEnhancers(applyMiddleware(sagaMiddleware)))
sagaMiddleware.run(rootSaga);
ReactDOM.render(
<I18nextProvider i18n={i18n}>
    <Provider store={store}>
    <BrowserRouter><App /></BrowserRouter>
    </Provider>
</I18nextProvider>
, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
