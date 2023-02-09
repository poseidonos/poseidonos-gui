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
  cleanup,
} from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { createMemoryHistory } from "history";

import rootSaga from "../../../sagas/indexSaga";
import headerReducer from "../../../store/reducers/headerReducer";
import BmcLogTable from "./index";
import i18n from "../../../i18n";

jest.unmock("axios");

describe("BmcLogTable", () => {
  let wrapper;
  let history;
  let store;
  jest.spyOn(global, "fetch").mockImplementation(() =>
    Promise.resolve({
      status: 200,
      json: () =>
        Promise.resolve({
          resp: [
            {
              timestamp: "2019-12-17 21:35:58+09:00KST",
              source: "BMC Journal Entry",
              entryType: "Oem",
              severity: "Warning",
              description: "samplelog3"
            },
            {
              timestamp: "2019-12-17 21:35:58+09:00KST",
              source: "BMC Journal Entry",
              entryType: "Oem",
              severity: "Warning",
              description: "samplelog2"
            },
            {
              timestamp: "2019-12-17 22:35:59+09:00KST",
              source: "Journal Entry",
              entryType: "Oem",
              severity: "Warning",
              description:
                "xyz.openbmc_project.Chassis.Control.Power.service: Cannot add dependency job, ignoring: Unit xyz.openbmc_project.Chassis.Control.Power.service failed to load properly: File exists"
            },
            {
              timestamp: "2019-12-17 21:35:59+09:00KST",
              source: "BMC Journal Entry",
              entryType: "Oem",
              severity: "Warning",
              description:
                "xyz.openbmc_project.Chassis.Control.Power.service: Cannot add dependency job, ignoring: Unit xyz.openbmc_project.Chassis.Control.Power.service failed to load properly: File exists"
            },
            {
              timestamp: "2019-13-17 21:35:58+09:00KST",
              source: "Event Log",
              entryType: "Oem",
              severity: "Warning",
              description:
                "xyz.openbmc_project.Chassis.Control.Power.service: Cannot add dependency job, ignoring: Unit xyz.openbmc_project.Chassis.Control.Power.service failed to load properly: File exists"
            },
            {
              timestamp: "2019-13-17 21:35:58+10:00KST",
              source: "Event Log",
              entryType: "Oem2",
              severity: "Warning",
              description:
                "xyz.openbmc_project.Chassis.Control.Power.service: Cannot add dependency job, ignoring: Unit xyz.openbmc_project.Chassis.Control.Power.service failed to load properly: File exists"
            },
            {
              timestamp: "2019-12-17 21:35:58+09:00KST",
              source: "BMC Journal Entry",
              entryType: "Oem",
              severity: "Error",
              description: "samplelog4"
            },
            {
              timestamp: "2019-13-17 21:35:58+09:00KST",
              source: "Event Log",
              entryType: "Oem",
              severity: "Warning",
              description:
                "xyz.openbmc_project.Chassis.Control.Power.service: Cannot add dependency job, ignoring: Unit xyz.openbmc_project.Chassis.Control.Power.service failed to load properly: File exists"
            }
          ],
          count: 7,
          page: 0,
          source_filter_array: [
            "Event Log",
            "BMC Journal Entry",
            "Journal Entry"
          ],
          entryType_filter_array: ["Oem", "Oem2"],
          severity_filter_array: ["Warning", "Error"]
        })
    })
  );
  beforeEach(() => {
    const rootReducers = {
      headerReducer
    };
    const sagaMiddleware = createSagaMiddleware();
    store = configureStore({
      reducer: rootReducers,
      middleware: [sagaMiddleware]
    })
    sagaMiddleware.run(rootSaga);

    const route = "/BmcLogTable/general";
    history = createMemoryHistory({ initialEntries: [route] });
  });

  const renderComponent = () => {
    wrapper = render(
      <Router history={history}>
        <I18nextProvider i18n={i18n}>
          <Provider store={store}>
            {" "}
            <BmcLogTable />
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
});
