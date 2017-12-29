import {
  ANIMATION_FINISHED,
  VIEW_READY
} from '../actions/actionTypes';

const defaultState = {
  viewReady: false,
  animationFinished: false
};

export function initializationReducer ( state = defaultState, action) {
  switch (action.type) {
    case VIEW_READY:
      return Object.assign({}, state, {
        viewReady: true
      });
    case ANIMATION_FINISHED:
      return Object.assign({}, state, {
        animationFinished: true
      });
    default:
      return state;
  }
}