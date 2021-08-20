/*
 *   BSD LICENSE
 *   Copyright (c) 2021 Samsung Electronics Corporation
 *   All rights reserved.
 *
 *   Redistribution and use in source and binary forms, with or without
 *   modification, are permitted provided that the following conditions
 *   are met:
 *
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in
 *       the documentation and/or other materials provided with the
 *       distribution.
 *     * Neither the name of Intel Corporation nor the names of its
 *       contributors may be used to endorse or promote products derived
 *       from this software without specific prior written permission.
 *
 *   THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 *   "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 *   LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 *   A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 *   OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 *   SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 *   LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 *   DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 *   THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 *   (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 *   OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
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
