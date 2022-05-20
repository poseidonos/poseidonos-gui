import * as actionTypes from "./actionTypes";


export const resetInputs = () => {
    return {
        type: actionTypes.RESET_INPUTS
    }
}

export const changeInput = (payload) => {
    return {
        type: actionTypes.CHANGE_INPUT,
        payload
    }
}

export const updateSubsystem = (payload) => {
    return {
        type: actionTypes.UPDATE_SUBSYSTEM,
        payload
    }
}

export const setUnit = (payload) => {
    return {
        type: actionTypes.SET_UNIT,
        payload
    }
}

export const toggleAdvanceCreateVolumePopup = (payload) => {
    return {
        type: actionTypes.TOGGLE_ADVANCE_CREATE_VOLUME_POPUP,
        payload
    }
}
