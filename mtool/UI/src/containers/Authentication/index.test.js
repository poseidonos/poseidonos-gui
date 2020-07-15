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


DESCRIPTION: Authentication Container Test File
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
  waitForElement,
} from "@testing-library/react";
import { Provider } from "react-redux";
import { I18nextProvider } from "react-i18next";
import '@testing-library/jest-dom/extend-expect';

import axios from 'axios';
import MockAdapter from 'axios-mock-adapter'
import { createMemoryHistory } from 'history';
import {Router} from 'react-router-dom';
import { createStore, combineReducers,applyMiddleware,compose } from "redux";
import createSagaMiddleware from 'redux-saga';
import '@testing-library/jest-dom/extend-expect';
import rootSaga from "../../sagas/indexSaga"
import headerLanguageReducer, {
  initialState as langState
} from "../../store/reducers/headerLanguageReducer";
import authenticationReducer from "../../store/reducers/authenticationReducer";
import Authentication from "./index";
import i18n from "../../i18n";

jest.unmock('axios');

describe("Authentication", () => {
  let wrapper;
  let history;
  let store;
  beforeEach(() => {
    const sagaMiddleware = createSagaMiddleware();
    const rootReducers = combineReducers({
      headerLanguageReducer,
      authenticationReducer
    });
    const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
    store = createStore(rootReducers,composeEnhancers(applyMiddleware(sagaMiddleware)))
    sagaMiddleware.run(rootSaga);
    const route = '/';
    history = createMemoryHistory({ initialEntries: [route] })

    wrapper = render(
      <Router history={history}>
      <I18nextProvider i18n={i18n}>
        <Provider store={store}>
          {" "}
          <Authentication />
        </Provider>
      </I18nextProvider>
      </Router>
    );
  });

  afterEach(cleanup);

  it("matches snapshot", () => {
    const { asFragment } = wrapper;
    expect(asFragment()).toMatchSnapshot();
  });
/*
  it("Language select displays English and Korean", () => {
    const { getByTestId, getAllByText } = wrapper;
    const selectButton = getByTestId("selectDropdown");
    fireEvent.click(selectButton);
    getAllByText(/en/i);
  });

  it("Language is changed to English when English is selected", () => {
    const { getByTestId } = wrapper;
    const selectButton = getByTestId("selectDropdown");
    fireEvent.click(selectButton);
    const englishButton = getByTestId("englishSelect");
    fireEvent.click(englishButton);
    expect(getByTestId("submit")).toHaveTextContent("Login");
  });

  it("Language is changed to Korean when Korean is selected", () => {
    const { getByTestId } = wrapper;
    const selectButton = getByTestId("selectDropdown");
    fireEvent.click(selectButton);
    const koreanButton = getByTestId("koreanSelect");
    fireEvent.click(koreanButton);
    expect(getByTestId("submit")).toHaveTextContent("로그인");
  });
*/
  it("Changes Password Visibility", () => {
    const { getByTestId } = wrapper;
    const visibilityButton = getByTestId("visibilityButton");
    fireEvent.click(visibilityButton);
    getByTestId("showPassword");
  });

  it("Changes the value of input field", () => {
    const { getByTestId } = wrapper;
    const usernameInput = getByTestId("usernameInput").querySelector("input");
    fireEvent.change(usernameInput, {
        target: { value: 'test', name: 'username' }
    });
    expect(usernameInput.value).toBe("test");
  });

  it("Redirects to Dashboard", async () => {
    const mock = new MockAdapter(axios);
    const { getByTestId } = wrapper;
    const usernameInput = getByTestId("usernameInput").querySelector("input");
    fireEvent.change(usernameInput, {
        target: { value: 'test', name: 'username' }
    });
    const passwordInput = getByTestId("passwordInput").querySelector("input");
    fireEvent.change(passwordInput, {
        target: { value: 'test', name: 'password' }
    });
    const data = true;
    mock.onPost('/api/v1.0/login/').reply(200, data);
    fireEvent.click(getByTestId("submit"));
  });

  it("Throws invalid credentials error", async () => {
    const mock = new MockAdapter(axios);
    const { getByTestId } = wrapper;
    const usernameInput = getByTestId("usernameInput").querySelector("input");
    fireEvent.change(usernameInput, {
        target: { value: 'test', name: 'username' }
    });
    const passwordInput = getByTestId("passwordInput").querySelector("input");
    fireEvent.change(passwordInput, {
        target: { value: 'test', name: 'password' }
    });
    mock.onPost().reply(500);
    fireEvent.click(getByTestId("submit"))
    await waitForElement(() => getByTestId("errorMsg"));
  });

  it("login api doesn't return data", async () => {
    const mock = new MockAdapter(axios);
    const { getByTestId } = wrapper;
    const usernameInput = getByTestId("usernameInput").querySelector("input");
    fireEvent.change(usernameInput, {
        target: { value: 'test', name: 'username' }
    });
    const passwordInput = getByTestId("passwordInput").querySelector("input");
    fireEvent.change(passwordInput, {
        target: { value: 'test', name: 'password' }
    });
    const data = true;
    mock.onPost('/api/v1.0/login/').reply(200);
    fireEvent.click(getByTestId("submit"));
  });

  it("Should redirect to dashboard if already logged in", () => {
    localStorage.getItem = () => true;
    wrapper = render(
      <Router history={history}>
      <I18nextProvider i18n={i18n}>
        <Provider store={store}>
          {" "}
          <Authentication />
        </Provider>
      </I18nextProvider>
      </Router>
    );
  });
});
