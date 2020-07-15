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

