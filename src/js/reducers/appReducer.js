import { combineReducers } from 'redux';

import {
  viewReady,
  animationFinished
} from './initializationReducers';

export default combineReducers({
  viewReady,
  animationFinished
});