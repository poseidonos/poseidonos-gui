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

import React from 'react';
import { Provider } from 'react-redux'
import { ReactDOM, findDOMNode } from 'react-dom'
import { act } from 'react-dom/test-utils'
import MockAdapter from 'axios-mock-adapter'
import axios from 'axios'
import { I18nextProvider } from "react-i18next";
import { combineReducers, createStore } from 'redux'
import { render, fireEvent, cleanup, getByText, getByTitle, getAllByTitle, waitForElement } from '@testing-library/react';
import alertManagementReducer from "../../../store/reducers/alertManagementReducer"
import i18n from "../../../i18n";
import AlertTable from './index';

jest.unmock('axios');
let wrapper;
let dropDownValues = null;
let alerts = [{ "_id": { "$oid": "5d5e67b7f082d4c68c98f58b" }, "alertName": "NewAlert", "alertCluster": "cpu", "alertSubCluster": "device", "alertType": "cpu-total", "alertCondition": null, "alertField": "usage_system", "description": "last", "alertRange": "109", "active": true },]
beforeEach(() => {
    const rootReducers = combineReducers({
        alertManagementReducer,
    });
    const store = createStore(rootReducers)
    const myMock = jest.fn();
    wrapper = render(
        <I18nextProvider i18n={i18n}>
            <Provider store={store}>
                <AlertTable dropdownCondition={dropDownValues} alerts={alerts} />
            </Provider>
        </I18nextProvider>);
    dropDownValues = null;
});

  
test('renders alert table component with null for ternary operator', () => {
    const { getByLabelText, queryAllByText, getByTestId, getByText, getAllByText, asFragment } = wrapper;
    expect(asFragment()).toMatchSnapshot();
    getByTestId("AlertsTableTag");

    const input = getByTestId("AlertsTableTag").querySelector('button')
    fireEvent.click(input);
    fireEvent.change(input, { target: { value: "Samsung # \n" } });
});

afterEach(cleanup)
