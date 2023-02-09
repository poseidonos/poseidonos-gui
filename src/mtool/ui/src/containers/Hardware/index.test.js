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
  waitForElement
} from "@testing-library/react";
import { Provider } from "react-redux";
import { act } from "react-dom/test-utils";
import { I18nextProvider } from "react-i18next";
import axios from "axios";
import "@testing-library/jest-dom/extend-expect";
import MockAdapter from "axios-mock-adapter";
import { createMemoryHistory } from "history";
import { Router } from "react-router-dom";
import { createStore, combineReducers, applyMiddleware, compose } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import rootSaga from "../../sagas/indexSaga";
import headerReducer from "../../store/reducers/headerReducer";
import hardwareOverviewReducer from "../../store/reducers/hardwareOverviewReducer";
import hardwareHealthReducer from "../../store/reducers/hardwareHealthReducer";
import hardwareSensorReducer from "../../store/reducers/hardwareSensorReducer";
import hardwarePowerManagementReducer from "../../store/reducers/hardwarePowerManagementReducer";
import waitLoaderReducer from "../../store/reducers/waitLoaderReducer";
import configurationsettingReducer from "../../store/reducers/configurationsettingReducer";
import alertManagementReducer from "../../store/reducers/alertManagementReducer";
import BMCAuthenticationReducer from "../../store/reducers/BMCAuthenticationReducer"
import i18n from "../../i18n";
import Hardware from './index'
import { ExpansionPanelActions } from "@material-ui/core";
jest.unmock("axios");

describe("Hardware", () => {
  let wrapper;
  let history;
  let store;
  // let mock;
  beforeEach(() => {
    const sagaMiddleware = createSagaMiddleware();
    const rootReducers = combineReducers({
      // headerLanguageReducer,
      BMCAuthenticationReducer,
      headerReducer,
      hardwareOverviewReducer,
      hardwareHealthReducer,
      hardwareSensorReducer,
      hardwarePowerManagementReducer,
      waitLoaderReducer,
      configurationsettingReducer,
      alertManagementReducer
    });
    const composeEnhancers =
      window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
    store = createStore(
      rootReducers,
      composeEnhancers(applyMiddleware(sagaMiddleware))
    );
    sagaMiddleware.run(rootSaga);
    const route = "/Hardware/Overview";
    history = createMemoryHistory({ initialEntries: [route] });
    // mock = new MockAdapter(axios);
  });

  const renderComponent = () => {
    wrapper = render(
      <Router history={history}>
        <I18nextProvider i18n={i18n}>
          <Provider store={store}>
            <Hardware />
          </Provider>
        </I18nextProvider>
      </Router>
    );
  };

  afterEach(cleanup);

  it("should render hardware page", async () => { 
    const mock = new MockAdapter(axios);
    renderComponent();
    const { asFragment, getByText, getByTestId} = wrapper;
    expect(getByTestId("HardwareBMCPage")).toBeDefined();
    expect(asFragment()).toMatchSnapshot();
  });

  it("should render hardware login page", async () => { 
    const mock = new MockAdapter(axios);
    const localStorageMock = {
        getItem: jest.fn(),
        setItem: jest.fn()
    };
    Object.defineProperty(window, 'localStorage', { value: localStorageMock, writable: true });
    localStorageMock.getItem.mockReturnValue("false");
    renderComponent();
    const { asFragment, getByText, getByTestId} = wrapper;
    expect(getByTestId("passwordInput")).toBeDefined();
    expect(asFragment()).toMatchSnapshot();
  });

  it("should login to ipmi", async () => { 
    const mock = new MockAdapter(axios);
    mock.onPost('/api/v1.0/bmc_login/')
        .reply(200, {});
    const localStorageMock = {
        getItem: jest.fn(),
        setItem: jest.fn()
    };
    Object.defineProperty(window, 'localStorage', { value: localStorageMock, writable: true });
    localStorageMock.getItem.mockReturnValue("false");
    renderComponent();
    const { asFragment, getByText, getByTestId} = wrapper;
    fireEvent.change(getByTestId("usernameInput"), {target: {name: "bmc_username", value: "test"}});
    expect(getByTestId("passwordInput")).toBeDefined();
    fireEvent.change(getByTestId("passwordInput"), {target: {name: "bmc_password", value: "test"}});
    fireEvent.click(getByTestId("visibilityButton"));
    fireEvent.click(getByTestId("submit"));
    expect(asFragment()).toMatchSnapshot();
  });

  it("should fail to login to ipmi", async () => {
    const mock = new MockAdapter(axios);
    mock.onPost('/api/v1.0/bmc_login/')
        .reply(500, "failed");
    const localStorageMock = {
        getItem: jest.fn(),
        setItem: () => true
    };
    Object.defineProperty(window, 'localStorage', { value: localStorageMock, writable: true });
    localStorageMock.getItem.mockReturnValue("false");
    renderComponent();
    const { asFragment, getByText, getByTestId} = wrapper;
    fireEvent.change(getByTestId("usernameInput"), {target: {name: "bmc_username", value: "test"}});
    expect(getByTestId("passwordInput")).toBeDefined();
    fireEvent.change(getByTestId("passwordInput"), {target: {name: "bmc_password", value: "test"}});
    fireEvent.click(getByTestId("visibilityButton"));
    fireEvent.click(getByTestId("submit"));
    // const failText = await waitForElement(() => getByTestId("errorMsg"));
    // expect(failText).toBeDefined();
    expect(asFragment()).toMatchSnapshot();
  });

  it('should switch to DriveTab', () => {
    const mock = new MockAdapter(axios);
    mock.onAny()
        .reply(200, {});
    const localStorageMock = {
        getItem: jest.fn(),
        setItem: jest.fn()
    };
    localStorageMock.getItem.mockReturnValue("true");
    Object.defineProperty(window, 'localStorage', { value: localStorageMock, writable: true });
    window.history.pushState({}, 'Test Overview', '/Overview/Health/Drive/Sensors/PowerManagement');
    renderComponent();
    const { getByTestId } = wrapper;
    fireEvent.click(getByTestId("DriveTab"));
    fireEvent.click(getByTestId("SensorsTab"));
  });

  it("should render button on resize", () => {
    // Change the viewport to 500px.
    global.innerWidth = 500;

    // Trigger the window resize event.
    global.dispatchEvent(new Event("resize"));

    renderComponent();
    const { getByTestId } = wrapper;
    expect(getByTestId("sidebar-toggle")).toBeDefined();
    fireEvent.click(getByTestId("sidebar-toggle"));
    expect(getByTestId("help-link")).toHaveTextContent("Help");
  });

  it('should Power On the server', async () => {
    jest.useFakeTimers();
    const mock = new MockAdapter(axios);
    mock.onAny()
        .reply(200, {});
    const spy = jest.spyOn(axios, "post");
    window.history.pushState({}, 'Test Overview', '/Hardware/Overview');
    renderComponent();
    const { getByTestId, asFragment, getByText } = wrapper;
    jest.advanceTimersByTime(300500);
    expect(asFragment()).toMatchSnapshot();
    expect(getByText(/Server Information/)).toBeDefined();
    fireEvent.click(getByTestId("PowerOnButton"));
    fireEvent.click(getByText(/Yes/));
    expect(spy).toHaveBeenCalledWith(
      "/api/v1.0/power_on_system/",
      {"headers":
        {
          "Accept": "application/json",
          "Content-Type": "application/json",
          "x-access-token": "true"
        }
      }
    );
  });

  it('should Power Off the server', async () => {
    const mock = new MockAdapter(axios);
    mock.onAny()
        .reply(200, {});
    const spy = jest.spyOn(axios, "post");
    window.history.pushState({}, 'Test Overview', '/Hardware/Drive');
    renderComponent();
    const { getByTestId, asFragment, getByText } = wrapper;
    jest.advanceTimersByTime(300500);
    expect(asFragment()).toMatchSnapshot();
    expect(getByText(/Server Information/)).toBeDefined();
    fireEvent.click(getByTestId("PowerOffButton"));
    fireEvent.click(getByText(/Yes/));
    expect(spy).toHaveBeenCalledWith(
      "/api/v1.0/shutdown_system/",
      {"headers":
        {
          "Accept": "application/json",
          "Content-Type": "application/json",
          "x-access-token": "true"
        }
      }
    );
  });

  it('should Force Power Off the server', async () => {
    const mock = new MockAdapter(axios);
    mock.onAny()
        .reply(200, {});
    const spy = jest.spyOn(axios, "post");
    renderComponent();
    const { getByTestId, asFragment, getByText } = wrapper;
    jest.advanceTimersByTime(300500);
    expect(asFragment()).toMatchSnapshot();
    expect(getByText(/Server Information/)).toBeDefined();
    fireEvent.click(getByTestId("ForcePowerOffButton"));
    fireEvent.click(getByText(/Yes/));
    expect(spy).toHaveBeenCalledWith(
      "/api/v1.0/force_shutdown_system/",
      {"headers":
        {
          "Accept": "application/json",
          "Content-Type": "application/json",
          "x-access-token": "true"
        }
      }
    );
  });

  it('should Force Restart the server', async () => {
    const mock = new MockAdapter(axios);
    mock.onAny()
        .reply(400, {});
    const spy = jest.spyOn(axios, "post");
    renderComponent();
    const { getByTestId, asFragment, getByText } = wrapper;
    expect(asFragment()).toMatchSnapshot();
    expect(getByText(/Server Information/)).toBeDefined();
    fireEvent.click(getByTestId("ForceRestartButton"));
    fireEvent.click(getByText(/Yes/));
    expect(spy).toBeCalled();
    expect(spy).toHaveBeenCalledWith(
      "/api/v1.0/reboot_system/",
      {"headers":
        {
          "Accept": "application/json",
          "Content-Type": "application/json",
          "x-access-token": "true"
        }
      }
    );
  });

});

 
 
