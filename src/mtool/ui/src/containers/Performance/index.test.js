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
 *     * Neither the name of Intel Corporation nor the names of its
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
import rootSaga from "../../sagas/indexSaga";
import headerReducer from "../../store/reducers/headerReducer";
import performanceReducer from "../../store/reducers/performanceReducer";
import storageReducer from "../../store/reducers/storageReducer";
import hardwareSensorReducer from "../../store/reducers/hardwareSensorReducer";
import configurationsettingReducer from "../../store/reducers/configurationsettingReducer";
import BMCAuthenticationReducer from "../../store/reducers/BMCAuthenticationReducer"
import Performance from "./index";
import i18n from "../../i18n";
import {
  fetchReadBandwidth,
  fetchWriteBandwidth,
  fetchReadIops,
  fetchWriteIops,
  fetchCpuUsage
} from "../../sagas/performanceSaga";
import { createMockTask } from "@redux-saga/testing-utils";
import * as actionTypes from "../../store/actions/actionTypes";
import {
  call,
  take,
  takeEvery,
  put,
  cancelled,
  cancel
} from "redux-saga/effects";

jest.unmock("axios");

describe("Performance", () => {
  let wrapper;
  let history;
  let store;
  let mock;

  beforeEach(() => {
    const sagaMiddleware = createSagaMiddleware();
    const rootReducers = combineReducers({
      // headerLanguageReducer,
      headerReducer,
      performanceReducer,
      storageReducer,
      configurationsettingReducer,
      hardwareSensorReducer,
      BMCAuthenticationReducer
    });
    const composeEnhancers =
      window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
    store = createStore(
      rootReducers,
      composeEnhancers(applyMiddleware(sagaMiddleware))
    );
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
            <Performance level='volume'/>
          </Provider>
        </I18nextProvider>
      </Router>
    );
  };

  afterEach(cleanup);

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

  it("renders array level graphs for last 1m", async () => {
    mock.onGet(/api\/v1\/get_arrays\/*/)
    .reply(200, [array])
    .onGet(/api\/v1\/readiops\/arrays*/)
      .reply(200, {
        res: [
          [{
            time: 12345,
            value: 20
          }],
          [{
            startTime: 12344,
            endTime: 12349
          }]
        ]
      })
      .onGet(/api\/v1\/writeiops\/arrays*/)
      .reply(200, {
        res: [
          [{
            time: 123456,
            value: 10
          }],
          [{
            startTime: 12344,
            endTime: 12349
          }]
        ]
      })
      .onGet(/api\/v1\/readbw\/arrays*/)
      .reply(200, {
        res: [
          [{
            time: 123456,
            value: 100
          }],
          [{
            startTime: 12344,
            endTime: 12349
          }]
        ]
      })

      .onGet(/api\/v1\/latency\/arrays*/)
      .reply(200, {
        res: [
          [{
            time: 123456,
            value: 30
          }],
          [{
            startTime: 12344,
            endTime: 12349
          }]
        ]
      })

      .onGet(/api\/v1\/writebw\/arrays*/)
      .reply(200, {
        res: [
          [{
            time: 123456,
            value: 35
          }],
          [{
            startTime: 12344,
            endTime: 12349
          }]
        ]
      });

    renderComponent();
    const { asFragment, getByTestId } = wrapper;

    await act(async () => {
      await waitForElement(() => getByTestId("readBandwidth"));
      //   global.document = {
      //       ...global.document,
      //     getElementsByTagName: () => {
      //         return [{
      //             getBoundingClientRect: () => {
      //                 return {
      //                     left: 100,
      //                     right: 500
      //                 }
      //             }
      //         }]
      //     }
      //   }
      const readBandwidthScatter = await waitForElement(() =>
        getByTestId("readBandwidthScatter")
      );
      //  fireEvent.mouseOver(readBandwidthScatter, {target: { getBoundingClientRect: () => {return {left: 100}}}});
      fireEvent.mouseOver(readBandwidthScatter);
      fireEvent.mouseOut(readBandwidthScatter);
      await new Promise(resolve => setInterval(resolve, 2000));
    });

    expect(asFragment()).toMatchSnapshot();
  });

  it("renders volume level read bandwidth graphs for last 1m", async () => {
    mock.onGet(/api\/v1\/get_arrays\/*/)
    .reply(200, [array])
    .onGet(/redfish\/v1\/StorageServices\/POSArray\/Volumes$/).reply(200, {
      Members: [{
        "@odata.id": "/redfish/v1/StorageServices/1/Volumes/0",
        "@odata.id": "/redfish/v1/StorageServices/1/Volumes/1"
      }]
    })
      .onGet(/redfish\/v1\/StorageServices\/1\/Volumes\/0$/).reply(200, {
        Name: "vol1",
        Id: "0",
        Capacity: {
          Data: {
            AllocatedBytes: 100,
            ConsumedBytes: 10
          }
        },
        Oem: {
          MaxIOPS: 10,
          MaxBW: 10,
        },
        Status: {
          Oem: {
            VolumeStatus: "Mounted"
          }
        }
      })
      .onGet(/redfish\/v1\/StorageServices\/1\/Volumes\/1$/).reply(200, {
        Name: "vol2",
        Id: "1",
        Capacity: {
          Data: {
            AllocatedBytes: 100,
            ConsumedBytes: 10
          }
        },
        Oem: {
          MaxIOPS: 10,
          MaxBW: 10,
        },
        Status: {
          Oem: {
            VolumeStatus: "Mounted"
          }
        }
      })
      .onGet(/api\/v1\/readiops\/arrays*/)
      .reply(200, {
        res: [
          [{
            time: 12345,
            value: 20
          }],
          [{
            startTime: 12344,
            endTime: 12349
          }]
        ]
      })
      .onGet(/api\/v1\/writeiops\/arrays*/)
      .reply(200, {
        res: [
          [{
            time: 123456,
            value: 10
          }],
          [{
            startTime: 12344,
            endTime: 12349
          }]
        ]
      })
      .onGet(/api\/v1\/readbw\/arrays*/)
      .reply(200, {
        res: [
          [{
            time: 123456,
            value: 100
          }],
          [{
            startTime: 12344,
            endTime: 12349
          }]
        ]
      })

      .onGet(/api\/v1\/latency\/arrays*/)
      .reply(200, {
        res: [
          [{
            time: 123456,
            value: 30
          }],
          [{
            startTime: 12344,
            endTime: 12349
          }]
        ]
      })

      .onGet(/api\/v1\/writebw\/arrays*/)
      .reply(200, {
        res: [
          [{
            time: 123456,
            value: 35
          }],
          [{
            startTime: 12344,
            endTime: 12349
          }]
        ]
      });

    renderComponent();
    jest.setTimeout(30000);
    const { asFragment, getByTestId } = wrapper;

    const levelSelect = await waitForElement(() => getByTestId("levelSelect"));
    fireEvent.click(levelSelect);
    try {
      fireEvent.click(await waitForElement(() => getByTestId("volumeMenuItem")));
    } catch {
      const levelInput = await waitForElement(() => getByTestId("levelInput"));
      fireEvent.change(levelInput, { target: { value: 'volume' } });
    }
    expect(asFragment()).toMatchSnapshot();
    const volReadBw = await waitForElement(() => getByTestId("readBandwidth-vol"));
    expect(volReadBw).toBeDefined();
  });

  it("renders volume level, all volume and array level graphs for last 1m", async () => {
    mock.onGet(/api\/v1\/get_arrays\/*/)
    .reply(200, [array])
    .onGet(/redfish\/v1\/StorageServices\/POSArray\/Volumes$/).reply(200, {
      Members: [{
        "@odata.id": "/redfish/v1/StorageServices/1/Volumes/0",
        "@odata.id": "/redfish/v1/StorageServices/1/Volumes/1"
      }]
    })
      .onGet(/redfish\/v1\/StorageServices\/1\/Volumes\/0$/).reply(200, {
        Name: "vol1",
        Id: "0",
        Capacity: {
          Data: {
            AllocatedBytes: 100,
            ConsumedBytes: 10
          }
        },
        Oem: {
          MaxIOPS: 10,
          MaxBW: 10,
        },
        Status: {
          Oem: {
            VolumeStatus: "Mounted"
          }
        }
      })
      .onGet(/redfish\/v1\/StorageServices\/1\/Volumes\/1$/).reply(200, {
        Name: "vol2",
        Id: "1",
        Capacity: {
          Data: {
            AllocatedBytes: 100,
            ConsumedBytes: 10
          }
        },
        Oem: {
          MaxIOPS: 10,
          MaxBW: 10,
        },
        Status: {
          Oem: {
            VolumeStatus: "Mounted"
          }
        }
      })
      .onGet(/api\/v1\/readbw\/arrays*/)
      .reply(200, {
        res: [
          [{
            time: 123456,
            value: 0
          }], [{
            startTime: 123454,
            endTime: 123457
          }]
        ]
      })
      .onAny().reply(500);

    renderComponent();
    jest.setTimeout(30000);
    const { asFragment, getByTestId } = wrapper;

    const levelSelect = await waitForElement(() => getByTestId("levelSelect"));
    fireEvent.click(levelSelect);
    const levelInput = await waitForElement(() => getByTestId("levelInput"));
    try {
      fireEvent.click(await waitForElement(() => getByTestId("volumeMenuItem")));
    } catch {
      fireEvent.change(levelInput, { target: { value: 'volume' } });
    }
    const volumeSelect = await waitForElement(() => getByTestId("volumeSelect"));
    fireEvent.click(volumeSelect);
    const volumeInput = await waitForElement(() => getByTestId("volumeInput"));
    try {
      const volume1 = await waitForElement(() => getByTestId("vol2"));
      fireEvent.click(volume1);
    } catch {
      fireEvent.change(volumeInput, {target: {value: '1'}});
    }
    const volReadBw = await waitForElement(() => getByTestId("readBandwidth-vol"));
    expect(volReadBw).toBeDefined();
    expect(asFragment()).toMatchSnapshot();
    fireEvent.click(volumeSelect);
    try {
      fireEvent.click(await waitForElement(() => getByTestId("all-volume")));
    } catch {
      fireEvent.change(volumeInput, {target: {value: 'all-volumes'}});
    }
    fireEvent.change(volumeInput, {target: {value: 'all-volumes'}});
    const allVolReadBw = await waitForElement(() => getByTestId("readBandwidth-vol"));
    expect(allVolReadBw).toBeDefined();
    fireEvent.click(levelSelect);
    try {
      fireEvent.click(await waitForElement(() => getByTestId("arrayMenuItem")));
    } catch {
      fireEvent.change(levelInput, { target: { value: 'array' } });
    }
    const arrayReadBw = await waitForElement(() => getByTestId("readBandwidth"));
    expect(arrayReadBw).toBeDefined();
  });


  it("renders volume level write bandwidth graphs for last 1m", async () => {
    mock.onGet(/api\/v1\/get_arrays\/*/)
    .reply(200, [array])
    .onGet(/redfish\/v1\/StorageServices\/POSArray\/Volumes$/).reply(200, {
      Members: [{
        "@odata.id": "/redfish/v1/StorageServices/1/Volumes/0",
        "@odata.id": "/redfish/v1/StorageServices/1/Volumes/1"
      }]
    })
      .onGet(/redfish\/v1\/StorageServices\/1\/Volumes\/0$/).reply(200, {
        Name: "vol1",
        Id: "0",
        Capacity: {
          Data: {
            AllocatedBytes: 100,
            ConsumedBytes: 10
          }
        },
        Oem: {
          MaxIOPS: 10,
          MaxBW: 10,
        },
        Status: {
          Oem: {
            VolumeStatus: "Mounted"
          }
        }
      })
      .onGet(/redfish\/v1\/StorageServices\/1\/Volumes\/1$/).reply(200, {
        Name: "vol2",
        Id: "1",
        Capacity: {
          Data: {
            AllocatedBytes: 100,
            ConsumedBytes: 10
          }
        },
        Oem: {
          MaxIOPS: 10,
          MaxBW: 10,
        },
        Status: {
          Oem: {
            VolumeStatus: "Mounted"
          }
        }
      })
      .onGet(`/api/v1/writebw/arrays/volumes?arrayids=0&volumeids=0&time=1m`)
      .reply(200, {
        res: [
          [{
            time: 123456,
            value: 0
          }],
          [{
            startTime: 123455,
            endTime: 123457
          }]
        ]
      })
      .onGet(`/api/v1/writebw/arrays/volumes?arrayids=0&volumeids=1&time=1m`)
      .reply(200, {
        res: [
          [{
            time: 123456,
            value: 0
          }],
          [{
            startTime: 123455,
            endTime: 123457
          }]
        ]
      })
      .onGet(/api\/v1\/writebw\/*/)
      .reply(200, {
        res: [
          [{
            time: 123456,
            value: 0
          }],
          [{
            startTime: 123455,
            endTime: 123457
          }]
        ]
      })

    renderComponent();
    jest.setTimeout(30000);
    const { asFragment, getByTestId } = wrapper;

    const levelSelect = await waitForElement(() => getByTestId("levelSelect"));
    fireEvent.click(levelSelect);
    try {
      fireEvent.click(await waitForElement(() => getByTestId("volumeMenuItem")));
    } catch {
      const levelInput = await waitForElement(() => getByTestId("levelInput"));
      fireEvent.change(levelInput, { target: { value: 'volume' } });
    }
    const measurementSelect = await waitForElement(() => getByTestId("measurementSelect"));
    fireEvent.click(measurementSelect);
    try {
      fireEvent.click(await waitForElement(() => getByTestId("write_bw")));
    } catch {
      const measurementInput = await waitForElement(() => getByTestId("measurementInput"));
      fireEvent.change(measurementInput, {target: {value: 'write_bw'}});
    }
    expect(asFragment()).toMatchSnapshot();
    const volWriteBw = await waitForElement(() => getByTestId("writeBandwidth-vol"));
    expect(volWriteBw).toBeDefined();
  });

  it("renders volume level read iops graphs for last 1m", async () => {
    mock.onGet(/api\/v1\/get_arrays\/*/)
    .reply(200, [array])
    .onGet(/redfish\/v1\/StorageServices\/POSArray\/Volumes$/).reply(200, {
      Members: [{
        "@odata.id": "/redfish/v1/StorageServices/1/Volumes/0",
        "@odata.id": "/redfish/v1/StorageServices/1/Volumes/1"
      }]
    })
      .onGet(/redfish\/v1\/StorageServices\/1\/Volumes\/0$/).reply(200, {
        Name: "vol1",
        Id: "0",
        Capacity: {
          Data: {
            AllocatedBytes: 100,
            ConsumedBytes: 10
          }
        },
        Oem: {
          MaxIOPS: 10,
          MaxBW: 10,
        },
        Status: {
          Oem: {
            VolumeStatus: "Mounted"
          }
        }
      })
      .onGet(/redfish\/v1\/StorageServices\/1\/Volumes\/1$/).reply(200, {
        Name: "vol2",
        Id: "1",
        Capacity: {
          Data: {
            AllocatedBytes: 100,
            ConsumedBytes: 10
          }
        },
        Oem: {
          MaxIOPS: 10,
          MaxBW: 10,
        },
        Status: {
          Oem: {
            VolumeStatus: "Mounted"
          }
        }
      })
      .onGet(`/api/v1/readiops/arrays/volumes?arrayids=0&volumeids=0&time=1m`)
      .reply(200, {
        res: [
          [{
            time: 123456,
            value: 0
          }],
          [{
            startTime: 123455,
            endTime: 123457
          }]
        ]
      })
      .onGet(`/api/v1/readiops/arrays/volumes?arrayids=0&volumeids=1&time=1m`)
      .reply(200, {
        res: [
          [{
            time: 123456,
            value: 0
          }],
          [{
            startTime: 123455,
            endTime: 123457
          }]
        ]
      })

    renderComponent();
    jest.setTimeout(30000);
    const { asFragment, getByTestId } = wrapper;

    const levelSelect = await waitForElement(() => getByTestId("levelSelect"));
    fireEvent.click(levelSelect);
    try {
      fireEvent.click(await waitForElement(() => getByTestId("volumeMenuItem")));
    } catch {
      const levelInput = await waitForElement(() => getByTestId("levelInput"));
      fireEvent.change(levelInput, { target: { value: 'volume' } });
    }
    const measurementSelect = await waitForElement(() => getByTestId("measurementSelect"));
    fireEvent.click(measurementSelect);
    expect(asFragment()).toMatchSnapshot();
    try {
      fireEvent.click(await waitForElement(() => getByTestId("read_iops")));
    } catch {
      const measurementInput = await waitForElement(() => getByTestId("measurementInput"));
      fireEvent.change(measurementInput, {target: {value: 'read_iops'}});
    }
    
    const volReadIOPS = await waitForElement(() => getByTestId("readIOPS-vol"));
    expect(volReadIOPS).toBeDefined();
  });

  it("renders volume level write iops graphs for last 1m", async () => {
    mock.onGet(/api\/v1\/get_arrays\/*/)
      .reply(200, [array])
      .onGet(/redfish\/v1\/StorageServices\/POSArray\/Volumes$/).reply(200, {
        Members: [{
          "@odata.id": "/redfish/v1/StorageServices/1/Volumes/0",
          "@odata.id": "/redfish/v1/StorageServices/1/Volumes/1"
        }]
      })
      .onGet(/redfish\/v1\/StorageServices\/1\/Volumes\/0$/).reply(200, {
        Name: "vol1",
        Id: "0",
        Capacity: {
          Data: {
            AllocatedBytes: 100,
            ConsumedBytes: 10
          }
        },
        Oem: {
          MaxIOPS: 10,
          MaxBW: 10,
        },
        Status: {
          Oem: {
            VolumeStatus: "Mounted"
          }
        }
      })
      .onGet(/redfish\/v1\/StorageServices\/1\/Volumes\/1$/).reply(200, {
        Name: "vol2",
        Id: "1",
        Capacity: {
          Data: {
            AllocatedBytes: 100,
            ConsumedBytes: 10
          }
        },
        Oem: {
          MaxIOPS: 10,
          MaxBW: 10,
        },
        Status: {
          Oem: {
            VolumeStatus: "Mounted"
          }
        }
      })
      .onGet(`/api/v1/writeiops/arrays/volumes?arrayids=0&volumeids=0&time=1m`)
      .reply(200, {
        res: [
          [{
            time: 123456,
            value: 0
          }],
          [{
            startTime: 123455,
            endTime: 123457
          }]
        ]
      })
      .onGet(`/api/v1/writeiops/arrays/volumes?arrayids=0&volumeids=1&time=1m`)
      .reply(200, {
        res: [
          [{
            time: 123456,
            value: 0
          }],
          [{
            startTime: 123455,
            endTime: 123457
          }]
        ]
      })

    renderComponent();
    jest.setTimeout(30000);
    const { asFragment, getByTestId } = wrapper;

    const levelSelect = await waitForElement(() => getByTestId("levelSelect"));
    fireEvent.click(levelSelect);
    try {
      fireEvent.click(await waitForElement(() => getByTestId("volumeMenuItem")));
    } catch {
      const levelInput = await waitForElement(() => getByTestId("levelInput"));
      fireEvent.change(levelInput, { target: { value: 'volume' } });
    }
    const measurementSelect = await waitForElement(() => getByTestId("measurementSelect"));
    fireEvent.click(measurementSelect);
    try {
      fireEvent.click(await waitForElement(() => getByTestId("write_iops")));
    } catch {
      const measurementInput = await waitForElement(() => getByTestId("measurementInput"));
      fireEvent.change(measurementInput, { target: { value: 'write_iops' } });
    }
    expect(asFragment()).toMatchSnapshot();

    const volWriteIOPS = await waitForElement(() => getByTestId("writeIOPS-vol"));
    expect(volWriteIOPS).toBeDefined();
  });

  it("renders volume level latency graphs for last 1m", async () => {
    mock.onGet(/api\/v1\/get_arrays\/*/)
      .reply(200, [array])
      .onGet(/redfish\/v1\/StorageServices\/POSArray\/Volumes$/).reply(200, {
        Members: [{
          "@odata.id": "/redfish/v1/StorageServices/1/Volumes/0",
          "@odata.id": "/redfish/v1/StorageServices/1/Volumes/1"
        }]
      })
      .onGet(/redfish\/v1\/StorageServices\/1\/Volumes\/0$/).reply(200, {
        Name: "vol1",
        Id: "0",
        Capacity: {
          Data: {
            AllocatedBytes: 100,
            ConsumedBytes: 10
          }
        },
        Oem: {
          MaxIOPS: 10,
          MaxBW: 10,
        },
        Status: {
          Oem: {
            VolumeStatus: "Mounted"
          }
        }
      })
      .onGet(/redfish\/v1\/StorageServices\/1\/Volumes\/1$/).reply(200, {
        Name: "vol2",
        Id: "1",
        Capacity: {
          Data: {
            AllocatedBytes: 100,
            ConsumedBytes: 10
          }
        },
        Oem: {
          MaxIOPS: 10,
          MaxBW: 10,
        },
        Status: {
          Oem: {
            VolumeStatus: "Mounted"
          }
        }
      })
      .onGet('/api/v1/latency/arrays/volumes?arrayids=0&volumeids=0&time=1m')
      .reply(200, {
        res: [
          [{
            time: 123456,
            value: 0
          }],
          [{
            startTime: 123455,
            endTime: 123457
          }]
        ]
      })
      .onGet('/api/v1/latency/arrays/volumes?arrayids=0&volumeids=1&time=1m')
      .reply(200, {
        res: [
          [{
            time: 123456,
            value: 0
          }],
          [{
            startTime: 123455,
            endTime: 123457
          }]
        ]
      })

    renderComponent();
    jest.setTimeout(30000);
    const { asFragment, getByTestId, getByText } = wrapper;

    const levelSelect = await waitForElement(() => getByTestId("levelSelect"));
    fireEvent.click(levelSelect);
    try {
      fireEvent.click(await waitForElement(() => getByTestId("volumeMenuItem")));
    } catch {
      const levelInput = await waitForElement(() => getByTestId("levelInput"));
      fireEvent.change(levelInput, { target: { value: 'volume' } });
    }
    const measurementSelect = await waitForElement(() => getByTestId("measurementSelect"));
    fireEvent.click(measurementSelect);
    try {
      fireEvent.click(await waitForElement(() => getByTestId("latency")));
    } catch {
      const measurementInput = await waitForElement(() => getByTestId("measurementInput"));
      fireEvent.change(measurementInput, { target: { value: 'latency' } });
    }
    expect(asFragment()).toMatchSnapshot();
    const volLatency = await waitForElement(() => getByTestId("latency-vol"));
    expect(volLatency).toBeDefined();
    expect(getByText(/Latency \(ms\)/)).toBeDefined();
  });

  it("renders system level cpu graphs for last 1m", async () => {
    mock.onGet('/api/v1.0/usage_user/1m')
      .reply(200, [
        [{"cpuUsagePercent":10.332944480921938,"time":1624553769000000000},
        {"cpuUsagePercent":11.382541850481546,"time":1624553826000000000}],
        [{"endTime":1624553828839543903,"startTime":1624553768839543903}]
      ]);

    renderComponent();
    jest.setTimeout(30000);
    const { asFragment, getByTestId } = wrapper;

    const levelSelect = await waitForElement(() => getByTestId("levelSelect"));
    fireEvent.click(levelSelect);
    try {
      fireEvent.click(await waitForElement(() => getByTestId("systemMenuItem")));
    } catch {
      const levelInput = await waitForElement(() => getByTestId("levelInput"));
      fireEvent.change(levelInput, { target: { value: 'system' } });
    }
    expect(asFragment()).toMatchSnapshot();
    
    const cpuGraph = await waitForElement(() => getByTestId("cpuusage"));
    expect(cpuGraph).toBeDefined();
  });

  it("displays array level details for last 7 days", async () => {
    mock
      .onGet(`/api/v1.0/iops_read/7d/array`)
      .reply(200, {
        res: [
          {
            time: 12345,
            perf_data_0_tid_arr_0_aid_arr_0_iops_read: 456,
            perf_data_1_tid_arr_1_aid_arr_1_iops_read: 123
          }
        ],
        aid: [
          {
            perf_data_0_tid_arr_0_aid: 0,
            perf_data_1_tid_arr_1_aid: 1
          }
        ]
      })
      .onGet(`/api/v1.0/iops_write/7d/array`)
      .reply(200, {
        res: [
          {
            time: 123456,
            perf_data_0_tid_arr_0_aid_arr_0_iops_write: 872,
            perf_data_1_tid_arr_1_aid_arr_1_iops_write: 127
          }
        ],
        aid: [
          {
            perf_data_0_tid_arr_0_aid: 0,
            perf_data_1_tid_arr_1_aid: 1
          }
        ]
      })
      .onGet(`/api/v1.0/bw_read/7d/array`)
      .reply(200, {
        res: [
          {
            time: 123456,
            perf_data_0_tid_arr_0_aid_arr_0_bw_read: 122,
            perf_data_1_tid_arr_1_aid_arr_1_bw_read: 187
          }
        ],
        aid: [
          {
            perf_data_0_tid_arr_0_aid: 0,
            perf_data_1_tid_arr_1_aid: 1
          }
        ]
      })

      .onGet(`/api/v1.0/latency/7d/array`)
      .reply(200, {
        res: [
          {
            time: 12345,
            lat_data_0_tid_arr_0_aid_arr_0_timelag_arr_0_mean: 456,
            lat_data_1_tid_arr_1_aid_arr_1_timelag_arr_0_mean: 123
          }
        ],
        aid: [
          {
            lat_data_0_tid_arr_0_aid_arr_0_aid: 0,
            lat_data_1_tid_arr_1_aid_arr_1_aid: 1
          }
        ]
      })

      .onGet(`/api/v1.0/bw_write/7d/array`)
      .reply(200, {
        res: [
          {
            time: 123456,
            perf_data_0_tid_arr_0_aid_arr_0_bw_write: 622,
            perf_data_1_tid_arr_1_aid_arr_1_bw_write: 197
          }
        ],
        aid: [
          {
            perf_data_0_tid_arr_0_aid: 0,
            perf_data_1_tid_arr_1_aid: 1
          }
        ]
      });
    await act(async () => {
      renderComponent();
    });
    const { getByTestId } = wrapper;

    await act(async () => {
      const intervalSelect = await waitForElement(() =>
        getByTestId("intervalSelect")
      );
      fireEvent.click(intervalSelect);
      try {
        const lastSevenDay = await waitForElement(() => getByTestId("7d"));
        fireEvent.click(lastSevenDay);
      } catch {
        fireEvent.change(await waitForElement(() => getByTestId("timeInput")),
          {target: {value: "7d"}});
      }
      const intervalInput = await waitForElement(() =>
        getByTestId("timeInput")
      );
      expect(intervalInput.value).toBe("7d");
    });
  });

  it("displays array level details 1", async () => {
    mock
      .onGet(`/api/v1.0/disk_used_percent/1m/array`)
      .reply(200, [{ used_percent: 10, time: 789 }])

      .onGet(`/api/v1.0/disk_write_mbps/1m/array`)
      .reply(200, [{ write_megabytes_per_second: 100, time: 786 }])

      .onGet(`/api/v1.0/usage_user/1m`)
      .reply(200, [{ mean_usage_user: 50, time: 886 }]);

  });

  it("displays array level details 2", async () => {
 await act(async () => {
      renderComponent();
    });
    const { getByTestId, getAllByText } = wrapper;
    await act(async () => {
      const levelSelect = await waitForElement(() =>
        getByTestId("levelSelect")
      );

      fireEvent.click(levelSelect);
      const arrayMenuItem = await waitForElement(
        () => getAllByText("Array")[0]
      );
      fireEvent.click(arrayMenuItem);
      const levelInput = await waitForElement(() => getByTestId("levelInput"));
      expect(levelInput.value).toBe("array");
    });
  });

  it("displays volume level details", async () => {
    mock
    .onGet(`/api/v1.0/iops_read/1m/1`)
    .reply(200, {
      res: [
        {
          time: 12345,
          perf_data_0_tid_arr_0_aid_arr_0_iops_read: 0,
          perf_data_1_tid_arr_1_aid_arr_1_iops_read: 0,
          perf_data_0_tid_arr_0_aid_arr_0_aid: 0,
          perf_data_1_tid_arr_1_aid_arr_1_aid: 1
        },
        {
          time: 12346,
          perf_data_0_tid_arr_0_aid_arr_0_iops_read: 0,
          perf_data_1_tid_arr_1_aid_arr_1_iops_read: 0,
          perf_data_0_tid_arr_0_aid_arr_0_aid: 0,
          perf_data_1_tid_arr_1_aid_arr_1_aid: 1
        },
        {
          time: 12347,
          perf_data_0_tid_arr_0_aid_arr_0_iops_read: 0,
          perf_data_1_tid_arr_1_aid_arr_1_iops_read: 0,
          perf_data_0_tid_arr_0_aid_arr_0_aid: 0,
          perf_data_1_tid_arr_1_aid_arr_1_aid: 1
        },
        {
          time: 12348,
          perf_data_0_tid_arr_0_aid_arr_0_iops_read: 0,
          perf_data_1_tid_arr_1_aid_arr_1_iops_read: 0,
          perf_data_0_tid_arr_0_aid_arr_0_aid: 0,
          perf_data_1_tid_arr_1_aid_arr_1_aid: 1
        },
        {
          time: 12349,
          perf_data_0_tid_arr_0_aid_arr_0_iops_read: 111,
          perf_data_1_tid_arr_1_aid_arr_1_iops_read: 12,
          perf_data_0_tid_arr_0_aid_arr_0_aid: 0,
          perf_data_1_tid_arr_1_aid_arr_1_aid: 1
        }
      ],
      aid: [
        {
          perf_data_0_tid_arr_0_aid_arr_0_aid: 0,
          perf_data_1_tid_arr_1_aid_arr_1_aid: 1
        }
      ]
    })

    .onGet(`/api/v1.0/iops_write/1m/1`)
    .reply(200, {
      res: [],
    })

      .onGet("/api/v1.0/get_volumes/")
      .reply(200, [
        {
          name: "vol1",
          size: "10",
          unit: "GB",
          usedspace: 8,
          ip: "IP",
          subnqn: "NA",
          status: "Active",
          id: 1
        },
        {
          name: "vol2",
          size: "5",
          unit: "GB",
          usedspace: 8,
          ip: "108.101.123.123",
          subnqn: "NA",
          status: "Active",
          id: 2
        }
      ]);

    await act(async () => {
      renderComponent();
    });
    const { getByTestId } = wrapper;
    await act(async () => {
      const levelSelect = await waitForElement(() =>
        getByTestId("levelSelect")
      );

      fireEvent.click(levelSelect);
      // const volumeMenuItem = await waitForElement(() =>
      //   getByTestId("volumeMenuItem")
      // );
      // fireEvent.click(volumeMenuItem);
      // const levelInput = await waitForElement(() => getByTestId("levelInput"));
      // expect(levelInput.value).toBe("volume");

      // const volumeSelect = await waitForElement(() =>
      //   getByTestId("volumeSelect")
      // );
      // fireEvent.click(volumeSelect);
      // const volumeId = await waitForElement(() => getByTestId("vol1"));
      // fireEvent.click(volumeId);
      // const volumeInput = await waitForElement(() =>
      //   getByTestId("volumeInput")
      // );
      // expect(volumeInput.value).toBe("1");
    });
  });



  it("displays system level details", async () => {
    global.document = {
      ...global.document,
      getElementById: () => {
        return {
          clientWidth: 700
        };
      }
    };
    mock
      .onGet(`/api/v1.0/disk_used_percent/1m/array`)
      .reply(200, [{ used_percent: 10, time: 789 }])

      .onGet(`/api/v1.0/disk_write_mbps/1m/array`)
      .reply(200, [{ write_megabytes_per_second: 100, time: 786 }])

      .onGet(`/api/v1.0/usage_user/1m`)
      .reply(200, [{ mean_usage_user: 50, time: 886 }]);

    await act(async () => {
      renderComponent();
    });

    const { getByTestId } = wrapper;
    await act(async () => {
      const levelSelect = await waitForElement(() =>
        getByTestId("levelSelect")
      );

      fireEvent.click(levelSelect);
      // const systemMenuItem = await waitForElement(() =>
      //   getByTestId("systemMenuItem")
      // );
      // fireEvent.click(systemMenuItem);
      // const levelInput = await waitForElement(() => getByTestId("levelInput"));
      // expect(levelInput.value).toBe("system");
    });
  });

  it("shouldn't display any array/volume level data", async () => {
    mock
      .onGet(`/api/v1.0/iops_read/1m/array`)
      .reply(200, {
        message: 10
      })
      .onGet(`/api/v1.0/iops_write/1m/array`)
      .reply(200, {
        message: 10
      })
      .onGet(`/api/v1.0/bw_read/1m/array`)
      .reply(200, {
        message: 10
      })
      .onGet(`/api/v1.0/latency/1m/array`)
      .reply(200, {
        message: 10
      })
      .onGet(`/api/v1.0/bw_write/1m/array`)
      .reply(200, {
        message: 10
      });
    renderComponent();
    //   await act(async () => {

    //   });
    const { asFragment, getByTestId } = wrapper;
  });

  it("doesn't display system level details", async () => {
    global.document = {
      ...global.document,
      getElementById: () => {
        return {
          clientWidth: 700
        };
      }
    };
    mock
      .onGet(`/api/v1.0/disk_used_percent/1m/array`)
      .reply(200, {
        message: 10
      })
      .onGet(`/api/v1.0/disk_write_mbps/1m/array`)
      .reply(200, {
        message: 10
      })
      .onGet(`/api/v1.0/usage_user/1m`)
      .reply(200, {
        message: 10
      });
    await act(async () => {
      renderComponent();
    });

    const { getByTestId } = wrapper;
    await act(async () => {
      const levelSelect = await waitForElement(() =>
        getByTestId("levelSelect")
      );

      fireEvent.click(levelSelect);
      // const systemMenuItem = await waitForElement(() =>
      //   getByTestId("systemMenuItem")
      // );
      //fireEvent.click(systemMenuItem);
      // const levelInput = await waitForElement(() => getByTestId("levelInput"));
      // expect(levelInput.value).toBe("system");
    });
  });

  // it("cancels the yield", async () => {
  //   let gen = fetchReadBandwidth({payload: {level: 'array', time: '1m'}});
  //   expect(gen.next().value).toEqual(
  //     call([axios, axios.get], '/api/v1.0/bw_read/1m/array')
  //   );
  //   expect(gen.return().value).toEqual(cancelled());
  //   expect(gen.next(true).value.payload.action).toEqual({
  //     bw: [],
  //     type: actionTypes.FETCH_READ_BANDWIDTH
  //   });
  //   console.log(fetchWriteBandwidth);

  //   gen = fetchWriteBandwidth({payload: {level: 'array', time: '1m'}});
  //   expect(gen.next().value).toEqual(
  //     put({
  //       bw: [],
  //       type: actionTypes.FETCH_WRITE_BANDWIDTH
  //     })
  //   );
  //   expect(gen.return().value).toEqual(cancelled());
  //   expect(gen.next(true).value.payload.action).toEqual({
  //     bw: [],
  //     type: actionTypes.FETCH_WRITE_BANDWIDTH
  //   });

  //   gen = fetchReadIops();
  //   expect(gen.next().value).toEqual(
  //     put({
  //       iops: [],
  //       type: actionTypes.FETCH_READ_IOPS
  //     })
  //   );
  //   expect(gen.return().value).toEqual(cancelled());
  //   expect(gen.next(true).value.payload.action).toEqual({
  //     iops: [],
  //     type: actionTypes.FETCH_READ_IOPS
  //   });

  //   gen = fetchWriteIops();
  //   expect(gen.next().value).toEqual(
  //     put({
  //       iops: [],
  //       type: actionTypes.FETCH_WRITE_IOPS
  //     })
  //   );
  //   expect(gen.return().value).toEqual(cancelled());
  //   expect(gen.next(true).value.payload.action).toEqual({
  //     iops: [],
  //     type: actionTypes.FETCH_WRITE_IOPS
  //   });

  //   gen = fetchCpuUsage();
  //   expect(gen.next().value).toEqual(
  //     put({
  //       cpuUsage: [],
  //       type: actionTypes.FETCH_CPU_USAGE
  //     })
  //   );
  //   expect(gen.return().value).toEqual(cancelled());
  //   expect(gen.next(true).value.payload.action).toEqual({
  //     cpuUsage: [],
  //     type: actionTypes.FETCH_CPU_USAGE
  //   });

  //   renderComponent();
  //   const { asFragment, getByTestId } = wrapper;
  // });

  it("should render button on resize", async () => {
    // Change the viewport to 500px.
    global.innerWidth = 500;

    // Trigger the window resize event.
    global.dispatchEvent(new Event("resize"));
    await act(async () => {
      renderComponent();
    });
    const { getByTestId } = wrapper;
    expect(getByTestId("sidebar-toggle")).toBeDefined();
    fireEvent.click(getByTestId("sidebar-toggle"));
    expect(getByTestId("help-link")).toHaveTextContent("Help");
  });

  it("should display the storage page with path", async () => {
    const { location } = window;
    delete window.location;
    window.location = { href: "http://localhost/performance" };
    renderComponent();
    const { getByText } = wrapper;
    expect(await waitForElement(() => getByText("Performance"))).toBeDefined();
    window.location = location;
  });
});
