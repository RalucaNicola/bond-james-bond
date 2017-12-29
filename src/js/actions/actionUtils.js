import * as types from './actionTypes';

export function viewReady() {
  return {
    type: types.VIEW_READY
  };
}

export function animationFinished() {
  return {
    type: types.ANIMATION_FINISHED
  };
}
