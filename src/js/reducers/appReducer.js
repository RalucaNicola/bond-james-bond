import { combineReducers } from 'redux';

import { initializationReducer } from './initializationReducer';
import { visualizationReducer } from './visualizationReducer';

export default combineReducers({
  initialization: initializationReducer,
  visualization: visualizationReducer
});