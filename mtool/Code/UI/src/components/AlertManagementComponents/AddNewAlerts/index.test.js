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


DESCRIPTION: Add New Alerts Test File
@NAME : index.test.js
@AUTHORS: Jay Hitesh Sanghavi 
@Version : 1.0 *
@REVISION HISTORY
[03/06/2019] [Jay] : Prototyping..........////////////////////
*/

import React from 'react';
import { Provider } from 'react-redux'
import { ReactDOM, findDOMNode } from 'react-dom'
import { I18nextProvider } from "react-i18next";
import { combineReducers, createStore } from 'redux'
import { render, fireEvent, cleanup } from '@testing-library/react'
import AddNewAlerts from './index';
import alertManagementReducer from "../../../store/reducers/alertManagementReducer"
import i18n from "../../../i18n";
describe("Authentication", () => {
    let wrapper;
    let dropDownValues = ['Greater Than', 'Less Than'];

    const myMock = jest.fn();
    beforeEach(() => {
        const rootReducers = combineReducers({
            alertManagementReducer,
        });
        const store = createStore(rootReducers)

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