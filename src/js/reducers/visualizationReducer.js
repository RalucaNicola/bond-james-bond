import {
  VISUALIZATION_CHANGED
} from '../actions/actionTypes';

const defaultState = {
  mode: 'Actor',
  selectedActor: 'All'
};

export function visualizationReducer ( state = defaultState, action) {
  switch (action.type) {
    case VISUALIZATION_CHANGED:
      return Object.assign({}, state, {
        mode: action.value,
        selectedActor: action.data || defaultState.selectedActor
      });
    default:
      return state;
  }
}