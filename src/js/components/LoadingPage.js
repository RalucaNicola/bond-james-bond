import {animationFinished} from '../actions/actionUtils';
require('../../style/loading-page.scss');

export const LoadingPage = {

  init: function(store) {
    this.container = document.getElementById('loading-page');
    this.store = store;
    let animated = document.getElementById('circle1');
    animated.addEventListener('animationend', () => {
     store.dispatch(animationFinished());
    });

    store.subscribe(function(){
      console.log(store.getState());
    });
  },

  destroy: function() {
  }
};
