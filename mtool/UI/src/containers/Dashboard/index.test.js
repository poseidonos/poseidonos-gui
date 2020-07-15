
import Dashboard from "./index";
import { createMount } from '@material-ui/core/test-utils';
import React from "react";
import {render,fireEvent, cleanup, waitForElement, getNodeText} from "@testing-library/react";
import { Provider } from "react-redux";
import "@testing-library/jest-dom/extend-expect";
import { I18nextProvider } from "react-i18next";
//import axiosMock from 'axios';

import axios from 'axios';
import MockAdapter from 'axios-mock-adapter'
import { createMemoryHistory } from 'history';
import {Router} from 'react-router-dom';
import { createStore, combineReducers,applyMiddleware,compose } from "redux";
import createSagaMiddleware from 'redux-saga'
import rootSaga from "../../sagas/indexSaga"
import headerReducer from "../../store/reducers/headerReducer";
import dashboardReducer from "../../store/reducers/dashboardReducer";
import configurationsettingReducer from "../../store/reducers/configurationsettingReducer";
import BMCAuthenticationReducer from "../../store/reducers/BMCAuthenticationReducer";
import i18n from "../../i18n";

jest.unmock('axios');


describe("Dashboard", () => {
    let wrapper;
    let history;
    let store;

    beforeEach(() => {
      const sagaMiddleware = createSagaMiddleware();
      const rootReducers = combineReducers({
        headerReducer,
        dashboardReducer,
        configurationsettingReducer,
        BMCAuthenticationReducer
      });
      const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
      store = createStore(rootReducers,composeEnhancers(applyMiddleware(sagaMiddleware)))
      sagaMiddleware.run(rootSaga);
      const route = '/';
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
  
    afterEach(cleanup);
  
    it("matches snapshot", () => {
      renderComponent();
      const { asFragment } = wrapper;
      expect(asFragment()).toMatchSnapshot();
    });


    it("should display available storage value as received from API", async () => {
        const mock = new MockAdapter(axios);
        mock.onGet(`/api/v1.0/available_storage/?ts= + ${Date.now()}`)
          .reply(200, [
            {
              
                arraySize: 0, 
              
            }
        ]
          );
        renderComponent();
        const { getByTestId} = wrapper;
        const readStorageElement = await waitForElement(() => getByTestId("dashboard-no-array"));
        expect(readStorageElement.innerHTML).toBe("No Array Created");

      });


      
    it("should display system info as received from API", async () => {
        const mock = new MockAdapter(axios);
        mock.onGet(`/api/v1.0/get_ip_and_mac`)
          .reply(200,         
            {
                host: "init", 
                ip: "10.1.11.91", 
                mac: "00:50:56:ad:88:56"
              } 
        
          );
        renderComponent();
        const { getByTestId} = wrapper;
        const ipElement = await waitForElement(() => getByTestId("dashboard-ip"));
        expect(ipElement.innerHTML).toBe("IP : 10.1.11.91");


        const hostElement = await waitForElement(() => getByTestId("dashboard-host"));
        expect(hostElement.innerHTML).toBe("Poseidon Name : init");

        const macElement = await waitForElement(() => getByTestId("dashboard-mac"));
        expect(macElement.innerHTML).toBe("MAC : 00:50:56:ad:88:56");

      });

      it("should display storage details", async () => {
        const mock = new MockAdapter(axios);
        mock.onGet(/api\/v1\.0\/available_storage\/\?ts=*/)
          .reply(200, [
            {
              arraySize: 4768219004928
            }
          ]);
        renderComponent();
        const { getByText } = wrapper;
        const hostElement = await waitForElement(() => getByText("4.34 TB"));
        expect(hostElement).toBeDefined();
      });

      it("should display volumes", async () => {
        const mock = new MockAdapter(axios);
        mock.onGet(`/api/v1.0/get_volumes/`)
          .reply(200,[
            {         
            id:	'0',
            maxbw	:0,
            maxiops:	0,
            name:	'vol2',
            remain:	10737418240,
            status:	'Mounted',
            total:	10737418240,
            ip:	'10.1.11.91',
            port:	'NA',
            subnqn:	'NA',
            description : "",	
            unit:	'GB',
            size:	'10',
            usedspace:0
            }
          ]
          );
        renderComponent();
        const { getByText } = wrapper;
        const hostElement = await waitForElement(() => getByText("vol2"));
        expect(hostElement).toBeDefined();
      });

      it("should display alerts", async () => {
        const mock = new MockAdapter(axios);
        mock.onGet(`/api/v1.0/get_alert_info`)
          .reply(200,{
            alerts: [
              {
                time: 104256782,
                level: 'CRITICAL',
                message: 'CPU Alert',
                duration: 10,
                host: 'iBoF'
              },
              {
                time: 104256783,
                level: 'NORMAL',
                message: 'iBoF Alert',
                duration: 10,
                host: 'iBoF'
              }
            ]
          });
        renderComponent();
        const { getByText } = wrapper;
        const hostElement1 = await waitForElement(() => getByText("CPU Alert"));
        expect(hostElement1).toBeDefined();
        const hostElement2 = await waitForElement(() => getByText("iBoF Alert"));
        expect(hostElement2).toBeDefined();
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
        mock.onGet(/\/api\/v1\.0\/perf\/all\?ts=*/)
          .reply(200,
            {
                bw_read: 0,
                bw_total: 0,
                bw_write: 0,
                iops_read: 154,
                iops_total: 0,
                iops_write: 154
            }
          ).onAny().reply(200, {});
        renderComponent();
        jest.advanceTimersByTime(2000);
        const {getByTestId} = wrapper;
        const readIopsElement = await waitForElement(() => getByTestId("read-iops"));
        expect(readIopsElement.innerHTML).toBe("0");
      });
  
});