require('../../style/loading-page.scss');

const LoadingPage = {

  init(containerId) {
    this.container = document.getElementById(containerId);
  },

  destroy() {
  }
}

export default LoadingPage;