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

import React from "react";
import {
    render,
    fireEvent,
    cleanup,
    waitForElement,
    wait
} from "@testing-library/react";
import { Provider } from "react-redux";
import { act } from "react-dom/test-utils";
import { I18nextProvider } from "react-i18next";
import axios from "axios";
import "@testing-library/jest-dom/extend-expect";
import MockAdapter from "axios-mock-adapter";
import { createMemoryHistory } from "history";
import { Router, MemoryRouter } from "react-router-dom";
import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import createSagaMiddleware from "redux-saga";
import rootSaga from "../../../sagas/indexSaga";
import subsystemReducer from "../../../store/reducers/subsystemReducer";
import waitLoaderReducer from "../../../store/reducers/waitLoaderReducer";
import PrivateRoute from "../../../components/PrivateRoute";
import Subsystem from "./index";
import i18n from "../../../i18n";

jest.unmock("axios");

describe("SubsystemOperations", () => {
    let wrapper;
    let history;
    let store;
    // let mock;
    beforeEach(() => {
        const sagaMiddleware = createSagaMiddleware();
        const rootReducers = combineReducers({
            waitLoaderReducer,
            subsystemReducer
        });
        const composeEnhancers =
            window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
        store = createStore(
            rootReducers,
            composeEnhancers(applyMiddleware(sagaMiddleware))
        );
        sagaMiddleware.run(rootSaga);
        const route = "/operations/subsystem";
        history = createMemoryHistory({ initialEntries: [route] });
    });

    const renderComponent = () => {
        wrapper = render(
            <Router history={history}>
                <I18nextProvider i18n={i18n}>
                    <Provider store={store}>
                        {" "}
                        <PrivateRoute>
                            <Subsystem />
                        </PrivateRoute>
                    </Provider>
                </I18nextProvider>
            </Router>
        );
    };

    const subsystemResponse = {
        "rid": "d8d8f296-9026-41a4-8777-03fbe93b194c",
        "lastSuccessTime": 1642155815,
        "result": {
            "status": {
                "module": "COMMON",
                "code": 0,
                "level": "INFO",
                "description": "Success",
                "posDescription": "list of existing subsystems"
            },
            "data": {
                "subsystemlist": [{
                    "allow_any_host": 1,
                    "hosts": [],
                    "listen_addresses": [],
                    "nqn": "nqn.2014-08.org.nvmexpress.discovery",
                    "subtype": "Discovery"
                }, {
                    "allow_any_host": 1,
                    "hosts": [],
                    "listen_addresses": [{
                        "address_family": "IPv4",
                        "target_address": "107.108.221.146",
                        "transport_service_id": "1158",
                        "transport_type": "TCP"
                    }],
                    "max_namespaces": 256,
                    "model_number": "IBOF_VOLUME_EEEXTENSION",
                    "namespaces": [{
                        "bdev_name": "bdev_0_POSArray",
                        "nsid": 1,
                        "uuid": "bcccc634-71d9-46f2-8035-89621135b670"
                    }],
                    "nqn": "nqn.2019-04.pos:subsystem1",
                    "serial_number": "POS0000000003",
                    "subtype": "NVMe",
                    "array": "POSArray"
                }, {
                    "allow_any_host": 1,
                    "hosts": [],
                    "listen_addresses": [{
                        "address_family": "IPv4",
                        "target_address": "107.108.221.146",
                        "transport_service_id": "1158",
                        "transport_type": "TCP"
                    }],
                    "max_namespaces": 256,
                    "model_number": "IBOF_VOLUME_EEEXTENSION",
                    "namespaces": [],
                    "nqn": "nqn.2019-04.pos:subsystem2",
                    "serial_number": "POS0000000003",
                    "subtype": "NVMe"
                }, {
                    "allow_any_host": 1,
                    "hosts": [],
                    "listen_addresses": [],
                    "max_namespaces": 256,
                    "model_number": "IBOF_VOLUME_EEEXTENSION",
                    "namespaces": [],
                    "nqn": "nqn.2019-04.pos:subsystem10",
                    "serial_number": "POS0000000003",
                    "subtype": "NVMe"
                }, {
                    "allow_any_host": 1,
                    "hosts": [],
                    "listen_addresses": [],
                    "max_namespaces": 256,
                    "model_number": "IBOF_VOLUME_EEABXTENSION",
                    "namespaces": [],
                    "nqn": "nqn.2019-04.pos:subsystem_1",
                    "serial_number": "POS0000100003",
                    "subtype": "NVMe"
                }]

            }
        }, "info": { "version": "v0.10.6" }
    }

    afterEach(cleanup);

    it("should list the subsystems", async () => {
        const mock = new MockAdapter(axios);
        mock.onGet("/api/v1/subsystem/").reply(200,
            subsystemResponse
        );
        renderComponent();
        const { getByText } = wrapper;
        const nqnName = await waitForElement(() => getByText("nqn.2019-04.pos:subsystem2"));
        expect(nqnName).toBeDefined();
    });
});