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


DESCRIPTION: <Contains pure actions for Loader Component> *
@NAME : waitLoaderActions.js
@AUTHORS:Jay Hitesh Sanghavi
@Version : 1.0 *
@REVISION HISTORY
[21/08/2019] [Aswin] : Prototyping..........////////////////////
*/

import * as actionTypes from "./actionTypes";

export const startLoader = (payload) => {
    return {
        type: actionTypes.START_LOADER,
        payload
    }
}

export const stopLoader = () => {
    return {
        type: actionTypes.STOP_LOADER
    }
}
