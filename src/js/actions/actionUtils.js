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

export function visualizationChanged(value, data) {
  return {
    type: types.VISUALIZATION_CHANGED,
    value: value,
    data: data
  };
}
