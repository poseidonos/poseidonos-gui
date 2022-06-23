import * as actionTypes from "./actionTypes";


export const toggleAdvanceCreateVolumePopup = (payload) => {
    return {
        type: actionTypes.TOGGLE_ADVANCE_CREATE_VOLUME_POPUP,
        payload
    }
}

export const resetInputs = () => {
    return {
        type: actionTypes.RESET_INPUTS
    }
}
