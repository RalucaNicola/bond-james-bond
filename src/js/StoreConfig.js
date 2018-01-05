/*
  this module creates a store that gets
  passed to all the components in main.js
*/

import { createStore } from 'redux';
import appReducer from './reducers/appReducer';


export default {
  init() {
    return createStore(appReducer);
  }
};