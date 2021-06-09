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


DESCRIPTION: <Contains reducer function for Header Component> *
@NAME : headerReducer.js
@AUTHORS: Jay Hitesh Sanghavi 
@Version : 1.0 *
@REVISION HISTORY
[03/06/2019] [Jay] : Prototyping..........////////////////////
*/

import * as actionTypes from "../actions/actionTypes"

export const initialState = {
    timestamp:"",
    status:false,
    state: "",
    OS_Running_Status: "...",
    operationsMessage: ""
}


const headerReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.GET_IS_IBOF_OS_RUNNING:
            return {
                ...state,
                status: action.status,
                OS_Running_Status: action.OS_Running_Status,
                state: action.state
            };
        case actionTypes.UPDATE_TIMESTAMP:
            return {
                ...state,
                timestamp: action.timestamp,
            };
        case actionTypes.SET_OPERATIONS_MESSAGE:
            return {
                ...state,
                operationsMessage: action.message
            }
        default:
            return state;
    }
};

export default headerReducer;