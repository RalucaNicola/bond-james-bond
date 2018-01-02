import { combineReducers } from 'redux';

import { initializationReducer } from './initializationReducer';
import { visualizationReducer } from './visualizationReducer';

export default combineReducers({
  initialization: initializationReducer,
  visualization: visualizationReducer
});


/*
state: {
  initialization: {
    animationFinished: true/false,
    viewReady: true/false
  },
  visualization: {
    mode: 'Actor'/'Movie',
    selection: 'none'/Object representing actor or movie
  }
}
*/