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


DESCRIPTION: <Contains reducer function for configuration page> *
@NAME : configurationsettingReducer.js
@AUTHORS: Palak Kapoor
@Version : 1.0 *
@REVISION HISTORY
[08/22/2019] [Palak] : Prototyping..........////////////////////
*/

import * as actionTypes from '../actions/actionTypes';

const initialState = {
  emaillist: [],
  istypealert: false,
  alerttype: '',
  alertOpen: false,
  alerttitle: '',
  alertdescription: '',
  configuredsmtpserver: '',
  configuredsmtpserverip:'',
  configuredsmtpport:'',
  configuredsmtpfromemail:'',
  configuredsmtpusername:'',
  smtpserverip: '',
  smtpserverport: '',
  smtpserver: '',
  smtpfromemail:'',
  smtpusername:'',
  smtppassword:'',
  timeinterval: null,
  isPasswordSet: false,
};

const configurationsettingReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.CHANGE_EMAIL_LIST: {
      return {
        ...state,
        emaillist: action.val,
      };
    }
    case actionTypes.SET_ALERT_BOX: {
      return {
        ...state,
        ...action.payload
      };
    }
    case actionTypes.SET_SMTP_SERVER: {
        return {
          ...state,
          ...action.payload
        };
    }
    case actionTypes.FETCH_EMAIL_LIST: {
      return {
        ...state,
        emaillist: action.emaillist,
      };
    }
    case actionTypes.CHANGE_SMTP_SERVER: {
      return {
        ...state,
        configuredsmtpserver: state.smtpserver,
        configuredsmtpserverip:state.smtpserverip,
        configuredsmtpserverport:state.smtpserverport,
        configuredsmtpusername:state.smtpusername,
        configuredsmtpfromemail:state.smtpfromemail,
      };
    }
    case actionTypes.DELETE_CONFIGURED_SMTP_SERVER: {
      return {
        ...state,
        configuredsmtpserver: '',
        configuredsmtpserverip:'',
        configuredsmtpserverport:'',
        configuredsmtpusername:'',
        configuredsmtpfromemail:'',
      };
    }
    case actionTypes.SET_IBOFOS_TIME_INTERVAL: {
      return {
        ...state,
        timeinterval: action.timeinterval,
      };
    }
    default:
      return state;
  }
};

export default configurationsettingReducer;
