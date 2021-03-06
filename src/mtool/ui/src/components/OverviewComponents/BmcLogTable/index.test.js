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
import BmcLogTable from "./index";
import i18n from "../../../i18n";

jest.unmock("axios");

describe("BmcLogTable", () => {
  let wrapper;
  let history;
  let store;
  // let mock;
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
    const sagaMiddleware = createSagaMiddleware();
    const rootReducers = combineReducers({
      // headerLanguageReducer,
      headerReducer
    });
    const composeEnhancers =
      window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
    store = createStore(
      rootReducers,
      composeEnhancers(applyMiddleware(sagaMiddleware))
    );
    sagaMiddleware.run(rootSaga);

    const route = "/BmcLogTable/general";
    history = createMemoryHistory({ initialEntries: [route] });
    // mock = new MockAdapter(axios);
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

  // it("selects source select all filter", async () => {
  //   renderComponent();
  //   const { asFragment, getByTestId } = wrapper;
  //   getByTestId("sourceSelect");
  //   fireEvent.click(getByTestId("sourceSelect"));

  //   await act(async () => {
  //     expect(asFragment()).toMatchSnapshot();
  //     const sourceSelectAll = await waitForElement(() =>
  //       // getByTestId("sourceSelectAll")
  //       getByTestId("sourceSelectAll").querySelector('input[type="checkbox"]')
  //     );
  //     const sourceSelectAll2 = getByTestId("sourceSelectAll").querySelector(
  //       'input[type="checkbox"]'
  //     );
  //     fireEvent.click(sourceSelectAll2);
  //     fireEvent.click(sourceSelectAll2, {
  //       target: { name: "source_select_all" }
  //     });
  //   });

  //   expect(asFragment()).toMatchSnapshot();
  // });

  // it("selects all source filters", async () => {
  //   renderComponent();
  //   const { asFragment, getByTestId } = wrapper;
  //   getByTestId("sourceSelect");
  //   fireEvent.click(getByTestId("sourceSelect"));

  //   await act(async () => {
  //     expect(asFragment()).toMatchSnapshot();
  //     const bmc_journal_entry = await waitForElement(() =>
  //       getByTestId("BMC Journal Entry")
  //     );
  //     fireEvent.click(getByTestId("BMC Journal Entry"));
  //     const journal_entry = await waitForElement(() =>
  //       getByTestId("Journal Entry")
  //     );
  //     fireEvent.click(getByTestId("Journal Entry"));
  //   });
  //   const event_log = await waitForElement(() => getByTestId("Event Log"));
  //   fireEvent.click(getByTestId("Event Log"));
  //   expect(asFragment()).toMatchSnapshot();
  // });


  // it("selects severity select all filter", async () => {
  //   renderComponent();
  //   const { asFragment, getByTestId } = wrapper;
  //   getByTestId("severitySelect");
  //   fireEvent.click(getByTestId("severitySelect"));

  //   await act(async () => {
  //     expect(asFragment()).toMatchSnapshot();
  //     const sourceSelectAll = await waitForElement(() =>
  //       // getByTestId("sourceSelectAll")
  //       getByTestId("severitySelectAll").querySelector('input[type="checkbox"]')
  //     );
  //     const severitySelectAll2 = getByTestId("severitySelectAll").querySelector(
  //       'input[type="checkbox"]'
  //     );
  //     fireEvent.click(severitySelectAll2);
  //     fireEvent.click(severitySelectAll2, {
  //       target: { name: "severity_select_all" }
  //     });
  //   });

  //   expect(asFragment()).toMatchSnapshot();
  // });

  // it("selects all severity filters", async () => {
  //   renderComponent();
  //   const { asFragment, getByTestId } = wrapper;
  //   getByTestId("severitySelect");
  //   fireEvent.click(getByTestId("severitySelect"));

  //   await act(async () => {
  //     expect(asFragment()).toMatchSnapshot();
  //     const warning = await waitForElement(() =>
  //       getByTestId("Warning")
  //     );
  //     fireEvent.click(getByTestId("Warning"));
  //     const error = await waitForElement(() =>
  //       getByTestId("Error")
  //     );
  //     fireEvent.click(getByTestId("Error"));
  //   });
  //   expect(asFragment()).toMatchSnapshot();
  // });

  // it("selects entry type select all filter", async () => {
  //   renderComponent();
  //   const { asFragment, getByTestId } = wrapper;
  //   getByTestId("entryTypeSelect");
  //   fireEvent.click(getByTestId("entryTypeSelect"));

  //   await act(async () => {
  //     expect(asFragment()).toMatchSnapshot();
  //     const entryTypeSelectAll = await waitForElement(() =>
  //       // getByTestId("sourceSelectAll")
  //       getByTestId("entryTypeSelectAll").querySelector(
  //         'input[type="checkbox"]'
  //       )
  //     );
  //     const entryTypeSelectAll2 = getByTestId(
  //       "entryTypeSelectAll"
  //     ).querySelector('input[type="checkbox"]');
  //     fireEvent.click(entryTypeSelectAll2);
  //     fireEvent.click(entryTypeSelectAll2, {
  //       target: { name: "entrytype_select_all" }
  //     });
  //   });

  //   expect(asFragment()).toMatchSnapshot();
  // });

  // it("selects all entry type filters", async () => {
  //   renderComponent();
  //   const { asFragment, getByTestId } = wrapper;
  //   getByTestId("entryTypeSelect");
  //   fireEvent.click(getByTestId("entryTypeSelect"));

  //   await act(async () => {
  //     expect(asFragment()).toMatchSnapshot();
  //     const Oem = await waitForElement(() =>
  //       getByTestId("Oem")
  //     );
  //     fireEvent.click(getByTestId("Oem"));
  //     const Oem2 = await waitForElement(() =>
  //       getByTestId("Oem2")
  //     );
  //     fireEvent.click(getByTestId("Oem2"));
  //   });
  //   expect(asFragment()).toMatchSnapshot();
  // });


  // it("selects source BMC Journal Entry filter", async () => {
  //   renderComponent();
  //   const { asFragment, getByTestId } = wrapper;
  //   getByTestId("sourceSelect");
  //   fireEvent.click(getByTestId("sourceSelect"));

  //   await act(async () => {
  //     expect(asFragment()).toMatchSnapshot();
  //     const sourceSelectAll = await waitForElement(() =>
  //       getByTestId("BMC Journal Entry")
  //     );
  //     fireEvent.click(getByTestId("BMC Journal Entry"));
  //   });
  //   expect(asFragment()).toMatchSnapshot();
  // });

  // it("selects severity Warning filter", async () => {
  //   renderComponent();
  //   const { asFragment, getByTestId } = wrapper;
  //   getByTestId("severitySelect");
  //   fireEvent.click(getByTestId("severitySelect"));

  //   await act(async () => {
  //     expect(asFragment()).toMatchSnapshot();
  //     const severitySelectAll = await waitForElement(() =>
  //       getByTestId("Warning")
  //     );
  //     fireEvent.click(getByTestId("Warning"));
  //   });
  //   expect(asFragment()).toMatchSnapshot();
  // });

  // it("selects entry type Oem filter", async () => {
  //   renderComponent();
  //   const { asFragment, getByTestId } = wrapper;
  //   getByTestId("entryTypeSelect");
  //   fireEvent.click(getByTestId("entryTypeSelect"));

  //   await act(async () => {
  //     expect(asFragment()).toMatchSnapshot();
  //     const entryTypeSelectAll = await waitForElement(() => getByTestId("Oem"));
  //     fireEvent.click(getByTestId("Oem"));
  //   });
  //   expect(asFragment()).toMatchSnapshot();
  // });
  // it("selects source, severity and entry type filters, ", async () => {
  //   renderComponent();
  //   const { asFragment, getByTestId } = wrapper;
  //   fireEvent.click(getByTestId("sourceSelect"));

  //   await act(async () => {
  //     expect(asFragment()).toMatchSnapshot();
  //     const sourceSelectAll = await waitForElement(() =>
  //       getByTestId("BMC Journal Entry")
  //     );
  //     fireEvent.click(getByTestId("BMC Journal Entry"));
  //   });
  //   fireEvent.click(getByTestId("entryTypeSelect"));
  //   await act(async () => {
  //     expect(asFragment()).toMatchSnapshot();
  //     //const entryTypeSelectAll = await waitForElement(() => getByTestId("Oem"));
  //     //fireEvent.click(getByTestId("Oem"));
  //     const Oem2 = await waitForElement(() => getByTestId("Oem2"));
  //     fireEvent.click(getByTestId("Oem2"));
  //   });
  //   fireEvent.click(getByTestId("severitySelect"));
  //   await act(async () => {
  //     expect(asFragment()).toMatchSnapshot();
  //     const severitySelectAll = await waitForElement(() =>
  //       getByTestId("Warning")
  //     );
  //     fireEvent.click(getByTestId("Warning"));
  //   });
  // });

  // it("checks source listsubheader functionality", async () => {
  //   renderComponent();
  //   const { asFragment, getByTestId } = wrapper;
  //   getByTestId("sourceSelect");
  //   fireEvent.click(getByTestId("sourceSelect"));

  //   await act(async () => {
  //     expect(asFragment()).toMatchSnapshot();
  //     const sourceSelectAllSubheader = await waitForElement(() =>
  //       getByTestId("sourceSelectAllSubheader")
  //     );
  //     fireEvent.click(getByTestId("sourceSelectAllSubheader"));
  //   });
  //   expect(asFragment()).toMatchSnapshot();
  // });

  // it("checks entry type listsubheader functionality", async () => {
  //   renderComponent();
  //   const { asFragment, getByTestId } = wrapper;
  //   getByTestId("entryTypeSelect");
  //   fireEvent.click(getByTestId("entryTypeSelect"));

  //   await act(async () => {
  //     expect(asFragment()).toMatchSnapshot();
  //     const entryTypeSelectAllSubheader = await waitForElement(() =>
  //       getByTestId("entryTypeSelectAllSubheader")
  //     );
  //     fireEvent.click(getByTestId("entryTypeSelectAllSubheader"));
  //   });
  //   expect(asFragment()).toMatchSnapshot();
  // });

  // it("checks severity listsubheader functionality", async () => {
  //   renderComponent();
  //   const { asFragment, getByTestId } = wrapper;
  //   getByTestId("severitySelect");
  //   fireEvent.click(getByTestId("severitySelect"));

  //   await act(async () => {
  //     expect(asFragment()).toMatchSnapshot();
  //     const severitySelectAllSubheader = await waitForElement(() =>
  //       getByTestId("severitySelectAllSubheader")
  //     );
  //     fireEvent.click(getByTestId("severitySelectAllSubheader"));
  //   });
  //   expect(asFragment()).toMatchSnapshot();
  // });

  // it("refreshes the bmc logs", async () => {
  //   renderComponent();
  //   const { getByTitle } = wrapper;
  //   fireEvent.click(getByTitle("Refresh Logs"));
  // });
});
