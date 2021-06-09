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


DESCRIPTION: Alert Table Test File
@NAME : index.test.js
@AUTHORS: Jay Hitesh Sanghavi 
@Version : 1.0 *
@REVISION HISTORY
[03/06/2019] [Jay] : Prototyping..........////////////////////
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
