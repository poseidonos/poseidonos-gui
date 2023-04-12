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
import { Router } from 'react-router-dom';
import { Provider } from "react-redux";
import createSagaMiddleware from 'redux-saga'
import { I18nextProvider } from "react-i18next";
import { configureStore } from "@reduxjs/toolkit";
import { render, screen, fireEvent, cleanup, waitForElement } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter'
import { createMemoryHistory } from 'history';

import Dashboard from "./index";
import rootSaga from "../../sagas/indexSaga"
import storageReducer from "../../store/reducers/storageReducer";
import headerReducer from "../../store/reducers/headerReducer";
import dashboardReducer from "../../store/reducers/dashboardReducer";
import authenticationReducer from "../../store/reducers/authenticationReducer";
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
    const rootReducers = {
      headerReducer,
      storageReducer,
      dashboardReducer,
      authenticationReducer
    };
    const sagaMiddleware = createSagaMiddleware();
    store = configureStore({
      reducer: rootReducers,
      middleware: [sagaMiddleware]
    })
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
  // duplicate code 

  const configureJson = {
    ip: '127.0.0.1',
    isConfigured: true,
    port: '5555'
  }

  const posArrayJson = [
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

  const devices = [
    {
      "criticals": 0,
      "metrics": [
        {
          "name": "unvme-ns-0",
          "state": "nominal",
          "value": "312"
        },
        {
          "name": "unvme-ns-1",
          "state": "nominal",
          "value": "313"
        },
        {
          "name": "unvme-ns-10",
          "state": "nominal",
          "value": "313"
        },
        {
          "name": "unvme-ns-11",
          "state": "nominal",
          "value": "313"
        },
        {
          "name": "unvme-ns-12",
          "state": "nominal",
          "value": "313"
        },
        {
          "name": "unvme-ns-13",
          "state": "nominal",
          "value": "313"
        },
        {
          "name": "unvme-ns-14",
          "state": "nominal",
          "value": "313"
        },
        {
          "name": "unvme-ns-15",
          "state": "nominal",
          "value": "312"
        },
        {
          "name": "unvme-ns-16",
          "state": "nominal",
          "value": "314"
        },
        {
          "name": "unvme-ns-17",
          "state": "nominal",
          "value": "313"
        },
        {
          "name": "unvme-ns-18",
          "state": "nominal",
          "value": "314"
        },
        {
          "name": "unvme-ns-19",
          "state": "nominal",
          "value": "313"
        },
        {
          "name": "unvme-ns-2",
          "state": "nominal",
          "value": "313"
        },
        {
          "name": "unvme-ns-20",
          "state": "nominal",
          "value": "313"
        },
        {
          "name": "unvme-ns-21",
          "state": "nominal",
          "value": "314"
        },
        {
          "name": "unvme-ns-22",
          "state": "nominal",
          "value": "313"
        },
        {
          "name": "unvme-ns-23",
          "state": "nominal",
          "value": "313"
        },
        {
          "name": "unvme-ns-3",
          "state": "nominal",
          "value": "313"
        },
        {
          "name": "unvme-ns-4",
          "state": "nominal",
          "value": "313"
        },
        {
          "name": "unvme-ns-5",
          "state": "nominal",
          "value": "312"
        },
        {
          "name": "unvme-ns-6",
          "state": "nominal",
          "value": "313"
        },
        {
          "name": "unvme-ns-7",
          "state": "nominal",
          "value": "311"
        },
        {
          "name": "unvme-ns-8",
          "state": "nominal",
          "value": "314"
        },
        {
          "name": "unvme-ns-9",
          "state": "nominal",
          "value": "313"
        }
      ],
      "nominals": 24,
      "type": "Temperatures",
      "unit": "kelvin",
      "warnings": 0
    },
    {
      "criticals": 0,
      "metrics": [
        {
          "name": "unvme-ns-0",
          "state": "nominal",
          "value": "100"
        },
        {
          "name": "unvme-ns-1",
          "state": "nominal",
          "value": "100"
        },
        {
          "name": "unvme-ns-10",
          "state": "nominal",
          "value": "100"
        },
        {
          "name": "unvme-ns-11",
          "state": "nominal",
          "value": "100"
        },
        {
          "name": "unvme-ns-12",
          "state": "nominal",
          "value": "100"
        },
        {
          "name": "unvme-ns-13",
          "state": "nominal",
          "value": "100"
        },
        {
          "name": "unvme-ns-14",
          "state": "nominal",
          "value": "100"
        },
        {
          "name": "unvme-ns-15",
          "state": "nominal",
          "value": "100"
        },
        {
          "name": "unvme-ns-16",
          "state": "nominal",
          "value": "100"
        },
        {
          "name": "unvme-ns-17",
          "state": "nominal",
          "value": "100"
        },
        {
          "name": "unvme-ns-18",
          "state": "nominal",
          "value": "100"
        },
        {
          "name": "unvme-ns-19",
          "state": "nominal",
          "value": "100"
        },
        {
          "name": "unvme-ns-2",
          "state": "nominal",
          "value": "100"
        },
        {
          "name": "unvme-ns-20",
          "state": "nominal",
          "value": "100"
        },
        {
          "name": "unvme-ns-21",
          "state": "nominal",
          "value": "100"
        },
        {
          "name": "unvme-ns-22",
          "state": "nominal",
          "value": "100"
        },
        {
          "name": "unvme-ns-23",
          "state": "nominal",
          "value": "100"
        },
        {
          "name": "unvme-ns-3",
          "state": "nominal",
          "value": "100"
        },
        {
          "name": "unvme-ns-4",
          "state": "nominal",
          "value": "100"
        },
        {
          "name": "unvme-ns-5",
          "state": "nominal",
          "value": "100"
        },
        {
          "name": "unvme-ns-6",
          "state": "nominal",
          "value": "100"
        },
        {
          "name": "unvme-ns-7",
          "state": "nominal",
          "value": "100"
        },
        {
          "name": "unvme-ns-8",
          "state": "nominal",
          "value": "100"
        },
        {
          "name": "unvme-ns-9",
          "state": "nominal",
          "value": "100"
        }
      ],
      "nominals": 24,
      "type": "Spares",
      "unit": "available %",
      "warnings": 0
    }
  ];

  const hardwareJson = {
    devices: devices,
    errorInDevices: false,
    totalCriticals: 2,
    totalNominals: 91,
    totalWarnings: 0
  }
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
        configureJson
      )
      .onGet(`/api/v1.0/get_ip_and_mac`)
      .reply(200,
        {
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
        configureJson
      )
      .onGet(/api\/v1\/get_arrays\/*/)
      .reply(200, [array]);
    renderComponent();
    const { getByText, asFragment } = wrapper;
    const hostValueElement = await waitForElement(() => getByText("5.8TB"));
    expect(hostValueElement).toBeDefined();
    const hostTextElement = await waitForElement(() => getByText("Available for Volume Creation"));
    expect(hostTextElement).toBeDefined();
    expect(asFragment()).toMatchSnapshot();
  });

  it("should display volumes", async () => {
    const mock = new MockAdapter(axios);
    mock.onGet(`/api/v1/configure`)
      .reply(200,
        configureJson
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
    const { getByText, getByTestId } = wrapper;
    const volumesTab = await waitForElement(() => getByTestId("volume-tab"));
    fireEvent.click(volumesTab)
    const hostElement = await waitForElement(() => getByText("vol2"));
    expect(hostElement).toBeDefined();
  });

  it("should display used space and total space of volumess correctly", async () => {
    const mock = new MockAdapter(axios);
    mock.onGet(`/api/v1/configure`)
      .reply(200,
        configureJson
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
    const { getAllByText, getByTestId } = wrapper;
    const volumesTab = await waitForElement(() => getByTestId("volume-tab"));
    fireEvent.click(volumesTab)
    const sizeDisplayedVol1 = await waitForElement(() => getAllByText("1 GB"));
    expect(sizeDisplayedVol1.length).toBe(1);
    const sizeDisplayedVol2 = await waitForElement(() => getAllByText("10 GB"));
    expect(sizeDisplayedVol2.length).toBe(2);
  });

  it("should display volumes of an array correctly", async () => {
    const mock = new MockAdapter(axios);
    mock.onGet(`/api/v1/configure`)
      .reply(200,
        configureJson
      )
      .onGet(/api\/v1\/get_arrays\/*/)
      .reply(200, [array, { ...array, arrayname: "POSArray2" }])
      .onGet(`/api/v1/get_all_volumes/`)
      .reply(200, {
        "POSArray": posArrayJson,
        "POSArray2": posArrayJson
      }).onAny().reply(200, {});
    renderComponent();
    const { getAllByText, getByTestId } = wrapper;
    const volumesTab = await waitForElement(() => getByTestId("volume-tab"));
    fireEvent.click(volumesTab)
    const arraySelect = await waitForElement(() => getByTestId("dashboard-array-select"));
    fireEvent.change(arraySelect, { target: { value: "POSArray2" } });
    expect(await waitForElement(() => getAllByText("vol-1"))).toHaveLength(1);
    fireEvent.change(getByTestId("dashboard-array-select"), { target: { value: "all" } });
    expect(await waitForElement(() => getAllByText("vol-1"))).toHaveLength(2);
  });

  it("should display hardware health with no data", async () => {
    const mock = new MockAdapter(axios);
    mock.onGet(`/api/v1/configure`)
      .reply(200,
        configureJson
      )
      .onGet(/api\/v1\/get_arrays\/*/)
      .reply(200, [array]);
    renderComponent();
    const { getByText } = wrapper;
    const hostHeaderElement = await waitForElement(() => getByText("Hardware Health"));
    expect(hostHeaderElement).toBeDefined();
  });

  it("should display piechart", async () => {
    const mock = new MockAdapter(axios);
    mock.onGet(`/api/v1/configure`)
      .reply(200,
        configureJson
      )
      .onGet(`/api/v1/get_hardware_health`)
      .reply(200,
        hardwareJson
      )
      .onGet(/api\/v1\/get_arrays\/*/)
      .reply(200, [array]);
    jest.setTimeout(30000);
    renderComponent();
    const { getByText } = wrapper;
    const nominalsValueElement = await waitForElement(() => getByText("91"));
    expect(nominalsValueElement).toBeDefined();
  });

  it("should display device spare details, sort the table, close popup and return to summary", async () => {
    const mock = new MockAdapter(axios);
    mock.onGet(`/api/v1/configure`)
      .reply(200,
        configureJson
      )
      .onGet(`/api/v1/get_hardware_health`)
      .reply(200,
        {
          ...hardwareJson,
          devices: [
            {
              ...devices[0],
              nominals: 23,
              warnings: 1,
              criticals: 1
            },
            {
              ...devices[1],
              nominals: 1,
              warnings: 23,
              criticals: 1
            }
          ]
        }
      )
      .onGet(/api\/v1\/get_arrays\/*/)
      .reply(200, [array]);
    jest.setTimeout(30000);
    renderComponent();
    const { getAllByText, getByText, asFragment, getByTestId } = wrapper;
    const viewDetailsButton = await waitForElement(() => getAllByText("View Details"));
    fireEvent.click(viewDetailsButton[1]);
    const availableSpareHeader = await waitForElement(() => getByText("available %"));
    const tableHeaders = availableSpareHeader.closest('tr').children
    for (let i = 0; i < tableHeaders.length; i++) {
      fireEvent.click(tableHeaders[i].firstChild.lastChild);
    }
    const closePopup = await waitForElement(() => getByTestId("diskdetails-close"));
    fireEvent.click(closePopup);
  });

  it("should not display PieCharts if pos-exporter is not running", async () => {
    const mock = new MockAdapter(axios);
    mock.onGet(`/api/v1/configure`)
      .reply(200,
        configureJson
      )
      .onGet(`/api/v1/get_hardware_health`)
      .reply(200,
        {
          devices,
          errorInDevices: true,
          totalCriticals: 20,
          totalNominals: 4,
          totalWarnings: 8
        }
      )
      .onGet(/api\/v1\/get_arrays\/*/)
      .reply(200, [array])
      .onAny(200);
    renderComponent();
    const { getByTestId } = wrapper;
    const alertboxOkButton = await waitForElement(() => getByTestId("alertbox-ok"));
    fireEvent.click(alertboxOkButton)
  });

  it("should not display PieCharts if telemetry disk info is off", async () => {
    const mock = new MockAdapter(axios);
    mock.onGet(`/api/v1/configure`)
      .reply(200,
        configureJson
      )
      .onGet(`/api/v1/get_hardware_health`)
      .reply(200,
        {
          devices: [],
          errorInDevices: false,
          totalCriticals: 0,
          totalNominals: 0,
          totalWarnings: 0
        }
      )
      .onGet(/api\/v1\/get_arrays\/*/)
      .reply(200, [array])
      .onAny(200);
    renderComponent();
    const { getByTestId } = wrapper;
    const alertboxOkButton = await waitForElement(() => getByTestId("alertbox-ok"));
    fireEvent.click(alertboxOkButton)
  });

  it("should mock with different responses for hardware info", async () => {
    const configureResponse = {
      ip: '127.0.0.1',
      isConfigured: true,
      port: '5555'
    }
    const mock = new MockAdapter(axios);
    const initMockAndRender = (response) => {
      mock.reset();
      mock.onGet(`/api/v1/configure`)
        .reply(200, configureResponse)
        .onGet(`/api/v1/get_hardware_health`)
        .reply(200, response)
        .onGet(/api\/v1\/get_arrays\/*/)
        .reply(200, [array]);
      renderComponent();
    }

    jest.setTimeout(30000);
    let hwResponse = {
      devices: devices,
      errorInDevices: false,
      totalCriticals: 89,
      totalNominals: 2,
      totalWarnings: 2
    }
    initMockAndRender(hwResponse);


    const changedDevicesSparesMetrics = devices.map(d => {
      if (d.type !== "Spares") return d;
      return {
        ...d,
        metrics: [],
      }
    })
    hwResponse = {
      ...hwResponse,
      devices: changedDevicesSparesMetrics,
    }
    initMockAndRender(hwResponse);
  });

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
        configureJson
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
    const { getByTestId, getAllByText } = wrapper;
    jest.advanceTimersByTime(2000);
    await waitForElement(() => getAllByText("150"))
    const readIopsElement = await waitForElement(() => getByTestId("read-iops"));
    expect(readIopsElement.innerHTML).toBe("150");
  });

  it("should display bw value with units according to values", async () => {
    jest.useFakeTimers();
    const mock = new MockAdapter(axios);
    mock.onGet(`/api/v1/checktelemetry`)
      .reply(200,
        {
          isTelemetryEndpointUp: true
        }
      )
      .onGet(`/api/v1/configure`)
      .reply(200,
        configureJson
      )
      .onGet(/\/api\/v1\/perf\/all/)
      .reply(200,
        {
          bw_read: 1024,
          bw_total: 0,
          bw_write: 1073741824,
          iops_read: 154,
          iops_total: 0,
          iops_write: 154,
          latency_read: 154,
          latency_total: 0,
          latency_write: 154,
        }
      ).onGet(/api\/v1\/get_arrays\/*/)
      .reply(200, [])
      .onAny().reply(200, {});
    renderComponent();
    const { getByTestId, getByText } = wrapper;
    jest.advanceTimersByTime(2000);
    await waitForElement(() => getByText("1 KB"))
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

  it("should display the telemetry form", async () => {
    const mock = new MockAdapter(axios);
    mock.onGet(`/api/v1/configure`)
      .reply(200,
        {
          isConfigured: false
        }
      )
      .onAny()
      .reply(200);
    renderComponent();
    const { getByTestId, getByText } = wrapper;
    fireEvent.click(await waitForElement(() => getByTestId("btn-add-telemetry")));
    const telemetryIP = await waitForElement(() => getByTestId("telemetryIPInputPopup"));
    const telemetryPort = await waitForElement(() => getByTestId("telemetryPortInputPopup"));
    fireEvent.change(telemetryIP, { target: { value: "127.0.0.1" } });
    fireEvent.change(telemetryPort, { target: { value: "9090" } });
    fireEvent.click(getByTestId("btn-save-telemetry-config"));
    const editBtn = await waitForElement(() => getByTestId("btn-edit-telemetry"));
    expect(editBtn).toBeDefined();
  });
});
