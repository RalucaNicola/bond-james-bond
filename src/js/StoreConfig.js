import {createStore} from 'redux';
import appReducer from './reducers/appReducer';


export const StoreConfig = {
  init() {
    return createStore(appReducer);
  }
};