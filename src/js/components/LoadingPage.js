import {animationFinished} from '../actions/actionUtils';
import Typed from 'typed.js';
require('../../style/loading-page.scss');

export const LoadingPage = {

  init(store) {
    this.container = document.getElementById('loading-page');
    this.store = store;
    let animated = document.getElementById('circle1');
    animated.addEventListener('animationend', () => {
     store.dispatch(animationFinished());
    });

    store.subscribe(() => {
      this.typed = new Typed('#loading-message', {
        strings: ['Loading: webscene'],
        typeSpeed: 20,
        backSpeed: 0,
        fadeOut: true,
        backDelay: 1000,
        startDelay: 500,
        smartBackspace: true,
        loop: false
      });
    });
  },

  destroy() {
  }
};
