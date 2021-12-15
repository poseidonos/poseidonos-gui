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
import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import createSagaMiddleware from "redux-saga";
import rootSaga from "../../../sagas/indexSaga";
import headerReducer from "../../../store/reducers/headerReducer";
import hardwareOverviewReducer from "../../../store/reducers/hardwareOverviewReducer";
import hardwareHealthReducer from "../../../store/reducers/hardwareHealthReducer";
import hardwareSensorReducer from "../../../store/reducers/hardwareSensorReducer";
import hardwarePowerManagementReducer from "../../../store/reducers/hardwarePowerManagementReducer";
import waitLoaderReducer from "../../../store/reducers/waitLoaderReducer";
import configurationsettingReducer from "../../../store/reducers/configurationsettingReducer";
import alertManagementReducer from "../../../store/reducers/alertManagementReducer";
import i18n from "../../../i18n";
import Sensors from './index'
jest.unmock("axios");

describe("Sensors", () => {
  let wrapper;
  let history;
  let store;
  // let mock;
  beforeEach(() => {
    const sagaMiddleware = createSagaMiddleware();
    const rootReducers = combineReducers({
      // headerLanguageReducer,
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
    const route = "/Hardware/Sensors";
    history = createMemoryHistory({ initialEntries: [route] });
    // mock = new MockAdapter(axios);
  });

  const renderComponent = () => {
    wrapper = render(
      <Router history={history}>
        <I18nextProvider i18n={i18n}>
          <Provider store={store}>
            {" "}
            <Sensors />
          </Provider>
        </I18nextProvider>
      </Router>
    );
  };

  afterEach(cleanup);

  it("matches snapshot", async () => {
    const mock = new MockAdapter(axios);
    renderComponent();
    const { asFragment, getByText, getByTestId} = wrapper;
    const alertDescription = await waitForElement(() =>
    getByTestId("Sensors_Component")
  );

  const alertDescription1 = await waitForElement(() =>
  fireEvent.click(getByTestId("Sensors_Power")),
  fireEvent.click(getByTestId("Sensors_Fan")),
  fireEvent.click(getByTestId("Sensors_Temperature")), 
  );
    expect(asFragment()).toMatchSnapshot();
  });

  it("displays fan sensor table", async () => {
    window.history.pushState({}, 'Sensors', '/Fan');
    const mock = new MockAdapter(axios);
    mock.onGet('/api/v1.0/get_fan_sensor_info/').reply(200, {
      fan_sensor_info: [{
        Name: "Fan1",
        Status: {
          Health: "OK"
        },
        Reading: 10,
        ReadingUnits: "rpm"
      }, {
        Name: "Fan2",
        Status: {
          Health: "Not OK"
        },
        Reading: 10,
        ReadingUnits: "rpm"
      }]
    });
    renderComponent();
    const { asFragment, getByTestId} = wrapper;
    fireEvent.click(getByTestId("Sensors_Fan"));
    expect(asFragment()).toMatchSnapshot();
  });

  it("displays power sensor table", async () => {
    window.history.pushState({}, 'Sensors', '/Power');
    const mock = new MockAdapter(axios);
    mock.onGet('/api/v1.0/get_power_sensor_info/').reply(200, {
      power_sensor_info: [{
        Name: "power1",
        Status: {
          Health: "OK"
        },
        ReadingVolts: 10,
        PowerInputWatts: 10
      }, {
        Name: "power2",
        Status: {
          Health: "Not OK"
        },
        ReadingVolts: 10,
        PowerInputWatts: 10
      }]
    });
    renderComponent();
    const { asFragment, getByTestId} = wrapper;
    fireEvent.click(getByTestId("Sensors_Power"));
    expect(asFragment()).toMatchSnapshot();
  });

  it("displays temperature sensor table", async () => {
    window.history.pushState({}, 'Sensors', '/Temperature');
    const mock = new MockAdapter(axios);
    mock.onGet('/api/v1.0/get_temperature_sensor_info/').reply(200, {
      temperature_sensor_info: [{
        Name: "temperature1",
        Status: {
          Health: "OK"
        },
        ReadingCelsius: 10,
        UpperThresholdNonCritical: 10
      }, {
        Name: "temperature2",
        Status: {
          Health: "Not OK"
        },
        ReadingCelsius: 10
      }]
    });
    renderComponent();
    const { asFragment, getByTestId} = wrapper;
    fireEvent.click(getByTestId("Sensors_Temperature"));
    expect(asFragment()).toMatchSnapshot();
  });

});

 
 
