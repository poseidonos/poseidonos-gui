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

DESCRIPTION: <Contains Reducer Functions for BMC Authentication container> *
@NAME : BMCAuthenticationReducer.js
@AUTHORS: Jay Sanghavi 
@Version : 1.0 *
@REVISION HISTORY
[21/02/2020] [Jay] : Prototyping..........////////////////////
*/

import * as actionTypes from '../actions/actionTypes';


export const initialState = {
    bmc_username: '',
    bmc_password: '',
    bmc_loginFailed: false,
    bmc_isLoggedIn: false,
};

const BMCAuthenticationReducer = (state = initialState, action) => {
    switch (action.type) {
      case actionTypes.BMC_CHANGE_CREDENTIALS: {
        return {
          ...state,
        [action.payload.name] : action.payload.value,
        };
      }

      case actionTypes.BMC_SET_IS_LOGGED_IN: {
        return {
          ...state,
        bmc_isLoggedIn : true,
        bmc_loginFailed : false,
        };
      }

      case actionTypes.BMC_RESET_IS_LOGGED_IN: {
        return {
          ...state,
        bmc_isLoggedIn : false,
        };
      }

      case actionTypes.BMC_SET_LOGIN_FAILED: {
        return {
          ...state,
        bmc_loginFailed : true,
        };
      }
     
      default:
        return state;
    }
  };
  
  export default BMCAuthenticationReducer;
  
