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

import * as actionTypes from './actionTypes';

export const setIsResettingConfig = payload => {
  return {
    type: actionTypes.SET_IS_RESETTING_CONFIG,
    payload
  }
}

export const setIsResetConfigFailed = payload => {
  return {
    type: actionTypes.SET_IS_RESET_CONFIGURATION_FAILED,
    payload
  }
}

export const setIsSavingConfig = payload => {
  return {
    type: actionTypes.SET_IS_SAVING_CONFIG,
    payload
  }
}

export const setShowConfig = payload => {
  return {
    type: actionTypes.SET_SHOW_CONFIG,
    payload
  }
}

export const setIsConfigured = payload => {
  return {
    type: actionTypes.SET_IS_CONFIGURED,
    payload
  }
}

export const setconfigurationFailed = () => {
  return {
    type: actionTypes.SET_CONFIGURATION_FAILED,
  }
}

export const changeCredentials = payload => {
  return {
    type: actionTypes.CHANGE_CREDENTIALS,
    payload,
  };
};

export const setIsLoggedIn = () => {
  return {
    type: actionTypes.SET_IS_LOGGED_IN,
  };
};

export const resetIsLoggedIn = () => {
  return {
    type: actionTypes.RESET_IS_LOGGED_IN,
  };
};

export const setLoginFailed = () => {
  return {
    type: actionTypes.SET_LOGIN_FAILED,
  };
};