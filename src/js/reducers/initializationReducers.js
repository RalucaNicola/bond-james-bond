import {
  ANIMATION_FINISHED,
  VIEW_READY
} from '../actions/actionTypes';

export function viewReady (state = false, action) {
  return action.type !== VIEW_READY ? state : true;
}

export function animationFinished (state = false, action) {
  return action.type !== ANIMATION_FINISHED ? state : true;
}