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


DESCRIPTION: IbofOsOperations Container Test File
@NAME : index.test.js
@AUTHORS: Palak Kapoor
@Version : 1.0 *
@REVISION HISTORY
[03/06/2019] [Palak] : Prototyping..........////////////////////
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
import rootSaga from "../../sagas/indexSaga";
import headerReducer from "../../store/reducers/headerReducer";
import BMCAuthenticationReducer from "../../store/reducers/BMCAuthenticationReducer";
import configurationsettingReducer from "../../store/reducers/configurationsettingReducer";
import PrivateRoute from "../../components/PrivateRoute";
import IbofOsOperations from "./index";
import i18n from "../../i18n";

jest.unmock("axios");

describe("IbofOsOperations", () => {
    let wrapper;
    let history;
    let store;
    // let mock;
    beforeEach(() => {
        const sagaMiddleware = createSagaMiddleware();
        const rootReducers = combineReducers({
            headerReducer,
            configurationsettingReducer,
            BMCAuthenticationReducer
        });
        const composeEnhancers =
            window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
        store = createStore(
            rootReducers,
            composeEnhancers(applyMiddleware(sagaMiddleware))
        );
        sagaMiddleware.run(rootSaga);
        const route = "/";
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
        renderComponent();
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
        fireEvent.click(getByTestId("startButton"));
        fireEvent.click(getByText("Yes"));
        global.fetch.mockRestore();
    });
    it("stops POS", async () => {
        const mock = new MockAdapter(axios);
        mock.onGet("/api/v1.0/get_Is_Ibof_OS_Running/").reply(200,
            { "RESULT": { "result": { "status": {"code": 0}, "data": { "type": "NORMAL" } } }, "lastRunningTime": "Mon, 03 Aug 2020 05:01:20 PM IST", "timestamp": "Mon, 03 Aug 2020 05:01:13 PM IST", "code": "", "level": "", "value": "" }
        );
        renderComponent();
        const { getByTestId, getByText, asFragment } = wrapper;
        const response = {
            "code": -1, "response": "POS is already stopped..."
        };
        jest.spyOn(global, "fetch").mockImplementation(() =>
            Promise.resolve({
                json: () => Promise.resolve(response),
                status: 200
            })
        );
        expect(asFragment()).toMatchSnapshot();
        fireEvent.click(await waitForElement(() => getByTestId("stopButtonRunning")));
        fireEvent.click(getByText("Yes"));
        global.fetch.mockRestore();
    });

    it("fails stopping POS", async () => {
        const mock = new MockAdapter(axios);
        mock.onGet("/api/v1.0/get_Is_Ibof_OS_Running/").reply(200,
            { "RESULT": { "result": { "status": {"code": 0}, "data": { "type": "NORMAL" } } }, "lastRunningTime": "Mon, 03 Aug 2020 05:01:20 PM IST", "timestamp": "Mon, 03 Aug 2020 05:01:13 PM IST", "code": "", "level": "", "value": "" }
        );
        renderComponent();
        const { getByTestId, getByText, asFragment } = wrapper;
        const response = {
            "code": -1, "response": "POS is already stopped..."
        };
        jest.spyOn(global, "fetch").mockImplementation(() =>
            Promise.resolve({
                json: () => Promise.resolve(response),
                status: 400
            })
        );
        expect(asFragment()).toMatchSnapshot();
        fireEvent.click(await waitForElement(() => getByTestId("stopButtonRunning")));
        fireEvent.click(getByText("Yes"));
        global.fetch.mockRestore();
    });

    it("closes the POS stop alert box", async () => {
        const mock = new MockAdapter(axios);
        mock.onGet("/api/v1.0/get_Is_Ibof_OS_Running/").reply(200,
            { "RESULT": { "result": { "status": {"code": 0}, "data": { "type": "NORMAL" } } }, "lastRunningTime": "Mon, 03 Aug 2020 05:01:20 PM IST", "timestamp": "Mon, 03 Aug 2020 05:01:13 PM IST", "code": "", "level": "", "value": "" }
        );
        renderComponent();
        const { getByTestId, getByText } = wrapper;
        fireEvent.click(await waitForElement(() => getByTestId("stopButtonRunning")));
        fireEvent.click(getByText("No"));
    });

    it("should redirect to login page on session expiry", async () => {
        const mock = new MockAdapter(axios);
        mock.onGet("/api/v1.0/get_Is_Ibof_OS_Running/").reply(200,
            { "RESULT": { "result": { "status": {"code": 11020}, "data": { "type": "NORMAL" } } }, "lastRunningTime": "Mon, 03 Aug 2020 05:01:20 PM IST", "timestamp": "Mon, 03 Aug 2020 05:01:13 PM IST", "code": "", "level": "", "value": "" }
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
        const { getByTestId, getByText, asFragment } = wrapper;
        const startButtonElement = await waitForElement(() => getByTestId("startButton"));
        mock.onGet("/api/v1.0/get_Is_Ibof_OS_Running/").reply(401);
        fireEvent.click(startButtonElement);
        fireEvent.click(getByText("Yes"));
        expect(history.location.pathname).toBe("/");
    })

    it("should not display rebuild status bar", async () => {
        const mock = new MockAdapter(axios);
        mock.onGet("/api/v1.0/get_Is_Ibof_OS_Running/").reply(200,
            { "RESULT": { "result": { "status": {"code": 11020}, "data": { "type": "NORMAL" } } }, "lastRunningTime": "Mon, 03 Aug 2020 05:01:20 PM IST", "timestamp": "Mon, 03 Aug 2020 05:01:13 PM IST", "code": "", "level": "", "value": "" }
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
        const { getByTestId, getByText, asFragment } = wrapper;
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
            { "RESULT": { "result": { "status": {"code": 0}, "data": { "type": "NORMAL" } } }, "lastRunningTime": "Mon, 03 Aug 2020 05:01:20 PM IST", "timestamp": "Mon, 03 Aug 2020 05:01:13 PM IST", "code": "", "level": "", "value": "" }
        );
        const { asFragment, getByTestId, getByText } = wrapper;
        expect(asFragment()).toMatchSnapshot();

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
            const startButtonElement = getByTestId("startButtonRunning");
            expect(startButtonElement.closest('button')).toBeDisabled();

            const stopButtonElement = getByTestId("stopButtonRunning");
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
        const { asFragment, getByTestId, getByText } = wrapper;
        expect(asFragment()).toMatchSnapshot();

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
