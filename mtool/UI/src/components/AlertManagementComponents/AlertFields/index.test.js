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


DESCRIPTION: Alert Fields Test File
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
import { render, fireEvent, cleanup } from '@testing-library/react';
import alertManagementReducer from "../../../store/reducers/alertManagementReducer"
import i18n from "../../../i18n";
import AlertFields from './index';

let wrapper;
let alertClusterList=[{alertFields:['usage_idle','usage_system','NA']}];
const radioindex=0;
const alertClusterName = "Random";
const selectedAlertSubCluster = 'Random';
const alertType = 'Random';

beforeEach(() => {
    const rootReducers = combineReducers({
        alertManagementReducer,
    });
    const store = createStore(rootReducers)

    wrapper = render(
        <I18nextProvider i18n={i18n}>
            <Provider store={store}>
                <AlertFields alertClusterList={alertClusterList} radioindex={radioindex} alertClusterName={alertClusterName} selectedAlertSubCluster={selectedAlertSubCluster} alertType={alertType} alertRadioButton="usage_idle" />
            </Provider>
        </I18nextProvider>);
    alertClusterList[0].alertFields = null;;
});

test('renders alert fields component', () => {
    const { getByLabelText, queryAllByText, getByTestId, getAllByText, asFragment } = wrapper;
    expect(asFragment()).toMatchSnapshot();
    getByTestId("AlertFieldsTag")
    const input = getByLabelText(/usage_idle/i)

    fireEvent.change(input, { target: { value: "Samsung # \n" } });
    
});

test('renders alert fields component will null for ternary operator', () => {
    const { getByLabelText, queryAllByText, getByTestId, getAllByText, asFragment } = wrapper;
    expect(asFragment()).toMatchSnapshot();
    getByTestId("AlertFieldsTag");
    
});

afterEach(cleanup,)
