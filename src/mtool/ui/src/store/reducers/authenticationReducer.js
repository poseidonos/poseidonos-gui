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
 *     * Neither the name of Samsung Electronics Corporation nor the names of its
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


export const initialState = {
    username: '',
    password: '',
    restIP: '',
    restPort: '',
    telemetryIP: '',
    telemetryPort: '',
    loginFailed: false,
    isLoggedIn: false,
};

const authenticationReducer = (state = initialState, action) => {
    switch (action.type) {
      case actionTypes.CHANGE_CREDENTIALS: {
        return {
          ...state,
        [action.payload.name] : action.payload.value,
        };
      }

      case actionTypes.SET_IS_LOGGED_IN: {
        return {
          ...state,
        isLoggedIn : true,
        loginFailed : false,
        };
      }

      case actionTypes.RESET_IS_LOGGED_IN: {
        return {
          ...state,
        isLoggedIn : false,
        };
      }

      case actionTypes.SET_LOGIN_FAILED: {
        return {
          ...state,
        loginFailed : true,
        };
      }
     
      default:
        return state;
    }
  };
  
  export default authenticationReducer;
  