import {createStore} from 'redux';
import appReducer from './reducers/appReducer';

export const appStore = createStore(appReducer);