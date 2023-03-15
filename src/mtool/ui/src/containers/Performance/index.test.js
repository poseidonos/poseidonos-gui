/*
 *   BSD LICENSE
 *   Copyright (c) 2021 Samsung Electronics Corporation
 *   All rights reserved.
 *
 *   Redistribution and use in source and binary forms,with or without
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

import rootSaga from "../../sagas/indexSaga";
import headerReducer from "../../store/reducers/headerReducer";
import telemetryReducer from "../../store/reducers/telemetryReducer";
import waitLoaderReducer from "../../store/reducers/waitLoaderReducer";
import Performance from "./index";
import i18n from "../../i18n";

jest.unmock("axios");

// duplicate json

const telemetryJson = {
  status: true,
  properties: [{
    category: 'Common',
    fields: [{
      label: 'Process Uptime Second',
      field: 'uptime_sec',
      isSet: false
    }]
  }, {
    category: 'Device',
    fields: [{
      label: 'Bandwidth',
      field: 'bandwidth_device',
      isSet: false
    }, {
      label: 'Capacity',
      field: 'capacity_device',
      isSet: false
    }]
  }]
}

describe("Performance", () => {
  let wrapper;
  let history;
  let store;
  let mock;

  beforeEach(() => {
    const rootReducers = {
      headerReducer,
      telemetryReducer,
      waitLoaderReducer
    };
    const sagaMiddleware = createSagaMiddleware();
    store = configureStore({
      reducer: rootReducers,
      middleware: [sagaMiddleware]
    })
    sagaMiddleware.run(rootSaga);
    const route = "/performance";
    history = createMemoryHistory({ initialEntries: [route] });
    mock = new MockAdapter(axios);
  });

  const renderComponent = () => {
    wrapper = render(
      <Router history={history}>
        <I18nextProvider i18n={i18n}>
          <Provider store={store}>
            {" "}
            <Performance />
          </Provider>
        </I18nextProvider>
      </Router>
    );
  };

  afterEach(cleanup);


  it("should render the telemetry configuration page", async () => {
    renderComponent();
    const { getByText } = wrapper;
    expect(await waitForElement(() => getByText("Start"))).toBeDefined();
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

  it("should start Telemetry on clicking the Start Telemetry button", async () => {
    jest.setTimeout(30000)
    mock.onGet("/api/v1.0/get_Is_Ibof_OS_Running/").reply(200,
      { "RESULT": { "result": { "status": { "code": 0 }, "data": { "type": "NORMAL" } } }, "lastRunningTime": "Mon, 03 Aug 2020 05:01:20 PM IST", "timestamp": "Mon, 03 Aug 2020 05:01:13 PM IST", "code": "", "level": "", "value": "" }
    ).onPost("/api/v1/telemetry")
      .reply(200);
    const getSpy = jest.spyOn(axios, "post");
    renderComponent();
    await new Promise((r) => setTimeout(r, 5000));
    const { getByText } = wrapper;
    fireEvent.click(getByText("Start"));
    fireEvent.click(getByText("Yes"));
    expect(getSpy).toHaveBeenCalledWith("/api/v1/telemetry",
      {},
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "x-access-token": null,
        },
      });
  });

  it("should Stop Telemetry on clicking the Stop Telemetry button", async () => {
    mock.onGet("/api/v1/telemetry/properties")
      .reply(200, telemetryJson)
      .onDelete("/api/v1/telemetry")
      .reply(200);
    const getSpy = jest.spyOn(axios, "delete");
    renderComponent();
    const { getByText } = wrapper;
    fireEvent.click(await waitForElement(() => getByText("Stop")));
    fireEvent.click(getByText("Yes"));
    expect(getSpy).toHaveBeenCalledWith("/api/v1/telemetry",
      {
        headers: {
          "x-access-token": null,
        },
      });
  });

  it("should render the Grafana page", async () => {
    renderComponent();
    const { getByText, getByTitle } = wrapper;
    fireEvent.click(getByText("grafana"));
    expect(await waitForElement(() => getByTitle("iframe"))).toBeDefined();
  });

  it("should switch back to configuration page", async () => {
    renderComponent();
    const { getByText, getByTitle } = wrapper;
    fireEvent.click(getByText("grafana"));
    expect(await waitForElement(() => getByTitle("iframe"))).toBeDefined();
    fireEvent.click(getByText("configure"));
    expect(getByText("Start")).toBeDefined();
  });

  it("should Set the selected telemetry properties", async () => {
    mock.onGet("/api/v1/telemetry/properties")
      .reply(200, telemetryJson)
      .onDelete("/api/v1/telemetry")
      .reply(200)
      .onAny()
      .reply(200);
    const getSpy = jest.spyOn(axios, "post");
    renderComponent();
    const { getByTestId, getByText } = wrapper;
    fireEvent.click(await waitForElement(() => getByTestId("checkbox-Device")));
    fireEvent.click(await waitForElement(() => getByText("Device")));
    fireEvent.click(await waitForElement(() => getByTestId("checkbox-capacity_device")));
    fireEvent.click(getByText("Save"));
    expect(getSpy).toHaveBeenCalledWith("/api/v1/telemetry/properties", [{
      "category": "Common",
      "fields": [{
        "field": "uptime_sec",
        "isSet": false,
        "label": "Process Uptime Second"
      }]
    },
    {
      "category": "Device",
      "fields": [{
        "field": "bandwidth_device",
        "isSet": true,
        "label": "Bandwidth"
      },
      {
        "field": "capacity_device",
        "isSet": false,
        "label": "Capacity"
      }]
    }],
      { "headers": { "x-access-token": null } });
  });

  it("should Set all the telemetry properties", async () => {
    mock.onGet("/api/v1/telemetry/properties")
      .reply(200, telemetryJson)
      .onDelete("/api/v1/telemetry")
      .reply(200)
      .onAny()
      .reply(200);
    const getSpy = jest.spyOn(axios, "post");
    renderComponent();
    const { getByTestId, getByText } = wrapper;
    fireEvent.click(await waitForElement(() => getByTestId("checkbox-select-all")));
    fireEvent.click(getByText("Save"));
    expect(getSpy).toHaveBeenCalledWith("/api/v1/telemetry/properties", [{
      "category": "Common",
      "fields": [{
        "field": "uptime_sec",
        "isSet": true,
        "label": "Process Uptime Second"
      }]
    },
    {
      "category": "Device",
      "fields": [{
        "field": "bandwidth_device",
        "isSet": true,
        "label": "Bandwidth"
      },
      {
        "field": "capacity_device",
        "isSet": true,
        "label": "Capacity"
      }]
    }],
      { "headers": { "x-access-token": null } });
  });
});
