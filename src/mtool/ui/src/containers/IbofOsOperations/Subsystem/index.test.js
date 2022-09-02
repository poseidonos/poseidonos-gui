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
import { addListener } from "../../../sagas/subsystemSaga";

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
                    "allowAnyHost": 1,
                    "hosts": [],
                    "listen_addresses": [],
                    "subnqn": "nqn.2014-08.org.nvmexpress.discovery",
                    "subtype": "Discovery"
                }, {
                    "allowAnyHost": 1,
                    "hosts": [],
                    "listen_addresses": [{
                        "address_family": "IPv4",
                        "target_address": "107.108.221.146",
                        "transport_service_id": "1158",
                        "transport_type": "TCP"
                    }],
                    "maxNamespaces": 256,
                    "modelNumber": "IBOF_VOLUME_EEEXTENSION",
                    "namespaces": [{
                        "bdevName": "bdev_0_POSArray",
                        "nsid": 1,
                        "uuid": "bcccc634-71d9-46f2-8035-89621135b670"
                    }],
                    "subnqn": "nqn.2019-04.pos:subsystem1",
                    "serialNumber": "POS0000000003",
                    "subtype": "NVMe",
                    "array": "POSArray"
                }, {
                    "allowAnyHost": 1,
                    "hosts": [],
                    "listen_addresses": [{
                        "address_family": "IPv4",
                        "target_address": "107.108.221.146",
                        "transport_service_id": "1158",
                        "transport_type": "TCP"
                    }],
                    "maxNamespaces": 256,
                    "modelNumber": "IBOF_VOLUME_EEEXTENSION",
                    "namespaces": [],
                    "subnqn": "nqn.2019-04.pos:subsystem2",
                    "serialNumber": "POS0000000003",
                    "subtype": "NVMe"
                }, {
                    "allowAnyHost": 1,
                    "hosts": [],
                    "listen_addresses": [],
                    "maxNamespaces": 256,
                    "modelNumber": "IBOF_VOLUME_EEEXTENSION",
                    "namespaces": [],
                    "subnqn": "nqn.2019-04.pos:subsystem10",
                    "serialNumber": "POS0000000003",
                    "subtype": "NVMe"
                }, {
                    "allowAnyHost": 1,
                    "hosts": [],
                    "listen_addresses": [],
                    "maxNamespaces": 256,
                    "modelNumber": "IBOF_VOLUME_EEABXTENSION",
                    "namespaces": [],
                    "subnqn": "nqn.2019-04.pos:subsystem_1",
                    "serialNumber": "POS0000100003",
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

    it("should display subsystem details", async () => {
        const mock = new MockAdapter(axios);
        mock.onGet("/api/v1/subsystem/").reply(200,
            subsystemResponse
        );
        renderComponent();
        const { getByText } = wrapper;
        const nqnName = await waitForElement(() => getByText("nqn.2019-04.pos:subsystem2"));
        expect(nqnName).toBeDefined();
    });

    it("should create the subsystem",
        async () => {
            const mock = new MockAdapter(axios);
            mock.onGet("/api/v1/subsystem/")
                .reply(200,
                    subsystemResponse
                )
                .onPost("/api/v1/subsystem/")
                .reply(200,
                    {
                        "rid": "4dd7f4da-825f-4377-8ca4-a74374bb7759",
                        "lastSuccessTime": 1642352844,
                        "result": {
                            "status": {
                                "module": "",
                                "code": 0,
                                "description": "",
                                "posDescription": "Success"
                            }
                        },
                        "info": {
                            "version": "v0.10.6"
                        }
                    }
                ).onAny(200);
            const getSpy = jest.spyOn(axios, "post");
            jest.setTimeout(30000);
            renderComponent();
            const { asFragment, getByText, getByTestId, getByTitle } = wrapper;
            const addBtn = await waitForElement(() => getByTitle("Add a Subsystem"));
            expect(addBtn).toBeDefined();
            fireEvent.click(addBtn);
            const nameField = await waitForElement(() => getByTestId("subsystemName"));
            fireEvent.change(nameField, { target: { value: "nqn123" } });
            const snField = await waitForElement(() => getByTestId("subsystemSN"));
            fireEvent.change(snField, { target: { value: "POS00000" } });
            const mnField = await waitForElement(() => getByTestId("subsystemMN"));
            fireEvent.change(mnField, { target: { value: "ABCD" } });
            const maxnsField = await waitForElement(() => getByTestId("subsystemMaxNS"));
            fireEvent.change(maxnsField, { target: { value: 256 } });
            const allowHostField = await waitForElement(() => getByTestId("allowAnyHost"));
            fireEvent.change(allowHostField, { target: { value: true } });
            const subsystemCreateBtn = await waitForElement(() => getByTestId("subsystemCreate"));
            fireEvent.click(subsystemCreateBtn);
            const successResponse = await waitForElement(() => getByText(/Subsystem Created Successfully/));
            expect(successResponse).toBeDefined();
        });

    it("should show the listeners of a subsystem",
        async () => {
            const mock = new MockAdapter(axios);
            mock.onGet("/api/v1/subsystem/")
                .reply(200,
                    subsystemResponse
                )
            renderComponent();
            const { findAllByTitle, getByText } = wrapper;
            const detailBtns = await findAllByTitle("Show Subsystem Details");
            fireEvent.click(detailBtns[1]);
            const ipAddress = getByText("107.108.221.146");
            expect(ipAddress).toBeDefined();
        });

    it("should add a listener to a subsystem",
        async () => {
            const mock = new MockAdapter(axios);
            mock.onGet("/api/v1/subsystem/")
                .reply(200,
                    subsystemResponse
                ).onPost("/api/v1/listener/")
                .reply(200, {
                    "rid": "4dd7f4da-825f-4377-8ca4-a74374bb7759",
                    "lastSuccessTime": 1642352844,
                    "result": {
                        "status": {
                            "module": "",
                            "code": 0,
                            "description": "",
                            "posDescription": "Success"
                        }
                    },
                    "info": {
                        "version": "v0.10.6"
                    }
                }).onAny(200);
            renderComponent();
            const { findAllByTitle, getByTestId, getByTitle, getByText } = wrapper;
            const detailBtns = await findAllByTitle("Show Subsystem Details");
            fireEvent.click(detailBtns[1]);
            const ipAddress = getByText("107.108.221.146");
            expect(ipAddress).toBeDefined();
            const addListenerBtn = getByTitle("Add a Listener");
            fireEvent.click(addListenerBtn);
            const addListenerIP = getByTestId("addListenerIP");
            fireEvent.change(addListenerIP, { target: { value: "1234" } });
            const addListenerSubmit = getByTestId("addListenerSubmit");
            fireEvent.click(addListenerSubmit);
            expect(getByText(/Please provide a valid IP address/)).toBeDefined();
            fireEvent.click(getByText("OK"));
            fireEvent.change(addListenerIP, { target: { value: "107.108.109.110" } });
            fireEvent.click(addListenerSubmit);
            expect(await waitForElement(() => getByText(/Listener Added Successfully/))).toBeDefined();
        });

    it("should delete a subsystem",
        async () => {
            const mock = new MockAdapter(axios);
            mock.onGet("/api/v1/subsystem/")
                .reply(200,
                    subsystemResponse
                )
                .onDelete("/api/v1/subsystem/")
                .reply(200, {
                    "rid": "4dd7f4da-825f-4377-8ca4-a74374bb7759",
                    "lastSuccessTime": 1642352844,
                    "result": {
                        "status": {
                            "module": "",
                            "code": 0,
                            "description": "",
                            "posDescription": "Success"
                        }
                    },
                    "info": {
                        "version": "v0.10.6"
                    }
                }).onAny().reply(200);
            renderComponent();
            const { findAllByTitle, getByText } = wrapper;
            const deleteBtns = await findAllByTitle("Delete Subsystem");
            fireEvent.click(deleteBtns[1]);
            fireEvent.click(getByText("Yes"));
            expect(await waitForElement(() => getByText("Subsystem Deleted Successfully"))).toBeDefined();
        });
});