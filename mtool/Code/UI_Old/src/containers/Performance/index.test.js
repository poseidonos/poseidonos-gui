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


DESCRIPTION: Performance Container Test File
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
    const route = "/";
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

  it("renders array level graphs for last 1m", async () => {
    mock
      .onGet(`/api/v1.0/iops_read/1m/array`)
      .reply(200, {
        res: [
          {
            time: 12345,
            perf_data_0_tid_arr_0_aid_arr_0_iops_read: 0,
            perf_data_1_tid_arr_1_aid_arr_1_iops_read: 0
          },
          {
            time: 12346,
            perf_data_0_tid_arr_0_aid_arr_0_iops_read: 0,
            perf_data_1_tid_arr_1_aid_arr_1_iops_read: 0
          },
          {
            time: 12347,
            perf_data_0_tid_arr_0_aid_arr_0_iops_read: 0,
            perf_data_1_tid_arr_1_aid_arr_1_iops_read: 0
          },
          {
            time: 12348,
            perf_data_0_tid_arr_0_aid_arr_0_iops_read: 0,
            perf_data_1_tid_arr_1_aid_arr_1_iops_read: 0
          }
        ],
        aid: [
          {
            perf_data_0_tid_arr_0_aid: 0,
            perf_data_1_tid_arr_1_aid: 1
          }
        ]
      })
      .onGet(`/api/v1.0/iops_write/1m/array`)
      .reply(200, {
        res: [
          {
            time: 123456,
            perf_data_0_tid_arr_0_aid_arr_0_iops_write: 0,
            perf_data_1_tid_arr_1_aid_arr_1_iops_write: 0
          }
        ],
        aid: [
          {
            perf_data_0_tid_arr_0_aid: 0,
            perf_data_1_tid_arr_1_aid: 1
          }
        ]
      })
      .onGet(`/api/v1.0/bw_read/1m/array`)
      .reply(200, {
        res: [
          {
            time: 123456,
            perf_data_0_tid_arr_0_aid_arr_0_bw_read: 0,
            perf_data_1_tid_arr_1_aid_arr_1_bw_read: 0
          }
        ],
        aid: [
          {
            perf_data_0_tid_arr_0_aid: 0,
            perf_data_1_tid_arr_1_aid: 1
          }
        ]
      })

      .onGet(`/api/v1.0/latency/1m/array`)
      .reply(200, {
        res: [
          {
            time: 123456,
            lat_data_0_tid_arr_0_aid_arr_0_timelag_arr_0_mean: 0,
            lat_data_1_tid_arr_1_aid_arr_1_timelag_arr_0_mean: 0
          }
        ],
        aid: [
          {
            lat_data_0_tid_arr_0_aid_arr_0_aid: 0,
            lat_data_1_tid_arr_1_aid_arr_1_aid: 1
          }
        ]
      })

      .onGet(`/api/v1.0/bw_write/1m/array`)
      .reply(200, {
        res: [
          {
            time: 123456,
            perf_data_0_tid_arr_0_aid_arr_0_bw_write: 0,
            perf_data_1_tid_arr_1_aid_arr_1_bw_write: 0
          }
        ],
        aid: [
          {
            perf_data_0_tid_arr_0_aid: 0,
            perf_data_1_tid_arr_1_aid: 1
          }
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
      // const lastSevenDay = await waitForElement(() => getByTestId("7d"));
      // fireEvent.click(lastSevenDay);
      // const intervalInput = await waitForElement(() =>
      //   getByTestId("timeInput")
      // );
      // expect(intervalInput.value).toBe("7d");
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
          ip: "107.101.123.123",
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
});
