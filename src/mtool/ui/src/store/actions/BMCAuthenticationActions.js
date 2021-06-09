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

DESCRIPTION: <Contains Actions for BMC Authentication container> *
@NAME : BMCAuthenticationActions.js
@AUTHORS: Jay Sanghavi 
@Version : 1.0 *
@REVISION HISTORY
[21/02/2020] [Jay] : Prototyping..........////////////////////
*/

import * as actionTypes from './actionTypes';

export const BMCChangeCredentials = payload => {
    return {
      type: actionTypes.BMC_CHANGE_CREDENTIALS,
      payload,
    };
  };

  export const BMCSetIsLoggedIn = () => {
    return {
      type: actionTypes.BMC_SET_IS_LOGGED_IN,
    };
  };

/*
  export const BMCResetIsLoggedIn = () => {
    return {
      type: actionTypes.BMC_RESET_IS_LOGGED_IN,
    };
  };
*/

  export const BMCSetLoginFailed = () => {
    return {
      type: actionTypes.BMC_SET_LOGIN_FAILED,
    };
  };
