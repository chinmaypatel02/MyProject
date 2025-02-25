import {
    FETCH_EVENTS_REQUEST,
    FETCH_EVENTS_SUCCESS,
    FETCH_EVENTS_FAILURE
  } from '../types';
  
  // Initial state for events reducer
  const initialState = {
    events: [],
    loading: false,
    error: null
  };
  
  const eventsReducer = (state = initialState, action) => {
    console.log('Events reducer action:', action.type, action.payload);
    
    switch (action.type) {
      case FETCH_EVENTS_REQUEST:
        console.log('Setting loading state for events');
        return {
          ...state,
          loading: true,
          error: null
        };
        
      case FETCH_EVENTS_SUCCESS:
        console.log('Events fetch success. Events count:', 
          Array.isArray(action.payload) ? action.payload.length : 'Not an array');
        return {
          ...state,
          loading: false,
          events: action.payload || [],
          error: null
        };
        
      case FETCH_EVENTS_FAILURE:
        console.log('Events fetch failure:', action.payload);
        return {
          ...state,
          loading: false,
          error: action.payload
        };
        
      default:
        return state;
    }
  };
  
  export default eventsReducer;