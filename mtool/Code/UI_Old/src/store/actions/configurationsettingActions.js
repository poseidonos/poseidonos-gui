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


DESCRIPTION: <Contains pure actions for Configuration Page> *
@NAME : configurationsettingActions.js
@AUTHORS: Palak Kapoor
@Version : 1.0 *
@REVISION HISTORY
[08/22/2019] [Palak] : Prototyping..........////////////////////
*/

import * as actionTypes from './actionTypes';

export const setIbofOSTimeInterval = timeinterval => {
  return {
    type: actionTypes.SET_IBOFOS_TIME_INTERVAL,
    timeinterval,
  };
};

export const changeEmailList = newemaillist => {
  return {
    type: actionTypes.CHANGE_EMAIL_LIST,
    val: newemaillist,
  };
};

export const setAlertBox = payload => {
  return {
    type: actionTypes.SET_ALERT_BOX,
    payload,
  };
};

export const fetchEmailList = emaillist => {
  return {
    type: actionTypes.FETCH_EMAIL_LIST,
    emaillist,
  };
};

export const changeSmtpServer = payload => {
  return {
    type: actionTypes.CHANGE_SMTP_SERVER,
    payload,
  };
};

export const setSmtpServer = payload => {
  return {
    type: actionTypes.SET_SMTP_SERVER,
    payload,
  };
};

export const deleteConfiguredSmtpServer = () => {
  return {
    type: actionTypes.DELETE_CONFIGURED_SMTP_SERVER,
  };
};
