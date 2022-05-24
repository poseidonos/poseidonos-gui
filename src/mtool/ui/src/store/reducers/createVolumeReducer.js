import * as actionTypes from "../actions/actionTypes";

export const initialState = {
    showAdvanceOptions: false,
    activeStep: 0,
    volume_count: 1,
    volume_name: "vol",
    volume_suffix: 0,
    volume_size: 0,
    volume_description: "",
    volume_units: "GB",
    maxbw: 0,
    maxiops: 0,
    minvalue: 0,
    mintype: "miniops",
    stop_on_error_checkbox: false,
    mount_vol: true,
    subsystem: "",
    transport: "",
    selectedNewSubsystem: false,
    subnqn: "",
    transport_type: "TCP",
    target_address: "",
    transport_service_id: "1158",
};

const createVolumeReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.RESET_INPUTS: {
            return {
                ...state,
                activeStep: 0,
                volume_count: 1,
                volume_name: "vol",
                volume_suffix: 0,
                volume_size: 0,
                volume_description: "",
                volume_units: "GB",
                maxbw: 0,
                maxiops: 0,
                minvalue: 0,
                mintype: "miniops",
                stop_on_error_checkbox: false,
                mount_vol: true,
                selectedNewSubsystem: false,
                subnqn: "",
                transport_type: "TCP",
                target_address: "",
                transport_service_id: "1158",
            }
        }

        case actionTypes.CHANGE_INPUT: {
            const { name, value } = action.payload;
            if (name === "mount_vol_checkbox") {
                return {
                    ...state,
                    mount_vol: !state.mount_vol
                }
            }
            if (name === "stop_on_error_checkbox") {
                return {
                    ...state,
                    stop_on_error_checkbox: !state.stop_on_error_checkbox,
                }
            }
            if (name === "selectedNewSubsystem") {
                return {
                    ...state,
                    selectedNewSubsystem: !state.selectedNewSubsystem,
                }
            }
            return {
                ...state,
                [name]: value
            }
        }

        case actionTypes.UPDATE_SUBSYSTEM: {
            return {
                ...state,
                subsystem: action.payload.subsystem,
                transport: action.payload.transport
            }
        }

        case actionTypes.SET_UNIT: {
            return {
                ...state,
                volume_units: action.payload.volume_units
            }
        }

        case actionTypes.TOGGLE_ADVANCE_CREATE_VOLUME_POPUP: {
            return {
                ...state,
                activeStep: 0,
                showAdvanceOptions: action.payload
            };
        }

        case actionTypes.SET_ACTIVE_STEP: {
            return {
                ...state,
                activeStep: action.payload
            }
        }

        default:
            return state;
    }
}

export default createVolumeReducer;
