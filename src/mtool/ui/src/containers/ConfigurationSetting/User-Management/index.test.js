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
import { Router } from "react-router-dom";
import { Provider } from "react-redux";
import createSagaMiddleware from "redux-saga";
import { act } from "react-dom/test-utils";
import { I18nextProvider } from "react-i18next";
import { configureStore } from "@reduxjs/toolkit";
import {
  render,
  fireEvent,
  cleanup,
  waitForElement,
} from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { createMemoryHistory } from "history";

import rootSaga from "../../../sagas/indexSaga";
import alertManagementReducer from "../../../store/reducers/alertManagementReducer";
import userManagementReducer from "../../../store/reducers/userManagementReducer";
import i18n from "../../../i18n";
import UserManagement from "./index";

jest.unmock("axios");

//duplicate code 
const userJson = {
  "confirmpassword": "test1234",
  "emailid": "abcd@abc.com",
  "error": "",
  "mobilenumber": "+123457890",
  "password": "test1234",
  "phone_number": "+82",
  "user_role": "Admin",
  "username": "abcd1234"
}
const headerJson = {
  "headers": {
    "Accept": "application/json",
    "Content-Type": "application/json",
    "x-access-token": null
  }
}

const userResponseJson = [
  {
    "_id": "abcd",
    "email": "abcd@corp.com",
    "password": "Defg",
    "phone_number": "xx",
    "role": "admin",
    "active": true,
    "privileges": "Create, Read, Edit, Delete"
  }
]



describe("ConfigurationSetting", () => {
  let wrapper;
  let history;
  let store;
  beforeEach(() => {
    const sagaMiddleware = createSagaMiddleware();
    const rootReducers = {
      alertManagementReducer,
      userManagementReducer
    };
    store = configureStore({
      reducer: rootReducers,
      middleware: [sagaMiddleware]
    })
    sagaMiddleware.run(rootSaga);
    const route = "/ConfigurationSetting/user";
    history = createMemoryHistory({ initialEntries: [route] });
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
    mock.onGet('/api/v1.0/get_users/').reply(200, null);
    renderComponent();
    const { getByText, asFragment } = wrapper;
    expect(getByText("User List")).toBeDefined();
  });

  it('fails to get user info', async () => {
    const mock = new MockAdapter(axios);
    mock.onGet('/api/v1.0/get_users/').reply(500, null);
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
    const { getByTestId, getByText } = wrapper;
    const username = getByTestId('add-user-name');
    const password = getByTestId('add-user-password');
    const confirmPassword = getByTestId('add-user-confirm-password');
    const phno = getByTestId('add-user-phno');
    const email = getByTestId('add-user-email');
    const confirmBtn = getByText('Submit');
    fireEvent.keyDown(username, { key: 'A', code: 65, charCode: 65 });
    fireEvent.keyDown(username, { key: '+', code: 43, charCode: 43 });
    fireEvent.change(username, { target: { value: 'abcd1234' } });
    fireEvent.keyDown(password, { key: 'A', code: 65, charCode: 65 });
    fireEvent.keyDown(password, { key: '+', code: 43, charCode: 43 });
    fireEvent.change(password, { target: { value: 'test1234' } });
    fireEvent.keyDown(confirmPassword, { key: 'A', code: 65, charCode: 65 });
    fireEvent.keyDown(confirmPassword, { key: '+', code: 43, charCode: 43 });
    fireEvent.change(confirmPassword, { target: { value: 'test1234' } });
    fireEvent.keyDown(email, { key: 'A', code: 65, charCode: 65 });
    fireEvent.keyDown(email, { key: '+', code: 43, charCode: 43 });
    fireEvent.change(email, { target: { value: 'abcd@abc.com' } });
    fireEvent.change(phno, { target: { value: '+81123457890' } });
    fireEvent.click(confirmBtn);
    expect(getByText('Yes')).toBeDefined();
    fireEvent.click(getByText('Yes'));
    expect(getSpy).toHaveBeenCalledWith('/api/v1.0/add_new_user/', {
      "confirmpassword": "test1234",
      "emailid": "abcd@abc.com",
      "error": "",
      "mobilenumber": "+81123457890",
      "password": "test1234",
      "phone_number": "+82",
      "user_role": "Admin",
      "username": "abcd1234"
    }, headerJson);
  });

  it('should display an error while adding a new user if the username already exists', () => {
    const mock = new MockAdapter(axios);
    mock.onPost('/api/v1.0/add_new_user/').reply(400, null)
      .onGet('/api/v1.0/get_users/').reply(200, null);
      const getSpy = jest.spyOn(axios, 'post');
    renderComponent();
    const { getByTestId, getByText } = wrapper;
    const username = getByTestId('add-user-name');
    const password = getByTestId('add-user-password');
    const confirmPassword = getByTestId('add-user-confirm-password');
    const phno = getByTestId('add-user-phno');
    const email = getByTestId('add-user-email');
    const confirmBtn = getByText('Submit');
    fireEvent.keyDown(username, { key: 'A', code: 65, charCode: 65 });
    fireEvent.keyDown(username, { key: '+', code: 43, charCode: 43 });
    fireEvent.change(username, { target: { value: 'abcd1234' } });
    fireEvent.keyDown(password, { key: 'A', code: 65, charCode: 65 });
    fireEvent.keyDown(password, { key: '+', code: 43, charCode: 43 });
    fireEvent.change(password, { target: { value: 'test1234' } });
    fireEvent.keyDown(confirmPassword, { key: 'A', code: 65, charCode: 65 });
    fireEvent.keyDown(confirmPassword, { key: '+', code: 43, charCode: 43 });
    fireEvent.change(confirmPassword, { target: { value: 'test1234' } });
    fireEvent.keyDown(email, { key: 'A', code: 65, charCode: 65 });
    fireEvent.keyDown(email, { key: '+', code: 43, charCode: 43 });
    fireEvent.change(email, { target: { value: 'abcd@abc.com' } });
    fireEvent.change(phno, { target: { value: '123457890' } });
    fireEvent.click(confirmBtn);
    expect(getByText('Yes')).toBeDefined();
    fireEvent.click(getByText('Yes'));
    expect(getSpy).toHaveBeenCalledWith('/api/v1.0/add_new_user/', userJson, headerJson);
  });

  it('should display an error if an invalid phone number is entered', () => {
    const mock = new MockAdapter(axios);
    mock.onPost('/api/v1.0/add_new_user/').reply(400, null)
      .onGet('/api/v1.0/get_users/').reply(200, null);
    jest.spyOn(axios, 'post');
    renderComponent();
    const { getByTestId, getByText } = wrapper;
    const username = getByTestId('add-user-name');
    const password = getByTestId('add-user-password');
    const confirmPassword = getByTestId('add-user-confirm-password');
    const phno = getByTestId('add-user-phno');
    const email = getByTestId('add-user-email');
    const confirmBtn = getByText('Submit');
    fireEvent.keyDown(username, { key: 'A', code: 65, charCode: 65 });
    fireEvent.keyDown(username, { key: '+', code: 43, charCode: 43 });
    fireEvent.change(username, { target: { value: 'abcd1234' } });
    fireEvent.keyDown(password, { key: 'A', code: 65, charCode: 65 });
    fireEvent.keyDown(password, { key: '+', code: 43, charCode: 43 });
    fireEvent.change(password, { target: { value: 'test1234' } });
    fireEvent.keyDown(confirmPassword, { key: 'A', code: 65, charCode: 65 });
    fireEvent.keyDown(confirmPassword, { key: '+', code: 43, charCode: 43 });
    fireEvent.change(confirmPassword, { target: { value: 'test1234' } });
    fireEvent.keyDown(email, { key: 'A', code: 65, charCode: 65 });
    fireEvent.keyDown(email, { key: '+', code: 43, charCode: 43 });
    fireEvent.change(email, { target: { value: 'abcd@abc.com' } });
    fireEvent.change(phno, { target: { value: '1230' } });
    fireEvent.click(confirmBtn);
    expect(getByText("Please provide a valid Phone Number")).toBeDefined();
  });

  it('should display an error if unable to add a new user', () => {
    const mock = new MockAdapter(axios);
    mock.onPost('/api/v1.0/add_new_user/').reply(500, null)
      .onGet('/api/v1.0/get_users/').reply(200, null);
      const getSpy = jest.spyOn(axios, 'post');
      renderComponent();
      const { getByTestId, getByText } = wrapper;
      const username = getByTestId('add-user-name');
      const password = getByTestId('add-user-password');
      const confirmPassword = getByTestId('add-user-confirm-password');
      const phno = getByTestId('add-user-phno');
      const email = getByTestId('add-user-email');
      const confirmBtn = getByText('Submit');
      fireEvent.keyDown(username, { key: 'A', code: 65, charCode: 65 });
      fireEvent.keyDown(username, { key: '+', code: 43, charCode: 43 });
      fireEvent.change(username, { target: { value: 'abcd1234' } });
      fireEvent.keyDown(password, { key: 'A', code: 65, charCode: 65 });
      fireEvent.keyDown(password, { key: '+', code: 43, charCode: 43 });
      fireEvent.change(password, { target: { value: 'test1234' } });
      fireEvent.keyDown(confirmPassword, { key: 'A', code: 65, charCode: 65 });
      fireEvent.keyDown(confirmPassword, { key: '+', code: 43, charCode: 43 });
      fireEvent.change(confirmPassword, { target: { value: 'test1234' } });
      fireEvent.keyDown(email, { key: 'A', code: 65, charCode: 65 });
      fireEvent.keyDown(email, { key: '+', code: 43, charCode: 43 });
      fireEvent.change(email, { target: { value: 'abcd@abc.com' } });
      fireEvent.change(phno, { target: { value: '123457890' } });
      fireEvent.click(confirmBtn);
      expect(getByText('Yes')).toBeDefined();
      fireEvent.click(getByText('Yes'));
      expect(getSpy).toHaveBeenCalledWith('/api/v1.0/add_new_user/', userJson, headerJson);
  });


  it('should throw appropriate error while adding a new user with wrong input', async () => {
    renderComponent();
    const { getByTestId, getByText } = wrapper;
    const username = getByTestId('add-user-name');
    const password = getByTestId('add-user-password');
    const confirmPassword = getByTestId('add-user-confirm-password');
    const phno = getByTestId('add-user-phno');
    const email = getByTestId('add-user-email');
    const confirmBtn = getByText('Submit');
    fireEvent.keyDown(username, { key: 'A', code: 65, charCode: 65 });
    fireEvent.change(username, { target: { value: 'abcd1234' } });
    fireEvent.keyDown(password, { key: 'A', code: 65, charCode: 65 });
    fireEvent.change(password, { target: { value: 'test' } });
    fireEvent.click(confirmBtn);
    expect(getByText("Please Enter a Valid Password")).toBeDefined();
    fireEvent.click(getByText("OK"));
    fireEvent.change(password, { target: { value: 'test1234' } });
    fireEvent.click(confirmBtn);
    fireEvent.keyDown(confirmPassword, { key: 'B', code: 65, charCode: 65 });
    fireEvent.change(confirmPassword, { target: { value: 'test2' } });
    fireEvent.click(confirmBtn);
    expect(getByText("Passwords do not match")).toBeDefined();
    fireEvent.click(getByText("OK"));
    fireEvent.change(confirmPassword, { target: { value: 'test1234' } });
    fireEvent.change(phno, { target: { value: '22' } });
    fireEvent.click(confirmBtn);
    await waitForElement(() => getByText("OK"));
    expect(getByText("Please provide a valid Phone Number")).toBeDefined();
    fireEvent.click(getByText("OK"));
    fireEvent.change(phno, { target: { value: '223456789' } });
    fireEvent.change(email, { target: { value: 'abcd@.abc' } });
    fireEvent.click(confirmBtn);
    expect(getByText("Please Enter a Valid Email ID")).toBeDefined();
  });

  it('should cancel adding a user', () => {
    renderComponent();
    const { getByTestId, getByText } = wrapper;
    const username = getByTestId('add-user-name');
    const cancelBtn = getByText('Cancel');
    fireEvent.keyDown(username, { key: 'A', code: 65, charCode: 65 });
    fireEvent.change(username, { target: { value: 'abcd' } });
    fireEvent.click(cancelBtn);
    expect(getByText('Yes')).toBeDefined();
    fireEvent.click(getByText('No'));
  });
  it('should cancel adding a user by clicking yes', () => {
    renderComponent();
    const { getByTestId, getByText } = wrapper;
    const username = getByTestId('add-user-name');
    const cancelBtn = getByText('Cancel');
    fireEvent.keyDown(username, { key: 'A', code: 65, charCode: 65 });
    fireEvent.change(username, { target: { value: 'abcd' } });
    fireEvent.click(cancelBtn);
    expect(getByText('Yes')).toBeDefined();
    fireEvent.click(getByText('Yes'));
  });

  it('should throw error when username is not present', () => {
    renderComponent();
    const { getByText } = wrapper;
    const confirmBtn = getByText('Submit');
    fireEvent.click(confirmBtn);
    expect(getByText("Alphanumeric characters only")).toBeDefined();
  });

  it('should add list all the users', async () => {
    const mock = new MockAdapter(axios);
    mock.onGet('/api/v1.0/get_users/')
      .reply(200, userResponseJson);
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
    mock.onGet('/api/v1.0/get_users/')
      .reply(200, userResponseJson)
      .onPost('/api/v1.0/delete_users/').reply(200, null);
    const getSpy = jest.spyOn(axios, 'post');

    renderComponent();
    const { getByText, asFragment, getAllByTitle, getAllByPlaceholderText } = wrapper;
    await act(async () => {
      const nameElement = await waitForElement(() => getByText("abcd"));
      expect(nameElement).toBeDefined();
      const deleteBtn = await waitForElement(() => getAllByTitle("Delete")[0]);
      fireEvent.click(deleteBtn);
      const yesBtn = await waitForElement(() => getByText("Yes"));
      fireEvent.click(yesBtn);
      await new Promise(resolve => setTimeout(resolve, 1000));
      expect(getSpy).toHaveBeenCalledWith('/api/v1.0/delete_users/', {
        "ids": ["abcd"],
      }, headerJson);
    });
  })

  it('should display an error if unable to delete a user', async () => {
    const mock = new MockAdapter(axios);
    mock.onGet('/api/v1.0/get_users/')
      .reply(200, userResponseJson)
      .onPost('/api/v1.0/delete_users/').reply(500, null);
    const getSpy = jest.spyOn(axios, 'post');
    renderComponent();
    const { getByText, asFragment, getAllByTitle, getAllByPlaceholderText } = wrapper;
    await act(async () => {
      const nameElement = await waitForElement(() => getByText("abcd"));
      expect(nameElement).toBeDefined();
      const deleteBtn = await waitForElement(() => getAllByTitle("Delete")[0]);
      fireEvent.click(deleteBtn);
      const saveBtn = await waitForElement(() => getByText("Yes"));
      fireEvent.click(saveBtn);
      await new Promise(resolve => setTimeout(resolve, 1000));
      expect(getSpy).toHaveBeenCalledWith('/api/v1.0/delete_users/', {
        "ids": ["abcd"],
      }, headerJson);
      expect(asFragment()).toMatchSnapshot();
    });
  })

  it('should edit a user', async () => {
    const mock = new MockAdapter(axios);
    mock.onGet('/api/v1.0/get_users/')
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
    const { getByText, getAllByTitle, getAllByPlaceholderText } = wrapper;
    await act(async () => {
      const nameElement = await waitForElement(() => getByText("abcd"));
      expect(nameElement).toBeDefined();
      const editBtn = await waitForElement(() => getAllByTitle("Edit")[0]);
      fireEvent.click(editBtn);
      const phno = await waitForElement(() => getAllByPlaceholderText("+1 (702) 123-4567")[0]);
      fireEvent.change(phno, {
        target: { value: "+1 (702) 123-4578" }
      });
      const email = await waitForElement(() => getAllByTitle("email")[0]);
      fireEvent.change(email, {
        target: { value: "test@abc.com" }
      });
      const saveBtn = await waitForElement(() => getAllByTitle("Save")[0]);
      fireEvent.click(saveBtn);
      await new Promise(resolve => setTimeout(resolve, 1000));
      expect(getSpy).toHaveBeenCalledWith('/api/v1.0/update_user/',
        expect.objectContaining({
          _id: 'abcd',
          email: 'test@abc.com',
          password: 'Defg',
          phone_number: '+17021234578',
          role: 'admin',
          active: true,
          privileges: 'Create, Read, Edit, Delete',
          selected: false,
          edit: true,
          oldid: 'abcd'
        }), {
        "headers": {
          "Accept": "application/json",
          "Content-Type": "application/json",
          "x-access-token": null
        }
      });
    })
  })

  it('should edit a user', async () => {
    const mock = new MockAdapter(axios);
    mock.onGet('/api/v1.0/get_users/')
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
    const { getByText, getAllByTitle, getAllByPlaceholderText } = wrapper;
    await act(async () => {
      const nameElement = await waitForElement(() => getByText("abcd"));
      expect(nameElement).toBeDefined();
      const editBtn = await waitForElement(() => getAllByTitle("Edit")[0]);
      fireEvent.click(editBtn);
      const phno = await waitForElement(() => getAllByPlaceholderText("+1 (702) 123-4567")[0]);
      fireEvent.change(phno, {
        target: { value: "+1 (702) 123-4578" }
      });
      const email = await waitForElement(() => getAllByTitle("email")[0]);
      fireEvent.change(email, {
        target: { value: "test@abc.com" }
      });
      const saveBtn = await waitForElement(() => getAllByTitle("Save")[0]);
      fireEvent.click(saveBtn);
      await new Promise(resolve => setTimeout(resolve, 1000));
      expect(getSpy).toHaveBeenCalledWith('/api/v1.0/update_user/',
        expect.objectContaining({
          _id: 'abcd',
          email: 'test@abc.com',
          password: 'Defg',
          phone_number: '+17021234578',
          role: 'admin',
          active: true,
          privileges: 'Create, Read, Edit, Delete',
          selected: false,
          edit: true,
          oldid: 'abcd'
        }), {
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
    mock.onGet('/api/v1.0/get_users/')
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
      const email = await waitForElement(() => getAllByTitle("email")[0]);
      fireEvent.change(email, {
        target: { value: "test@abc.com" }
      });
      const saveBtn = await waitForElement(() => getAllByTitle("Save")[0]);
      fireEvent.click(saveBtn);
      await new Promise(resolve => setTimeout(resolve, 1000));
      expect(getSpy).toHaveBeenCalledWith('/api/v1.0/update_user/',
        expect.objectContaining({
          _id: 'abcd',
          email: 'test@abc.com',
          password: 'Defg',
          phone_number: "+17021234578",
          role: 'admin',
          active: true,
          privileges: 'Create, Read, Edit, Delete',
          selected: false,
          edit: true,
          oldid: 'abcd'
        }), {
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
    mock.onGet('/api/v1.0/get_users/')
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
      const email = await waitForElement(() => getAllByTitle("email")[0]);
      fireEvent.change(email, {
        target: { value: "test@abc.com" }
      });
      const saveBtn = await waitForElement(() => getAllByTitle("Save")[0]);
      fireEvent.click(saveBtn);
      await new Promise(resolve => setTimeout(resolve, 1000));
      expect(getSpy).toHaveBeenCalledWith('/api/v1.0/update_user/',
        expect.objectContaining({
          _id: 'abcd',
          email: 'test@abc.com',
          password: 'Defg',
          phone_number: "+17021234578",
          role: 'admin',
          active: true,
          privileges: 'Create, Read, Edit, Delete',
          selected: false,
          edit: true,
          oldid: 'abcd'
        }), {
        "headers": {
          "Accept": "application/json",
          "Content-Type": "application/json",
          "x-access-token": null
        }
      });
    });
  });

  it('should throw an error if the updated phone number is not valid', async () => {
    const mock = new MockAdapter(axios);
    let response = mock.onGet('/api/v1.0/get_users/')
      .reply(200, userResponseJson);
    renderComponent();
    const { getByText, asFragment, getAllByTitle, getAllByPlaceholderText } = wrapper;
    await act(async () => {
      const nameElement = await waitForElement(() => getByText("abcd"));
      expect(nameElement).toBeDefined();
      const editBtn = await waitForElement(() => getAllByTitle("Edit")[0]);
      fireEvent.click(editBtn);
      const phno = await waitForElement(() => getAllByPlaceholderText("+1 (702) 123-4567")[0]);
      fireEvent.change(phno, {
        target: { value: "+1234" }
      });
      expect(asFragment()).toMatchSnapshot();
      const email = await waitForElement(() => getAllByTitle("email")[0]);
      fireEvent.change(email, {
        target: { value: "test@test.com" }
      });
      let spy = jest.spyOn(axios, "post").mockReturnValue(200);
      const saveBtn = await waitForElement(() => getAllByTitle("Save")[0]);
      fireEvent.click(saveBtn);
      await new Promise(resolve => setTimeout(resolve, 1000));
      const alertText = await waitForElement(() => getByText("Please Enter a Valid Phone Number"));
      expect(alertText).toBeDefined();
    });
  });

  it('should throw an error if the emailid is not valid', async () => {
    const mock = new MockAdapter(axios);
    let response = mock.onGet('/api/v1.0/get_users/')
      .reply(200, userResponseJson);
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
      expect(asFragment()).toMatchSnapshot();
      const email = await waitForElement(() => getAllByTitle("email")[0]);
      fireEvent.change(email, {
        target: { value: "test" }
      });
      let spy = jest.spyOn(axios, "post").mockReturnValue(200);
      const saveBtn = await waitForElement(() => getAllByTitle("Save")[0]);
      fireEvent.click(saveBtn);
      await new Promise(resolve => setTimeout(resolve, 1000));
      expect(asFragment()).toMatchSnapshot();
      const alertText = await waitForElement(() => getByText("Please Enter a Valid Email"));
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
    mock.onGet('/api/v1.0/get_users/')
      .reply(200, userResponseJson)
    renderComponent();
    const { getByText, getAllByTitle } = wrapper;
    await act(async () => {
      const nameElement = await waitForElement(() => getByText("abcd"));
      expect(nameElement).toBeDefined();
      const deleteBtn = await waitForElement(() => getAllByTitle("Delete")[0]);
      fireEvent.click(deleteBtn);
      expect(await waitForElement(() => getByText("Current user cannot be deleted")));
    });
  })

  it('should disable a user', async () => {
    const mock = new MockAdapter(axios);
    mock.onGet('/api/v1.0/get_users/')
      .reply(200, userResponseJson)
    renderComponent();
    const { getByText } = wrapper;
    await act(async () => {
      const nameElement = await waitForElement(() => getByText("abcd"));
      expect(nameElement).toBeDefined();
    });
  })

  it('should not display role', async () => {
    const mock = new MockAdapter(axios);
    mock.onGet('/api/v1.0/get_users/')
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
    })
  });
})
