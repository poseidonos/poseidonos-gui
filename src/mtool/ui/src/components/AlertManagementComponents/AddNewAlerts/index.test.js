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
import { render, fireEvent, cleanup } from '@testing-library/react'

import AddNewAlerts from './index';
import alertManagementReducer from "../../../store/reducers/alertManagementReducer"
import i18n from "../../../i18n";

describe("Authentication", () => {
    let wrapper;
    let dropDownValues = ['Greater Than', 'Less Than'];

    const myMock = jest.fn();
    beforeEach(() => {
        const rootReducers = {
            alertManagementReducer,
        };
        const store = configureStore({ reducer: rootReducers })

        wrapper = render(
            <I18nextProvider i18n={i18n}>
                <Provider store={store}>
                    <AddNewAlerts dropdownCondition={dropDownValues} openAlert={myMock} />
                </Provider>
            </I18nextProvider>)

        dropDownValues = null;
    });

    afterEach(cleanup)

    it('renders add new alerts component', () => {
        const { getByLabelText, queryAllByText, getByTestId, getAllByText, asFragment } = wrapper;
        expect(asFragment()).toMatchSnapshot();
        getByTestId("addNewAlertsTag")
        const input = getByLabelText(/Alert Name/i)

        fireEvent.change(input, { target: { value: "Samsung # \n" } });
        fireEvent.keyDown(input, { key: 'Enter', keyCode: 13, charCode: 13 });

        fireEvent.click(getByTestId("ButtonTag"));
        getByTestId("Alert_Range_TextField");
    });


    it('renders add new alerts component1', () => {
        const { getByLabelText, queryAllByText, getByTestId, getByText, getAllByText, asFragment } = wrapper;
        const FIELD = getByLabelText(/Value/i);
        fireEvent.keyDown(getByTestId("addNewAlertsTag").querySelector('input'), { key: 'Enter', keyCode: 13, charCode: 13 });
        fireEvent.keyDown(getByLabelText(/Value/i), { key: 'Enter', keyCode: 13, charCode: 13 });

        fireEvent.change(FIELD, { target: { value: "Wassup" } });
        expect(FIELD.value).toBe('Wassup')
        fireEvent.keyDown(FIELD, { key: 'Enter', keyCode: 13, charCode: 13 });

    });

});