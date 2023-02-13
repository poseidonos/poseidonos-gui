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
import { Provider } from "react-redux";
import createSagaMiddleware from "redux-saga";
import { Router, MemoryRouter } from "react-router-dom";
import { I18nextProvider } from "react-i18next";
import { configureStore } from "@reduxjs/toolkit";
import {
    render,
    fireEvent,
    cleanup,
    waitForElement,
    wait
} from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { createMemoryHistory } from "history";

import rootSaga from "../../sagas/indexSaga";
import headerReducer from "../../store/reducers/headerReducer";
import configurationsettingReducer from "../../store/reducers/configurationsettingReducer";
import PrivateRoute from "../../components/PrivateRoute";
import IbofOsOperations from "./index";
import i18n from "../../i18n";

jest.unmock("axios");

describe("IbofOsOperations", () => {
    let wrapper;
    let history;
    let store;
    beforeEach(() => {
        const rootReducers = {
            headerReducer,
            configurationsettingReducer
        };
        const sagaMiddleware = createSagaMiddleware();
        store = configureStore({
            reducer: rootReducers,
            middleware: [sagaMiddleware]
        })
        sagaMiddleware.run(rootSaga);
        const route = "/operations/pos";
        history = createMemoryHistory({ initialEntries: [route] });
    });

    const renderComponent = () => {
        wrapper = render(
            <Router history={history}>
                <I18nextProvider i18n={i18n}>
                    <Provider store={store}>
                        {" "}
                        <PrivateRoute>
                            <IbofOsOperations />
                        </PrivateRoute>
                    </Provider>
                </I18nextProvider>
            </Router>
        );
    };

    afterEach(cleanup);

    it("matches snapshot", () => {
        renderComponent();
        const { asFragment } = wrapper;
        expect(asFragment()).toMatchSnapshot();
    });



    it("should not render private route if not authenticated", async () => {
        const localStorageMock = {
            getItem: jest.fn(() => true),
            setItem: jest.fn(),
            clear: jest.fn()
        };
        Object.defineProperty(window, 'localStorage', { value: localStorageMock, writable: true });
        const privateWrapper = render(
            <Provider store={store}>
                <MemoryRouter initialEntries={["/IbofOsOperations"]}>
                    <PrivateRoute
                        className="App-content"
                        path="/IbofOsOperations"
                        exact
                        component={IbofOsOperations}
                    />
                </MemoryRouter>
            </Provider>
        );
        const { asFragment } = privateWrapper;
        expect(asFragment).toMatchSnapshot();
    });

    it("should render Private route", async () => {
        const localStorageMock = {
            getItem: jest.fn(() => false),
            setItem: jest.fn(),
            clear: jest.fn()
        };
        Object.defineProperty(window, 'localStorage', { value: localStorageMock, writable: true });
        const privateWrapper = render(
            <Provider store={store}>
                <MemoryRouter initialEntries={["/IbofOsOperations"]}>
                    <PrivateRoute
                        className="App-content"
                        path="/IbofOsOperations"
                        exact
                        component={IbofOsOperations}
                    />
                </MemoryRouter>
            </Provider>
        );

        const { asFragment } = privateWrapper;
        expect(asFragment).toMatchSnapshot();
    });

    it("starts POS", async () => {
        const mock = new MockAdapter(axios);
        mock.onGet("/api/v1.0/get_Is_Ibof_OS_Running/").reply(200,
            { "RESULT": { "result": { "status": { "module": "D-Agent", "code": 11020, "level": "ERROR", "description": "iBof Connection Error", "posDescription": "", "problem": "connection problem between POS and Management Stack", "solution": "restart POS" } } }, "lastRunningTime": "Mon, 03 Aug 2020 05:01:20 PM IST", "timestamp": "Mon, 03 Aug 2020 05:01:13 PM IST", "code": "", "level": "", "value": "" }
        ).onGet("api/v1/pos/property")
            .reply(200, {
                "result": {
                    "data": {
                        "rebuildPolicy": "lowest"
                    }
                }
            })
            .onGet("/api/v1.0/start_ibofos")
            .reply(200, {
                result: {
                    status: {
                        code: 0,
                        errorInfo: {
                            errorResponses: [{
                                eventName: "SUCCESS",
                                id: "subsystem1",
                            }, {
                                eventName: "SUCCESS",
                                id: "addListener2",
                            }, {
                                eventName: "SUCCESS",
                                id: "addListener1",
                            }, {
                                eventName: "FAIL",
                                id: "subsystem2",
                                description: "Failed to create subsystem"
                            }]
                        }
                    }
                }
            })
            .onAny().reply(200, {});

        renderComponent();
        const { getByTestId, getByText, asFragment } = wrapper;
        fireEvent.click(getByTestId("startButton"));
        fireEvent.click(getByText("Yes"));
        expect(await waitForElement(() => getByText(/POS started/i))).toBeDefined();
        expect(asFragment()).toMatchSnapshot();
    });

    it("should fail to start POS", async () => {
        const mock = new MockAdapter(axios);
        mock.onGet("/api/v1.0/get_Is_Ibof_OS_Running/").reply(200,
            { "RESULT": { "result": { "status": { "module": "D-Agent", "code": 11020, "level": "ERROR", "description": "iBof Connection Error", "posDescription": "", "problem": "connection problem between POS and Management Stack", "solution": "restart POS" } } }, "lastRunningTime": "Mon, 03 Aug 2020 05:01:20 PM IST", "timestamp": "Mon, 03 Aug 2020 05:01:13 PM IST", "code": "", "level": "", "value": "" }
        ).onGet("api/v1/pos/property")
            .reply(200, {
                "result": {
                    "data": {
                        "rebuildPolicy": "lowest"
                    }
                }
            })
            .onGet("/api/v1.0/start_ibofos")
            .reply(200, {
                result: {
                    status: {
                        code: 400,
                        description: "Failed to start",
                        problem: "binary not found",
                        solution: "Build POS and perform make install",
                        errorInfo: {
                            errorResponses: [{
                                eventName: "SUCCESS",
                                id: "subsystem1",
                            }, {
                                eventName: "SUCCESS",
                                id: "addListener2",
                            }, {
                                eventName: "SUCCESS",
                                id: "addListener1",
                            }, {
                                eventName: "FAIL",
                                id: "subsystem2",
                                description: "Failed to create subsystem"
                            }]
                        }
                    }
                }
            })
            .onAny().reply(200, {});

        renderComponent();
        const { getByTestId, getByText } = wrapper;
        fireEvent.click(getByTestId("startButton"));
        fireEvent.click(getByText("Yes"));
        expect(await waitForElement(() => getByText(/Failed to start/))).toBeDefined();
    });

    it("stops POS", async () => {
        const mock = new MockAdapter(axios);
        mock.onGet("/api/v1.0/get_Is_Ibof_OS_Running/").reply(200,
            { "RESULT": { "result": { "status": { "code": 0 }, "data": { "type": "NORMAL" } } }, "lastRunningTime": "Mon, 03 Aug 2020 05:01:20 PM IST", "timestamp": "Mon, 03 Aug 2020 05:01:13 PM IST", "code": "", "level": "", "value": "" }
        );
        renderComponent();
        const { getByTestId, getByText, getAllByText } = wrapper;
        const response = {
            "code": -1, "response": "POS is already stopped..."
        };
        jest.spyOn(global, "fetch").mockImplementation(() =>
            Promise.resolve({
                json: () => Promise.resolve(response),
                status: 200
            })
        );
        await waitForElement(() => getAllByText("Running"));
        fireEvent.click(await waitForElement(() => getByTestId("stopButton")));
        fireEvent.click(getByText("Yes"));
        global.fetch.mockRestore();
    });

    it("should show the current Performance impact", async () => {
        const mock = new MockAdapter(axios);
        mock.onGet("/api/v1.0/get_Is_Ibof_OS_Running/").reply(200,
            { "RESULT": { "result": { "status": { "code": 0 }, "data": { "type": "NORMAL" } } }, "lastRunningTime": "Mon, 03 Aug 2020 05:01:20 PM IST", "timestamp": "Mon, 03 Aug 2020 05:01:13 PM IST", "code": "", "level": "", "value": "" }
        ).onGet("api/v1/pos/property")
            .reply(200, {
                "result": {
                    "data": {
                        "rebuildPolicy": "lowest"
                    }
                }
            }).onAny().reply(200, {});
        renderComponent();
        const { getByText } = wrapper;
        expect(await waitForElement(() => getByText("lowest"))).toBeDefined();
    });

    it("should set the Performance impact", async () => {
        const mock = new MockAdapter(axios);
        const property = {
            rebuildPolicy: "lowest"
        }
        mock.onGet("/api/v1.0/get_Is_Ibof_OS_Running/").reply(200, { "RESULT": { "result": { "status": { "code": 0 }, "data": { "type": "NORMAL" } } }, "lastRunningTime": "Mon, 03 Aug 2020 05:01:20 PM IST", "timestamp": "Mon, 03 Aug 2020 05:01:13 PM IST", "code": "", "level": "", "value": "" }
        ).onGet("api/v1/pos/property")
            .reply(200, {
                "result": {
                    "data": property
                }
            })
            .onAny().reply(200, {});
        renderComponent();
        const { getByText, getByLabelText, getByTestId } = wrapper;
        expect(await waitForElement(() => getByText("lowest"))).toBeDefined();
        fireEvent.change(getByTestId("set-property-input"), { target: { value: "medium" } });
        property.rebuildPolicy = "medium";
        fireEvent.click(getByTestId("setPropertyButton"));
        expect(await waitForElement(() => getByText("medium"))).toBeDefined();
    });

    it("fails stopping POS", async () => {
        const mock = new MockAdapter(axios);
        mock.onGet("/api/v1.0/get_Is_Ibof_OS_Running/").reply(200,
            { "RESULT": { "result": { "status": { "code": 0 }, "data": { "type": "NORMAL" } } }, "lastRunningTime": "Mon, 03 Aug 2020 05:01:20 PM IST", "timestamp": "Mon, 03 Aug 2020 05:01:13 PM IST", "code": "", "level": "", "value": "" }
        );
        renderComponent();
        const { getByTestId, getAllByText, getByText } = wrapper;
        const response = {
            "code": -1, "response": "POS is already stopped..."
        };
        jest.spyOn(global, "fetch").mockImplementation(() =>
            Promise.resolve({
                json: () => Promise.resolve(response),
                status: 400
            })
        );
        await waitForElement(() => getAllByText("Running"));
        fireEvent.click(await waitForElement(() => getByTestId("stopButton")));
        fireEvent.click(getByText("Yes"));
        global.fetch.mockRestore();
    });

    it("closes the POS stop alert box", async () => {
        const mock = new MockAdapter(axios);
        mock.onGet("/api/v1.0/get_Is_Ibof_OS_Running/").reply(200,
            { "RESULT": { "result": { "status": { "code": 0 }, "data": { "type": "NORMAL" } } }, state: "NORMAL", "lastRunningTime": "Mon, 03 Aug 2020 05:01:20 PM IST", "timestamp": "Mon, 03 Aug 2020 05:01:13 PM IST", "code": "", "level": "", "value": "" }
        );
        renderComponent();
        const { getByTestId, getByText, getAllByText } = wrapper;
        await waitForElement(() => getAllByText("Running"));
        fireEvent.click(await waitForElement(() => getByTestId("stopButton")));
        fireEvent.click(getByText("No"));
    });

    it("should redirect to login page on session expiry", async () => {
        const mock = new MockAdapter(axios);
        mock.onGet("/api/v1.0/get_Is_Ibof_OS_Running/").reply(200,
            { "RESULT": { "result": { "status": { "code": 11020 }, "data": { "type": "NORMAL" } } }, "lastRunningTime": "Mon, 03 Aug 2020 05:01:20 PM IST", "timestamp": "Mon, 03 Aug 2020 05:01:13 PM IST", "code": "", "level": "", "value": "" }
        );
        const response = {
            "code": -1, "response": "POS is Already Running..."
        };
        jest.spyOn(global, "fetch").mockImplementation(() =>
            Promise.resolve({
                json: () => Promise.resolve(response),
                status: 400
            })
        );
        renderComponent();
        const { getByTestId, getByText } = wrapper;
        const startButtonElement = await waitForElement(() => getByTestId("startButton"));
        mock.onGet("/api/v1.0/get_Is_Ibof_OS_Running/").reply(401);
        fireEvent.click(startButtonElement);
        fireEvent.click(getByText("Yes"));
        expect(history.location.pathname).toBe("/operations/pos");
    })

    it("should not display rebuild status bar", async () => {
        const mock = new MockAdapter(axios);
        mock.onGet("/api/v1.0/get_Is_Ibof_OS_Running/").reply(200,
            { "RESULT": { "result": { "status": { "code": 11020 }, "data": { "type": "NORMAL" } } }, "lastRunningTime": "Mon, 03 Aug 2020 05:01:20 PM IST", "timestamp": "Mon, 03 Aug 2020 05:01:13 PM IST", "code": "", "level": "", "value": "" }
        );
        const response = {
            "code": -1, "response": "POS is Already Running..."
        };
        jest.spyOn(global, "fetch").mockImplementation(() =>
            Promise.resolve({
                json: () => Promise.resolve(response),
                status: 200
            })
        );
        renderComponent();
        const { getByTestId, getByText } = wrapper;
        const startButtonElement = await waitForElement(() => getByTestId("startButton"));
        fireEvent.click(startButtonElement);
        fireEvent.click(getByText("Yes"));
    })

    it("should render POS running status", async () => {
        jest.setTimeout(30000);
        jest.useFakeTimers();
        const mock = new MockAdapter(axios);
        renderComponent();
        jest.advanceTimersByTime(5000);

        mock.onGet("/api/v1.0/get_Is_Ibof_OS_Running/").reply(200,
            { "RESULT": { "result": { "status": { "code": 0 }, "data": { "type": "NORMAL" } } }, "lastRunningTime": "Mon, 03 Aug 2020 05:01:20 PM IST", "timestamp": "Mon, 03 Aug 2020 05:01:13 PM IST", "code": "", "level": "", "value": "" }
        );
        const { getByTestId, getByText } = wrapper;

        const response = {
            "code": -1, "response": "POS is Already Running..."
        };
        jest.spyOn(global, "fetch").mockImplementation(() =>
            Promise.resolve({
                json: () => Promise.resolve(response),
                status: 200
            })
        );
        await wait(async () => {
            const startButtonElement = getByTestId("startButton");
            expect(startButtonElement.closest('button')).toBeDisabled();

            const stopButtonElement = getByTestId("stopButton");
            fireEvent.click(stopButtonElement);
            fireEvent.click(getByText("Yes"));
            global.fetch.mockRestore();
        });
        jest.clearAllTimers();
    });

    it("should display the POS rebuilding percentage", async () => {
        jest.useFakeTimers();
        const mock = new MockAdapter(axios);
        renderComponent();
        jest.advanceTimersByTime(5000);

        mock.onGet("/api/v1.0/get_Is_Ibof_OS_Running/").reply(200,
            { "RESULT": { "result": { "data": { "type": "" } } }, "lastRunningTime": "Mon, 03 Aug 2020 05:01:20 PM IST", "timestamp": "", "code": "2804", "level": "", "value": "99" }
        );
        const { getByTestId, getByText } = wrapper;

        const response = {
            "code": -1, "response": "POS is Already Running..."
        };
        jest.spyOn(global, "fetch").mockImplementation(() =>
            Promise.resolve({
                json: () => Promise.resolve(response),
                status: 200
            })
        );
        await wait(async () => {
            const startButtonElement = getByTestId("startButton");
            fireEvent.click(startButtonElement);
            fireEvent.click(getByText("Yes"));

            const stopButtonElement = getByTestId("stopButton");
            fireEvent.click(stopButtonElement);
            fireEvent.click(getByText("Yes"));
            global.fetch.mockRestore();
        });
        jest.clearAllTimers();
    });
});
