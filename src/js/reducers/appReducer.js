import { combineReducers } from 'redux';

import { initializationReducer } from './initializationReducer';

export default combineReducers({
  initialization: initializationReducer
});