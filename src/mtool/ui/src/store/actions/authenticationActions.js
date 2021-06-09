import * as actionTypes from './actionTypes';

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