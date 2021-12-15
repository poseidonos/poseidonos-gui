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
