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


DESCRIPTION: <Contains pure actions for Header Component> *
@NAME : headerActions.js
@AUTHORS: Jay Hitesh Sanghavi 
@Version : 1.0 *
@REVISION HISTORY
[03/06/2019] [Jay] : Prototyping..........////////////////////
*/
import * as actionTypes from "./actionTypes"

export const updateTimestamp = (timestamp) => {
    return {
        type:actionTypes.UPDATE_TIMESTAMP,
        timestamp
    };
};

export const asyncIsiBOFOSRunning = (status,OS_RUNNING_STATUS) => {
    return {
        type:actionTypes.GET_IS_IBOF_OS_RUNNING,
        OS_Running_Status: OS_RUNNING_STATUS,
        status,
    };
};

export const setOperationsMessage = (message) => {
    return {
        type: actionTypes.SET_OPERATIONS_MESSAGE,
        message
    };
};

