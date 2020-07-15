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


DESCRIPTION: Alert Types Test File
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
import { I18nextProvider } from "react-i18next";
import { combineReducers, createStore } from 'redux'
import { render, fireEvent, cleanup, getByText, getByRole, waitForElement } from '@testing-library/react';
import alertManagementReducer from "../../../store/reducers/alertManagementReducer"
import i18n from "../../../i18n";
import AlertTypes from './index';

let wrapper;
let alertClusterList = [
    {
        alertSubCluster: null,
        // [
        //     {
        //         _id: '1',
        //         name: 'cpu-host',
        //         alertTypes: [
        //             {
        //                 type: 'cpu-idle',
        //             },
        //             {
        //                 type: 'cpu-idle2',
        //             },
        //             {
        //                 type: 'cpu-affinity',
        //             },
        //         ],
        //     },
        // ],
        _id: '1',
        name: 'CPU',
        alertFields: ["usage_idle","usage_system"],

    },
];
const myMock = jest.fn();
beforeEach(() => {
    const rootReducers = combineReducers({
        alertManagementReducer,
    });
    const store = createStore(rootReducers)

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
