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

export function visualizationChanged(mode) {
  return {
    type: types.VISUALIZATION_CHANGED,
    mode: mode
  };
}

export function selectionChanged(selection) {
  return {
    type: types.SELECTION_CHANGED,
    selection: selection
  };
}
