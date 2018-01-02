import {
  VISUALIZATION_CHANGED,
  SELECTION_CHANGED
} from '../actions/actionTypes';

const defaultState = {
  mode: 'Movie',
  selection: null
};

export function visualizationReducer ( state = defaultState, action) {
  switch (action.type) {
    case VISUALIZATION_CHANGED:
      return Object.assign({}, state, {
        mode: action.mode,
        selection: null
      });

    case SELECTION_CHANGED:
      return Object.assign({}, state, {
        selection: action.selection
      });

    default:
      return state;
  }
}