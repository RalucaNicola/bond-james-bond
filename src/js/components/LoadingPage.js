require('../../style/loading-page.scss');

export const LoadingPage = {

  init: function() {
    this.container = document.getElementById('loading-page');
    let animated = document.getElementById('circle1');
    animated.addEventListener('animationend', () => {
     console.log('animation finished');
    })
  },

  destroy: function() {
  }
}
