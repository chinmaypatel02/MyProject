import { combineReducers } from 'redux';
import authReducer from './authReducers';
import eventsReducer from './eventReducers';

// Combine all reducers
const rootReducer = combineReducers({
  auth: authReducer,
  events: eventsReducer,
  // Add more reducers here as your app grows
});

export default rootReducer;