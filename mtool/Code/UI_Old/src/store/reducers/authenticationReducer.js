import * as actionTypes from '../actions/actionTypes';


export const initialState = {
    username: '',
    password: '',
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
  