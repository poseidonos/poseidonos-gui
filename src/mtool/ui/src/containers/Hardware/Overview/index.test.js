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


DESCRIPTION: Hardware Container Test File
@NAME : index.test.js
@AUTHORS: Jay Sanghavi
@Version : 1.0 *
@REVISION HISTORY
[03/06/2019] [Jay] : Prototyping..........////////////////////
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
import i18n from "../../../i18n";
import OverviewTab from './index'
jest.unmock("axios");

describe("OverviewTab", () => {
    let wrapper;
    let history;
    let store;
    // let mock;
    beforeEach(() => {
        const sagaMiddleware = createSagaMiddleware();
        const rootReducers = combineReducers({
            alertManagementReducer,
            hardwareOverviewReducer,
            hardwareOverviewReducer
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
                        {" "}
                        <OverviewTab />
                    </Provider>
                </I18nextProvider>
            </Router>
        );
    };

    afterEach(cleanup);

/*
    it("renders overview page", async () => {
        renderComponent();
        const { getByTestId } = wrapper;
        const container = await waitForElement(() =>
            getByTestId("OverviewTab-container")
        );
        expect(container).toBeDefined();
    });

    it("renders overview page power consumption error", async () => {
        renderComponent();
        const mock = new MockAdapter(axios);
        mock.onGet('/api/v1.0/get_software_health/')
        .reply(200, {
          software_health: [{
            mgmt_service: "Not OK",
            data_service: "Not OK"
          }]
        })
        const { getByTestId } = wrapper;
        const container = await waitForElement(() =>
            getByTestId("OverviewTab-container")
        );
        expect(container).toBeDefined();
    });
*/

    it("renders drives page", async () => {
        const mock = new MockAdapter(axios);
        mock.onGet(/\/api\/v1.0\/get_chassis_front_info\//).reply(200, {
            front_info: [{ DevicePath: 'NA',
                BuildDate: 'NA',
                Manufacturer: 'NA',
                name: "test",
                slot: 1,
                PartNumber: 'NA',
                SerialNumber: 'NA',
                Model: 'NA',
                PredictedMediaLifeLeftPercent:'NA'
            }]
        }).onGet(/\/api\/v1.0\/get_power_info\//).reply(200, {
            powerstatus: "On",
            powerconsumption: 0,
            powercap: 100
        }).onAny().reply(200, []);
        global.document.createRange = (html) => ({
      setStart: () => {},
      setEnd: () => {},
      commonAncestorContainer: {
        nodeName: "BODY",
        ownerDocument: document,
      },
      createContextualFragment: (html) => {
        const div = document.createElement("div");
        div.innerHTML = html;
        return div.children[0];
      },
    });
        renderComponent();
        const { getByTestId, asFragment, getByText } = wrapper;
        const container = await waitForElement(() =>
            getByTestId("dev-0")
        );
        await act(async () => {
        fireEvent(
          getByTestId("dev-0"),
          new MouseEvent("mouseover", {
            bubbles: true,
            cancelable: true,
          })
        );

       const moreDetails = await waitForElement(() => getByText("More Details"));
       fireEvent.click(moreDetails);
       fireEvent.click(getByTestId("diskdetails-close"))
})
    });
/*
    it("should not power on the server", async () => {
        const mock = new MockAdapter(axios);
        mock.onPost('/*').reply(200, [])
            .onAny().reply(200, []);
        renderComponent();
        const { getByTestId, getByText } = wrapper;
        const container = await waitForElement(() =>
            getByTestId("OverviewTab-container")
        );
        expect(container).toBeDefined();
        const powerBtn = await waitForElement(() => getByTestId("PowerOnButton"));
        fireEvent.click(powerBtn);

        const noBtn = await waitForElement(() => getByText("No"));
        expect(noBtn).toBeDefined();
        fireEvent.click(noBtn);
    });
*/
});
