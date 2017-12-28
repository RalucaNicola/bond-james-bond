import * as types from './action-types';

export function websceneLoaded(value) {
  return {
    type: types.WEBSCENE_LOADED,
    value: value
  };
}

export function animationFinished() {
  return {
    type: types.ANIMATION_FINISHED
  }
}
