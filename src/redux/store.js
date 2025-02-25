import { createStore } from 'redux';
import rootReducer from './reducers';

// Create store without middleware
const store = createStore(rootReducer);

export default store;