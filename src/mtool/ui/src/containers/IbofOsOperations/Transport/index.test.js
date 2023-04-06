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
import { Router } from "react-router-dom";
import { Provider } from "react-redux";
import createSagaMiddleware from "redux-saga";
import { I18nextProvider } from "react-i18next";
import { configureStore } from "@reduxjs/toolkit";
import {
    render,
    fireEvent,
    cleanup,
    waitForElement,
} from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { createMemoryHistory } from "history";

import rootSaga from "../../../sagas/indexSaga";
import storageReducer from "../../../store/reducers/storageReducer";
import PrivateRoute from "../../../components/PrivateRoute";
import i18n from "../../../i18n";
import Transport from "./index";

jest.unmock("axios");

describe("DeviceOperations", () => {
    let wrapper;
    let history;
    let store;
    beforeEach(() => {
        const rootReducers = {
            storageReducer
        };
        const sagaMiddleware = createSagaMiddleware();
        store = configureStore({
            reducer: rootReducers,
            middleware: [sagaMiddleware]
        })
        sagaMiddleware.run(rootSaga);
        const route = "/operations/transport";
        history = createMemoryHistory({ initialEntries: [route] });
    });

    const renderComponent = () => {
        wrapper = render(
            <Router history={history}>
                <I18nextProvider i18n={i18n}>
                    <Provider store={store}>
                        {" "}
                        <PrivateRoute>
                            <Transport />
                        </PrivateRoute>
                    </Provider>
                </I18nextProvider>
            </Router>
        );
    };

    const transportResponse = [
        {
            "abortTimeoutSec": 1,
            "bufCacheSize": 64,
            "inCapsuleDataSize": 4096,
            "ioUnitSize": 131072,
            "maxIoQpairsPerCtrlr": 127,
            "maxIoSize": 131072,
            "maxQueueDepth": 128,
            "numSharedBuf": 4096,
            "type": "TCP"
        }
    ];

    afterEach(cleanup);

    it("should list the devices",
        async () => {
            const mock = new MockAdapter(axios);
            mock.onGet("/api/v1/transports/").reply(200,
                transportResponse
            );
            renderComponent();
            const { getByText } = wrapper;
            const transportType = await waitForElement(() => getByText("TCP"));
            expect(transportType).toBeDefined();
        });

    it("should create the device",
        async () => {
            const mock = new MockAdapter(axios);
            mock.onGet("/api/v1/transports/")
                .reply(200, [])
                .onPost("/api/v1/transport/")
                .reply(200,
                    {
                        "rid": "3bd32e3d-d445-11ed-9bb7-0cc47a3a4522",
                        "lastSuccessTime": 0,
                        "result": {
                            "status": {
                                "module": "",
                                "code": 0,
                                "eventName": "SUCCESS",
                                "cause": "none",
                                "description": "none",
                                "posDescription": "none",
                                "solution": "none"
                            }
                        },
                        "info": {
                            "version": "v0.12.0"
                        }
                    }
                );
            jest.spyOn(axios, "post");
            renderComponent();
            const { getByText, getByTestId } = wrapper;
            const addBtn = await waitForElement(() => getByTestId("add-transport"));
            expect(addBtn).toBeDefined();
            fireEvent.click(addBtn);
            const transportTypeField = await waitForElement(() => getByTestId("transportType"));
            fireEvent.change(transportTypeField, { target: { value: "TCP" } });
            const bufCacheSizeField = await waitForElement(() => getByTestId("bufCacheSize"));
            fireEvent.change(bufCacheSizeField, { target: { value: 64 } });
            const numSharedBufField = await waitForElement(() => getByTestId("numSharedBuf"));
            fireEvent.change(numSharedBufField, { target: { value: 4096 } });
            const createButton = await waitForElement(() => getByTestId("CreateTransport"));
            fireEvent.click(createButton);
            const successResponse = await waitForElement(() => getByText(/Transport\ Creation\ Successful/));
            expect(successResponse).toBeDefined();
        });

    it("should display error message when disk creation fails",
        async () => {
            const mock = new MockAdapter(axios);
            mock.onGet("/api/v1/transports/")
                .reply(200,
                    transportResponse
                )
                .onPost("/api/v1/transport/")
                .reply(200,
                    {
                        "rid": "8ab1e105-d448-11ed-9bb7-0cc47a3a4522",
                        "lastSuccessTime": 0,
                        "result": {
                            "status": {
                                "module": "",
                                "code": 2209,
                                "eventName": "ADD_TRANSPORT_FAILURE_SPDK_FAILURE",
                                "cause": "An error occurred during RPC to SPDK.",
                                "description": "Failed to add a transport.",
                                "posDescription": "Failed to add a transport.",
                                "solution": "none"
                            }
                        },
                        "info": {
                            "version": "v0.12.0"
                        }
                    }
                );
            renderComponent();
            const { getByText, getByTestId } = wrapper;
            const addBtn = await waitForElement(() => getByTestId("add-transport"));
            expect(addBtn).toBeDefined();
            fireEvent.click(addBtn);
            const transportTypeField = await waitForElement(() => getByTestId("transportType"));
            fireEvent.change(transportTypeField, { target: { value: "TCP" } });
            const bufCacheSizeField = await waitForElement(() => getByTestId("bufCacheSize"));
            fireEvent.change(bufCacheSizeField, { target: { value: 64 } });
            const numSharedBufField = await waitForElement(() => getByTestId("numSharedBuf"));
            fireEvent.change(numSharedBufField, { target: { value: 4096 } });
            const createButton = await waitForElement(() => getByTestId("CreateTransport"));
            fireEvent.click(createButton);
            const successResponse = await waitForElement(() => getByText(/Error while creating transport/));
            expect(successResponse).toBeDefined();
        });

    it("should display error message when API fails",
        async () => {
            const mock = new MockAdapter(axios);
            mock.onGet("/api/v1/transports/")
                .reply(200,
                    transportResponse
                )
                .onPost("/api/v1/transport/")
                .reply(500
                );
            jest.spyOn(axios, "post");
            renderComponent();
            const { getByText, getByTestId } = wrapper;
            const addBtn = await waitForElement(() => getByTestId("add-transport"));
            expect(addBtn).toBeDefined();
            fireEvent.click(addBtn);
            const transportTypeField = await waitForElement(() => getByTestId("transportType"));
            fireEvent.change(transportTypeField, { target: { value: "TCP" } });
            const bufCacheSizeField = await waitForElement(() => getByTestId("bufCacheSize"));
            fireEvent.change(bufCacheSizeField, { target: { value: 64 } });
            const numSharedBufField = await waitForElement(() => getByTestId("numSharedBuf"));
            fireEvent.change(numSharedBufField, { target: { value: 4096 } });
            const createButton = await waitForElement(() => getByTestId("CreateTransport"));
            fireEvent.click(createButton);
            const successResponse = await waitForElement(() => getByText(/Error while creating transport/));
            expect(successResponse).toBeDefined();
        });
});