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

import Dashboard from "./index";
import { createMount } from '@material-ui/core/test-utils';
import React from "react";
import { render, screen, fireEvent, cleanup, waitForElement, getNodeText } from "@testing-library/react";
import { Provider } from "react-redux";
import "@testing-library/jest-dom/extend-expect";
import { I18nextProvider } from "react-i18next";
//import axiosMock from 'axios';

import axios from 'axios';
import MockAdapter from 'axios-mock-adapter'
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';
import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import createSagaMiddleware from 'redux-saga'
import rootSaga from "../../sagas/indexSaga"
import storageReducer from "../../store/reducers/storageReducer";
import headerReducer from "../../store/reducers/headerReducer";
import dashboardReducer from "../../store/reducers/dashboardReducer";
import authenticationReducer from "../../store/reducers/authenticationReducer";
import configurationsettingReducer from "../../store/reducers/configurationsettingReducer";
import BMCAuthenticationReducer from "../../store/reducers/BMCAuthenticationReducer";
import i18n from "../../i18n";

jest.unmock('axios');

let EVENTS = {};
function emit(event, ...args) {
  EVENTS[event].forEach(func => func(...args));
}

const socket = {
  on(event, func) {
    if (EVENTS[event]) {
      return EVENTS[event].push(func);
    }
    EVENTS[event] = [func];
  },
  emit,
  io: {
    opts: {
      transports: []
    }
  }
};


describe("Dashboard", () => {
  let wrapper;
  let history;
  let store;

  beforeEach(() => {
    const sagaMiddleware = createSagaMiddleware();
    const rootReducers = combineReducers({
      headerReducer,
      storageReducer,
      dashboardReducer,
      configurationsettingReducer,
      BMCAuthenticationReducer,
      authenticationReducer
    });
    const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
    store = createStore(rootReducers, composeEnhancers(applyMiddleware(sagaMiddleware)))
    sagaMiddleware.run(rootSaga);
    const route = '/dashboard';
    history = createMemoryHistory({ initialEntries: [route] })


  });


  const renderComponent = () => {
    wrapper = render(
      <Router history={history}>
        <I18nextProvider i18n={i18n}>
          <Provider store={store}>
            {" "}
            <Dashboard />
          </Provider>
        </I18nextProvider>
      </Router>
    );
  };

  const array = {
    RAIDLevel: "5",
    arrayname: "POSArray",
    metadiskpath: [
      {
        deviceName: "uram0",
      },
    ],
    sparedisks: [
      {
        deviceName: "intel-unvmens-3",
      },
    ],
    storagedisks: [
      {
        deviceName: "intel-unvmens-0",
      },
      {
        deviceName: "intel-unvmens-1",
      },
      {
        deviceName: "intel-unvmens-2",
      },
      {
        deviceName: "intel-unvmens-4",
      },
    ],
    status: "Mounted",
    state: "EXIST",
    totalsize: 6357625339904,
    usedspace: 0,
  };

  afterEach(cleanup);

  it("matches snapshot", () => {
    renderComponent();
    const { asFragment } = wrapper;
    expect(asFragment()).toMatchSnapshot();
  });


  it("should display available storage value as received from API", async () => {
    renderComponent();
    const { getByTestId } = wrapper;
    const readStorageElement = await waitForElement(() => getByTestId("dashboard-no-array"));
    expect(readStorageElement.innerHTML).toBe("Arrays are not available");

  });



  it("should display system info as received from API", async () => {
    const mock = new MockAdapter(axios);
    mock.onGet(`/api/v1/configure`)
      .reply(200,
        {
          ip: '127.0.0.1',
          isConfigured: true,
          port: '5555'
        }
      )
      .onGet(`/api/v1.0/get_ip_and_mac`)
      .reply(200,
        {
          host: "init",
          ip: "10.1.11.91",
          mac: "00:50:56:ad:88:56"
        }

      );
    renderComponent();
    const { getByTestId } = wrapper;
    const ipElement = await waitForElement(() => getByTestId("dashboard-ip"));
    expect(ipElement.innerHTML).toContain("10.1.11.91");
  });

  it("should display storage details", async () => {
    const mock = new MockAdapter(axios);
    mock.onGet(`/api/v1/configure`)
      .reply(200,
        {
          ip: '127.0.0.1',
          isConfigured: true,
          port: '5555'
        }
      )
      .onGet(/api\/v1\/get_arrays\/*/)
      .reply(200, [array]);
    renderComponent();
    const { getByText, asFragment } = wrapper;
    const hostElement = await waitForElement(() => getByText("Available for Volume Creation: 6.36 TB"));
    expect(hostElement).toBeDefined();
    expect(asFragment()).toMatchSnapshot();
  });

  it("should display volumes", async () => {
    const mock = new MockAdapter(axios);
    mock.onGet(`/api/v1/configure`)
      .reply(200,
        {
          ip: '127.0.0.1',
          isConfigured: true,
          port: '5555'
        }
      )
      .onGet(`/api/v1/get_all_volumes/`)
      .reply(200, {
        "POSArray": [
          {
            id: '0',
            maxbw: 0,
            maxiops: 0,
            name: 'vol2',
            remain: 10737418240,
            status: 'Mounted',
            total: 10737418240,
            ip: '10.1.11.91',
            port: 'NA',
            subnqn: 'NA',
            description: "",
            unit: 'GB',
            size: '10',
            usedspace: 0
          },
          {
            id: '2',
            maxbw: 0,
            maxiops: 0,
            name: 'vol3',
            remain: 10737418240,
            status: 'Mounted',
            total: 10737418240,
            ip: '10.1.11.91',
            port: 'NA',
            subnqn: 'NA',
            description: "",
            unit: 'GB',
            size: '10',
            usedspace: 5
          }
        ]
      });
    renderComponent();
    const { getByText } = wrapper;
    const hostElement = await waitForElement(() => getByText("vol2"));
    expect(hostElement).toBeDefined();
  });

  it("should display used space and total space of volumess correctly", async () => {
    const mock = new MockAdapter(axios);
    mock.onGet(`/api/v1/configure`)
      .reply(200,
        {
          ip: '127.0.0.1',
          isConfigured: true,
          port: '5555'
        }
      )
      .onGet(/api\/v1\/get_arrays\/*/)
      .reply(200, [array])
      .onGet(`/api/v1/get_all_volumes/`)
      .reply(200, {
        "POSArray": [
          {
            id: '0',
            maxbw: 0,
            maxiops: 0,
            name: 'vol1',
            status: 'Mounted',
            total: 1073741824,
            ip: '10.1.11.91',
            port: 'NA',
            subnqn: 'NA',
            description: "",
            unit: 'GB',
            size: '10',
            usedspace: 0
          },
          {
            id: '1',
            maxbw: 0,
            maxiops: 0,
            name: 'vol2',
            remain: 0,
            status: 'Mounted',
            total: 10737418240,
            ip: '10.1.11.91',
            port: 'NA',
            subnqn: 'NA',
            description: "",
            unit: 'GB',
            size: '10',
            usedspace: 0
          }
        ]
      });
    renderComponent();
    const { getAllByText, asFragment } = wrapper;
    const sizeDisplayedVol1 = await waitForElement(() => getAllByText("1.07 GB"));
    expect(sizeDisplayedVol1.length).toBe(1);
    const sizeDisplayedVol2 = await waitForElement(() => getAllByText("10.74 GB"));
    expect(sizeDisplayedVol2.length).toBe(2);
  });

  //Disabling for PoC1
  // it("should display alerts", async () => {
  //   const mock = new MockAdapter(axios);
  //   mock.onGet(`/api/v1.0/get_alert_info`)
  //     .reply(200,{
  //       alerts: [
  //         {
  //           time: 104256782,
  //           level: 'CRITICAL',
  //           message: 'CPU Alert',
  //           duration: 10,
  //           host: 'iBoF'
  //         },
  //         {
  //           time: 104256783,
  //           level: 'NORMAL',
  //           message: 'iBoF Alert',
  //           duration: 10,
  //           host: 'iBoF'
  //         }
  //       ]
  //     });
  //   renderComponent();
  //   const { getByText } = wrapper;
  //   const hostElement1 = await waitForElement(() => getByText("CPU Alert"));
  //   expect(hostElement1).toBeDefined();
  //   const hostElement2 = await waitForElement(() => getByText("iBoF Alert"));
  //   expect(hostElement2).toBeDefined();
  // });

  it('should render button on resize', () => {
    // Change the viewport to 500px.
    global.innerWidth = 500;

    // Trigger the window resize event.
    global.dispatchEvent(new Event('resize'));

    renderComponent();
    const { getByTestId } = wrapper;
    expect(getByTestId("sidebar-toggle")).toBeDefined();
    fireEvent.click(getByTestId("sidebar-toggle"));
    expect(getByTestId("help-link")).toHaveTextContent("Help");
  });

  it("should display iops value as received from API", async () => {
    jest.useFakeTimers();
    const mock = new MockAdapter(axios);
    mock.onGet(`/api/v1/configure`)
      .reply(200,
        {
          ip: '127.0.0.1',
          isConfigured: true,
          port: '5555'
        }
      )
      .onGet(/\/api\/v1\/perf\/all/)
      .reply(200,
        {
          bw_read: 0,
          bw_total: 0,
          bw_write: 0,
          iops_read: 154,
          iops_total: 0,
          iops_write: 154
        }
      ).onGet(/api\/v1\/get_arrays\/*/)
      .reply(200, [])
      .onAny().reply(200, {});
    renderComponent();
    const { getByTestId } = wrapper;
    jest.advanceTimersByTime(2000);
    const readIopsElement = await waitForElement(() => getByTestId("read-iops"));
    expect(readIopsElement.innerHTML).toBe("150");
  });

  it("should display bw value with units according to values", async () => {
    jest.useFakeTimers();
    const mock = new MockAdapter(axios);
    mock.onGet(`/api/v1/configure`)
      .reply(200,
        {
          ip: '127.0.0.1',
          isConfigured: true,
          port: '5555'
        }
      )
      .onGet(/\/api\/v1\/perf\/all/)
      .reply(200,
        {
          bw_read: 1024,
          bw_total: 0,
          bw_write: 1073741824,
          iops_read: 154,
          iops_total: 0,
          iops_write: 154
        }
      ).onGet(/api\/v1\/get_arrays\/*/)
      .reply(200, [])
      .onAny().reply(200, {});
    renderComponent();
    const { getByTestId } = wrapper;
    jest.advanceTimersByTime(2000);
    const readBwElement = await waitForElement(() => getByTestId("read-bandwidth"));
    expect(readBwElement.innerHTML).toBe("1 KB");
    const writeBwElement = await waitForElement(() => getByTestId("write-bandwidth"));
    expect(writeBwElement.innerHTML).toBe("1 GB");

  });

  it("should display the dashboard page with path", async () => {
    const { location } = window;
    delete window.location;
    window.location = { href: "http://localhost/dashboard" };
    renderComponent();
    const { getByText } = wrapper;
    expect(await waitForElement(() => getByText("Dashboard"))).toBeDefined();
    window.location = location;
  });

  it("should display volumes of an array correctly", async () => {
    const mock = new MockAdapter(axios);
    mock.onGet(`/api/v1/configure`)
      .reply(200,
        {
          ip: '127.0.0.1',
          isConfigured: true,
          port: '5555'
        }
      )
      .onGet(/api\/v1\/get_arrays\/*/)
      .reply(200, [array, { ...array, arrayname: "POSArray2" }])
      .onGet(`/api/v1/get_all_volumes/`)
      .reply(200, {
        "POSArray": [
          {
            id: '0',
            maxbw: 0,
            maxiops: 0,
            name: 'vol-1',
            status: 'Mounted',
            total: 1073741824,
            ip: '10.1.11.91',
            port: 'NA',
            subnqn: 'NA',
            description: "",
            unit: 'GB',
            size: '10',
            usedspace: 0
          },
          {
            id: '1',
            maxbw: 0,
            maxiops: 0,
            name: 'vol-2',
            remain: 0,
            status: 'Mounted',
            total: 10737418240,
            ip: '10.1.11.91',
            port: 'NA',
            subnqn: 'NA',
            description: "",
            unit: 'GB',
            size: '10',
            usedspace: 0
          }
        ],
        "POSArray2": [
          {
            id: '0',
            maxbw: 0,
            maxiops: 0,
            name: 'vol-1',
            status: 'Mounted',
            total: 1073741824,
            ip: '10.1.11.91',
            port: 'NA',
            subnqn: 'NA',
            description: "",
            unit: 'GB',
            size: '10',
            usedspace: 0
          },
          {
            id: '1',
            maxbw: 0,
            maxiops: 0,
            name: 'vol-2',
            remain: 0,
            status: 'Mounted',
            total: 10737418240,
            ip: '10.1.11.91',
            port: 'NA',
            subnqn: 'NA',
            description: "",
            unit: 'GB',
            size: '10',
            usedspace: 0
          }
        ]
      }).onAny().reply(200, {});
    renderComponent();
    const { getByText, getAllByText, getByRole, getByTestId, queryByText, asFragment } = wrapper;
    const arraySelect = await waitForElement(() => getByTestId("dashboard-array-select"));
    fireEvent.change(await waitForElement(() => getByTestId("dashboard-array-select")), { target: { value: "POSArray2" } });
    expect(await waitForElement(() => getAllByText("vol-1"))).toHaveLength(1);
    fireEvent.change(getByTestId("dashboard-array-select"), { target: { value: "all" } });
    expect(await waitForElement(() => getAllByText("vol-1"))).toHaveLength(2);
  });


  // it("should display health metrics as received from API", async () => {
  //   jest.useFakeTimers();
  //   const mock = new MockAdapter(axios);
  //   mock.onGet(/\/api\/v1\.0\/health_status/)
  //     .reply(200,
  //       {"isHealthy":false,"statuses":[{"arcsArr":[0.4,0.4,0.2],"id":'cpu_status','percentage':0.55, 'value':'55', 'unit':'%', 'label':"CPU UTILIZATION"}]}
  //     )
  //   renderComponent();
  //   jest.advanceTimersByTime(2000);
  //   const { getByTestId } = wrapper;
  // });
});
