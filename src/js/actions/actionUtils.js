import * as types from './actionTypes';

export function viewReady(value) {
  return {
    type: types.VIEW_READY,
    value: value
  };
}

export function animationFinished() {
  return {
    type: types.ANIMATION_FINISHED
  };
}
