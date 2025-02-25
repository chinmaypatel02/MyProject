import {
    LOGIN_REQUEST,
    LOGIN_SUCCESS,
    LOGIN_FAILURE,
    LOGOUT
  } from '../types';
  
  // Initial state for auth reducer
  const initialState = {
    user: null,
    token: null,
    isAuthenticated: false,
    loading: false,
    error: null
  };
  
  const authReducer = (state = initialState, action) => {
    switch (action.type) {
      case LOGIN_REQUEST:
        return {
          ...state,
          loading: true,
          error: null
        };
        
      case LOGIN_SUCCESS:
        return {
          ...state,
          loading: false,
          isAuthenticated: true,
          user: action.payload,
          token: action.payload.token,
          error: null
        };
        
      case LOGIN_FAILURE:
        return {
          ...state,
          loading: false,
          isAuthenticated: false,
          user: null,
          token: null,
          error: action.payload
        };
        
      case LOGOUT:
        return {
          ...initialState
        };
        
      default:
        return state;
    }
  };
  
  export default authReducer;