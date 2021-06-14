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
  waitForElement,
  getAllByPlaceholderText,
  queryByText
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
import alertManagementReducer from "../../../store/reducers/alertManagementReducer";
import userManagementReducer from "../../../store/reducers/userManagementReducer";
import i18n from "../../../i18n";
import UserManagement from "./index";

jest.unmock("axios");

describe("ConfigurationSetting", () => {
  let wrapper;
  let history;
  let store;
  // let mock;
  beforeEach(() => {
    const sagaMiddleware = createSagaMiddleware();
    const rootReducers = combineReducers({
      // headerLanguageReducer,
      //   headerReducer,
      alertManagementReducer,
      userManagementReducer
    });
    const composeEnhancers =
      window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
    store = createStore(
      rootReducers,
      composeEnhancers(applyMiddleware(sagaMiddleware))
    );
    sagaMiddleware.run(rootSaga);
    const route = "/ConfigurationSetting/user";
    history = createMemoryHistory({ initialEntries: [route] });
    // mock = new MockAdapter(axios);
  });

  const renderComponent = () => {
    wrapper = render(
      <Router history={history}>
        <I18nextProvider i18n={i18n}>
          <Provider store={store}>
            <UserManagement />
          </Provider>
        </I18nextProvider>
      </Router>
    );
  };

  afterEach(cleanup);

  it('renders user management', async () => {
    const mock = new MockAdapter(axios);
    let response = mock.onGet('/api/v1.0/get_users/').reply(200, null);
    renderComponent();
    const { getByText, asFragment } = wrapper;
    expect(getByText("User List")).toBeDefined();
  });

  it('fails to get user info', async () => {
    const mock = new MockAdapter(axios);
    let response = mock.onGet('/api/v1.0/get_users/').reply(500, null);
    renderComponent();
    const { getByText, asFragment } = wrapper;
    expect(getByText("User List")).toBeDefined();
  });

  it('should add a new user', () => {
    const mock = new MockAdapter(axios);
    mock.onPost('/api/v1.0/add_new_user/').reply(200, null)
      .onGet('/api/v1.0/get_users/').reply(200, null);
    const getSpy = jest.spyOn(axios, 'post');
    renderComponent();
    const { asFragment, getByTestId, getByText } = wrapper;
    const username = getByTestId('add-user-name');
    const password = getByTestId('add-user-password');
    const confirmPassword = getByTestId('add-user-confirm-password');
    const phno = getByTestId('add-user-phno');
    const email = getByTestId('add-user-email');
    const confirmBtn = getByText('Submit');
    fireEvent.keyDown(username, { key: 'A', code: 65, charCode: 65 });
    fireEvent.keyDown(username, { key: '+', code: 43, charCode: 43 });
    fireEvent.change(username, { target: { value: 'abcd' } });
    fireEvent.keyDown(password, { key: 'A', code: 65, charCode: 65 });
    fireEvent.keyDown(password, { key: '+', code: 43, charCode: 43 });
    fireEvent.change(password, { target: { value: 'test' } });
    fireEvent.keyDown(confirmPassword, { key: 'A', code: 65, charCode: 65 });
    fireEvent.keyDown(confirmPassword, { key: '+', code: 43, charCode: 43 });
    fireEvent.change(confirmPassword, { target: { value: 'test' } });
    fireEvent.keyDown(email, { key: 'A', code: 65, charCode: 65 });
    fireEvent.keyDown(email, { key: '+', code: 43, charCode: 43 });
    fireEvent.change(email, { target: { value: 'abcd@abc.com' } });
    fireEvent.change(phno, { target: { value: '123457890' } });
    fireEvent.click(confirmBtn);
    expect(getByText('Yes')).toBeDefined();
    fireEvent.click(getByText('Yes'));
    expect(getSpy).toHaveBeenCalledWith('/api/v1.0/add_new_user/', {
      "confirmpassword": "test",
      "emailid": "abcd@abc.com",
      "error": "",
      "mobilenumber": "+1 (234) 578-90",
      "password": "test",
      "phone_number": "+82",
      "user_role": "Admin",
      "username": "abcd"
    }, {
      "headers": {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "x-access-token": null
      }
    });
  });

  it('should display an error while adding a new user if the username already exists', () => {
    const mock = new MockAdapter(axios);
    mock.onPost('/api/v1.0/add_new_user/').reply(400, null)
      .onGet('/api/v1.0/get_users/').reply(200, null);
    const getSpy = jest.spyOn(axios, 'post');
    renderComponent();
    const { asFragment, getByTestId, getByText } = wrapper;
    const username = getByTestId('add-user-name');
    const password = getByTestId('add-user-password');
    const confirmPassword = getByTestId('add-user-confirm-password');
    const phno = getByTestId('add-user-phno');
    const email = getByTestId('add-user-email');
    const confirmBtn = getByText('Submit');
    fireEvent.keyDown(username, { key: 'A', code: 65, charCode: 65 });
    fireEvent.keyDown(username, { key: '+', code: 43, charCode: 43 });
    fireEvent.change(username, { target: { value: 'abcd' } });
    fireEvent.keyDown(password, { key: 'A', code: 65, charCode: 65 });
    fireEvent.keyDown(password, { key: '+', code: 43, charCode: 43 });
    fireEvent.change(password, { target: { value: 'test' } });
    fireEvent.keyDown(confirmPassword, { key: 'A', code: 65, charCode: 65 });
    fireEvent.keyDown(confirmPassword, { key: '+', code: 43, charCode: 43 });
    fireEvent.change(confirmPassword, { target: { value: 'test' } });
    fireEvent.keyDown(email, { key: 'A', code: 65, charCode: 65 });
    fireEvent.keyDown(email, { key: '+', code: 43, charCode: 43 });
    fireEvent.change(email, { target: { value: 'abcd@abc.com' } });
    fireEvent.change(phno, { target: { value: '123457890' } });
    fireEvent.click(confirmBtn);
    expect(getByText('Yes')).toBeDefined();
    fireEvent.click(getByText('Yes'));
    expect(getSpy).toHaveBeenCalledWith('/api/v1.0/add_new_user/', {
      "confirmpassword": "test",
      "emailid": "abcd@abc.com",
      "error": "",
      "mobilenumber": "+1 (234) 578-90",
      "password": "test",
      "phone_number": "+82",
      "user_role": "Admin",
      "username": "abcd"
    }, {
      "headers": {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "x-access-token": null
      }
    });
  });

  it('should display an error if unable to add a new user', () => {
    const mock = new MockAdapter(axios);
    mock.onPost('/api/v1.0/add_new_user/').reply(500, null)
      .onGet('/api/v1.0/get_users/').reply(200, null);
    const getSpy = jest.spyOn(axios, 'post');
    renderComponent();
    const { asFragment, getByTestId, getByText } = wrapper;
    const username = getByTestId('add-user-name');
    const password = getByTestId('add-user-password');
    const confirmPassword = getByTestId('add-user-confirm-password');
    const phno = getByTestId('add-user-phno');
    const email = getByTestId('add-user-email');
    const confirmBtn = getByText('Submit');
    fireEvent.keyDown(username, { key: 'A', code: 65, charCode: 65 });
    fireEvent.keyDown(username, { key: '+', code: 43, charCode: 43 });
    fireEvent.change(username, { target: { value: 'abcd' } });
    fireEvent.keyDown(password, { key: 'A', code: 65, charCode: 65 });
    fireEvent.keyDown(password, { key: '+', code: 43, charCode: 43 });
    fireEvent.change(password, { target: { value: 'test' } });
    fireEvent.keyDown(confirmPassword, { key: 'A', code: 65, charCode: 65 });
    fireEvent.keyDown(confirmPassword, { key: '+', code: 43, charCode: 43 });
    fireEvent.change(confirmPassword, { target: { value: 'test' } });
    fireEvent.keyDown(email, { key: 'A', code: 65, charCode: 65 });
    fireEvent.keyDown(email, { key: '+', code: 43, charCode: 43 });
    fireEvent.change(email, { target: { value: 'abcd@abc.com' } });
    fireEvent.change(phno, { target: { value: '123457890' } });
    fireEvent.click(confirmBtn);
    expect(getByText('Yes')).toBeDefined();
    fireEvent.click(getByText('Yes'));
    expect(getSpy).toHaveBeenCalledWith('/api/v1.0/add_new_user/', {
      "confirmpassword": "test",
      "emailid": "abcd@abc.com",
      "error": "",
      "mobilenumber": "+1 (234) 578-90",
      "password": "test",
      "phone_number": "+82",
      "user_role": "Admin",
      "username": "abcd"
    }, {
      "headers": {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "x-access-token": null
      }
    });
  });


  it('should throw appropriate error while adding a new user with wrong input', async () => {
    renderComponent();
    const { asFragment, getByTestId, getByText } = wrapper;
    const username = getByTestId('add-user-name');
    const password = getByTestId('add-user-password');
    const confirmPassword = getByTestId('add-user-confirm-password');
    const phno = getByTestId('add-user-phno');
    const email = getByTestId('add-user-email');
    const confirmBtn = getByText('Submit');
    fireEvent.keyDown(username, { key: 'A', code: 65, charCode: 65 });
    fireEvent.change(username, { target: { value: 'abcd' } });
    fireEvent.keyDown(password, { key: 'A', code: 65, charCode: 65 });
    fireEvent.change(password, { target: { value: 'test' } });
    fireEvent.click(confirmBtn);
    expect(getByText("Please Enter a Valid Password")).toBeDefined();
    fireEvent.click(getByText("OK"));
    fireEvent.keyDown(confirmPassword, { key: 'B', code: 65, charCode: 65 });
    fireEvent.change(confirmPassword, { target: { value: 'test2' } });
    fireEvent.click(confirmBtn);
    expect(getByText("Passwords do not match")).toBeDefined();
    fireEvent.click(getByText("OK"));
    fireEvent.change(confirmPassword, { target: { value: 'test' } });
    fireEvent.change(phno, { target: { value: '22' } });
    fireEvent.click(confirmBtn);
    await waitForElement(() => getByText("OK"));
    expect(asFragment()).toMatchSnapshot();
    expect(getByText("Please Enter a Valid Mobile Number")).toBeDefined();
    fireEvent.click(getByText("OK"));
    fireEvent.change(phno, { target: { value: '223456789' } });
    fireEvent.change(email, { target: { value: 'abcd@abc' } });
    fireEvent.click(confirmBtn);
    expect(getByText("Please Enter a Valid Email ID")).toBeDefined();
    // expect(username.value).toBe('');
  });

  it('should cancel adding a user', () => {
    renderComponent();
    const { asFragment, getByTestId, getByText } = wrapper;
    const username = getByTestId('add-user-name');
    const cancelBtn = getByText('Cancel');
    fireEvent.keyDown(username, { key: 'A', code: 65, charCode: 65 });
    fireEvent.change(username, { target: { value: 'abcd' } });
    fireEvent.click(cancelBtn);
    expect(getByText('Yes')).toBeDefined();
    fireEvent.click(getByText('No'));
    // expect(username.value).toBe('');
  });
  it('should cancel adding a user by clicking yes', () => {
    renderComponent();
    const { asFragment, getByTestId, getByText } = wrapper;
    const username = getByTestId('add-user-name');
    const cancelBtn = getByText('Cancel');
    fireEvent.keyDown(username, { key: 'A', code: 65, charCode: 65 });
    fireEvent.change(username, { target: { value: 'abcd' } });
    fireEvent.click(cancelBtn);
    expect(getByText('Yes')).toBeDefined();
    fireEvent.click(getByText('Yes'));
    // expect(username.value).toBe('');
  });

  it('should throw error when username is not present', () => {
    renderComponent();
    const { getByText } = wrapper;
    const confirmBtn = getByText('Submit');
    fireEvent.click(confirmBtn);
    expect(getByText("Please Enter a Valid Username")).toBeDefined();
  });

  it('should add list all the users', async () => {
    const mock = new MockAdapter(axios);
    let response = mock.onGet('/api/v1.0/get_users/')
      .reply(200, [
        {
          "_id": "abcd",
          "email": "abcd@corp.com",
          "password": "Defg",
          "phone_number": "xx",
          "role": "admin",
          "active": true,
          "privileges": "Create, Read, Edit, Delete"
        }
      ]);
    renderComponent();
    const { getByText, asFragment } = wrapper;
    await act(async () => {
      const nameElement = await waitForElement(() => getByText("abcd"));
      expect(nameElement).toBeDefined();
      expect(asFragment()).toMatchSnapshot();
    });
  });

  it('should delete a user', async () => {
    const mock = new MockAdapter(axios);

    let response = mock.onGet('/api/v1.0/get_users/')
      .reply(200, [
        {
          "_id": "abcd",
          "email": "abcd@corp.com",
          "password": "Defg",
          "phone_number": "xx",
          "role": "admin",
          "active": true,
          "privileges": "Create, Read, Edit, Delete"
        }
      ])
      .onPost('/api/v1.0/delete_users/').reply(200, null);
    const getSpy = jest.spyOn(axios, 'post');

    renderComponent();
    const { getByText, asFragment, getAllByTitle, getAllByPlaceholderText } = wrapper;
    await act(async () => {
      const nameElement = await waitForElement(() => getByText("abcd"));
      expect(nameElement).toBeDefined();
      const deleteBtn = await waitForElement(() => getAllByTitle("Delete")[0]);
      fireEvent.click(deleteBtn);
      const saveBtn = await waitForElement(() => getAllByTitle("Save")[0]);
      fireEvent.click(saveBtn);
      await new Promise(resolve => setTimeout(resolve, 1000));
      expect(getSpy).toHaveBeenCalledWith('/api/v1.0/delete_users/', {
        "ids": ["abcd"],
      }, {
        "headers": {
          "Accept": "application/json",
          "Content-Type": "application/json",
          "x-access-token": null
        }
      });
      //expect(asFragment()).toMatchSnapshot();
    });
  })

  it('should display an error if unable to delete a user', async () => {
    const mock = new MockAdapter(axios);
    let response = mock.onGet('/api/v1.0/get_users/')
      .reply(200, [
        {
          "_id": "abcd",
          "email": "abcd@corp.com",
          "password": "Defg",
          "phone_number": "xx",
          "role": "admin",
          "active": true,
          "privileges": "Create, Read, Edit, Delete"
        }
      ])
      .onPost('/api/v1.0/delete_users/').reply(500, null);
    const getSpy = jest.spyOn(axios, 'post');
    renderComponent();
    const { getByText, asFragment, getAllByTitle, getAllByPlaceholderText } = wrapper;
    await act(async () => {
      const nameElement = await waitForElement(() => getByText("abcd"));
      expect(nameElement).toBeDefined();
      const deleteBtn = await waitForElement(() => getAllByTitle("Delete")[0]);
      fireEvent.click(deleteBtn);
      const saveBtn = await waitForElement(() => getAllByTitle("Save")[0]);
      fireEvent.click(saveBtn);
      await new Promise(resolve => setTimeout(resolve, 1000));
      expect(getSpy).toHaveBeenCalledWith('/api/v1.0/delete_users/', {
        "ids": ["abcd"],
      }, {
        "headers": {
          "Accept": "application/json",
          "Content-Type": "application/json",
          "x-access-token": null
        }
      });
      expect(asFragment()).toMatchSnapshot();
    });
  })

  it('should edit a user', async () => {
    const mock = new MockAdapter(axios);
    let response = mock.onGet('/api/v1.0/get_users/')
      .reply(200, [
        {
          "_id": "abcd",
          "email": "abcd@corp.com",
          "password": "Defg",
          "phone_number": "xx",
          "role": "admin",
          "active": true,
          "privileges": "Create, Read, Edit, Delete"
        }
      ])
      .onPost('/api/v1.0/update_user/').reply(200, null);
    const getSpy = jest.spyOn(axios, 'post');
    renderComponent();
    const { getByText, asFragment, getAllByTitle, getAllByPlaceholderText } = wrapper;
    await act(async () => {
      const nameElement = await waitForElement(() => getByText("abcd"));
      expect(nameElement).toBeDefined();
      const editBtn = await waitForElement(() => getAllByTitle("Edit")[0]);
      fireEvent.click(editBtn);
      const phno = await waitForElement(() => getAllByPlaceholderText("+1 (702) 123-4567")[0]);
      fireEvent.change(phno, {
        target: { value: "+1 (702) 123-4578" }
      });
      const email = await waitForElement(() => getAllByPlaceholderText("Email")[0]);
      fireEvent.change(email, {
        target: { value: "test@abc.com" }
      });
      const saveBtn = await waitForElement(() => getAllByTitle("Save")[0]);
      fireEvent.click(saveBtn);
      await new Promise(resolve => setTimeout(resolve, 1000));
      expect(getSpy).toHaveBeenCalledWith('/api/v1.0/update_user/', {
        "_id": "abcd",
        "active": true,
        "edit": false,
        "email": "test@abc.com",
        "oldid": "abcd",
        "password": "Defg",
        "phone_number": "+1 (702) 123-4578",
        "privileges": "Create, Read, Edit, Delete",
        "role": "admin",
        "selected": false,
      }, {
        "headers": {
          "Accept": "application/json",
          "Content-Type": "application/json",
          "x-access-token": null
        }
      });
    });
  });

  it('should display an error if unable to edit a user', async () => {
    const mock = new MockAdapter(axios);
    let response = mock.onGet('/api/v1.0/get_users/')
      .reply(200, [
        {
          "_id": "abcd",
          "email": "abcd@corp.com",
          "password": "Defg",
          "phone_number": "xx",
          "role": "admin",
          "active": true,
          "privileges": "Create, Read, Edit, Delete"
        }
      ])
      .onPost('/api/v1.0/update_user/').reply(500, null);
    const getSpy = jest.spyOn(axios, 'post');
    renderComponent();
    const { getByText, asFragment, getAllByTitle, getAllByPlaceholderText } = wrapper;
    await act(async () => {
      const nameElement = await waitForElement(() => getByText("abcd"));
      expect(nameElement).toBeDefined();
      const editBtn = await waitForElement(() => getAllByTitle("Edit")[0]);
      fireEvent.click(editBtn);
      const phno = await waitForElement(() => getAllByPlaceholderText("+1 (702) 123-4567")[0]);
      fireEvent.change(phno, {
        target: { value: "+1 (702) 123-4578" }
      });
      const email = await waitForElement(() => getAllByPlaceholderText("Email")[0]);
      fireEvent.change(email, {
        target: { value: "test@abc.com" }
      });
      const saveBtn = await waitForElement(() => getAllByTitle("Save")[0]);
      fireEvent.click(saveBtn);
      await new Promise(resolve => setTimeout(resolve, 1000));
      expect(getSpy).toHaveBeenCalledWith('/api/v1.0/update_user/', {
        "_id": "abcd",
        "active": true,
        "edit": false,
        "email": "test@abc.com",
        "oldid": "abcd",
        "password": "Defg",
        "phone_number": "+1 (702) 123-4578",
        "privileges": "Create, Read, Edit, Delete",
        "role": "admin",
        "selected": false,
      }, {
        "headers": {
          "Accept": "application/json",
          "Content-Type": "application/json",
          "x-access-token": null
        }
      });
    });
  });

  it('should throw an error if the emailid is not valid', async () => {
    const mock = new MockAdapter(axios);
    let response = mock.onGet('/api/v1.0/get_users/')
      .reply(200, [
        {
          "_id": "abcd",
          "email": "abcd@corp.com",
          "password": "Defg",
          "phone_number": "xx",
          "role": "admin",
          "active": true,
          "privileges": "Create, Read, Edit, Delete"
        }
      ]);
    renderComponent();
    const { getByText, asFragment, getAllByTitle, getAllByPlaceholderText } = wrapper;
    await act(async () => {
      const nameElement = await waitForElement(() => getByText("abcd"));
      expect(nameElement).toBeDefined();
      const editBtn = await waitForElement(() => getAllByTitle("Edit")[0]);
      fireEvent.click(editBtn);
      const phno = await waitForElement(() => getAllByPlaceholderText("+1 (702) 123-4567")[0]);
      fireEvent.change(phno, {
        target: { value: "+1 (702) 123-4578" }
      });
      const email = await waitForElement(() => getAllByPlaceholderText("Email")[0]);
      fireEvent.change(email, {
        target: { value: "test" }
      });
      let spy = jest.spyOn(axios, "post").mockReturnValue(200);
      const saveBtn = await waitForElement(() => getAllByTitle("Save")[0]);
      fireEvent.click(saveBtn);
      await new Promise(resolve => setTimeout(resolve, 1000));
      const alertText = await waitForElement(() => getByText("Please enter a valid input"));
      expect(alertText).toBeDefined();
    });
  });

  it('should throw error if it is deleting current user', async () => {
    const localStorageMock = {
      getItem: jest.fn(() => "abcd"),
      setItem: jest.fn(),
      clear: jest.fn()
    };
    Object.defineProperty(window, 'localStorage', { value: localStorageMock, writable: true });
    const mock = new MockAdapter(axios);
    let response = mock.onGet('/api/v1.0/get_users/')
      .reply(200, [
        {
          "_id": "abcd",
          "email": "abcd@corp.com",
          "password": "Defg",
          "phone_number": "xx",
          "role": "admin",
          "active": true,
          "privileges": "Create, Read, Edit, Delete"
        }
      ])
    renderComponent();
    const { getByText, getAllByTitle, getAllByPlaceholderText } = wrapper;
    await act(async () => {
      const nameElement = await waitForElement(() => getByText("abcd"));
      expect(nameElement).toBeDefined();
      const deleteBtn = await waitForElement(() => getAllByTitle("Delete")[0]);
      fireEvent.click(deleteBtn);
      const saveBtn = await waitForElement(() => getAllByTitle("Save")[0]);
      fireEvent.click(saveBtn);
      await new Promise(resolve => setTimeout(resolve, 1000));
      expect(await waitForElement(() => getByText("Current user cannot be deleted")));
    });
  })

  it('should disable a user', async () => {
    const mock = new MockAdapter(axios);
    let response = mock.onGet('/api/v1.0/get_users/')
      .reply(200, [
        {
          "_id": "abcd",
          "email": "abcd@corp.com",
          "password": "Defg",
          "phone_number": "xx",
          "role": "admin",
          "active": true,
          "privileges": "Create, Read, Edit, Delete"
        }
      ])
    renderComponent();
    const { getByText, asFragment, getAllByTitle, getAllByPlaceholderText } = wrapper;
    await act(async () => {
      const nameElement = await waitForElement(() => getByText("abcd"));
      expect(nameElement).toBeDefined();
      /*        const disableBtn = await waitForElement(() => getAllByTitle("api-enable")[0]);
              let spy = jest.spyOn(axios, "post").mockReturnValue(200);
              fireEvent.click(disableBtn);
              await new Promise(resolve => setTimeout(resolve, 1000));
              fireEvent.click(disableBtn);
              expect(spy).toBeCalled();
      */
    });
  })

  it('should not display role', async () => {
    const mock = new MockAdapter(axios);
    let response = mock.onGet('/api/v1.0/get_users/')
      .reply(200, [
        {
          "_id": "abcd",
          "email": "abcd@corp.com",
          "password": "Defg",
          "phone_number": "xx",
          "role": null,
          "active": true,
          "privileges": ""
        }
      ])
    renderComponent();
    const { queryByText, getByText } = wrapper;
    await act(async () => {
      const nameElement = await waitForElement(() => getByText("abcd"));
      expect(nameElement).toBeDefined();
      expect(queryByText("Create")).toBeNull();
    });
  })
});
