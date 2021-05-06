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
@AUTHORS: Aswin K K 
@Version : 1.0 *
@REVISION HISTORY
[03/08/2020] [Jay] : Prototyping..........////////////////////
*/

jest.unmock("axios");

import React from 'react';
import { Provider } from 'react-redux';
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { ReactDOM, findDOMNode } from 'react-dom'
import { I18nextProvider } from "react-i18next";
import { combineReducers, createStore } from 'redux'
import { render, fireEvent, cleanup, waitForElement, getByText } from '@testing-library/react';
import storageReducer from "../../../store/reducers/storageReducer"
import i18n from "../../../i18n";
import CreateVolume from './index';

let wrapper;

let EVENTS = {};
function emit(event, ...args) {
    EVENTS[event].forEach(func => func(...args));
}

const socket = {
    on(event, func) {
        if(EVENTS[event]) {
            return EVENTS[event].push(func);
        }
        EVENTS[event]=[func];
    },
    emit,
    io: {
        opts: {
            transports: []
        }
    }
};


global.document.createRange= () => ({
    setStart: () => {},
    setEnd: () => {},
    commonAncestorContainer: {
        nodeName: 'BODY',
        ownerDocument: document
    }
});

const fetchVolumesMock = () => {};

beforeEach(() => {

    const rootReducers = combineReducers({
        storageReducer,
    });
    const store = createStore(rootReducers, { createVolumeButton: true });

    const createVolume = () => {
        store.dispatch({ type: "TOGGLE_CREATE_VOLUME_BUTTON", payload: true });
    };
    wrapper = render(
        <I18nextProvider i18n={i18n}>
            <Provider store={store}>
                <CreateVolume
                    maxVolumeCount={1024}
                    volCount={3}
                    fetchVolumes={fetchVolumesMock}
                    createVolume={createVolume}
                    createVolSocket={socket}
                />
            </Provider>
        </I18nextProvider>);
});

afterEach(cleanup);
test('it should show message on successful Volume Creation', async () => {
    const { getByTestId, getByLabelText, asFragment } = wrapper;
    socket.emit("connect", {});
    socket.emit("reconnect_attempt", {});
    jest.setTimeout(30000);
    const volName = await waitForElement(() => getByTestId('create-vol-name'));
    fireEvent.change(volName, { target: { value: 'vol1' } });
    const volCount = await waitForElement(() => getByTestId('create-vol-count'));
    fireEvent.change(volCount, { target: { value: 2 } });
    const volSuffix = await waitForElement(() => getByLabelText('Suffix Start Value'));
    fireEvent.change(volSuffix, { target: { value: 0 } });
    const volSize = await waitForElement(() => getByTestId('create-vol-size'));
    fireEvent.change(volSize, { target: { value: '10' } });
    const volUnitSelect = await waitForElement(() => getByTestId('volume-unit'));
    fireEvent.click(volUnitSelect);
    try {
        fireEvent.click(await waitForElement(() => getByTestId("tb")));
    } catch {
        const volUnit = await waitForElement(() => getByTestId('volume-unit-input'));
        fireEvent.change(volUnit, { target: {value: "TB"}});
    }
    const volBW = await waitForElement(() => getByTestId('create-vol-max-bw'));
    fireEvent.change(volBW, { target: { value: '10' } });
    const volIOPS = await waitForElement(() => getByTestId('create-vol-max-iops'));
    fireEvent.change(volIOPS, { target: { value: '10' } });
    const btn = await waitForElement(() => getByTestId('createvolume-btn'));
    fireEvent.click(btn);
    socket.emit("create_multi_volume", {
        total_count: 5,
        pass: 5,
        description: "SUCCESS"
    });
    expect(btn.disabled).toBeFalsy();
});


test('it should show message on successful Volume Creation', async () => {
    const { getByTestId } = wrapper;
    const btn = await waitForElement(() => getByTestId('createvolume-btn'));
    socket.emit("connect", {});
    socket.emit("create_multi_volume", {
        total_count: 5,
        pass: 5,
        description: "SUCCESS"
    });
    expect(btn.disabled).toBeFalsy();
});

test('it should show message on failed Volume Creation', async () => {
    const { getByTestId, getByLabelText, asFragment } = wrapper;
    socket.emit("connect", {});
    const volName = await waitForElement(() => getByTestId('create-vol-name'));
    fireEvent.change(volName, { target: { value: 'vol1' } });
    const volCount = await waitForElement(() => getByTestId('create-vol-count'));
    fireEvent.change(volCount, { target: { value: 2 } });
    const volSuffix = await waitForElement(() => getByLabelText('Suffix Start Value'));
    fireEvent.change(volSuffix, { target: { value: 0 } });
    const volSize = await waitForElement(() => getByTestId('create-vol-size'));
    fireEvent.change(volSize, { target: { value: '10' } });
    const volUnitSelect = await waitForElement(() => getByTestId('volume-unit'));
    fireEvent.click(volUnitSelect);
    try {
        fireEvent.click(await waitForElement(() => getByTestId("tb")));
    } catch {
        const volUnit = await waitForElement(() => getByTestId('volume-unit-input'));
        fireEvent.change(volUnit, { target: {value: "TB"}});
    }
    const volBW = await waitForElement(() => getByTestId('create-vol-max-bw'));
    fireEvent.change(volBW, { target: { value: '10' } });
    const volIOPS = await waitForElement(() => getByTestId('create-vol-max-iops'));
    fireEvent.change(volIOPS, { target: { value: '10' } });
    const btn = await waitForElement(() => getByTestId('createvolume-btn'));
    fireEvent.click(btn);
    socket.emit("create_multi_volume", {
        total_count: 5,
        pass: 0,
        description: "SUCCESS"
    });
    expect(btn.disabled).toBeFalsy();
});

test('it should show message on partial success in Volume Creation', async () => {
    const { getByTestId, getByLabelText, asFragment } = wrapper;
    socket.emit("connect", {});
    const volName = await waitForElement(() => getByTestId('create-vol-name'));
    fireEvent.change(volName, { target: { value: 'vol1' } });
    const volCount = await waitForElement(() => getByTestId('create-vol-count'));
    fireEvent.change(volCount, { target: { value: 2 } });
    const volSuffix = await waitForElement(() => getByLabelText('Suffix Start Value'));
    fireEvent.change(volSuffix, { target: { value: 0 } });
    const mountVol = await waitForElement(() => getByTestId("mount-vol-checkbox"));
    fireEvent.click(mountVol);
    // fireEvent.change(mountVol, { target: { name: 'stop_on_error_checkbox', value: true}})
    const stopError = await waitForElement(() => getByTestId("stop-on-error-checkbox"));
    fireEvent.click(stopError);
    const volSize = await waitForElement(() => getByTestId('create-vol-size'));
    fireEvent.change(volSize, { target: { value: '10' } });
    const volUnitSelect = await waitForElement(() => getByTestId('volume-unit'));
    fireEvent.click(volUnitSelect);
    try {
        fireEvent.click(await waitForElement(() => getByTestId("tb")));
    } catch {
        const volUnit = await waitForElement(() => getByTestId('volume-unit-input'));
        fireEvent.change(volUnit, { target: {value: "TB"}});
    }
    const volBW = await waitForElement(() => getByTestId('create-vol-max-bw'));
    fireEvent.change(volBW, { target: { value: '10' } });
    const volIOPS = await waitForElement(() => getByTestId('create-vol-max-iops'));
    fireEvent.change(volIOPS, { target: { value: '10' } });
    const btn = await waitForElement(() => getByTestId('createvolume-btn'));
    fireEvent.click(btn);
    socket.emit("create_multi_volume", {
        total_count: 3,
        pass: 2,
        description: "PARTIAL SUCCESS"
    });
    expect(btn.disabled).toBeFalsy();
});
