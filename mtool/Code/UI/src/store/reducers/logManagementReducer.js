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


DESCRIPTION: <Contains reducer function for Log Management page> *
@NAME : logManagementReducer.js
@AUTHORS: Palak Kapoor
@Version : 1.0 *
@REVISION HISTORY
[08/22/2019] [Palak] : Prototyping..........////////////////////
*/

import * as actionTypes from '../actions/actionTypes';

const initialState = {
  logList: [],
  showLiveLogs: "yes",
  label: "",
  value: "",
  entries: 0,
};

const logManagementReducer = (state = initialState, action) => {
  switch (action.type) {
   
    case actionTypes.GET_IBOFOS_LOGS: {
      let value = "";
      let label= "";
      let entries=0;
      const log = action.logList;
      for (let i=0; i< log.length;i += 1) {
        entries = log[i].entries
        if (log[i].code === "2804" || log[i].code === "1234") {
          if (log[i].code === "2804") {
            label= "Poseidon OS Rebuild Progress: "
          } else {
            label= "Poseidon OS System Recovery Progress: "
          }
          value = log[i].value;
          break;
        }
      }
      return {
        showLiveLogs: state.showLiveLogs,
        logList: action.logList,
        value,
        label,
        entries
      };
    }
    case actionTypes.SET_LIVE_LOGS: {
      return {
        ...state,
        showLiveLogs: action.setLiveLogs,
      };
    }
    default:
      return state;
  }
};

export default logManagementReducer;
