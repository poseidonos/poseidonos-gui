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

import { runSaga } from 'redux-saga'
import axios from 'axios'
import { configure,} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import {fetchVolumeInfo,fetchAlertsInfo } from "./dashboardSaga"

jest.mock('axios');
configure({ adapter: new Adapter() });

describe('<Testing Redux Sagas />', () => {
    beforeEach(() => {
        jest.restoreAllMocks();
    });

    it('should render fetch volume sagas', async () => {
        const dispatchedActions = [];
        axios.get.mockImplementationOnce(() =>
            Promise.resolve({
                data: ['vol1', 'vol2']
            })
        );
        const passActions = [{ type: 'FETCH_VOLUME_INFO', volumes: ['vol1', 'vol2'] }, { type: 'ENABLE_FETCHING_ALERTS', fetchingAlerts: false }];
        const fakeStore = {
            dispatch: action => dispatchedActions.push(action)
        }
        await runSaga(fakeStore, fetchVolumeInfo).done;
        expect(axios.get).toHaveBeenCalledTimes(1);
        expect(axios.get.mockResolvedValue(['vol1', 'vol2']));
        expect(dispatchedActions).toEqual(passActions);
        console.log(dispatchedActions);
    });

    it('if axios api return error in fetch volume sagas', async () => {
        const dispatchedActions = [];
        axios.get.mockImplementationOnce(() =>
            Promise.reject({
                error: 'error'
            })
        );
        const passActions = [{ type: 'FETCH_VOLUME_INFO', volumes: [] }, { type: 'ENABLE_FETCHING_ALERTS', fetchingAlerts: false }];
        const fakeStore = {
            dispatch: action => dispatchedActions.push(action)
        }
        await runSaga(fakeStore, fetchVolumeInfo).done;
        expect(axios.get).toHaveBeenCalledTimes(2);
        expect(axios.get.mockResolvedValue('error'));
        expect(dispatchedActions).toEqual(passActions);
        console.log(dispatchedActions);
    });

    it('should render fetch alerts info', async () => {
        const dispatchedActions = [];
        axios.get.mockImplementationOnce(() =>
            Promise.resolve({
                data:{alerts:['alerts1', 'alerts2']} 
            })
        );
        const passActions = [{ type: 'FETCH_ALERTS_INFO', alerts: ['alerts1', 'alerts2'] }];
        const fakeStore = {
            dispatch: action => dispatchedActions.push(action)
        }
        await runSaga(fakeStore, fetchAlertsInfo).done;
        console.log(dispatchedActions)
        expect(axios.get).toHaveBeenCalledTimes(3);
        expect(axios.get.mockResolvedValue(['alerts1', 'alerts2']));
        expect(dispatchedActions).toEqual(passActions);
        console.log(dispatchedActions);
    });

    it('if axios api return error in fetch alerts sagas', async () => {
        const dispatchedActions = [];
        axios.get.mockImplementationOnce(() =>
            Promise.reject({
                error: 'error'
            })
        );
        const passActions = [];// no actions dispatched in case of error
        const fakeStore = {
            dispatch: action => dispatchedActions.push(action)
        }
        await runSaga(fakeStore, fetchAlertsInfo).done;
        console.log(dispatchedActions);
        expect(axios.get).toHaveBeenCalledTimes(4);
        expect(axios.get.mockResolvedValue('error'));
        expect(dispatchedActions).toEqual(passActions);
        console.log(dispatchedActions);
    });
});

