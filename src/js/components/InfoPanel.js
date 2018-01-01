import watch from 'redux-watch';
import Typed from 'typed.js';

require('../../style/info-panel.scss');

function startTyping(container, text, onComplete) {
  const typed = new Typed(container, {
    strings: [text],
    typeSpeed: 20,
    backSpeed: 0,
    fadeOut: true,
    backDelay: 1000,
    startDelay: 500,
    showCursor: false,
    smartBackspace: true,
    loop: false,
    onComplete: (self) => {
      onComplete();
    }
  });
}

function onMenuClick(menuItem, store) {
  console.log(store.getState());
}

function initializeMenu(container, store) {
  ['Movie', 'Actor'].forEach((item) => {
    let menuItem = document.createElement('li');
    menuItem.innerHTML = item;
    if (item === 'Movie') {
      menuItem.classList.add('info-selected');
    }
    menuItem.addEventListener('click', () => {
      onMenuClick(menuItem, store);
    });
    container.append(menuItem);
  });
}

export const InfoPanel = {
  init(store) {
    this.container = document.getElementById('info-panel');
    this.title = document.getElementById('info-title');
    this.menu = document.getElementById('info-menu');

    let viewReadyWatcher = watch(store.getState, 'initialization.viewReady');
    store.subscribe(viewReadyWatcher(() => {
      startTyping(this.title,
        `Visualize James Bond's travels based on:`,
        () => { initializeMenu(this.menu, store); }
      );
    }));
  }
};