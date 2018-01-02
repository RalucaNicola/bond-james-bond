import {
  VISUALIZATION_CHANGED
} from '../actions/actionTypes';

const defaultState = {
  mode: 'Actor',
  selection: null
};

export function visualizationReducer ( state = defaultState, action) {
  switch (action.type) {
    case VISUALIZATION_CHANGED:
      let selection = state.selection;
      if (action.data) {
        if (action.value === 'Actor') {
          selection = {
            selectedActor: action.data
          };
        }
        else if (action.value === 'Movie') {
          selection = {
            selectedMovie: action.data,
            animatingMovie: action.animatingMovie
          };
        }
      }
      return Object.assign({}, state, {
        mode: action.value,
        selection: selection
      });

    default:
      return state;
  }
}