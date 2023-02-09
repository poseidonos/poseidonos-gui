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

import React from 'react';
import { Provider } from 'react-redux'
import { I18nextProvider } from "react-i18next";
import { configureStore } from "@reduxjs/toolkit"
import { render, cleanup } from '@testing-library/react';

import alertManagementReducer from "../../../store/reducers/alertManagementReducer"
import i18n from "../../../i18n";
import AlertTypes from './index';

let wrapper;
let alertClusterList = [
    {
        alertSubCluster: null,
        _id: '1',
        name: 'CPU',
        alertFields: ["usage_idle", "usage_system"],

    },
];
const myMock = jest.fn();
beforeEach(() => {
    const rootReducers = {
        alertManagementReducer,
    };
    const store = configureStore({ reducer: rootReducers })

    wrapper = render(
        <I18nextProvider i18n={i18n}>
            <Provider store={store}>
                <AlertTypes alertClusterList={alertClusterList} selectAlertCluster={myMock} selectAlertSubCluster={myMock} />
            </Provider>
        </I18nextProvider>);
    alertClusterList = null;
});

test('renders alert types component', async () => {
    jest.setTimeout(30000);
    const { getByLabelText, queryAllByText, getAllByTestId, getAllByRole, getByRole, getByTestId, getByText, getAllByText, asFragment } = wrapper;
    getByTestId("AlertsTypesTag");
    expect(asFragment()).toMatchSnapshot();

});

test('renders alert types component with null for ternary operator', () => {
    const { getByLabelText, queryAllByText, getByTestId, getByText, getAllByText, asFragment } = wrapper;
    expect(asFragment()).toMatchSnapshot();
    getByTestId("AlertsTypesTag");
});

afterEach(cleanup)
