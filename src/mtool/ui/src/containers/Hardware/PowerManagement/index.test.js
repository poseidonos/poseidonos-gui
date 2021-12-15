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
import alertManagementReducer from "../../../store/reducers/alertManagementReducer";
import hardwareOverviewReducer from "../../../store/reducers/hardwareOverviewReducer";
import hardwarePowerManagementReducer from "../../../store/reducers/hardwarePowerManagementReducer";
import i18n from "../../../i18n";
import PowerManagement from './index'
jest.unmock("axios");
jest.useFakeTimers();

describe("PowerManagement", () => {
  let wrapper;
  let history;
  let store;
  // let mock;
  beforeEach(() => {
    const sagaMiddleware = createSagaMiddleware();
    const rootReducers = combineReducers({
      alertManagementReducer,
      hardwarePowerManagementReducer,
      hardwareOverviewReducer
    });
    const composeEnhancers =
      window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
    store = createStore(
      rootReducers,
      composeEnhancers(applyMiddleware(sagaMiddleware))
    );
    sagaMiddleware.run(rootSaga);
    const route = "/Hardware/PowerManagement";
    history = createMemoryHistory({ initialEntries: [route] });
    // mock = new MockAdapter(axios);
  });

  const renderComponent = () => {
    wrapper = render(
      <Router history={history}>
        <I18nextProvider i18n={i18n}>
          <Provider store={store}>
            {" "}
            <PowerManagement />
          </Provider>
        </I18nextProvider>
      </Router>
    );
  };

  afterEach(cleanup);

  it("matches snapshot", async () => { 
      const mock = new MockAdapter(axios);
      renderComponent();
      const { getByTestId } = wrapper;
      const table = await waitForElement(() =>
          getByTestId("PowerManagement-container")
      );
      expect(table).toBeDefined();
  });

  it("should render the power state table", async () => {
      const mock = new MockAdapter(axios);
       mock.onGet(/\/api\/v1.0\/get_chassis_front_info\//).reply(200, {
            front_info: [{ DevicePath: 'NA',
                BuildDate: 'NA',
                Manufacturer: 'NA',
                name: "test",
                slot: 1,
                driveName: "test",
                tableData: {
                    "id": 0
                },
                Status: {
                    Health: "OK"
                },
                PartNumber: 'NA',
                SerialNumber: 'NA',
                Model: 'NA',
                PredictedMediaLifeLeftPercent:'NA'
            }]
        }).onAny().reply(200, []);
      jest.advanceTimersByTime(6000);
      renderComponent();
      jest.advanceTimersByTime(6000);
      const { getByTestId, asFragment } = wrapper;
      const table = await waitForElement(() =>
          getByTestId("PowerManagement-container")
      );
      expect(table).toBeDefined();
      expect(asFragment()).toMatchSnapshot();
  });

  it("should change the power mode", async () => {
      const mock = new MockAdapter(axios);
       mock.onGet(/\/api\/v1.0\/get_chassis_front_info\//).reply(200, {
            front_info: [{ DevicePath: 'NA',
                BuildDate: 'NA',
                Manufacturer: 'NA',
                name: "test",
                slot: 1,
                driveName: "test",
                tableData: {
                    "id": 0
                },
                Status: {
                    Health: "OK"
                },
                PartNumber: 'NA',
                SerialNumber: 'NA',
                Model: 'NA',
                PredictedMediaLifeLeftPercent:'NA',
                MinPowerState: 10,
                MaxPowerState: 20,
                PowerState: 15
            }]
        }).onAny().reply(200, []);
      jest.advanceTimersByTime(6000);
      renderComponent();
      jest.advanceTimersByTime(6000);
      const { getByTestId, asFragment, getAllByTitle } = wrapper;
      const table = await waitForElement(() =>
          getByTestId("PowerManagement-container")
      );
      expect(table).toBeDefined();
      const radioPerformance = getByTestId("radio-btn-performance");
      fireEvent.click(radioPerformance);
      expect(asFragment()).toMatchSnapshot();
  });

  it("should edit and save power table with same power state values", async () => {
      const mock = new MockAdapter(axios);
       mock.onGet(/\/api\/v1.0\/get_chassis_front_info\//).reply(200, {
            front_info: [{
                DevicePath: 'NA',
                BuildDate: 'NA',
                Manufacturer: 'NA',
                name: "test",
                slot: 1,
                driveName: "test",
                tableData: {
                    "id": 0
                },
                Status: {
                    Health: "Not OK"
                },
                PartNumber: 'NA',
                SerialNumber: 'NA',
                Model: 'NA',
                PredictedMediaLifeLeftPercent:'NA',
                MinPowerState: 10,
                MaxPowerState: 20,
                PowerState: 15
            }]
        }).onAny().reply(200, []);
      jest.advanceTimersByTime(6000);
      renderComponent();
      jest.advanceTimersByTime(6000);
      const { getByTestId, asFragment, getByPlaceholderText, getAllByTitle } = wrapper;
      const table = await waitForElement(() =>
          getByTestId("PowerManagement-container")
      );
      expect(table).toBeDefined();
      fireEvent.click(getAllByTitle("Edit")[0]);
      fireEvent.click(getAllByTitle("Save")[0]);
      expect(asFragment()).toMatchSnapshot();
  });

  it("should not save power table with power state value greater than max", async () => {
      const mock = new MockAdapter(axios);
       mock.onGet(/\/api\/v1.0\/get_chassis_front_info\//).reply(200, {
            front_info: [{
                DevicePath: 'NA',
                BuildDate: 'NA',
                Manufacturer: 'NA',
                name: "test",
                slot: 1,
                driveName: "test",
                tableData: {
                    "id": 0
                },
                Status: {
                    Health: "Not OK"
                },
                PartNumber: 'NA',
                SerialNumber: 'NA',
                Model: 'NA',
                PredictedMediaLifeLeftPercent:'NA',
                MinPowerState: 10,
                MaxPowerState: 20,
                PowerState: 15
            }]
        }).onAny().reply(200, []);
      jest.advanceTimersByTime(6000);
      renderComponent();
      jest.advanceTimersByTime(6000);
      const { getByTestId, asFragment, getByPlaceholderText, getAllByTitle } = wrapper;
      const table = await waitForElement(() =>
          getByTestId("PowerManagement-container")
      );
      expect(table).toBeDefined();
      fireEvent.click(getAllByTitle("Edit")[0]);
      fireEvent.change(getByPlaceholderText("Current Power State"), { target: { value: 25 }});
      fireEvent.click(getAllByTitle("Save")[0]);
      expect(asFragment()).toMatchSnapshot();
  });

  it("should save power table with proper power state value", async () => {
      const mock = new MockAdapter(axios);
       mock.onGet(/\/api\/v1.0\/get_chassis_front_info\//).reply(200, {
            front_info: [{
                DevicePath: 'NA',
                BuildDate: 'NA',
                Manufacturer: 'NA',
                name: "test",
                slot: 1,
                driveName: "test",
                tableData: {
                    "id": 0
                },
                Status: {
                    Health: "Not OK"
                },
                PartNumber: 'NA',
                SerialNumber: 'NA',
                Model: 'NA',
                PredictedMediaLifeLeftPercent:'NA',
                MinPowerState: 10,
                MaxPowerState: 20
            }]
        }).onGet(/\/api\/v1.0\/get_power_info\//).reply(200, {
            powerstatus: "On",
            powerconsumption: 0,
            powercap: 100
        }).onAny().reply(200, []);
      jest.advanceTimersByTime(6000);
      renderComponent();
      jest.advanceTimersByTime(6000);
      const { getByTestId, asFragment, getByLabelText, getByPlaceholderText, getAllByTitle } = wrapper;
      const table = await waitForElement(() =>
          getByTestId("PowerManagement-container")
      );
      expect(table).toBeDefined();
      fireEvent.click(getAllByTitle("Edit")[0]);
      fireEvent.change(getByPlaceholderText("Current Power State"), { target: { value: null }});
      fireEvent.change(getByPlaceholderText("Current Power State"), { target: { value: 16 }});
      fireEvent.click(getAllByTitle("Save")[0]);
      jest.advanceTimersByTime(6000);
      await waitForElement(() =>
          getAllByTitle("Edit")[0]
      );
      expect(asFragment()).toMatchSnapshot();
  });

});
